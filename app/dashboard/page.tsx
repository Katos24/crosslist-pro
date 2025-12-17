'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string | null;
  condition: string | null;
  images: string[];
  ebayStatus: string | null;
  fbStatus: string | null;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('userEmail');
    
    if (!userId) {
      router.push('/auth/login');
    } else {
      setUserEmail(email || '');
      fetchListings(userId);
    }
  }, [router]);

  const fetchListings = async (userId: string) => {
    try {
      const res = await fetch(`/api/listings?userId=${userId}`);
      const data = await res.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  const activeListings = listings.filter(l => !l.ebayStatus && !l.fbStatus).length;
  const soldListings = listings.filter(l => l.ebayStatus === 'sold' || l.fbStatus === 'sold').length;
  const totalRevenue = listings
    .filter(l => l.ebayStatus === 'sold' || l.fbStatus === 'sold')
    .reduce((sum, l) => sum + l.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            CrossList<span className="text-purple-400">Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <Link
            href="/dashboard/create"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            + Create Listing
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white mb-2">{activeListings}</div>
            <div className="text-gray-300">Active Listings</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white mb-2">{soldListings}</div>
            <div className="text-gray-300">Items Sold</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white mb-2">${totalRevenue.toFixed(2)}</div>
            <div className="text-gray-300">Total Revenue</div>
          </div>
        </div>

        {/* Listings */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Your Listings</h2>
          
          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading...</p>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300 mb-6">No listings yet. Create your first one!</p>
              <Link
                href="/dashboard/create"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Create New Listing
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map((listing) => (
                <div key={listing.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{listing.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{listing.description.substring(0, 100)}...</p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-400 font-semibold">${listing.price}</span>
                        {listing.category && <span className="text-gray-500">{listing.category}</span>}
                        {listing.condition && <span className="text-gray-500">{listing.condition}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                        eBay: {listing.ebayStatus || 'Not Posted'}
                      </span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                        FB: {listing.fbStatus || 'Not Posted'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
