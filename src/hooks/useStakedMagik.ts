import {useEffect, useState} from 'react';
import {BigNumber} from 'ethers';
import useMagikFinance from './useMagikFinance';
import useRefresh from './useRefresh';

const useStakedMagik = () => {
  const {slowRefresh} = useRefresh();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const magikFinance = useMagikFinance();
  useEffect(() => {
    async function fetchBalance() {
      try {
        setBalance(await magikFinance.getStakedMagik());
      } catch (e) {
        console.error(e);
      }
    }
    fetchBalance();
  }, [slowRefresh, magikFinance]);
  return balance;
};

export default useStakedMagik;
