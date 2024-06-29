import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';

import { getPermissionGroups, getPermissionSummary } from '../../../../../../Services/axios/permissions';
import { getFilteredUserGroups } from '../../../../../../Services/axios/permissionsUsers';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { constructUrlSearchString } from '../../../utils/formatters';
import { customAccessLevelInfo, findDuplicatesInArray } from '../../../utils/helpers';

// Order of Precedence (https://simplyask.atlassian.net/wiki/spaces/SC/pages/1193410575/User+and+Permissions)
// 1. Direct Permissions
// 2. Permission Groups
// 3. User Groups

const reduceApiPermissionsToId = (apiPermissions) => apiPermissions.reduce((acc, value) => ({ ...acc, [value.permission.permissionAccessLevel]: value.id }), {});

const PermissionColumnCell = ({ ...props }) => {
  const { cell, table } = props;

  const { original } = cell.row;

  const { meta } = table.options;

  const tablePermissionIds = table.options.data.map((row) => row.id);

  const isUserGroupTab = meta.getUserGroupId() != null;
  const isPermissionGroupTab = meta.getPermissionGroupId() != null;

  const fullPermissionIds = meta.getPermissionIds();

  const cellPermissionId = `${original.id}`;

  const isDirectPermission = fullPermissionIds.permissionIds.some((id) => `${id}` === cellPermissionId);

  const permGroupUrlFilters = constructUrlSearchString({ permissionGroupIds: fullPermissionIds.permissionGroupIds });
  const userGroupUrlFilters = constructUrlSearchString({ userGroupIds: fullPermissionIds.userGroupIds });

  const parentPagePermissionId = original.pagePermission?.id;

  const { onShowAccessSettings } = table.options.meta;

  const cellAccessLevel = original.permission.permissionAccessLevel;

  const singlePagePermissionUrlParams = constructUrlSearchString({ permissionIds: parentPagePermissionId });

  const { data: apiAccessLevelAndId } = useQuery({
    queryKey: ['getAllPagePermissions', singlePagePermissionUrlParams],
    queryFn: () => getPermissionSummary(singlePagePermissionUrlParams),
    enabled: !!parentPagePermissionId && !!singlePagePermissionUrlParams,
    select: (data) => {
      const customInfo = customAccessLevelInfo(data);

      return {
        apiPermissions: reduceApiPermissionsToId(data.content[0].apiPermissions),
        customAccessLevelInfo: {
          ...customInfo,
          currentId: original.id,
          currentAccessLevel: cellAccessLevel,
          pagePermissionFeatures: customInfo.pagePermissionFeatures,
        },
      };
    },
  });

  const handleOpenCustomAccessLevel = () => {
    onShowAccessSettings(apiAccessLevelAndId?.customAccessLevelInfo);
  };

  const { data: permGroups, isSuccess: isPermissionGroupSuccess } = useQuery({
    queryKey: ['getPermGroupList', permGroupUrlFilters],
    queryFn: () => getPermissionGroups(permGroupUrlFilters),
    enabled: fullPermissionIds?.permissionGroupIds?.length > 0 && !isPermissionGroupTab,
    select: (data) => {
      const permGroupPermissionIds = data?.content?.reduce((acc, group) => [...acc, ...group.permissionIds], []);

      const matchedPermGroupPermissionIds = findDuplicatesInArray(permGroupPermissionIds, tablePermissionIds);

      const showInheritedFromPermissionGroup = matchedPermGroupPermissionIds?.includes(original.id);
      const permGroupNames = data?.content?.map((group) => group.name).join(', ');

      return {
        permGroupPermissionIds,
        matchedPermGroupPermissionIds,
        showInheritedFromPermissionGroup,
        permGroupNames,
      };
    },
  });

  const { data: userGroupNames, isSuccess: isUserGroupSuccess } = useQuery({
    queryKey: ['getUserGroupList', userGroupUrlFilters],
    queryFn: () => getFilteredUserGroups(userGroupUrlFilters),
    enabled: fullPermissionIds?.userGroupIds?.length > 0 && !isUserGroupTab,
    select: (data) => data?.content?.map((group) => group.name).join(', '),
  });

  return (
    <StyledFlex onClick={handleOpenCustomAccessLevel} cursor="pointer">
      <StyledText weight={600} lh={24} cursor="pointer">
        {cell.getValue()}
      </StyledText>
      {isPermissionGroupSuccess && permGroups?.showInheritedFromPermissionGroup && !isDirectPermission && (
        <StyledText size={14} lh={16} cursor="pointer">{`Inherited from ${permGroups?.permGroupNames}`}</StyledText>
      )}
      {isUserGroupSuccess && !permGroups?.showInheritedFromPermissionGroup && !isDirectPermission && (
        <StyledText size={14} lh={16} cursor="pointer">{`Inherited from ${userGroupNames}`}</StyledText>
      )}
    </StyledFlex>
  );
};

export default PermissionColumnCell;

PermissionColumnCell.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func,
    row: PropTypes.shape({
      original: PropTypes.shape({
        id: PropTypes.number,
        permission: PropTypes.shape({
          permissionId: PropTypes.string,
          permissionAccessLevel: PropTypes.string,
        }),
        pagePermission: PropTypes.shape({
          id: PropTypes.number,
        }),
        permissionGroups: PropTypes.arrayOf(PropTypes.string),
        userGroups: PropTypes.arrayOf(PropTypes.string),
      }),
    }),
  }),
  table: PropTypes.shape({
    options: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.object),
      meta: PropTypes.shape({
        getPermissionIds: PropTypes.func,
        getPermissionGroupId: PropTypes.func,
        getUserGroupId: PropTypes.func,
        getUserId: PropTypes.func,
        onShowAccessSettings: PropTypes.func,
      }),
    }),
  }),
};
