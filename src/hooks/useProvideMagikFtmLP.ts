import { useCallback } from 'react';
import useMagikFinance from './useMagikFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';
import { TAX_OFFICE_ADDR } from './../utils/constants'

const useProvideMagikFtmLP = () => {
  const tombFinance = useMagikFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleProvideTombFtmLP = useCallback(
    (ftmAmount: string, tombAmount: string) => {
      const tombAmountBn = parseUnits(tombAmount);
      handleTransactionReceipt(
        tombFinance.provideTombFtmLP(ftmAmount, tombAmountBn),
        `Provide Magik-FTM LP ${tombAmount} ${ftmAmount} using ${TAX_OFFICE_ADDR}`,
      );
    },
    [tombFinance, handleTransactionReceipt],
  );
  return { onProvideTombFtmLP: handleProvideTombFtmLP };
};

export default useProvideMagikFtmLP;
