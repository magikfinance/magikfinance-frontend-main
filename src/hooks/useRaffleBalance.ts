import {useEffect, useState} from 'react';
import useMagikFinance from './useMagikFinance';
import {TokenStat} from '../magik-finance/types';
import useRefresh from './useRefresh';
import useWallet from 'use-wallet';
const useRaffleStats = (account: string, raffleAddress: string) => {
  const [stat, setStat] = useState<TokenStat>();
  const {fastRefresh} = useRefresh();
  const magikFinance = useMagikFinance();
  
  useEffect(() => {
    async function fetchMagikPrice() {
      
      try {
        setStat(await magikFinance.getRaffleStat(account, raffleAddress));
      } catch (err) {
        console.error(err);
      }
    }
    fetchMagikPrice();
  }, [setStat, magikFinance, fastRefresh]);

  return stat;
};

export default useRaffleStats;
