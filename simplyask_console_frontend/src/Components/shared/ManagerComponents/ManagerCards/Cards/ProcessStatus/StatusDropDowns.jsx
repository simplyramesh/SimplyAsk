import PropTypes from 'prop-types';
import React from 'react';
import { toast } from 'react-toastify';

import { MANAGER_API_KEYS } from '../../../../../../config/managerKeys';
import { BLACKOUT_STATUS_INDEX, PROCESS_STATUSES_COLORS } from '../../../../../Managers/ProcessManager/ProcessManager';
import classes from './ProcessStatus.module.css';

function StatusDropDowns({
  setShowDropdownOptions,
  setShowIsProcessStatusChanged,
  setClickedProcess,
  data,
}) {
  const handleStatusClick = (item) => {
    if (item.value === data[MANAGER_API_KEYS.STATUS]) {
      toast.warning(`${item.label} status has already been selected`);
      return;
    }

    setClickedProcess(() => data);
    setShowIsProcessStatusChanged({ showModal: true, value: item });
    setShowDropdownOptions();
  };

  return (
    <div className={classes.dropdown_root}>
      <div className={classes.statusColorRoot}>
        {PROCESS_STATUSES_COLORS
          .filter((item) => item.value !== PROCESS_STATUSES_COLORS[BLACKOUT_STATUS_INDEX].value)
          .map((item, index) => {
            return (
              <div
                className={`${classes.labelRoot} 
              ${classes[item.label.toLowerCase().concat('_label_hover')]}
              ${item.value === data[MANAGER_API_KEYS.STATUS] && classes[item.label.toLowerCase().concat('_activated')]}`}
                onClick={() => handleStatusClick(item)}
                key={index}
              >
                <div className={`${classes.circle_dropdown} ${classes.margin_left_12px}
               ${classes[item.label.toLowerCase()]}`}
                />
                <div className={classes.statusText_dropdown}>{item.label}</div>

              </div>
            );
          })}
      </div>
    </div>
  );
}

export default StatusDropDowns;

StatusDropDowns.propTypes = {
  setShowDropdownOptions: PropTypes.func,
  setShowIsProcessStatusChanged: PropTypes.func,
  setClickedProcess: PropTypes.func,
  data: PropTypes.object,
};
