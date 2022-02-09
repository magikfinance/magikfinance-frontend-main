import {useEffect, useState} from 'react';
import {BigNumber} from 'ethers';
import useMagikFinance from './useMagikFinance';
import useRefresh from './useRefresh';

const useXmagikBalance = () => {
  const {slowRefresh} = useRefresh();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const magikFinance = useMagikFinance();
  useEffect(() => {
    async function fetchBalance() {
      try {
        const rate = await magikFinance.getXmagikExchange();
        setBalance(rate);
      } catch (e) {
        console.error(e);
      }
    }

    fetchBalance();
  }, [setBalance, slowRefresh, magikFinance]);
  return balance;
};

export default useXmagikBalance;
