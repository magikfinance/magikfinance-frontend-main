import { useContext } from 'react';
import { Context } from '../contexts/TombFinanceProvider';

const useMagikFinance = () => {
  const { tombFinance } = useContext(Context);
  return tombFinance;
};

export default useMagikFinance;
