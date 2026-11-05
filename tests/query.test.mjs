import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync("netlify/functions/query.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;

function loadQuery(chunks, apiKey = "test-key") {
  let request;
  const logs = [];
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    process: { env: { OPENROUTER_API_KEY: apiKey } },
    console: { info: (...args) => logs.push(args), error() {} },
    require(name) {
      assert.equal(name, "@openrouter/sdk");
      return {
        OpenRouter: class {
          constructor(options) {
            assert.equal(options.apiKey, "test-key");
          }
          chat = {
            send: async (options) => {
              request = options.chatRequest;
              return (async function* () {
                for (const chunk of chunks) {
                  if (chunk instanceof Error) throw chunk;
                  yield chunk;
                }
              })();
            },
          };
        },
      };
    },
  });
  return { query: exports.queryIntelligence, request: () => request, logs };
}

test("collects streamed text, preserves profile, and logs final usage", async () => {
  const context = loadQuery([
    { choices: [{ delta: { content: "Hello" } }] },
    { choices: [{ delta: { content: " there" } }] },
    { choices: [], usage: { completionTokensDetails: { reasoningTokens: 12 } } },
  ]);
  assert.match(source, /^"use server";/);
  assert.equal(await context.query("  Who is Alberto?  "), "Hello there");
  assert.equal(context.request().model, "openrouter/free");
  assert.equal(context.request().stream, true);
  assert.equal(context.request().messages[0].role, "system");
  assert.match(context.request().messages[0].content, /Alberto Campagnolo/);
  assert.equal(context.request().messages[1].content, "Who is Alberto?");
  assert.equal(context.logs[0][1], 12);
});

test("rejects invalid prompts before contacting the provider", async () => {
  const context = loadQuery([]);
  for (const prompt of [null, "   ", "x".repeat(4001)]) {
    assert.match(await context.query(prompt), /4,000 characters/);
  }
  assert.equal(context.request(), undefined);
});

test("handles empty output, stream failures, and missing credentials", async () => {
  assert.match(await loadQuery([]).query("Hello"), /Connection interrupted/);
  assert.match(await loadQuery([new Error("Disconnected")]).query("Hello"), /Uplink unstable/);
  const missing = loadQuery([], "");
  assert.match(await missing.query("Hello"), /Uplink unstable/);
  assert.equal(missing.request(), undefined);
});
