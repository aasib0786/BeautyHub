# 🛍️ ShopVerse - Full-Stack Multi-Category E-Commerce Platform

A complete, interconnected 3-tier E-Commerce Ecosystem for selling **Makeup & Beauty 💄**, **Teddywear & Toys 🧸**, **Clothes & Fashion 👗**, **Crockery & Kitchenware 🍽️**, **Accessories & Bags 👜**, and **Home Decor 🪴**, integrated with an **AI Shopping Assistant**.

---

## 🏛️ Ecosystem Overview

```text
d:\reractNative\
├── backend/                  # [PART 1] Node.js + Express REST API & AI Engine (Port 5000)
│   ├── src/
│   │   ├── config/db.js      # In-Memory Store & Database Queries
│   │   ├── controllers/      # Product, Category, Order, AI, Analytics Controllers
│   │   ├── routes/           # REST API Endpoints
│   │   ├── services/         # AI Recommendation Engine
│   │   └── server.js         # Entry Point
│   └── package.json
│
├── admin/                    # [PART 2] React.js + Vite Web Admin Dashboard (Port 5173)
│   ├── src/
│   │   ├── components/       # MetricCards, Sidebar, TopBar, ProductModal
│   │   ├── pages/            # Dashboard, Products, Categories, Orders, AI Copywriter
│   │   ├── services/api.js   # Live Sync with Backend
│   │   └── App.jsx
│   └── package.json
│
└── YTNative/                 # [PART 3] React Native Mobile Application (Android / iOS)
    ├── src/
    │   ├── components/       # ProductCard, CategoryChips, BannerSlider, CartItem
    │   ├── context/          # CartContext & Wishlist
    │   ├── screens/          # Home, ProductDetail, Cart, Checkout, OrderSuccess, AI Chat, Orders
    │   ├── services/         # API Client with Android 10.0.2.2 & Offline Fallbacks
    │   └── navigation/       # Stack Navigator
    └── App.jsx
```

---

## 🚀 How to Run All 3 Parts

### 1️⃣ Start the Node.js Backend API (Terminal 1)
```powershell
cd D:\reractNative\backend
npm install
npm run dev
```
👉 Server will start on: **`http://localhost:5000`**

---

### 2️⃣ Start the React Admin Dashboard (Terminal 2)
```powershell
cd D:\reractNative\admin
npm install
npm run dev
```
👉 Admin Dashboard will open on: **`http://localhost:5173`**
- View store revenue & real-time orders placed from mobile.
- Add, Edit, Delete products with live category selection and stock alerts.
- Use the **AI Copywriter** to generate compelling product descriptions and SEO tags.

---

### 3️⃣ Start the React Native Mobile App (Terminal 3 & 4)

#### Terminal 3 (Start Metro Bundler):
```powershell
cd D:\reractNative\YTNative
npm start
```

#### Terminal 4 (Run on Android Emulator):
```powershell
cd D:\reractNative\YTNative
npm run android
```
*(Make sure your Android Emulator is launched in Android Studio)*

---

## 📱 Mobile App Features
- **Multi-Category Store**: Instant filter chips for Makeup, Teddywear, Clothes, Crockery, Accessories & Decor.
- **AI Shopping Assistant**: Tap `✨ AI` in the top bar to ask natural questions (*e.g., "Suggest makeup under 1000"*) and get instant product cards inside chat.
- **Cart & Dynamic Billing**: Add items, apply promo code `SAVE200`, adjust quantities, and calculate taxes.
- **Secure Checkout**: Multi-step checkout with address selection, payment modes, and live order placement syncing with the Admin Panel.
