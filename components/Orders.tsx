import React, { useState, useEffect } from 'react';
import styles from '../styles/P2P.module.css';
import PostOrderModal from './PostOrderModal';
import useContracts from '../hooks/useContract';
import { useAccount } from 'wagmi';

const convertionToAcceptedValue = (value: number) => {
  return Math.round(value * 10 ** 9);
};

const formatNumber = (value: string) => {
  const number = parseFloat(value);
  return `${number.toFixed(2)} USDT`;
};

const formatDateExpired = (timestamp: string) => {
  const secondsLeft = parseInt(timestamp) - Math.floor(Date.now() / 1000);
  const daysLeft = Math.ceil(secondsLeft / (60 * 60 * 24));
  return `${daysLeft} Days`;
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
            const formattedOffers = offers.map((offer: any) => ({
              ...offer,
              amount: formatNumber(offer.amount.toString()),
              unitPrice: formatNumber(offer.unitPrice.toString()),
              totalPrice: formatNumber(offer.totalPrice.toString()),
              minBuyAmount: formatNumber(offer.minBuyAmount.toString()),
              dateCreated: offer.dateCreated.toString(),
              dateExpired: formatDateExpired(offer.dateExpired.toString()),
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
          <div className={styles.tableHeader}>
            <h2 className={styles.ordersTitle}>Your Orders</h2>
            <button className={styles.postOrderButton} onClick={handleOpenModal}>Post Order</button>
          </div>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>Order Type</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Price</th>
                <th>Limit</th>
                <th>Time left</th>
              </tr>
            </thead>
            <tbody>
              {userOffers.map((offer, index) => (
                <tr key={index}>
                  <td>{offer.isBuying === 'true' ? 'Buy NGOLD with USDT' : 'Sell NGOLD for USDT'}</td>
                  <td>{offer.status}</td>
                  <td>{offer.amount}</td>
                  <td>{offer.unitPrice}</td>
                  <td>{offer.minBuyAmount} - {offer.totalPrice}</td>
                  <td>{offer.dateExpired}</td>
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
