import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../components/UserContext.js';
import Layout from '../Layout.js';
import Metadata from '../components/Metadata.js';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { login } = useUser();

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
      console.log('data:', data);
      login(data.user);
      setRedirect(true);
    } else {
      alert('Inccorect username or password');
    }
  }

  if (redirect) {
    return <Navigate to='/' />;
  }
  return (
    <>
      <Metadata title={'Login'} description={'Please login to continue'} />
      <form className='login' onSubmit={handleLogin}>
        <h1>Login</h1>
        <input
          className='lr_input'
          type='text'
          id='username'
          placeholder='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className='lr_input'
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
    </>
  );
}
