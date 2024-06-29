/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import React, { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

import Calendar from '../../../../../../Calendars/BlackoutPeriodCalendar/CalendarComponent';
import { CHANGE_PROCESS_MANAGER_MENUS } from '../../../SettingsSideDrawer';
import classes from './ManageBlackOutPeriods.module.css';

const ManageBlackOutPeriods = ({
  setActiveMenu,
  filterQuery,
  setFilterQuery,
  viewBackupFilters,
}) => {
  const [calendarNewText1, setCalendarNewText1] = useState('');
  const [calendarNewText2, setCalendarNewText2] = useState('');

  return (
    <div className={classes.root}>
      <div className={classes.backBtnRoot}>
        <KeyboardBackspaceIcon
          className={classes.backBtnIcon}
          onClick={() => setActiveMenu((prev) => ({
            ...prev,
            ...CHANGE_PROCESS_MANAGER_MENUS.PRIMARY_MENU,
          }))}
        />
        <div className={classes.viewTitle}>
          Manage Blackout Periods
        </div>
      </div>

      <Scrollbars className={classes.scrollBarRoot}>
        <div className={classes.scrollbarChild}>
          <div className={classes.calendarSectionRoot}>
            <div className={classes.calendarSectionTitle}>
              Set a Blackout Period
            </div>
          </div>
          <Calendar
            setStateFunction={setFilterQuery}
            stateValue={filterQuery}
            calendarNewText1={calendarNewText1}
            setCalendarNewText1={setCalendarNewText1}
            calendarNewText2={calendarNewText2}
            setCalendarNewText2={setCalendarNewText2}
            viewBackupFilters={viewBackupFilters}
          />

        </div>
      </Scrollbars>

    </div>
  );
};

export default ManageBlackOutPeriods;
