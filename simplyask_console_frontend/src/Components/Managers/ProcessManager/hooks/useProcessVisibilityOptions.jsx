import { useEffect, useState } from 'react';
import useOrganizationUserGroups from '../../../../hooks/accessManagement/useOrganizationUserGroups';
import useOrganizationUsers from '../../../../hooks/accessManagement/useOrganizationUsers';
import { useGetCurrentUser } from '../../../../hooks/useGetCurrentUser';


export const VISIBILITY_OPTION_TYPE = {
  USER: 'USER',
  USER_GROUP: 'USER_GROUP',
  ADMIN: 'ADMIN',
};

export const ADMIN_SPECIFIC_OPTION = {
  label: 'Admin',
  value: 'ADMIN',
  type: VISIBILITY_OPTION_TYPE.ADMIN,
};

const useProcessVisibilityOptions = (value) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [visibilityOptions, setVisibilityOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: users, isFetching: isUsersFetching } = useOrganizationUsers();
  const { data: userGroups, isFetching: isUserGroupsFetching } = useOrganizationUserGroups();
  const { currentUser } = useGetCurrentUser();

  const getLabelByType = (item, type) => {
    let label = '';

    if (type === VISIBILITY_OPTION_TYPE.USER) {
      const isCurrentUser = item.id === currentUser.id;

      label = `${item.firstName} ${item.lastName} ${isCurrentUser ? '(You)' : ''}`.trim();
    } else {
      const isCurrentUserInGroup = !!currentUser.userGroups.find((group) => group.id === item.id);

      label = `${item.name} ${isCurrentUserInGroup ? '(You)' : ''}`.trim();
    }

    return label;
  };

  const mapToVisibilityOptions = (options, type) => {
    return options.map((option) => ({
      value: option.id,
      label: getLabelByType(option, type),
      type,
      original: option,
    }));
  };

  useEffect(() => {
    setIsLoading(isUserGroupsFetching || isUsersFetching);
  }, [isUserGroupsFetching, isUsersFetching]);

  useEffect(() => {
    if (users && userGroups) {
      setVisibilityOptions([
        ADMIN_SPECIFIC_OPTION,
        ...mapToVisibilityOptions(userGroups, VISIBILITY_OPTION_TYPE.USER_GROUP),
        ...mapToVisibilityOptions(users, VISIBILITY_OPTION_TYPE.USER),
      ]);
    }
  }, [users, userGroups]);

  useEffect(() => {
    if (visibilityOptions.length && value) {
      const usersOptions = visibilityOptions.filter((option) => option.type === VISIBILITY_OPTION_TYPE.USER);
      const userGroupsOptions = visibilityOptions.filter((option) => option.type === VISIBILITY_OPTION_TYPE.USER_GROUP);
      const selectedUsers = value.users
        .map((userId) => usersOptions.find((user) => user.value === userId))
        .filter(Boolean);
      const selectedUserGroups = value.userGroups
        .map((userGroupId) => userGroupsOptions.find((userGroup) => userGroup.value === userGroupId))
        .filter(Boolean);

      setSelectedOptions([ADMIN_SPECIFIC_OPTION, ...selectedUserGroups, ...selectedUsers]);
    }
  }, [visibilityOptions, value]);

  return {
    selectedOptions,
    visibilityOptions,
    isLoading,
  };
};

export default useProcessVisibilityOptions;
