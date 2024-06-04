import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import contractABI from './utils/pitufo.json';
import contractABIStaking from './utils/staking.json';
import contractABIOffer from './utils/offer.json';
import usdtContractABI from './utils/usdt.json';
import { useAccount } from 'wagmi';

const useContracts = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [offersContract, setOffersContract] = useState<Contract | null>(null);
  const [stakingContract, setStakingContract] = useState<Contract | null>(null);
  const [usdtContract, setUsdtContract] = useState<Contract | null>(null);
  const { address } = useAccount();

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contractAddressStaking = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS;
  const contractAddressOffer = process.env.NEXT_PUBLIC_OFFERS_CONTRACT_ADDRESS;
  const usdtContractAddress = '0x66f45494f187Cf21cA5b6d0586e934EC38ff0bBB';

  useEffect(() => {
    if (window.ethereum && address) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
      setContract(contractInstance);

      const contractInstanceStaking = new web3Instance.eth.Contract(contractABIStaking, contractAddressStaking);
      setStakingContract(contractInstanceStaking);

      const contractInstanceOffer = new web3Instance.eth.Contract(contractABIOffer, contractAddressOffer);
      setOffersContract(contractInstanceOffer);

      const usdtInstance = new web3Instance.eth.Contract(usdtContractABI, usdtContractAddress);
      setUsdtContract(usdtInstance);
    } else {
      console.error('Ethereum provider not found');
    }
  }, [contractAddress, contractAddressStaking, contractAddressOffer, address]);

  const getAvailableBalance = async () => {
    if (contract && address) {
      try {
        const availableBalance = await contract.methods.availableBalance().call({ from: address });
        return availableBalance.toString();
      } catch (error) {
        console.error('Error getting available balance', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };

  const buyTokensFromP2P = async (tokenAmount, usdtContractAddress, priceTokenPitufo) => {
    if (offersContract && address) {
      try {
        const result = await contract.methods.buyTokensFromP2P(tokenAmount, usdtContractAddress, priceTokenPitufo).send({ from: address });
        return result;
      } catch (error) {
        console.error('Error buying tokens from P2P', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };

  const stakeP2PTokens = async (amount) => {
    if (stakingContract && address) {
      try {
        const result = await stakingContract.methods.stakeP2PTokens(amount).send({ from: address });
        return result;
      } catch (error) {
        console.error('Error staking P2P tokens', error);
        throw error;
      }
    } else {
      throw new Error('Staking contract or account not available');
    }
  };

  const stakeDexTokens = async (amount) => {
    if (stakingContract && address) {
      try {
        const result = await stakingContract.methods.stakeDexTokens(amount).send({ from: address });
        return result;
      } catch (error) {
        console.error('Error staking DEX tokens', error);
        throw error;
      }
    } else {
      throw new Error('Staking contract or account not available');
    }
  };

  const unstakeP2PTokens = async (stakingIndex) => {
    if (stakingContract && address) {
      try {
        const result = await stakingContract.methods.unstakeP2PTokens(stakingIndex).send({ from: address });
        return result;
      } catch (error) {
        console.error('Error unstaking P2P tokens', error);
        throw error;
      }
    } else {
      throw new Error('Staking contract or account not available');
    }
  };

  const unstakeDexTokens = async (stakingIndex) => {
    if (stakingContract && address) {
      try {
        const result = await stakingContract.methods.unstakeDexTokens(stakingIndex).send({ from: address });
        return result;
      } catch (error) {
        console.error('Error unstaking DEX tokens', error);
        throw error;
      }
    } else {
      throw new Error('Staking contract or account not available');
    }
  };

  const getP2PStakings = async (account) => {
    if (stakingContract) {
      try {
        const stakings = await stakingContract.methods.getP2PStakings(account).call({ from: account });
        return stakings;
      } catch (error) {
        console.error('Error getting P2P stakings', error);
        throw error;
      }
    } else {
      throw new Error('Staking contract not available');
    }
  };

  const getDexStakings = async (account) => {
    if (stakingContract) {
      try {
        const stakings = await stakingContract.methods.getDexStakings(account).call({ from: account });
        return stakings;
      } catch (error) {
        console.error('Error getting DEX stakings', error);
        throw error;
      }
    } else {
      throw new Error('Staking contract not available');
    }
  };

  const getP2PBalance = async (account) => {
    if (stakingContract) {
      try {
        const balance = await contract.methods.getP2PBalance(account).call();
        return balance.toString();
      } catch (error) {
        console.error('Error getting P2P balance', error);
        throw error;
      }
    } else {
      throw new Error('Staking contract not available');
    }
  };

  const getDexBalance = async (account) => {
    if (stakingContract) {
      try {
        const balance = await contract.methods.getDexBalance(account).call();
        return balance.toString();
      } catch (error) {
        console.error('Error getting Dex balance', error);
        throw error;
      }
    } else {
      throw new Error('Staking contract not available');
    }
  };

  // Adding the new functions
  const buyTokensFromDex = async (tokenAmount, usdtContractAddress, priceTokenPitufo) => {
    if (contract && address) {
      try {
        const result = await contract.methods.buyTokensFromDex(tokenAmount, usdtContractAddress, priceTokenPitufo).send({ from: address });
        return result;
      } catch (error) {
        console.error('Error buying tokens from DEX', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };

  const sellTokensToDex = async (tokenAmount, totalPriceTokenPitufo, usdtContractAddress) => {
    if (contract && address) {
      try {
        const result = await contract.methods.sellTokensToDex(tokenAmount, totalPriceTokenPitufo, usdtContractAddress).send({ from: address });
        return result;
      } catch (error) {
        console.error('Error selling tokens to DEX', error);
        throw error;
      }
    } else {
      throw new Error('Contract or account not available');
    }
  };

  const getUSDTBalance = async (account) => {
    if (usdtContract) {
      try {
        const balance = await usdtContract.methods.balanceOf(account).call();
        return balance.toString();
      } catch (error) {
        console.error('Error getting USDT balance', error);
        throw error;
      }
    } else {
      throw new Error('USDT contract not available');
    }
  };

  return { 
    web3,
    contract, 
    offersContract, 
    getP2PBalance, 
    getDexBalance, 
    stakingContract, 
    getAvailableBalance, 
    buyTokensFromP2P, 
    stakeP2PTokens, 
    stakeDexTokens, 
    unstakeP2PTokens, 
    unstakeDexTokens, 
    getP2PStakings, 
    getDexStakings,
    buyTokensFromDex,
    sellTokensToDex,
    getUSDTBalance
  };
};

export default useContracts;