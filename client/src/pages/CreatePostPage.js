import { useState } from 'react';
import TipTapEditor from '../components/EditorProvider.js';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState('');

  function handleUpdate({ editor }) {
    // console.log('editor', editor.getHTML());
    setContent(editor.getHTML()); // get HTML content of the editor
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.set('title', title);
    formData.set('summary', summary);
    formData.set('content', content);
    // for sake of simplicity, we are using only one image
    formData.set('image', file[0]);
    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }
    const res = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
      method: 'POST',
      body: formData,
    });
    console.log(res);
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
        <input
          type='file'
          id='image'
          accept='image/*'
          onChange={(e) => setFile(e.target.files)}
        />
        <TipTapEditor onUpdate={handleUpdate} />
        <button type='submit' className='createbtn'>
          Create Post
        </button>
      </form>
    </div>
  );
}
