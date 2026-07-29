import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined || context === null) {
    throw new Error('useAuth must be used within an AuthProvider component');
  }
  
  return context;
};