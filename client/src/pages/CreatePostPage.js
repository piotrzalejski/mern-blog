import { useState } from 'react';
import TipTapEditor from '../components/EditorProvider.js';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');

  function handleUpdate({ editor }) {
    // console.log('editor', editor.getHTML());
    setContent(editor.getHTML()); // get HTML content of the editor
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('content', content);
    // for sake of simplicity, we are using only one image
    formData.append('image', event.target.image.files[0]);

    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }
  }

  return (
    <div>
      <h1>Create New Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          id='title'
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type='text'
          id='summary'
          placeholder='Summary'
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <input type='file' id='image' accept='image/*' />
        <TipTapEditor onUpdate={handleUpdate} />
        <button type='submit' className='createbtn'>
          Create Post
        </button>
      </form>
    </div>
  );
}
