import React from 'react';
import { StyledFlex, StyledText, StyledDivider } from '../../../../../../../styles/styled';
import { StyledButton } from '../../../../../../../REDISIGNED/controls/Button/StyledButton';
import { useTheme } from '@mui/system';
import EmptyTable from '../../../../../../../REDISIGNED/table-v2/EmptyTable/EmptyTable';
import Spinner from '../../../../../../../Spinner/Spinner';
import {
  capitalizeFirstLetterOfRegion,
  formatPhoneNumber,
  formatPhoneNumberCode,
} from '../../../../../../../../../utils/helperFunctions';

const PhoneNumberList = ({ filteredPhoneNumberIds, colors }) => {
  return filteredPhoneNumberIds.map((phoneNumberData, index) => (
    <StyledFlex key={phoneNumberData.telephoneNumberId}>
      <StyledFlex padding="15px 27px">
        <StyledFlex direction="row" alignItems="center">
          <StyledFlex flex={1}>
            <StyledText weight={600}>{formatPhoneNumber(phoneNumberData.phoneNumber)}</StyledText>
            <StyledText weight={400} mt={2} p="0 35px 0 0" maxLines={2}>
              {phoneNumberData.country} {formatPhoneNumberCode(phoneNumberData.phoneNumber)}, {phoneNumberData.province}
              , {capitalizeFirstLetterOfRegion(phoneNumberData.region)}
            </StyledText>
          </StyledFlex>
        </StyledFlex>
      </StyledFlex>
      {index !== filteredPhoneNumberIds.length - 1 && (
        <StyledDivider borderWidth={1} color={colors.cardGridItemBorder} />
      )}
    </StyledFlex>
  ));
};

const PhoneNumberTab = ({ setIsAddPhoneNumberModalOpen, filteredPhoneNumberIds, loading }) => {
  const { colors } = useTheme();

  return (
    <>
      <StyledFlex padding="30px 20px 30px 27px" direction="row" justifyContent="space-between">
        <StyledText weight={600} size={19}>
          Assigned Phone Numbers
        </StyledText>
        <StyledButton
          primary
          variant="contained"
          tertiary
          fontSize={16}
          onClick={() => setIsAddPhoneNumberModalOpen(true)}
        >
          Add Numbers
        </StyledButton>
      </StyledFlex>
      <StyledDivider borderWidth={1} color={colors.primary} />

      {loading ? (
        <Spinner medium inline />
      ) : filteredPhoneNumberIds && filteredPhoneNumberIds?.length > 0 ? (
        <PhoneNumberList filteredPhoneNumberIds={filteredPhoneNumberIds} colors={colors} />
      ) : (
        <StyledFlex alignItems="center" justifyContent="center" textAlign="center">
          <EmptyTable customTitle="There Are No Phone Numbers Assigned" />
        </StyledFlex>
      )}
    </>
  );
};

export default PhoneNumberTab;
