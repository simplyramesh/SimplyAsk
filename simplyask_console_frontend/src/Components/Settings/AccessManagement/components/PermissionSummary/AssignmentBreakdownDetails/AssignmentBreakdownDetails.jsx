import PropTypes from 'prop-types';

import {
  StyledAccordionDetails, StyledDivider, StyledFlex, StyledText,
} from '../../../../../shared/styles/styled';
import { USER_TYPE } from '../../ManagePermissionsTab/PermissionSettingsScheme';

const AssignmentBreakdownDetails = ({
  directData, userGroupData, permissionGroupData, mulitGroupData, groupType
}) => {
  const directRatio = !directData?.count || !directData?.total ? 0 : (`${directData?.count} / ${directData?.total}`);

  const userGroupRatio = !userGroupData?.count || !userGroupData?.total ? 0 : (`${userGroupData?.count} / ${userGroupData?.total}`);

  const permissionGroupRatio = !permissionGroupData?.count || !permissionGroupData?.total ? 0 : (`${permissionGroupData?.count} / ${permissionGroupData?.total}`);

  const multiGroupRatio = !mulitGroupData?.count || !mulitGroupData?.total ? 0 : (`${mulitGroupData?.count} / ${mulitGroupData?.total}`);

  return (
    <StyledAccordionDetails>
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="8px">
        <StyledText size={16} weight={600}>Directly Assigned Permissions</StyledText>
        <StyledText size={16} weight={400}>{directRatio}</StyledText>
      </StyledFlex>
      <StyledDivider />
      {groupType === USER_TYPE.USER ? (
        <>
        <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="8px" mt="8px">
          <StyledText size={16} weight={600}>Permissions Inherited from Associated User Groups</StyledText>
          <StyledText size={16} weight={400}>{userGroupRatio}</StyledText>
        </StyledFlex>
        <StyledDivider />
      </>
      ) : null}
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="8px" mt="8px">
        <StyledText size={16} weight={600}>Permissions Inherited from Associated Permission Groups</StyledText>
        <StyledText size={16} weight={400}>{permissionGroupRatio}</StyledText>
      </StyledFlex>
      {groupType === USER_TYPE.USER ? (
      <>
      <StyledDivider />
        <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="8px" mt="8px">
          <StyledText size={16} weight={600}>Permissions Inherited from Multiple Groups</StyledText>
          <StyledText size={16} weight={400}>{multiGroupRatio}</StyledText>
        </StyledFlex>
        </>
      ) : null}
    </StyledAccordionDetails>
  );
};

export default AssignmentBreakdownDetails;

AssignmentBreakdownDetails.propTypes = {
  directData: PropTypes.shape({
    count: PropTypes.number,
    total: PropTypes.number,
  }),
  userGroupData: PropTypes.shape({
    count: PropTypes.number,
    total: PropTypes.number,
  }),
  permissionGroupData: PropTypes.shape({
    count: PropTypes.number,
    total: PropTypes.number,
  }),
  mulitGroupData: PropTypes.shape({
    count: PropTypes.number,
    total: PropTypes.number,
  }),
};
