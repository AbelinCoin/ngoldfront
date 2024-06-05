// components/Navbar.tsx

import React from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from '../styles/Navbar.module.css';

interface NavbarProps {
  goldValue: number;
}



const Navbar: React.FC<NavbarProps> = ({goldValue}) => {
  return (
    <nav className={`navbar navbar-expand-lg navbar-light ${styles.navbar}`}>
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${styles.navbarContent}`} id="navbarNav">
          <div className={styles.navSection}>
            <Link href="/" passHref legacyBehavior>
              <a className={`navbar-brand ${styles.navbarBrand}`}>NGOLD</a>
            </Link>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link href="/p2p" passHref legacyBehavior>
                  <a className={`nav-link ${styles.navLink}`}>P2P</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/staking" passHref legacyBehavior>
                  <a className={`nav-link ${styles.navLink}`}>Staking</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/reward" passHref legacyBehavior>
                  <a className={`nav-link ${styles.navLink}`}>Rewards</a>
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.navSection}>
            <span className={styles.navPrice}>
              Gold live price: <span className={styles.navPriceValue}>${goldValue}</span>
            </span>
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
