import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
}));

const Header = () => {
  const classes = useStyles();
  return (
    <AppBar position='absolute' className={classes.appBar}>
      <Toolbar>
        <Typography variant='h6' color='inherit' noWrap>
          次の休みまであとどれくらい？
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
