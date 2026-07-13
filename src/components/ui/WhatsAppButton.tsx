import { useState, useEffect } from 'react'
import { useStore } from '../../context/StoreContext'

const WA_NUMBER = '918334816333'

function buildWAUrl(name?: string | null) {
  const greeting = name ? `Hi! I'm ${name}.` : `Hi!`
  const message = encodeURIComponent(
    `${greeting} I visited boutiquefashion.shop and have a few queries:\n\nPlease help me! 🛍️`
  )
  return `https://wa.me/${WA_NUMBER}?text=${message}`
}

export default function WhatsAppButton() {
  const { user } = useStore()
  const [visible, setVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [pulse, setPulse] = useState(true)

  // Show button after 3 seconds
  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 3000)
    // Stop pulse after 8 seconds (don't be annoying)
    const pulseTimer = setTimeout(() => setPulse(false), 8000)
    // Show tooltip once after 5 seconds
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 4000)
    }, 5000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(pulseTimer)
      clearTimeout(tooltipTimer)
    }
  }, [])

  const handleClick = () => {
    window.open(buildWAUrl(user?.name), '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className="whatsapp-fab-wrapper"
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '10px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Tooltip bubble */}
      <div
        style={{
          background: '#fff',
          color: '#1a1a1a',
          padding: '10px 16px',
          borderRadius: '12px',
          fontSize: '13px',
          fontFamily: 'inherit',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          whiteSpace: 'nowrap',
          border: '1px solid #e8e0d4',
          opacity: showTooltip ? 1 : 0,
          transform: showTooltip ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          pointerEvents: 'none',
          maxWidth: '220px',
          whiteSpaceCollapse: 'preserve' as never,
          lineHeight: '1.5',
        }}
      >
        <span style={{ fontWeight: 600 }}>Need styling advice?</span>
        <br />
        <span style={{ color: '#6b6b6b', fontSize: '12px' }}>
          Chat with us on WhatsApp! 💬
        </span>
        {/* Arrow */}
        <div
          style={{
            position: 'absolute',
            bottom: '-7px',
            right: '20px',
            width: '14px',
            height: '14px',
            background: '#fff',
            border: '1px solid #e8e0d4',
            borderTop: 'none',
            borderLeft: 'none',
            transform: 'rotate(45deg)',
          }}
        />
      </div>

      {/* Main Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Chat with us on WhatsApp"
        style={{
          position: 'relative',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.5)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseDown={(e) => {
          const el = e.currentTarget
          el.style.transform = 'scale(0.92)'
        }}
        onMouseUp={(e) => {
          const el = e.currentTarget
          el.style.transform = 'scale(1.08)'
          setTimeout(() => { el.style.transform = 'scale(1)' }, 150)
        }}
      >
        {/* Pulse rings */}
        {pulse && (
          <>
            <span
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid rgba(37,211,102,0.6)',
                animation: 'wa-pulse 2s ease-out infinite',
              }}
            />
            <span
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid rgba(37,211,102,0.4)',
                animation: 'wa-pulse 2s ease-out 0.4s infinite',
              }}
            />
          </>
        )}

        {/* WhatsApp SVG Icon */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '34px', height: '34px' }}
        >
          <path
            d="M16 2C8.268 2 2 8.268 2 16c0 2.462.666 4.77 1.83 6.754L2 30l7.478-1.796A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"
            fill="white"
          />
          <path
            d="M16 4.5C9.649 4.5 4.5 9.649 4.5 16c0 2.21.638 4.271 1.74 6.013l.28.446-1.19 4.343 4.46-1.17.43.254A11.45 11.45 0 0016 27.5c6.351 0 11.5-5.149 11.5-11.5S22.351 4.5 16 4.5z"
            fill="#25D366"
          />
          <path
            d="M21.965 19.22c-.29-.146-1.716-.847-1.981-.944-.265-.097-.458-.146-.651.146-.193.29-.748.944-.916 1.138-.169.193-.338.218-.628.073-.29-.146-1.225-.452-2.333-1.44-.862-.769-1.444-1.719-1.613-2.01-.169-.29-.018-.447.127-.592.13-.13.29-.34.435-.51.145-.168.193-.29.29-.483.096-.193.048-.362-.024-.508-.073-.145-.651-1.57-.892-2.148-.234-.563-.472-.486-.651-.495l-.556-.01c-.193 0-.507.073-.772.362-.266.29-1.013.99-1.013 2.415s1.037 2.8 1.182 2.993c.145.193 2.04 3.115 4.943 4.368.69.298 1.229.476 1.648.61.693.22 1.323.189 1.821.114.555-.083 1.716-.701 1.957-1.378.24-.676.24-1.256.169-1.378-.072-.121-.264-.193-.554-.338z"
            fill="white"
          />
        </svg>

        {/* Green dot indicator */}
        <span
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '12px',
            height: '12px',
            background: '#00e676',
            borderRadius: '50%',
            border: '2px solid white',
          }}
        />
      </button>

      {/* CSS for pulse animation */}
      <style>{`
        @keyframes wa-pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .whatsapp-fab-wrapper button:hover {
          transform: scale(1.08) !important;
          box-shadow: 0 6px 28px rgba(37, 211, 102, 0.65) !important;
        }
      `}</style>
    </div>
  )
}
