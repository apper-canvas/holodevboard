import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">404</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Page not found</p>
        <Link to="/" className="inline-block px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-700 transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;