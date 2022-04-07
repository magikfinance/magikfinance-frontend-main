import React from 'react';
import Page from '../../components/Page';
import NFTImage from '../../assets/img/Samurai.png';
import { useWallet } from 'use-wallet';
import { Box, Card, CardContent, Button, Typography, Tooltip, Grid } from '@material-ui/core';
import UnlockWallet from '../../components/UnlockWallet';
import HomeImage from '../../assets/img/home.png';
import styled, { createGlobalStyle } from "styled-components";
import Minting from './components/minting'

const BackgroundImage = createGlobalStyle`
  body, html {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
`;


const NFTMint = () => {
  const { account } = useWallet();
  return (
    <Page>
      <BackgroundImage />
      {!!account ? (
        <>
          <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
        <Container flex={1} jc={"center"} ai={"center"}>
          <StyledImg alt={"example"} src={NFTImage} style={{ transform: "scaleX(-1)" }} />
        </Container>

        <SpacerLarge />
        <Container
          flex={2}
          jc={"center"}
          ai={"center"}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(30px)",
            padding: 24,
            borderRadius: 24,
            border: "4px dashed var(--secondary)",
            boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
          }}
        >
          <TextTitle
            style={{
              textAlign: "center",
              fontSize: 50,
              fontWeight: "bold",
            }}
          >
            Total MNFT available 350
            Sold Out!
          </TextTitle>
          <TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
          <Minting />
            {/* <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
              {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
            </StyledLink> */}
          </TextDescription>
          {Number(0) >= 1 ? (
            <>
              <TextTitle
                style={{ textAlign: "center" }}
              >
                The sale has ended.
              </TextTitle>
              <TextDescription
                style={{ textAlign: "center" }}
              >
                You can still find MAGIK NFT on
              </TextDescription>
              <StyledLink target={"_blank"} href="#">
                {/* {CONFIG.MARKETPLACE} */}
              </StyledLink>
            </>
          ) : (
            <>
              <TextTitle
                style={{ textAlign: "center" }}
              >
                1 $MNFT costs 8 $MSHARE
              </TextTitle>
              <SpacerXSmall />
              <TextDescription
                style={{ textAlign: "center", }}
              >
                Excluding gas fee
              </TextDescription>
              <SpacerSmall />
              {/* {blockchain.account === "" || blockchain.smartContract === null ? ( */}
              {"" === "" || null === null ? (
                <Container ai={"center"} jc={"center"}>
                  <TextDescription
                    style={{
                      textAlign: "center"
                    }}
                  >
                  </TextDescription>
                  <SpacerSmall />

                </Container>
              ) : (
                <>
                  <TextDescription
                    style={{
                      textAlign: "center"
                    }}
                  >
                    {/* {feedback} */}
                  </TextDescription>
                  <SpacerMedium />
                  <Container ai={"center"} jc={"center"} fd={"row"}>
                    <StyledRoundButton
                      style={{ lineHeight: 0.4 }}
                      // disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        // decrementMintAmount();
                      }}
                    >
                      -
                    </StyledRoundButton>
                    <SpacerMedium />
                    <TextDescription
                      style={{
                        textAlign: "center"
                      }}
                    >
                      {/* {mintAmount} */}
                    </TextDescription>
                    <SpacerMedium />
                    <StyledRoundButton
                      // disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        // incrementMintAmount();
                      }}
                    >
                      +
                    </StyledRoundButton>
                  </Container>
                  <SpacerSmall />
                  <Container ai={"center"} jc={"center"} fd={"row"}>
                    <StyledButton
                      // disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        // claimNFTs();
                        // getData();
                      }}
                    >
                      BUY
                      {/* {claimingNft ? "BUSY" : "BUY"} */}
                    </StyledButton>
                  </Container>
                </>
              )}
            </>
          )}
          <SpacerMedium />
        </Container>

        <SpacerLarge />

        <Container flex={1} jc={"center"} ai={"center"}>
          <StyledImg
            alt={"example"}
            src={NFTImage}
          />
        </Container>
      </ResponsiveWrapper>

        </>
      ) : (
        <UnlockWallet />
      )}
    </Page>
  )
};

export const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const SpacerXSmall = styled.div`
  height: 8px;
  width: 8px;
`;

// Used for providing space between components
export const SpacerSmall = styled.div`
  height: 16px;
  width: 16px;
`;

// Used for providing space between components
export const SpacerMedium = styled.div`
  height: 24px;
  width: 24px;
`;

// Used for providing space between components
export const SpacerLarge = styled.div`
  height: 32px;
  width: 32px;
`;

// Used for providing a wrapper around a component
export const Container = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  background: transparent;
  width: 100%;
  background-size: cover;
  background-position: center;
`;

export const TextTitle = styled.p`
  color: #ffffff;
  font-size: 22px;
  font-weight: 500;
  line-height: 1.6;
`;

export const TextSubTitle = styled.p`
  color: #ffffff;
  font-size: 18px;
  line-height: 1.6;
`;

export const TextDescription = styled.p`
  color: #ffffff;
  font-size: 16px;
  line-height: 1.6;
`;

export const StyledClickable = styled.div`
  :active {
    opacity: 0.6;
  }
`;

export const StyledLink = styled.a`
  color: #ffffff;
  text-decoration: none;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const Bg = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

export default NFTMint;