/* eslint-disable no-unused-vars */
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import { getUserGroupsWithFilters } from '../../../../../Services/axios/permissionsUserGroups';
import { getUserGroupPermissionsById, getUserPermissionsById } from '../../../../../Services/axios/permissionsUsers';
import {
  StyledCard,
  StyledDivider,
  StyledFlex,
  StyledMediumDivider,
  StyledText,
} from '../../../../shared/styles/styled';
import { constructUrlSearchString } from '../../utils/formatters';
import CardGroupsHeader from '../CardGroupsHeader/CardGroupsHeader';

import AccessBreakdownDetails from './AccessBreakdownDetails/AccessBreakdownDetails';
import AssignmentBreakdownDetails from './AssignmentBreakdownDetails/AssignmentBreakdownDetails';
import PermissionSummaryAccordion from './PermissionSummaryAccordion/PermissionSummaryAccordion';
import { StyledPermissionSummaryItem } from './StyledPermissionSummary';
import { getPermissionSummary } from '../../../../../Services/axios/permissions';
import { ACCESS_LEVEL, USER_TYPE } from '../ManagePermissionsTab/PermissionSettingsScheme';
import { useGetGroupPermissions } from '../../../../../hooks/accessManagement/useGetGroupPermissions';

const requestSelector = (groupType, param) => {
  switch (groupType) {
  case 'user':
    return getUserPermissionsById(param);
  case 'userGroup':
    return getUserGroupPermissionsById(param);
  default:
    return null;
  }
};

const selectPermissionsSummary = (data) => {
  const fullAccessPermissionCount = data?.content?.filter((item) => item?.permission?.permissionAccessLevel === ACCESS_LEVEL.WRITE)?.length || 0;
  const viewOnlyPermissionCount = data?.content?.filter((item) => item?.permission?.permissionAccessLevel === ACCESS_LEVEL.READ)?.length || 0;
  const customAccessPermissionCount = data?.content?.filter((item) => item?.permission?.permissionAccessLevel === ACCESS_LEVEL.CUSTOM)?.length || 0;
  const totalPermissionCount = data?.content?.filter((item) => item?.permission?.permissionType === ACCESS_LEVEL.PAGE_PERMISSION)?.length || 0;

  return {
    FULL_ACCESS: fullAccessPermissionCount,
    VIEW_ONLY: viewOnlyPermissionCount,
    CUSTOM_ACCESS: customAccessPermissionCount,
    TOTAL_PERMISSION_COUNT: totalPermissionCount,
    TOTAL_USER_GROUP_PERMISSIONS: data?.totalElements || 0,
  };
};

/* NOTE: BE will probably have to implement a cleaner solution for this
 * currently, to get all the required information, we have to make several requests and then cross-reference the data
 * first, must get either the user or userGroup permissions
 * then, must make an api request for each permissionIds, permissionGroupIds, and userGroupIds array
 * then, must cross-reference the permissions with the permissionGroups and userGroups to determine which are inherited
 * because BE sends both the directly assigned and inherited at the same time if say, userIds: [id] and
 * permissionGroupIds: [1,3,4] are sent to permissions/filter? endpoint, so must send one at a time and filter
 * accordingly, i.e. check direct permissions against permission group permissions, then check permissions against user
 * group permissions, then check permission group permissions against user group permissions (inherited from multiple
 * groups)
 *
 */
