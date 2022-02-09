import {useEffect, useState} from 'react';
import useMagikFinance from './useMagikFinance';
import useRefresh from './useRefresh';

const useFetchMagikAPR = () => {
  const [apr, setApr] = useState<number>(0);
  const magikFinance = useMagikFinance();
  const {slowRefresh} = useRefresh();

  useEffect(() => {
    async function fetchMasonryAPR() {
      try {
        setApr(await magikFinance.getMagikStakeAPR());
      } catch (err) {
        console.error(err);
      }
    }
    fetchMasonryAPR();
  }, [setApr, magikFinance, slowRefresh]);

  return apr;
};

export default useFetchMagikAPR;
