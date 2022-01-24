import { useEffect, useState } from 'react';
import useMagikFinance from './useMagikFinance';
import { AllocationTime } from '../magik-finance/types';
import useRefresh from './useRefresh';


const useTreasuryAllocationTimes = () => {
  const { slowRefresh } = useRefresh();
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const tombFinance = useMagikFinance();
  useEffect(() => {
    if (tombFinance) {
      tombFinance.getTreasuryNextAllocationTime().then(setTime);
    }
  }, [tombFinance, slowRefresh]);
  return time;
};

export default useTreasuryAllocationTimes;
