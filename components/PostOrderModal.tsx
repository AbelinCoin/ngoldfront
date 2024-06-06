import React, { useState, useEffect } from 'react';
import styles from '../styles/PostOrderModal.module.css';
import useContracts from '../hooks/useContract';
import { useAccount } from 'wagmi';
import usdtContractABI from '../hooks/utils/usdt.json';

interface PostOrderModalProps {
  show: boolean;
  onClose: () => void;
}

const PostOrderModal: React.FC<PostOrderModalProps> = ({ show, onClose }) => {
  const { offersContract, getUSDTBalance, getP2PBalance, getDexBalance, web3 } = useContracts();
  const { address } = useAccount();

  const [isBuying, setIsBuying] = useState(true);
  const [amount, setAmount] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [minBuyAmount, setMinBuyAmount] = useState('');
  const [maxBuyAmount, setMaxBuyAmount] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [balanceType, setBalanceType] = useState('General');
  const [balance, setBalance] = useState('0.00');
  const [fetched, setFetched] = useState(false);

  const convertionToAcceptedValue = (value: number) => {
    return Math.round(value * 10 ** 9);
  };

  const fetchBalances = async () => {
    if (address) {
      try {
        if (balanceType === 'General') {
          const usdtBal = await getUSDTBalance(address);
          const usdtBalInEther = usdtBal / (10 ** 18); // Asumiendo que USDT tiene 18 decimales
          setBalance(usdtBalInEther.toString());
        } else if (balanceType === 'P2P') {
          const p2pBal = await getP2PBalance(address);
          const p2pBalInEther = p2pBal / (10 ** 9);
          setBalance(p2pBalInEther.toString());
        } else if (balanceType === 'Dex') {
          const dexBal = await getDexBalance(address);
          const dexBalInEther = dexBal / (10 ** 9);
          setBalance(dexBalInEther.toString());
        }
        setFetched(true);
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [address, balanceType]);

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

  const approveUSDT = async (totalPrice: string) => {
    const usdtContractAddress = '0x40C73b08284367162719c713bAd1e9A5c81c00D7';
    const usdtContract = new web3.eth.Contract(usdtContractABI, usdtContractAddress);

    await usdtContract.methods.approve(offersContract.options.address, convertionToAcceptedValue(parseFloat(totalPrice))).send({ from: address });
  };

  const handlePostOrder = async () => {
    if (offersContract && address) {
      try {
        const totalPriceWei = convertionToAcceptedValue(parseFloat(totalPrice));

        if (balanceType === 'General' && isBuying) {
          await approveUSDT(totalPrice);
        }

        const result = await offersContract.methods
          .createOffer(
            convertionToAcceptedValue(parseFloat(amount)),
            convertionToAcceptedValue(parseFloat(unitPrice)),
            totalPriceWei,
            convertionToAcceptedValue(parseFloat(minBuyAmount)),
            balanceType,
            isBuying,
            '0x40C73b08284367162719c713bAd1e9A5c81c00D7'
          )
          .send({ from: address });

        const status = result.status;
        const statusNumber = Number(status);
        let url = `https://amoy.polygonscan.com/tx/${result.transactionHash}`;

        if (statusNumber === 1) {
          console.log('Transaction successful:', result.transactionHash);
          window.open(url, '_blank');
        } else {
          console.log('Transaction failed:', result);
          window.open(url, '_blank');
        }

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
                className={`${styles.soldButton} ${!isBuying ? styles.sellActiveButton : styles.inactiveButton}`}
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
                  <select className={styles.selectField} value={balanceType} onChange={(e) => setBalanceType(e.target.value)}>
                    <option value="General">General (USDT)</option>
                    <option value="Dex">Dex</option>
                    <option value="P2P">P2P</option>
                  </select>
                </div>
              </div>
              {/* {(balanceType === 'Dex' || balanceType === 'P2P') && (
                <div className={styles.containerInputAmount}>
                  <div>
                    <select className={styles.selectField} value={balanceType} onChange={(e) => setBalanceType(e.target.value)}>
                      <option value="P2P">P2P Balance</option>
                      <option value="Dex">Dex Balance</option>
                    </select>
                  </div>
                </div>
              )} */}
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
