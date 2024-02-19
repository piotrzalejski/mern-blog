import TipTapEditor from '../components/EditorProvider.js';

export default function CreatePostPage() {
  return (
    <div>
      <h1>Create New Post</h1>
      <form>
        <input type='text' id='title' placeholder='Title' />
        <input type='text' id='summary' placeholder='Summary' />
        <input type='file' id='image' accept='image/*' />
        <TipTapEditor />
      </form>
    </div>
  );
}
