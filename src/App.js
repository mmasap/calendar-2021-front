import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, CssBaseline, Paper } from '@material-ui/core';
import Header from './components/Header';
import DisplayDate from './components/DisplayDate';
import Calendar from './components/Calendar';
import dayjs from 'dayjs';

const UPDATE_INTERVAL = 500;

const useStyles = makeStyles((theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(800 + theme.spacing(2) * 2)]: {
      width: 800,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      padding: theme.spacing(3),
    },
  },
}));

const App = () => {
  const classes = useStyles();
  const [now, setNow] = useState(dayjs());
  const [publicHolidayList, setPublicHolidayList] = useState([]);
  const [nextHoliday, setNextHoliday] = useState(null);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const response = [
      { date: '20210211', name: '建国記念日' },
      { date: '20210223', name: '天皇誕生日' },
    ];
    const formatResponse = response.map((holiday) => ({
      ...holiday,
      date: dayjs(holiday.date),
    }));
    setPublicHolidayList(formatResponse);
    setUpdate(true);

    const interval = setInterval(() => {
      const newNow = dayjs();
      if (newNow.format('D') !== now.format('D')) {
        setUpdate(true);
      }
      setNow(newNow);
    }, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!update) return;
    setUpdate(false);
    const isPublicHoliday = publicHolidayList.some(
      (holiday) => holiday.date.format('YYYYMMDD') === now.format('YYYYMMDD')
    );
    if (now.day() === 6 || now.day() === 0 || isPublicHoliday) {
      setNextHoliday(null);
    } else {
      const nextSaturday = now.day(6);
      const nextPublicHoliday = publicHolidayList.find((holiday) => {
        return now.format('YYYYMMDD') < holiday.date.format('YYYYMMDD');
      });

      if (!nextPublicHoliday || nextSaturday.isBefore(nextPublicHoliday.date)) {
        setNextHoliday(nextSaturday);
      } else {
        setNextHoliday(nextPublicHoliday.date);
      }
    }
  }, [update, publicHolidayList, now]);

  return (
    <Fragment>
      <CssBaseline />
      <Header />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Grid
            container
            direction='column'
            justify='center'
            alignItems='center'
          >
            <Grid item>
              <DisplayDate now={now} nextHoliday={nextHoliday} />
            </Grid>
            <Grid item>
              <Calendar holidayList={publicHolidayList} />
            </Grid>
          </Grid>
        </Paper>
      </main>
    </Fragment>
  );
};

export default App;
