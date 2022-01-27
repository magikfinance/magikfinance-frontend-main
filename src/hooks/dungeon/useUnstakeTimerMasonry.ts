import { useEffect, useState } from 'react';
import useMagikFinance from '../useMagikFinance';
import { AllocationTime } from '../../magik-finance/types';

const useUnstakeTimerMasonry = () => {
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const tombFinance = useMagikFinance();

  useEffect(() => {
    if (tombFinance) {
      tombFinance.getUserUnstakeTime().then(setTime);
    }
  }, [tombFinance]);
  return time;
};

export default useUnstakeTimerMasonry;
