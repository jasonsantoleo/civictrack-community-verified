// src/components/Auth.tsx
import { useState } from 'react';
import { supabase } from '../database/supabaseClient';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

type FormInputs = {
  email: string;
  password: string;
};

export const Auth = () => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

  const handleAuth: SubmitHandler<FormInputs> = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSigningUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      // THIS IS THE CORRECTED, TYPE-SAFE CATCH BLOCK
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center">
        {isSigningUp ? 'Create Account' : 'Sign In to CivicTrack'}
      </h1>
      <form onSubmit={handleSubmit(handleAuth)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input id="email" type="email" {...register("email", { required: "Email is required" })} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input id="password" type="password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Loading...' : (isSigningUp ? 'Sign Up' : 'Sign In')}
        </button>
      </form>
      {error && <p className="text-sm text-center text-red-600">{error}</p>}
      {message && <p className="text-sm text-center text-green-600">{message}</p>}
      <div className="text-sm text-center">
        <button onClick={() => setIsSigningUp(!isSigningUp)} className="font-medium text-indigo-600 hover:text-indigo-500">
          {isSigningUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};