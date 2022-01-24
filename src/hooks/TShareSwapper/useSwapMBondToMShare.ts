import { useCallback } from 'react';
import useMagikFinance from '../useMagikFinance';
import useHandleTransactionReceipt from '../useHandleTransactionReceipt';
// import { BigNumber } from "ethers";
import { parseUnits } from 'ethers/lib/utils';


const useSwapMBondToMShare = () => {
  const tombFinance = useMagikFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleSwapTShare = useCallback(
  	(tbondAmount: string) => {
	  	const tbondAmountBn = parseUnits(tbondAmount, 18);
	  	handleTransactionReceipt(
	  		tombFinance.swapTBondToTShare(tbondAmountBn),
	  		`Swap ${tbondAmount} MBond to MShare`
	  	);
  	},
  	[tombFinance, handleTransactionReceipt]
  );
  return { onSwapTShare: handleSwapTShare };
};

export default useSwapMBondToMShare;