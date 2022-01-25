import { useCallback, useState, useEffect } from 'react';
import useMagikFinance from './useMagikFinance';
import { Bank } from '../magik-finance';
import { PoolStats } from '../magik-finance/types';
import config from '../config';

const useStatsForPool = (bank: Bank) => {
  const tombFinance = useMagikFinance();

  const [poolAPRs, setPoolAPRs] = useState<PoolStats>();

  const fetchAPRsForPool = useCallback(async () => {
    setPoolAPRs(await tombFinance.getPoolAPRs(bank));
  }, [tombFinance, bank]);
  console.log("PoolAPRS ", poolAPRs);

  useEffect(() => {
    fetchAPRsForPool().catch((err) => console.error(`Failed to fetch MBOND price: ${err.stack}`));
    const refreshInterval = setInterval(fetchAPRsForPool, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPoolAPRs, tombFinance, fetchAPRsForPool]);

  return poolAPRs;
};

export default useStatsForPool;
