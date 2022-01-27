import { useEffect, useState } from 'react';
import useMagikFinance from './useMagikFinance';
import useRefresh from './useRefresh';

const useFetchMasonryAPR = () => {
  const [apr, setApr] = useState<number>(0);
  console.log("apr", apr);
  const tombFinance = useMagikFinance();
  const { slowRefresh } = useRefresh(); 

  useEffect(() => {
    async function fetchMasonryAPR() {
      try {
        setApr(await tombFinance.getMasonryAPR());
      } catch(err){
        console.error(err);
      }
    }
   fetchMasonryAPR();
  }, [setApr, tombFinance, slowRefresh]);

  return apr;
};

export default useFetchMasonryAPR;
