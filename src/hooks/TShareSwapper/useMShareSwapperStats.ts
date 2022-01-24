import { useEffect, useState } from 'react';
import useMagikFinance from '../useMagikFinance';
import { TShareSwapperStat } from '../../magik-finance/types';
import useRefresh from '../useRefresh';

const useMShareSwapperStats = (account: string) => {
  const [stat, setStat] = useState<TShareSwapperStat>();
  const { fastRefresh/*, slowRefresh*/ } = useRefresh();
  const tombFinance = useMagikFinance();

  useEffect(() => {
    async function fetchTShareSwapperStat() {
      try{
        if(tombFinance.myAccount) {
          setStat(await tombFinance.getTShareSwapperStat(account));
        }
      }
      catch(err){
        console.error(err);
      }
    }
    fetchTShareSwapperStat();
  }, [setStat, tombFinance, fastRefresh, account]);

  return stat;
};

export default useMShareSwapperStats;