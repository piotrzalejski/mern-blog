import './App.css';
import Layout from './Layout.js';

import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import CreatePostPage from './pages/CreatePostPage.js';
import { UserContextProvider } from './components/UserContext.js';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/create' element={<CreatePostPage />} />
          {/* <Route path="/post/:id" element={<PostPage />} /> */}
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
