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
import useStakedTotalMagikBalance from '../../hooks/useTotalStakedMagikBalance';
import { createGlobalStyle } from 'styled-components';
import { Helmet } from 'react-helmet'
import '../../views/Home/home.css'

import HomeImage from '../../assets/img/xMagikbg.png';
const BackgroundImage = createGlobalStyle`
  body, html {
    background: linear-gradient(45deg,rgb(30,0,30),rgb(10,0,10));
    background-size: cover !important;
  }
`;

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

const MIGHT = () => {
  const classes = useStyles();
  const { account } = useWallet();
  // const { onRedeem } = useRedeemOnBoardroom();
  //  const stakedMagikBalance = useStakedMagikBalance();
  const xmagikBalance = useXmagikBalance();
  const xmagikRate = Number(xmagikBalance / 1000000000000000000).toFixed(4);

  //const xmagikTVL = xmagikAPR.TVL;
  const stakedTotalMagikBalance = useStakedTotalMagikBalance();

  // console.log('xmagikAPR', xmagikYearlyAPR);

  // const cashStat = useCashPriceInEstimatedTWAP();

  return (
    <Page>
      <BackgroundImage />
      {!!account ? (
        <>
          <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
            MSHARE Migration: Convert your MSHARE to our new token MIGHT!
          </Typography>
          <Grid container justify="center">
            <Box mt={3} style={{ width: '600px' }}>
              <Alert id = "Font" variant="filled" severity="warning">
              <StyledLink target="_blank" href="https://magik.farm"> <b>MSHARE Migration </b> </StyledLink><br />
              <h3>Convert your MSHARE to our new token MIGHT!</h3>
              </Alert>

            </Box>
          </Grid>



          <Box mt={5}>
            <Grid container justify="center" spacing={3}>

              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography id = "Font" style={{ textTransform: 'uppercase', color: '#f9d749' }}>1 MSHARE =</Typography>
                    <Typography id = "Font"> 1 MIGHT</Typography>
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

export default MIGHT;
