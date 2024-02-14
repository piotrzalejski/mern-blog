import './App.css';
import Layout from './Layout.js';

import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}

export default App;
