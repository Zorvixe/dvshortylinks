// Alternative implementation with setInterval
"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdSlot from "../../AdSlot";

const ADS_CLIENT = process.env.REACT_APP_ADSENSE_CLIENT;
const ADS_SLOT = process.env.REACT_APP_ADSENSE_SLOT;
const ADS_TEST = process.env.REACT_APP_ADSENSE_TEST === "true";

export default function AdRedirect() {
  const { slug } = useParams();
  const [countdown, setCountdown] = useState(10);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Handle redirect
  const handleRedirect = () => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    navigate(`/final-redirect/${slug}`);
  };

  // Handle skip
  const handleSkip = () => {
    handleRedirect();
  };

  // Setup countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []); // Empty dependency array - timer setup only once

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h2 style={styles.title}>Hold on! We're getting your link ready</h2>
          <p style={styles.subtitle}>Thank you for supporting our free service</p>
        </div>
        
        <div style={styles.adContainer}>
          {ADS_CLIENT && ADS_SLOT ? (
            <AdSlot
              client={ADS_CLIENT}
              slot={ADS_SLOT}
              format="auto"
              fullWidth
              test={ADS_TEST}
              style={styles.adSlot}
            />
          ) : (
            <div style={styles.placeholderAd}>
              <div style={styles.placeholderIcon}>
                <i className="fas fa-ad" style={{fontSize: '32px', color: '#6366F1'}}></i>
              </div>
              <p style={styles.placeholderText}>
                Ad is not configured. Set REACT_APP_ADSENSE_CLIENT and REACT_APP_ADSENSE_SLOT.
              </p>
            </div>
          )}
        </div>
        
        <div style={styles.countdownSection}>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${(countdown / 10) * 100}%`
              }} 
            />
          </div>
          
          <p style={styles.countdownText}>
            Redirecting in <strong style={styles.countdownNumber}>{countdown}</strong> second{countdown !== 1 ? 's' : ''}…
          </p>
          
          <button 
            onClick={handleSkip}
            style={{
              ...styles.skipButton,
              ...(isRedirecting && { opacity: 0.7, cursor: 'not-allowed' })
            }}
            onMouseOver={(e) => !isRedirecting && (e.target.style.backgroundColor = '#4F46E5')}
            onMouseOut={(e) => !isRedirecting && (e.target.style.backgroundColor = '#6366F1')}
            disabled={isRedirecting}
          >
            {isRedirecting ? 'Redirecting...' : 'Skip Ad'}
          </button>
        </div>
      </div>
    </div>
  );
}
// Styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f8fafc',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif'
  },
  content: {
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%'
  },
  header: {
    marginBottom: '24px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: '0'
  },
  adContainer: {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    width: '100%',
    margin: '0 auto 24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#fff'
  },
  adSlot: {
    minHeight: '250px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderAd: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '250px',
    padding: '20px'
  },
  placeholderIcon: {
    marginBottom: '16px'
  },
  placeholderText: {
    color: '#6b7280',
    margin: '0',
    fontSize: '14px'
  },
  countdownSection: {
    padding: '16px'
  },
  progressBar: {
    height: '6px',
    backgroundColor: '#e5e7eb',
    borderRadius: '3px',
    marginBottom: '20px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: '3px',
    transition: 'width 1s linear'
  },
  countdownText: {
    fontSize: '18px',
    color: '#4b5563',
    margin: '0 0 16px 0'
  },
  countdownNumber: {
    color: '#6366F1',
    fontSize: '24px'
  },
  skipButton: {
    backgroundColor: '#6366F1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
  }
};