import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import { Dialog } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { 
  UserCircle, 
  Mail, 
  Lock,
  KeyRound,
  Shield,
  User,
  Settings
} from 'lucide-react';
import { updateProfile, updatePassword } from '../../utils/api';

interface ProfileFormData {
  name: string;
  email: string;
}

interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    current_password: '',
    new_password: '',
    confirm_new_password: ''
  });

  const [profileUpdateError, setProfileUpdateError] = useState<string | null>(null);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState<string | null>(null);
  const [passwordUpdateError, setPasswordUpdateError] = useState<string | null>(null);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/Login');
    } else {
      setProfileData({
        name: user.name,
        email: user.email
      });
    }
  }, [user, router]);

  const handleProfileUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileUpdateError(null);
    setProfileUpdateSuccess(null);

    try {
      const updatedUser = await updateProfile(profileData);
      setProfileUpdateSuccess('Profile updated successfully');
    } catch (error: any) {
      setProfileUpdateError(error.message || 'Failed to update profile');
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_new_password) {
      setPasswordUpdateError('New passwords do not match');
      return;
    }

    setIsPasswordLoading(true);
    setPasswordUpdateError(null);
    setPasswordUpdateSuccess(null);

    try {
      await updatePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      
      setPasswordUpdateSuccess('Password updated successfully');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_new_password: ''
      });
    } catch (error: any) {
      setPasswordUpdateError(error.message || 'Failed to update password');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleProfileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-blue-500 p-3 rounded-full">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="w-6 h-6 text-blue-500" />
              </div>
              <CardTitle>Profile Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              {profileUpdateError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                  {profileUpdateError}
                </div>
              )}
              {profileUpdateSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
                  {profileUpdateSuccess}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileInputChange}
                      className="pl-10"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileInputChange}
                      className="pl-10"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isProfileLoading}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {isProfileLoading ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Shield className="w-6 h-6 text-purple-500" />
                </div>
                <CardTitle>Security Settings</CardTitle>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <KeyRound className="w-4 h-4" />
                    <span>Change Password</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    {passwordUpdateError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
                        {passwordUpdateError}
                      </div>
                    )}
                    {passwordUpdateSuccess && (
                      <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md text-sm">
                        {passwordUpdateSuccess}
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Current Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          type="password"
                          name="current_password"
                          value={passwordData.current_password}
                          onChange={handlePasswordInputChange}
                          className="pl-10"
                          placeholder="Enter current password"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          type="password"
                          name="new_password"
                          value={passwordData.new_password}
                          onChange={handlePasswordInputChange}
                          className="pl-10"
                          placeholder="Enter new password"
                          minLength={6}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          type="password"
                          name="confirm_new_password"
                          value={passwordData.confirm_new_password}
                          onChange={handlePasswordInputChange}
                          className="pl-10"
                          placeholder="Confirm new password"
                          minLength={6}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="submit"
                        disabled={isPasswordLoading}
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        {isPasswordLoading ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">
              Secure your account with a strong password. We recommend using a combination of letters, numbers, and special characters.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}