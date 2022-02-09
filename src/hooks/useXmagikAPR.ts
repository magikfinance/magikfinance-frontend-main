import {useEffect, useState} from 'react';
import useMagikFinance from './useMagikFinance';
import {PoolStats} from '../magik-finance/types';

import useRefresh from './useRefresh';

const useXmagikAPR = () => {
  const {slowRefresh} = useRefresh();
  const [magikAPR, setMagikAPR] = useState<PoolStats>();

  const magikFinance = useMagikFinance();
  const isUnlocked = magikFinance?.isUnlocked;
  useEffect(() => {
    async function fetchBalance() {
      try {
        setMagikAPR(await magikFinance.getXmagikAPR());
      } catch (e) {
        console.error(e);
      }
    }
    if (isUnlocked) {
      fetchBalance();
    }
  }, [slowRefresh, isUnlocked, magikFinance]);
  return magikAPR;
};

export default useXmagikAPR;
