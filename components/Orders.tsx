import React, { useState, useEffect } from 'react';
import styles from '../styles/P2P.module.css';
import PostOrderModal from './PostOrderModal';
import useContracts from '../hooks/useContract';
import { useAccount } from 'wagmi';

const Orders: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [userOffers, setUserOffers] = useState([]);
  const [pendingOffers, setPendingOffers] = useState([]);
  const { getUserOffers, getPendingOffers } = useContracts();
  const { address } = useAccount();

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchOffers = async () => {
      if (address) {
        try {
          const userOffersResult = await getUserOffers(address);
          const userOffersWithId = userOffersResult.offerIds.map((id, index) => ({
            id,
            ...userOffersResult.offers[index]
          }));
          setUserOffers(userOffersWithId);

          const pendingOffersResult = await getPendingOffers();
          const pendingOffersWithId = pendingOffersResult.offerIds.map((id, index) => ({
            id,
            ...pendingOffersResult.offers[index]
          }));
          setPendingOffers(pendingOffersWithId);
        } catch (error) {
          console.error('Error fetching offers', error);
        }
      }
    };

    fetchOffers();
  }, [address, getUserOffers, getPendingOffers]);

  return (
    <div className={styles.ordersContainer}>
      <div className={styles.ordersHeader}>
        <h2 className={styles.ordersTitle}>
          {userOffers.length === 0 ? 'You do not have any orders.' : 'Your Orders'}
        </h2>
        {userOffers.length === 0 && (
          <span className={styles.ordersDescription}>
            Create an ad for sell or buy NGOLD without commissions
          </span>
        )}
      </div>
      <div className={styles.ordersContent}>
        <button className={styles.postOrderButton} onClick={handleOpenModal}>
          Post Order
        </button>
        {userOffers.length > 0 && (
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Unit Price</th>
                <th>Total Price</th>
                <th>Min Buy Amount</th>
                <th>Token Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {userOffers.map((offer) => (
                <tr key={offer.id}>
                  <td>{offer.id}</td>
                  <td>{offer.amount}</td>
                  <td>{offer.unitPrice}</td>
                  <td>{offer.totalPrice}</td>
                  <td>{offer.minBuyAmount}</td>
                  <td>{offer.tokenType}</td>
                  <td>{offer.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* {pendingOffers.length > 0 && (
          <div>
            <h3 className={styles.ordersSubtitle}>Pending Offers</h3>
            <table className={styles.ordersTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Unit Price</th>
                  <th>Total Price</th>
                  <th>Min Buy Amount</th>
                  <th>Token Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingOffers.map((offer) => (
                  <tr key={offer.id}>
                    <td>{offer.id}</td>
                    <td>{offer.amount}</td>
                    <td>{offer.unitPrice}</td>
                    <td>{offer.totalPrice}</td>
                    <td>{offer.minBuyAmount}</td>
                    <td>{offer.tokenType}</td>
                    <td>{offer.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )} */}
      </div>
      <PostOrderModal show={showModal} onClose={handleCloseModal} />
    </div>
  );
};

export default Orders;
