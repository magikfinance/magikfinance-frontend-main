import { useEffect, useState } from 'react';
import useRefresh from '../useRefresh';
import useMagikFinance from '../useMagikFinance';

const useClaimRewardCheck = () => {
  const  { slowRefresh } = useRefresh();
  const [canClaimReward, setCanClaimReward] = useState(false);
  const tombFinance = useMagikFinance();
  const isUnlocked = tombFinance?.isUnlocked;

  useEffect(() => {
    async function canUserClaimReward() {
      try {
        setCanClaimReward(await tombFinance.canUserClaimRewardFromMasonry());
      } catch(err){
        console.error(err);
      };
    }
    if (isUnlocked) {
      canUserClaimReward();
    }
  }, [isUnlocked, slowRefresh, tombFinance]);

  return canClaimReward;
};

export default useClaimRewardCheck;
