// components/Orders.tsx

import React, { useState } from 'react';
import styles from '../styles/P2P.module.css';
import PostOrderModal from './PostOrderModal';

const Orders: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.ordersContainer}>
      <div className={styles.ordersHeader}>
        <h2 className={styles.ordersTitle}>You do not have any orders.</h2>
        <span className={styles.ordersDescription}>
          Create an ad for sell or buy NGOLD without comissions
        </span>
      </div>
      <div className={styles.ordersContent}>
        <button className={styles.postOrderButton} onClick={handleOpenModal}>Post Order</button>
      </div>
      <PostOrderModal show={showModal} onClose={handleCloseModal} />
    </div>
  );
};

export default Orders;
