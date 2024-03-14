import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PostPage() {
  const params = useParams();
  const [postInfo, setPostInfo] = useState({});

  useEffect(() => {
    async function getPost() {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/post/${params.id}`
      );
      const data = await res.json();
      console.log(data);
      setPostInfo(data);
    }
    getPost();
  }, []);

  return (
    <div className='post-image'>
      <div className='image'>
        <img
          src={`${process.env.REACT_APP_API_URL}/${postInfo.image}`}
          alt=''
        />
      </div>
      <h1>{postInfo.title}</h1>
      <p>{postInfo.summary}</p>
      <div dangerouslySetInnerHTML={{ __html: postInfo.content }} />
    </div>
  );
}
