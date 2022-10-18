import React from 'react';
import styled from 'styled-components';

const Card: React.FC = ({ children }) => <StyledCard>{children}</StyledCard>;

const StyledCard = styled.div`
  background: linear-gradient(45deg,#ffffff00,#ffffff30,#ffffff00);
  backdrop-Filter: blur(3px) brightness(20%);
  color: #2c2560 !important;
  display: flex;
  flex: 1;
  flex-direction: column;
  border-radius: 20px;
  border: 1px solid rgb(255,232,132);
`;

export default Card;
