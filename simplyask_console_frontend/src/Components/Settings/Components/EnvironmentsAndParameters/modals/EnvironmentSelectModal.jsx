import { debounce } from 'lodash';
import React, { useState } from 'react';
import CenterModalFixed from '../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import { useGetEnvironments } from '../../../../../hooks/environments/useGetEnvironments';
import { getEnvironments } from '../../../../../Services/axios/environment';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { useTheme } from '@mui/material';

const EnvironmentSelectModal = ({
  open, onClose, onConfirm, selectedEnvironments = [],
}) => {
  const { colors } = useTheme();
  const filterSelectedEnvFn = (env) => !selectedEnvironments.includes(env.envName);

  const { data, isLoading } = useGetEnvironments();

  const environmentsOptions = data?.content.filter(filterSelectedEnvFn) || [];

  const [environment, setEnvironment] = useState(environmentsOptions[0]);

  const environmentSearchFn = debounce((value, setOptions) => {
    getEnvironments(`searchText=${value}`)
      .then((resp) => resp.content.filter(filterSelectedEnvFn))
      .then((resp) => setOptions(resp));
  }, 300);


  if (environmentsOptions.length === 0 && !isLoading) {
    return (
      <ConfirmationModal
        isOpen={open}
        onCloseModal={onClose}
        onSuccessClick={onClose}
        hideCancelBtn
        successBtnText="Close"
        alertType="WARNING"
        title="There Are No Environments"
      >
        <StyledText size={14} lh={21} textAlign="center">
          There are no environments available to add.
          <StyledText
            size={14}
            lh={21}
            display="inline-block"
            color={colors.linkColor}
            weight={500}
            cursor="pointer"
            onClick={() => window.open('../BackOffice', '_blank')}
          >
            &nbsp;Click here&nbsp;
          </StyledText>
          to open the Environment table in a new tab, where you can create a new one.
        </StyledText>
      </ConfirmationModal>
    )
  }

  return (
    <CenterModalFixed
      title="Add Environment"
      open={open}
      onClose={onClose}
      maxWidth="480px"
      footerShadow={false}
      actions={(
        <StyledFlex direction="row" justifyContent="flex-end" width="100%" gap="10px">
          <StyledButton
            primary
            variant="contained"
            disabled={!environment}
            onClick={() => onConfirm(environment.envName)}
          >
            Confirm
          </StyledButton>
        </StyledFlex>
      )}
    >
      <StyledFlex p="24px">
        <InputLabel label="Select Environment" />
        <CustomSelect
          defaultOptions={environmentsOptions}
          isAsync
          loadOptions={environmentSearchFn}
          placeholder="Select Environment"
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

export default EnvironmentSelectModal;
