import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardActions, CardContent, Typography, Grid } from '@material-ui/core';

import TokenSymbol from '../../components/TokenSymbol';

const CauldronCard = ({ bank }) => {
  return (
    <Grid item xs={12} md={6} lg={6}>
      <Card variant="outlined" style={{ border: '1px solid var(--white)' }}>
        <CardContent>
          <Box style={{ position: 'relative' }}>
            <Box
              style={{
                position: 'absolute',
                right: '0px',
                top: '-5px',
                height: '48px',
                width: '48px',
                boarder: '1px #ffffff',
                borderRadius: '40px',
                backgroundColor: 'primary',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <TokenSymbol size={32} symbol={bank.depositTokenName} />
            </Box>
            <Typography variant="h4" component="h1">
              {bank.depositTokenName}
            </Typography>
            <Typography variant="h5" component="h5" color="textSecondary">
              {/* {bank.name} */}
              Deposit {bank.depositTokenName.toUpperCase()} Earn {` ${bank.earnTokenName}`}
            </Typography>
          </Box>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button color="primary" size="small" variant="contained" component={Link} to={`/cauldron/${bank.contract}`}>
            View
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default CauldronCard;
