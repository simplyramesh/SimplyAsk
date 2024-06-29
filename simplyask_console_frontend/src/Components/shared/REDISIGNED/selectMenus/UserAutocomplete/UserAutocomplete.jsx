import { useTheme } from '@mui/material/styles';
import React from 'react';
import AsyncSelect from 'react-select/async';
import { useRecoilValue } from 'recoil';

import { defaultUsers } from '../../../../../store';
import CustomDropdownIndicator from '../../../ManagerComponents/Modals/TestManagerModals/ExecuteTestSuiteModal/CustomDropdownIndicator';
import { ControlWithAvatar, OptionWithAvatar } from '../customComponents/controls/UserAutocompleteControls';
import { filterStyles } from '../CustomSelect';
import { customStyles } from '../customStyles';
import { promiseOptions } from './helpers';
import { autocompleteWithAvatarStyles, formAutocompleteSelect } from './styles';

const UserAutocomplete = ({ defaultOptions, ...rest }) => {
  const theme = useTheme();
  const users = useRecoilValue(defaultUsers);

  return (
    <AsyncSelect
      defaultOptions={defaultOptions || users}
      loadOptions={promiseOptions}
      isClearable
      menuPortalTarget={document.body}
      menuPlacement="auto"
      customTheme={theme}
      {...rest}
    />
  );
};

export const UserAutocompleteWithAvatar = (props) => {
  return (
    <UserAutocomplete
      components={{
        Option: OptionWithAvatar,
        Control: ControlWithAvatar,
        DropdownIndicator: null,
      }}
      styles={autocompleteWithAvatarStyles}
      {...props}
    />
  );
};

export const UserAutocompleteForm = (props) => {
  return (
    <UserAutocomplete
      components={{
        Option: OptionWithAvatar,
        DropdownIndicator: CustomDropdownIndicator,
        Control: ControlWithAvatar,
      }}
      styles={{
        ...autocompleteWithAvatarStyles,
        ...formAutocompleteSelect,
      }}
      withSeparator
      {...props}
    />
  );
};

export const UserAutocompleteFilter = (props) => {
  return (
    <UserAutocomplete
      components={{
        Option: OptionWithAvatar,
        DropdownIndicator: CustomDropdownIndicator,
      }}
      styles={{ ...customStyles, ...filterStyles }}
      withSeparator
      {...props}
    />
  );
};

UserAutocompleteWithAvatar.propTypes = AsyncSelect.propTypes;
UserAutocomplete.propTypes = AsyncSelect.propTypes;
