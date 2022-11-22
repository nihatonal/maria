import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  user:null,
  login: () => {},
  logout: () => {}
});
