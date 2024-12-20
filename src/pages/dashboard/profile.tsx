// File: /src/pages/dashboard/profile.tsx
import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import { FiUser, FiMail, FiLock, FiEdit2 } from 'react-icons/fi';
import { updateProfile, updatePassword } from '../../utils/api';
import Link from 'next/link';

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

  // Profile Form State
  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: '',
    email: ''
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    current_password: '',
    new_password: '',
    confirm_new_password: ''
  });

  // Form Submission States
  const [profileUpdateError, setProfileUpdateError] = useState<string | null>(null);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState<string | null>(null);
  const [passwordUpdateError, setPasswordUpdateError] = useState<string | null>(null);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState<string | null>(null);

  // Loading States
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Redirect if no user
  useEffect(() => {
    if (!user) {
      router.push('/auth/Login');
    } else {
      // Initialize profile data with current user info
      setProfileData({
        name: user.name,
        email: user.email
      });
    }
  }, [user, router]);

  // Profile Update Handler
  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileUpdateError(null);
    setProfileUpdateSuccess(null);

    try {
      const updatedUser = await updateProfile(profileData);
      setProfileUpdateSuccess('Profile updated successfully');
      // Optionally update user in context if your AuthContext supports this
    } catch (error: any) {
      setProfileUpdateError(error.message || 'Failed to update profile');
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Password Update Handler
  const handlePasswordUpdate = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate password match
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
      // Clear password fields after successful update
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Information Section */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiUser className="mr-2" /> Profile Information
            </h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-4">
                {profileUpdateError && (
                  <div className="bg-red-100 text-red-700 p-3 rounded-md">
                    {profileUpdateError}
                  </div>
                )}
                {profileUpdateSuccess && (
                  <div className="bg-green-100 text-green-700 p-3 rounded-md">
                    {profileUpdateSuccess}
                  </div>
                )}
                
                <div>
                  <label className="block text-gray-700 mb-2">Name</label>
                  <div className="flex items-center border rounded-md">
                    <FiUser className="ml-3 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full p-2 pl-2 rounded-md focus:outline-none"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <div className="flex items-center border rounded-md">
                    <FiMail className="ml-3 text-gray-400" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full p-2 pl-2 rounded-md focus:outline-none"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isProfileLoading}
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition flex items-center justify-center"
                >
                  {isProfileLoading ? 'Updating...' : 'Update Profile'}
                  <FiEdit2 className="ml-2" />
                </button>
              </div>
            </form>
          </div>
          
          {/* Change Password Section */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiLock className="mr-2" /> Change Password
            </h2>
            <form onSubmit={handlePasswordUpdate}>
              <div className="space-y-4">
                {passwordUpdateError && (
                  <div className="bg-red-100 text-red-700 p-3 rounded-md">
                    {passwordUpdateError}
                  </div>
                )}
                {passwordUpdateSuccess && (
                  <div className="bg-green-100 text-green-700 p-3 rounded-md">
                    {passwordUpdateSuccess}
                  </div>
                )}
                
                <div>
                  <label className="block text-gray-700 mb-2">Current Password</label>
                  <div className="flex items-center border rounded-md">
                    <FiLock className="ml-3 text-gray-400" />
                    <input
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                      className="w-full p-2 pl-2 rounded-md focus:outline-none"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">New Password</label>
                  <div className="flex items-center border rounded-md">
                    <FiLock className="ml-3 text-gray-400" />
                    <input
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                      className="w-full p-2 pl-2 rounded-md focus:outline-none"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Confirm New Password</label>
                  <div className="flex items-center border rounded-md">
                    <FiLock className="ml-3 text-gray-400" />
                    <input
                      type="password"
                      value={passwordData.confirm_new_password}
                      onChange={(e) => setPasswordData({...passwordData, confirm_new_password: e.target.value})}
                      className="w-full p-2 pl-2 rounded-md focus:outline-none"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isPasswordLoading}
                  className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition flex items-center justify-center"
                >
                  {isPasswordLoading ? 'Updating...' : 'Change Password'}
                  <FiEdit2 className="ml-2" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}