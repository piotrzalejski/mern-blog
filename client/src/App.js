import './App.css';
import Layout from './Layout.js';

import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import CreatePostPage from './pages/CreatePostPage.js';
import EditPostPage from './pages/EditPostPage.js';
import PostPage from './pages/PostPage.js';
import { UserContextProvider } from './components/UserContext.js';
import {
  ThemeContext,
  ThemeContextProvider,
} from './components/theme-context.js';

function App() {
  return (
    <ThemeContextProvider>
      <container classname='theme-container'>
        <UserContextProvider>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/create' element={<CreatePostPage />} />
              <Route path='/post/:id' element={<PostPage />} />
              <Route path='/edit/:id' element={<EditPostPage />} />
            </Route>
          </Routes>
        </UserContextProvider>
      </container>
    </ThemeContextProvider>
  );
}

export default App;
