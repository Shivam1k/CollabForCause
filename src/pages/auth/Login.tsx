import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/projects" />;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:space-x-16 items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome Back!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Sign in to continue your journey of making positive impact through collaboration.
            </p>
            <img 
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg" 
              alt="Collaboration" 
              className="rounded-lg shadow-md"
            />
          </div>
          
          <div className="md:w-1/2 w-full flex justify-center">
            <LoginForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;