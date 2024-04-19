import './tiptapStyles.css';

import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import MenuBar from './EditorMenuBar.js';

const extensions = [
  StarterKit,
  Placeholder.configure({
    placeholder: 'Write something amazing...',
  }),
  Link.configure({ openOnClick: false, autolink: true }),
];

export default function TipTapEditor({ onUpdate, initContent = '' }) {
  return (
    <EditorProvider
      extensions={extensions}
      slotBefore={<MenuBar />}
      onUpdate={onUpdate}
      content={initContent}
    ></EditorProvider>
  );
}
