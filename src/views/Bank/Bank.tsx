import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useParams } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import { makeStyles } from '@material-ui/core/styles';

import { Box, Button, Card, CardContent, Typography, Grid } from '@material-ui/core';
import './bank.css'
import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import UnlockWallet from '../../components/UnlockWallet';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import useBank from '../../hooks/useBank';
import useStatsForPool from '../../hooks/useStatsForPool';
import useRedeem from '../../hooks/useRedeem';
import { Bank as BankEntity } from '../../magik-finance';
import useMagikFinance from '../../hooks/useMagikFinance';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));

const Bank: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0));
  const classes = useStyles();
  const { bankId } = useParams();
  console.log("bankID ", bankId);
  const bank = useBank(bankId);

  const { account } = useWallet();
  const { onRedeem } = useRedeem(bank);
  const statsOnPool = useStatsForPool(bank);
  return account && bank ? (
    <>
      <PageHeader
        icon="🏦"
        subtitle={`Deposit ${bank?.depositTokenName} and earn ${bank?.earnTokenName}`}
        title={bank?.name}
      />
      <Box>
        <Grid container justify="center" spacing={3} style={{ marginBottom: '50px'}}>
          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card className={classes.gridItem}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography  id="Grid">APR</Typography>
                <Typography  id="Grid">{bank.closedForStaking ? '0.00' : statsOnPool?.yearlyAPR}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card className={classes.gridItem}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography  id="Grid">Daily APR</Typography>
                <Typography  id="Grid">{bank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card className={classes.gridItem}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography  id="Grid">TVL</Typography>
                <Typography  id="Grid">${statsOnPool?.TVL}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Box mt={5}>
        <StyledBank>
          <StyledCardsWrapper>
            <StyledCardWrapper>
              <Harvest bank={bank} />
            </StyledCardWrapper>
            <Spacer />
            <StyledCardWrapper>{<Stake bank={bank} />}</StyledCardWrapper>
          </StyledCardsWrapper>
          <Spacer size="lg" />
          {bank.depositTokenName.includes('LP') && <LPTokenHelpText bank={bank} />}
          <Spacer size="lg" />
          <div>
            <Button onClick={onRedeem} id="Button">
              Claim & Withdraw
            </Button>
          </div>
          <Spacer size="lg" />
        </StyledBank>
      </Box>
    </>
  ) : !bank ? (
    <BankNotFound />
  ) : (
    <UnlockWallet />
  );
};

const LPTokenHelpText: React.FC<{ bank: BankEntity }> = ({ bank }) => {
  const tombFinance = useMagikFinance();
  const tombAddr = tombFinance.MAGIK.address;
  const tshareAddr = tombFinance.MSHARE.address;

  let pairName: string;
  let uniswapUrl: string;
  if (bank.depositTokenName.includes('MAGIK')) {
    pairName = 'MAGIK-FTM pair';
    uniswapUrl = 'https://swap.spiritswap.finance/#/add/FTM/0x87a5C9B60A3aaf1064006FE64285018e50e0d020' ;
  }
   else {
    pairName = 'MSHARE-FTM pair';
    uniswapUrl = 'https://swap.spiritswap.finance/#/add/FTM/0xC8Ca9026Ad0882133Ef126824F6852567c571A4E' ;
  }
  if (bank.depositTokenName.includes('MAGIK-MSHARE')) {
    pairName = 'MAGIK-MSHARE pair';
    uniswapUrl = 'https://swap.spiritswap.finance/#/add/FTM/0x87a5C9B60A3aaf1064006FE64285018e50e0d020' ;
  }
  if (bank.depositTokenName.includes('MS-MAGIK-FTM')) {
    pairName = 'MS-MAGIK-FTM pair';
    uniswapUrl = 'https://magikswap.dog/liquidity/' ;
  }
  if (bank.depositTokenName.includes('MS-MSHARE-FTM')) {
    pairName = 'MSHARE-FTM-LP-MS pair';
    uniswapUrl = 'https://magikswap.dog/liquidity/' ;
  }
  if (bank.depositTokenName.includes('MS-MAGIK-MSHARE-LP')) {
    pairName = 'MS-MAGIK-MSHARE-LP pair';
    uniswapUrl = 'https://magikswap.dog/liquidity/' ;
  }
  if (bank.depositTokenName.includes('MAGIK-MIM-MS')) {
    pairName = 'MAGIK-MIM-MS pair';
    uniswapUrl = 'https://magikswap.dog/liquidity/' ;
  }
  return (
    <Card>
      <CardContent>
        <StyledLink href={uniswapUrl} color="primary"target="_blank">
          {` Provide liquidity for ${pairName} now `}
        </StyledLink>
      </CardContent>
    </Card>
  );
};

const BankNotFound = () => {
  return (
    <Center>
      <PageHeader icon="🏚" title="Not Found" subtitle="You've hit a bank just robbed by unicorns." />
    </Center>
  );
};

const StyledBank = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  color: ${(props) => props.theme.color.primary.contrastText};
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

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default Bank;
