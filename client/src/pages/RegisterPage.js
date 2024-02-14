export default function RegisterPage() {
  return (
    <form className='register'>
      <h1>Register</h1>
      <input type='text' id='username' placeholder='username' />
      <input type='password' id='password' placeholder='password' />
      <button type='submit'>Register</button>
    </form>
  );
}
