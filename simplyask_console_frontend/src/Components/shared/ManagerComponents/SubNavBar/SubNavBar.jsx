import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Button, SearchBarWithValue } from 'simplexiar_react_components';

import { usePopoverToggle } from '../../../../hooks/usePopoverToggle';
import useWindowSize from '../../../../hooks/useWindowSize';
import PaginationText from '../../Pagination/PaginationText';
import { StyledTooltip } from '../../REDISIGNED/tooltip/StyledTooltip';
import { StyledText, StyledPopover, StyledFlex } from '../../styles/styled';

import { StyledImportButton, StyledPopoverActionsBtn } from './StyledSubNavBar';
import classes from './SubNavBar.module.css';
import CustomIndicatorArrow from '../../REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../REDISIGNED/selectMenus/CustomSelect';

const SMALL_SCREEN_BREAKPOINT = 1120;

const getNumberOfPaginationItems = (
  pagination,
  isLoading,
  isTestManagerView,
  isProcessManagerView,
  isAgentManagerView
) => (
  <PaginationText
    pagination={pagination}
    isLoading={isLoading}
    isTestManagerView={isTestManagerView}
    isProcessManagerView={isProcessManagerView}
    isAgentManagerView={isAgentManagerView}
  />
);

const AllViewsNavbar = ({ setCurrentView, currentView, SUB_NAVBAR_TITLES }) => (
  <div className={classes.allViewsRoot}>
    {SUB_NAVBAR_TITLES?.map((item, index) => (
      <div
        className={`${classes.hover_background} 
      ${currentView === item.value && classes.selectedNavTitle}`}
        onClick={() => setCurrentView(item.value)}
        // eslint-disable-next-line react/no-array-index-key
        key={index}
      >
        <div className={classes.iconRoot}>
          <img src={item.imgSource} alt="" className={classes.iconSize} />
        </div>
        <div className={classes.subSectionText}>{item.title}</div>
      </div>
    ))}
  </div>
);

AllViewsNavbar.propTypes = {
  setCurrentView: PropTypes.func,
  currentView: PropTypes.number,
  SUB_NAVBAR_TITLES: PropTypes.array,
};

const SubHeaderComponentLargeScreen = ({
  setShowAddNewElementModal,
  setCurrentView,
  currentView,
  SUB_NAVBAR_TITLES,
  addNewElementButtonTitle,
  pagination,
  isTestManagerView,
  isProcessManagerView,
  isAgentManagerView,
  isLoading,
  renderImportProcessBtn,
}) => (
  <div className={classes.flex_row_center}>
    <div className={classes.showingNumProcess}>
      {pagination &&
        getNumberOfPaginationItems(pagination, isLoading, isTestManagerView, isProcessManagerView, isAgentManagerView)}
    </div>

    <AllViewsNavbar setCurrentView={setCurrentView} currentView={currentView} SUB_NAVBAR_TITLES={SUB_NAVBAR_TITLES} />

    <StyledFlex direction="row" gap="15px" alignItems="center" justifyContent="flex-end">
      <div className={classes.flex_end_btn}>
        <Button
          className={`${classes.addNewProcess} ${isAgentManagerView && classes.addNewAgentButton}`}
          onClick={() => setShowAddNewElementModal(true)}
        >
          <AddOutlinedIcon className={classes.plusIconSvg} />
          {addNewElementButtonTitle}
        </Button>
      </div>
      {renderImportProcessBtn()}
    </StyledFlex>
  </div>
);

SubHeaderComponentLargeScreen.propTypes = {
  setShowAddNewElementModal: PropTypes.func,
  setCurrentView: PropTypes.func,
  currentView: PropTypes.number,
  SUB_NAVBAR_TITLES: PropTypes.array,
  addNewElementButtonTitle: PropTypes.string,
  pagination: PropTypes.object,
  isTestManagerView: PropTypes.bool,
  isProcessManagerView: PropTypes.bool,
  isAgentManagerView: PropTypes.bool,
  isLoading: PropTypes.bool,
};

const SubHeaderComponentSmallScreen = ({
  setCurrentView,
  currentView,
  SUB_NAVBAR_TITLES,
  pagination,
  isTestManagerView,
  isProcessManagerView,
  isAgentManagerView,
  isLoading,
}) => (
  <div className={classes.flex_col}>
    <div className={classes.line_div_second} />

    <div className={classes.flex_row_center_rev}>
      <div className={classes.showingNumProcess}>
        {pagination &&
          getNumberOfPaginationItems(
            pagination,
            isLoading,
            isTestManagerView,
            isProcessManagerView,
            isAgentManagerView
          )}
      </div>
      <AllViewsNavbar setCurrentView={setCurrentView} currentView={currentView} SUB_NAVBAR_TITLES={SUB_NAVBAR_TITLES} />
    </div>
  </div>
);

