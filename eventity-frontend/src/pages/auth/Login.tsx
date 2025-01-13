import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { LoaderCircle } from "lucide-react";
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import { AxiosError } from 'axios';

type LoginForm = {
  email: string;
  password: string;
};

type ErrorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
};

const ErrorModal = ({ isOpen, onClose, errorMessage }: ErrorModalProps) => (
  <AlertDialog open={isOpen} onOpenChange={onClose}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Login Failed</AlertDialogTitle>
        <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={onClose}>Try Again</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default function Login() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginForm>();
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleErrorModalClose = () => {
    setIsErrorModalOpen(false);
    reset({ password: '' }); // Clear only the password field
  };

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);

    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        const errorData = error.response?.data;
    
        if (statusCode === 401) {
          // Untuk response 'Invalid credentials'
          setErrorMessage('Email atau password salah. Silakan coba lagi.');
        } else if (statusCode === 422) {
          // Untuk validation errors
          if (errorData.errors) {
            // Jika ada multiple validation errors, gabungkan pesannya
            const errorMessages = Object.values(errorData.errors).flat();
            setErrorMessage(errorMessages.join('\n'));
          } else {
            setErrorMessage(errorData.message || 'Data yang dimasukkan tidak valid.');
          }
        } else {
          setErrorMessage(errorData?.message || 'Terjadi kesalahan. Silakan coba lagi.');
        }
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Terjadi kesalahan yang tidak diketahui.');
      }
      
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to continue to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Invalid email address'
                  }
                })}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/auth/Register"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign up
              </Link>
            </span>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center"
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center"
              >
                <FaGithub className="mr-2 h-5 w-5" />
                GitHub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={handleErrorModalClose}
        errorMessage={errorMessage}
      />
    </div>
  );
}