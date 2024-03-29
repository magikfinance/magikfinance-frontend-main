import React from 'react';

//Graveyard ecosystem logos
import tombLogo from '../../assets/img/crypto_tomb_cash.png';
import tShareLogo from '../../assets/img/mShare.png';
import tombLogoPNG from '../../assets/img/crypto_tomb_cash.png';
import tShareLogoPNG from '../../assets/img/mShare.png';
import tBondLogo from '../../assets/img/mBond.png';
import xMSHARElogo from '../../assets/img/xMSHARE.png';
import MIGHTlogo from '../../assets/img/MIGHT.png';

import tombFtmLpLogo from '../../assets/img/magik_ftm_lp.png';
import tshareFtmLpLogo from '../../assets/img/mshare_ftm_lp.png';
import magikmshareLogo from '../../assets/img/magikmshare.png';
import mshareusdclogo from '../../assets/img/mshareusdc.png';
import magikmimlogo from '../../assets/img/magikmimlogo.png';
import msharemimlogo from '../../assets/img/msharemimlogo.png';
import mimusdclogo from '../../assets/img/mimusdclogo.png';
import magikusdclogo from '../../assets/img/magikusdclogo.png';
import mimftmlogo from '../../assets/img/mimftmlogo.png';
import usdcftmlogo from '../../assets/img/usdcftmlogo.png';

import wftmLogo from '../../assets/img/ftm_logo_blue.svg';
import booLogo from '../../assets/img/spooky.png';
import zooLogo from '../../assets/img/zoo_logo.svg';
import shibaLogo from '../../assets/img/shiba_logo.svg';

const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  MAGIK: tombLogo,
  TOMBPNG: tombLogoPNG,
  xMSHARE: xMSHARElogo,
  MIGHT: MIGHTlogo,
  TSHAREPNG: tShareLogoPNG,
  MSHARE: tShareLogo,
  MBOND: tBondLogo,
  WFTM: wftmLogo,
  BOO: booLogo,
  SHIBA: shibaLogo,
  ZOO: zooLogo,
  'MAGIK-FTM-LP': tombFtmLpLogo,
  'MS-MAGIK-FTM': tombFtmLpLogo,
  'MAGIK-FTM Earn MAGIK': tombFtmLpLogo,
  'MS-MSHARE-FTM': tshareFtmLpLogo,
  'MSHARE-FTM-LP': tshareFtmLpLogo,
  'MAGIK-MSHARE-LP': magikmshareLogo,
  'MS-MAGIK-MSHARE-LP': magikmshareLogo,
  'MS-MSHARE-USDC': mshareusdclogo,
  'MAGIK-MIM-MS': magikmimlogo,
  'MSHARE-MIM-MS': msharemimlogo,
  'MIM-USDC-MS': mimusdclogo,
  'MS-MAGIK-USDC': magikusdclogo,
  'MIM-FTM-MS': mimftmlogo,
  'USDC-FTM-MS': usdcftmlogo,
};

type LogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({ symbol, size = 64 }) => {
  if (!logosBySymbol[symbol]) {
    throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }
  return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={size} height={size} />;
};

export default TokenSymbol;
