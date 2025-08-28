import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../ui/button';
import { FcGoogle } from 'react-icons/fc';
import { LogInIcon } from 'lucide-react';

const CustomAuth = () => {
  const { loginWithPopup, isAuthenticated, user } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await loginWithPopup();
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="text-center text-white">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent mb-8">
            Safar
          </h1>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold mb-4">
            Welcome back, {user.given_name || user.nickname}!
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8">
            You're successfully logged in to Safar
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="text-lg md:text-xl px-8 py-4 h-auto bg-blue-600 hover:bg-blue-700"
          >
            Continue to Safar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="max-w-md w-full mx-4 text-center">
        {/* Large Safar Brand */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent mb-4">
            Safar
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-medium">
            Your trusted trip planner and adventure guide
          </p>
        </div>

        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Welcome
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300">
            Log in to Safar to continue your journey
          </p>
        </div>

        {/* Sign In Button */}
        <div className="mb-8">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full text-lg md:text-xl px-8 py-4 h-auto bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <>
                <FcGoogle className="h-6 w-6" />
                Sign In with Google
              </>
            )}
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-gray-400 text-sm md:text-base">
          <p>Secure authentication powered by Google</p>
          <p className="mt-2">No password required</p>
        </div>
      </div>
    </div>
  );
};

export default CustomAuth;
