import '../styles.css'
import '../styles/admin.css'
import React from 'react'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import { useRouter } from 'next/router'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const isAdmin = router.pathname.startsWith('/admin')
  const hideLayout = Component.noLayout === true || isAdmin

  return (
    <div className="app-root">
      <Head>
        <title>Atlas Rent-A-Car | Luxury Vehicle Rentals & Private Mobility</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#071029" />
      </Head>
      <a className="skip-link" href="#site-main">Skip to content</a>
      {!hideLayout && <Navbar />}
      <main id="site-main">
        <Component {...pageProps} />
      </main>
      {!hideLayout && <Footer />}

      {!hideLayout && (
        <div 
          className="whatsapp-container"
          style={{
            position: 'fixed',
            bottom: '60px',
            right: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            zIndex: 1000,
          }}
        >
        <div className="whatsapp-bubble" style={{
          background: '#fff',
          padding: '12px 24px',
          borderRadius: '50px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          fontSize: '14px',
          fontWeight: '800',
          color: '#071029',
          whiteSpace: 'nowrap',
          letterSpacing: '0.05em',
          pointerEvents: 'none',
          transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: 0,
          transform: 'translateX(20px)',
        }}>
          NEED HELP? CHAT NOW
        </div>
        <a 
          href="https://wa.me/233202225878" 
          target="_blank" 
          rel="noopener noreferrer"
          className="whatsapp-float"
          style={{
            backgroundColor: '#25D366',
            color: '#fff',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(37, 211, 102, 0.3)',
            transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 15px 30px rgba(37, 211, 102, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 211, 102, 0.3)';
          }}
        >
          <svg 
            viewBox="0 0 448 512" 
            width="32" 
            height="32" 
            fill="currentColor"
          >
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.6-2.8-23.6-8.7-45-27.7-16.6-14.9-27.9-33.2-31.1-38.8-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.2 3.7-5.5 5.6-9.2 1.9-3.7 1-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
        </a>
      </div>
      )}
      <style jsx global>{`
        @keyframes whatsapp-pulse {
          0% {
            box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3);
          }
          50% {
            box-shadow: 0 10px 35px rgba(37, 211, 102, 0.6);
            transform: scale(1.05);
          }
          100% {
            box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3);
          }
        }
        .whatsapp-float {
          animation: whatsapp-pulse 2s infinite ease-in-out;
        }
        .whatsapp-float:hover {
          animation: none;
        }
        .whatsapp-container:hover .whatsapp-bubble {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
      `}</style>
    </div>
  )
}
