import { Bold, Heading1, Heading2, Heading3, Italic } from 'lucide-react';
import React from 'react';
import { Toggle } from './ui/toggle';
import { Editor } from '@tiptap/react';

const MenuBarRichText = ({ editor }: { editor: Editor | null }) => {
  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor?.isActive('heading', { level: 1 }),
    },
    {
      icon: <Heading2 />,
      onClick: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor?.isActive('heading', { level: 2 }),
    },
    {
      icon: <Heading3 />,
      onClick: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor?.isActive('heading', { level: 3 }),
    },
    {
      icon: <Bold />,
      onClick: () => editor?.chain().focus().toggleBold().run(),
      pressed: editor?.isActive('bold'),
    },
    {
      icon: <Italic />,
      onClick: () => editor?.chain().focus().toggleItalic().run(),
      pressed: editor?.isActive('italic'),
    },
  ];
  return (
    <div className="border rounded-md p-1 bg-muted space-x-2 z-50">
      {Options.map((option, i) => (
        <Toggle
          key={i}
          pressed={option.pressed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
};

export default MenuBarRichText;

// return (
//     <div className="border rounded-md p-2 bg-muted ">
//       <div className="flex gap-2 items-center">
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 1 }).run()
//           }
//           className={
//             editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
//           }
//         >
//           H1
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 2 }).run()
//           }
//           className={
//             editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
//           }
//         >
//           H2
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 3 }).run()
//           }
//           className={
//             editor.isActive('heading', { level: 3 }) ? 'is-active' : ''
//           }
//         >
//           H3
//         </button>
//         <button
//           onClick={() => editor.chain().focus().setParagraph().run()}
//           className={editor.isActive('paragraph') ? 'is-active' : ''}
//         >
//           Paragraph
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           className={editor.isActive('bold') ? 'is-active' : ''}
//         >
//           Bold
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           className={editor.isActive('italic') ? 'is-active' : ''}
//         >
//           Italic
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleStrike().run()}
//           className={editor.isActive('strike') ? 'is-active' : ''}
//         >
//           Strike
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleHighlight().run()}
//           className={editor.isActive('highlight') ? 'is-active' : ''}
//         >
//           Highlight
//         </button>
//         <button
//           onClick={() => editor.chain().focus().setTextAlign('left').run()}
//           className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
//         >
//           Left
//         </button>
//         <button
//           onClick={() => editor.chain().focus().setTextAlign('center').run()}
//           className={
//             editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''
//           }
//         >
//           Center
//         </button>
//         <button
//           onClick={() => editor.chain().focus().setTextAlign('right').run()}
//           className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
//         >
//           Right
//         </button>
//         <button
//           onClick={() => editor.chain().focus().setTextAlign('justify').run()}
//           className={
//             editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''
//           }
//         >
//           Justify
//         </button>
//       </div>
//     </div>
//   );
