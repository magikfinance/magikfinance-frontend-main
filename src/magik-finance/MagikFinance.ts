// import { Fetcher, Route, Token } from '@uniswap/sdk';
import { Fetcher as FetcherSpirit, Token as TokenSpirit } from '@spiritswap/sdk';
import { Fetcher, Route, Token } from '@spiritswap/sdk';
import { Configuration } from './config';
import { ContractName, TokenStat, AllocationTime, LPStat, Bank, PoolStats, TShareSwapperStat } from './types';
import { BigNumber, Contract, ethers, EventFilter } from 'ethers';
import { decimalToBalance } from './ether-utils';
import { TransactionResponse } from '@ethersproject/providers';
import ERC20 from './ERC20';
import { getFullDisplayBalance, getDisplayBalance } from '../utils/formatBalance';
import { getDefaultProvider } from '../utils/provider';
import IUniswapV2PairABI from './IUniswapV2Pair.abi.json';
import config, { bankDefinitions } from '../config';
import moment from 'moment';
import { parseUnits } from 'ethers/lib/utils';
import { FTM_TICKER, SPOOKY_ROUTER_ADDR, TOMB_TICKER } from '../utils/constants';
/**
 * An API module of Magik Finance contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class MagikFinance {
  myAccount: string;
  provider: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
  config: Configuration;
  contracts: { [name: string]: Contract };
  externalTokens: { [name: string]: ERC20 };
  masonryVersionOfUser?: string;

  TOMBWFTM_LP: Contract;
  MAGIKREDLP: Contract;
  MAGIK: ERC20;
  MSHARE: ERC20;
  MBOND: ERC20;
  XMAGIK: ERC20;
  FTM: ERC20;

  constructor(cfg: Configuration) {
    const { deployments, externalTokens } = cfg;
    const provider = getDefaultProvider();

    // loads contracts from deployments
    this.contracts = {};
    for (const [name, deployment] of Object.entries(deployments)) {
      this.contracts[name] = new Contract(deployment.address, deployment.abi, provider);
    }
    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new ERC20(address, provider, symbol, decimal);
    }
    this.MAGIK = new ERC20(deployments.magik.address, provider, 'MAGIK');
    this.MSHARE = new ERC20(deployments.mShare.address, provider, 'MSHARE');
    this.MBOND = new ERC20(deployments.mBond.address, provider, 'MBOND');
    this.FTM = this.externalTokens['WFTM'];
    this.XMAGIK = new ERC20(deployments.xMAGIK.address, provider, 'XMAGIK');

    // Uniswap V2 Pair
    this.TOMBWFTM_LP = new Contract(externalTokens['MAGIK-FTM-LP'][0], IUniswapV2PairABI, provider);

    this.config = cfg;
    this.provider = provider;
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: any, account: string) {
    const newProvider = new ethers.providers.Web3Provider(provider, this.config.chainId);
    this.signer = newProvider.getSigner(0);
    this.myAccount = account;
    for (const [name, contract] of Object.entries(this.contracts)) {
      this.contracts[name] = contract.connect(this.signer);
    }
    const tokens = [this.MAGIK, this.MSHARE, this.MBOND, ...Object.values(this.externalTokens)];
    for (const token of tokens) {
      token.connect(this.signer);
    }
    this.TOMBWFTM_LP = this.TOMBWFTM_LP.connect(this.signer);
    console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
    this.fetchMasonryVersionOfUser()
      .then((version) => (this.masonryVersionOfUser = version))
      .catch((err) => {
        console.error(`Failed to fetch masonry version: ${err.stack}`);
        this.masonryVersionOfUser = 'latest';
      });
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //===================FROM SPOOKY TO DISPLAY =========================
  //=========================IN HOME PAGE==============================
  //===================================================================

  async getMagikStat(): Promise<TokenStat> {
    const { TombFtmRewardPool, TombFtmLpTombRewardPool, TombFtmLpTombRewardPoolOld } = this.contracts;
    const supply = await this.MAGIK.totalSupply();
    const tombRewardPoolSupply = await this.MAGIK.balanceOf(TombFtmRewardPool.address);
    const tombRewardPoolSupply2 = await this.MAGIK.balanceOf(TombFtmLpTombRewardPool.address);
    const tombRewardPoolSupplyOld = await this.MAGIK.balanceOf(TombFtmLpTombRewardPoolOld.address);
    const tombCirculatingSupply = supply
      .sub(tombRewardPoolSupply)
      .sub(tombRewardPoolSupply2)
      .sub(tombRewardPoolSupplyOld);
    const priceInFTM = await this.getTokenPriceFromPancakeswap(this.MAGIK);

    const priceOfOneFTM = await this.getWFTMPriceFromPancakeswap();

    const priceOfTombInDollars = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(2);

    return {
      tokenInFtm: priceInFTM,
      priceInDollars: priceOfTombInDollars,
      totalSupply: getDisplayBalance(supply, this.MAGIK.decimal, 0),
      circulatingSupply: getDisplayBalance(tombCirculatingSupply, this.MAGIK.decimal, 0),
    };
  }

  /**
   * Calculates various stats for the requested LP
   * @param name of the LP token to load stats for
   * @returns
   */
  async getLPStat(name: string): Promise<LPStat> {
    const lpToken = this.externalTokens[name];

    const lpTokenSupplyBN = await lpToken.totalSupply();
    const lpTokenSupply = getDisplayBalance(lpTokenSupplyBN, 18);
    const token0 = name.startsWith('MAGIK') ? this.MAGIK : this.MSHARE;
    const isTomb = name.startsWith('MAGIK');
    const tokenAmountBN = await token0.balanceOf(lpToken.address);
    const tokenAmount = getDisplayBalance(tokenAmountBN, 18);
    
    const ftmAmountBN = lpToken.symbol === "MAGIK-MSHARE-LP" ? await this.MSHARE.balanceOf(lpToken.address) : await this.FTM.balanceOf(lpToken.address);
    const ftmAmount = getDisplayBalance(ftmAmountBN, 18);
    const tokenAmountInOneLP = Number(tokenAmount) / Number(lpTokenSupply);
    const ftmAmountInOneLP = Number(ftmAmount) / Number(lpTokenSupply);
    const lpTokenPrice = await this.getLPTokenPrice(lpToken, token0, isTomb);
    const lpTokenPriceFixed = Number(lpTokenPrice).toFixed(2).toString();
    const liquidity = (Number(lpTokenSupply) * Number(lpTokenPrice)).toFixed(2).toString();
    return {
      tokenAmount: tokenAmountInOneLP.toFixed(2).toString(),
      ftmAmount: ftmAmountInOneLP.toFixed(2).toString(),
      priceOfOne: lpTokenPriceFixed,
      totalLiquidity: liquidity,
      totalSupply: Number(lpTokenSupply).toFixed(2).toString(),
    };
  }

  /**
   * Use this method to get price for Magik
   * @returns TokenStat for MBOND
   * priceInFTM
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getBondStat(): Promise<TokenStat> {
    const { Treasury } = this.contracts;
    const tombStat = await this.getMagikStat();
    const bondTombRatioBN = await Treasury.getBondPremiumRate();
    const modifier = bondTombRatioBN / 1e18 > 1 ? bondTombRatioBN / 1e18 : 1;
    const bondPriceInFTM = (Number(tombStat.tokenInFtm) * modifier).toFixed(2);
    const priceOfTBondInDollars = (Number(tombStat.priceInDollars) * modifier).toFixed(2);
    const supply = await this.MBOND.displayedTotalSupply();
    return {
      tokenInFtm: bondPriceInFTM,
      priceInDollars: priceOfTBondInDollars,
      totalSupply: supply,
      circulatingSupply: supply,
    };
  }

  /**
   * @returns TokenStat for MSHARE
   * priceInFTM
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getShareStat(): Promise<TokenStat> {
    const { MagikFtmLPTShareRewardPool } = this.contracts;

    const supply = await this.MSHARE.totalSupply();

    const priceInFTM = await this.getTokenPriceFromPancakeswap(this.MSHARE);
    const tombRewardPoolSupply = await this.MSHARE.balanceOf(MagikFtmLPTShareRewardPool.address);
    const tShareCirculatingSupply = supply.sub(tombRewardPoolSupply);
    const priceOfOneFTM = await this.getWFTMPriceFromPancakeswap();
    const priceOfSharesInDollars = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(2);


    return {
      tokenInFtm: priceInFTM,
      priceInDollars: priceOfSharesInDollars,
      totalSupply: getDisplayBalance(supply, this.MSHARE.decimal, 0),
      circulatingSupply: getDisplayBalance(tShareCirculatingSupply, this.MSHARE.decimal, 0),
    };
  }
  async sendMagik(amount: string | number, recepient: string): Promise<TransactionResponse> {
    const {magik} = this.contracts;
    
    return await magik.transfer(recepient, decimalToBalance(amount));
  }

  async getMagikStatInEstimatedTWAP(): Promise<TokenStat> {
    const { SeigniorageOracle, TombFtmRewardPool } = this.contracts;
    const expectedPrice = await SeigniorageOracle.twap(this.MAGIK.address, ethers.utils.parseEther('1'));

    const supply = await this.MAGIK.totalSupply();
    const tombRewardPoolSupply = await this.MAGIK.balanceOf(TombFtmRewardPool.address);
    const tombCirculatingSupply = supply.sub(tombRewardPoolSupply);
    return {
      tokenInFtm: getDisplayBalance(expectedPrice),
      priceInDollars: getDisplayBalance(expectedPrice),
      totalSupply: getDisplayBalance(supply, this.MAGIK.decimal, 0),
      circulatingSupply: getDisplayBalance(tombCirculatingSupply, this.MAGIK.decimal, 0),
    };
  }

  async getMagikPriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getMagikUpdatedPrice();
  }

  async getBondsPurchasable(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getBurnableMagikLeft();
  }

  /**
   * Calculates the TVL, APR and daily APR of a provided pool/bank
   * @param bank
   * @returns
   */
  async getPoolAPRs(bank: Bank): Promise<PoolStats> {
    if (this.myAccount === undefined) return;
    const depositToken = bank.depositToken;
    const poolContract = this.contracts[bank.contract];
    const depositTokenPrice = await this.getDepositTokenPriceInDollars(bank.depositTokenName, depositToken);
    const stakeInPool = await depositToken.balanceOf(bank.address);
    const TVL = Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));
    const stat = bank.earnTokenName === 'MAGIK' ? await this.getMagikStat() : await this.getShareStat();
    const tokenPerSecond = await this.getTokenPerSecond(
      bank.earnTokenName,
      bank.contract,
      poolContract,
      bank.depositTokenName,
      
    );
    const tokenPerHour = tokenPerSecond.mul(60).mul(60);
    
    const totalRewardPricePerYear =
      Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24).mul(365)));
    const totalRewardPricePerDay = Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24)));
    const totalStakingTokenInPool =
      Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));
    const dailyAPR = (totalRewardPricePerDay / totalStakingTokenInPool) * 100;
    const yearlyAPR = (totalRewardPricePerYear / totalStakingTokenInPool) * 100;
    return {
      dailyAPR: dailyAPR.toFixed(2).toString(),
      yearlyAPR: yearlyAPR.toFixed(2).toString(),
      TVL: TVL.toFixed(2).toString(),
    };
  }

  async getRaffleStat(account: string, raffleAddress: string): Promise<TokenStat> {
    let total = 0;
    const {magik} = this.contracts;
    
    const priceInDollars = await this.getTokenPriceFromSpiritswap(this.MAGIK);
    
    const balOfRaffle = await magik.balanceOf(raffleAddress);
    
    const currentBlockNumber = await this.provider.getBlockNumber();
    
    const filterTo = magik.filters.Transfer(account, raffleAddress);
   
    const startBlock = currentBlockNumber-100000;

    let allEvents : any = [];
    
    for(let i = startBlock; i < currentBlockNumber; i += 2000) {
      const _startBlock = i;
      const _endBlock = Math.min(currentBlockNumber, i + 1999);
      const events = await magik.queryFilter(filterTo, _startBlock, _endBlock);
      allEvents = [...allEvents, ...events]
    }


    if (allEvents.length !== 0 && account !== null) {
      for (let i = 0; i < allEvents.length; i++) {
        total = total + Number(allEvents[i].args.value);
      }
      total = total / 1e18;
    } else {
      total = 0;
    }
    
    return {
      tokenInFtm: priceInDollars.toString(),
      priceInDollars: total.toString(),
      totalSupply: getDisplayBalance(balOfRaffle, 18, 0),
      circulatingSupply: raffleAddress.toString(),
    };
  }

  async getXmagikAPR(): Promise<PoolStats> {
    if (this.myAccount === undefined) return;
    const magikToken = this.MAGIK;
    const xmagikToken = this.XMAGIK;

    const xmagikPercent = await this.getXmagikExchange();


    const xmagikPercentTotal = (Number(xmagikPercent) / 1000000000000000000) * 100 - 100;



    const depositTokenPrice = await this.getDepositTokenPriceInDollars(magikToken.symbol, magikToken);

    const stakeInPool = await magikToken.balanceOf(xmagikToken.address);

    const TVL = Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, magikToken.decimal));

    const startDate = new Date('February 09, 2022');

    const nowDate = new Date(Date.now());

    const difference = nowDate.getTime() - startDate.getTime();

    const days = difference / 60 / 60 / 24 / 1000;

    const aprPerDay = xmagikPercentTotal / days;


    const dailyAPR = aprPerDay;
    const yearlyAPR = aprPerDay * 365;
    return {
      dailyAPR: dailyAPR.toFixed(2).toString(),
      yearlyAPR: yearlyAPR.toFixed(2).toString(),
      TVL: TVL.toFixed(2).toString(),
    };
  }
  async getMagikStakeAPR() {
    const Masonry = this.currentMasonry();
    const latestSnapshotIndex = await Masonry.latestSnapshotIndex();
    const lastHistory = await Masonry.masonryHistory(latestSnapshotIndex);

    const lastRewardsReceived = lastHistory[1];

    const MAGIKPrice = (await this.getMagikStat()).priceInDollars;
    const epochRewardsPerShare = lastRewardsReceived / 1e18;

    //Mgod formula
    const amountOfRewardsPerDay = epochRewardsPerShare * Number(MAGIKPrice) * 4;
    const xMagikMagikBalanceOf = await this.MAGIK.balanceOf(this.XMAGIK.address);
    const magikTVL = Number(getDisplayBalance(xMagikMagikBalanceOf, this.XMAGIK.decimal)) * Number(MAGIKPrice);
    const realAPR = ((amountOfRewardsPerDay * 20) / magikTVL) * 365;
    return realAPR;
  }


  /**
   * Method to return the amount of tokens the pool yields per second
   * @param earnTokenName the name of the token that the pool is earning
   * @param contractName the contract of the pool/bank
   * @param poolContract the actual contract of the pool
   * @returns
   */
  async getTokenPerSecond(
    earnTokenName: string,
    contractName: string,
    poolContract: Contract,
    depositTokenName: string,
  ) {
    if (earnTokenName === 'MAGIK') {
      if (!contractName.endsWith('TombRewardPool')) {
        const rewardPerSecond = await poolContract.tombPerSecond();
        if (depositTokenName === 'WFTM') {
          return rewardPerSecond.mul(6000).div(11000).div(24);
        } else if (depositTokenName === 'BOO') {
          return rewardPerSecond.mul(2500).div(11000).div(24);
        } else if (depositTokenName === 'ZOO') {
          return rewardPerSecond.mul(1000).div(11000).div(24);
        } else if (depositTokenName === 'SHIBA') {
          return rewardPerSecond.mul(1500).div(11000).div(24);
        }
        return rewardPerSecond.div(24);
      }
      const poolStartTime = await poolContract.poolStartTime();
      const startDateTime = new Date(poolStartTime.toNumber() * 1000);
      const FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;
      if (Date.now() - startDateTime.getTime() > FOUR_DAYS) {
        return await poolContract.epochTombPerSecond(1);
      }
      return await poolContract.epochTombPerSecond(0);
    }
    
    const rewardPerSecond = await poolContract.mSharePerSecond();
    if (depositTokenName.startsWith('MAGIK-MSHARE-LP')) {
      return rewardPerSecond.mul(1000).div(59500); // pid2
    } if (depositTokenName.startsWith('MSHARE-FTM-LP')) {
      return rewardPerSecond.mul(4500).div(59500); // pid: 1 
    } if (depositTokenName.startsWith('MAGIK-FTM-LP')) {
      return rewardPerSecond.mul(17000).div(59500); //pid : 0
    } if (depositTokenName ===('REDMAGIK-FTM')) {
      return rewardPerSecond.mul(0).div(59500); // pid: 4
    } if (depositTokenName ===('REDMSHARE-FTM')) {
      return rewardPerSecond.mul(0).div(59500); // pid: 5
    } if (depositTokenName.startsWith('MAGIK')) {
      return rewardPerSecond.mul(27800).div(59500); // pid: 3 
    }
    
    
    

  }
  async getLPV2TokenPrice(lpToken: ERC20, token: ERC20, isTomb: boolean): Promise<string> {
    const totalSupply = getFullDisplayBalance(await lpToken.totalSupply(), lpToken.decimal);
    //Get amount of tokenA
    const tokenSupply = getFullDisplayBalance(await token.balanceOf(lpToken.address), token.decimal);
    const stat = isTomb === true
      ? await this.getMagikStat()
      : await this.getShareStat();
    const priceOfToken = stat.priceInDollars;
    console.log(priceOfToken)
    const tokenInLP = Number(tokenSupply) / Number(totalSupply);
    const tokenPrice = (Number(priceOfToken) * tokenInLP * 2) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
      .toString();
    console.log(tokenPrice)
    return tokenPrice;
  }
  /**
   * Method to calculate the tokenPrice of the deposited asset in a pool/bank
   * If the deposited token is an LP it will find the price of its pieces
   * @param tokenName
   * @param pool
   * @param token
   * @returns
   */
  async getDepositTokenPriceInDollars(tokenName: string, token: ERC20) {
    let tokenPrice;
    const priceOfOneFtmInDollars = await this.getWFTMPriceFromPancakeswap();

    if (tokenName === 'WFTM') {
      tokenPrice = priceOfOneFtmInDollars;
    } else {
      if (tokenName === 'MAGIK-FTM-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.MAGIK, true);
      } else if (tokenName === 'MSHARE-FTM-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.MSHARE, false);
      } else if (tokenName === 'MAGIK-MSHARE-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.MSHARE, false);
      } else if (tokenName === 'REDMAGIK-FTM') {
        tokenPrice = await this.getLPV2TokenPrice(
          token,
          this.MAGIK,
          true
        );
      } else if (tokenName === 'REDMSHARE-FTM') {
        tokenPrice = await this.getLPV2TokenPrice(
          token,
          this.MSHARE,
          false
        );
      } else if (tokenName === 'SHIBA') {
        tokenPrice = await this.getTokenPriceFromSpiritswap(token);
      } else {
        tokenPrice = await this.getTokenPriceFromPancakeswap(token);
        tokenPrice = (Number(tokenPrice) * Number(priceOfOneFtmInDollars)).toString();
      }
    }
    return tokenPrice;
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //=========================== END ===================================
  //===================================================================

  async getCurrentEpoch(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.epoch();
  }

  async getBondOraclePriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getBondPremiumRate();
  }

  /**
   * Buy bonds with cash.
   * @param amount amount of cash to purchase bonds with.
   */
  async buyBonds(amount: string | number): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    const treasuryTombPrice = await Treasury.getMagikPrice();
    return await Treasury.buyBonds(decimalToBalance(amount), treasuryTombPrice);
  }

  /**
   * Redeem bonds for cash.
   * @param amount amount of bonds to redeem.
   */
  async redeemBonds(amount: string): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    const PriceForMagik = await Treasury.getMagikPrice();
    return await Treasury.redeemBonds(decimalToBalance(amount), PriceForMagik);
  }

  async getTotalValueLocked(): Promise<Number> {
    let totalValue = 0;
    for (const bankInfo of Object.values(bankDefinitions)) {
      const pool = this.contracts[bankInfo.contract];
      const token = this.externalTokens[bankInfo.depositTokenName];
      const tokenPrice = await this.getDepositTokenPriceInDollars(bankInfo.depositTokenName, token);
      const tokenAmountInPool = await token.balanceOf(pool.address);
      const value = Number(getDisplayBalance(tokenAmountInPool, token.decimal)) * Number(tokenPrice);
      const poolValue = Number.isNaN(value) ? 0 : value;
      totalValue += poolValue;
    }

    const TSHAREPrice = (await this.getShareStat()).priceInDollars;
    const masonrytShareBalanceOf = await this.MSHARE.balanceOf(this.currentMasonry().address);
    const masonryTVL = Number(getDisplayBalance(masonrytShareBalanceOf, this.MSHARE.decimal)) * Number(TSHAREPrice);
    const MAGIKPrice = (await this.getMagikStat()).priceInDollars;

    return totalValue + masonryTVL;
  }

  /**
   * Calculates the price of an LP token
   * Reference https://github.com/DefiDebauchery/discordpricebot/blob/4da3cdb57016df108ad2d0bb0c91cd8dd5f9d834/pricebot/pricebot.py#L150
   * @param lpToken the token under calculation
   * @param token the token pair used as reference (the other one would be FTM in most cases)
   * @param isTomb sanity check for usage of magik token or mShare
   * @returns price of the LP token
   */
  async getLPTokenPrice(lpToken: ERC20, token: ERC20, isTomb: boolean): Promise<string> {
    const totalSupply = getFullDisplayBalance(await lpToken.totalSupply(), lpToken.decimal);
    //Get amount of tokenA
    const tokenSupply = getFullDisplayBalance(await token.balanceOf(lpToken.address), token.decimal);
    const stat = isTomb === true ? await this.getMagikStat() : await this.getShareStat();
    const priceOfToken = stat.priceInDollars;
    const tokenInLP = Number(tokenSupply) / Number(totalSupply);
    const tokenPrice = (Number(priceOfToken) * tokenInLP * 2) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
      .toString();
    return tokenPrice;
  }

  async earnedFromBank(
    poolName: ContractName,
    earnTokenName: String,
    poolId: Number,
    account = this.myAccount,
  ): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      if (earnTokenName === 'MAGIK') {
        return await pool.pendingTOMB(poolId, account);
      } else {
        return await pool.pendingShare(poolId, account);
      }
    } catch (err) {
      console.error(`Failed to call earned() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  async stakedBalanceOnBank(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      let userInfo = await pool.userInfo(poolId, account);
      return await userInfo.amount;
    } catch (err) {
      console.error(`Failed to call balanceOf() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  /**
   * Deposits token to given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async stake(poolName: ContractName, poolId: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    return await pool.deposit(poolId, amount);
  }

  /**
   * Withdraws token from given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async unstake(poolName: ContractName, poolId: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    return await pool.withdraw(poolId, amount);
  }

  /**
   * Transfers earned token reward from given pool to my account.
   */
  async harvest(poolName: ContractName, poolId: Number): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    //By passing 0 as the amount, we are asking the contract to only redeem the reward and not the currently staked token
    return await pool.withdraw(poolId, 0);
  }

  /**
   * Harvests and withdraws deposited tokens from the pool.
   */
  async exit(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    let userInfo = await pool.userInfo(poolId, account);
    return await pool.withdraw(poolId, userInfo.amount);
  }

  async fetchMasonryVersionOfUser(): Promise<string> {
    return 'latest';
  }

  currentMasonry(): Contract {
    if (!this.masonryVersionOfUser) {
      //throw new Error('you must unlock the wallet to continue.');
    }
    return this.contracts.Masonry;
  }

  currentMintContract(): Contract {
    return this.contracts.NFTContract;
  }

  isOldMasonryMember(): boolean {
    return this.masonryVersionOfUser !== 'latest';
  }

  async getTokenPriceFromPancakeswap(tokenContract: ERC20): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { chainId } = this.config;
    const { WFTM } = this.config.externalTokens;

    const wftm = new Token(chainId, WFTM[0], WFTM[1]);
    const token = new Token(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);


    try {
      const wftmToToken = await Fetcher.fetchPairData(wftm, token, this.provider);
      const priceInBUSD = new Route([wftmToToken], token);

      return priceInBUSD.midPrice.toFixed(4);
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  async getTokenPriceFromSpiritswap(tokenContract: ERC20): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { chainId } = this.config;

    const { WFTM } = this.externalTokens;

    const wftm = new TokenSpirit(chainId, WFTM.address, WFTM.decimal);
    const token = new TokenSpirit(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);
    try {
      const wftmToToken = await FetcherSpirit.fetchPairData(wftm, token, this.provider);
      const liquidityToken = wftmToToken.liquidityToken;
      let ftmBalanceInLP = await WFTM.balanceOf(liquidityToken.address);
      let ftmAmount = Number(getFullDisplayBalance(ftmBalanceInLP, WFTM.decimal));
      let shibaBalanceInLP = await tokenContract.balanceOf(liquidityToken.address);
      let shibaAmount = Number(getFullDisplayBalance(shibaBalanceInLP, tokenContract.decimal));
      const priceOfOneFtmInDollars = await this.getWFTMPriceFromPancakeswap();
      let priceOfShiba = (ftmAmount / shibaAmount) * Number(priceOfOneFtmInDollars);
      return priceOfShiba.toString();
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  async getWFTMPriceFromPancakeswap(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { WFTM, FUSDT } = this.externalTokens;
    try {
      const fusdt_wftm_lp_pair = this.externalTokens['USDT-FTM-LP'];
      let ftm_amount_BN = await WFTM.balanceOf(fusdt_wftm_lp_pair.address);
      let ftm_amount = Number(getFullDisplayBalance(ftm_amount_BN, WFTM.decimal));
      let fusdt_amount_BN = await FUSDT.balanceOf(fusdt_wftm_lp_pair.address);
      let fusdt_amount = Number(getFullDisplayBalance(fusdt_amount_BN, FUSDT.decimal));
      return (fusdt_amount / ftm_amount).toString();
    } catch (err) {
      console.error(`Failed to fetch token price of WFTM: ${err}`);
    }
  }

  //===================================================================
  //===================================================================
  //===================== MASONRY METHODS =============================
  //===================================================================
  //===================================================================

  async getMasonryAPR() {
    console.log("checking" );
    const Masonry = this.currentMasonry();
        console.log("checking" );
    const latestSnapshotIndex = await Masonry.latestSnapshotIndex();
    const lastHistory = await Masonry.masonryHistory(latestSnapshotIndex);

    const lastRewardsReceived = lastHistory[1];

    const TSHAREPrice = (await this.getShareStat()).priceInDollars;

    const TOMBPrice = (await this.getMagikStat()).priceInDollars;

    const epochRewardsPerShare = lastRewardsReceived / 1e18;


    //Mgod formula
    const amountOfRewardsPerDay = epochRewardsPerShare * Number(TOMBPrice) * 4;
    const masonrytShareBalanceOf = await this.MSHARE.balanceOf(Masonry.address);
    const masonryTVL = Number(getDisplayBalance(masonrytShareBalanceOf, this.MSHARE.decimal)) * Number(TSHAREPrice);
    const realAPR = ((amountOfRewardsPerDay * 100) / masonryTVL) * 365;
    return realAPR;
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Masonry
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserClaimRewardFromMasonry(): Promise<boolean> {
    const Masonry = this.currentMasonry();
    return await Masonry.canClaimReward(this.myAccount);
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Masonry
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserUnstakeFromMasonry(): Promise<boolean> {
    const Masonry = this.currentMasonry();
    const canWithdraw = await Masonry.canWithdraw(this.myAccount);
    const stakedAmount = await this.getStakedSharesOnMasonry();
    const notStaked = Number(getDisplayBalance(stakedAmount, this.MSHARE.decimal)) === 0;
    const result = notStaked ? true : canWithdraw;
    return result;
  }

  async timeUntilClaimRewardFromMasonry(): Promise<BigNumber> {
    // const Masonry = this.currentMasonry();
    // const mason = await Masonry.masons(this.myAccount);
    return BigNumber.from(0);
  }

  async getTotalStakedInMasonry(): Promise<BigNumber> {
    const Masonry = this.currentMasonry();
    return await Masonry.totalSupply();
  }

  async stakeShareToMasonry(amount: string): Promise<TransactionResponse> {
    if (this.isOldMasonryMember()) {
      throw new Error("you're using old masonry. please withdraw and deposit the MSHARE again.");
    }
    const Masonry = this.currentMasonry();
    return await Masonry.stake(decimalToBalance(amount));
  }

  async mintNFT(): Promise<TransactionResponse> {
    const nftcontract = this.currentMintContract();
    return await nftcontract.mint(1);
  }

  async getStakedSharesOnMasonry(): Promise<BigNumber> {
    const Masonry = this.currentMasonry();
    if (this.masonryVersionOfUser === 'v1') {
      return await Masonry.getShareOf(this.myAccount);
    }
    return await Masonry.balanceOf(this.myAccount);
  }

  async getEarningsOnMasonry(): Promise<BigNumber> {
    const Masonry = this.currentMasonry();
    if (this.masonryVersionOfUser === 'v1') {
      return await Masonry.getCashEarningsOf(this.myAccount);
    }
    return await Masonry.earned(this.myAccount);
  }

  async withdrawShareFromMasonry(amount: string): Promise<TransactionResponse> {
    const Masonry = this.currentMasonry();
    return await Masonry.withdraw(decimalToBalance(amount));
  }

  async harvestCashFromMasonry(): Promise<TransactionResponse> {
    const Masonry = this.currentMasonry();
    if (this.masonryVersionOfUser === 'v1') {
      return await Masonry.claimDividends();
    }
    return await Masonry.claimReward();
  }

  async exitFromMasonry(): Promise<TransactionResponse> {
    const Masonry = this.currentMasonry();
    return await Masonry.exit();
  }

  async getTreasuryNextAllocationTime(): Promise<AllocationTime> {
    const { Treasury } = this.contracts;
    const nextEpochTimestamp: BigNumber = await Treasury.nextEpochPoint();
    const nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
    const prevAllocation = new Date(Date.now());

    return { from: prevAllocation, to: nextAllocation };
  }
  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to claim
   * their reward from the masonry
   * @returns Promise<AllocationTime>
   */
  async getUserClaimRewardTime(): Promise<AllocationTime> {
    const { Masonry, Treasury } = this.contracts;
    const nextEpochTimestamp = await Masonry.nextEpochPoint(); //in unix timestamp
    const currentEpoch = await Masonry.epoch();
    const mason = await Masonry.masons(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const periodInHours = period / 60 / 60; // 6 hours, period is displayed in seconds which is 21600
    const rewardLockupEpochs = await Masonry.rewardLockupEpochs();
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(rewardLockupEpochs);

    const fromDate = new Date(Date.now());
    if (targetEpochForClaimUnlock - currentEpoch <= 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - currentEpoch - 1;
      const endDate = moment(toDate)
        .add(delta * periodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to unstake
   * from the masonry
   * @returns Promise<AllocationTime>
   */
  async getUserUnstakeTime(): Promise<AllocationTime> {
    const { Masonry, Treasury } = this.contracts;
    const nextEpochTimestamp = await Masonry.nextEpochPoint();
    const currentEpoch = await Masonry.epoch();
    const mason = await Masonry.masons(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const PeriodInHours = period / 60 / 60;
    const withdrawLockupEpochs = await Masonry.withdrawLockupEpochs();
    const fromDate = new Date(Date.now());
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(withdrawLockupEpochs);
    const stakedAmount = await this.getStakedSharesOnMasonry();
    if (currentEpoch <= targetEpochForClaimUnlock && Number(stakedAmount) === 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - Number(currentEpoch) - 1;
      const endDate = moment(toDate)
        .add(delta * PeriodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  async stakeToMagik(amount: string): Promise<TransactionResponse> {
    const Xmagik = this.contracts.xMAGIK;
    return await Xmagik.enter(decimalToBalance(amount));
  }
  async withdrawFromMagik(amount: string): Promise<TransactionResponse> {
    const Xmagik = this.contracts.xMAGIK;
    return await Xmagik.leave(decimalToBalance(amount));
  }
  async getStakedMagik(): Promise<BigNumber> {
    const Xmagik = this.contracts.xMAGIK;
    return await Xmagik.balanceOf(this.myAccount);
  }

  async getTotalStakedMagik(): Promise<BigNumber> {
    const Xmagik = this.contracts.xMAGIK;
    const magik = this.MAGIK;
    return await magik.balanceOf(Xmagik.address);
  }

  async watchAssetInMetamask(assetName: string): Promise<boolean> {
    const { ethereum } = window as any;
    if (ethereum && ethereum.networkVersion === config.chainId.toString()) {
      let asset;
      let assetUrl;
      if (assetName === 'MAGIK') {
        asset = this.MAGIK;
        assetUrl = 'https://magik.finance/presskit/tomb_icon_noBG.png';
      } else if (assetName === 'MSHARE') {
        asset = this.MSHARE;
        assetUrl = 'https://magik.finance/presskit/tshare_icon_noBG.png';
      } else if (assetName === 'MBOND') {
        asset = this.MBOND;
        assetUrl = 'https://magik.finance/presskit/tbond_icon_noBG.png';
      } else if (assetName === 'XMAGIK') {
        asset = this.XMAGIK;
        assetUrl = 'https://magik.finance/presskit/tshare_icon_noBG.png';
      }
      await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: asset.address,
            symbol: asset.symbol,
            decimals: 18,
            image: assetUrl,
          },
        },
      });
    }
    return true;
  }
  async getXmagikExchange(): Promise<BigNumber> {
    const Xmagik = this.contracts.xMAGIK;
    const XmagikExchange = await Xmagik.getExchangeRate();

    const xMagikPerMagik = parseFloat(XmagikExchange) / 1000000000000000000;
    const xMagikRate = xMagikPerMagik.toString();
    return parseUnits(xMagikRate, 18);
  }

  async provideTombFtmLP(ftmAmount: string, tombAmount: BigNumber): Promise<TransactionResponse> {
    const { TaxOffice } = this.contracts;
    let overrides = {
      value: parseUnits(ftmAmount, 18),
    };
    return await TaxOffice.addLiquidityETHTaxFree(tombAmount, tombAmount.mul(992).div(1000), parseUnits(ftmAmount, 18).mul(992).div(1000), overrides);
  }

  async quoteFromSpooky(tokenAmount: string, tokenName: string): Promise<string> {
    const { SpookyRouter } = this.contracts;
    const { _reserve0, _reserve1 } = await this.TOMBWFTM_LP.getReserves();
    let quote;
    if (tokenName === 'MAGIK') {
      quote = await SpookyRouter.quote(parseUnits(tokenAmount), _reserve1, _reserve0);
    } else {
      quote = await SpookyRouter.quote(parseUnits(tokenAmount), _reserve0, _reserve1);
    }
    return (quote / 1e18).toString();
  }

  /**
   * @returns an array of the regulation events till the most up to date epoch
   */
  async listenForRegulationsEvents(): Promise<any> {
    const { Treasury } = this.contracts;

    const treasuryDaoFundedFilter = Treasury.filters.DaoFundFunded();
    const treasuryDevFundedFilter = Treasury.filters.DevFundFunded();
    const treasuryMasonryFundedFilter = Treasury.filters.MasonryFunded();
    const boughtBondsFilter = Treasury.filters.BoughtBonds();
    const redeemBondsFilter = Treasury.filters.RedeemedBonds();

    let epochBlocksRanges: any[] = [];
    let masonryFundEvents = await Treasury.queryFilter(treasuryMasonryFundedFilter);
    var events: any[] = [];
    masonryFundEvents.forEach(function callback(value, index) {
      events.push({ epoch: index + 1 });
      events[index].masonryFund = getDisplayBalance(value.args[1]);
      if (index === 0) {
        epochBlocksRanges.push({
          index: index,
          startBlock: value.blockNumber,
          boughBonds: 0,
          redeemedBonds: 0,
        });
      }
      if (index > 0) {
        epochBlocksRanges.push({
          index: index,
          startBlock: value.blockNumber,
          boughBonds: 0,
          redeemedBonds: 0,
        });
        epochBlocksRanges[index - 1].endBlock = value.blockNumber;
      }
    });

    epochBlocksRanges.forEach(async (value, index) => {
      events[index].bondsBought = await this.getBondsWithFilterForPeriod(
        boughtBondsFilter,
        value.startBlock,
        value.endBlock,
      );
      events[index].bondsRedeemed = await this.getBondsWithFilterForPeriod(
        redeemBondsFilter,
        value.startBlock,
        value.endBlock,
      );
    });
    let DEVFundEvents = await Treasury.queryFilter(treasuryDevFundedFilter);
    DEVFundEvents.forEach(function callback(value, index) {
      events[index].devFund = getDisplayBalance(value.args[1]);
    });
    let DAOFundEvents = await Treasury.queryFilter(treasuryDaoFundedFilter);
    DAOFundEvents.forEach(function callback(value, index) {
      events[index].daoFund = getDisplayBalance(value.args[1]);
    });
    return events;
  }

  /**
   * Helper method
   * @param filter applied on the query to the treasury events
   * @param from block number
   * @param to block number
   * @returns the amount of bonds events emitted based on the filter provided during a specific period
   */
  async getBondsWithFilterForPeriod(filter: EventFilter, from: number, to: number): Promise<number> {
    const { Treasury } = this.contracts;
    const bondsAmount = await Treasury.queryFilter(filter, from, to);
    return bondsAmount.length;
  }

  async estimateZapIn(tokenName: string, lpName: string, amount: string): Promise<number[]> {
    const { zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    let estimate;
    if (tokenName === FTM_TICKER) {
      estimate = await zapper.estimateZapIn(lpToken.address, SPOOKY_ROUTER_ADDR, parseUnits(amount, 18));
    } else {
      const token = tokenName === TOMB_TICKER ? this.MAGIK : this.MSHARE;
      estimate = await zapper.estimateZapInToken(
        token.address,
        lpToken.address,
        SPOOKY_ROUTER_ADDR,
        parseUnits(amount, 18),
      );
    }
    return [estimate[0] / 1e18, estimate[1] / 1e18];
  }
  async zapIn(tokenName: string, lpName: string, amount: string): Promise<TransactionResponse> {
    const { zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    if (tokenName === FTM_TICKER) {
      let overrides = {
        value: parseUnits(amount, 18),
      };
      return await zapper.zapIn(lpToken.address, SPOOKY_ROUTER_ADDR, this.myAccount, overrides);
    } else {
      const token = tokenName === TOMB_TICKER ? this.MAGIK : this.MSHARE;
      return await zapper.zapInToken(
        token.address,
        parseUnits(amount, 18),
        lpToken.address,
        SPOOKY_ROUTER_ADDR,
        this.myAccount,
      );
    }
  }
  async swapTBondToTShare(tbondAmount: BigNumber): Promise<TransactionResponse> {
    const { TShareSwapper } = this.contracts;
    return await TShareSwapper.swapTBondToTShare(tbondAmount);
  }
  async estimateAmountOfTShare(tbondAmount: string): Promise<string> {
    const { TShareSwapper } = this.contracts;
    try {
      const estimateBN = await TShareSwapper.estimateAmountOfTShare(parseUnits(tbondAmount, 18));
      return getDisplayBalance(estimateBN, 18, 6);
    } catch (err) {
      console.error(`Failed to fetch estimate mshare amount: ${err}`);
    }
  }

  async getTShareSwapperStat(address: string): Promise<TShareSwapperStat> {
    const { TShareSwapper } = this.contracts;
    const tshareBalanceBN = await TShareSwapper.getTShareBalance();
    const tbondBalanceBN = await TShareSwapper.getTBondBalance(address);
    // const tombPriceBN = await TShareSwapper.getMagikPrice();
    // const tsharePriceBN = await TShareSwapper.getTSharePrice();
    const rateTSharePerTombBN = await TShareSwapper.getTShareAmountPerTomb();
    const tshareBalance = getDisplayBalance(tshareBalanceBN, 18, 5);
    const tbondBalance = getDisplayBalance(tbondBalanceBN, 18, 5);
    return {
      tshareBalance: tshareBalance.toString(),
      tbondBalance: tbondBalance.toString(),
      // tombPrice: tombPriceBN.toString(),
      // tsharePrice: tsharePriceBN.toString(),
      rateTSharePerTomb: rateTSharePerTombBN.toString(),
    };
  }
}
