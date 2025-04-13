'use client'
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Definición de tipo para el usuario
interface User {
  name: string;
  email?: string;
  role?: string;
}

// Definición del contexto
interface DashboardContextType {
  currentTitle: string;
  setCurrentTitle: (title: string) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
}

// Creación del contexto
const DashboardContext = createContext<DashboardContextType>({
  currentTitle: 'Inicio',
  setCurrentTitle: () => {},
  currentUser: { name: 'Usuario' },
  setCurrentUser: () => {}
});

// Hook personalizado para usar el contexto
export const useDashboard = () => useContext(DashboardContext);

// Proveedor del contexto
export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [currentTitle, setCurrentTitle] = useState('Inicio');
  const [currentUser, setCurrentUser] = useState<User>({ 
    name: 'Miguel Fajardo', 
    email: 'miguel@ejemplo.com',
    role: 'estudiante'
  });

  // Puedes añadir lógica para recuperar el usuario de la sesión aquí
  useEffect(() => {
    // Ejemplo de cómo podrías obtener el usuario de la sesión
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data', error);
      }
    }
  }, []);

  return (
    <DashboardContext.Provider value={{ 
      currentTitle, 
      setCurrentTitle, 
      currentUser, 
      setCurrentUser 
    }}>
      {children}
    </DashboardContext.Provider>
  );
};