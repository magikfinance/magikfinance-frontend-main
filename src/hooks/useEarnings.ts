import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useMagikFinance from './useMagikFinance';
import { ContractName } from '../magik-finance';
import config from '../config';

const useEarnings = (poolName: ContractName, earnTokenName: String, poolId: Number) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const tombFinance = useMagikFinance();
  const isUnlocked = tombFinance?.isUnlocked;

  const fetchBalance = useCallback(async () => {
    const balance = await tombFinance.earnedFromBank(poolName, earnTokenName, poolId, tombFinance.myAccount);
    setBalance(balance);
  }, [poolName, earnTokenName, poolId, tombFinance]);

  useEffect(() => {
    if (isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [isUnlocked, poolName, tombFinance, fetchBalance]);

  return balance;
};

export default useEarnings;
