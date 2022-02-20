import React from 'react';
import styled from 'styled-components';

import { Card, CardContent } from '@material-ui/core';

interface ExchangeStatProps {
  tokenName: string;
  description: string;
  price: string;
}

const ExchangeStat: React.FC<ExchangeStatProps> = ({ tokenName, description, price }) => {
  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardTitle>{`💰 ${tokenName} = ${price} FTM`}</StyledCardTitle>
          <StyledDesc>{description}</StyledDesc>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};

const StyledCardTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledDesc = styled.span`
  text-align: center;
`;

const StyledCardContentInner = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export default ExchangeStat;
