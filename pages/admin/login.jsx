import React from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: email, pass: password })
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body?.message || 'Login failed')
      localStorage.setItem('admin_token', body.token)
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err.message || String(err))
    } finally { setLoading(false) }
  }

  return (
    <div className="login-page">
      <Head>
        <title>Secure Access | Star Pace Administration</title>
      </Head>

      <div className="login-container">
        <div className="login-card">
          <div className="login-brand">
            <div className="brand-logo">
              STAR PACE
            </div>
            <div className="brand-marker">
              Elite Administration
            </div>
          </div>

          <form onSubmit={submit} className="login-form">
            <div className="login-field">
              <label>Service Identity</label>
              <input
                placeholder="Administrator Identity"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label>Access Key</label>
              <input
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? 'Authenticating...' : 'Establish Connection'}
            </button>
          </form>

          <div className="login-footer">
            Star Pace &bull; Executive Portal
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          padding: 24px;
          font-family: 'Inter', sans-serif;
        }

        .login-container {
          width: 100%;
          max-width: 420px;
        }

        .login-card {
          background: rgba(12, 18, 32, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 48px 40px;
          box-shadow: var(--shadow-glow);
        }

        .login-brand {
          text-align: center;
          margin-bottom: 48px;
        }

        .brand-logo {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: 0.15em;
          margin-bottom: 8px;
        }

        .brand-marker {
          font-size: 10px;
          font-weight: 800;
          color: var(--brand-fleet);
          letter-spacing: 0.25em;
          text-transform: uppercase;
        }

        .login-form {
          display: grid;
          gap: 28px;
        }

        .login-field label {
          display: block;
          font-size: 9px;
          font-weight: 800;
          color: var(--text-secondary);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .login-field input {
          width: 100%;
          height: 48px;
          background: transparent;
          border: none;
          border-bottom: 2px solid var(--glass-border);
          padding: 0;
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .login-field input:-webkit-autofill,
        .login-field input:-webkit-autofill:hover, 
        .login-field input:-webkit-autofill:focus, 
        .login-field input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #0c1220 inset !important;
          -webkit-text-fill-color: #ffffff !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        .login-field input:focus {
          border-color: var(--brand-fleet);
        }

        .login-field input::placeholder {
          color: var(--text-muted);
        }

        .login-error {
          height: 14px;
          color: #ef4444;
          font-size: 12px;
          font-weight: 700;
          text-align: center;
        }

        .login-submit {
          height: 52px;
          background: var(--brand-fleet);
          color: #070B18;
          border: none;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          box-shadow: 0 10px 30px rgba(56, 189, 248, 0.2);
        }

        .login-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(56, 189, 248, 0.3);
        }

        .login-submit:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .login-footer {
          margin-top: 48px;
          text-align: center;
          color: var(--text-muted);
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
      `}</style>
    </div>
  )
}

AdminLogin.noLayout = true
