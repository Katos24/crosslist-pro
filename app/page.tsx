import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">
          CrossList<span className="text-purple-400">Pro</span>
        </div>
        <div className="space-x-6">
          <a href="#features" className="text-gray-300 hover:text-white transition">
            Features
          </a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition">
            Pricing
          </a>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            List Once,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Sell Everywhere
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Stop wasting hours copying listings between eBay and Facebook Marketplace.
            <br />
            Cross-list in seconds, auto-delist when sold, and sell 2x faster.
          </p>

          {/* Email Capture */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-96 px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg">
              Start Free Trial
            </button>
          </div>
          <p className="text-gray-400 text-sm">
            ✨ 14-day free trial • No credit card required • Cancel anytime
          </p>

          {/* Social Proof */}
          <div className="mt-12 flex justify-center items-center gap-12 text-gray-400">
            <div>
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-sm">Active Sellers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-sm">Items Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">2x</div>
              <div className="text-sm">Faster Sales</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">The Problem:</h2>
            <ul className="space-y-3 text-gray-300 text-lg">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 text-2xl">✗</span>
                <span>Spending 30+ minutes copying listings between platforms</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 text-2xl">✗</span>
                <span>Forgetting to remove sold items and dealing with angry buyers</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 text-2xl">✗</span>
                <span>Missing sales because your item isn't on every platform</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 text-2xl">✗</span>
                <span>Paying $30-50/month for clunky, outdated tools</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">The Solution:</h2>
            <ul className="space-y-3 text-gray-300 text-lg">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-2xl">✓</span>
                <span>Create one listing, post to eBay & Facebook in 60 seconds</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-2xl">✓</span>
                <span>Auto-delist everywhere when item sells on any platform</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-2xl">✓</span>
                <span>Reach 2x more buyers without extra work</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-2xl">✓</span>
                <span>Only $15/month - half the price of competitors</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
          Everything You Need to Sell More
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: "⚡",
              title: "Lightning Fast",
              description: "List to multiple platforms in under 60 seconds. No more copy-pasting descriptions and photos."
            },
            {
              icon: "🔄",
              title: "Auto-Delist",
              description: "When an item sells anywhere, we automatically remove it from all other platforms. No more double-sales."
            },
            {
              icon: "📸",
              title: "Photo Tools",
              description: "Upload once, optimize for each platform. Background removal and resizing included."
            },
            {
              icon: "📊",
              title: "Analytics Dashboard",
              description: "Track views, clicks, and sales across all platforms in one beautiful dashboard."
            },
            {
              icon: "💰",
              title: "Profit Tracking",
              description: "See your actual profit after fees from each platform. Know what's working."
            },
            {
              icon: "📱",
              title: "Mobile Ready",
              description: "List from your phone while thrifting. Snap photos and post instantly."
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Simple, Honest Pricing
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            No hidden fees. No contracts. Cancel anytime.
          </p>

          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-500/50 rounded-2xl p-10 max-w-lg mx-auto">
            <div className="mb-6">
              <div className="text-6xl font-bold text-white mb-2">
                $15
                <span className="text-2xl text-gray-400">/month</span>
              </div>
              <div className="text-purple-300 font-semibold">
                50% cheaper than competitors
              </div>
            </div>

            <ul className="text-left space-y-4 mb-8 text-gray-200">
              {[
                "Unlimited listings",
                "eBay + Facebook Marketplace",
                "Auto-delist when sold",
                "Photo tools & optimization",
                "Analytics & profit tracking",
                "Mobile app access",
                "Priority support"
              ].map((feature, i) => (
                <li key={i} className="flex items-center">
                  <span className="text-green-400 mr-3 text-xl">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg text-xl font-bold transition shadow-lg">
              Start 14-Day Free Trial
            </button>
            <p className="text-gray-400 text-sm mt-4">
              No credit card required • Cancel anytime
            </p>
          </div>

          <div className="mt-12 text-gray-400">
            <p className="mb-2">Compare to:</p>
            <div className="flex justify-center gap-8 text-sm">
              <div>Vendoo: <span className="line-through">$30-50/mo</span></div>
              <div>List Perfectly: <span className="line-through">$30/mo</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          What Sellers Are Saying
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Sarah M.",
              role: "Thrift Flipper",
              text: "I was spending 2 hours a day listing. Now it takes 20 minutes. This tool paid for itself in week one.",
              rating: 5
            },
            {
              name: "Mike T.",
              role: "eBay Power Seller",
              text: "The auto-delist feature alone is worth it. No more angry messages about sold items. Game changer.",
              rating: 5
            },
            {
              name: "Jessica R.",
              role: "Part-Time Reseller",
              text: "Finally, a tool that doesn't cost more than I make! Simple, fast, and actually works.",
              rating: 5
            }
          ].map((testimonial, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
              <div>
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-sm text-gray-400">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to 2x Your Sales?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of sellers who are already listing faster and selling more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-96 px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="w-full sm:w-auto bg-white hover:bg-gray-100 text-purple-600 px-8 py-4 rounded-lg text-lg font-bold transition shadow-lg">
              Start Free Trial →
            </button>
          </div>
          <p className="text-white/80 text-sm mt-4">
            14-day free trial • No credit card • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <div className="mb-4">
            <span className="text-2xl font-bold text-white">CrossList<span className="text-purple-400">Pro</span></span>
          </div>
          <div className="flex justify-center gap-8 mb-6">
            <a href="#" className="hover:text-white transition">Features</a>
            <a href="#" className="hover:text-white transition">Pricing</a>
            <a href="#" className="hover:text-white transition">Support</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
          <p className="text-sm">&copy; 2024 CrossListPro. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}