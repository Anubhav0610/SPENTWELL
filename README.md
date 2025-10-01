# 💰 Personal Finance Tracker

A modern, full-stack personal finance management application built with React, TypeScript, and Supabase. Track expenses, set budgets, manage savings goals, calculate debt payoff plans, and get AI-powered financial guidance.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)

## 🌟 Features

### Core Functionality
- **Expense Tracking**: Add, view, and categorize expenses with date tracking
- **Budget Management**: Set monthly budgets and track spending against targets
- **Real-time Dashboard**: Visual analytics with spending breakdown charts (pie & bar charts)
- **Transaction History**: View recent transactions with category-based filtering
- **Savings Goals**: Set and track progress toward financial goals with monthly spending limits

### Advanced Features
- **AI Financial Guide**: Chat with Gemini-powered AI assistant for personalized financial advice
- **Debt Payoff Calculator**: Calculate debt payoff plans using the avalanche method
  - Support for multiple debts
  - Interest calculation
  - Timeline visualization
  - Extra payment optimization
- **Responsive Design**: Fully responsive UI that works on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme support for user preference
- **Secure Authentication**: Email-based authentication with auto-confirm

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Shadcn/ui**: High-quality accessible component library
- **Recharts**: Data visualization library for charts
- **React Router**: Client-side routing
- **Lucide React**: Icon library

### Backend
- **Supabase (Lovable Cloud)**: 
  - PostgreSQL database with Row Level Security (RLS)
  - Authentication & user management
  - Edge Functions for serverless logic
  - Real-time subscriptions
- **Lovable AI Gateway**: AI model access (Gemini 2.5)

### State Management & Data Fetching
- **React Hooks**: useState, useEffect, custom hooks
- **Supabase Client**: Real-time data synchronization
- **TanStack Query**: Server state management

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **date-fns**: Date manipulation

## 📊 Database Schema

### Tables
1. **expenses**
   - id (uuid, primary key)
   - user_id (uuid, foreign key)
   - title (text)
   - amount (numeric)
   - category (text)
   - date (date)
   - created_at (timestamp)

2. **budgets**
   - id (uuid, primary key)
   - user_id (uuid, foreign key)
   - amount (numeric)
   - created_at (timestamp)
   - updated_at (timestamp)

3. **savings_goals**
   - id (uuid, primary key)
   - user_id (uuid, foreign key)
   - name (text)
   - target_amount (numeric)
   - current_amount (numeric)
   - deadline (date)
   - created_at (timestamp)

### Security
- Row Level Security (RLS) policies on all tables
- User-specific data isolation
- Secure authentication flow

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Supabase account (provided via Lovable Cloud)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd personal-finance-tracker
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Environment variables are pre-configured via Lovable Cloud:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `LOVABLE_API_KEY` (for AI features)

4. Run the development server:
```bash
npm run dev
# or
bun run dev
```

5. Open [http://localhost:8080](http://localhost:8080) in your browser

## 📱 Application Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard-specific components
│   ├── modals/            # Modal containers
│   ├── ui/                # Reusable UI components (shadcn)
│   ├── ai-guide.tsx       # AI chat interface
│   ├── budget-form.tsx    # Budget management
│   ├── debt-calculator.tsx # Debt payoff calculator
│   ├── expense-form.tsx   # Expense entry
│   ├── savings-goals.tsx  # Savings goal tracker
│   ├── spending-chart.tsx # Data visualization
│   └── recent-transactions.tsx
├── hooks/                 # Custom React hooks
│   ├── useAuth.tsx
│   ├── useBudget.tsx
│   └── use-mobile.tsx
├── pages/                 # Route pages
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   ├── Landing.tsx
│   └── NotFound.tsx
├── integrations/
│   └── supabase/          # Supabase client & types
├── lib/
│   └── utils.ts           # Utility functions
└── main.tsx               # App entry point

supabase/
├── functions/
│   └── ai/                # Edge function for AI chat
└── migrations/            # Database migrations
```

## 🎨 Design System

The app uses a custom design system with:
- Semantic color tokens (HSL-based)
- Consistent spacing and typography
- Shadow and animation utilities
- Responsive breakpoints
- Dark mode support

All styling is managed through:
- `src/index.css` - Global styles and CSS variables
- `tailwind.config.ts` - Tailwind configuration
- Component-level Tailwind classes

## 🔐 Security Features

- **Row Level Security**: All database operations are secured with RLS policies
- **Authentication**: Secure email-based auth with Supabase
- **API Key Management**: Backend secrets stored securely
- **CORS Protection**: Properly configured CORS headers
- **Input Validation**: Client and server-side validation
- **XSS Protection**: React's built-in XSS prevention

## 🧪 Key Features Explained

### AI Financial Guide
Uses Lovable AI Gateway with Gemini 2.5 Flash model to provide:
- Budgeting advice
- Expense analysis
- Savings recommendations
- Debt management strategies

### Debt Calculator
Implements the **Avalanche Method**:
1. Sorts debts by interest rate (highest first)
2. Allocates minimum payments to all debts
3. Applies extra payments to highest-interest debt
4. Calculates total interest saved and payoff timeline

### Responsive Dashboard
- Grid-based layout with CSS Grid
- Mobile-first design
- Touch-friendly interface
- Optimized chart rendering

## 📈 Performance Optimizations

- Code splitting with React Router
- Lazy loading of heavy components
- Optimized re-renders with React.memo
- Debounced input handlers
- Efficient database queries with indexes
- CDN-delivered assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for the component library
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Lovable](https://lovable.dev/) for the development platform
- [Recharts](https://recharts.org/) for data visualization

## 📞 Support

For questions or support, please open an issue on GitHub.

---

## 📝 Additional Documentation

- **[RESUME_POINTS.md](./RESUME_POINTS.md)** - Resume bullet points and project highlights
- **[INTERVIEW_PREP.md](./INTERVIEW_PREP.md)** - Comprehensive interview preparation guide

---

**Built with ❤️ using Lovable, React, and Supabase**
