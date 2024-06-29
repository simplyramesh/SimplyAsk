import PropTypes from 'prop-types';
import React from 'react';

import styles from './ReportingMails.module.css';

const ReportingMails = ({ mails, full = false }) => {
  const emailsLimit = full ? mails.length : 2;
  const coupleMails = mails.slice(0, emailsLimit);

  return (
    <div className={`${styles.ReportingMails} ${full && styles.fullWidth}`} title={mails.join('\r\n')}>
      {coupleMails.map((mail) => <div key={mail} className={styles.ReportingMailsItem}>{mail}</div>)}
      {(mails.length > emailsLimit) && (
        <b className={styles.ReportingMailsItem}>
          <span>
            +
            {mails.length - emailsLimit}
            {' '}
            More
          </span>
        </b>
      )}
    </div>
  );
};

export default ReportingMails;

ReportingMails.propTypes = {
  mails: PropTypes.arrayOf(PropTypes.string),
  full: PropTypes.bool,
};
