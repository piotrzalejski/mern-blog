import { createContext, useContext } from 'react';
import { useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser != 'undefined') {
      return JSON.parse(storedUser);
    } else {
      localStorage.removeItem('user');
      return;
    }
  });

  // // add event listener to remove user from local storage when the window is closed
  useEffect(() => {
    const beforeUnloadHandler = () => {
      localStorage.removeItem('user');
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null); // or setUser({}) if you prefer an empty object
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
