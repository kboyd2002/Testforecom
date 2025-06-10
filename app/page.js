"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, ExternalLink, Star, Heart, Menu, X, Home, Info, Mail, ShoppingCart } from 'lucide-react';
import { getProducts, getAllProducts, getFeaturedProducts } from '../data/products.js';

const WalletStore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set());
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  // Get all products for search/navigation
  const getAllProductsLocal = () => {
    return getAllProducts(); // Get all products from data file
  };

  // Fetch real Amazon products (you'll need to implement your backend API)
  const fetchAmazonProducts = async (startIndex, count) => {
    try {
      // Option 1: Using Amazon Product Advertising API (requires backend)
      const response = await fetch(`/api/amazon-products?start=${startIndex}&count=${count}`);
      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error('Failed to fetch Amazon products:', error);
      // Fallback to manually curated products
      return getProducts(startIndex, count);
    }
  };

  // Load initial products
  useEffect(() => {
    // Try to fetch real products first, fallback to curated
    const loadProducts = async () => {
      try {
        const products = await fetchAmazonProducts(1, 12);
        setProducts(products);
      } catch (error) {
        // Fallback to curated products
        setProducts(getProducts(1, 12));
      }
    };
    
    loadProducts();
  }, []);

  // Load more products
  const loadMore = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const newProducts = await fetchAmazonProducts(products.length + 1, 8);
      setProducts(prev => [...prev, ...newProducts]);
      setPage(prev => prev + 1);
    } catch (error) {
      // Fallback to curated products
      const newProducts = getProducts(products.length + 1, 8);
      setProducts(prev => [...prev, ...newProducts]);
      setPage(prev => prev + 1);
    }
    setLoading(false);
  }, [products.length, loading]);

  // Infinite scroll handler
  useEffect(() => {
    if (currentPage !== 'home') return;

    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, currentPage]);

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
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setSelectedProduct(product);
              setCurrentPage('product-detail');
            }}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            View Details
          </button>
          <a
            href={product.affiliate}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
          >
            <ShoppingBag size={16} />
            Buy Now
            <ExternalLink size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );

  // Individual Product Page Component
  const ProductDetailPage = () => {
    if (!selectedProduct) return null;

    return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => setCurrentPage('products')}
          className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          ← Back to Products
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-96 object-cover"
              />
              {selectedProduct.originalPrice > selectedProduct.price && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                  {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}% OFF
                </div>
              )}
              <button
                onClick={() => toggleFavorite(selectedProduct.id)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all ${
                  favorites.has(selectedProduct.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-black/80 text-gray-300 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart size={20} fill={favorites.has(selectedProduct.id) ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg text-blue-400 font-semibold">{selectedProduct.brand}</span>
                <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">{selectedProduct.category}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{selectedProduct.name}</h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(selectedProduct.rating) ? "text-yellow-400 fill-current" : "text-gray-600"}
                    />
                  ))}
                  <span className="ml-3 text-lg text-gray-300">
                    {selectedProduct.rating} ({selectedProduct.reviews.toLocaleString()} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-white">${selectedProduct.price}</span>
              {selectedProduct.originalPrice > selectedProduct.price && (
                <span className="text-2xl text-gray-400 line-through">${selectedProduct.originalPrice}</span>
              )}
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">{selectedProduct.description}</p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedProduct.features.map((feature, index) => (
                  <span key={index} className="text-sm bg-gray-800 text-gray-300 px-3 py-2 rounded-lg">
                    ✓ {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">Specifications</h3>
              <div className="space-y-2">
                {selectedProduct.specifications.map((spec, index) => (
                  <div key={index} className="text-gray-300 text-sm">
                    {spec}
                  </div>
                ))}
              </div>
            </div>

            <a
              href={selectedProduct.affiliate}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group/btn text-lg"
            >
              <ShoppingBag size={24} />
              Buy Now on Amazon
              <ExternalLink size={20} className="group-hover/btn:translate-x-1 transition-transform" />
            </a>

            <div className="text-center text-sm text-gray-400">
              <p>✓ Amazon Prime eligible • ✓ Free returns • ✓ Secure checkout</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white mb-8">You Might Also Like</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getAllProductsLocal()
              .filter(p => p.id !== selectedProduct.id && p.category === selectedProduct.category)
              .slice(0, 4)
              .map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      </main>
    );
  };

  // Page Components
  const HomePage = () => (
    <>
      {/* Hero Section */}
      <section className="py-12 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-white">
            We Get It, Go Grab Your Wallet Dude.
            <br />
            You'll Need It
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Premium wallets, epic deals, and zero regrets
          </p>
          <button
            onClick={() => document.querySelector('#products-section').scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Shop Our Collection
          </button>
        </div>
      </section>

      {/* All Products with Infinite Scroll */}
      <section id="products-section" className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold text-white">
            Our Products ({products.length}+ products)
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
      </section>
    </>
  );



  const AboutPage = () => (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About Us</h1>
        <p className="text-xl text-gray-300">The story behind "Dude, Where's My Wallet?"</p>
      </div>

      <div className="bg-gray-900 rounded-2xl p-12 border border-gray-800">
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-white mb-8">A Getaway Spot</h2>

          <div className="text-xl text-gray-300 leading-relaxed space-y-6">
            <p>Refining How To Shop & Find The Coolest Dude Shit Of The Internet</p>

            <p className="text-2xl font-semibold text-blue-400">Created By A Couple</p>
            <p className="text-2xl font-semibold text-blue-400">Of Dudes</p>

            <p>For Dudes and Dudettes</p>

            <p>With A Passion For Finding 'The Most Dude Things' Of The Internet</p>

            <p>The magic is in the legwork, So the Dudes of the world can enjoy saving search time for cool shit to buy</p>

            <p className="text-2xl font-bold text-purple-400">A One-Stop-Shop For All That Lack Of Dopamine</p>

            <p className="text-lg text-gray-400">(of course)</p>

            <div className="py-8">
              <p className="text-xl font-semibold text-white">..and It's Not Just Stuff</p>
            </div>

            <p>It's Those Relatable Things in Life That Have Us All Saying</p>

            <p className="text-3xl font-bold text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              "Dude, Where's My Wallet?"
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => {
              setCurrentPage('home');
              setTimeout(() => {
                document.querySelector('#products-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Shop Our Collection
          </button>
        </div>
      </div>
    </main>
  );

  const ContactPage = () => (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Contact Us</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Got questions, suggestions, or just want to say what's up? We're here for it, dude!
        </p>
      </div>

      <div className="bg-gray-900 rounded-3xl p-12 border border-gray-800 text-center">
        <div className="space-y-12">

          {/* Email Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Drop Us a Line</h2>
            <a
              href="mailto:hello@dudewhereismywallet.com"
              className="text-2xl text-blue-400 hover:text-blue-300 transition-colors font-semibold"
            >
              hello@dudewhereismywallet.com
            </a>
            <p className="text-gray-400 mt-2">We usually get back to you within 24 hours</p>
          </div>

          {/* Social Media Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">Follow the Dudes</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

              {/* Instagram */}
              <a
                href="https://instagram.com/dudewhereismywallet"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="text-3xl mb-3">📸</div>
                <div className="font-semibold">Instagram</div>
                <div className="text-sm opacity-80">@dudewhereismywallet</div>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com/@dudewhereismywallet"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="text-3xl mb-3">🎵</div>
                <div className="font-semibold">TikTok</div>
                <div className="text-sm opacity-80">@dudewhereismywallet</div>
              </a>

              {/* Twitter/X */}
              <a
                href="https://twitter.com/dudewhereismywallet"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="text-3xl mb-3">🐦</div>
                <div className="font-semibold">Twitter</div>
                <div className="text-sm opacity-80">@dudewhereismywallet</div>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@dudewhereismywallet"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="text-3xl mb-3">📺</div>
                <div className="font-semibold">YouTube</div>
                <div className="text-sm opacity-80">@dudewhereismywallet</div>
              </a>

            </div>
          </div>

          {/* Quick Info */}
          <div className="border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Info</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-blue-400 font-semibold mb-2">Response Time</div>
                <div className="text-gray-300">Usually within 24 hours</div>
              </div>
              <div>
                <div className="text-blue-400 font-semibold mb-2">Best Time to Reach</div>
                <div className="text-gray-300">Anytime, we're always online</div>
              </div>
              <div>
                <div className="text-blue-400 font-semibold mb-2">Vibe Check</div>
                <div className="text-gray-300">Always chill, always helpful</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-4">
              Found something cool we should feature?
            </h3>
            <p className="text-gray-300 mb-6">
              We're always on the hunt for the most dude things on the internet. Hit us up with your finds!
            </p>
            <button
              onClick={() => {
                setCurrentPage('home');
                setTimeout(() => {
                  document.querySelector('#products-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Check Out Our Collection
            </button>
          </div>

        </div>
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage('home')}
                className="cursor-pointer"
              >
                <img
                  src="https://i.imgur.com/joK3QWh.png"
                  alt="Logo"
                  className="h-12 w-12"
                />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Dude, Where's My Wallet?</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      currentPage === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="hidden md:block text-right">
              <p className="text-sm text-gray-300">Affiliate Store</p>
              <p className="text-xs text-gray-400">We earn from qualifying purchases</p>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all mb-2 ${
                      currentPage === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Page Content */}
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'product-detail' && <ProductDetailPage />}
      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'contact' && <ContactPage />}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Dude, Where's My Wallet?</h3>
              <p className="text-gray-400 text-sm">
                Your trusted source for premium wallets and accessories.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className="block text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>FAQ</p>
                <p>Shipping Info</p>
                <p>Returns</p>
                <p>Privacy Policy</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>support@dudewhereismywallet.com</p>
                <p>Mon-Fri 9AM-5PM EST</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 mb-2">
              © 2025 Dude, Where's My Wallet? - Affiliate Store
            </p>
            <p className="text-sm text-gray-500">
              As an Amazon Associate and affiliate partner, we earn from qualifying purchases.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WalletStore;
