import {useCallback} from 'react';
import useMagikFinance from './useMagikFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToMagik = () => {
  const magikFinance = useMagikFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(magikFinance.stakeToMagik(amount), `Stake ${amount} MSHARE for xMSHARE`);
    },
    [magikFinance, handleTransactionReceipt],
  );
  return {onStake: handleStake};
};

export default useStakeToMagik;
