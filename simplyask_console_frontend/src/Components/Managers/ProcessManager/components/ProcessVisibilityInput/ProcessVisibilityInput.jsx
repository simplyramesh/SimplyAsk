import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import RadioGroupSet from '../../../../shared/REDISIGNED/controls/Radio/RadioGroupSet';
import { StyledFlex, StyledRadio, StyledText } from '../../../../shared/styles/styled';
import { PROCESS_VISIBILITY } from '../../constants/common';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import LoadingMessage from '../../../../Sell/shared/LoadingMessage';
import NoOptionsMessage from '../../../../Sell/shared/NoOptionsMessage';
import useProcessVisibilityOptions, { VISIBILITY_OPTION_TYPE } from '../../hooks/useProcessVisibilityOptions';
import Spinner from '../../../../shared/Spinner/Spinner';
import { useGetCurrentUser } from '../../../../../hooks/useGetCurrentUser';
import { useState } from 'react';
import { components } from 'react-select';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { StyledTooltip } from '../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import UserAvatar from '../../../../UserAvatar';
import { useTheme } from '@emotion/react';

const UserTemplate = ({ avatarColor, user, label }) => {
  return (
    <StyledFlex direction="row" alignItems="center" gap={1}>
      <UserAvatar size="25" customUser={user} color={avatarColor} />
      <StyledText size={15} lh={30}>
        {label}
      </StyledText>
    </StyledFlex>
  );
};

const UserGroupTemplate = ({ label }) => {
  return (
    <StyledText size={15} lh={30}>
      {label}
    </StyledText>
  );
};

const MultiValueLabel = (props) => {
  const { colors, currentUser } = props.selectProps;
  const { data } = props;
  const isCurrentUser = currentUser.id === data.value;

  const template =
    data.type === VISIBILITY_OPTION_TYPE.USER ? (
      <UserTemplate
        user={currentUser}
        label={data.label}
        avatarColor={isCurrentUser ? colors.secondary : colors.primary}
      />
    ) : (
      <UserGroupTemplate label={data.label} />
    );

  return <components.MultiValueLabel {...props} children={template}></components.MultiValueLabel>;
};

const Option = (props) => {
  const { colors, currentUser } = props.selectProps;
  const { data } = props;
  const isCurrentUser = currentUser.id === data.value;

  const template =
    data.type === VISIBILITY_OPTION_TYPE.USER ? (
      <UserTemplate
        user={currentUser}
        label={data.label}
        avatarColor={isCurrentUser ? colors.secondary : colors.primary}
      />
    ) : (
      <UserGroupTemplate label={data.label} />
    );

  return <components.Option {...props} children={template}></components.Option>;
};

const MultiValueRemove = (props) => {
  const isAdminType = props.data.type === VISIBILITY_OPTION_TYPE.ADMIN;

  if (isAdminType) {
    return (
      <StyledFlex alignSelf="center" mr="8px">
        <StyledTooltip
          size="14px"
          placement="top"
          arrow
          maxWidth="350px"
          title="Admin cannot be removed, as they will always have access to all processes"
        >
          <InfoOutlinedIcon fontSize="small" />
        </StyledTooltip>
      </StyledFlex>
    );
  }

  return <components.MultiValueRemove {...props}></components.MultiValueRemove>;
};

const ProcessVisibilityInput = ({ value, onChange }) => {
  const { colors } = useTheme();

  const visibility = value?.visibility;

  const [showConfirmSelfDeleteModal, setShowConfirmSetDeleteModal] = useState(false);

  const { visibilityOptions, selectedOptions, isLoading } = useProcessVisibilityOptions(value);
  const { currentUser } = useGetCurrentUser();

  const onUserVisibilityChange = (newValue) => {
    onChange(
      newValue.reduce(
        (acc, item) => {
          if (item.type === VISIBILITY_OPTION_TYPE.USER) {
            return {
              ...acc,
              users: [...acc.users, item.value],
            };
          } else if (item.type === VISIBILITY_OPTION_TYPE.USER_GROUP) {
            return {
              ...acc,
              userGroups: [...acc.userGroups, item.value],
            };
          } else {
            return acc;
          }
        },
        {
          users: [],
          userGroups: [],
          visibility: value?.visibility,
        }
      )
    );
  };

  const onVisibilityChange = (e) => {
    const visibilityType = e.target.value;

    onChange({
      users: visibilityType === PROCESS_VISIBILITY.ORGANIZATION ? [] : [currentUser.id],
      userGroups: [],
      visibility: visibilityType,
    });
  };

  return (
    <StyledFlex position="relative">
      {isLoading && <Spinner parent fadeBgParent medium />}
      <InputLabel size={16} lh={24} label="Visibility" />
      <StyledText size={14} lh={21}>
        Who can see this process in the Process Manager, open it in the Process Editor, select it and/or edit its fields
        in places like the Process Trigger and Agent Editor, and view its related data in places like the Process
        History and Fallout Tickets.
      </StyledText>

      <StyledFlex mt={1}>
        <RadioGroupSet value={visibility} onChange={onVisibilityChange}>
          <StyledRadio value={PROCESS_VISIBILITY.ORGANIZATION} label="Entire Organization" size={15} />
          <StyledRadio value={PROCESS_VISIBILITY.USER_SPECIFIC} label="Only Specific Users and User Groups" size={15} />
        </RadioGroupSet>
      </StyledFlex>

      {visibility === PROCESS_VISIBILITY.USER_SPECIFIC && (
        <StyledFlex mt={1.5} gap={2}>
          <StyledText size={15} lh={22}>
            <StyledText size="inherit" lh={22} display="inline-block" weight={600}>
              Note:&nbsp;
            </StyledText>
            Any added User or User Group that contains the text “(You)” means you are associated with it.
          </StyledText>
          <StyledFlex>
            <CustomSelect
              options={visibilityOptions}
              value={selectedOptions}
              isMulti
              isClearable={false}
              backspaceRemovesValue={false}
              form
              closeMenuOnSelect
              closeMenuOnScroll
              components={{
                MultiValueLabel,
                MultiValueRemove,
                Option,
                DropdownIndicator: () => null,
                LoadingMessage,
                NoOptionsMessage,
              }}
              menuPlacement="auto"
              onChange={(e) => onUserVisibilityChange(e)}
              menuPortalTarget={document.body}
              currentUser={currentUser}
              colors={colors}
            />
          </StyledFlex>
        </StyledFlex>
      )}

      <ConfirmationModal
        isOpen={showConfirmSelfDeleteModal}
        onCloseModal={() => {}}
        onSuccessClick={() => {}}
        alertType="WARNING"
        title="Are you sure?"
        text={`You are about to remove yourself from the process visibility. This could result it you losing access to the process`}
      />
    </StyledFlex>
  );
};

export default ProcessVisibilityInput;
