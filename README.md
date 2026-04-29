# GiftGenius AI — Smart Gifting, Reimagined

GiftGenius AI is a premium, AI-powered platform designed to help users find the perfect gift for any occasion. Using advanced AI models, it curates personalized gift hampers and suggestions based on recipient descriptions, interests, and budget.

## 🚀 Key Features
- **AI Gift Finder**: Describe your recipient and get curated gift recommendations.
- **Smart Chatbot**: Integrated AI assistant for real-time gifting advice.
- **Interactive WebAR**: View products in your space before you buy.
- **Voice Search**: Hands-free product discovery.
- **Secure Checkout**: Seamless payment integration via Razorpay.
- **Real-time Tracking**: Track your orders from processing to delivery.
- **Premium Design**: Modern liquid-glass aesthetic with smooth animations.

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Ionicons 5)
- **Animations**: Framer Motion
- **State Management**: React Context API
- **AI Integration**: OpenAI (GPT-4o) / Rasa
- **Database**: MongoDB (via Prisma)
- **Payments**: Razorpay

## 📦 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or pnpm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/CODEWITHAADVIKK/giftgenius.git
   cd giftgenius
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env.local` and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## 🔐 Environment Variables
Refer to `.env.example` for the required keys:
- `DATABASE_URL`: MongoDB connection string
- `NEXTAUTH_SECRET`: Secret for session encryption
- `RAZORPAY_KEY_ID`: Your Razorpay Key ID
- `OPENAI_API_KEY`: For AI recommendations

## 🚢 Deployment
The project is optimized for deployment on **Vercel**. Simply connect your GitHub repository to Vercel and configure the environment variables.

## 📄 License
This project is licensed under the MIT License.
