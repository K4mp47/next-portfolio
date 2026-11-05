import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
const exports = {};
const source = readFileSync("components/ChatMarkdown.tsx", "utf8");
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.ReactJSX,
    esModuleInterop: true,
  },
}).outputText, { exports, require });

const render = (text) => renderToStaticMarkup(
  React.createElement(exports.ChatMarkdown, null, text),
);

test("renders the assistant's paragraphs, bold labels, lists, links, and code", () => {
  const html = render("Hello!\n\n* **Portfolio Website Content:** Crafting sections.\n* **Biographies:** Writing summaries.\n\n[Contact](https://example.com) and `code`.\n\n```js\nconst x = 1;\n```");
  assert.match(html, /<p>Hello!<\/p>/);
  assert.match(html, /<ul>/);
  assert.equal((html.match(/<li>/g) || []).length, 2);
  assert.match(html, /<strong>Portfolio Website Content:<\/strong>/);
  assert.match(html, /href="https:\/\/example.com"/);
  assert.match(html, /<code>code<\/code>/);
  assert.match(html, /<pre><code class="language-js">/);
});

test("does not render raw HTML, remote images, or executable link URLs", () => {
  const html = render('<script>alert(1)</script>\n\n<img src="https://example.com/tracker">\n\n![tracking](https://example.com/image)\n\n[click](javascript:alert%281%29)');
  assert.doesNotMatch(html, /<script|<img|href="javascript:/);
});
