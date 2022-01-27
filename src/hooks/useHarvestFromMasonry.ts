import { useCallback } from 'react';
import useMagikFinance from './useMagikFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useHarvestFromMasonry = () => {
  const tombFinance = useMagikFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(tombFinance.harvestCashFromMasonry(), 'Claim MAGIK from Dungeon');
  }, [tombFinance, handleTransactionReceipt]);

  return { onReward: handleReward };
};

export default useHarvestFromMasonry;
