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

  function logout() {
    fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setUsername('');
  }

  return (
    <header>
      <Link to='/' className='logo'>
        My Blog
      </Link>
      <nav>
        {username && (
          <>
            <Link to='/new'>New Post</Link>
            <a onClick={logout}>Logout</a>
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
