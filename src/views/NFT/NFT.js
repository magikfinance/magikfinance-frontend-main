import React from 'react';
import Page from '../../components/Page';
import NFTImage from '../../assets/img/crypto_tomb_cash2.png';
import { Button } from '@material-ui/core';

import { Bg, ResponsiveWrapper, Container, StyledImg, TextTitle, SpacerLarge, TextDescription, StyledLink, SpacerXSmall, SpacerSmall, SpacerMedium, StyledRoundButton, StyledButton } from './components';

const NFTMint = () => {
  return (
    <Page>
      <Bg />
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
            0 / 1000
          </TextTitle>
          <TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            {/* <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
              {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
            </StyledLink> */}
          </TextDescription>
          {/* {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? ( */}
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
                1 $MNFT costs 1 $MSHARE
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
                    Connect to the fantom network
                  </TextDescription>
                  <SpacerSmall />
                  <Button
                    color="primary"
                    target="_blank"
                    // href={buyTombAddress}
                    variant="contained"
                    style={{ marginRight: '5px' }}
                  // className={classes.button}
                  >
                    CONNECT
                  </Button>
                  {/* <StyledButton
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(connect());
                      getData();
                    }}
                  >
                    CONNECT
                  </StyledButton> */}
                  {/* {blockchain.errorMsg !== "" ? (
                    <>
                      <SpacerSmall />
                      <TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {blockchain.errorMsg}
                      </TextDescription>
                    </>
                  ) : null} */}
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
    </Page>
  )
};

export default NFTMint;