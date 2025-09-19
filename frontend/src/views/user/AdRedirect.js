"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Adsterra configuration
const ADSTERRA_KEY = process.env.REACT_APP_ADSTERRA_KEY || "3893808e3f04313ac053931b10998967";

export default function AdRedirect() {
  const { slug } = useParams();
  const [countdown, setCountdown] = useState(10);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const adContainerRef = useRef(null);

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

  // Load Adsterra ad script
  useEffect(() => {
    // Create the Adsterra script
    const script = document.createElement('script');
    script.innerHTML = `
      atOptions = {
        'key' : '${ADSTERRA_KEY}',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;
    
    // Create the second script that loads the ad
    const script2 = document.createElement('script');
    script2.src = "//www.highperformanceformat.com/3893808e3f04313ac053931b10998967/invoke.js";
    script2.async = true;
    
    // Add scripts to document
    document.head.appendChild(script);
    document.head.appendChild(script2);
    
    return () => {
      // Cleanup if component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (document.head.contains(script2)) {
        document.head.removeChild(script2);
      }
    };
  }, []);

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
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h2 style={styles.title}>Hold on! We're getting your link ready</h2>
          <p style={styles.subtitle}>Thank you for supporting our free service</p>
        </div>
        
        <div style={styles.adContainer} ref={adContainerRef}>
          {/* Adsterra ad will be injected here */}
          <div id="container-3893808e3f04313ac053931b10998967"></div>
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
    backgroundColor: '#fff',
    minHeight: '250px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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