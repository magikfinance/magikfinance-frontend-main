import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useMagikFinance from './useMagikFinance';
import useRefresh from './useRefresh';

const useStakedBalanceOnMasonry = () => {
  const { slowRefresh } = useRefresh();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const tombFinance = useMagikFinance();
  const isUnlocked = tombFinance?.isUnlocked;
  useEffect(() => {
    async function fetchBalance() {
      try {
        setBalance(await tombFinance.getStakedSharesOnMasonry());
      } catch (e) {
        console.error(e);
      }
    }
    if (isUnlocked) {
      fetchBalance();
    }
  }, [slowRefresh, isUnlocked, tombFinance]);
  return balance;
};

export default useStakedBalanceOnMasonry;
