import { format } from 'date-fns';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../components/UserContext.js';
import Metadata from '../components/Metadata.js';

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
      setPostInfo(data);
    }
    getPost();
  }, []);

  return (
    Object.keys(postInfo).length > 0 && (
      <section className='post--section'>
        <Metadata title={postInfo.title} description={postInfo.summary} />
        <div className='postpage--image-wrap'>
          {postInfo.image && postInfo.image !== null ? (
            <img
              className='postpage--image'
              src={`${process.env.REACT_APP_API_URL}/${postInfo.image}`}
              alt=''
              width={1500}
              height={726}
            />
          ) : (
            <div className='postpage--gradient' width={1500} height={726}></div>
          )}
        </div>
        <container className='postpage--container'>
          <div className='post-container'>
            <header className='postpage--header'>
              <time>
                {format(new Date(postInfo.createdAt), 'MMM dd, yyyy HH:mm')}
              </time>

              <h1 className='postpage--title'>{postInfo.title}</h1>

              {user?.id === postInfo.author._id && (
                <div>
                  <Link to={`/edit/${postInfo._id}`}>Edit</Link>
                </div>
              )}
              <div className='postpage--author'>
                By {postInfo.author.username}
              </div>
              <hr className='postpage--divider' />
            </header>
            <article
              className='postpage--content'
              dangerouslySetInnerHTML={{ __html: postInfo.content }}
            />
          </div>
        </container>
      </section>
    )
  );
}
