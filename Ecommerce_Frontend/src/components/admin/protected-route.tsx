import React, { ReactNode } from 'react';
import { Route, Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
   isAuthenticated: boolean; // Indicates if the user is authenticated
    redirectPath?: string;    // Optional: Path to redirect if not authenticated
   //  children: ReactNode;      // The component(s) to render if authenticated
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({isAuthenticated,redirectPath,}) => {
   return isAuthenticated ? (
      redirectPath="/"
   ) : (
      <Navigate to={redirectPath || "/login"} />
   );
};

export default ProtectedRoute;