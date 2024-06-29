import React from 'react';

import { singleExecutionModalKeys } from '../../../../../../../../config/ProcessDesignerKeys';
import CustomSidebar from '../../../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import SearchBar from '../../../../../../../shared/SearchBar/SearchBar';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';
import { CRITERIA_FIELDS } from '../../../../../../utils/constants';

const ExpectedColumnsSideBar = ({
  openExpectedColumnsSideBar,
  closeExpectedColumnsSideBar,
  colors,
  values,
  searchBarHandler,
  searchableColumns,
  editModeData,
}) => {
  const renderDataTypeLabelAndExample = (field, column) => {
    const validationType = field.fieldValidationType;
    const validationTypeData = Object.values(singleExecutionModalKeys)
      ?.find((typeData) => typeData.value === validationType);

    return column === CRITERIA_FIELDS.DATA_TYPE ? validationTypeData?.dataTypeLabel : validationTypeData?.inputExample;
  };
  const renderExpectedColumns = (criteria) => (
    searchableColumns
      ?.filter((field) => field.fieldCriteria === criteria)
      .map((field, index) => (
        <React.Fragment key={field.id}>
          <StyledFlex key={field.id} my={2} display="flex" flexDirection="row" p="0px 15px">
            <StyledFlex flex="1">
              <StyledText size={16} weight={600} textAlign="left">
                {field.fieldName}
              </StyledText>
            </StyledFlex>
            <StyledFlex flex="1">
              <StyledText size={16} weight={400} textAlign="center">
                {renderDataTypeLabelAndExample(field, CRITERIA_FIELDS.DATA_TYPE)}
              </StyledText>
            </StyledFlex>
            <StyledFlex flex="1">
              <StyledText size={16} weight={400} textAlign="right">
                {renderDataTypeLabelAndExample(field, CRITERIA_FIELDS.EXAMPLE)}
              </StyledText>
            </StyledFlex>
          </StyledFlex>
          {index !== searchableColumns.length - 1 ? <StyledDivider borderWidth={1} color={colors.inputBorder} /> : null}
        </React.Fragment>
      ))
  );

  return (
    <CustomSidebar
      open={openExpectedColumnsSideBar}
      onClose={closeExpectedColumnsSideBar}
      headBackgroundColor={colors.lightPinkRed}
      headerTemplate={(
        <StyledFlex
          gap="10px"
        >
          <StyledFlex
            direction="row"
            alignItems="center"
            gap="17px"
          >
            <StyledText weight={600} size={24}>{values?.process?.label}</StyledText>
          </StyledFlex>
        </StyledFlex>
      )}
      sx={{ zIndex: editModeData ? 1301 : 1200 }}
    >
      {() => (
        <StyledFlex p="0 15px">
          <StyledFlex p="30px 15px">
            <SearchBar
              placeholder="Search Field Names..."
              onChange={searchBarHandler}
              width="100%"
            />
          </StyledFlex>
          <StyledText size={19} weight={600} mt={4} mb={14} p="0px 15px">
            Mandatory Fields
          </StyledText>
          <StyledFlex display="flex" flexDirection="row" mb={2} p="0px 15px">
            <StyledFlex flex="1">
              <StyledText size={16} weight={600} textAlign="left">Field Name</StyledText>
            </StyledFlex>
            <StyledFlex flex="1">
              <StyledText size={16} weight={600} textAlign="center">Data Type</StyledText>
            </StyledFlex>
            <StyledFlex flex="1">
              <StyledText size={16} weight={600} textAlign="right">Example Text</StyledText>
            </StyledFlex>
          </StyledFlex>

          <StyledDivider borderWidth={2} color={colors.inputBorder} />
          {renderExpectedColumns(CRITERIA_FIELDS.MANDATORY)}
          <StyledDivider borderWidth={2} color={colors.inputBorder} />

          {renderExpectedColumns(CRITERIA_FIELDS.OPTIONAL)?.length > 0 && (
            <>
              <StyledText size={19} weight={600} mt={28} mb={14} p="0px 15px">
                Optional Fields
              </StyledText>
              <StyledFlex display="flex" flexDirection="row" mb={2} p="0px 15px">
                <StyledFlex flex="1">
                  <StyledText size={16} weight={600} textAlign="left">Field Name</StyledText>
                </StyledFlex>
                <StyledFlex flex="1">
                  <StyledText size={16} weight={600} textAlign="center">Data Type</StyledText>
                </StyledFlex>
                <StyledFlex flex="1">
                  <StyledText size={16} weight={600} textAlign="right">Example Text</StyledText>
                </StyledFlex>
              </StyledFlex>

              <StyledDivider borderWidth={2} color={colors.inputBorder} />
              {renderExpectedColumns(CRITERIA_FIELDS.OPTIONAL)}
              <StyledDivider borderWidth={2} color={colors.inputBorder} mb={4} />
            </>
          )}

        </StyledFlex>
      ) }
    </CustomSidebar>
  );
};

export default ExpectedColumnsSideBar;
