import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import { useState } from 'react';

const Home: NextPage = () => {
  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');

  const isFormValid = fromValue.trim() !== '' && toValue.trim() !== '';

  return (
    <div>
      <Head>
        <title>RainbowKit App</title>
        <meta content="Generated by @rainbow-me/create-rainbowkit" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Navbar />

      <main className={styles.mainContent}>
        <div className={styles.leftSection}>
          <h1 className={styles.textPrimary}>NGOLD</h1>
          <h2>
            <span className={styles.textPrimary}>Decentralized Digital</span>{' '}
            <span className={styles.highlightPrimary}>Gold Token</span>
          </h2>
          <p>
            <span className={styles.textSecondary}>Invest in gold with NGOLD, where </span>
            <span className={styles.textPrimary}>each token represents 1 gram of gold </span>
            <span className={styles.textSecondary}>
              priced by London Gold Fixing. Earn up to 2.5% rewards buying NGOLD on
              DEX-P2P. Note: P2P purchases can't be sold on www.ngold.io/dex, promoting higher transaction volumes and usability.
            </span>
          </p>
          <div className={styles.buttonContainer}>
            <button className={`${styles.whitePaperButton}`}>
              WHITE PAPER <i className="bi bi-download"></i>
            </button>
            <button className={`${styles.buyP2PButton}`}>
              BUY P2P
            </button>
          </div>
        </div>
        <div className={styles.rightSection}>
          <div>
            <h2>Buy NGOLD</h2>
            <span>
              <span className={styles.goldPriceLabel}>London Gold Fix 1 gram:</span>{' '}
              <span className={styles.goldPriceValue}>$77.99</span>
            </span>
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.subContainer}>
              <div className={styles.subContainerHeader}>
                <span className={styles.fromText}>From</span>
                <button className={styles.useMaxText}>Use Max</button>
              </div>
              <div className={styles.subContainerContent}>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={fromValue} 
                  onChange={(e) => setFromValue(e.target.value)} 
                />
                <div>
                  <Image src="/images/Polygon.svg" alt="Polygon" width={20} height={20} />
                  <select id="chains">
                    <option value="DOT">DOT</option>
                  </select>
                  <i className="bi bi-chevron-down"></i>
                </div>
              </div>
              <div className={styles.subContainerFooter}>Balance: 42.069</div>
            </div>
            <div className={styles.subContainer}>
              <div className={styles.subContainerHeader}>
                <span className={styles.fromText}>To</span>
              </div>
              <div className={styles.subContainerContent}>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={toValue} 
                  onChange={(e) => setToValue(e.target.value)} 
                />
                <div>
                  <Image src="/images/Ethereum.svg" alt="Ethereum" width={20} height={20} />
                  <select id="chains">
                    <option value="NGOLD">NGOLD</option>
                  </select>
                  <i className="bi bi-chevron-down"></i>
                </div>
              </div>
              <div className={styles.subContainerFooter}>Balance: 0.00</div>
            </div>
          </div>
          <div className={styles.priceContainer}>
            <span className={styles.priceText}>Price</span>
            <span className={styles.priceValue}>
              0.02319281 NGOLD per DOT <i className="bi bi-arrow-repeat"></i>
            </span>
          </div>
          <button 
            className={`${styles.buyButton} ${isFormValid ? styles.buyButtonActive : ''}`}
            disabled={!isFormValid}
          >
            {isFormValid ? 'BUY NGOLD' : 'Enter A Mount'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
