'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';

interface editorProps {
  noteId?: string;
}

function Editor({ noteId }: editorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing your note...',
      }),
    ],
    immediatelyRender: false,
    autofocus: 'end',
  });
  return (
    <EditorContent className={'text-editor-text p-7 lg:p-12 min-h-screen w-full'} editor={editor} />
  );
}

export default Editor;
