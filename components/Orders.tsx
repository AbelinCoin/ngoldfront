// components/Orders.tsx

import React, { useState, useEffect } from 'react';
import styles from '../styles/P2P.module.css';
import PostOrderModal from './PostOrderModal';
import useContracts from '../hooks/useContract';
import { useAccount } from 'wagmi';

const convertionToAcceptedValue = (value: number) => {
  return Math.round(value * 10 ** 9);
};

const Orders: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [userOffers, setUserOffers] = useState<any[]>([]);
  const { getUserOffers, offersContract } = useContracts();
  const { address } = useAccount();

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchUserOffers = async () => {
      if (address && offersContract) {
        try {
          const result = await getUserOffers(address);
          if (result && result[1]) {
            const offers = result[1];
            // Convertimos los valores BigInt a String
            const formattedOffers = offers.map((offer: any) => ({
              ...offer,
              amount: offer.amount.toString(),
              unitPrice: offer.unitPrice.toString(),
              totalPrice: offer.totalPrice.toString(),
              minBuyAmount: offer.minBuyAmount.toString(),
              dateCreated: offer.dateCreated.toString(),
              dateExpired: offer.dateExpired.toString(),
              isBuying: offer.isBuying.toString(),
            }));
            setUserOffers(formattedOffers);
          } else {
            console.error('Unexpected result format', result);
          }
        } catch (error) {
          console.error('Error fetching user offers:', error);
        }
      }
    };

    fetchUserOffers();
  }, [address, offersContract, getUserOffers]);

  return (
    <div className={styles.ordersContainer}>
      {userOffers.length === 0 ? (
        <>
          <div className={styles.ordersHeader}>
            <h2 className={styles.ordersTitle}>You do not have any orders.</h2>
            <span className={styles.ordersDescription}>
              Create an ad for sell or buy NGOLD without comissions
            </span>
          </div>
          <div className={styles.ordersContent}>
            <button className={styles.postOrderButton} onClick={handleOpenModal}>Post Order</button>
          </div>
        </>
      ) : (
        <div className={styles.ordersList}>
          <h2 className={styles.ordersTitle}>Your Orders</h2>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Unit Price</th>
                <th>Total Price</th>
                <th>Min Buy Amount</th>
                <th>Status</th>
                <th>Date Created</th>
                <th>Date Expired</th>
                <th>Token Type</th>
                <th>Is Buying</th>
              </tr>
            </thead>
            <tbody>
              {userOffers.map((offer, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{offer.amount}</td>
                  <td>{offer.unitPrice}</td>
                  <td>{offer.totalPrice}</td>
                  <td>{offer.minBuyAmount}</td>
                  <td>{offer.status}</td>
                  <td>{new Date(parseInt(offer.dateCreated) * 1000).toLocaleString()}</td>
                  <td>{new Date(parseInt(offer.dateExpired) * 1000).toLocaleString()}</td>
                  <td>{offer.tokenType}</td>
                  <td>{offer.isBuying === 'true' ? 'Buying' : 'Selling'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <PostOrderModal show={showModal} onClose={handleCloseModal} />
    </div>
  );
};

export default Orders;
