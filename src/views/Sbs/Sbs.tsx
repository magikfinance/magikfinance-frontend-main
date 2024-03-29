import React, { /*useCallback, useEffect, */useMemo, useState } from 'react';
import Page from '../../components/Page';
import WildernessImage from '../../assets/img/wilderness.png';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import PageHeader from '../../components/PageHeader';
import { Box,/* Paper, Typography,*/ Button, Grid, Card } from '@material-ui/core';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useMagikFinance from '../../hooks/useMagikFinance';
import { getDisplayBalance/*, getBalance*/ } from '../../utils/formatBalance';
import { BigNumber/*, ethers*/ } from 'ethers';
import useSwapMBondToMShare from '../../hooks/TShareSwapper/useSwapMBondToMShare';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import useMShareSwapperStats from '../../hooks/TShareSwapper/useMShareSwapperStats';
import TokenInput from '../../components/TokenInput';
import CardContent from '../../components/CardContent';
import TokenSymbol from '../../components/TokenSymbol';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${WildernessImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const Sbs: React.FC = () => {
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const tombFinance = useMagikFinance();
  const [tbondAmount, setTbondAmount] = useState('');
  const [tshareAmount, setTshareAmount] = useState('');

  const [approveStatus, approve] = useApprove(tombFinance.MBOND, tombFinance.contracts.TShareSwapper.address);
  const { onSwapTShare } = useSwapMBondToMShare();
  const tshareSwapperStat = useMShareSwapperStats(account);

  const tshareBalance = useMemo(() => (tshareSwapperStat ? Number(tshareSwapperStat.tshareBalance) : 0), [tshareSwapperStat]);
  const bondBalance = useMemo(() => (tshareSwapperStat ? Number(tshareSwapperStat.tbondBalance) : 0), [tshareSwapperStat]);

  const handleTBondChange = async (e: any) => {
    if (e.currentTarget.value === '') {
      setTbondAmount('');
      setTshareAmount('');
      return
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setTbondAmount(e.currentTarget.value);
    const updateTShareAmount = await tombFinance.estimateAmountOfTShare(e.currentTarget.value);
    setTshareAmount(updateTShareAmount);  
  };

  const handleTBondSelectMax = async () => {
    setTbondAmount(String(bondBalance));
    const updateTShareAmount = await tombFinance.estimateAmountOfTShare(String(bondBalance));
    setTshareAmount(updateTShareAmount); 
  };

  const handleTShareSelectMax = async () => {
    setTshareAmount(String(tshareBalance));
    const rateTSharePerTomb = (await tombFinance.getTShareSwapperStat(account)).rateTSharePerTomb;
    const updateTBondAmount = ((BigNumber.from(10).pow(30)).div(BigNumber.from(rateTSharePerTomb))).mul(Number(tshareBalance) * 1e6);
    setTbondAmount(getDisplayBalance(updateTBondAmount, 18, 6));
  };

  const handleTShareChange = async (e: any) => {
    const inputData = e.currentTarget.value;
    if (inputData === '') {
      setTshareAmount('');
      setTbondAmount('');
      return
    }
    if (!isNumeric(inputData)) return;
    setTshareAmount(inputData);
    const rateTSharePerTomb = (await tombFinance.getTShareSwapperStat(account)).rateTSharePerTomb;
    const updateTBondAmount = ((BigNumber.from(10).pow(30)).div(BigNumber.from(rateTSharePerTomb))).mul(Number(inputData) * 1e6);
    setTbondAmount(getDisplayBalance(updateTBondAmount, 18, 6));
  }

  return (
    <Switch>
      <Page>
        <BackgroundImage />
        {!!account ? (
          <>
            <Route exact path={path}>
              <PageHeader icon={'🏦'} title="MBond -> MShare Swap" subtitle="Swap MBond to MShare" />
            </Route>

            <Box mt={6}>
              <Grid container justify="center" spacing={6}>
                <StyledBoardroom>
                  <StyledCardsWrapper>
                    <StyledCardWrapper>
                      <Card variant="outlined" style={{ border: '1px solid var(--white)' }}>
                        <CardContent>
                          <StyledCardContentInner>
                            <StyledCardTitle>MBonds</StyledCardTitle>
                            <StyledExchanger>
                              <StyledToken>
                                <StyledCardIcon>
                                  <TokenSymbol symbol={tombFinance.MBOND.symbol} size={54} />
                                </StyledCardIcon>
                              </StyledToken>
                            </StyledExchanger>
                            <Grid item xs={12}>
                              <TokenInput
                                onSelectMax={handleTBondSelectMax}
                                onChange={handleTBondChange}
                                value={tbondAmount}
                                max={bondBalance}
                                symbol="MBond"
                              ></TokenInput>
                            </Grid>
                            <Spacer />
                            <StyledDesc>{`${bondBalance} MBOND Available in Wallet`}</StyledDesc>
                          </StyledCardContentInner>
                        </CardContent>
                      </Card>
                    </StyledCardWrapper>
                    <Spacer size="lg"/>
                    <StyledCardWrapper>
                      <Card>
                        <CardContent>
                          <StyledCardContentInner>
                            <StyledCardTitle>MShare</StyledCardTitle>
                            <StyledExchanger>
                              <StyledToken>
                                <StyledCardIcon>
                                  <TokenSymbol symbol={tombFinance.MSHARE.symbol} size={54} />
                                </StyledCardIcon>
                              </StyledToken>
                            </StyledExchanger>
                              <TokenInput
                                onSelectMax={handleTShareSelectMax}
                                onChange={handleTShareChange}
                                value={tshareAmount}
                                max={tshareBalance}
                                symbol="MShare"
                              ></TokenInput>
                            <Spacer />
                            <StyledDesc>{`${tshareBalance} MSHARE Available in Swapper`}</StyledDesc>
                          </StyledCardContentInner>
                        </CardContent>
                      </Card>
              
                    </StyledCardWrapper>
                  </StyledCardsWrapper>
                </StyledBoardroom>
              </Grid>
            </Box>

            <Box mt={6}>
              <Grid container justify="center">
                <Grid item xs={8}>
                  <Card>
                    <CardContent>
                      <StyledApproveWrapper>
                      {approveStatus !== ApprovalState.APPROVED ? (
                        <Button
                          disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                          color="primary"
                          variant="contained"
                          onClick={approve}
                          size="medium"
                        >
                          Approve MBOND
                        </Button>
                      ) : (
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => onSwapTShare(tbondAmount.toString())}
                          size="medium"
                        >
                          Swap
                        </Button>
                      )}
                      </StyledApproveWrapper>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </>
        ) : (
          <UnlockWallet />
        )}
      </Page>
    </Switch>
  );
};

const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  background: transparent;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
    background: transparent;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  background: transparent;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const StyledApproveWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
`;
const StyledCardTitle = styled.div`
  align-items: center;
  display: flex;
  font-size: 20px;
  font-weight: 700;
  background: transparent;
  height: 64px;
  justify-content: center;
  margin-top: ${(props) => -props.theme.spacing[3]}px;
`;

const StyledCardIcon = styled.div`
  background-color: ${(props) => props.theme.color.grey[900]};
  width: 72px;
  height: 72px;
  border-radius: 36px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledExchanger = styled.div`
  align-items: center;
  display: flex;
  background: transparent;
`;

const StyledToken = styled.div`
  align-items: center;
  display: flex;
  background: transparent;
  flex-direction: column;
  font-weight: 600;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  background: transparent;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledDesc = styled.span`
  font-size: 0.8em;
`;

export default Sbs;
