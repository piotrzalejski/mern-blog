import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext.js';

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //console.log('fetching data');
    async function fetchData() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
          credentials: 'include',
        });
        if (!res.ok) {
          setUser(null);
          throw new Error('Not logged in');
        }
        const data = await res.json();
        console.log(data);
        setUser(data.username);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <header className='loading'>Loading...</header>;
  }

  async function logout() {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) {
      setUser(null);
    } else {
      console.error('Error logging out');
    }
  }

  const isLoggedIn = user !== null && user !== undefined;

  return (
    <header>
      <Link to='/' className='logo'>
        My Blog
      </Link>
      <nav>
        {isLoggedIn && (
          <>
            <Link to='/create'>New Post</Link>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!isLoggedIn && (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
