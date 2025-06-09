'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

type RenderRIchTextProps = {
  content: string;
};

const RenderRichText = ({ content }: RenderRIchTextProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: false,
  });
  return <EditorContent editor={editor} />;
};

export default RenderRichText;
