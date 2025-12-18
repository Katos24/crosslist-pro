'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// eBay-style category options
const CATEGORIES = [
  { id: '11450', name: 'Clothing, Shoes & Accessories' },
  { id: '293', name: 'Electronics' },
  { id: '33034', name: 'Guitar Parts' },
  { id: '619', name: 'Musical Instruments' },
  { id: '63889', name: 'Shoes' },
  { id: '220', name: 'Collectibles' },
  { id: '99', name: 'Other' }
];

const CONDITIONS = [
  { id: 'NEW', label: 'New', desc: 'Brand new, unused, unopened' },
  { id: 'LIKE_NEW', label: 'Like New', desc: 'Gently used, excellent condition' },
  { id: 'USED_EXCELLENT', label: 'Very Good', desc: 'Previously used, shows minimal wear' },
  { id: 'USED_GOOD', label: 'Good', desc: 'Previously used, shows normal wear' },
  { id: 'ACCEPTABLE', label: 'Acceptable', desc: 'Heavy wear but fully functional' }
];

const SHIPPING_TIMES = [
  '1 business day',
  '2 business days',
  '3 business days',
  '5 business days'
];

export default function CreateListing() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'USED_GOOD',
    brand: '',
    mpn: '',
    quantity: '1',
    handlingTime: '2 business days',
    zipCode: '11790'
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

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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

      // Create listing
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
          images,
          userId
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create listing');
      }

      // If posting to platforms
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

        alert('✅ Listing posted to eBay & Facebook!');
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

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-2">Create New Listing</h1>
        <p className="text-gray-400 mb-8">Fill out the details to list on eBay & Facebook Marketplace</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          
          {/* Photos Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">📸 Photos</h2>
            <p className="text-sm text-gray-400 mb-4">Add up to 12 photos (first photo will be the main image)</p>
            
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500 mb-4"
            />
            
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} alt={`Upload ${i+1}`} className="w-full h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">📝 Item Details</h2>
            
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">
                Title * <span className="text-sm text-gray-500">(Max 80 characters)</span>
              </label>
              <input
                type="text"
                required
                maxLength={80}
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
                placeholder="e.g., Levi's 511 Slim Fit Jeans Men's Size 30x32 Gray"
              />
              <p className="text-sm text-gray-500 mt-1">{formData.title.length}/80 characters</p>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Description *</label>
              <textarea
                required
                rows={8}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
                placeholder="Describe your item in detail... Include condition, features, measurements, etc."
              />
              <p className="text-sm text-gray-400 mt-1">
                💡 Tip: Include measurements, brand, condition details, and any flaws
              </p>
            </div>
          </div>

          {/* Category & Condition */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">🏷️ Category & Condition</h2>
            
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">Select a category...</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Condition *</label>
              <select
                required
                value={formData.condition}
                onChange={(e) => setFormData({...formData, condition: e.target.value})}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
              >
                {CONDITIONS.map(cond => (
                  <option key={cond.id} value={cond.id}>
                    {cond.label} - {cond.desc}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Brand <span className="text-sm text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
                  placeholder="e.g., Levi's, Nike, Fender"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  MPN <span className="text-sm text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.mpn}
                  onChange={(e) => setFormData({...formData, mpn: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Manufacturer Part Number"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">💰 Pricing & Inventory</h2>
            
            <div className="grid grid-cols-2 gap-4">
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
                <label className="block text-gray-300 mb-2 font-semibold">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
                  placeholder="1"
                />
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">📦 Shipping</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Handling Time *</label>
                <select
                  required
                  value={formData.handlingTime}
                  onChange={(e) => setFormData({...formData, handlingTime: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
                >
                  {SHIPPING_TIMES.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">ZIP Code *</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
                  placeholder="11790"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-4 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : '💾 Save as Draft'}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e as any, true)}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 rounded-lg font-semibold transition disabled:opacity-50 text-lg"
            >
              {loading ? 'Posting...' : '🚀 Post to eBay & Facebook'}
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm">
            💡 <strong>Tip:</strong> Save as draft first to review, or post immediately to go live!
          </p>
        </form>
      </div>
    </div>
  );
}
