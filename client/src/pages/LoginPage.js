import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext.js';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
      setRedirect(true);
    } else {
      alert('Inccorect username or password');
    }
  }

  if (redirect) {
    return <Navigate to='/' />;
  }
  return (
    <form className='login' onSubmit={handleLogin}>
      <h1>Login</h1>
      <input
        type='text'
        id='username'
        placeholder='username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type='password'
        id='password'
        placeholder='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className='submitbtn' type='submit'>
        Login
      </button>
    </form>
  );
}
