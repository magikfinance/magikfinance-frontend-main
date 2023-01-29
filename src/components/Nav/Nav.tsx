import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import AuditImage from '../../assets/img/Audit.png';
import './nav.css'
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@material-ui/core';

import ListItemLink from '../ListItemLink';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AccountButton from './AccountButton';

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    color: '#e0e3bd',
    padding: '10px',
    marginBottom: '3rem',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
  hide: {
    display: 'none',
  },
  toolbarTitle: {
    fontFamily: '"Amarante", cursive',
    fontSize: '30px',
    flexGrow: 1,
  },
  link: {
    textTransform: 'uppercase',
    color: 'rgb(255,232,132)',
    fontSize: '14px',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  brandLink: {
    textDecoration: 'none',
    color: 'rgb(255,232,132)',
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

const Nav = () => {
  const matches = useMediaQuery('(min-width:900px)');
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <AppBar id="AppBar" position="sticky" elevation={0} className={classes.appBar}>
      <Toolbar id="Toolbar">
        {matches ? (
          <>
            <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
              <Link to="/" color="inherit" className={classes.brandLink}>
                Magik Finance
              </Link>
            </Typography>
            <Box id='Menu'>
            <a href="https://magikswap.dog" className={classes.link}>
              MagikSwap
              </a>
              <a href="https://magiknft.magik.finance" className={classes.link}>
              NFT Mint
              </a>
              <Link color="textPrimary" to="/farms" className={classes.link}>
                Farms
              </Link>
              <a href="https://farmland.magik.finance" className={classes.link}>
              Farmland (OLD)
              </a>
              <a href="https://farmlandv2.magik.finance" className={classes.link}>
              Farmland 
              </a>
              <Link color="textPrimary" to="/dungeon" className={classes.link}>
                Dungeon
              </Link>
              <Link color="textPrimary" to="/wilderness" className={classes.link}>
                Wilderness
              </Link>
              <Link color="textPrimary" to="/xmshare" className={classes.link}>
                xMSHARE
              </Link>
              <a href="https://magik.farm" className={classes.link}>
              Vaults
              </a>
              {/* <a href="https://moshpit.magik.finance" className={classes.link}>
               Moshpit
              </a> */}
              <Link color="textPrimary" to="/nftstaking" className={classes.link}>
                NFT Staking
              </Link>
              <a href="https://magikdotfinance.gitbook.io/magik-v2-ecosystem-whitepaper-draft/" className={classes.link}>
                Docs
              </a>
            </Box>
            <AccountButton text="Connect" />
          </>
        ) : (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Magik Finance
            </Typography>

            <Drawer
                className={classes.drawer}
                onEscapeKeyDown={handleDrawerClose}
                onBackdropClick={handleDrawerClose}
                variant="temporary"
                anchor="left"
                open={open}
                classes={{
                  paper: classes.drawerPaper,
                }}
                style={{ background: '#121212' }}
            >
              <div>
                <IconButton onClick={handleDrawerClose}>ß
                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              </div>
              <Divider />
              <List>
                <ListItemLink primary="Home" to="/" />
                <ListItem button component="a" href="https://magikswap.dog">
                  <ListItemText>MagikSwap</ListItemText>
                </ListItem>
                <ListItem button component="a" href="https://magiknft.magik.finance">
                  <ListItemText>NFT Mint</ListItemText>
                </ListItem>
                <ListItemLink primary="Farms" to="/farms" />
                <ListItem button component="a" href="https://farmland.magik.finance">
                  <ListItemText>Farmland (OLD)</ListItemText>
                </ListItem>
                <ListItem button component="a" href="https://farmlandv2.magik.finance">
                  <ListItemText>Farmland</ListItemText>
                </ListItem>
                <ListItemLink primary="Dungeon" to="/dungeon" />
                <ListItemLink primary="Wilderness" to="/wilderness" />
                <ListItemLink primary="xMSHARE" to="/xmshare" />
                <ListItem button component="a" href="https://magik.farm">
                  <ListItemText>Vaults</ListItemText>
                </ListItem>
                {/* <ListItem button component="a" href="https://moshpit.magik.finance">
                  <ListItemText>Moshpit</ListItemText>
                </ListItem> */}
                <ListItemLink primary="NFT Staking" to="/nftstaking" />
                <ListItem button component="a" href="https://magikdotfinance.gitbook.io/magik-v2-ecosystem-whitepaper-draft/">
                  <ListItemText>Docs</ListItemText>
                </ListItem>
                <ListItem style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AccountButton text="Connect" />
                </ListItem>
              </List>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
