export default function LoginPage() {
  return (
    <form className='login'>
      <h1>Login</h1>
      <input type='text' id='username' placeholder='username' />
      <input type='password' id='password' placeholder='password' />
      <button type='submit'>Login</button>
    </form>
  );
}
