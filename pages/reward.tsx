import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import styles from '../styles/Staking.module.css';
import { useAccount } from 'wagmi';
import useContracts from '../hooks/useContract';

const Reward: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { contract, getPurchases, claimReward } = useContracts();
  const rowsPerPage = 8;
  const totalRows = 0; // Change this to the total number of stake entries
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const { address } = useAccount();
  const [fetched, setFetched] = useState(false);
  const [goldValue, setGoldValue] = useState<number>(1);
  const [purchases, setPurchases] = useState([]);
  const JSONtest = {
    "timestamp":1717178838,
    "metal":"XAU",
    "currency":"USD",
    "exchange":"FOREXCOM",
    "symbol":"FOREXCOM:XAUUSD",
    "prev_close_price":2343.2,
    "open_price":2343.2,
    "low_price":2324.025,
    "high_price":2359.74,
    "open_time":1717113600,
    "price":2325.65,
    "ch":-17.55,
    "chp":-0.75,
    "ask":2326.09,
    "bid":2325.46,
    "price_gram_24k":74.7714,
    "price_gram_22k":68.5404,
    "price_gram_21k":65.425,
    "price_gram_20k":62.3095,
    "price_gram_18k":56.0785,
    "price_gram_16k":49.8476,
    "price_gram_14k":43.6166,
    "price_gram_10k":31.1547,
  }
  const priceGram24K = JSONtest.price_gram_24k;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i <= 3 || i > totalPages - 3 || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
          <button
            key={i}
            className={styles.paginationButton}
            style={{
              backgroundColor: i === currentPage ? '#F9FAFB' : 'transparent',
              color: i === currentPage ? '#636A7E' : '#AFB4C0',
            }}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      } else if (pages[pages.length - 1] !== '...') {
        pages.push(<span key={i} className={styles.paginationEllipsis}>...</span>);
      }
    }
    return pages;
  };

  const convertionToAcceptedValue = (value:number) =>{
    return Math.round(value * 10**9) 
  }

  const fetchPurchases = async () => {
    if (address && !fetched) {
      try {
        const purchases = await getPurchases(address);
        const formattedPurchases = purchases.map(purchase => ({
          amount: (parseInt(purchase.amount) / (10 ** 9)),
          reward: (parseInt(purchase.reward)/ (10 ** 9)),
          timestamp: parseInt(purchase.timestamp)
        }));
        setPurchases(formattedPurchases)
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    }
  };

  const handleRetireReward = async (index) => {
    if (address) {
      try {
        const rewardClaim = await claimReward(index);
        fetchPurchases()
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    }
  };

  function calculateTimeLeft(timestamp) {
    const currentTime = Math.floor(Date.now() / 1000);
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
    const timeElapsed = currentTime - timestamp;
    const timeLeft = thirtyDaysInSeconds - timeElapsed;
  
    if (timeLeft <= 0) {
      return 'Ready to claim';
    } else {
      const daysLeft = Math.floor(timeLeft / (24 * 60 * 60));
      const hoursLeft = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
      const minutesLeft = Math.floor((timeLeft % (60 * 60)) / 60);
      const secondsLeft = timeLeft % 60;
  
      return `${daysLeft}d ${hoursLeft}h ${minutesLeft}m`;
    }
  }

  useEffect(() => {
    fetchPurchases();
  }, [address, contract]);

  useEffect(() => {
    setGoldValue(priceGram24K);
  }, [address]);

  return (
    <div>
      <Navbar goldValue={goldValue} />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <span>YOUR NGOLD REWARDS</span>
            </div>
            <style jsx>{`
                table {
                    width: 100%;
                    text-align: center;
                    padding: 10px;
                }
            `}</style>
            <table>
              <thead>
                <tr>
                  <th>Purchase</th>
                  <th>Time</th>
                  <th>Time left</th>
                  <th>Rewards</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase, index) => (
                  <tr key={index}>
                    <td>{purchase.amount.toFixed(9)}</td>
                    <td>{new Date(purchase.timestamp * 1000).toLocaleString()}</td>
                    <td>{calculateTimeLeft(purchase.timestamp)}</td>
                    <td>{purchase.reward.toFixed(9)}</td>
                    <td>
                      <button
                        className={`${styles.stakeNgoldButton} ${calculateTimeLeft(purchase.timestamp) === 'Ready to claim' ? styles.activeStakeNgoldButton : ''}`}
                        disabled={calculateTimeLeft(purchase.timestamp) !== 'Ready to claim'}
                        onClick={() => handleRetireReward(index)}
                      >
                        Claim
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.tableFooter}>
              <button onClick={handlePreviousPage} className={styles.paginationNavButton}>
                <i className="bi bi-arrow-left-short"></i> Previous
              </button>
              <div className={styles.pageNumbers}>
                {renderPagination()}
              </div>
              <button onClick={handleNextPage} className={styles.paginationNavButton}>
                Next <i className="bi bi-arrow-right-short"></i>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reward;
