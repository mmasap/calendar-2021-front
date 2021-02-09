import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import woman from '../images/kaisya_woman.png';

const JAPANESE_DAY = ['日', '月', '火', '水', '木', '金', '土'];

const useStyles = makeStyles((theme) => ({
  image: {
    width: 128,
    height: 128,
  },
}));

const DisplayDate = ({ now, nextHoliday }) => {
  const classes = useStyles();
  const remainSeconds = nextHoliday ? nextHoliday.unix() - now.unix() : 0;

  return (
    <Grid container spacing={2} direction='column' alignItems='center'>
      <Grid item>
        <Typography>現在時刻: {getCurrentTime(now)}</Typography>
      </Grid>
      <Grid item>
        <Grid container spacing={2}>
          <Grid item>
            <img src={woman} className={classes.image} alt='tests' />
          </Grid>
          <Grid item>
            <Grid
              container
              direction='column'
              justify='center'
              alignItems='center'
              style={{ height: '100%' }}
            >
              <Grid item>
                <Typography>次の休みまで</Typography>
              </Grid>
              <Grid item>
                <Typography>{remainSeconds}秒</Typography>
              </Grid>
              <Grid item>
                <Typography>{getRemainMinutes(remainSeconds)}</Typography>
              </Grid>
              <Grid item>
                <Typography>{getRemainHours(remainSeconds)}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const getCurrentTime = (now) => {
  const date = now.format('YYYY/MM/DD');
  const day = JAPANESE_DAY[now.day()];
  const time = now.format('HH:mm:ss');
  return `${date} (${day}) ${time}`;
};

const getRemainMinutes = (remainSeconds) => {
  const minutes = Math.floor(remainSeconds / 60);
  const seconds = remainSeconds % 60;
  return `${minutes}分${zeroPadding(seconds)}秒`;
};

const getRemainHours = (remainSeconds) => {
  const hours = Math.floor(remainSeconds / 3600);
  const minutes = Math.floor(remainSeconds / 60) % 60;
  const seconds = remainSeconds % 60;
  return `${hours}時間${zeroPadding(minutes)}分${zeroPadding(seconds)}秒`;
};

const zeroPadding = (time) => ('0' + time).slice(-2);
export default DisplayDate;