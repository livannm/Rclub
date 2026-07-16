"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { isRichTextEmpty, toEditorHtml } from "@/lib/utils/rich-text-format";

type RichTextEditorFieldProps = {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
};

type ToolbarButtonProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function ToolbarButton({ label, active, disabled, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={`rich-text-editor__btn${active ? " is-active" : ""}`}
      aria-label={label}
      title={label}
      disabled={disabled}
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
      {label}
    </button>
  );
}

export function RichTextEditorField({
  id,
  name,
  label,
  defaultValue,
  required = false,
}: RichTextEditorFieldProps) {
  const [value, setValue] = useState(() => toEditorHtml(defaultValue));

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [3, 4],
        },
        code: false,
        codeBlock: false,
        horizontalRule: false,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        id,
        class: "rich-text-editor__content",
        "aria-label": label,
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      setValue(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextValue = toEditorHtml(defaultValue);
    const currentValue = editor.getHTML();
    if (nextValue !== currentValue) {
      editor.commands.setContent(nextValue, { emitUpdate: false });
      setValue(nextValue);
    }
  }, [defaultValue, editor]);

  const isEmpty = isRichTextEmpty(value);
  const submittedValue = isEmpty ? "" : value;

  return (
    <label htmlFor={id} className="full-span rich-text-editor-field">
      {label}
      <div className="rich-text-editor">
        <div className="rich-text-editor__toolbar" role="toolbar" aria-label={`${label} — mise en forme`}>
          <ToolbarButton
            label="Gras"
            active={editor?.isActive("bold") ?? false}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            label="Italique"
            active={editor?.isActive("italic") ?? false}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            label="Liste"
            active={editor?.isActive("bulletList") ?? false}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            label="Liste num."
            active={editor?.isActive("orderedList") ?? false}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          />
          <ToolbarButton
            label="Citation"
            active={editor?.isActive("blockquote") ?? false}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          />
        </div>
        <EditorContent editor={editor} />
      </div>
      <input type="hidden" name={name} value={submittedValue} required={required} />
    </label>
  );
}
