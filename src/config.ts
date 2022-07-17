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
      FUSDT: ['0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6],
      BOO: ['0x14f0C98e6763a5E13be5CE014d36c2b69cD94a1e', 18],
      ZOO: ['0x2317610e609674e53D9039aaB85D8cAd8485A7c5', 0],
      SHIBA: ['0x39523112753956d19A3d6a30E758bd9FF7a8F3C0', 9],
      'USDT-FTM-LP': ['0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c', 18],
      'MAGIK-FTM-LP': ['0xdc71a6160322ad78dab0abb47c7a581cfe9709ee', 18],
      'REDMAGIK-FTM': ['0xdA52C116fB258dC286CEbAB47bC5169597206574', 18],
      'REDMSHARE-FTM': ['0x7a1CeE76D132f12e534613De2AA0ec361504a659', 18],
      'MSHARE-FTM-LP': ['0x392c85ceccf9855986b0044a365a5532aec6fa31', 18],
      'MAGIK-MSHARE-LP': ['0x4d6b28441c8b293a603243431e6e31f3c2632ddd', 18],
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
      FUSDT: ['0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6], // This is actually usdc on mainnet not fusdt
      BOO: ['0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE', 18],
      ZOO: ['0x09e145a1d53c0045f41aeef25d8ff982ae74dd56', 0],
      SHIBA: ['0x9ba3e4f84a34df4e08c112e1a0ff148b81655615', 9],
      'USDT-FTM-LP': ['0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c', 18],
      'MAGIK-FTM-LP': ['0xdc71a6160322ad78dab0abb47c7a581cfe9709ee', 18],
      'MSHARE-FTM-LP': ['0x392c85ceccf9855986b0044a365a5532aec6fa31', 18],
      // 'REDMAGIK-FTM': ['0xdA52C116fB258dC286CEbAB47bC5169597206574', 18],
      // 'REDMSHARE-FTM': ['0x7a1CeE76D132f12e534613De2AA0ec361504a659', 18],
      'MAGIK-MSHARE-LP': ['0x4d6b28441c8b293a603243431e6e31f3c2632ddd', 18],
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
  // MagikRedLPReward: {
  //   name: 'Earn MSHARE by REDMAGIK-FTM',
  //   poolId: 4,
  //   sectionInUI: 2,
  //   contract: 'MagikRedLPReward',
  //   depositTokenName: 'REDMAGIK-FTM',
  //   earnTokenName: 'MSHARE',
  //   finished: false,
  //   sort: 10,
  //   closedForStaking: true,
  // },
  // MshareRedLPReward: {
  //   name: 'Earn MSHARE by REDMSHARE-FTM',
  //   poolId: 5,
  //   sectionInUI: 2,
  //   contract: 'MshareRedLPReward',
  //   depositTokenName: 'REDMSHARE-FTM',
  //   earnTokenName: 'MSHARE',
  //   finished: false,
  //   sort: 10,
  //   closedForStaking: true,
  // },
};

export default configurations[process.env.NODE_ENV || 'development'];
