import { useEffect, useState } from 'react';
import useMagikFinance from '../useMagikFinance';
import { AllocationTime } from '../../magik-finance/types';

const useClaimRewardTimerMasonry = () => {
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const tombFinance = useMagikFinance();

  useEffect(() => {
    if (tombFinance) {
      tombFinance.getUserClaimRewardTime().then(setTime);
    }
  }, [tombFinance]);
  return time;
};

export default useClaimRewardTimerMasonry;
