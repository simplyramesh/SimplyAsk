import React from 'react';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplayIcon from '@mui/icons-material/Replay';
import LeftArrowIcon from '../../Assets/icons/leftArrow.svg?component';
import { StyledTextHoverUnderline } from '../TestComponents/TestHistory/StyledTestHistory';
import { StyledButton } from '../shared/REDISIGNED/controls/Button/StyledButton';
import CustomSelect from '../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import SearchBar from '../shared/SearchBar/SearchBar';
import ViewFiltersButton from '../shared/ViewFiltersButton/ViewFiltersButton';
import { StyledFlex, StyledIconButton } from '../shared/styles/styled';
import { StyledRoundedGreyContainer } from './StyledFiles';
import { FILE_SELECT_FILTERS } from './constants';

const FileManagerHeader = ({
  searchBarHandler,
  fetchData,
  openNewFolderModal,
  showUploadFileModal,
  onFilesBreadCrumbClick,
  onBreadCrumbBackClick,
  selectedFolders,
  isFileUploadMode,
  isFilesFetching,
}) => {
  return (
    <StyledFlex pb="15px">
      <StyledFlex gap="10px">
        <StyledFlex direction="row" justifyContent="space-between" alignItems="center" minHeight="50px">
          <StyledFlex direction="row" alignItems="center" gap="16px">
            <SearchBar placeholder="Search File Names" onChange={searchBarHandler} width="357px" />

            {/* Disabled until BE API is ready */}
            {false && <ViewFiltersButton onClick={() => {}} />}

            <StyledIconButton
              onClick={fetchData}
              iconSize="27px"
              size="40px"
              bgColor="transparent"
              disabled={isFilesFetching}
            >
              <ReplayIcon sx={{ transform: 'rotateY(180deg)' }} />
            </StyledIconButton>
          </StyledFlex>

          {!isFileUploadMode && (
            <StyledFlex direction="row" gap="15px">
              <StyledButton variant="contained" tertiary onClick={openNewFolderModal}>
                Create Folder
              </StyledButton>
              <StyledButton variant="contained" tertiary onClick={showUploadFileModal}>
                Upload File
              </StyledButton>
            </StyledFlex>
          )}
        </StyledFlex>
      </StyledFlex>
      <StyledFlex direction="row" justifyContent="space-between" alignItems="center" paddingTop="30px">
        <StyledFlex direction="row" alignItems="center" gap="12px">
          {isFileUploadMode && !!selectedFolders?.length && (
            <StyledIconButton onClick={onBreadCrumbBackClick} iconSize="20px" size="40px" bgColor="transparent">
              <LeftArrowIcon />
            </StyledIconButton>
          )}

          <StyledFlex direction="row" alignItems="center" gap="5px">
            <StyledTextHoverUnderline weight={600} cursor="pointer" onClick={() => onFilesBreadCrumbClick(true, 0)}>
              Files
            </StyledTextHoverUnderline>
            {selectedFolders.length !== 0 && (
              <>
                {selectedFolders.map(({ name }, index) => (
                  <StyledFlex key={name} direction="row" maxLines={1} wordBreak="break-word">
                    <KeyboardArrowRightIcon />
                    <StyledTextHoverUnderline
                      weight={600}
                      cursor="pointer"
                      onClick={() => onFilesBreadCrumbClick(false, index)}
                    >
                      {name}
                    </StyledTextHoverUnderline>
                  </StyledFlex>
                ))}
                {!isFileUploadMode && (
                  <StyledRoundedGreyContainer>
                    <StyledFlex width="15px" justifyContent="center" alignItems="center" textAlign="center">
                      <MoreVertIcon fontSize="small" />
                    </StyledFlex>
                  </StyledRoundedGreyContainer>
                )}
              </>
            )}
          </StyledFlex>
        </StyledFlex>
        {/* TODO: Filters Ticket Replace with BE API */}
        <CustomSelect
          name="updatedAt"
          value={FILE_SELECT_FILTERS[0]}
          onChange={() => {}}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
          }}
          options={FILE_SELECT_FILTERS}
          status
          openMenuOnClick
          mb={0}
          maxHeight={32}
          isSearchable={false}
          isClearable={false}
          hideSelectedOptions={false}
        />
      </StyledFlex>
    </StyledFlex>
  );
};

export default FileManagerHeader;
