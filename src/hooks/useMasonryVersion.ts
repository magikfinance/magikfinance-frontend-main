import { useCallback, useEffect, useState } from 'react';
import useMagikFinance from './useMagikFinance';
import useStakedBalanceOnMasonry from './useStakedBalanceOnMasonry';

const useMasonryVersion = () => {
  const [dungeonVersion, setMasonryVersion] = useState('latest');
  const tombFinance = useMagikFinance();
  const stakedBalance = useStakedBalanceOnMasonry();

  const updateState = useCallback(async () => {
    setMasonryVersion(await tombFinance.fetchMasonryVersionOfUser());
  }, [tombFinance?.isUnlocked, stakedBalance]);

  useEffect(() => {
    if (tombFinance?.isUnlocked) {
      updateState().catch((err) => console.error(err.stack));
    }
  }, [tombFinance?.isUnlocked, stakedBalance]);

  return dungeonVersion;
};

export default useMasonryVersion;
