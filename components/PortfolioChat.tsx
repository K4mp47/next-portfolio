"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Blobatar } from "@blobatar/react";
import { useGaze } from "@blobatar/react/gaze";
import { ArrowUp, LoaderCircle, X } from "lucide-react";
import { queryIntelligence } from "@/netlify/functions/query";
import type { ChatMessage } from "@/types";
import { ChatMarkdown } from "@/components/ChatMarkdown";
import { Button } from "@/components/ui/button";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Message, MessageContent, MessageHeader } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

export function PortfolioChat() {
  const { ref: blobatarRef, remeasure } = useGaze({ travel: 12, lookAt: "pointer" });
  const [blobatarName, setBlobatarName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pending = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Generate the seed after hydration before revealing the avatar.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBlobatarName(crypto.randomUUID());
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || pending.current) return;

    pending.current = true;
    setIsLoading(true);
    setInput("");
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", text, timestamp: new Date() },
    ]);

    let responseText: string;
    try {
      responseText = await queryIntelligence(text);
    } catch (error) {
      console.error("Portfolio chat failed:", error);
      responseText = "Unable to reach the assistant. Please try again or use the contact form below.";
    }

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "model",
        text: responseText,
        timestamp: new Date(),
      },
    ]);
    pending.current = false;
    setIsLoading(false);
  };

  if (!blobatarName) return null;

  return (
    <div
      className="portfolio-chat dark fixed right-[max(0.6rem,env(safe-area-inset-right))] bottom-[max(0.6rem,env(safe-area-inset-bottom))] z-40 animate-in fade-in slide-in-from-bottom-3 duration-300 motion-reduce:animate-none"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) remeasure();
      }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          ref={launcherRef}
          className="flex size-14 lg:size-20 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={open ? "Close portfolio assistant" : "Open portfolio assistant"}
        >
          <Blobatar ref={blobatarRef} name={blobatarName} animate="always" size={56} className="size-full" />
        </PopoverTrigger>

        <PopoverContent
          className="portfolio-chat dark h-[min(560px,calc(100dvh-7rem-env(safe-area-inset-bottom)))] w-[min(400px,calc(100vw-2rem-env(safe-area-inset-left)-env(safe-area-inset-right)))] gap-0 overflow-hidden p-0 motion-reduce:animate-none motion-reduce:transition-none"
          side="top"
          align="end"
          sideOffset={12}
          initialFocus={inputRef}
          finalFocus={launcherRef}
        >
          <header className="flex shrink-0 items-center justify-between gap-3 p-4">
            <div className="flex min-w-0 flex-col gap-1">
              <PopoverTitle>Portfolio Assistant</PopoverTitle>
              <PopoverDescription>Ask about my skills, projects, or availability.</PopoverDescription>
            </div>
            <Button variant="ghost" size="icon" aria-label="Close chat" onClick={() => setOpen(false)}>
              <X />
            </Button>
          </header>

          <MessageScrollerProvider autoScroll>
            <MessageScroller className="flex-1">
              <MessageScrollerViewport>
                <MessageScrollerContent className="gap-4 p-4" role="log" aria-label="Chat messages" aria-live="polite" aria-relevant="additions text">
                  <MessageScrollerItem messageId="greeting">
                    <Message>
                      <MessageContent>
                        <MessageHeader>Assistant</MessageHeader>
                        <Bubble variant="secondary">
                          <BubbleContent>Hello! Ask me about my experience with React, Next.js, or cloud infrastructure.</BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                  {messages.map((message) => {
                    const align = message.role === "user" ? "end" : "start";
                    return (
                      <MessageScrollerItem key={message.id} messageId={message.id} scrollAnchor={message.role === "user"}>
                        <Message align={align}>
                          <MessageContent>
                            <MessageHeader>{message.role === "user" ? "You" : "Assistant"}</MessageHeader>
                            <Bubble align={align} variant={message.role === "user" ? "default" : "secondary"}>
                              <BubbleContent className="[overflow-wrap:anywhere]">
                                {message.role === "user" ? (
                                  <span className="whitespace-pre-wrap">{message.text}</span>
                                ) : (
                                  <ChatMarkdown>{message.text}</ChatMarkdown>
                                )}
                              </BubbleContent>
                            </Bubble>
                          </MessageContent>
                        </Message>
                      </MessageScrollerItem>
                    );
                  })}
                  {isLoading && (
                    <MessageScrollerItem messageId="thinking">
                      <Message>
                        <MessageContent>
                          <MessageHeader>Assistant</MessageHeader>
                          <Bubble variant="secondary">
                            <BubbleContent>
                              <div role="status" className="flex items-center gap-2 text-muted-foreground">
                                <LoaderCircle aria-hidden="true" className="size-4 shrink-0 motion-safe:animate-spin" />
                                <span>Preparing a response…</span>
                              </div>
                            </BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  )}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>

          <form onSubmit={handleSubmit} className="shrink-0 p-3">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="portfolio-chat-prompt" className="sr-only">Your question</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    ref={inputRef}
                    id="portfolio-chat-prompt"
                    placeholder="Ask a question…"
                    value={input}
                    rows={2}
                    className="max-h-32 min-h-16"
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                  />
                  <InputGroupAddon align="block-end" className="justify-end">
                    <InputGroupButton type="submit" variant="default" size="icon-sm" aria-label="Send message" disabled={isLoading || !input.trim()}>
                      <ArrowUp />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </FieldGroup>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
}
