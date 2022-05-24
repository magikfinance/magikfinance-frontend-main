import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import AuditImage from '../../assets/img/Audit.png';
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
    'background-color': '#121212',
    // borderBottom: `1px solid ${theme.palette.divider}`,
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
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    fontFamily: '"Amarante", cursive',
    fontSize: '30px',
    flexGrow: 1,
  },
  link: {
    textTransform: 'uppercase',
    color: '#e0e3bd',
    fontSize: '14px',
    margin: theme.spacing(1, 2),
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  brandLink: {
    textDecoration: 'none',
    color: '#e0e3bd',
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
    <AppBar position="sticky" elevation={0} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {matches ? (
          <>
            <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
              {/* <a className={ classes.brandLink } href="/">Magik Finance</a> */}
              <Link to="/" color="inherit" className={classes.brandLink}>
                Magik Finance
              </Link>
            </Typography>
            <Box mr={5}>
              <Link color="textPrimary" to="/" className={classes.link}>
                Home
              </Link>
              <Link color="textPrimary" to="/cauldron" className={classes.link}>
                Cauldron
              </Link>
              <Link color="textPrimary" to="/nftmint" className={classes.link}>
                NFT
              </Link>
              <Link color="textPrimary" to="/raffle" className={classes.link}>
                Raffle
              </Link>
              <Link color="textPrimary" to="/dungeon" className={classes.link}>
                Dungeon
              </Link>
              <Link to="/stake" className={'/stake ' + classes.link}>
                xMagik
              </Link>
              <Link color="textPrimary" to="/wilderness" className={classes.link}>
                Wilderness
              </Link>
              {/* <Link color="textPrimary" to="/sbs" className={classes.link}>
                SBS
              </Link> */}
              <a href="https://magik.farm" className={classes.link}>
              Magik Autocompounder
              </a>
              <a href="https://magikdotfinance.gitbook.io/docs/" className={classes.link}>
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
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              </div>
              <Divider />
              <List>
                <ListItemLink primary="Home" to="/" />
                <ListItemLink primary="Cauldron" to="/cauldron" />
                <ListItemLink primary="NFT" to="/nftmint" />
                <ListItemLink primary="Raffle" to="/raffle" />
                <ListItemLink primary="Dungeon" to="/dungeon" />
                <ListItemLink primary="Wilderness" to="/wilderness" />
                {/* <ListItemLink primary="SBS" to="/sbs" /> */}
                <ListItemLink primary="xMagik" to="/stake" />
                <ListItem button component="a" href="https://magik.farm">
                  <ListItemText>Magik Autocompounder</ListItemText>
                </ListItem>
                <ListItem button component="a" href="https://magikdotfinance.gitbook.io/docs">
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
