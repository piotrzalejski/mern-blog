import { useState } from 'react';

export default function LoginPage() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch('http://localhost:4242/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, password }),
    });
    console.log(res);
  }

  return (
    <form className='login' onSubmit={handleLogin}>
      <h1>Login</h1>
      <input
        type='text'
        id='username'
        placeholder='username'
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type='password'
        id='password'
        placeholder='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type='submit'>Login</button>
    </form>
  );
}
