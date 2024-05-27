import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import contractABI from '../../pitufo.json';

const useContract = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(contractInstance);

        // Check if already connected
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      } else {
        console.error('Ethereum provider not found');
      }
    };

    init();
  }, [contractAddress]);

  const connect = async () => {
    if (web3) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting to Ethereum', error);
      }
    }
  };

  const getTotalSupply = async () => {
    if (contract && account) {
      try {
        const totalSupply = await contract.methods.totalSupply().call({ from: account });
        return totalSupply.toString();
      } catch (error) {
        console.error('Error getting total supply', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };

  const getBalanceOf = async (accountAddress) => {
    if (contract && account) {
      try {
        const balance = await contract.methods.balanceOf(accountAddress).call({ from: account });
        return balance.toString();
      } catch (error) {
        console.error('Error getting balance', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };

  const getSymbol = async () => {
    if (contract && account) {
      try {
        const symbol = await contract.methods.symbol().call({ from: account });
        console.log(symbol)
        return symbol.toString();
      } catch (error) {
        console.error('Error getting symbol', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };
  
  const getDecimals = async () => {
    if (contract && account) {
      try {
        const decimals = await contract.methods.decimals().call({ from: account });
        console.log(decimals)
        return decimals.toString();
      } catch (error) {
        console.error('Error getting decimals', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };
  
  const transferTokens = async (recipient, amount) => {
    if (contract && account) {
      try {
        const result = await contract.methods.transfer(recipient, amount).send({ from: account });
        return result;
      } catch (error) {
        console.error('Error transferring tokens', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };

  const setWallets = async (_saleWallet, _teamWallet, _reserveNGoldWallet, _airdropWallet, _reserveBitcoinWallet, _leverageWallet) => {
    if (contract && account) {
      try {
        const result = await contract.methods.setWallets(_saleWallet, _teamWallet, _reserveNGoldWallet, _airdropWallet, _reserveBitcoinWallet, _leverageWallet).send({ from: account });
        return result;
      } catch (error) {
        console.error('Error setting wallets', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };
  
  const setTokenPrice = async (price) => {
    if (contract && account) {
      try {
        const result = await contract.methods.setTokenPrice(price).send({ from: account });
        return result;
      } catch (error) {
        console.error('Error setting token price', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };
  
  const getTokenPrice = async () => {
    if (contract && account) {
      try {
        const price = await contract.methods.getTokenPrice().call({ from: account });
        return price;
      } catch (error) {
        console.error('Error getting token price', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };

  const getP2PBalance = async (accountAddress) => {
    if (contract && account) {
      try {
        const balance = await contract.methods.getP2PBalance(accountAddress).call({ from: account });
        console.log(BigInt(balance).toString())
        return BigInt(balance).toString();
      } catch (error) {
        console.error('Error getting P2P balance', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };
  
  const getDexBalance = async (accountAddress) => {
    if (contract && account) {
      try {
        const balance = await contract.methods.getDexBalance(accountAddress).call({ from: account });
        return BigInt(balance).toString();
      } catch (error) {
        console.error('Error getting Dex balance', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };
  
  const getPendingRewards = async (accountAddress) => {
    if (contract && account) {
      try {
        const rewards = await contract.methods.pendingRewards(accountAddress).call({ from: account });
        return BigInt(rewards).toString();
      } catch (error) {
        console.error('Error getting pending rewards', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };
  
  const getReservedTokens = async () => {
    if (contract && account) {
      try {
        const tokens = await contract.methods.reservedTokens().call({ from: account });
        return BigInt(tokens).toString();
      } catch (error) {
        console.error('Error getting reserved tokens', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };
  
  const getAvailableBalance = async () => {
    if (contract && account) {
      try {
        const balance = await contract.methods.availableBalance().call({ from: account });
        return BigInt(balance).toString();
      } catch (error) {
        console.error('Error getting available balance', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };

  const buyTokensFromP2P = async (tokenAmount, usdtContractAddress) => {
    if (contract && account) {
      try {
        const result = await contract.methods.buyTokensFromP2P(tokenAmount, usdtContractAddress).send({ from: account });
        return result;
      } catch (error) {
        console.error('Error buying tokens from P2P', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };
  
  const buyTokensFromDex = async (tokenAmount, usdtContractAddress) => {
    if (contract && account) {
      try {
        const result = await contract.methods.buyTokensFromDex(tokenAmount, usdtContractAddress).send({ from: account });
        return result;
      } catch (error) {
        console.error('Error buying tokens from Dex', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };

  return { web3, contract, account, isConnected, connect, getTotalSupply, getBalanceOf, getSymbol, getDecimals, transferTokens, setWallets, setTokenPrice, getTokenPrice, getP2PBalance, getDexBalance, getPendingRewards, getReservedTokens, getAvailableBalance, buyTokensFromP2P, buyTokensFromDex };
};

export default useContract;