import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import Stake from './components/Stake';
import { makeStyles } from '@material-ui/core/styles';


import { Box, Card, CardContent, Typography, Grid } from '@material-ui/core';
import { roundAndFormatNumber } from '../../0x';

import { Alert } from '@material-ui/lab';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';

import useXmagikBalance from '../../hooks/useXmagikBalance';
import useXmagikAPR from '../../hooks/useXmagikAPR';
import useStakedTotalMagikBalance from '../../hooks/useTotalStakedMagikBalance';
import { createGlobalStyle } from 'styled-components';
import { Helmet } from 'react-helmet'

import HomeImage from '../../assets/img/xMagikbg.png';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'magik.money | xMAGIK - MAGIK Staking'

const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  color: ${(props) => props.theme.color.purple.main};
`; 

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));

const Staking = () => {
  const classes = useStyles();
  const { account } = useWallet();
  // const { onRedeem } = useRedeemOnBoardroom();
  //  const stakedMagikBalance = useStakedMagikBalance();
  const xmagikBalance = useXmagikBalance();
  const xmagikRate = Number(xmagikBalance / 1000000000000000000).toFixed(4);
  const xmagikAPR = useXmagikAPR();

  //const xmagikTVL = xmagikAPR.TVL;
  const stakedTotalMagikBalance = useStakedTotalMagikBalance();
  const magikTotalStaked = Number(stakedTotalMagikBalance / 1000000000000000000).toFixed(0);
  const xmagikTVL = useMemo(() => (xmagikAPR ? Number(xmagikAPR.TVL).toFixed(0) : null), [xmagikAPR]);
  const xmagikDailyAPR = useMemo(() => (xmagikAPR ? Number(xmagikAPR.dailyAPR).toFixed(2) : null), [xmagikAPR]);
  const xmagikYearlyAPR = useMemo(() => (xmagikAPR ? Number(xmagikAPR.yearlyAPR).toFixed(2) : null), [xmagikAPR]);

  // console.log('xmagikAPR', xmagikYearlyAPR);

  // const cashStat = useCashPriceInEstimatedTWAP();

  return (
    <Page>
      <BackgroundImage />
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      {!!account ? (
        <>
          <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
            MAGIK Staking for xMAGIK
          </Typography>
          <Grid container justify="center">
            <Box mt={3} style={{ width: '600px' }}>
              <Alert variant="filled" severity="warning">
              <StyledLink target="_blank" href="https://magikdotfinance.gitbook.io/docs/xmagik-staking"> <b> PLEASE READ OUR DOCUMENTATION BEFORE STAKING (CLICK ME) </b> </StyledLink><br />
                XMAGIK Rewards have now ended. Please withdraw your MAGIK tokens.<br />
              </Alert>

            </Box>
          </Grid>



          <Box mt={5}>
            <Grid container justify="center" spacing={3}>

              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>1 xMAGIK =</Typography>
                    <Typography>{Number(xmagikRate)} MAGIK</Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>
                      MAGIK PEG <small>(TWAP)</small>
                    </Typography>
                    <Typography>{scalingFactor} BTC</Typography>
                    <Typography>
                      <small>per 10,000 MAGIK</small>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid> */}
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>APR</Typography>
                    <Typography>{xmagikYearlyAPR}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>Daily APR</Typography>
                    <Typography>{xmagikDailyAPR}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>MAGIK Staked</Typography>
                    <Typography>{roundAndFormatNumber(magikTotalStaked)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>MAGIK Staked USD</Typography>
                    <Typography>${roundAndFormatNumber(xmagikTVL, 2)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>


            <Box mt={4}>
              <StyledBoardroom>
                <StyledCardsWrapper>
                  {/* <StyledCardWrapper>
                    <Harvest />
                  </StyledCardWrapper> */}
                  {/* <Spacer /> */}

                  <StyledCardWrapper>

                    <Stake />
                  </StyledCardWrapper>
                </StyledCardsWrapper>
              </StyledBoardroom>
            </Box>
            
            {/* <Grid container justify="center" spacing={3}>
            <Grid item xs={4}>
              <Card>
                <CardContent align="center">
                  <Typography>Rewards</Typography>

                </CardContent>
                <CardActions style={{justifyContent: 'center'}}>
                  <Button color="primary" variant="outlined">Claim Reward</Button>
                </CardActions>
                <CardContent align="center">
                  <Typography>Claim Countdown</Typography>
                  <Typography>00:00:00</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContent align="center">
                  <Typography>Stakings</Typography>
                  <Typography>{getDisplayBalance(stakedBalance)}</Typography>
                </CardContent>
                <CardActions style={{justifyContent: 'center'}}>
                  <Button>+</Button>
                  <Button>-</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid> */}
          </Box>
          {/* 
          <Box mt={5}>
            <Grid container justify="center" spacing={3} mt={10}>
              <Button
                disabled={stakedMagikBalance.eq(0) || (!canWithdraw && !canClaimReward)}
                onClick={onRedeem}
                className={
                  stakedMagikBalance.eq(0) || (!canWithdraw && !canClaimReward)
                    ? 'shinyButtonDisabledSecondary'
                    : 'shinyButtonSecondary'
                }
              >
                Claim &amp; Withdraw
              </Button>
            </Grid>
          </Box> */}
        </>
      ) : (
        <UnlockWallet />
      )}
    </Page>
  );
};

const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
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

export default Staking;
