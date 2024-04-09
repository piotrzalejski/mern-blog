import { useTheme } from './theme-context.js';
import moon from '../icons/moon.svg';
import sun from '../icons/sun.svg';

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className='theme-toggle' onClick={toggleTheme}>
      {theme === 'dark' ? (
        <img src={moon} alt='dark mode' width={'20px'} height={'20px'} />
      ) : (
        <img src={sun} alt='light mode' width={'20px'} height={'20px'} />
      )}
    </button>
  );
}
