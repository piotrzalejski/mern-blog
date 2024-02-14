import Header from './components/Header.js';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <main>
      <Header />
      {/* outlet serves a placeholder element where matched route component is inserted */}
      <Outlet />
    </main>
  );
}
