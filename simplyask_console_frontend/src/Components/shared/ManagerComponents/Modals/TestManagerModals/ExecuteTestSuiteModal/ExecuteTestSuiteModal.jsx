import PropTypes from 'prop-types';
import { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useQuery } from '@tanstack/react-query';
import Select from 'react-select';

import CloseIcon from '../../../../../../Assets/icons/closeIcon.svg?component';
import { getEnvironments } from '../../../../../../Services/axios/environment';
import FormValidationMessage from '../../../../forms/FormValidationMessage/FormValidationMessage';
import CustomDropdownIndicator from './CustomDropdownIndicator';
import { customStyles } from './customStyles';
import css from './ExecuteTestSuiteModal.module.css';

const ExecuteTestSuiteModal = ({ onClose, onExecuteTestSuite }) => {
  const [env, setEnv] = useState('');

  const isValid = env !== '';

  const handleEnvironmentChange = (value) => {
    setEnv(value);
  };

  const handleExecuteTestSuite = (environment) => {
    onExecuteTestSuite(environment);
  };

  const handleCancel = () => {
    setEnv('');
    onClose();
  };

  const { data } = useQuery({
    queryKey: ['getEnvironments'],
    queryFn: getEnvironments,
  });

  const enviroments = data?.content?.map((env) => ({ id: env.name, name: env.name })) ?? [];

  return (
    <div className={css.execute_modal}>
      <header className={css.modal_header}>
        <h2 className={css.header_title}>Execute Test Suite</h2>
        <span className={css.header_close} onClick={handleCancel}>
          <CloseIcon className={css.closeIconSvg} />
        </span>
      </header>
      <Scrollbars style={{ height: isValid ? '160px' : '190px' }}>
        <div className={css.execute_content}>
          <label className={css.content_label}>Select Environment</label>
          <Select
            components={{ DropdownIndicator: CustomDropdownIndicator }}
            styles={customStyles}
            options={enviroments}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            value={env}
            onChange={handleEnvironmentChange}
            placeholder="Search for an environment..."
            closeMenuOnSelect
            isSearchable
            menuShouldBlockScroll={false}
            borderColor={!isValid ? '#E03B24' : null}
            menuPortalTarget={document.body}
          />
          {!isValid && <FormValidationMessage text="Selecting an environment is required in order to execute" />}
        </div>
        <div className={css.execute_action}>
          <button
            className={!isValid ? css['action_btn-disabled'] : css.action_btn}
            onClick={() => handleExecuteTestSuite(env.id)}
          >
            Execute
          </button>
        </div>
      </Scrollbars>
    </div>
  );
};

export default ExecuteTestSuiteModal;

ExecuteTestSuiteModal.propTypes = {
  onClose: PropTypes.func,
  onExecuteTestSuite: PropTypes.func,
};
