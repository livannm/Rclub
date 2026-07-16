import { formatRichTextForDisplay } from "@/lib/utils/rich-text";

type RichTextContentProps = {
  html: string;
  className?: string;
};

export function RichTextContent({ html, className }: RichTextContentProps) {
  const formatted = formatRichTextForDisplay(html);
  if (!formatted) {
    return null;
  }

  return (
    <div
      className={className ? `rich-text ${className}` : "rich-text"}
      dangerouslySetInnerHTML={{ __html: formatted }}
    />
  );
}
