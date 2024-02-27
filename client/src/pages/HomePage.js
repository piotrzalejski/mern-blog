import { useEffect, useState } from 'react';
import Post from '../components/Post.js';

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/posts`);
      const posts = await res.json();
      console.log('useEffect homepage: ', posts);
      setPosts(posts);
    }
    fetchPosts();
  }, []);
  return (
    <>
      {posts.length > 0 &&
        posts.map((post) => {
          const author = post.author ? post.author.username : 'Unknown';
          return (
            <Post
              key={post._id}
              _id={post._id}
              title={post.title}
              summary={post.summary}
              createdAt={post.createdAt}
              author={author}
              image={`${process.env.REACT_APP_API_URL}/${post.image}`}
            />
          );
        })}
      {posts.length === 0 && <p>No posts found</p>}
    </>
  );
}
