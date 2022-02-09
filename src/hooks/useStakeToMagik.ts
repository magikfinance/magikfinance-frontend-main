import {useCallback} from 'react';
import useMagikFinance from './useMagikFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToMagik = () => {
  const magikFinance = useMagikFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(magikFinance.stakeToMagik(amount), `Stake ${amount} MAGIK for xMAGIK`);
    },
    [magikFinance, handleTransactionReceipt],
  );
  return {onStake: handleStake};
};

export default useStakeToMagik;
