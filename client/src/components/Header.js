import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    console.log('fetching data');
    async function fetchData() {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
        credentials: 'include',
      });
      const data = await res.json();
      console.log(data);
      setUsername(data.username);
    }
    fetchData();
  }, []);
  return (
    <header>
      <Link to='/' className='logo'>
        My Blog
      </Link>
      <nav>
        {username && (
          <>
            <Link to='/new'>New Post</Link>
            <Link to='/logout'>Logout</Link>
          </>
        )}
        {!username && (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
