import React, { useState, useEffect } from 'react';
import OrderModal from './OrderModal';
import useContracts from '../hooks/useContract';
import { useAccount } from 'wagmi';
import styles from '../styles/P2P.module.css';

const formatNumber = (value: string) => {
  const number = parseFloat(value);
  return `${number.toFixed(2)} USDT`;
};

const formatDateExpired = (timestamp: string) => {
  const secondsLeft = parseInt(timestamp) - Math.floor(Date.now() / 1000);
  const daysLeft = Math.ceil(secondsLeft / (60 * 60 * 24));
  return `${daysLeft} Days`;
};

const BuyOrders: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [buyOrders, setBuyOrders] = useState<any[]>([]);
  const { getUserOffers, offersContract } = useContracts();
  const { address } = useAccount();

  useEffect(() => {
    const fetchBuyOrders = async () => {
      if (address && offersContract) {
        try {
          const result = await getUserOffers(address);
          if (result && result[1]) {
            const offers = result[1];
            const filteredOffers = offers.filter((offer: any) => offer.isBuying);
            const formattedOffers = filteredOffers.map((offer: any) => ({
              ...offer,
              amount: formatNumber(offer.amount.toString()),
              unitPrice: formatNumber(offer.unitPrice.toString()),
              totalPrice: formatNumber(offer.totalPrice.toString()),
              minBuyAmount: formatNumber(offer.minBuyAmount.toString()),
              dateExpired: formatDateExpired(offer.dateExpired.toString()),
            }));
            setBuyOrders(formattedOffers);
          } else {
            console.error('Unexpected result format', result);
          }
        } catch (error) {
          console.error('Error fetching buy orders:', error);
        }
      }
    };

    fetchBuyOrders();
  }, [address, offersContract, getUserOffers]);

  return (
    <div className={styles.ordersContainer}>
      <div className={styles.ordersList}>
        <div className={styles.tableHeader}>
          <h2 className={styles.ordersTitle}>Buy Orders</h2>
        </div>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Order Type</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Price</th>
              <th>Limit</th>
              <th>Date Expired</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {buyOrders.map((offer, index) => (
              <tr key={index}>
                <td>Buy NGOLD with USDT</td>
                <td>{offer.status}</td>
                <td>{offer.amount}</td>
                <td>{offer.unitPrice}</td>
                <td>{offer.minBuyAmount} - {offer.totalPrice}</td>
                <td>{offer.dateExpired}</td>
                <td>
                  <button className={styles.buyButton} onClick={() => setShowModal(true)}>Buy</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <OrderModal show={showModal} onClose={() => setShowModal(false)} type="buy" />
    </div>
  );
};

export default BuyOrders;
