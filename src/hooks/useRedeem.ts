import { useCallback } from 'react';
import useMagikFinance from './useMagikFinance';
import { Bank } from '../magik-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeem = (bank: Bank) => {
  const tombFinance = useMagikFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    handleTransactionReceipt(tombFinance.exit(bank.contract, bank.poolId), `Redeem ${bank.contract}`);
  }, [bank, tombFinance, handleTransactionReceipt]);

  return { onRedeem: handleRedeem };
};

export default useRedeem;
