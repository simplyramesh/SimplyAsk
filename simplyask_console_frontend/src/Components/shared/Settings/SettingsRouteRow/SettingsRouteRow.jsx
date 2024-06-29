import 'react-slidedown/lib/slidedown.css';

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { SlideDown } from 'react-slidedown';

import dropdownIconPng from '../../../../Assets/icons/dropdownIconPng.png';
import dropdownUpIconPng from '../../../../Assets/icons/dropdownUpIconPng.png';
import FallBackComponent from '../../FallBackComponent/FallBackComponent';

import classes from './SettingsRouteRow.module.css';

export const SETTINGS_ROUTES_KEYS = {
  showComponent: 'showComponent',
  firstProp: 'firstProp',
  id: 'id',
};

export const PROPS_VALUES = {
  showOnlyConfigurationProfileCard: 'showOnlyConfigurationProfileCard',
  showOnlyServiceTicketDetails: 'showOnlyServiceTicketDetails',
};

const SettingsRouteRow = ({
  data = [],

}) => {
  const [slideDownStates, setSlideDownStates] = useState([]);
  useEffect(() => {
    if (data) {
      const modifiedData = data.map((item, index) => ({ ...item, id: index }));

      setSlideDownStates(modifiedData);
    }
  }, [data]);

  return (
    <div className={classes.root}>
      {slideDownStates.map((item) => {
        const GetComponent = item.component ?? FallBackComponent;

        const handleRowClick = () => {
          const findObject = slideDownStates.map((rowItem) => {
            if (rowItem.title === item.title) {
              rowItem[SETTINGS_ROUTES_KEYS.showComponent] = !rowItem[SETTINGS_ROUTES_KEYS.showComponent];
            }
            return rowItem;
          });
          setSlideDownStates(findObject);
        };

        return (
          <div
            className={classes.flex_row_root}
            key={item.id}
          >
            <div className={classes.flex_row} onClick={handleRowClick}>
              <div className={classes.relativeImg}>
                <img src={item.icon} alt="" className={classes.absoluteImg} />
              </div>
              <div className={`${classes.flex_row_between}`}>
                <div className="">
                  <div className={classes.title}>
                    {item.title}
                  </div>
                  <div className={classes.body}>
                    <span className={classes.orangeText}>
                      {item.orangeText && `${item.orangeText} `}
                    </span>
                    {item.body}
                  </div>

                </div>

                <div className={classes.arrowRoot}>
                  <img
                    src={item[SETTINGS_ROUTES_KEYS.showComponent]
                      ? dropdownUpIconPng
                      : dropdownIconPng}
                    alt=""
                    className={classes.icon}
                  />
                </div>

              </div>
            </div>
            <SlideDown>
              {item[SETTINGS_ROUTES_KEYS.showComponent]
              && (
                <div className={classes.component}>
                  <GetComponent
                    showOnlyConfigurationProfileCard={item[SETTINGS_ROUTES_KEYS.firstProp]
                     === PROPS_VALUES.showOnlyConfigurationProfileCard}
                    showOnlyServiceTicketDetails={item[SETTINGS_ROUTES_KEYS.firstProp]
                    === PROPS_VALUES.showOnlyServiceTicketDetails}
                  />
                </div>
              )}
            </SlideDown>
          </div>
        );
      })}
    </div>
  );
};

export default SettingsRouteRow;

SettingsRouteRow.propTypes = {
  data: PropTypes.array,

};
