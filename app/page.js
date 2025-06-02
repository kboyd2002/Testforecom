"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, ExternalLink, Star, Heart } from 'lucide-react';

const WalletStore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set());

  // Generate placeholder products
  const generateProducts = (startId, count) => {
    const categories = ['Test'];
    const brands = ['Test'];
    const colors = ['test'];
    
    return Array.from({ length: count }, (_, i) => {
      const id = startId + i;
      const category = categories[Math.floor(Math.random() * categories.length)];
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const rating = (4 + Math.random()).toFixed(1);
      const reviews = Math.floor(Math.random() * 2000) + 100;
      const price = (Math.random() * 150 + 25).toFixed(2);
      const originalPrice = (parseFloat(price) * (1.1 + Math.random() * 0.3)).toFixed(2);
      
      return {
        id,
        name: `${brand} ${category.slice(0, -1)} - ${color}`,
        category,
        brand,
        price: parseFloat(price),
        originalPrice: parseFloat(originalPrice),
        rating: parseFloat(rating),
        reviews,
        image: `https://picsum.photos/300/300?random=${id}`,
        affiliate: `https://amazon.com/dp/B0${id.toString().padStart(8, '0')}`,
        features: [
        ].slice(0, Math.floor(Math.random() * 4) + 1)
      };
    });
  };

  // Load initial products
  useEffect(() => {
    setProducts(generateProducts(1, 12));
  }, []);

  // Load more products
  const loadMore = useCallback(() => {
    if (loading) return;
    
    setLoading(true);
    setTimeout(() => {
      const newProducts = generateProducts(products.length + 1, 8);
      setProducts(prev => [...prev, ...newProducts]);
      setPage(prev => prev + 1);
      setLoading(false);
    }, 1000);
  }, [products.length, loading]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const ProductCard = ({ product }) => (
    <div className="bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group overflow-hidden border border-gray-800">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => toggleFavorite(product.id)}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              favorites.has(product.id) 
                ? 'bg-red-500 text-white' 
                : 'bg-black/80 text-gray-300 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart size={16} fill={favorites.has(product.id) ? "currentColor" : "none"} />
          </button>
        </div>
        {product.originalPrice > product.price && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-2">
          <span className="text-sm text-blue-400 font-semibold">{product.brand}</span>
          <span className="text-xs text-gray-400 ml-2">{product.category}</span>
        </div>
        
        <h3 className="font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                className={i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-600"}
              />
            ))}
            <span className="ml-2 text-sm text-gray-300">
              {product.rating} ({product.reviews.toLocaleString()})
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {product.features.map((feature, index) => (
            <span key={index} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
              {feature}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>
        
        <a
          href={product.affiliate}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          <ShoppingBag size={18} />
          Shop Now
          <ExternalLink size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="https://i.imgur.com/joK3QWh.png"
                     width={500}
                     height={500}
              ></img>
              <div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300">Affiliate Store</p>
              <p className="text-xs text-gray-400">We earn from qualifying purchases</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-white">
          We Get It, Go Grab Your Wallet Dude.
<br></br>
You'll Need It
          </h2>
        </div>
      </section>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-12 bg-black">
        <div className="flex justify-between items-center mb-8 bg-black">
          <h3 className="text-2xl font-bold text-white bg-black">
            Featured Products ({products.length}+ products)
          </h3>
          <div className="text-sm text-gray-400">
            Showing {products.length} of ∞ products
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {loading && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-gray-900 rounded-full px-6 py-3 shadow-lg border border-gray-800">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
              <span className="text-gray-300 font-medium">Loading more Products...</span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 mb-2">
            © 2025 Dude, Where's My Wallet? - Affiliate Store
          </p>
          <p className="text-sm text-gray-500">
            As an Amazon Associate and affiliate partner, we earn from qualifying purchases.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WalletStore;