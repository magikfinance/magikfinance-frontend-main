import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import moment from 'moment';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import InfoIcon from '@material-ui/icons/Info';
import { Box, Card, CardContent, Button, Typography, Tooltip, Grid } from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';

import useRedeemOnMasonry from '../../hooks/useRedeemOnMasonry';
import useStakedBalanceOnMasonry from '../../hooks/useStakedBalanceOnMasonry';
import { getDisplayBalance } from '../../utils/formatBalance';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useFetchMasonryAPR from '../../hooks/useFetchMasonryAPR';

import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useTotalStakedOnMasonry from '../../hooks/useTotalStakedOnMasonry';
import useClaimRewardCheck from '../../hooks/dungeon/useClaimRewardCheck';
import useWithdrawCheck from '../../hooks/dungeon/useWithdrawCheck';
import ProgressCountdown from './components/ProgressCountdown';
import MasonryImage from '../../assets/img/dungeon.png';
import { createGlobalStyle } from 'styled-components';

const BackgroundImage = createGlobalStyle`
  body, html {
    background: url(${MasonryImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const StyledLink = styled.a`
font-weight: 700;
text-decoration: none;
`;

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));

const TWAPTooltip = withStyles((theme) => ({
  arrow: {
    color: '#2c2560',
  },
  tooltip: {
    backgroundColor: '#2c2560',
    color: 'white',
    maxWidth: 250,
    padding: '12px',
    fontSize: theme.typography.pxToRem(14),
  },
}))(Tooltip);

const Dungeon = () => {
  const classes = useStyles();
  const { account } = useWallet();
  const { onRedeem } = useRedeemOnMasonry();
  const stakedBalance = useStakedBalanceOnMasonry();
  const currentEpoch = useCurrentEpoch();
  const cashStat = useCashPriceInEstimatedTWAP();
  const totalStaked = useTotalStakedOnMasonry();
  const dungeonAPR = useFetchMasonryAPR();
  const canClaimReward = useClaimRewardCheck();
  const canWithdraw = useWithdrawCheck();
  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
  const { to } = useTreasuryAllocationTimes();

  return (
    <Page>
      <BackgroundImage />
      {!!account ? (
        <>
          <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
            Dungeon
          </Typography>
          <Box mt={5}>
            <Grid container justify="center" spacing={3}>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent>
                    <Typography style={{ textAlign: 'center' }}>Next Epoch</Typography>
                    <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={3} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>APR | Daily | Epoch</Typography>
                    <Typography>{dungeonAPR.toFixed(2)}% | {(dungeonAPR / 365).toFixed(2)}% | {(dungeonAPR / 365 / 4).toFixed(2)}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center" style={{ position: 'relative' }}>
                    <Typography>
                      <small>(TWAP)</small>
                    </Typography>
                    <TWAPTooltip
                      arrow={true}
                      enterTouchDelay={0}
                      title={
                        <React.Fragment>
                          When TWAP is above 1.01 rewards will be sent out to stakers by the end of the current epoch. Otherwise, no rewards are distributed
                        </React.Fragment>
                      }>
                      <InfoIcon
                        fontSize='inherit'
                        style={{ position: 'absolute', top: '10px', right: '10px' }}
                      />
                    </TWAPTooltip>
                    <Typography
                      className={scalingFactor > 1.01 ? 'twap-above' : 'twap-below'}
                    >
                      {scalingFactor}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>MSHARES Staked</Typography>
                    <Typography>{getDisplayBalance(totalStaked)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container justify="center">
              <Box mt={3} style={{ width: '600px' }}>
                <Alert variant="filled" severity="warning">
                  Staked MSHAREs can only be withdrawn after 6 epochs (36 hours) since deposit. Any time tokens are harvested, deposited, or withdrawn, the lockup timer gets reset.<br />
                  <b>Please visit our <StyledLink target="_blank" href="https://magikdotfinance.gitbook.io/docs/platform/magik-platforms#dungeon-boardroom">documentation</StyledLink> before staking!</b>
                </Alert>
              </Box>
            </Grid>

            <Box mt={4}>
              <StyledBoardroom>
                <StyledCardsWrapper>
                  <StyledCardWrapper>
                    <Harvest />
                  </StyledCardWrapper>
                  <Spacer />
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

          <Box mt={5}>
            <Grid container justify="center" spacing={3} mt={10}>
              <Button
                disabled={stakedBalance.eq(0) || (!canWithdraw && !canClaimReward)}
                onClick={onRedeem}
                color="primary"
                variant="contained"
              >
                Claim and Withdraw
              </Button>
            </Grid>
          </Box>
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

export default Dungeon;
