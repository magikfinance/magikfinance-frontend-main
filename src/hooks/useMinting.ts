import { useCallback } from 'react';
import useMagikFinance from './useMagikFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useMinting = () => {
  const tombFinance = useMagikFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleMint = useCallback(
    () => {
      handleTransactionReceipt(tombFinance.mintNFT(), `Mint yfdsafdsaour NFT`);
    },
    [tombFinance, handleTransactionReceipt],
  );
  return { onMint: handleMint };
};

export default useMinting;
