'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { ScrollArea } from './ui/scroll-area';
import MenuBarRichText from './MenuBarRichText';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const RitchTextEditor = ({ value, onChange }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Optional: sync value on initial load
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);
  return (
    <div className="space-y-2">
      <MenuBarRichText editor={editor} />

      <ScrollArea className="h-[600px] rounded-md border ">
        <EditorContent
          className="h-full bg-background p-2 min-h-[600px] *:min-h-[600px] *:"
          editor={editor}
        />
      </ScrollArea>
    </div>
  );
};

export default RitchTextEditor;
