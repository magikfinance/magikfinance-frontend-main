import React, { useCallback, useEffect, useState } from 'react';
import Context from './context';
import useMagikFinance from '../../hooks/useMagikFinance';
import { Bank } from '../../magik-finance';
import config, { bankDefinitions } from '../../config';

const Banks: React.FC = ({ children }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const tombFinance = useMagikFinance();
  const isUnlocked = tombFinance?.isUnlocked;

  const fetchPools = useCallback(async () => {
    const banks: Bank[] = [];

    for (const bankInfo of Object.values(bankDefinitions)) {
      if (bankInfo.finished) {
        if (!tombFinance.isUnlocked) continue;

        // only show pools staked by user
        const balance = await tombFinance.stakedBalanceOnBank(
          bankInfo.contract,
          bankInfo.poolId,
          tombFinance.myAccount,
        );
        if (balance.lte(0)) {
          continue;
        }
      }
      banks.push({
        ...bankInfo,
        address: config.deployments[bankInfo.contract].address,
        depositToken: tombFinance.externalTokens[bankInfo.depositTokenName],
        earnToken: bankInfo.earnTokenName === 'MAGIK' ? tombFinance.MAGIK : tombFinance.MSHARE,
      });
    }
    banks.sort((a, b) => (a.sort > b.sort ? 1 : -1));
    setBanks(banks);
  }, [tombFinance, setBanks]);

  useEffect(() => {
    if (tombFinance) {
      fetchPools().catch((err) => console.error(`Failed to fetch pools: ${err.stack}`));
    }
  }, [isUnlocked, tombFinance, fetchPools]);

  return <Context.Provider value={{ banks }}>{children}</Context.Provider>;
};

export default Banks;
