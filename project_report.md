 tracking info.

## 3. Implemented Features
*   **Core E-commerce**: Browsing products, viewing product details, and adding items to the cart.
*   **Cart System**: `CartContext` using localStorage to persist cart items across reloads.
*   **AI Gift Finder Wizard**: Interactive UI allowing users to select parameters (e.g., recipient, occasion) via chips.
*   **Voice Search**: UI integrated into the Hero section to accept voice input.
*   **Authentication Flow**: Complete login and registration UI with backend connectivity.
*   **Checkout UI**: Multi-step checkout process (Delivery, Payment, Review) with mock Razorpay/UPI options.

## 4. Known Bugs & What is NOT Working
During testing, several interactive and state management issues were identified that prevent the application from being production-ready:

### **Navigation & UI Bugs**
*   **Shopping Icon Routing**: The cart icon in the top navbar incorrectly navigates to `/gift-finder` instead of opening the cart drawer or navigating to the checkout.
*   **Share & Love (Heart) Icons**: These buttons in the navbar have visual feedback (color changes) but do not trigger any actual action or route.
*   **Missing Images**: Certain external images (e.g., Unsplash) fail to load with 404 errors, requiring asset URL updates.
*   **Hydration Errors**: Multiple React hydration mismatches appear in the console, causing potential interactivity failures on first load.

### **Functional Errors**
*   **Checkout State Loss (Critical)**: When navigating from the cart drawer to the `/checkout` page, the cart state is completely lost. The checkout summary incorrectly shows "Cart is empty" and a subtotal of ₹0.
*   **Chatbot Integration Broken**: The `ChatWidget` (bottom-right 🎁 icon) relies on a static, hardcoded dictionary (`AI_RESPONSES`). The "AI-powered gift discovery" is not functional; prompts yield fallback responses instead of integrating with GPT-4o or fetching real products.
*   **AI Gift Finder Form**: Selecting suggestion chips works on the frontend, but clicking "Send" only scrolls the page without actually filtering the product catalog or providing customized recommendations.
*   **Auth Session Error**: Testing revealed `401 Unauthorized` errors hitting `/api/auth/me`, indicating issues with how the auth token is being read or set on the frontend.

## 5. Next Steps & Actionable Roadmap
To achieve full production readiness, the following steps must be taken:

1.  **Fix Navigation Routing**:
    *   Update `Navbar.tsx` to ensure the Shopping Bag icon correctly opens the `CartDrawer` via context.
    *   Implement actual logic (or remove) the Share/Heart buttons in the navbar.
2.  **Repair the Checkout Flow**:
    *   Debug `CartContext.tsx` to ensure the cart state seamlessly persists when transitioning to `/checkout`.
3.  **Implement Real AI Backend**:
    *   Replace the mock `AI_RESPONSES` in `ChatWidget.tsx` with a live API call to an LLM provider (e.g., OpenAI API) that can query the `products` database and return intelligent suggestions.
    *   Connect the AI Gift Finder form to a dedicated backend route that filters products based on user prompts.
4.  **Resolve Hydration & Asset Issues**:
    *   Audit components (like CartDrawer and Navbar) that rely on `window` or `localStorage` to ensure they only render after the component has mounted to prevent hydration mismatches.
    *   Update the `data.ts` mock product images to reliable, highly available assets.
5.  **Finalize Live Integrations**:
    *   Provide real MongoDB Atlas credentials to `MONGODB_URI`.
    *   Provide actual Razorpay keys (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`) to test real payment processing.
# GiftGenius AI Platform - Project Status Report

## 1. Project Overview
GiftGenius is an AI-powered e-commerce platform built with Next.js 16+, Tailwind CSS, and MongoDB. The platform is designed to provide AI-driven gift discovery, AR-assisted shopping, and multi-language voice search capabilities with a premium, modern user interface.

## 2. Architecture & Technologies
### **Frontend**
*   **Framework**: Next.js (App Router).
*   **Styling**: Tailwind CSS with Framer Motion for animations.
*   **UI Characteristics**: Dark-themed, glassmorphism elements, high-quality typography (Inter & JetBrains Mono).
*   **Key Components**:
    *   **Hero**: Canvas-based interactive design with voice search and CTA buttons.
    *   **Navbar**: Persistent navigation with interactive buttons.
    *   **ChatWidget**: A floating chatbot UI for AI assistance.
    *   **ProductFeed & Detail**: Displays products with filtering, image galleries, AR viewer placeholder, and cart logic.
    *   **CartDrawer**: Sliding cart sidebar managed by `CartContext`.

### **Backend & APIs**
*   **Routes**: Standard RESTful endpoints using Next.js Route Handlers (`/api/...`).
*   **Orders (`/api/orders`)**: Endpoints to create and fetch orders.
*   **Products (`/api/products`)**: Endpoints for querying, filtering, and sorting the product catalog.
*   **Payments (`/api/razorpay`)**: Integration with Razorpay SDK to create payment intents.

### **Authentication**
*   **Implementation**: Custom JWT-based authentication flow.
*   **Security**: Passwords are hashed using `bcryptjs` before storage.
*   **Session**: JSON Web Tokens (`jsonwebtoken`) are issued on login and stored in `httpOnly` secure cookies.
*   **Endpoints**:
    *   `/api/auth/register`: User creation and duplicate checking.
    *   `/api/auth/login`: Credential verification and token assignment.
    *   `/api/auth/me`: Verifies the session cookie and returns user data.
    *   `/api/auth/logout`: Clears the session cookie.

### **Database (MongoDB)**
*   **ORM**: Mongoose.
*   **Connection**: Managed via `src/lib/db.ts` utilizing `MONGODB_URI`.
*   **Schemas**:
    *   **User**: Stores authentication details (name, email, password hash, role, etc.).
    *   **Order**: Stores order items, addresses, payment status, and