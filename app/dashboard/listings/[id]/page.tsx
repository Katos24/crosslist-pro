'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  ebayUrl: string | null;
  fbStatus: string | null;
  fbUrl: string | null;
  soldAt: Date | null;
  createdAt: Date;
}

export default function ListingDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadListing();
  }, []);

  const loadListing = async () => {
    try {
      const res = await fetch(`/api/listings/${params.id}`);
      const data = await res.json();
      setListing(data.listing);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsSold = async () => {
    if (!confirm('Mark as SOLD?')) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/listings/mark-sold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing?.id })
      });

      if (res.ok) {
        alert('Marked as sold!');
        loadListing();
      }
    } catch (error) {
      alert('Error');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteListing = async () => {
    if (!confirm('DELETE permanently?')) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/listings/${listing?.id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('Deleted!');
        router.push('/dashboard');
      }
    } catch (error) {
      alert('Error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Not found</div>
      </div>
    );
  }

  const isSold = listing.soldAt !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-white">
            CrossList<span className="text-purple-400">Pro</span>
          </Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-white">
            Back
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {isSold && (
          <span className="inline-block bg-red-500 text-white px-4 py-2 rounded-full font-semibold mb-4">
            SOLD
          </span>
        )}

        <h1 className="text-4xl font-bold text-white mb-2">{listing.title}</h1>
        <p className="text-3xl text-green-400 font-bold mb-8">${listing.price.toFixed(2)}</p>

        {listing.images.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {listing.images.map((img, i) => (
              <img key={i} src={img} alt="" className="w-full h-64 object-cover rounded-lg" />
            ))}
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{listing.description}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Platform Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white">eBay:</span>
              <span className="text-gray-300">{listing.ebayStatus || 'Not listed'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Facebook:</span>
              <span className="text-gray-300">{listing.fbStatus || 'Not listed'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {!isSold && (
            <button
              onClick={markAsSold}
              disabled={actionLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              Mark as Sold
            </button>
          )}
          <button
            onClick={deleteListing}
            disabled={actionLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
