import React, { useState } from 'react';
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
  MenuItem,
  Menu,
  Button,
} from '@material-ui/core';

import ListItemLink from '../ListItemLink';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AccountButton from './AccountButton';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

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
  menu: {
    background: '#fff',
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
  dropdown: {
    position: 'relative',
    display: 'flex'
  },
  dropdownContent: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'absolute',
    backgroundColor: '#f9f9f9',
    minWidth: '160px',
    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
    zIndex: 1
  },
  dropdownContentLink: {
    color: 'black',
    padding: '12px 16px',
    textDecoration: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    '&:hover': {
      backgroundColor: '#f1f1f1'
    }
  },
  
  menuItem: {
    height: 0, // or whatever height works best for your design
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },

  
  dropdownHover: {
    '&:hover $dropdownContent': {
      display: 'block'

    }
  }
}));

const Nav = () => {
  const matches = useMediaQuery('(min-width:900px)');
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [showDeprecatedLinks, setShowDeprecatedLinks] = React.useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: { currentTarget: any; }) => {
    setAnchorEl(event.currentTarget);
  };
  

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const toggleDeprecatedLinks = () => {
    setShowDeprecatedLinks(!showDeprecatedLinks);
  };

  function handleClose() {
    setAnchorEl(null);
  }
  
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
  <a href="https://worldofmagik.com" className={classes.link}>
    World of Magik
  </a>
  {/* <a href="https://magikswap.dog" className={classes.link}>
    MagikSwap
  </a> */}
  {/* <Link color="textPrimary" to="/farms" className={classes.link}>
    Farms
  </Link> */}
  <Link color="textPrimary" to="/might" className={classes.link}>
    MIGHT
  </Link>
  {/* <a href="https://magiknft.magik.finance" className={classes.link}>
    NFT Mint
  </a>
  <a href="https://farmlandv2.magik.finance" className={classes.link}>
    Farmland 
  </a> */}
  <a href="https://magik.farm" className={classes.link}>
    Vaults
  </a>
  <a href="https://magikdotfinance.gitbook.io/magik-v2-ecosystem-whitepaper-draft/" className={classes.link}>
    Docs
  </a>
  <div className={classes.menuItem}>
    <Button id = "Button" aria-controls="deprecated-menu" aria-haspopup="true" onClick={handleClick}>
      Deprecated
    </Button>
    <Menu
      id="deprecated-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem id="Button"
        onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
          event.preventDefault();
          handleClose();
          window.location.href = 'https://farmland.magik.finance';
        }}
      >
        Farmland (OLD)
      </MenuItem>
      <MenuItem id="Button"
        onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
          event.preventDefault();
          handleClose();
          window.location.href = 'https://farmlandv2.magik.finance';
        }}
      >
        FarmlandV2
      </MenuItem>
      <MenuItem id="Button"
        onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
          event.preventDefault();
          handleClose();
          window.location.href = 'https://magik.finance/dungeon';
        }}
      >
        Dungeon (OLD)
      </MenuItem>
      <MenuItem id="Button"
        onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
          event.preventDefault();
          handleClose();
          window.location.href = 'https://magik.finance/wilderness';
        }}
      >
        Wilderness (OLD)
      </MenuItem>
      <MenuItem id="Button"
        onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
          event.preventDefault();
          handleClose();
          window.location.href = 'https://magikswap.dog';
        }}
      >
        MagikSwap (OLD)
      </MenuItem>
      <MenuItem id="Button"
        onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
          event.preventDefault();
          handleClose();
          window.location.href = 'https://magik.finance/farms';
        }}
      >
        Farms
      </MenuItem>
      <MenuItem id="Button"
        onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
          event.preventDefault();
          handleClose();
          window.location.href = 'https://magik.finance/xmshare';
        }}
      >
        xMSHARE
      </MenuItem>
      <MenuItem id="Button"
        onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
          event.preventDefault();
          handleClose();
          window.location.href = 'https://magik.finance/nftstaking';
        }}
      >
        NFT Staking
      </MenuItem>
    </Menu>
  </div>
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
                {/* <ListItem button component="a" href="https://magikswap.dog">
                  <ListItemText>MagikSwap</ListItemText>
                </ListItem> */}
                <ListItem button component="a" href="https://worldofmagik.com">
                  <ListItemText>World of Magik</ListItemText>
                </ListItem>
                {/* <ListItemLink primary="Farms" to="/farms" /> */}
                <ListItemLink primary="MIGHT" to="/might" />
                {/* <ListItem button component="a" href="https://farmland.magik.finance">
                  <ListItemText>Farmland (OLD)</ListItemText>
                </ListItem> */}
                {/* <ListItem button component="a" href="https://farmlandv2.magik.finance">
                  <ListItemText>Farmland</ListItemText>
                </ListItem> */}
                {/* <ListItemLink primary="Dungeon" to="/dungeon" />
                <ListItemLink primary="Wilderness" to="/wilderness" /> */}
                <ListItem button component="a" href="https://magik.farm">
                  <ListItemText>Vaults</ListItemText>
                </ListItem>
  <ListItem button onClick={toggleDeprecatedLinks}>
    <ListItemText>Deprecated</ListItemText>
    {showDeprecatedLinks ? <ExpandLess /> : <ExpandMore />}
  </ListItem>
  {showDeprecatedLinks && (
    <List component="div" disablePadding>
      <ListItem button className={classes.nested} component="a" href="https://farmland.magik.finance">
        <ListItemText primary="Farmland (OLD)" />
      </ListItem>
      <ListItem button className={classes.nested} component="a" href="https://farmlandv2.magik.finance">
        <ListItemText primary="FarmlandV2" />
      </ListItem>
      <ListItem button className={classes.nested} component="a" href="https://magik.finance/dungeon">
        <ListItemText primary="Dungeon" />
      </ListItem>
      <ListItem button className={classes.nested} component="a" href="https://magik.finance/wilderness">
        <ListItemText primary="Wilderness" />
      </ListItem>
      <ListItem button className={classes.nested} component="a" href="https://magik.finance/farms">
        <ListItemText primary="Farms" />
      </ListItem>
      <ListItem button className={classes.nested} component="a" href="https://magik.finance/xmshare">
        <ListItemText primary="xMSHARE" />
      </ListItem>
      <ListItem button className={classes.nested} component="a" href="https://magikswap.dog">
        <ListItemText primary="MagikSwap" />
      </ListItem>
    </List>  )}
                {/* <ListItem button component="a" href="https://magiknft.magik.finance">
                  <ListItemText>NFT Mint</ListItemText>
                </ListItem> */}
                {/* <ListItem button component="a" href="https://moshpit.magik.finance">
                  <ListItemText>Moshpit</ListItemText>
                </ListItem> */}
                {/* <ListItemLink primary="xMSHARE" to="/xmshare" />
                <ListItemLink primary="NFT Staking" to="/nftstaking" /> */}
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
