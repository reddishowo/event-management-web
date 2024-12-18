import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Log untuk debugging
    console.log('Dashboard User:', user);
    console.log('Is Admin:', isAdmin);

    // Redirect jika tidak ada user
    if (!user) {
      router.push('/auth/Login');
      return;
    }
    
    // Redirect admin ke halaman admin
    if (isAdmin) {
      router.push('/dashboard/admin');
      return;
    }
  }, [user, isAdmin, router]);

  // Jika tidak ada user atau user adalah admin, kembalikan null
  if (!user || isAdmin) {
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Welcome, {user.name}</h1>
      <div className="space-y-4">
        <Link href="/dashboard/events" className="text-blue-500 block">
          View Events
        </Link>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}