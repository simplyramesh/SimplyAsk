import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';

import { useGetEnvironments } from '../../../../hooks/environments/useGetEnvironments';
import { getEnvironments } from '../../../../Services/axios/environment';
import { DEFAULT_NO_ENV_OPTION_NAME } from '../../../Settings/Components/EnvironmentsAndParameters/constants/constants';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CenterModalFixed from '../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import CustomIndicatorArrow from '../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';
import { TEST_MANAGER_LABELS } from '../constants/constants';

const TestExecuteModal = ({
  open, onClose, rows = [], onExecute, isReexcution = false,
}) => {
  const { data } = useGetEnvironments();

  const environmentsOptions = data?.content?.length ? data.content : [DEFAULT_NO_ENV_OPTION_NAME];

  const [environment, setEnvironment] = useState(environmentsOptions[0]);
  const actionLabel = isReexcution ? 'Re-Execute' : 'Execute';

  const environmentSearchFn = debounce((value, setOptions) => {
    getEnvironments(`searchText=${value}`).then((resp) => setOptions(resp.content));
  }, 300);

  const getTitle = () => {
    if (rows.length === 1 && rows[0] !== null && rows[0] !== undefined) {
      const { type } = rows[0];
      return `${actionLabel} ${TEST_MANAGER_LABELS[type]}`;
    }

    return `${actionLabel} Records`;
  };

  useEffect(() => {
    setEnvironment(environmentsOptions[0]);
  }, [environmentsOptions]);

  return (
    <CenterModalFixed
      title={getTitle()}
      open={open}
      onClose={onClose}
      maxWidth="510px"
      footerShadow={false}
      actions={(
        <StyledFlex direction="row" justifyContent="flex-end" width="100%" gap="10px">
          <StyledButton
            primary
            variant="outlined"
            onClick={onClose}
          >
            Cancel
          </StyledButton>
          <StyledButton
            primary
            variant="contained"
            disabled={!environment}
            onClick={() => onExecute(environment.envName)}
          >
            {actionLabel}
          </StyledButton>
        </StyledFlex>
      )}
    >
      <StyledFlex p="24px">
        { rows?.length > 1 && (
          <StyledText mb={12} lh={22}>
            You are about to
            {' '}
            {actionLabel.toLowerCase()}
            <StyledText display="inline-block" weight={600}>
              &nbsp;
              {rows.length}
&nbsp;
            </StyledText>
            records
          </StyledText>
        )}
        <InputLabel size={18} lh={24} label="Select Environment to Execute In" />
        <StyledText mb={16}>
          The chosen environment impacts the parameters values of the associated parameter sets
        </StyledText>
        <CustomSelect
          defaultOptions={environmentsOptions || []}
          isAsync
          loadOptions={environmentSearchFn}
          placeholder="Search for an environment..."
          value={environment}
          closeMenuOnSelect
          closeMenuOnScroll
          getOptionLabel={(option) => option.envName}
          getOptionValue={(option) => option.envName}
          onChange={(val) => setEnvironment(val)}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
          }}
          maxHeight={30}
          menuPadding={0}
          menuPlacement="auto"
          menuPortalTarget={document.body}
          withSeparator
          form
        />
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default TestExecuteModal;
