import React, { useState, useEffect } from 'react';
import styles from '../styles/PostOrderModal.module.css';
import useContracts from '../hooks/useContract';
import { useAccount } from 'wagmi';

interface PostOrderModalProps {
  show: boolean;
  onClose: () => void;
}

const PostOrderModal: React.FC<PostOrderModalProps> = ({ show, onClose }) => {
  const { web3, getUSDTBalance, getP2PBalance, getDexBalance, createOffer } = useContracts();
  const { address } = useAccount();

  const [isBuying, setIsBuying] = useState(true);
  const [amount, setAmount] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [minBuyAmount, setMinBuyAmount] = useState('');
  const [maxBuyAmount, setMaxBuyAmount] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [tokenType, setTokenType] = useState('NGOLD');
  const [balanceType, setBalanceType] = useState('P2P');
  const [balance, setBalance] = useState('0.00');
  const [fetched, setFetched] = useState(false);

  const fetchBalances = async () => {
    if (address) {
      try {
        if (tokenType === 'USDT') {
          const usdtBal = await getUSDTBalance(address);
          const usdtBalInEther = usdtBal / (10 ** 9); // Asumiendo que USDT tiene 18 decimales
          setBalance(usdtBalInEther.toString());
        } else {
          if (balanceType === 'P2P') {
            const p2pBal = await getP2PBalance(address);
            const p2pBalInEther = p2pBal / (10 ** 9);
            setBalance(p2pBalInEther.toString());
          } else {
            const dexBal = await getDexBalance(address);
            const dexBalInEther = dexBal / (10 ** 9);
            setBalance(dexBalInEther.toString());
          }
        }
        setFetched(true);
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [address, tokenType, balanceType]);

  if (!show) {
    return null;
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (parseFloat(value) <= parseFloat(balance)) {
      setAmount(value);
      setMaxBuyAmount(value); // El máximo por defecto será el amount total
      updateTotalPrice(value, unitPrice);
    }
  };

  const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnitPrice(e.target.value);
    updateTotalPrice(amount, e.target.value);
  };

  const handleMinBuyAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (parseFloat(value) <= parseFloat(amount)) {
      setMinBuyAmount(value);
    } else {
      setMinBuyAmount(amount);
    }
  };

  const updateTotalPrice = (amount: string, unitPrice: string) => {
    const total = parseFloat(amount) * parseFloat(unitPrice);
    setTotalPrice(isNaN(total) ? '' : total.toString());
  };

  const handlePostOrder = async () => {
    if (address && web3) {
      try {
        const totalPriceWei = web3.utils.toWei(totalPrice, 'ether');
        await createOffer(
          web3.utils.toWei(amount, 'ether'),
          web3.utils.toWei(unitPrice, 'ether'),
          totalPriceWei,
          web3.utils.toWei(minBuyAmount, 'ether'),
          tokenType,
          isBuying,
          '0xA3E5DfE71aE3e6DeC4D98fa28821dF355d7244B3'
        );
        onClose();
      } catch (error) {
        console.error('Error posting order', error);
      }
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.headerContainer}>
          <h2 className={styles.modalTitle}>Post Order</h2>
          <i className="bi bi-x" style={{ fontSize: '32px', cursor: 'pointer', fontWeight: '700' }} onClick={onClose}></i>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.contentForm}>
            <span className={styles.formLabel}>I want to</span>
            <div className={styles.containerButtons}>
              <button
                className={`${styles.buyButton} ${isBuying ? styles.active : styles.inactiveButton}`}
                onClick={() => setIsBuying(true)}
              >
                Buy
              </button>
              <span className={styles.separator}>|</span>
              <button
                className={`${styles.soldButton} ${!isBuying ? styles.active : styles.inactiveButton}`}
                onClick={() => setIsBuying(false)}
              >
                Sell
              </button>
            </div>
          </div>
          <div className={styles.contentForm}>
            <span className={styles.formLabel}>Asset amount</span>
            <div className={styles.containerInput}>
              <div className={styles.containerInputAmount}>
                <div className={styles.inputRow}>
                  <span className={styles.descriptionContentspan}>$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className={styles.inputField}
                    value={amount}
                    onChange={handleAmountChange}
                  />
                </div>
                <div>
                  <select className={styles.selectField} value={tokenType} onChange={(e) => setTokenType(e.target.value)}>
                    <option value="NGOLD">NGOLD</option>
                    <option value="USDT">USDT</option>
                  </select>
                </div>
              </div>
              {tokenType === 'NGOLD' && (
                <div className={styles.containerInputAmount}>
                  <div>
                    <select className={styles.selectField} value={balanceType} onChange={(e) => setBalanceType(e.target.value)}>
                      <option value="P2P">P2P Balance</option>
                      <option value="Dex">Dex Balance</option>
                    </select>
                  </div>
                </div>
              )}
              <div className={styles.containerInputFooter}>
                <div className={styles.containerInputFooterBalance}>
                  <span>Balance</span>
                  <span>{balance}</span>
                </div>
                <button className={styles.useMaxButton} onClick={() => setAmount(balance)}>Use Max</button>
              </div>
            </div>
          </div>
          <div className={styles.contentForm}>
            <span className={styles.formLabel}>Set a price</span>
            <div className={styles.containerInput}>
              <div className={styles.containerInputAmount}>
                <div className={styles.inputRow}>
                  <span className={styles.descriptionContentspan}>$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className={styles.inputField}
                    value={unitPrice}
                    onChange={handleUnitPriceChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.contentForm}>
            <div className={styles.contentFormlimit}>
              <span className={styles.formLabel}>Set a limit order</span>
            </div>
            <div className={styles.containerInputs}>
              <div className={styles.inputLimit}>
                <input
                  type="number"
                  placeholder="0"
                  className={styles.inputField}
                  value={minBuyAmount}
                  onChange={handleMinBuyAmountChange}
                />
              </div>
              <div className={styles.inputLimit}>
                <input
                  type="number"
                  placeholder="0"
                  className={styles.inputField}
                  value={maxBuyAmount}
                  onChange={(e) => setMaxBuyAmount(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className={styles.footerContent}>
            <div className={styles.descriptionContent}>
              <span className={styles.descriptionContentlabel}>unitPrice</span>
              <span className={styles.dynamicText}>{unitPrice || '$0.00'}</span>
            </div>
            <div className={styles.descriptionContent}>
              <span className={styles.descriptionContentlabel}>Amount</span>
              <span className={styles.dynamicText}>{amount || '$0.00'}</span>
            </div>
            <div className={styles.descriptionContent}>
              <span className={styles.descriptionContentlabel}>minBuyAmount and amount</span>
              <span className={styles.dynamicText}>{minBuyAmount && maxBuyAmount ? `${minBuyAmount} - ${maxBuyAmount}` : '0 - 0'}</span>
            </div>
          </div>
        </div>
        <div className={styles.footerContainer}>
          <button
            className={`${styles.postOrderButton} ${(amount && unitPrice && minBuyAmount && maxBuyAmount) ? styles.active : ''}`}
            disabled={!(amount && unitPrice && minBuyAmount && maxBuyAmount)}
            onClick={handlePostOrder}
          >
            Post Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostOrderModal;
