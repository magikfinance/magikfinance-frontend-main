import { useEffect, useState } from 'react';
import useMagikFinance from './useMagikFinance';
import useRefresh from './useRefresh';

const useTotalValueLocked = () => {
  const [totalValueLocked, setTotalValueLocked] = useState<Number>(0);
  const { slowRefresh } = useRefresh();
  const tombFinance = useMagikFinance();

  useEffect(() => {
    async function fetchTVL() {
      try {
        setTotalValueLocked(await tombFinance.getTotalValueLocked());
      }
      catch(err){
        console.error(err);
      }
    }
    fetchTVL();
  }, [setTotalValueLocked, tombFinance, slowRefresh]);

  return totalValueLocked;
};

export default useTotalValueLocked;
