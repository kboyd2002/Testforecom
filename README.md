# 🛍️ Dude, Where's My Wallet? - Affiliate Store

> **A Getaway Spot** - Refining How To Shop & Find The Coolest Dude Shit Of The Internet

## 🎯 About This Project

**Dude, Where's My Wallet?** is a modern e-commerce affiliate store built with Next.js, featuring real Amazon products with affiliate links. Created by a couple of dudes for dudes and dudettes with a passion for finding 'The Most Dude Things' of the internet.

### 🌟 Key Features

- **♾️ Infinite Scroll** - Seamless product browsing experience
- **📱 Fully Responsive** - Perfect on desktop, tablet, and mobile
- **⚡ Lightning Fast** - Built with Next.js 15 and optimized performance
- **🎨 Modern UI** - Dark theme with gradient accents and smooth animations


## 🚀 Live Demo

Visit the live store: 

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3
- **Frontend**: React 19
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone (https://github.com/kboyd2002/Testforecom/)
   cd Testforecom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 💰 Affiliate Program Details

### Amazon Associates Integration

This store is fully integrated with the **Amazon Associates Program**:

- ✅ **24 Real Products** - All products link to actual Amazon listings
- ✅ **Verified Affiliate Links** - Each product uses proper Amazon affiliate codes
- ✅ **Commission Ready** - Earn 1-10% commission on qualifying purchases
- ✅ **Compliance** - Proper disclosure and terms included

### Revenue Potential

- **Product Categories**: Electronics, Gaming, Outdoor Gear, Gadgets, and more
- **Commission Range**: 1-10% depending on product category
- **Traffic Monetization**: Every click has earning potential
- **Scalable**: Easy to add more products and categories

## 🏗️ Project Structure

```
├── app/
│   ├── api/amazon-products/     # API routes for product data
│   ├── globals.css              # Global styles
│   ├── layout.js                # App layout component
│   └── page.js                  # Main application component
├── data/
│   └── products.js              # Product database with affiliate links
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🎨 Features Overview

### Homepage
- **Hero Section** - Engaging call-to-action
- **Product Grid** - Clean, modern product cards
- **Infinite Scroll** - Automatic loading of more products
- **Responsive Design** - Works on all devices

### Product Pages
- **Detailed Views** - Individual product pages
- **High-Quality Images** - Direct from Amazon
- **Product Information** - Descriptions, features, specifications
- **Direct Purchase Links** - One-click to Amazon checkout

### Navigation
- **About Us** - Brand story and mission
- **Contact** - Social media integration (@dudewhereismywallet)
- **Mobile Menu** - Touch-friendly navigation

## 📊 Product Database

The store features **DUDE PRODUCTS** across multiple categories:


## 🔧 Customization

### Adding New Products

1. **Edit** `data/products.js`
2. **Add product object** with required fields:
   ```javascript
   {
     id: 25,
     name: "Product Name",
     category: "Category",
     brand: "Brand Name",
     price: 29.99,
     rating: 4.5,
     reviews: 100,
     image: "https://amazon-image-url.jpg",
     affiliate: "https://amzn.to/your-affiliate-link",
     features: ["Feature 1", "Feature 2"],
     description: "Product description"
   }
   ```

### Updating Affiliate Links

Replace affiliate links in `data/products.js` with your Amazon Associates tracking IDs.

### Styling Customization

- **Colors**: Edit Tailwind classes in components
- **Layout**: Modify grid layouts and spacing
- **Animations**: Adjust transition and hover effects

## 📈 SEO & Performance

- ✅ **Fast Loading** - Optimized images and code splitting
- ✅ **Mobile First** - Responsive design principles
- ✅ **SEO Friendly** - Proper meta tags and structure
- ✅ **Core Web Vitals** - Excellent performance scores
