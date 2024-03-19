import { format } from 'date-fns';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../components/UserContext.js';

export default function PostPage() {
  const params = useParams();
  const [postInfo, setPostInfo] = useState({});
  const { user } = useUser();

  useEffect(() => {
    async function getPost() {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/post/${params.id}`
      );
      const data = await res.json();
      console.log(data.createdAt);
      setPostInfo(data);
    }
    getPost();
  }, []);

  return (
    Object.keys(postInfo).length > 0 && (
      <div className='post-page'>
        <time>
          {format(new Date(postInfo.createdAt), 'MMM dd, yyyy HH:mm')}
        </time>
        <div className='post-page-author'>By: {postInfo.author.username}</div>
        {user.id === postInfo.author._id && (
          <div>
            <Link to={`/edit/${postInfo._id}`}>Edit</Link>
          </div>
        )}
        <div className='post-image'>
          <div className='image'>
            <img
              src={`${process.env.REACT_APP_API_URL}/${postInfo.image}`}
              alt=''
            />
          </div>
          <div
            className='post-content'
            dangerouslySetInnerHTML={{ __html: postInfo.content }}
          />
        </div>
      </div>
    )
  );
}
