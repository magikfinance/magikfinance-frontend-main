import { useCallback } from 'react';
import useMagikFinance from './useMagikFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemOnMasonry = (description?: string) => {
  const tombFinance = useMagikFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    const alertDesc = description || 'Redeem MSHARE from Dungeon';
    handleTransactionReceipt(tombFinance.exitFromMasonry(), alertDesc);
  }, [tombFinance, description, handleTransactionReceipt]);
  return { onRedeem: handleRedeem };
};

export default useRedeemOnMasonry;
