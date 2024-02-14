import { useState } from 'react';

export default function RegisterPage() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister(e) {
    e.preventDefault();
    const res = await fetch('http://localhost:4242/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, password }),
    });
    if (!res.ok) {
      console.error('Error:', res);
      alert('Error registering user');
      return;
    }
    alert(await res.json());
  }

  return (
    <form className='register' onSubmit={handleRegister}>
      <h1>Register</h1>
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
      <button type='submit'>Register</button>
    </form>
  );
}
