import { useCallback } from 'react';
import useMagikFinance from './useMagikFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useMinting = () => {
  const tombFinance = useMagikFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleMint = useCallback(
    () => {
      handleTransactionReceipt(tombFinance.mintNFT(), `Mint Your MAGIK NFT, Please Check Your MSHARE Balance`);
    },
    [tombFinance, handleTransactionReceipt],
  );
  return { onMint: handleMint };
};

export default useMinting;
