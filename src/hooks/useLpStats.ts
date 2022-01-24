import { useEffect, useState } from 'react';
import useMagikFinance from './useMagikFinance';
import { LPStat } from '../magik-finance/types';
import useRefresh from './useRefresh';

const useLpStats = (lpTicker: string) => {
  const [stat, setStat] = useState<LPStat>();
  const { slowRefresh } = useRefresh();
  const tombFinance = useMagikFinance();

  useEffect(() => {
    async function fetchLpPrice() {
      try{
        setStat(await tombFinance.getLPStat(lpTicker));
      }
      catch(err){
        console.error(err);
      }
    }
    fetchLpPrice();
  }, [setStat, tombFinance, slowRefresh, lpTicker]);

  return stat;
};

export default useLpStats;
