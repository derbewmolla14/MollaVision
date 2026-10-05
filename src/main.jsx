import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { ClerkProvider } from '@clerk/react'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const clerkAppearance = {
  layout: {
    logoPlacement: 'inside',
    logoImageUrl: '/mollavision-signature.png',
  },
  variables: {
    colorPrimary: '#2563eb',
    colorText: '#0f172a',
    colorTextSecondary: '#475569',
    colorBackground: '#ffffff',
    borderRadius: '0.75rem',
    fontFamily: 'inherit',
  },
  elements: {
    card: 'shadow-xl shadow-slate-200/60 border border-slate-200',
    headerTitle: 'text-slate-900',
    headerSubtitle: 'text-slate-500',
    logoBox: 'mb-4',
    formFieldInput: 'border-slate-300 focus:border-blue-500 focus:ring-blue-100',
    formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
    socialButtonsBlockButton: 'border-slate-300 hover:bg-slate-50',
    footerActionLink: 'text-blue-600 hover:text-blue-700',
  },
  unsafe_disableDevelopmentModeWarnings: import.meta.env.DEV,
}

const clerkLocalization = {
  signIn: {
    start: {
      title: 'Sign in to MollaVision',
      subtitle: 'Welcome back! Please sign in to continue learning.',
    },
  },
  signUp: {
    start: {
      title: 'Create your MollaVision account',
      subtitle: 'Start learning with MollaVision today.',
    },
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey} appearance={clerkAppearance} localization={clerkLocalization}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ClerkProvider>
  </React.StrictMode>,
)
