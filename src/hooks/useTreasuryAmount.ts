import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useMagikFinance from './useMagikFinance';

const useTreasuryAmount = () => {
  const [amount, setAmount] = useState(BigNumber.from(0));
  const tombFinance = useMagikFinance();

  useEffect(() => {
    if (tombFinance) {
      const { Treasury } = tombFinance.contracts;
      tombFinance.MAGIK.balanceOf(Treasury.address).then(setAmount);
    }
  }, [tombFinance]);
  return amount;
};

export default useTreasuryAmount;
