import { useEffect, useState } from 'react';
import useMagikFinance from './useMagikFinance';
import { TokenStat } from '../magik-finance/types';
import useRefresh from './useRefresh';

const useShareStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { slowRefresh } = useRefresh();
  const tombFinance = useMagikFinance();

  useEffect(() => {
    async function fetchSharePrice() {
      try {
        setStat(await tombFinance.getShareStat());
      } catch(err){
        console.error(err)
      }
    }
    fetchSharePrice();
  }, [setStat, tombFinance, slowRefresh]);
  // console.log("hello world", stat);

  return stat;
};

export default useShareStats;
