import { useTheme } from '@emotion/react';

import { useGetUserById } from '../../../../hooks/useUserById';
import { BASE_DATE_TIME_FORMAT, getInFormattedUserTimezone } from '../../../../utils/timeUtil';
import { Skeleton } from '@mui/material';
import { StyledFlex, StyledText } from '../../styles/styled';
import UserAvatar from '../../../UserAvatar';

const DateAndUserName = ({ timeStamp, userName, currentUser }) => {
  const { colors } = useTheme();
  const { userInfo, isUserFetching } = useGetUserById(userName, { enabled: !!userName });

  const splitName = userInfo?.fullname?.split(' ');
  let customUser = { firstName: userInfo?.fullname };

  if (splitName?.length > 1) {
    customUser = { firstName: splitName[0], lastName: splitName[splitName.length - 1] };
  }

  return (
    <StyledFlex width="100%" direction="row" gap="6px" display="flex" alignItems="center">
      <StyledFlex>
        <StyledText>
          {getInFormattedUserTimezone(timeStamp, currentUser?.timezone, BASE_DATE_TIME_FORMAT)} by
        </StyledText>
      </StyledFlex>
      {isUserFetching ? (
        <Skeleton variant="rounded" width={350} height={28} />
      ) : (
        <StyledFlex direction="row" gap="6px" width="60%">
          <StyledFlex ml="8px">
            <UserAvatar customUser={customUser} size={28} color={colors.primary} />
          </StyledFlex>

          <StyledFlex>
            <StyledText maxLines={1} weight={400}>
              {userInfo?.fullname || 'Unknown User'}
            </StyledText>
          </StyledFlex>
        </StyledFlex>
      )}
    </StyledFlex>
  );
};

export default DateAndUserName;
