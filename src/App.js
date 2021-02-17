import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, CssBaseline, Paper } from '@material-ui/core';
import axios from 'axios';
import dayjs from './lib/dayjs';
import Header from './components/Header';
import DisplayDate from './components/DisplayDate';
import Calendar from './components/Calendar';

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
  // const [now, setNow] = useState(dayjs());
  const [now, setNow] = useState(dayjs('2021-02-14 23:59:50'));
  const [publicHolidayList, setPublicHolidayList] = useState([]);
  const [nextHoliday, setNextHoliday] = useState(null);
  const [dateImage, setDateImage] = useState(null);
  const [update, setUpdate] = useState(true);

  const getPublicHoliday = async () => {
    const holidayResponse = await axios.get(
      'https://sxn5moekdl.execute-api.ap-northeast-1.amazonaws.com/dev/publicHolidays'
    );
    setPublicHolidayList(
      holidayResponse.data.map((holiday) => ({
        ...holiday,
        date: dayjs(holiday.date),
      }))
    );
  };

  const getImage = async () => {
    const imageResponse = await axios.post(
      'https://sxn5moekdl.execute-api.ap-northeast-1.amazonaws.com/dev/todaysImage',
      { date: now.format('YYYY-MM-DD') }
    );
    setDateImage(imageResponse.data);
  };

  useEffect(() => {
    getPublicHoliday();
    const interval = setInterval(() => {
      setNow((prev) => {
        const newNow = prev.add(1, 'second');
        if (newNow.date() !== prev.date()) {
          setUpdate(true);
        }
        return newNow;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!update || publicHolidayList.length === 0) return;
    setUpdate(false);
    getImage();
    const isPublicHoliday = publicHolidayList.some(
      (holiday) => holiday.date.format('YYYYMMDD') === now.format('YYYYMMDD')
    );
    if (now.day() === 6 || now.day() === 0 || isPublicHoliday) {
      setNextHoliday(null);
    } else {
      const nextSaturday = dayjs(now.day(6).format('YYYYMMDD'));
      const nextPublicHoliday = publicHolidayList.find((holiday) => {
        return holiday.date.isAfter(now);
      });

      if (!nextPublicHoliday || nextSaturday.isBefore(nextPublicHoliday.date)) {
        setNextHoliday(nextSaturday);
      } else {
        setNextHoliday(nextPublicHoliday.date);
      }
    }
  }, [update, publicHolidayList]);

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
              <DisplayDate
                now={now}
                nextHoliday={nextHoliday}
                image={dateImage}
              />
            </Grid>
            <Grid item>
              <Calendar now={now} holidayList={publicHolidayList} />
            </Grid>
          </Grid>
        </Paper>
      </main>
    </Fragment>
  );
};

export default App;
