import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function PostPage() {
  const params = useParams();

  useEffect(() => {
    async function getPost() {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/posts/${params.id}`
      );
      const data = await res.json();
      console.log(data);
    }
    getPost();
  }, []);

  return (
    <div>
      <h1>Post Page</h1>
      <p>This is the post page. You can edit your post here.</p>
    </div>
  );
}
