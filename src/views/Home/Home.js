import React, { useMemo } from 'react';
import Page from '../../components/Page';
import CashImage from '../../assets/img/crypto_tomb_cash.png';
import Image from 'material-ui-image';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useMagikStats from '../../hooks/useMagikStats';
import useLpStats from '../../hooks/useLpStats';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usemShareStats from '../../hooks/usemShareStats';
import useMightStats from '../../hooks/useMightStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import { magik as magikTesting, mShare as mShareTesting } from '../../magik-finance/deployments/deployments.testing.json';
import { magik as magikProd, mShare as mShareProd } from '../../magik-finance/deployments/deployments.mainnet.json';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import './home.css';
import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';

import { makeStyles } from '@material-ui/core/styles';
import useMagikFinance from '../../hooks/useMagikFinance';

const BackgroundImage = createGlobalStyle`
  body {
    background: linear-gradient(45deg,rgb(30,0,30),rgb(10,0,10));
    background-size: cover !important;
  }
`;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      marginTop: '10px',
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const tombFtmLpStats = useLpStats('MAGIK-FTM-LP');
  const tShareFtmLpStats = useLpStats('MSHARE-FTM-LP');
  const tombStats = useMagikStats();
  const tShareStats = usemShareStats();
  const mightStats = useMightStats();
  const tBondStats = useBondStats();
  const tombFinance = useMagikFinance();

  let magik;
  let mShare;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    magik = magikTesting;
    mShare = mShareTesting;
  } else {
    magik = magikProd;
    mShare = mShareProd;
  }

  const buyTombAddress = 'https://magikswap.dog/swap'
  const buyTShareAddress = 'https://magikswap.dog/swap';
  const MagikChart = 'https://www.dextools.io/app/en/fantom/pair-explorer/0x2e28aed21143cdac666633bf2c31db3f50e21edd';
  const MshareChart = 'https://www.dextools.io/app/en/fantom/pair-explorer/0xb1a53d68d55efb93a30d135a450c0a3cee864c25';

  const tombLPStats = useMemo(() => (tombFtmLpStats ? tombFtmLpStats : null), [tombFtmLpStats]);
  const tshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
  const tombPriceInDollars = useMemo(
    () => (tombStats ? Number(tombStats.priceInDollars).toFixed(2) : null),
    [tombStats],
  );
  const tombPriceInFTM = useMemo(() => (tombStats ? Number(tombStats.tokenInFtm).toFixed(4) : null), [tombStats]);
  const tombCirculatingSupply = useMemo(() => (tombStats ? String(tombStats.circulatingSupply) : null), [tombStats]);
  const tombTotalSupply = useMemo(() => (tombStats ? String(tombStats.totalSupply) : null), [tombStats]);

  const tSharePriceInDollars = useMemo(
    () => (tShareStats ? Number(tShareStats.priceInDollars).toFixed(2) : null),
    [tShareStats],
  );
  const mightPriceInDollars = useMemo(
    () => (mightStats ? Number(mightStats.priceInDollars).toFixed(2) : null),
    [mightStats],
  );
  const tSharePriceInFTM = useMemo(
    () => (tShareStats ? Number(tShareStats.tokenInFtm).toFixed(4) : null),
    [tShareStats],
  );
  const tShareCirculatingSupply = useMemo(
    () => (tShareStats ? String(tShareStats.circulatingSupply) : null),
    [tShareStats],
  );

  const MightCirculatingSupply = useMemo(
    () => (mightStats ? String(mightStats.circulatingSupply) : null),
    [mightStats],
  );
  
  const tShareTotalSupply = useMemo(() => (tShareStats ? String(tShareStats.totalSupply) : null), [tShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInFTM = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const tombLpZap = useZap({ depositTokenName: 'MAGIK-FTM-LP' });
  const tshareLpZap = useZap({ depositTokenName: 'MSHARE-FTM-LP' });

  const StyledLink = styled.a`
    font-weight: 700;
    text-decoration: none;
    color:red
  `;

  const [onPresentTombZap, onDissmissTombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        tombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissTombZap();
      }}
      tokenName={'MAGIK-FTM-LP'}
    />,
  );

  const [onPresentTshareZap, onDissmissTshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        tshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissTshareZap();
      }}
      tokenName={'MSHARE-FTM-LP'}
    />,
  );

  return (
    <Page>
      <BackgroundImage />
      <Grid container alignItems="center" spacing={3}>
        {/* Logo */}
        <Grid container item xs={12} sm={4} justify="center">
          {/* <Paper>xs=6 sm=3</Paper> */}
          <Image color="none" style={{ width: '300px', height:'400px', paddingTop: '0px' }} src={CashImage} />
        </Grid>
        {/*hero Card*/}
        <Grid id="Grid" item xs={12} sm={8}>
          <Paper>
            <Box p={4}>
              <h2>Welcome to Magik Finance</h2>
              <p>MAGIK is real. A hyper-deflationary gaming and utility token - soon to be pegged to an internal growth driven TWAP reward/burn mechanic.</p>
              <p>MAGIK is Community Based: Please visit <a style={{color:"rgb(255,232,132)",textDecoration:"none"}} href="https://magikdotfinance.gitbook.io/docs/renounced-ownership"> here</a> to view our Renounced Ownership transactions.</p>
              <p>Check the <a style={{color:"rgb(255,232,132)",textDecoration:"none"}} href="https://discord.com/invite/sm3szPSkzE">MAGIK Discord </a> to keep up with v2 announcements.</p>
            </Box>
          </Paper>
        </Grid>
        {/* TVL */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" >
              <h2>Total Value Locked</h2>
              <CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" />
            </CardContent>
          </Card>
          <Card> 
            <CardContent align="center" >
            <h2>Total $MAGIK Burned 🔥</h2> 
          <span style={{ fontSize: '25px' }}>
            {(1000000 - tombCirculatingSupply).toFixed(2)}  <br />
            </span>
            </CardContent>
          </Card>
        </Grid>
        {/* Wallet */}
        <Grid item xs={12} sm={8}>
          <Card style={{ height: '100%' }}>
            <CardContent align="center" style={{ marginTop: '2.5%', display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
              {/* <h2 style={{ marginBottom: '20px' }}>Wallet Balance</h2> */}
              <Button id="Button" href="/dungeon" style={{ marginRight: '5px' }}>
                Stake Now
              </Button>
              <Button id="Button" href="/farms" style={{ marginRight: '5px' }}>
                Farm Now
              </Button>
              <Button
                id="Button"
                target="_blank"
                href={buyTombAddress}
                style={{ marginRight: '5px' }}
                className={classes.button}
              >
                Buy MAGIK
              </Button>
              <Button id="Button" style={{ marginRight: '5px' }} target="_blank" href={buyTShareAddress} className={classes.button}>
                Buy MSHARE
              </Button>
              <Button id="Button" href={MagikChart} target="_blank" rel="noreferrer noopener" style={{ marginRight: '5px' }}>
                Magik Chart
              </Button>
              <Button id="Button" href={MshareChart} target="_blank" rel="noreferrer noopener" style={{ marginRight: '5px' }}>
                Mshare Chart
              </Button>
            </CardContent>
          </Card>
        </Grid>
        {/* MAGIK */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>MAGIK</h2>
              <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('MAGIK');
                }}
                color="grey"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="MAGIK"/>
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{tombPriceInDollars ? tombPriceInDollars : '-.----'} USD</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(tombCirculatingSupply * tombPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {tombCirculatingSupply} <br />
                Total Supply: {tombTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>
        {/* MSHARE */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>MSHARE</h2>
              <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('MSHARE');
                }}
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="MSHARE" />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{tSharePriceInDollars ? tSharePriceInDollars : '-.----'} USD</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(tShareCirculatingSupply * tSharePriceInDollars).toFixed(2)} <br />
                Circulating Supply: {tShareCirculatingSupply} <br />
                Total Supply: {tShareTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>MIGHT</h2>
              <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('MIGHT');
                }}
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="MIGHT" />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{mightPriceInDollars ? mightPriceInDollars : '-.----'} USD</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(MightCirculatingSupply * mightPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {MightCirculatingSupply} <br />
                Total Supply: {MightCirculatingSupply} <br />
                Max Supply: 70,000
              </span>
            </CardContent>
          </Card>
        </Grid>
        {/* MBOND */}
      </Grid>
    </Page>
  );
};

export default Home;
