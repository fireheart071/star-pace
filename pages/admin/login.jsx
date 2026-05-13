import React from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
const Lock = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
)
const User = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
)
const ArrowRight = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
)

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
        <title>Secure Access | Atlas Rent-A-Car</title>
      </Head>

      <div className="login-container">
        <div className="login-card">
          <div className="login-brand">
            <div className="brand-logo">
              ATLAS
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
            Atlas Rent-A-Car &bull; Professional Division
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          padding: 24px;
          font-family: 'Inter', sans-serif;
        }

        .login-container {
          width: 100%;
          max-width: 400px;
        }

        .login-brand {
          text-align: center;
          margin-bottom: 56px;
        }

        .brand-logo {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          color: #24276F;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .brand-marker {
          font-size: 10px;
          font-weight: 800;
          color: #64748B;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }

        .login-form {
          display: grid;
          gap: 32px;
        }

        .login-field label {
          display: block;
          font-size: 10px;
          font-weight: 800;
          color: #64748B;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .login-field input {
          width: 100%;
          height: 48px;
          background: transparent;
          border: none;
          border-bottom: 2px solid #F1F5F9;
          padding: 0;
          color: #0F172A;
          font-size: 14px;
          font-weight: 500;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .login-field input:focus {
          border-color: #24276F;
        }

        .login-error {
          height: 14px;
          color: #DC2626;
          font-size: 11px;
          font-weight: 700;
          text-align: center;
        }

        .login-submit {
          height: 48px;
          background: #24276F;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 16px;
          letter-spacing: 0.5px;
        }

        .login-submit:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .login-submit:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .login-footer {
          margin-top: 64px;
          text-align: center;
          color: #64748B;
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
