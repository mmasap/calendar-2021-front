import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const useStyles = makeStyles((theme) => ({
  calendar: { width: 'auto' },
}));

const Calendar = ({ holidayList }) => {
  const classes = useStyles();
  const [calendarDate, setCalendarDate] = useState(new Date());

  const getFormatDate = (date) => {
    return `${date.getFullYear()}${('0' + (date.getMonth() + 1)).slice(-2)}${(
      '0' + date.getDate()
    ).slice(-2)}`;
  };

  const getHoliday = (date) => {
    return holidayList.find(
      (holiday) => holiday.date.format('YYYYMMDD') === getFormatDate(date)
    );
  };

  const getTileClass = ({ date, view }) => {
    // 月表示のときのみ
    if (view !== 'month') return '';
    const holiday = getHoliday(date);
    return holiday ? 'react-calendar__month-view__days__day--weekend' : '';
  };

  //日付の内容を出力
  const getTileContent = ({ date, view }) => {
    // 月表示のときのみ
    if (view !== 'month') return null;
    const holiday = getHoliday(date);
    return (
      <Typography variant='caption' display='block'>
        {holiday ? holiday.name : '\u00a0'}
      </Typography>
    );
  };

  return (
    <ReactCalendar
      className={classes.calendar}
      calendarType='US'
      locale='ja-JP'
      onChange={setCalendarDate}
      value={calendarDate}
      tileClassName={getTileClass}
      tileContent={getTileContent}
      minDate={new Date('2021/01/01')}
      maxDate={new Date('2021/12/31')}
    />
  );
};

export default Calendar;
