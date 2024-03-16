import { useEffect, useState } from 'react';
import TipTapEditor from '../components/EditorProvider.js';
import { Navigate, useParams } from 'react-router-dom';

export default function EditPost() {
  const params = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    async function getPost() {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/post/${params.id}`
      );
      const data = await res.json();
      console.log(data);
      setTitle(data.title);
      setSummary(data.summary);
      setContent(data.content);
    }
    getPost();
  }, [params.id]);

  function handleUpdate({ editor }) {
    // get HTML content of the editor
    setContent(editor.getHTML());
  }

  async function updatePost(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.set('title', title);
    formData.set('summary', summary);
    formData.set('content', content);
    formData.set('id', params.id);
    if (file?.length > 0) {
      formData.set('image', file?.[0]);
    }
    const res = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    });
    if (res.ok) {
      alert('Post updated successfully');
      setRedirect(true);
    } else {
      alert('Error creating post');
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${params.id}`} />;
  }

  return (
    <div>
      <h1>Edit Post</h1>
      <form onSubmit={updatePost}>
        <input
          type='text'
          id='title'
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type='text'
          id='summary'
          placeholder='Summary'
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />
        <input
          type='file'
          id='image'
          accept='image/*'
          onChange={(e) => setFile(e.target.files)}
        />
        {content && (
          <TipTapEditor onUpdate={handleUpdate} initContent={content} />
        )}
        <button type='submit' className='createbtn'>
          Update Post
        </button>
      </form>
    </div>
  );
}
