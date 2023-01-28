import React, {useMemo} from 'react';
import styled from 'styled-components';

import {Box, Button, Card, CardContent, Typography} from '@material-ui/core';

import TokenSymbol from '../../../components/TokenSymbol';
import Label from '../../../components/Label';
import Value from '../../../components/Value';
import CardIcon from '../../../components/CardIcon';
import useClaimRewardTimerMasonry from '../../../hooks/dungeon/useClaimRewardTimerMasonry';
import useClaimRewardCheck from '../../../hooks/dungeon/useClaimRewardCheck';
import ProgressCountdown from './ProgressCountdown';
import useHarvestFromMasonry from '../../../hooks/useHarvestFromMasonry';
import useEarningsOnMasonry from '../../../hooks/useEarningsOnMasonry';
import useMagikStats from '../../../hooks/useMagikStats';
import {getDisplayBalance} from '../../../utils/formatBalance';

const Harvest: React.FC = () => {
  const magikStats = useMagikStats();
  const {onReward} = useHarvestFromMasonry();
  const earnings = useEarningsOnMasonry();
  const canClaimReward = useClaimRewardCheck();

  const tokenPriceInDollars = useMemo(
    () => (magikStats ? Number(magikStats.priceInDollars).toFixed(2) : null),
    [magikStats],
  );

  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

  const {from, to} = useClaimRewardTimerMasonry();

  return (
    <Box>
      <Card>
        <CardContent>
          <StyledCardContentInner>
            <StyledCardHeader>
              <CardIcon>
                <TokenSymbol symbol="MSHARE" />
              </CardIcon>
              <Value value={getDisplayBalance(earnings)} />
              <Label text={`≈ $${earnedInDollars}`} color="primary" />
              <Label text="MAGIK Earned" color="primary" />
            </StyledCardHeader>
            <StyledCardActions>
              <Button
                onClick={onReward}
                className={earnings.eq(0) || !canClaimReward ? 'shinyButtonDisabled' : 'shinyButton'}
                disabled={earnings.eq(0) || !canClaimReward}
              >
                Claim Reward
              </Button>
            </StyledCardActions>
          </StyledCardContentInner>
        </CardContent>
      </Card>
      <Box mt={2} style={{color: '#FFF'}}>
        {canClaimReward ? (
          ''
        ) : (
          <Card>
            <CardContent>
              <Typography style={{textAlign: 'center'}}>Claim possible in</Typography>
              <ProgressCountdown hideBar={true} base={from} deadline={to} description="Claim available in" />
            </CardContent>
          </Card>
        )}
      </Box>
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
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Harvest;
