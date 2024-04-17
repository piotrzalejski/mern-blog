import { useEffect, useState } from 'react';
import Post from '../components/Post.js';
import Metadata from '../components/Metadata.js';

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/posts`);
      const posts = await res.json();
      // console.log('useEffect homepage: ', posts);
      setPosts(posts);
    }
    fetchPosts();
  }, []);
  return (
    <>
      <Metadata
        title='My Blog - Homepage'
        description='Welcome to my homepage'
      />
      <ul className='--ul-homepage'>
        {posts.length > 0 &&
          posts.map((post) => {
            const author = post.author ? post.author.username : 'Unknown';
            const image = post.image
              ? `${process.env.REACT_APP_API_URL}/${post.image}`
              : null;
            return (
              <li>
                <article className='post-article'>
                  <Post
                    key={post._id}
                    id={post._id}
                    title={post.title}
                    summary={post.summary}
                    createdAt={post.createdAt}
                    author={author}
                    image={image}
                  />
                </article>
              </li>
            );
          })}
        {posts.length === 0 && <p>No posts found</p>}
      </ul>
    </>
  );
}
