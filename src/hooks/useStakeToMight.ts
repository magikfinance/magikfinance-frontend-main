import {useCallback} from 'react';
import useMagikFinance from './useMagikFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToMight = () => {
  const magikFinance = useMagikFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(magikFinance.stakeToMight(amount), `Stake ${amount} MSHARE for MIGHT`);
    },
    [magikFinance, handleTransactionReceipt],
  );
  return {onStake: handleStake};
};

export default useStakeToMight;
