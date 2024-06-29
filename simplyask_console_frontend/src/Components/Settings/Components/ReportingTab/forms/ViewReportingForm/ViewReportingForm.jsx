import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Button } from 'simplexiar_react_components';

import { taskTypesMap } from '../../../../../../utils/reporting';
import classes from '../../../../../Catalog/SubForms/SubForm.module.css';
import buttons from '../../../../../shared/styles/buttons.module.css';
import forms from '../../../../../shared/styles/forms.module.css';
import ReportingMails from '../../ReportingMails/ReportingMails';

const ViewReportingForm = ({ item, onEdit }) => {
  const {
    name, schedulerTaskType, parameters, createdAt, sendingFrequency, dateNewReport,
  } = item;

  return (
    <div className={forms.form}>
      <div className={forms.header}>
        <div className={forms.headerItem}>
          <b>Report Creation Date</b>
          <span>{moment(createdAt).format('YYYY-MM-DD')}</span>
        </div>
        <div className={forms.headerItem}>
          <b>Date Next Report is Sent</b>
          <span>{dateNewReport}</span>
        </div>
      </div>
      <Scrollbars className={classes.scrollbars}>

        <div className={forms.body}>
          <div className={forms.fieldset}>
            <label className={forms.label}>Report name</label>
            <div>{name.name}</div>
          </div>
          <div className={forms.fieldset}>
            <label className={forms.label}>Workflow name</label>
            <div>{taskTypesMap[schedulerTaskType]}</div>
          </div>
          <div className={forms.fieldset}>
            <label className={forms.label}>Email Addresses</label>

            <ReportingMails full mails={parameters.reportTo} />

          </div>

          <div className={forms.fieldset}>
            <label className={forms.label}>Sending Frequency</label>
            <div>{sendingFrequency.time}</div>
            <div>{sendingFrequency.rest}</div>
          </div>

          <div className={forms.fieldset}>
            <label className={forms.label}>Number of Previous Days Data Points Included in the Report</label>

            <span>
              {(parameters?.reportDaysToInclude > 0) ? (`${parameters?.reportDaysToInclude} Days`) : ('All')}
            </span>
          </div>
        </div>
      </Scrollbars>

      <div className={forms.footer}>
        <Button
          color="primary"
          className={buttons.formButton}
          onClick={() => onEdit(item)}
        >
          Edit
        </Button>
      </div>
    </div>
  );
};

export default ViewReportingForm;

ViewReportingForm.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.shape({
      name: PropTypes.string,
    }),
    schedulerTaskType: PropTypes.string,
    parameters: PropTypes.shape({
      reportTo: PropTypes.arrayOf(PropTypes.string),
      reportDaysToInclude: PropTypes.number,
      countOfRecords: PropTypes.number,
    }),
    createdAt: PropTypes.string,
    sendingFrequency: PropTypes.shape({
      time: PropTypes.string,
      rest: PropTypes.string,
    }),
    dateNewReport: PropTypes.string,
  }),
  onEdit: PropTypes.func,
};
