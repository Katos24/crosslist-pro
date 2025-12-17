'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateListing() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'used'
  });
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(f => URL.createObjectURL(f));
      setImages([...images, ...newImages]);
    }
  };

  const handleSubmit = async (e: React.FormEvent, postToPlatforms: boolean = false) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/auth/login');
        return;
      }

      // Step 1: Create listing in database
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          images,
          userId
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create listing');
      }

      // Step 2: If posting to platforms, call the post API
      if (postToPlatforms) {
        const postRes = await fetch('/api/listings/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listingId: data.listing.id
          })
        });

        if (!postRes.ok) {
          const postData = await postRes.json();
          throw new Error(postData.error || 'Failed to post to platforms');
        }

        alert('✅ Listing posted to eBay & Facebook successfully!');
      } else {
        alert('✅ Listing saved as draft!');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-white">
            CrossList<span className="text-purple-400">Pro</span>
          </Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-white">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-8">Create New Listing</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, false)} className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 space-y-6">
          
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
              placeholder="Levi's 511 Jeans Size 30 Gray Distressed"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Description *</label>
            <textarea
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
              placeholder="Describe your item in detail..."
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Price ($) *</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
              placeholder="25.00"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
              placeholder="Clothing, Electronics, etc."
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Condition *</label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({...formData, condition: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="used">Used - Good</option>
              <option value="used-fair">Used - Fair</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Photos</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
            />
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <img key={i} src={img} alt={`Upload ${i+1}`} className="w-full h-24 object-cover rounded-lg" />
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e as any, true)}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post to eBay & Facebook'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
