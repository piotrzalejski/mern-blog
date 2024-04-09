import Header from './components/Header.js';
import { Outlet } from 'react-router-dom';
import Metadata from './components/Metadata.js';

export default function Layout({ title, description }) {
  return (
    <div className='layout'>
      <Metadata title={title} description={description} />
      <Header />
      <main>
        {/* outlet serves a placeholder element where matched route component is inserted */}
        <Outlet />
      </main>
    </div>
  );
}
