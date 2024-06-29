import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import useOutsideClick from '../../../../../../hooks/useOutsideClick';
import { BLACKOUT_STATUS_INDEX, getStatusText, PROCESS_STATUSES_COLORS } from '../../../../../Managers/ProcessManager/ProcessManager';

import classes from './ProcessStatus.module.css';
import StatusDropDowns from './StatusDropDowns';

const BlackOutStatus = ({ status }) => (
  <div
    className={`${classes.blackout_root}
      ${classes.rectangleBG} 
      ${classes[status.toLowerCase().concat('_bg')]}`}
  >
    <div
      className={classes.rootChild}
    >
      <div className={`${classes.circle} ${classes[getStatusText(status).toLowerCase()]}`} />
      <div className={classes.blackout_statusText}>
        {getStatusText(status)}
      </div>
    </div>

  </div>
);
const ProcessStatus = ({
  status = '', setShowIsProcessStatusChanged, setClickedProcess, data,
}) => {
  const ref = useRef();

  const [showDropdownOptions, setShowDropdownOptions] = useState(false);
  const [isProcessBlackedOut, setIsProcessBlackedOut] = useState(false);

  useEffect(() => {
    if (PROCESS_STATUSES_COLORS[BLACKOUT_STATUS_INDEX]?.value === status)setIsProcessBlackedOut(true);
    else setIsProcessBlackedOut(false);
  }, [status]);

  useOutsideClick(ref, () => {
    if (showDropdownOptions) setShowDropdownOptions(false);
  });

  if (isProcessBlackedOut) {
    return <BlackOutStatus status={status} />;
  }

  return (
    <div
      className={`${classes.root}
      ${classes.rectangleBG} 
      ${classes[status.toLowerCase().concat('_bg')]}`}
      ref={ref}
    >
      <div
        className={classes.rootChild}
        // code below should be enabled after Zane enables multi statuses
        // onClick={() => setShowDropdownOptions(() => !showDropdownOptions)}
      >
        <div className={`${classes.circle} ${classes[getStatusText(status).toLowerCase()]}`} />
        <div className={classes.statusText}>
          {getStatusText(status)}
        </div>

      </div>

      {showDropdownOptions && (
        <StatusDropDowns
          setShowDropdownOptions={setShowDropdownOptions}
          setShowIsProcessStatusChanged={setShowIsProcessStatusChanged}
          setClickedProcess={setClickedProcess}
          data={data}
        />
      )}
    </div>
  );
};

export default ProcessStatus;

ProcessStatus.propTypes = {
  status: PropTypes.string,
  setShowIsProcessStatusChanged: PropTypes.func,
  setClickedProcess: PropTypes.func,
  data: PropTypes.object,
};

BlackOutStatus.propTypes = {
  status: PropTypes.string,
};
