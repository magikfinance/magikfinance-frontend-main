import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useMagikFinance from './useMagikFinance';
import useRefresh from './useRefresh';

const useEarningsOnMasonry = () => {
  const { slowRefresh } = useRefresh();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const tombFinance = useMagikFinance();
  const isUnlocked = tombFinance?.isUnlocked;

  useEffect(() => {
    async function fetchBalance() {
      try {
        setBalance(await tombFinance.getEarningsOnMasonry());
      } catch (e) {
        console.error(e);
      }
    }
    if (isUnlocked) {
      fetchBalance();
    }
  }, [isUnlocked, tombFinance, slowRefresh]);

  return balance;
};

export default useEarningsOnMasonry;
