import './tiptapStyles.css';

import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import MenuBar from './EditorMenuBar.js';

const extensions = [
  StarterKit,
  Placeholder.configure({
    placeholder: 'Write something amazing...',
  }),
];

export default function TipTapEditor({ onUpdate }) {
  return (
    <EditorProvider
      extensions={extensions}
      slotBefore={<MenuBar />}
      onUpdate={onUpdate}
    ></EditorProvider>
  );
}
