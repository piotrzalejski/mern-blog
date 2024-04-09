import { useState } from 'react';
import Layout from '../Layout.js';
import Metadata from '../components/Metadata.js';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister(e) {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const errRes = await res.json();
      alert('Error registering user: ' + JSON.stringify(errRes));
      return;
    }
    alert(await res.json());
  }

  return (
    <>
      <Metadata
        title={'Register'}
        description={'Please register to continue'}
      />
      <form className='register' onSubmit={handleRegister}>
        <h1>Register</h1>
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
        <button className='registerbtn' type='submit'>
          Register
        </button>
      </form>
    </>
  );
}
