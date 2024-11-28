import React, { useState, useEffect } from "react";
import styles from './Whatsapp.module.css';

const WhatsappQr = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isClientReady, setIsClientReady] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch QR code and connection status from the backend
  const fetchWhatsappStatus = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/whatsapp/status");
  
      if (!response.ok) {
        throw new Error("Failed to fetch WhatsApp status");
      }
  
      const data = await response.json();
      setQrCode(data.qrCode); // Update the qrCode state with the latest value
      setIsClientReady(data.isClientReady); // Set the client readiness
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchWhatsappStatus();
  
    // Re-fetch QR code and status every 10 seconds if not ready
    const interval = setInterval(() => {
      if (!isClientReady) {
        fetchWhatsappStatus();
      }
    }, 10000); // Adjust interval as needed
  
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [isClientReady]);
  

  const handleTryAgain = () => {
    setLoading(true);
    setError(null);
    fetchWhatsappStatus();
  };

  if (loading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  if (error || !qrCode) {
    return (
      <div>
        <p className={styles.error}>Couldn’t link device. {error && `Error: ${error}`}</p>
        <button onClick={handleTryAgain} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>WhatsApp Connection</h1>
      <div className={styles.content}>
        <h2 className={styles.subHeader}>Scan the QR code to connect:</h2>
        {qrCode ? (
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?data=${qrCode}&size=200x200`}
            alt="QR Code"
            className={styles.qrCode}
          />
        ) : (
          <p className={styles.noQr}>QR code not available. Please try again.</p>
        )}
      </div>
    </div>
  );
  
};

export default WhatsappQr;
