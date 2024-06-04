import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import styles from '../styles/Staking.module.css';
import { useAccount } from 'wagmi';
import useContracts from '../hooks/useContract';

const Staking: React.FC = () => {
  const { getP2PStakings, getDexStakings, stakeP2PTokens, unstakeP2PTokens, stakingContract, getP2PBalance } = useContracts();
  const [p2pStakings, setP2PStakings] = useState([]);
  const [amount, setAmount] = useState('');
  const [stakeTime, setStakeTime] = useState('10 DAYS');
  const [stakeType, setStakeType] = useState('Flexible');
  const [p2pBalance, setP2PBalance] = useState('0');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const totalRows = 0; // Change this to the total number of stake entries
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const { address } = useAccount();
  const [fetched, setFetched] = useState(false);
  const [reward, setReward] = useState('0');
  const EARLY_WITHDRAW_INTEREST_RATE = 8; // 8%
  const STAKING_DURATION = 365; // 365 días
  const [goldValue, setGoldValue] = useState<number>(1);
  const isFormComplete = amount !== '' && stakeType !== '' && stakeTime !== '';
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
 

  const fetchStakings = async () => {
    if (stakingContract && address && !fetched) {
      try {
        const rawP2PStakings = await getP2PStakings(address);
        const formattedP2PStakings = rawP2PStakings.map(staking => ({
            ...staking,
            amount: Number(staking.amount) / (10 ** 9),
            timestamp: Number(staking.timestamp),
        }));
        setP2PStakings(formattedP2PStakings);
        console.log(formattedP2PStakings);
        setFetched(true);
      } catch (error) {
        console.error('Error fetching stakings:', error);
      }
    }
  };

  const fetchStakingsAux = async () => {
    if (stakingContract && address) {
      try {
        const rawP2PStakings = await getP2PStakings(address);
        const formattedP2PStakings = rawP2PStakings.map(staking => ({
            ...staking,
            amount: Number(staking.amount) / (10 ** 9),
            timestamp: Number(staking.timestamp),
        }));
        setP2PStakings(formattedP2PStakings);
        console.log(formattedP2PStakings);
        setFetched(true);
      } catch (error) {
        console.error('Error fetching stakings:', error);
      }
    }
  };

  const fetchBalances = async () => {
    if (address) {
      try {
        const p2pBal = await getP2PBalance(address);
        const p2pBalInEther = p2pBal / (10 ** 9);
        setP2PBalance(p2pBalInEther);
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    if (inputValue > p2pBalance) {
        inputValue = p2pBalance;
    }
    setAmount(inputValue);
    let reward = (inputValue * 18) / 100;
    setReward(reward);
  };

  const handleClickMaxAmount = () => {
    setAmount(p2pBalance);
    let reward = (p2pBalance * 18) / 100;
    setReward(reward);
  }
  
  const handleStakeNGOLD = async () => {
    let auxAmount = convertionToAcceptedValue(amount);
    try {
        const result = await stakeP2PTokens(auxAmount);
        if(result){
          fetchStakingsAux();
          fetchBalances();
        }
        setAmount('')
    } catch (error) {
        console.error('Error in staking NGOLD:', error);
    }
  };

  const calculateReward = (amount, stakingTimestamp) => {
    const now = Date.now() / 1000; // Fecha actual en segundos
    const stakingDuration = now - stakingTimestamp; // Duración del staking en segundos
    const stakingDurationInDays = stakingDuration / (60 * 60 * 24); // Duración del staking en días
    const reward = (amount * EARLY_WITHDRAW_INTEREST_RATE * stakingDurationInDays) / (100 * STAKING_DURATION);
    return reward;
};

  const calculateTimeLeft = (stakingTimestamp) => {
    const now = Date.now() / 1000; // Fecha actual en segundos
    const stakingDuration = now - stakingTimestamp; // Duración del staking en segundos
    const timeLeftInDays = STAKING_DURATION - stakingDuration / (60 * 60 * 24); // Tiempo restante en días
    return timeLeftInDays;
  };

  const handleRetireStaking = async (index) => {
    if (stakingContract && address) {
      try {
        const retireStaking = await unstakeP2PTokens(index);
        if(retireStaking){
          fetchStakingsAux();
          fetchBalances();
          setAmount('0');
          //let url = `https://amoy.polygonscan.com/tx/${retireStaking.transactionHash}`; // url para redireccionar a la pagina de movimientos
        }
      } catch (error) {
        console.error('Error retire staking:', error);
      }
    }
  };

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

  useEffect(() => {
    setGoldValue(priceGram24K);
  }, [address]);

  useEffect(() => {
    fetchStakings();
    fetchBalances();
  }, [stakingContract, address, fetched, getP2PStakings, getDexStakings]);

  return (
    <div>
      <Navbar goldValue={goldValue} />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.containerStake}>
            <div className={styles.containerStaking}>
              <h2 className={styles.titleStaking}>STAKE YOUR NGOLD</h2>
              <form className={styles.formStaking}>
                <div className={styles.contentForm}>
                  <span className={styles.formLabel}>NGOLD Amount</span>
                  <div className={styles.containerInput}>
                    <div className={styles.containerInputAmount}>
                      <div className={styles.inputRow}>
                        <input
                          type="number"
                          placeholder="0.00"
                          className={styles.inputField}
                          value={amount}
                          onChange={handleAmountChange}
                        />
                      </div>
                      <select className={styles.selectField} disabled>
                        <option value="NGOLD">NGOLD</option>
                      </select>
                    </div>
                    <div className={styles.containerInputFooter}>
                      <div className={styles.containerInputFooterBalance}>
                        <span>Balance</span>
                        <span>{p2pBalance}</span>
                      </div>
                      <button type="button" className={styles.useMaxButton} onClick={handleClickMaxAmount}>Use Max</button>
                    </div>
                  </div>
                </div>
                <div className={styles.contentFormFooter}>
                  <div className={styles.footerDetails}>
                    <span className={styles.detailsLabel}>NGOLD</span>
                    <span className={styles.detailsValue}>{amount !== '' ? `${amount}` : '0.00'}</span>
                  </div>
                  <div className={styles.footerDetails}>
                    <span className={styles.detailsLabel}>Percentage</span>
                    <span className={styles.detailsValue}>18%</span>
                  </div>
                  <div className={styles.footerDetails}>
                    <span className={styles.detailsLabel}>Days</span>
                    <span className={styles.detailsValue}>365</span>
                  </div>
                  <div className={styles.footerDetails}>
                    <span className={styles.detailsLabel}>Your rewards</span>
                    <span className={styles.detailsValue}>{reward}</span>
                  </div>
                </div>
              </form>
              <button
                  className={`${styles.stakeNgoldButton} ${isFormComplete ? styles.activeStakeNgoldButton : ''}`}
                  disabled={!isFormComplete}
                  onClick={handleStakeNGOLD}
              >
                  Stake NGOLD
              </button>
            </div>
          </div>
          <div className={styles.containerCopies}>
            <h1 className={styles.copyTitle}>Decentralized Digital Gold Token</h1>
            <div className={styles.containerInfo}>
              <span className={styles.copyDescription}>
                Invest in gold with NGOLD, where each token represents 1 gram of gold, priced by
                London Gold Fixing. Earn up to 2.5% rewards buying NGOLD on DEX-P2P. Note: P2P
                purchases can't be sold on www.ngold.io/dex, promoting higher transaction volumes and
                usability.
              </span>
              <div className={styles.buttonsContainer}>
                <button className={styles.whitePaperButton}>WHITE PAPER</button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <span>YOUR NGOLD STAKE</span>
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
                        <th>Order type</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Rewards</th>
                        <th>Time left</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                  {p2pStakings.map((staking, index) => {
                    const reward = calculateReward(staking.amount, staking.timestamp);
                    const timeLeft = calculateTimeLeft(Number(staking.timestamp));
                    const canRetire = timeLeft <= 364; // Verificar si ha pasado al menos un día
                    return (
                      <tr key={index}>
                          <td>NGOLD STAKED</td>
                          <td>active</td>
                          <td>{staking.amount.toFixed(9)}</td>
                          <td>{reward.toFixed(9)}</td>
                          <td>{timeLeft.toFixed(2)} days</td>
                          <td>
                              <button
                                  className={`${styles.stakeNgoldButton} ${canRetire ? styles.activeStakeNgoldButton : ''}`}
                                  disabled={!canRetire}
                                  onClick={() => handleRetireStaking(index)}
                              >
                                  Retire
                              </button>
                          </td>
                      </tr>
                    );
                  })}
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

export default Staking;
