import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { ClerkProvider } from '@clerk/react'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()
const runtimeConfigErrors = []
const expectedProductionApiUrl = 'https://mollavision-production.up.railway.app/api'

const getClerkInstanceHost = (publishableKey) => {
  const encodedInstance = publishableKey?.match(/^pk_(?:test|live)_([A-Za-z0-9_-]+)$/)?.[1]
  if (!encodedInstance) return null

  try {
    const base64 = encodedInstance.replace(/-/g, '+').replace(/_/g, '/')
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const decodedInstance = atob(paddedBase64).replace(/\$$/, '')
    return decodedInstance.includes('.') ? decodedInstance : null
  } catch {
    return null
  }
}

const clerkInstanceHost = getClerkInstanceHost(clerkPublishableKey)
const clerkKeyFormatValid = Boolean(
  clerkPublishableKey
  && /^pk_(?:test|live)_[A-Za-z0-9_-]+$/.test(clerkPublishableKey)
  && clerkInstanceHost
)
const apiUrlValid = configuredApiUrl === expectedProductionApiUrl

if (!clerkPublishableKey) {
  runtimeConfigErrors.push('VITE_CLERK_PUBLISHABLE_KEY is required.')
} else if (!clerkKeyFormatValid) {
  runtimeConfigErrors.push('VITE_CLERK_PUBLISHABLE_KEY is not a valid Clerk publishable key.')
}

if (import.meta.env.PROD && clerkPublishableKey?.includes('_test_')) {
  runtimeConfigErrors.push('A production Clerk publishable key is required in production (use pk_live_...).')
}

if (import.meta.env.PROD && !apiUrlValid) {
  runtimeConfigErrors.push(`VITE_API_URL must be ${expectedProductionApiUrl} in production.`)
}

if (import.meta.env.PROD && clerkInstanceHost?.endsWith('.vercel.app')) {
  runtimeConfigErrors.push(
    'The production Clerk key points to a Vercel hostname. Use the publishable key for the intended *.clerk.accounts.dev instance unless a verified custom Clerk domain is required.'
  )
}

if (import.meta.env.VITE_CLERK_JS_URL) {
  runtimeConfigErrors.push(
    'Remove VITE_CLERK_JS_URL from Vercel. Clerk JS must use its supported default loader unless a verified Clerk proxy is intentionally configured.'
  )
}

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

const RuntimeConfigurationError = ({ errors }) => (
  <div className="min-h-screen bg-slate-50 px-4 py-16">
    <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">MollaVision configuration error</h1>
      <p className="mt-2 text-slate-600">
        The production bundle loaded, but required environment variables are missing or invalid:
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-red-700">
        {errors.map((error) => <li key={error}>{error}</li>)}
      </ul>
      <p className="mt-6 text-sm text-slate-600">
        Update your Vercel project environment variables and redeploy.
      </p>
    </div>
  </div>
)

if (runtimeConfigErrors.length) {
  console.error('Runtime configuration validation failed:', {
    VITE_CLERK_PUBLISHABLE_KEY: {
      present: Boolean(clerkPublishableKey),
      valid: clerkKeyFormatValid,
    },
    VITE_API_URL: {
      present: Boolean(configuredApiUrl),
      valid: apiUrlValid,
    },
    errors: runtimeConfigErrors,
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {runtimeConfigErrors.length ? (
      <RuntimeConfigurationError errors={runtimeConfigErrors} />
    ) : (
      <ClerkProvider publishableKey={clerkPublishableKey} appearance={clerkAppearance} localization={clerkLocalization}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ClerkProvider>
    )}
  </React.StrictMode>,
)
