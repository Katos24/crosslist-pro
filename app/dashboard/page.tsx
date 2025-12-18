'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  ebayStatus: string | null;
  fbStatus: string | null;
  soldAt: Date | null;
  createdAt: Date;
}

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [ebayConnected, setEbayConnected] = useState(false);
  const [checkingEbay, setCheckingEbay] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    
    if (!userId) {
      router.push('/auth/login');
      return;
    }

    setUserName(name || 'User');
    loadListings(userId);
    checkEbayConnection(userId);

    // Check for OAuth success/error messages
    const ebayStatus = searchParams.get('ebay');
    if (ebayStatus === 'connected') {
      alert('✅ eBay account connected successfully!');
      // Force recheck
      setTimeout(() => checkEbayConnection(userId), 500);
    } else if (ebayStatus === 'error') {
      alert('❌ Failed to connect eBay account. Please try again.');
    }
  }, [router, searchParams]);

  const loadListings = async (userId: string) => {
    try {
      const res = await fetch(`/api/listings?userId=${userId}`);
      const data = await res.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEbayConnection = async (userId: string) => {
    setCheckingEbay(true);
    try {
      const res = await fetch(`/api/ebay/status?userId=${userId}`);
      const data = await res.json();
      setEbayConnected(data.connected);
      console.log('eBay connected:', data.connected);
    } catch (error) {
      console.error('Failed to check eBay status:', error);
    } finally {
      setCheckingEbay(false);
    }
  };

  const connectEbay = () => {
    const userId = localStorage.getItem('userId');
    window.location.href = `/api/ebay/auth?userId=${userId}`;
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth/login');
  };

  const activeListings = listings.filter(l => !l.soldAt);
  const soldListings = listings.filter(l => l.soldAt);
  const totalRevenue = soldListings.reduce((sum, l) => sum + l.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-white">
            CrossList<span className="text-purple-400">Pro</span>
          </Link>
          <div className="flex items-center gap-4">
            {checkingEbay ? (
              <span className="text-gray-400 text-sm">Checking eBay...</span>
            ) : ebayConnected ? (
              <span className="text-green-400 text-sm font-semibold">✅ eBay Connected</span>
            ) : (
              <button
                onClick={connectEbay}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                🔗 Connect eBay
              </button>
            )}
            <Link
              href="/dashboard/create"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              + Create Listing
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {userName}! 👋
        </h1>
        <p className="text-gray-400 mb-12">Manage your cross-platform listings</p>

        {!ebayConnected && !checkingEbay && (
          <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-6 py-4 rounded-lg mb-8">
            ⚠️ <strong>Connect your eBay account</strong> to start posting listings to eBay!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <p className="text-gray-400 text-sm mb-2">Active Listings</p>
            <p className="text-4xl font-bold text-white">{activeListings.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <p className="text-gray-400 text-sm mb-2">Items Sold</p>
            <p className="text-4xl font-bold text-green-400">{soldListings.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
            <p className="text-4xl font-bold text-green-400">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">Your Listings</h2>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : listings.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20 text-center">
            <p className="text-gray-400 mb-4">No listings yet</p>
            <Link
              href="/dashboard/create"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/dashboard/listings/${listing.id}`}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:border-purple-500 transition cursor-pointer"
              >
                {listing.images[0] && (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 line-clamp-2">
                    {listing.title}
                  </h3>
                  <p className="text-green-400 font-bold text-xl mb-3">
                    ${listing.price.toFixed(2)}
                  </p>
                  
                  <div className="flex gap-2 mb-3">
                    {listing.ebayStatus === 'active' && (
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        🛒 eBay
                      </span>
                    )}
                    {listing.fbStatus === 'active' && (
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        📘 Facebook
                      </span>
                    )}
                    {listing.soldAt && (
                      <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                        ✅ Sold
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-400">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
