import React, {useCallback, useMemo, useEffect} from 'react';
import Page from '../../components/Page';
import {createGlobalStyle} from 'styled-components';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {useWallet} from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import PageHeader from '../../components/PageHeader';
import ExchangeCard from './components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
import useMagikStats from '../../hooks/useMagikStats';
import useRaffleStats from '../../hooks/useRaffleBalance';
import useMagikFinance from '../../hooks/useMagikFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import {useTransactionAdder} from '../../state/transactions/hooks';
import ExchangeStat from './components/ExchangeStat';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import {getDisplayBalance} from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN, DECIMALS_18 } from '../../magik-finance/constants';
import { Alert } from '@material-ui/lab';
import {ReactComponent as IconTelegram} from '../../assets/img/telegram.svg';
import {ReactComponent as IconDiscord} from '../../assets/img/discord.svg';
import HomeImage from '../../assets/img/wilderness.png';
import { Box, Container, Card, CardContent, Typography, Grid } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import { Stats } from 'fs';
import LaunchCountdown from '../../components/LaunchCountdown';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;


const useStyles = makeStyles((theme) => ({
  footer: {
    position: 'absolute',
    bottom: '0',
    paddingTop: '15px',
    paddingBottom: '15px',
    width: '100%',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0)',
    textAlign: 'center',
    height: '1.3rem',
    fontFamily: 'superstar',
      [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  link: {
    width: '24px',
    height: '24px',
    display: 'inline',
    marginLeft: '20px',
  },

  img: {
    width: '24px',
    height: '24px',
  },
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    }},
}));

const Raffle: React.FC = () => {

  const startDate = new Date('2022-4-15 19:00:00Z');
  const endDate = new Date('2022-4-17 19:00:00Z');
  const raffleAddress = '0xF3C5c8Aa299A70596303897017062A1a37ecC545';



  const {path} = useRouteMatch();
  const {account} = useWallet();
  const classes = useStyles();
  const magikFinance = useMagikFinance();
  const addTransaction = useTransactionAdder();
  const raffleStats = useRaffleStats(account, raffleAddress);



  const startTime = Number(startDate); 
  const endTime = Number(endDate); 

  const magikPrice = useMemo(
    () => (raffleStats ? Number(raffleStats.tokenInFtm).toFixed(2) : null),
    [raffleStats],
  );
  
  const raffleBals = useMemo(
    () => (raffleStats ? Number(raffleStats.totalSupply).toFixed(0) : null),
    [raffleStats],
  );

  const userBals = useMemo(
    () => (raffleStats ? Number(raffleStats.priceInDollars).toFixed(0) : null),
    [raffleStats],
  );

  const handleBuyBonds = useCallback( 
    async (amount: string) => { 
      const tx = await magikFinance.sendMagik(amount, raffleAddress);
        addTransaction(tx, {
          summary: `Send ${Number(amount).toFixed(2)} MAGIK to the raffle ${amount} `,
        });
    
    },
    [magikFinance, addTransaction],
  );

  return (   
<Switch>
<Page>
  <BackgroundImage />
  {!!account ? (
    <>
    
     <Grid item xs={12} md={12} lg={12} >     
        <h2 style={{ fontSize: '40px', textAlign:'center', color: '#fff' }}> MAGIK FINANCE ROLLING RAFFLE</h2>   
        <p style={{ fontSize: '20px', textAlign:'center', color: '#fff' }}>Enter with Magik tokens. Win the NFT jackpot. Deflate the supply.</p>                
        <p style={{fontSize: '20px', textAlign:'center', color: '#fff' }}>Raffle address: {raffleAddress}</p>
      </Grid>
      {Date.now() > endTime ? <h2 style={{ fontSize: '60px', textAlign:'center' }}>Raffle Closed</h2> : <h2 style={{ fontSize: '60px', textAlign:'center', color: '#fff'}}>Raffle Closed</h2>}
      {Date.now() < startTime ? <LaunchCountdown deadline={startDate} description={''} descriptionLink={''}></LaunchCountdown> : <LaunchCountdown deadline={endDate} description={'Raffle Closes In'} descriptionLink={''}></LaunchCountdown>}
       
    <Grid container justify="center" spacing={4} style={{marginTop: '10px'}}>
        <Grid item xs={12} sm={12} lg={6}>  
            <Card>
              <h2 style={{textAlign:'center', marginTop: '10px' }}>Raffle Stats</h2>
              <p style={{textAlign:'center'}}>Win 1 Fantomised Patronus this raffle</p>           
              <p style={{textAlign:'center'}}>Magik Price: ${magikPrice}</p>
              <p style={{textAlign:'center'}}>Total Magik Entered: {raffleBals}</p>         
              <p style={{textAlign:'center'}}>Your entries: {userBals}</p>
              <p style={{textAlign:'center'}}>Your account: {account}</p>
            </Card>
          </Grid>
        <Grid item xs={12} sm={12} lg={6}>  
        <StyledBond>
          <StyledCardWrapper>
            <ExchangeCard
              action="Enter Raffle"
              fromToken={magikFinance.MAGIK}
              fromTokenName="MAGIK"
              toToken={magikFinance.MBOND}
              toTokenName="MBOND"
              priceDesc={
                Date.now() < endTime && Date.now() > startTime
                  ? 'Raffle is open! 1 MAGIK = 1 Entry'
                  : 'Raffle is currently closed'
              }
              disabled={Date.now() < endTime && Date.now() > startTime ? false : true}
              onExchange={handleBuyBonds}
            />
          </StyledCardWrapper>
        </StyledBond>
        </Grid>
      </Grid>

    </>
  ) : (
    <UnlockWallet />
  )}
</Page>
</Switch>
  );
};

const StyledBond = styled.div`
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const StyledStatsWrapper = styled.div`
  display: flex;
  flex: 0.8;
  margin: 0 20px;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 80%;
    margin: 16px 0;
  }
`;

export default Raffle;
