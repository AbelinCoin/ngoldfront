"use client";
import { useState } from 'react';
import useContract from '../hooks/useContract';

export default function Home() {
  const { contract, account, isConnected, connect, getTotalSupply, getSymbol, getDecimals, transferTokens, getP2PBalance, getDexBalance, getPendingRewards, getReservedTokens, getAvailableBalance } = useContract();
  const [totalSupply, setTotalSupply] = useState<number | null>(null);
  const [symbol, setSymbol] = useState<string | null>(null);
  const [decimals, setDecimals] = useState<number | null>(null);
  const [transferResult, setTransferResult] = useState(null);
  const [p2pBalance, setP2PBalance] = useState<number | null>(null);
  const [dexBalance, setDexBalance] = useState<number | null>(null);
  const [pendingRewards, setPendingRewards] = useState<number | null>(null);
  const [reservedTokens, setReservedTokens] = useState<number | null>(null);
  const [availableBalance, setAvailableBalance] = useState<number | null>(null);
  const handleGetTotalSupply = async () => {
    try {
      const supply = await getTotalSupply();
      setTotalSupply(supply);
    } catch (error) {
      console.error('Error getting total supply', error);
    }
  };

  const handleGetSymbol = async () => {
    try {
      const tokenSymbol = await getSymbol();
      setSymbol(tokenSymbol);
    } catch (error) {
      console.error('Error getting symbol', error);
    }
  };

  const handleGetDecimals = async () => {
    try {
      const tokenDecimals = await getDecimals();
      setDecimals(tokenDecimals);
    } catch (error) {
      console.error('Error getting decimals', error);
    }
  };

  const handleTransferTokens = async (recipient, amount) => {
    try {
      const result = await transferTokens(recipient, amount);
      setTransferResult(result);
    } catch (error) {
      console.error('Error transferring tokens', error);
    }
  };

  const handleGetP2PBalance = async (accountAddress) => {
    try {
      const balance = await getP2PBalance(accountAddress);
      setP2PBalance(balance);
    } catch (error) {
      console.error('Error getting P2P balance', error);
    }
  };

  const handleGetDexBalance = async (accountAddress) => {
    try {
      const balance = await getDexBalance(accountAddress);
      setDexBalance(balance);
    } catch (error) {
      console.error('Error getting Dex balance', error);
    }
  };

  const handleGetPendingRewards = async (accountAddress) => {
    try {
      const rewards = await getPendingRewards(accountAddress);
      setPendingRewards(rewards);
    } catch (error) {
      console.error('Error getting pending rewards', error);
    }
  };

  const handleGetReservedTokens = async () => {
    try {
      const tokens = await getReservedTokens();
      setReservedTokens(tokens);
    } catch (error) {
      console.error('Error getting reserved tokens', error);
    }
  };

  const handleGetAvailableBalance = async () => {
    try {
      const balance = await getAvailableBalance();
      setAvailableBalance(balance);
    } catch (error) {
      console.error('Error getting available balance', error);
    }
  };

  return (
    <div>
      <h1>Interact with Smart Contract</h1>
      {isConnected ? (
        <>
          <div>
            <h2>Get Total Supply</h2>
            <button onClick={handleGetTotalSupply}>Get Total Supply</button>
            {totalSupply !== null && <p>Total Supply: {totalSupply}</p>}
          </div>
          <div>
            <h2>Get Symbol</h2>
            <button onClick={handleGetSymbol}>Get Symbol</button>
            {symbol !== null && <p>Symbol: {symbol}</p>}
          </div>
          <div>
            <h2>Get Decimals</h2>
            <button onClick={handleGetDecimals}>Get Decimals</button>
            {decimals !== null && <p>Decimals: {decimals}</p>}
          </div>
          <div>
            <h2>Transfer Tokens</h2>
            <button onClick={() => handleTransferTokens('recipientAddress', 'amount')}>Transfer Tokens</button>
            {transferResult !== null && <p>Transfer Result: {JSON.stringify(transferResult)}</p>}
          </div>
          <div>
            <h2>Get P2P Balance</h2>
            <button onClick={() => handleGetP2PBalance('0xf2681F87547029876b8991d2db0515925A3672F7')}>Get P2P Balance</button>
            {p2pBalance !== null && <p>P2P Balance: {p2pBalance}</p>}
          </div>
          <div>
            <h2>Get Dex Balance</h2>
            <button onClick={() => handleGetDexBalance('0xf2681F87547029876b8991d2db0515925A3672F7')}>Get Dex Balance</button>
            {dexBalance !== null && <p>Dex Balance: {dexBalance}</p>}
          </div>
          <div>
            <h2>Get Pending Rewards</h2>
            <button onClick={() => handleGetPendingRewards('0xf2681F87547029876b8991d2db0515925A3672F7')}>Get Pending Rewards</button>
            {pendingRewards !== null && <p>Pending Rewards: {pendingRewards}</p>}
          </div>
          <div>
            <h2>Get Reserved Tokens</h2>
            <button onClick={handleGetReservedTokens}>Get Reserved Tokens</button>
            {reservedTokens !== null && <p>Reserved Tokens: {reservedTokens}</p>}
          </div>
          <div>
            <h2>Get Available Balance</h2>
            <button onClick={handleGetAvailableBalance}>Get Available Balance</button>
            {availableBalance !== null && <p>Available Balance: {availableBalance}</p>}
          </div>
        </>
      ) : (
        <button onClick={connect}>Connect to MetaMask</button>
      )}
    </div>
  );
}