const PermissionSummary = ({ groupType, onPermissions }) => {
  const { id } = useParams();

  const { data: permissions, isSuccess: isGetPermissionsSuccess } = useQuery({
    queryKey: [`get${groupType}Permissions`, groupType, id],
    queryFn: () => requestSelector(groupType, id),
    enabled: !!groupType && !!id,
    select: (data) => {
      const numDirectlyAssigned = data?.permissionIds?.length || 0;
      const numberOfPermissionGroups = data?.permissionGroupIds?.length || 0;

      return {
        ...data,
        userGroupIdParam:
          data?.userGroupIds?.length > 0
            ? constructUrlSearchString({ userGroupIds: data?.userGroupIds, pageSize: '500' })
            : null,
        permissionGroupIdParam:
          data?.permissionGroupIds?.length > 0
            ? constructUrlSearchString({ permissionGroupIds: data?.permissionGroupIds, pageSize: '500' })
            : null,
        DIRECT_ASSIGNED: numDirectlyAssigned,
        PERMISSION_GROUP_COUNT: numberOfPermissionGroups,
      };
    },
  });

  const { data: roles } = useQuery({
    queryKey: [`get${groupType}Roles`, id],
    queryFn: () => getUserGroupsWithFilters(id),
    enabled: groupType !== USER_TYPE.USER_GROUP && !!id && isGetPermissionsSuccess,
    select: (data) => data?.content?.map((item) => item.name).join(', '),
  });


  const { data: userGroupSummary } = useGetGroupPermissions({
    uniqueKey: `get${groupType}PermissionsSummary`,
    paramsId: id,
    queryFn: () => getPermissionSummary(constructUrlSearchString({ permissionIds: permissions?.permissionIds })),
    enabled: isGetPermissionsSuccess && !!id,
    select: (data) => ({
      ...selectPermissionsSummary(data),
      ...permissions,
    }),
  })


  const { data: permissionGroupSummary } = useGetGroupPermissions({
    uniqueKey: `get${groupType}PermissionsSummary`,
    paramsId: id,
    queryFn: () => getPermissionSummary(constructUrlSearchString({ permissionGroupIds: permissions?.permissionGroupIds })),
    enabled: isGetPermissionsSuccess && permissions?.permissionGroupIds?.length > 0,
    select: (data) => ({
      ...selectPermissionsSummary(data),
      ...permissions,
    }),
  })

  // user
  const fullAccessCount = userGroupSummary?.FULL_ACCESS;
  const readAccessCount = userGroupSummary?.VIEW_ONLY;
  const customAccessCount = userGroupSummary?.CUSTOM_ACCESS;

  // user groups
  // special roles

  // permission groups
  const numPermissionGroups = permissions?.permissionGroupIds?.length || 0; // associated permission groups

  // total permissions
  const totalPermissions = userGroupSummary?.TOTAL_PERMISSION_COUNT || 0;

  const fullData = {
    count: fullAccessCount,
    total: userGroupSummary?.TOTAL_PERMISSION_COUNT,
  };
  const viewOnlyData = {
    count: readAccessCount,
    total: userGroupSummary?.TOTAL_PERMISSION_COUNT,
  };
  const customData = {
    count: customAccessCount,
    total: userGroupSummary?.TOTAL_PERMISSION_COUNT,
  };

  return (
    // <StyledFlex>
    <StyledCard>
      <CardGroupsHeader association="SUMMARY" onManage={onPermissions} />
      <StyledFlex mb="24px">
        <StyledFlex p="0 8px 0 10px">
          <StyledPermissionSummaryItem>
            <StyledText size={16} weight={600}>
              Total Permissions
            </StyledText>
            <StyledText size={16} weight={400}>
              {totalPermissions}
            </StyledText>
          </StyledPermissionSummaryItem>
        </StyledFlex>
        <StyledDivider />

        <StyledFlex p="0 8px 0 10px">
          <StyledPermissionSummaryItem>
            <StyledText size={16} weight={600}>
              Number of Associated Permission Groups
            </StyledText>
            <StyledText size={16} weight={400}>
              {numPermissionGroups}
            </StyledText>
          </StyledPermissionSummaryItem>
        </StyledFlex>

        {groupType !== 'userGroup'
          && (
            <>
              <StyledDivider />

              <StyledFlex p="0 8px 0 10px">
                <StyledPermissionSummaryItem>
                  <StyledText size={16} weight={600}>
                    {groupType === 'user' ? 'User Groups'
                      : 'Associated Special Roles'}
                  </StyledText>
                  <StyledText size={16} weight={400}>
                    {roles || 'None'}
                  </StyledText>
                </StyledPermissionSummaryItem>
              </StyledFlex>
            </>
          )}
      </StyledFlex>
      <StyledMediumDivider />

      <PermissionSummaryAccordion title="Access">
        <AccessBreakdownDetails fullData={fullData} viewOnlyData={viewOnlyData} customData={customData} />
      </PermissionSummaryAccordion>
      <StyledMediumDivider />

      <PermissionSummaryAccordion title="Assignment">
        <AssignmentBreakdownDetails
          directData={{ count: userGroupSummary?.TOTAL_PERMISSION_COUNT, total: 100 }}
          permissionGroupData={{ count: permissionGroupSummary?.TOTAL_PERMISSION_COUNT, total: 100 }}
          groupType={groupType}
        />
      </PermissionSummaryAccordion>
    </StyledCard>
    // </StyledFlex>
  );
};

export default PermissionSummary;

PermissionSummary.propTypes = {
  groupType: PropTypes.string,
  onPermissions: PropTypes.func,
};
