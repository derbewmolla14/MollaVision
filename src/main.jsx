import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { ClerkProvider } from '@clerk/react'

const clerkPublishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()
const runtimeConfigErrors = []
const expectedProductionApiUrl =
  'https://mollavision-production.up.railway.app/api'

const getClerkInstanceHost = (publishableKey) => {
  const match = publishableKey?.match(
    /^pk_(?:test|live)_([A-Za-z0-9_-]+)$/
  )

  if (!match) return null

  try {
    const encodedInstance = match[1]
    const base64 = encodedInstance
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const paddedBase64 = base64.padEnd(
      Math.ceil(base64.length / 4) * 4,
      '='
    )

    const decodedInstance = atob(paddedBase64).replace(/\$$/, '')

    return decodedInstance.includes('.')
      ? decodedInstance
      : null
  } catch {
    return null
  }
}

const clerkInstanceHost = getClerkInstanceHost(clerkPublishableKey)

const clerkKeyFormatValid = Boolean(
  clerkPublishableKey &&
  /^pk_(?:test|live)_[A-Za-z0-9_-]+$/.test(clerkPublishableKey) &&
  clerkInstanceHost
)
const apiUrlValid = configuredApiUrl === expectedProductionApiUrl

if (!clerkPublishableKey) {
  runtimeConfigErrors.push(
    'VITE_CLERK_PUBLISHABLE_KEY is required (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is also supported for existing Vercel deployments).'
  )
} else if (!clerkKeyFormatValid) {
  runtimeConfigErrors.push(
    'The Clerk publishable key is not valid. Use the Publishable Key from Clerk Dashboard.'
  )
}

if (import.meta.env.PROD && clerkPublishableKey?.includes('_test_')) {
  runtimeConfigErrors.push('A production Clerk publishable key is required in production (use pk_live_...).')
}

if (import.meta.env.PROD && !apiUrlValid) {
  runtimeConfigErrors.push(`VITE_API_URL must be ${expectedProductionApiUrl} in production.`)
}

if (clerkInstanceHost?.endsWith('.vercel.app')) {
  runtimeConfigErrors.push(
    'The Clerk key points to a Vercel hostname that is not serving Clerk JS. Replace it with the publishable key for the intended *.clerk.accounts.dev instance, unless a verified custom Clerk domain is intentionally configured.'
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
        Clerk could not start because the frontend environment configuration is missing or invalid:
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-red-700">
        {errors.map((error) => <li key={error}>{error}</li>)}
      </ul>
      <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">For the Vercel deployment</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Open Vercel Project Settings, then Environment Variables.</li>
          <li>Add <code className="rounded bg-white px-1 py-0.5">VITE_CLERK_PUBLISHABLE_KEY</code> using the Publishable Key from Clerk Dashboard.</li>
          <li>Enable it for the environment being deployed, then redeploy. Vite reads this value during the build.</li>
        </ol>
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">For local development</p>
        <p className="mt-1">
          Add the same publishable key to the root <code className="rounded bg-slate-50 px-1 py-0.5">.env</code> file, restart Vite, and open <code className="rounded bg-slate-50 px-1 py-0.5">http://localhost:3000</code>.
        </p>
      </div>
      <p className="mt-6 text-xs text-slate-500">
        Only use a <code className="rounded bg-slate-50 px-1 py-0.5">pk_test_...</code> or <code className="rounded bg-slate-50 px-1 py-0.5">pk_live_...</code> publishable key here. Never add <code className="rounded bg-slate-50 px-1 py-0.5">CLERK_SECRET_KEY</code> to frontend variables.
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
