import Markdown from "react-markdown";

export function ChatMarkdown({ children }: { children: string }) {
  return (
    <div className="chat-markdown">
      <Markdown skipHtml disallowedElements={["img"]}>{children}</Markdown>
    </div>
  );
}
