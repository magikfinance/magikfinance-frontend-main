import React, {useMemo} from 'react';
import styled from 'styled-components';

import {Box, Button, Card, CardContent} from '@material-ui/core';

// import Button from '../../../components/Button';
// import Card from '../../../components/Card';
// import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import {AddIcon, RemoveIcon} from '../../../components/icons';
import IconButton from '../../../components/IconButton';
import Label from '../../../components/Label';
import Value from '../../../components/Value';
//import useXmagikBalance from '../../../hooks/useXmagikBalance';
import useApprove, {ApprovalState} from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useTokenBalance from '../../../hooks/useTokenBalance';
import MetamaskFox from '../../../assets/img/metamask-fox.svg';
import {getDisplayBalance} from '../../../utils/formatBalance';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import useMagikFinance from '../../../hooks/useMagikFinance';
import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';
import TokenSymbol from '../../../components/TokenSymbol';
import useStakeToMagik from '../../../hooks/useStakeToMagik';
import useWithdrawFromMagik from '../../../hooks/useWithdrawFromMagik';
import useXmagikBalance from '../../../hooks/useXmagikBalance';

const Stake: React.FC = () => {
  const magikFinance = useMagikFinance();
  const [approveStatus, approve] = useApprove(magikFinance.MAGIK, magikFinance.contracts.xMAGIK.address);

  const tokenBalance = useTokenBalance(magikFinance.MAGIK);
  //const stakedBalance = useStakedMagik();
  const stakedBalance = useTokenBalance(magikFinance.XMAGIK);

  const xmagikBalance = useXmagikBalance();
  const xmagikRate = Number(xmagikBalance) / 1000000000000000000;
  const stakedTokenPriceInDollars = Number(useStakedTokenPriceInDollars('MAGIK', magikFinance.MAGIK)) * xmagikRate;

  const tokenPriceInDollars = useMemo(
    () =>
      stakedTokenPriceInDollars
        ? (Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalance))).toFixed(2).toString()
        : null,
    [stakedTokenPriceInDollars, stakedBalance],
  );
  // const isOldBoardroomMember = boardroomVersion !== 'latest';

  const {onStake} = useStakeToMagik();
  const {onWithdraw} = useWithdrawFromMagik();

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={'MAGIK'}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      tokenName={'xMAGIK'}
    />,
  );

  return (
    <Box>
      <Card>
        <CardContent>
          <StyledCardContentInner>
            <StyledCardHeader>
              <CardIcon>
                <TokenSymbol symbol="XMAGIK" />
              </CardIcon>

              <Button
                className={'shinyButton'}
                onClick={() => {
                  magikFinance.watchAssetInMetamask('XMAGIK');
                }}
                style={{
                  position: 'static',
                  top: '10px',
                  right: '10px',
                  border: '1px grey solid',
                  paddingBottom: '5px',
                  marginBottom: '20px',
                }}
              >
                {' '}
                <b>+</b>&nbsp;&nbsp;
                <img alt="metamask fox" style={{width: '20px', filter: 'grayscale(100%)'}} src={MetamaskFox} />
              </Button>
              <Value value={getDisplayBalance(stakedBalance)} />
              <Label text={`≈ $${tokenPriceInDollars}`} color="primary" />
              <Label text={'xMAGIK Balance'} color="primary" />
            </StyledCardHeader>
            <StyledCardActions>
              {approveStatus !== ApprovalState.APPROVED ? (
                <Button
                disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
                onClick={approve}
                >
                  Approve MAGIK
                </Button>
              ) : (
                <>
                  <IconButton onClick={onPresentWithdraw}>
                    <RemoveIcon color={'yellow'} />
                  </IconButton>
                  <StyledActionSpacer />
                  <IconButton onClick={onPresentDeposit}>
                    <AddIcon color={'yellow'} />
                  </IconButton>
                </>
              )}
            </StyledCardActions>
          </StyledCardContentInner>
        </CardContent>
      </Card>
      {/* <Box mt={2} style={{color: '#FFF'}}>
        {canWithdrawFromBoardroom ? (
          ''
        ) : (
          <Card>
            <CardContent>
              <Typography style={{textAlign: 'center'}}>Withdraw possible in</Typography>
              <ProgressCountdown hideBar={true} base={from} deadline={to} description="Withdraw available in" />
            </CardContent>
          </Card>
        )}
      </Box> */}
    </Box>
  );
};

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28px;
  width: 100%;
`;

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Stake;
