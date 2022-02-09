import {useCallback} from 'react';
import useMagikFinance from './useMagikFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useWithdrawFromBomb = () => {
  const magikFinance = useMagikFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(magikFinance.withdrawFromMagik(amount), `Redeem ${amount} MAGIK from xMAGIK Staking`);
    },
    [magikFinance, handleTransactionReceipt],
  );
  return {onWithdraw: handleWithdraw};
};

export default useWithdrawFromBomb;
