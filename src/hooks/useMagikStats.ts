import { useEffect, useState } from 'react';
import useMagikFinance from './useMagikFinance';
import { TokenStat } from '../magik-finance/types';
import useRefresh from './useRefresh';

const useMagikStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { fastRefresh } = useRefresh();
  const tombFinance = useMagikFinance();

  useEffect(() => {
    async function fetchTombPrice(){
      try {
        setStat(await tombFinance.getMagikStat());
      }
      catch(err){
        console.error(err)
      }
    }
    fetchTombPrice();
  }, [setStat, tombFinance, fastRefresh]);

  return stat;
};

export default useMagikStats;
