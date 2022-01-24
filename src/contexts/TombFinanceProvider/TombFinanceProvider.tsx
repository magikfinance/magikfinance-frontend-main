import React, { createContext, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import MagikFinance from '../../magik-finance';
import config from '../../config';

export interface TombFinanceContext {
  tombFinance?: MagikFinance;
}

export const Context = createContext<TombFinanceContext>({ tombFinance: null });

export const TombFinanceProvider: React.FC = ({ children }) => {
  const { ethereum, account } = useWallet();
  const [tombFinance, setTombFinance] = useState<MagikFinance>();

  useEffect(() => {
    if (!tombFinance) {
      const magik = new MagikFinance(config);
      if (account) {
        // wallet was unlocked at initialization
        magik.unlockWallet(ethereum, account);
      }
      setTombFinance(magik);
    } else if (account) {
      tombFinance.unlockWallet(ethereum, account);
    }
  }, [account, ethereum, tombFinance]);

  return <Context.Provider value={{ tombFinance }}>{children}</Context.Provider>;
};
