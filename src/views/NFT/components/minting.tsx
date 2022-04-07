import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Box, Button, Card, CardContent, Typography } from '@material-ui/core';

import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useTokenBalance from '../../../hooks/useTokenBalance';


import { getDisplayBalance } from '../../../utils/formatBalance';


import useMagikFinance from '../../../hooks/useMagikFinance';
import TokenSymbol from '../../../components/TokenSymbol';
import useMinting from '../../../hooks/useMinting';

const Minting: React.FC = () => {
  const tombFinance = useMagikFinance();
  const [approveStatus, approve] = useApprove(tombFinance.MSHARE, tombFinance.contracts.NFTContract.address);

  const tokenBalance = useTokenBalance(tombFinance.MSHARE);

  const { onMint } = useMinting();

  return (
    <Box>
      <Card>
        <CardContent>
          <StyledCardContentInner>
            <StyledCardActions>
              {approveStatus !== ApprovalState.APPROVED ? (
                <Button
                  disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '20px' }}
                  onClick={approve}
                >
                  Approve MSHARE
                </Button>
              ) : (
                <>
                  <Button
                  variant="contained"
                  color="primary"
                  disabled={true}
                  style={{ marginTop: '20px' }}
                  onClick={onMint}
                >
                  Mint!
                </Button>
                </>
              )}
            </StyledCardActions>
          </StyledCardContentInner>
        </CardContent>
      </Card>
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

export default Minting;
