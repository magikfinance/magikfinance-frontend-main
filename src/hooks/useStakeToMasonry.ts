import { useCallback } from 'react';
import useMagikFinance from './useMagikFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToMasonry = () => {
  const tombFinance = useMagikFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(tombFinance.stakeShareToMasonry(amount), `Stake ${amount} MSHARE to the dungeon`);
    },
    [tombFinance, handleTransactionReceipt],
  );
  return { onStake: handleStake };
};

export default useStakeToMasonry;
