import PropTypes from 'prop-types';

import CustomOption from '../customComponents/CustomOption/CustomOption';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import React from 'react';

const REVERT_OPTIONS = [
  { label: 'Revert Changes', value: null },
  { label: <span>Revert to Last Saved Version of MR Map</span>, value: null, type: 'reset' },
];

const RevertChangesDropdown = ({ onReset, versionDate }) => {
  return (
    <>
      <CustomSelect
        components={{ Option: CustomOption }}
        value={REVERT_OPTIONS[0]}
        isSearchable={false}
        options={REVERT_OPTIONS}
        reset={onReset}
        date={versionDate}
        closeMenuOnScroll
        openMenuOnClick
        menuPortalTarget={document.body}
        closeMenuOnSelect
        withSeparator
        filter
        mb={0}
      />
    </>
  );
};

export default RevertChangesDropdown;

RevertChangesDropdown.propTypes = {
  onReset: PropTypes.func,
  versionDate: PropTypes.string,
};
