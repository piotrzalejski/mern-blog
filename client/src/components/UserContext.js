import { createContext, useContext } from 'react';
import { useState } from 'react';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser({});
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
