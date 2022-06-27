import React, { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import Bank from '../Bank';

import { Box, Grid, LinearProgress, Button } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/styles';

import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';

//import useBanks from '../../hooks/useBanks';
import useMagikFinance from '../../hooks/useMagikFinance';
import PitImage from '../../assets/img/dungeon.png';;

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${PitImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
  },
}))(LinearProgress);

const useStyles = makeStyles((theme) => ({
  stakeButtons: {
    marginRight: '1rem',
  }
}));

const Cemetery = () => {
//  const [banks] = useBanks();
  const { path } = useRouteMatch();
  const { account, /*ethereum*/ } = useWallet();
  //const activeBanks = banks.filter((bank) => !bank.finished);
  const classes = useStyles();
  const tombFinance = useMagikFinance();
  const [nftsInWallet, setNftsInWallet] = useState([]);
  const [nftsStaked, setNftsStaked] = useState([]);
  const [nftTotalSupply, setNftTotalSupply] = useState(1);
  const [nftStakedTotalSupply, setNftStakedTotalSupply] = useState(0);
  const [indexOfSelectedNft, setIndexOfselectedNft] = useState(-1);
  const [indexOfSelectedNftInWallet, setIndexOfselectedNftInWallet] = useState(-1);
  const [reward, setReward] = useState(0);
  
  const reloadNfts = async () => {
    if (account) {
      let nftsInWalletWithJSON = await tombFinance.getNFTsInWallet(account, 'MagikWalletNFT');
      setNftsInWallet(await Promise.all(
        nftsInWalletWithJSON.map(async nft => {
          return {
            tokenId: nft.tokenId,
            ...await getImageFromJSON(nft.metaDataJson)
          }
        })
      ));

      let nftsStakedWithJSON = await tombFinance.getNFTsStaked(account, 'MagikWalletNFT', 'MagikStakingNFT');
      setNftsStaked(await Promise.all(
        nftsStakedWithJSON.map(async nft => {
          return {
            tokenId: nft.tokenId,
            ...await getImageFromJSON(nft.metaDataJson)
          }
        })
      ));

      setNftTotalSupply(await tombFinance.nftTotalSupply('MagikWalletNFT'));
      setNftStakedTotalSupply(await tombFinance.nftStakedTotalSupply('MagikWalletNFT', 'MagikStakingNFT'));
    }
  }

  useEffect(() => {
    reloadNfts();
  }, [tombFinance, account]);

  const getImageFromJSON = async (json) => {
    try {
      const { image, name} = await (await fetch('https://magikfinance.mypinata.cloud/ipfs/' + json.replace('ipfs://', ''))).json();
      return {
        image: 'https://magikfinance.mypinata.cloud/ipfs/' + image.replace('ipfs://', ''),
        name,
      };
    } catch(e) {
      return await getImageFromJSON(json);
    }
  }

  const selectNftStaked = async (index) => {
    setIndexOfselectedNft(index);
    setIndexOfselectedNftInWallet(-1);
    setReward(await tombFinance.calculateRewards(account, [nftsStaked[index].tokenId], 'MagikStakingNFT'));
  }

  const selectNftInWallet = async (index) => {
    setIndexOfselectedNftInWallet(index);
    setIndexOfselectedNft(-1);
  }

  const stake = async () => {
    await tombFinance.stakeNfts([nftsInWallet[indexOfSelectedNftInWallet].tokenId], 'MagikStakingNFT');
    reloadNfts();
  }

  const unStake = async () => {
    await tombFinance.unStake(nftsStaked[indexOfSelectedNft].tokenId, 'MagikStakingNFT');
    reloadNfts();
  }

  const claim = async () => {
    await tombFinance.claim(nftsStaked[indexOfSelectedNft].tokenId, 'MagikStakingNFT');
    setReward(await tombFinance.calculateRewards(account, [nftsStaked[indexOfSelectedNft].tokenId], 'MagikStakingNFT'));
  }

  const approve = async () => {
    await tombFinance.approve('MagikWalletNFT', 'MagikStakingNFT');
  }

  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          <BackgroundImage />
          <div style={{ textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: '80px', textAlign:'center', marginBottom: '50px'  }}>Magik NFT Staking</h2>
          <Grid container justify="center" spacing={0} style={{marginTop: '40px', marginBottom: '40px'}}>
              <Button color="primary" target="_blank" href="https://nftkey.app/collections/magiknft/" variant="contained" className={'shinyButton ' + classes.button} style={{ marginRight: '10px' }}>
                Buy on NFTKey
              </Button>
              <Button color="primary" target="_blank" href="https://paintswap.finance/marketplace/collections/0xe2b8a9f4d1417acd4a696fa9580a393ef703a619" variant="contained" className={'shinyButton ' + classes.button} style={{ marginRight: '10px' }}>
                Buy on Paintswap
              </Button>
          </Grid>
            <span style={{ fontSize: '36px' }}>
              { parseInt(nftStakedTotalSupply * 100 / nftTotalSupply) } % Magik NFT's STAKED
            </span>
            <BorderLinearProgress variant="determinate" value={nftStakedTotalSupply * 100 / nftTotalSupply} />
            <br/>
            <Grid container spacing={2}>
              <Grid xs={12} item>
                <Box style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(30px)",
            padding: 48,
            borderRadius: 48,
            border: "4px dashed var(--secondary)",
            boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
                }}>
                  <p>
                    {nftsInWallet.length} NFT(s) in your wallet
                  </p>
                  <Box style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}>
                    {
                      nftsInWallet.map(({image, name}, index) => 
                        <Box style={{
                          marginRight: '1rem',
                          
                        }}>
                          <img
                            src={image} 
                            style={{
                              border: index === indexOfSelectedNftInWallet ? '2px solid blue' : '',
                              width: '150px',
                              height: '150px',
                            }}
                            onClick={() => selectNftInWallet(index)}
                            alt="NFT"
                          />
                          <p> { name } </p>
                        </Box>
                      )
                    }
                  </Box>
                </Box>
              </Grid>
              <Grid xs={12} item>
                <Box style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(30px)",
            padding: 100,
            borderRadius: 200,
            border: "4px dashed var(--secondary)",
            boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
                  visibility: indexOfSelectedNft === -1 && indexOfSelectedNftInWallet === -1 ? 'hidden' : 'visible',
                  height: '100px',
                }}>
                  {
                    indexOfSelectedNft > -1 && <>
                      <p style={{fontSize: '18px', fontWeight: 'bold'}}>
                        { nftsStaked[indexOfSelectedNft].name }
                      </p>
                      <Box style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(30px)",
            padding: 2,
            borderRadius: 2,
            border: "4px dashed var(--secondary)",
            boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
                      }}>
                        <div>
                          <Button
                            variant='contained' 
                            color="primary" 
                            classes={{
                              root: classes.stakeButtons,
                            }}
                            onClick={unStake}
                          >
                            Unstake
                          </Button>
                          <Button
                            variant='contained'
                            color="primary"
                            onClick={claim}
                          >
                            Claim
                          </Button>
                        </div>
                        <p style={{maxWidth: '50%'}}>Claimable: { reward / 1e18 } MSHARE</p>
                      </Box>
                    </>
                  }
                  {
                    indexOfSelectedNftInWallet > -1 && <>
                     <p style={{fontSize: '18px', fontWeight: 'bold'}}>
                        { nftsInWallet[indexOfSelectedNftInWallet].name }
                      </p>
                      <Box style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                        
                      }}>
                        <div>
                        <Button
                            variant='contained' 
                            color="primary" 
                            onClick={approve}
                            classes={{
                              root: classes.stakeButtons,
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant='contained' 
                            color="primary" 
                            classes={{
                              root: classes.stakeButtons,
                            }}
                            onClick={stake}
                          >
                            Stake
                          </Button>
                        </div>
                      </Box>
                    </>
                  }
                </Box>
                <Box style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(30px)",
            padding: 24,
            borderRadius: 24,
            border: "4px dashed var(--secondary)",
            boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
                }}>
                  <p>
                    { nftsStaked.length } NFT(s) staked
                  </p>
                  <Box style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}>
                    {
                      nftsStaked.map(({image, name}, index) => 
                        <Box style={{
                          marginRight: '1rem',
                        }}>
                          <img 
                            src={image}
                            width="150"
                            style={{
                              border: index === indexOfSelectedNft ? '2px solid purple' : '',
                              width: '150px',
                              height: '150px',
                            }}
                            onClick={() => selectNftStaked(index)}
                            alt="NFT"
                          />
                          <p> { name } </p>
                        </Box>
                      )
                    }
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </div>

          {/* {!!account ? (
            <Container maxWidth="lg">
              <h2 style={{ textAlign: 'center', fontSize: '80px' }}>NFT Staking</h2>

              <Box mt={5}>
                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 2).length === 0}>
                  <Typography color="textPrimary" variant="h4" gutterBottom>
                    MvSHARE Rewards Pools
                  </Typography>

                  <Grid container spacing={3} style={{ marginTop: '20px' }}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 2)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CemeteryCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>

                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 0).length === 0}>
                  <Typography color="textPrimary" variant="h4" gutterBottom style={{ marginTop: '20px' }}>
                    Genesis Pools
                  </Typography>
                  <Alert variant="filled" severity="warning">
                    Genesis Pools start soon.
                  </Alert>
                  <Grid container spacing={3} style={{ marginTop: '20px' }}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 0)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CemeteryCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>
              </Box>
            </Container>
          ) : (
            <UnlockWallet />
          )} */}
        </Route>
        <Route path={`${path}/:bankId`}>
          <BackgroundImage />
          <Bank />
        </Route>
      </Page>
    </Switch>
  );
};

export default Cemetery;
