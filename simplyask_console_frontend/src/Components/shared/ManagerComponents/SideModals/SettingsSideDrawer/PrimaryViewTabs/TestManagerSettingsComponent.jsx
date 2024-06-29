import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PropTypes from 'prop-types';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Button } from 'simplexiar_react_components';

import { MANAGER_API_KEYS } from '../../../../../../config/managerKeys';
import { CHANGE_TEST_MANAGER_MENUS, HorizontalLine } from '../SettingsSideDrawer';
import classes from '../SettingsSideDrawer.module.css';

const TestManagerSettingsComponent = ({
  setActiveMenu,
  clickedProcess,
  onExecuteTestSuite,
}) => {
  return (
    <div className={classes.primary_menu_root}>
      <Scrollbars className={classes.scrollbarRoot} autoHide>
        <div className={classes.scrollbarChild}>
          <div className={classes.title}>Settings</div>

          <div className={classes.flex_cols_sideDrawerSettings}>
            <div className={`${classes.processTitlesRoot} 
        ${classes.nameAndDesc}`}
            >
              <div className={classes.title_style}>
                {clickedProcess?.[MANAGER_API_KEYS.DISPLAY_NAME] ?? '---'}
              </div>
              <div className={classes.descriptionText}>
                {clickedProcess?.[MANAGER_API_KEYS.DESCRIPTION] ?? '---'}

              </div>
            </div>

            <div
              className={`${classes.processTitlesRowRoot} 
        ${classes.all_sides_padding_15px}`}
              onClick={() => setActiveMenu(CHANGE_TEST_MANAGER_MENUS.EDIT_TEST_SUITE_DETAILS)}
            >
              <div className={classes.processTitlesRoot}>
                <div className={classes.title_style}>
                  Edit Test Suite Details
                </div>
                <div className={classes.descriptionText}>
                  View and edit details on this Test Suite, including its name, description, and tags
                </div>
              </div>
              <div className={classes.arrowRoot}>
                <KeyboardArrowRightIcon />
              </div>
            </div>
          </div>

          <HorizontalLine addMargin />

          <div className={classes.flex_cols_sideDrawerSettings}>
            <div
              className={`${classes.processTitlesRowRoot} 
        ${classes.all_sides_padding_15px}`}
              onClick={() => setActiveMenu(CHANGE_TEST_MANAGER_MENUS.VIEW_ALL_TEST_CASES)}
            >
              <div className={classes.processTitlesRoot}>
                <div className={classes.title_style}>
                  Manage All Test Cases

                </div>
              </div>
              <div className={classes.arrowRoot}>
                <KeyboardArrowRightIcon />
              </div>
            </div>
          </div>

          <HorizontalLine addMargin />

          <div className={classes.flex_cols_sideDrawerSettings}>
            <div
              className={`${classes.processTitlesRowRoot} 
        ${classes.all_sides_padding_15px}`}
              onClick={() => setActiveMenu(CHANGE_TEST_MANAGER_MENUS.ARCHIVE_OR_DELETE_TEST_SUITE)}
            >
              <div className={classes.processTitlesRoot}>
                <div className={classes.title_style}>
                  Archive or Delete Test Suite

                </div>
              </div>
              <div className={classes.arrowRoot}>
                <KeyboardArrowRightIcon />
              </div>
            </div>
          </div>

          <HorizontalLine addMargin />

          <Button
            className={`${classes.execute_test_suite_button}
          ${classes.margin_50px} 
          ${!clickedProcess?.[MANAGER_API_KEYS.TEST_CASE_COUNT] && classes.disableExecuteBtn}`}
            onClick={onExecuteTestSuite}
          >
            Execute Test Suite
          </Button>
          {!clickedProcess?.[MANAGER_API_KEYS.TEST_CASE_COUNT] && (
            <>
              <div className={classes.noCasesAvailableText}>
                To execute a test suite, you need at least
                {' '}
                <strong>1</strong>
                {' '}
                test case.
              </div>
              <div
                className={classes.createCaseRedirection}
                onClick={() => setActiveMenu(CHANGE_TEST_MANAGER_MENUS.VIEW_ALL_TEST_CASES)}
              >
                Create your first test case now
              </div>

            </>
          )}
        </div>

      </Scrollbars>

    </div>
  );
};

export default TestManagerSettingsComponent;

TestManagerSettingsComponent.propTypes = {
  onExecuteTestSuite: PropTypes.func,
  setActiveMenu: PropTypes.func,
  clickedProcess: PropTypes.object,
};