SubHeaderComponentSmallScreen.propTypes = {
  setCurrentView: PropTypes.func,
  currentView: PropTypes.number,
  SUB_NAVBAR_TITLES: PropTypes.array,
  pagination: PropTypes.object,
  isTestManagerView: PropTypes.bool,
  isProcessManagerView: PropTypes.bool,
  isAgentManagerView: PropTypes.bool,
  isLoading: PropTypes.bool,
};

const SubNavBar = ({
  searchFilterAPI,
  setSearchFilterAPI,
  setShowFilterModal,
  selectSortByDateOrName,
  setSelectSortByDateOrName,
  setShowAddNewElementModal,
  setCurrentView,
  currentView,
  SORTBY_DATE_FILTER = [],
  SUB_NAVBAR_TITLES = [],
  addNewElementButtonTitle = '',
  pagination,
  isTestManagerView = false,
  isProcessManagerView = false,
  isAgentManagerView = false,
  isLoading,
  onImportAsNewClick,
  onImportAndReplaceClick,
  isImportButtonLoading = false,
}) => {
  const {
    id: idImportJobActionsPopover,
    open: openImportJobActionsPopover,
    anchorEl: anchorElImportJobActionsPopover,
    handleClick: handleClickImportJobActionsPopover,
    handleClose: handleCloseImportJobActionsPopover,
  } = usePopoverToggle('import-job');

  const size = useWindowSize();

  const searchBarHandler = (event) => {
    setSearchFilterAPI(event.target.value);
  };

  const onDateSortFilterChange = (event) => {
    if (!event) return;

    setSelectSortByDateOrName(event);
  };

  const getSortByDateOptions = () =>
    SORTBY_DATE_FILTER.map((item) => ({
      label: item.label,
      value: item.value,
      sortingFilter: item.sortingFilter,
      isAscending: item.isAscending,
    }));

  const onPopOverActionClick = (e, callbackFn) => {
    handleCloseImportJobActionsPopover(e);
    callbackFn?.();
  };

  const onImportPopOverRootClick = (e) => {
    if (isImportButtonLoading) return;
    handleClickImportJobActionsPopover(e);
  };

  const renderImportProcessBtn = (isSmallScreen = false) => {
    const getImportToolTipText = () => {
      if (isProcessManagerView) return 'Import a Process';
      if (isAgentManagerView) return 'Import an Agent';

      return 'Import a Test';
    };

    const getImportAsNewBtnText = () => {
      if (isProcessManagerView) return ' Import and create a new Process';
      if (isAgentManagerView) return 'Import and create a new Agent';

      return 'Import and create a new Test';
    };

    const getImportAndReplaceBtnText = () => {
      if (isProcessManagerView) return 'Import and replace an existing Process';
      if (isAgentManagerView) return 'Import and replace an existing Agent';

      return 'Import and replace an existing Test';
    };

    return isProcessManagerView || isAgentManagerView ? (
      <StyledFlex>
        <StyledTooltip
          title={!isImportButtonLoading && getImportToolTipText()}
          arrow
          placement="top"
          p="10px"
          maxWidth="auto"
        >
          <StyledImportButton
            variant="contained"
            tertiary
            startIcon={<FileDownloadOutlinedIcon />}
            endIcon={<KeyboardArrowDownRoundedIcon />}
            onClick={onImportPopOverRootClick}
            mt={isSmallScreen ? '12px' : '0px'}
            loading={isImportButtonLoading}
          ></StyledImportButton>
        </StyledTooltip>

        <StyledPopover
          id={idImportJobActionsPopover}
          open={openImportJobActionsPopover}
          anchorEl={anchorElImportJobActionsPopover}
          onClose={handleCloseImportJobActionsPopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <StyledFlex overflow="hidden" padding="5px 0">
            <StyledPopoverActionsBtn onClick={(e) => onPopOverActionClick(e, onImportAsNewClick)}>
              <StyledFlex cursor="pointer" p="7px 16px 10px 16px" alignItems="center" marginRight="auto">
                <StyledText wrap="nowrap">{getImportAsNewBtnText()}</StyledText>
              </StyledFlex>
            </StyledPopoverActionsBtn>
            <StyledPopoverActionsBtn onClick={(e) => onPopOverActionClick(e, onImportAndReplaceClick)}>
              <StyledFlex cursor="pointer" p="10px 16px 7px 16px" alignItems="center" marginRight="auto">
                <StyledText wrap="nowrap">{getImportAndReplaceBtnText()}</StyledText>
              </StyledFlex>
            </StyledPopoverActionsBtn>
          </StyledFlex>
        </StyledPopover>
      </StyledFlex>
    ) : null;
  };

  return (
    <div className={`${classes.navbar_root}`}>
      <div className={classes.lineDiv} />
      <div className={classes.navbar_base}>
        <div className={classes.flex_row_space_bw}>
          <div className={classes.flex_row_group_15gap}>
            <SearchBarWithValue
              placeholder="Search"
              value={searchFilterAPI}
              onChange={searchBarHandler}
              className={`${classes.searchBar} ${searchFilterAPI.length > 0 ? classes.searchBarActive : ''}`}
            />

            <div className={classes.filterParent}>
              <Button className={classes.viewAllFilters} onClick={() => setShowFilterModal(true)}>
                View All Filters
              </Button>
            </div>
          </div>

          <div className={classes.flex_row_sm}>
            <div className={classes.flex_row_date}>
              <div className={classes.sortBy}>Sort By</div>
              <CustomSelect
                options={getSortByDateOptions()}
                onChange={onDateSortFilterChange}
                value={[selectSortByDateOrName]}
                placeholder="Date Order"
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                }}
                closeMenuOnSelect
                maxHeight={30}
                menuPadding={0}
                mb={0}
                menuPlacement="auto"
                menuPortalTarget={document.body}
                withSeparator
                filter
                isSearchable={false}
                isClearable={false}
              />
            </div>

            {size.width <= SMALL_SCREEN_BREAKPOINT && (
              <StyledFlex direction="row" gap="15px" alignItems="center" justifyContent="flex-end">
                <div className={classes.btn_parent}>
                  <Button
                    className={`${classes.addNewProcess} ${isAgentManagerView && classes.addNewAgentButton}`}
                    onClick={() => setShowAddNewElementModal(true)}
                  >
                    <AddOutlinedIcon className={classes.plusIconSvg} />
                    {addNewElementButtonTitle}
                  </Button>
                </div>
                {renderImportProcessBtn(true)}
              </StyledFlex>
            )}
          </div>
        </div>

        {size.width > SMALL_SCREEN_BREAKPOINT ? (
          <SubHeaderComponentLargeScreen
            setShowAddNewElementModal={setShowAddNewElementModal}
            setCurrentView={setCurrentView}
            currentView={currentView}
            SUB_NAVBAR_TITLES={SUB_NAVBAR_TITLES}
            addNewElementButtonTitle={addNewElementButtonTitle}
            pagination={pagination}
            isLoading={isLoading}
            isTestManagerView={isTestManagerView}
            isProcessManagerView={isProcessManagerView}
            isAgentManagerView={isAgentManagerView}
            renderImportProcessBtn={renderImportProcessBtn}
          />
        ) : (
          <SubHeaderComponentSmallScreen
            setCurrentView={setCurrentView}
            currentView={currentView}
            SUB_NAVBAR_TITLES={SUB_NAVBAR_TITLES}
            pagination={pagination}
            isLoading={isLoading}
            isTestManagerView={isTestManagerView}
            isProcessManagerView={isProcessManagerView}
            isAgentManagerView={isAgentManagerView}
          />
        )}
      </div>
    </div>
  );
};

export default memo(SubNavBar);

SubNavBar.propTypes = {
  searchFilterAPI: PropTypes.string,
  setSearchFilterAPI: PropTypes.func,
  setShowFilterModal: PropTypes.func,
  selectSortByDateOrName: PropTypes.object,
  setSelectSortByDateOrName: PropTypes.func,
  setShowAddNewElementModal: PropTypes.func,
  setCurrentView: PropTypes.func,
  currentView: PropTypes.number,
  SORTBY_DATE_FILTER: PropTypes.array,
  SUB_NAVBAR_TITLES: PropTypes.array,
  addNewElementButtonTitle: PropTypes.string,
  pagination: PropTypes.object,
  isTestManagerView: PropTypes.bool,
  isLoading: PropTypes.bool,
  isProcessManagerView: PropTypes.bool,
  isAgentManagerView: PropTypes.bool,
  isImportButtonLoading: PropTypes.bool,
};
