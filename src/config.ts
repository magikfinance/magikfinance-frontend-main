// import { ChainId } from '@pancakeswap-libs/sdk';
import { ChainId } from '@spiritswap/sdk';
import { Configuration } from './magik-finance/config';
import { BankInfo } from './magik-finance';

const configurations: { [env: string]: Configuration } = {
  development: {
    chainId: ChainId.MAINNET,
    networkName: 'Fantom Opera Testnet',
    ftmscanUrl: 'https://ftmscan.com',
    defaultProvider: 'https://rpc.ftm.tools',
    deployments: require('./magik-finance/deployments/deployments.testing.json'),
    externalTokens: {
      WFTM: ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', 18],
      FUSDT: ['0x049d68029688eAbF473097a2fC38ef61633A3C7A', 6],
      BOO: ['0x14f0C98e6763a5E13be5CE014d36c2b69cD94a1e', 18],
      ZOO: ['0x2317610e609674e53D9039aaB85D8cAd8485A7c5', 0],
      SHIBA: ['0x39523112753956d19A3d6a30E758bd9FF7a8F3C0', 9],
      MIM: ['0x82f0B8B456c1A451378467398982d4834b6829c1', 18],
      USDC: ['0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6],
      'USDT-FTM-LP': ['0xd14Dd3c56D9bc306322d4cEa0E1C49e9dDf045D4', 18],
      'MAGIK-FTM-LP': ['0xdc71a6160322ad78dab0abb47c7a581cfe9709ee', 18],
      'MSMAGIK-FTM-MS': ['0xA4188C6ec7CeCDdC0D975c79E0430786fF6eDD07', 18],
      'MS-MAGIK-MIM': ['0x221f7e9a9561aC9193D4A79FE66072D5603223E8', 18],
      'MSHARE-MIM-MS': ['0x6B9506E7811FfE2a1E860f0Bf2B9C7D78c5F5c22', 18],
      'MSHARE-FTM-MS': ['0xBeEe9C098E734E68054ab13Bbe6c43D4F1529E13', 18],
      'MAGIK-USDC-MS': ['0x2E28aEd21143CDAc666633bf2C31Db3F50E21EDD', 18],
      'USDC-FTM-MS': ['0xBB298171BE6AdD24b228f2B5A9D597f1bF354ABC', 18],
      'MSHARE-USDC-LP-MS': ['0xB1a53D68d55efB93a30D135A450c0a3cee864c25', 18],
      'MIM-USDC-MS': ['0x25CbB6c60625a24a7d7fe1b150C2A81a69bEc7f5', 18],
      'MIM-FTM-MS': ['0x7F2a310A6009d307Dab0B942011388379175e0E6', 18],
      'MSHARE-FTM-LP': ['0x392c85ceccf9855986b0044a365a5532aec6fa31', 18],
      'MAGIK-MSHARE-LP': ['0x4d6b28441c8b293a603243431e6e31f3c2632ddd', 18],
      'MS-MAGIK-MSHARE': ['0x451A339E0b122edDa68F750e5b1458Ec2b0935f7', 18],
      'MAGIK': ['0x87a5c9b60a3aaf1064006fe64285018e50e0d020', 18],
    },
    baseLaunchDate: new Date('2021-06-02 13:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    dungeonLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
  },
  production: {
    chainId: ChainId.MAINNET,
    networkName: 'Fantom Opera Mainnet',
    ftmscanUrl: 'https://ftmscan.com',
    defaultProvider: 'https://rpc.ftm.tools',
    deployments: require('./magik-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
      WFTM: ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', 18],
      FUSDT: ['0x049d68029688eAbF473097a2fC38ef61633A3C7A', 6],
      BOO: ['0x14f0C98e6763a5E13be5CE014d36c2b69cD94a1e', 18],
      ZOO: ['0x2317610e609674e53D9039aaB85D8cAd8485A7c5', 0],
      SHIBA: ['0x39523112753956d19A3d6a30E758bd9FF7a8F3C0', 9],
      MIM: ['0x82f0B8B456c1A451378467398982d4834b6829c1', 18],
      USDC: ['0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6],
      'USDT-FTM-LP': ['0xd14Dd3c56D9bc306322d4cEa0E1C49e9dDf045D4', 18],
      'MAGIK-FTM-LP': ['0xdc71a6160322ad78dab0abb47c7a581cfe9709ee', 18],
      'MSMAGIK-FTM-MS': ['0xA4188C6ec7CeCDdC0D975c79E0430786fF6eDD07', 18],
      'MS-MAGIK-MIM': ['0x221f7e9a9561aC9193D4A79FE66072D5603223E8', 18],
      'MSHARE-MIM-MS': ['0x6B9506E7811FfE2a1E860f0Bf2B9C7D78c5F5c22', 18],
      'MSHARE-FTM-MS': ['0xBeEe9C098E734E68054ab13Bbe6c43D4F1529E13', 18],
      'MAGIK-USDC-MS': ['0x2E28aEd21143CDAc666633bf2C31Db3F50E21EDD', 18],
      'USDC-FTM-MS': ['0xBB298171BE6AdD24b228f2B5A9D597f1bF354ABC', 18],
      'MSHARE-USDC-LP-MS': ['0xB1a53D68d55efB93a30D135A450c0a3cee864c25', 18],
      'MIM-USDC-MS': ['0x25CbB6c60625a24a7d7fe1b150C2A81a69bEc7f5', 18],
      'MIM-FTM-MS': ['0x7F2a310A6009d307Dab0B942011388379175e0E6', 18],
      'MSHARE-FTM-LP': ['0x392c85ceccf9855986b0044a365a5532aec6fa31', 18],
      'MAGIK-MSHARE-LP': ['0x4d6b28441c8b293a603243431e6e31f3c2632ddd', 18],
      'MS-MAGIK-MSHARE': ['0x451A339E0b122edDa68F750e5b1458Ec2b0935f7', 18],
      'MAGIK': ['0x87a5c9b60a3aaf1064006fe64285018e50e0d020', 18],
    },
    baseLaunchDate: new Date('2021-06-02 13:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    dungeonLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
  },
};

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  /*
  Explanation:
  name: description of the card
  poolId: the poolId assigned in the contract
  sectionInUI: way to distinguish in which of the 3 pool groups it should be listed
        - 0 = Single asset stake pools
        - 1 = LP asset staking rewarding MAGIK
        - 2 = LP asset staking rewarding MSHARE
        - 3 = LP asset staking rewarding MSHARE, on MagikSwap 
  contract: the contract name which will be loaded from the deployment.environmnet.json
  depositTokenName : the name of the token to be deposited
  earnTokenName: the rewarded token
  finished: will disable the pool on the UI if set to true
  sort: the order of the pool
  */
  MagikFtmLPTShareRewardPool: {
    name: 'Earn MSHARE by MAGIK-FTM LP',
    poolId: 0,
    sectionInUI: 2,
    contract: 'MagikFtmLPTShareRewardPool',
    depositTokenName: 'MAGIK-FTM-LP',
    earnTokenName: 'MSHARE',
    finished: false,
    sort: 6,
    closedForStaking: false,
  },
  MshareFtmLPMShareRewardPool: {
    name: 'Earn MSHARE by MSHARE-FTM LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'MshareFtmLPMShareRewardPool',
    depositTokenName: 'MSHARE-FTM-LP',
    earnTokenName: 'MSHARE',
    finished: false,
    sort: 7,
    closedForStaking: false,
  },
  MagikMshareLPMShareRewardPool: {
    name: 'Earn MSHARE by MAGIK-MSHARE LP',
    poolId: 2,
    sectionInUI: 2,
    contract: 'MagikMshareLPMShareRewardPool',
    depositTokenName: 'MAGIK-MSHARE-LP',
    earnTokenName: 'MSHARE',
    finished: false,
    sort: 8,
    closedForStaking: false,
  },
  MagikMShareRewardPool: {
    name: 'Earn MSHARE by staking MAGIK',
    poolId: 3,
    sectionInUI: 2,
    contract: 'MagikMShareRewardPool',
    depositTokenName: 'MAGIK',
    earnTokenName: 'MSHARE',
    finished: false,
    sort: 9,
    closedForStaking: false,
  },
  MSMagikFtmLPReward: {
    name: 'Earn MSHARE by MSMAGIK-FTM-MS',
    poolId: 6,
    sectionInUI: 3,
    contract: 'MSMagikFtmLPReward',
    depositTokenName: 'MSMAGIK-FTM-MS',
    earnTokenName: 'MSHARE',
    finished: false,
    sort: 10,
    closedForStaking: false,
  },
  MshareFtmMSLP: {
    name: 'Earn MSHARE by MSHARE-FTM-MS',
    poolId: 7,
    sectionInUI: 3,
    contract: 'MshareFtmMSLP',
    depositTokenName: 'MSHARE-FTM-MS',
    earnTokenName: 'MSHARE',
    finished: false,
    sort: 10,
    closedForStaking: false,
  },
    MagikMshareMSLP: {
    name: 'Earn MSHARE by MS-MAGIK-MSHARE',
    poolId: 8,
    sectionInUI: 3,
    contract: 'MagikMshareMSLP',
    depositTokenName: 'MS-MAGIK-MSHARE',
    earnTokenName: 'MSHARE',
    finished: false,
    sort: 10,
    closedForStaking: false,
  },
  // MshareUSDCLPMS: {
  //   name: 'Earn MSHARE by MSHARE-USDC-LP-MS',
  //   poolId: 16,
  //   sectionInUI: 2,
  //   contract: 'MshareUSDCLPMS',
  //   depositTokenName: 'MSHARE-USDC-LP-MS',
  //   earnTokenName: 'MSHARE',
  //   finished: false,
  //   sort: 10,
  //   closedForStaking: false,
  // },
  MagikMIMLPMS: {
    name: 'Earn MSHARE by MS-MAGIK-MIM',
    poolId: 9,
    sectionInUI: 3,
    contract: 'MagikMIMLPMS',
    depositTokenName: 'MS-MAGIK-MIM',
    earnTokenName: 'MSHARE',
    finished: false,
    sort: 10,
    closedForStaking: false,
  },
  MshareMIMLPMS: {
    name: 'Earn MSHARE by MSHARE-MIM-MS',
    poolId: 10,
    sectionInUI: 3,
    contract: 'MshareMIMLPMS',
    depositTokenName: 'MSHARE-MIM-MS',
    earnTokenName: 'MSHARE',
    finished: false,
    sort: 10,
    closedForStaking: false,
  },
  // MIMUSDCLPMS: {
  //   name: 'Earn MSHARE by MIM-USDC-MS',
  //   poolId: 13,
  //   sectionInUI: 2,
  //   contract: 'MIMUSDCLPMS',
  //   depositTokenName: 'MIM-USDC-MS',
  //   earnTokenName: 'MSHARE',
  //   finished: false,
  //   sort: 10,
  //   closedForStaking: false,
  // },
  // MagikUSDCLPMS: {
  //   name: 'Earn MSHARE by MAGIK-USDC-MS',
  //   poolId: 12,
  //   sectionInUI: 2,
  //   contract: 'MagikUSDCLPMS',
  //   depositTokenName: 'MAGIK-USDC-MS',
  //   earnTokenName: 'MSHARE',
  //   finished: false,
  //   sort: 10,
  //   closedForStaking: false,
  // },
  // MIMFTMLPMS: {
  //   name: 'Earn MSHARE by MIM-FTM-MS',
  //   poolId: 11,
  //   sectionInUI: 2,
  //   contract: 'MIMFTMLPMS',
  //   depositTokenName: 'MIM-FTM-MS',
  //   earnTokenName: 'MSHARE',
  //   finished: false,
  //   sort: 10,
  //   closedForStaking: false,
  // },
  // USDCFTMLPMS: {
  //   name: 'Earn MSHARE by USDC-FTM-MS',
  //   poolId: 10,
  //   sectionInUI: 2,
  //   contract: 'USDCFTMLPMS',
  //   depositTokenName: 'USDC-FTM-MS',
  //   earnTokenName: 'MSHARE',
  //   finished: false,
  //   sort: 10,
  //   closedForStaking: false,
  // },
  
};

export default configurations[process.env.NODE_ENV || 'development'];
