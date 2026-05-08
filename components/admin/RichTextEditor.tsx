"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, ImageIcon, Undo, Redo, Code,
  Pilcrow
} from "lucide-react";
import toast from "react-hot-toast";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        const loadingToast = toast.loading("Uploading image...");
        try {
          const url = await uploadToCloudinary(file);
          editor.chain().focus().setImage({ src: url }).run();
          toast.success("Image uploaded", { id: loadingToast });
        } catch (e) {
          toast.error("Failed to upload image", { id: loadingToast });
        }
      }
    };
    input.click();
  };

  const ActionButton = ({ onClick, isActive, icon: Icon, title }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
        isActive 
          ? "bg-[#e3791d] text-white" 
          : "text-slate-400 hover:text-white hover:bg-[#2a2a45]"
      }`}
    >
      <Icon size={16} />
    </button>
  );

  const applyHeading = (level: 1 | 2 | 3) => {
    if (!editor) return;
    const { from, to, empty } = editor.state.selection;
    
    if (!empty) {
      const $from = editor.state.selection.$from;
      const $to = editor.state.selection.$to;
      
      // If selection is within a single block node and doesn't cover the whole text
      if ($from.parent === $to.parent) {
        const textLen = $from.parent.textContent.length;
        const isWholeNode = $from.parentOffset === 0 && $to.parentOffset === textLen;
        
        if (!isWholeNode) {
          const selectedText = editor.state.doc.textBetween(from, to, ' ');
          editor.chain().focus()
            .deleteSelection()
            .insertContent({
              type: 'heading',
              attrs: { level },
              content: [{ type: 'text', text: selectedText }]
            })
            .run();
          return;
        }
      }
    }
    
    // Default fallback
    editor.chain().focus().toggleHeading({ level }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[#1a1a35] bg-[#0f0f22] rounded-t-xl sticky top-0 z-10">
      <ActionButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        icon={Bold}
        title="Bold"
      />
      <ActionButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        icon={Italic}
        title="Italic"
      />
      <ActionButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        icon={Strikethrough}
        title="Strikethrough"
      />
      <ActionButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        icon={Code}
        title="Inline Code"
      />
      
      <div className="w-[1px] h-6 bg-[#2a2a45] mx-1" />
      
      <ActionButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive("paragraph")}
        icon={Pilcrow}
        title="Normal Text (Paragraph)"
      />
      <ActionButton
        onClick={() => applyHeading(1)}
        isActive={editor.isActive("heading", { level: 1 })}
        icon={Heading1}
        title="Heading 1"
      />
      <ActionButton
        onClick={() => applyHeading(2)}
        isActive={editor.isActive("heading", { level: 2 })}
        icon={Heading2}
        title="Heading 2"
      />
      <ActionButton
        onClick={() => applyHeading(3)}
        isActive={editor.isActive("heading", { level: 3 })}
        icon={Heading3}
        title="Heading 3"
      />

      <div className="w-[1px] h-6 bg-[#2a2a45] mx-1" />

      <ActionButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        icon={List}
        title="Bullet List"
      />
      <ActionButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        icon={ListOrdered}
        title="Numbered List"
      />
      <ActionButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        icon={Quote}
        title="Blockquote"
      />
      
      <div className="w-[1px] h-6 bg-[#2a2a45] mx-1" />

      <ActionButton
        onClick={addImage}
        isActive={false}
        icon={ImageIcon}
        title="Insert Image"
      />

      <div className="w-[1px] h-6 bg-[#2a2a45] mx-1" />

      <ActionButton
        onClick={() => editor.chain().focus().undo().run()}
        isActive={false}
        icon={Undo}
        title="Undo"
      />
      <ActionButton
        onClick={() => editor.chain().focus().redo().run()}
        isActive={false}
        icon={Redo}
        title="Redo"
      />
    </div>
  );
};

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-orange max-w-none min-h-[400px] p-4 lg:p-6 focus:outline-none",
      },
    },
  });

  return (
    <div className="border border-[#1a1a35] rounded-xl bg-[#080818] overflow-hidden flex flex-col">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto max-h-[700px] custom-scrollbar">
        <EditorContent editor={editor} />
      </div>
      
      {/* Add custom CSS to style the editor content inline without relying heavily on tailwind typography, 
          or just styling specifically for Tiptap elements inside prose */}
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #64748b;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }
        .ProseMirror h1 {
          font-size: 2.25rem;
          line-height: 2.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .ProseMirror h2 {
          font-size: 1.875rem;
          line-height: 2.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .ProseMirror h3 {
          font-size: 1.5rem;
          line-height: 2rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror blockquote {
          border-left-width: 4px;
          border-color: #e3791d;
          padding-left: 1rem;
          font-style: italic;
          color: #94a3b8;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        .ProseMirror code {
          background-color: #1e293b;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        .ProseMirror pre {
          background-color: #0f172a;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
        }
        .ProseMirror pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }
      `}</style>
    </div>
  );
}
