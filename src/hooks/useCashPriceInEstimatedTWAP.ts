import { useEffect, useState } from 'react';
import useMagikFinance from './useMagikFinance';
import { TokenStat } from '../magik-finance/types';
import useRefresh from './useRefresh';

const useCashPriceInEstimatedTWAP = () => {
  const [stat, setStat] = useState<TokenStat>();
  const tombFinance = useMagikFinance();
  const { slowRefresh } = useRefresh(); 

  useEffect(() => {
    async function fetchCashPrice() {
      try {
        setStat(await tombFinance.getTombStatInEstimatedTWAP());
      }catch(err) {
        console.error(err);
      }
    }
    fetchCashPrice();
  }, [setStat, tombFinance, slowRefresh]);

  return stat;
};

export default useCashPriceInEstimatedTWAP;
