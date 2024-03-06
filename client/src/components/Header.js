import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext.js';

export default function Header() {
  const { user, login, logout } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          login(data.user);
        } else if (res.status === 401) {
          const data = await res.json();
          console.error(data);
          logout();
        } else {
          throw new Error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <header className='loading'>Loading...</header>;
  }

  async function handleLogout() {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) {
      logout();
    } else {
      console.error('Error logging out');
    }
  }

  const isLoggedIn = !!user && Object.keys(user).length !== 0;

  return (
    <header>
      <Link to='/' className='logo'>
        My Blog
      </Link>
      <nav>
        {isLoggedIn && (
          <>
            <Link to='/create'>New Post</Link>
            <a onClick={handleLogout}>Logout</a>
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
