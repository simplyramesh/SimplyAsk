import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { StyledDivider, StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { formatDateMonthDayYear, textColor } from '../../../utils/formatters';
import {
  StyledGeneralTabEditButton,
  StyledGeneralTabSide,
  StyledGeneralTabSideContent,
  StyledGeneralTabSideContentItem,
  StyledGeneralTabSideHeader,
} from '../StyledGeneralTab';

const GeneralTabSide = ({
  onEdit, aboutGroup = '', name, description, count, createdDate, modifiedDate, isSuperAdmin,
}) => {
  const { colors } = useTheme();

  const createdAt = createdDate ? formatDateMonthDayYear(createdDate) : 'Date Created';
  const modifiedAt = modifiedDate ? formatDateMonthDayYear(modifiedDate) : 'Last Modified';

  return (
    <StyledGeneralTabSide>
      <StyledGeneralTabSideHeader>
        <StyledText as="h4" size={20} weight={600}>
          {`About ${aboutGroup} Group`}
        </StyledText>
        <StyledGeneralTabEditButton onClick={!isSuperAdmin && onEdit}>{!isSuperAdmin ? 'Edit' : ''}</StyledGeneralTabEditButton>
      </StyledGeneralTabSideHeader>

      <StyledGeneralTabSideContent>
        <StyledGeneralTabSideContentItem>
          <StyledText size={16} weight={600}>Name</StyledText>
          <StyledText size={16} weight={400}>{name}</StyledText>
        </StyledGeneralTabSideContentItem>
        <StyledDivider />

        <StyledGeneralTabSideContentItem>
          <StyledFlex width="35%">
            <StyledText size={16} weight={600}>Description</StyledText>
          </StyledFlex>
          <StyledFlex width="70%">
            <StyledText size={16} weight={400} lh={24} color={textColor(description, colors)} textAlign="end">
              {description || 'Description'}
            </StyledText>
          </StyledFlex>
        </StyledGeneralTabSideContentItem>
        <StyledDivider />
        {aboutGroup === 'Permission' && (
          <>
            <StyledGeneralTabSideContentItem>
              <StyledText size={16} weight={600}>Permissions</StyledText>
              <StyledText size={16} weight={400}>{count}</StyledText>
            </StyledGeneralTabSideContentItem>
            <StyledDivider />
          </>
        )}
        <StyledGeneralTabSideContentItem>
          <StyledText size={16} weight={600}>Date Created</StyledText>
          <StyledText size={16} weight={400} color={textColor(createdDate, colors)}>{createdAt}</StyledText>
        </StyledGeneralTabSideContentItem>
        <StyledDivider />

        <StyledGeneralTabSideContentItem>
          <StyledText size={16} weight={600}>Last Modified</StyledText>
          <StyledText size={16} weight={400} color={textColor(modifiedDate, colors)}>{modifiedAt}</StyledText>
        </StyledGeneralTabSideContentItem>
        {aboutGroup === 'User' && (
          <>
            <StyledDivider />
            <StyledGeneralTabSideContentItem>
              <StyledText size={16} weight={600}>Users</StyledText>
              <StyledText size={16} weight={400}>{count}</StyledText>
            </StyledGeneralTabSideContentItem>
          </>
        )}
      </StyledGeneralTabSideContent>
    </StyledGeneralTabSide>
  );
};

export default GeneralTabSide;

GeneralTabSide.propTypes = {
  onEdit: PropTypes.func,
  aboutGroup: PropTypes.oneOf(['User', 'Permission']),
  name: PropTypes.string,
  description: PropTypes.string,
  count: PropTypes.number,
  createdDate: PropTypes.string,
  modifiedDate: PropTypes.string,
  isSuperAdmin: PropTypes.bool,
};
