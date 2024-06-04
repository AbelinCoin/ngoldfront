import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import styles from '../styles/Staking.module.css';

const Staking: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [stakeTime, setStakeTime] = useState('10 DAYS');
  const [stakeType, setStakeType] = useState('Flexible');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const totalRows = 0; // Change this to the total number of stake entries
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleStakeTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStakeTime(e.target.value);
  };

  const handleStakeTypeChange = (type: string) => {
    setStakeType(type);
  };

  const isFormComplete = amount !== '' && stakeType !== '' && stakeTime !== '';

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

  return (
    <div>
      <Navbar />
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
                          placeholder="$ 0.00"
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
                        <span>0.00</span>
                      </div>
                      <button type="button" className={styles.useMaxButton}>Use Max</button>
                    </div>
                  </div>
                </div>
                {/* <div className={styles.contentForm}>
                  <span className={styles.formLabel}>Time to staking</span>
                  <div className={styles.containerInput}>
                    <select
                      className={styles.selectField}
                      value={stakeTime}
                      onChange={handleStakeTimeChange}
                    >
                      <option value="10 DAYS">10 DAYS</option>
                      <option value="30 DAYS">30 DAYS</option>
                      <option value="90 DAYS">90 DAYS</option>
                    </select>
                  </div>
                </div>
                <div className={styles.contentForm}>
                  <div className={styles.contentHeader}>
                    <span className={styles.formLabel}>Stake type</span>
                    <span className={styles.formSubLabel}>
                      Win a 2.5% with flexible staking and a 8% with a locked staking
                    </span>
                  </div>
                  <div className={styles.containerButtons}>
                    <button
                      type="button"
                      className={`${styles.stakeButton} ${
                        stakeType === 'Flexible' ? styles.activeStakeButton : ''
                      }`}
                      onClick={() => handleStakeTypeChange('Flexible')}
                    >
                      Flexible
                    </button>
                    <button
                      type="button"
                      className={`${styles.stakeButton} ${
                        stakeType === 'Locked' ? styles.activeStakeButton : ''
                      }`}
                      onClick={() => handleStakeTypeChange('Locked')}
                    >
                      Locked
                    </button>
                  </div>
                </div> */}
                <div className={styles.contentFormFooter}>
                  <div className={styles.footerDetails}>
                    <span className={styles.detailsLabel}>NGOLD</span>
                    <span className={styles.detailsValue}>{amount !== '' ? `$ ${amount}` : '$ 0.00'}</span>
                  </div>
                  {/* <div className={styles.footerDetails}>
                    <span className={styles.detailsLabel}>Time to stake</span>
                    <span className={styles.detailsValue}>{stakeTime !== '' ? stakeTime : '0'}</span>
                  </div> */}
                  <div className={styles.footerDetails}>
                    <span className={styles.detailsLabel}>Your rewards</span>
                    <span className={styles.detailsValue}>{stakeType === 'Flexible' ? '2.5%' : '8%'}</span>
                  </div>
                </div>
              </form>
              <button
                className={`${styles.stakeNgoldButton} ${isFormComplete ? styles.activeStakeNgoldButton : ''}`}
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
            <div className={styles.tableContent}>
              <h2>You do not have any stake.</h2>
              <span>Stake your NGOLD now without commissions</span>
            </div>
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
