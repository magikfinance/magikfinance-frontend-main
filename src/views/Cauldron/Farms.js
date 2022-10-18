import React from 'react';
import { useWallet } from 'use-wallet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Bank from '../Bank';
import { Box, Container, Typography, Grid } from '@material-ui/core';

import { Alert } from '@material-ui/lab';
import styled from 'styled-components';
import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';
import CauldronCard from './CauldronCard';
import CauldronImage from '../../assets/img/cauldron.png';
import { createGlobalStyle } from 'styled-components';

import useBanks from '../../hooks/useBanks';

const StyledLink = styled.a`
    font-weight: 700;
    text-decoration: none;
    color:purple
  `;
const BackgroundImage = createGlobalStyle`
  body {
    background: linear-gradient(45deg,rgb(30,0,30),rgb(10,0,10));
    background-size: cover !important;
  }
`;

const Farms = () => {
  const [banks] = useBanks();
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const activeBanks = banks.filter((bank) => !bank.finished);
  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          <BackgroundImage />
          {!!account ? (
            <Container maxWidth="lg">
              <Typography align="center" gutterBottom>
                <h1 style={{color:"rgb(255,232,132)"}}>Farms</h1>
              </Typography>

              <Box mt={5}>
              <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 3).length === 0} mt={2} mb={4}>
                  <Typography color="textPrimary" variant="h4" gutterBottom>
                    Earn MShare by staking LPs!
                  </Typography> 
                  <Typography color="textPrimary" variant="h6" gutterBottom>
                    Add liquidity on MagikSwap <a style={{color:"rgb(255,232,132)",textDecoration:"none"}} href="https://magikswap.dog/add">here</a>!
                  </Typography>
                  <Grid container spacing={3} style={{marginBottom:'2%'}}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 3)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CauldronCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>

                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 2).length === 0}>
                  <Typography color="textPrimary" variant="h4" gutterBottom>
                    Deprecated LP Pools - please withdraw!  
                  </Typography>
                 
                  <Grid container spacing={3}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 2)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CauldronCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>

                

                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 1).length === 0}>
                  <Typography color="textPrimary" variant="h4" gutterBottom style={{ marginTop: '20px' }}>
                    Earn MAGIK by staking LP
                  </Typography>
                  <Alert variant="filled" severity="warning">
                    All below pools have ended. Please unstake and collect your rewards.
                  </Alert>
                  <Grid container spacing={3} style={{ marginTop: '20px' }}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 1)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CauldronCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>

                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 0).length === 0}>
                  <Typography color="textPrimary" variant="h4" gutterBottom style={{ marginTop: '20px' }}>
                    Genesis Pools
                  </Typography>
                  <Grid container spacing={3}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 0)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CauldronCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>
              </Box>
            </Container>
          ) : (
            <UnlockWallet />
          )}
        </Route>
        <Route path={`${path}/:bankId`}>
          <BackgroundImage />
          <Bank />
        </Route>
      </Page>
    </Switch>
  );
};

export default Farms;
