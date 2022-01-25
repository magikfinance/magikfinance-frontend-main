import { useCallback, useEffect, useState } from 'react';
import useMagikFinance from './useMagikFinance';
import config from '../config';
import { BigNumber } from 'ethers';

const useCashPriceInLastTWAP = () => {
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  const tombFinance = useMagikFinance();

  const fetchCashPrice = useCallback(async () => {
    setPrice(await tombFinance.getMagikPriceInLastTWAP());
  }, [tombFinance]);

  useEffect(() => {
    fetchCashPrice().catch((err) => console.error(`Failed to fetch MAGIK price: ${err.stack}`));
    const refreshInterval = setInterval(fetchCashPrice, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPrice, tombFinance, fetchCashPrice]);
console.log("price ", price);
  return price;
};

export default useCashPriceInLastTWAP;
