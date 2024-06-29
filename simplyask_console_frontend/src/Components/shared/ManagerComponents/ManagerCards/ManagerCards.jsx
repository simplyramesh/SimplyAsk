import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import NoDataFound from '../../NoDataFound/NoDataFound';
import Pagination from '../../Pagination/Pagination';
import Spinner from '../../Spinner/Spinner';

import Cards from './Cards/Cards';
import classes from './ManagerCards.module.css';

const ManagerCards = ({
  setClickedProcess,
  setShowSettingsSideDrawer,
  setShowAllTagsSideDrawer,
  setShowMoveElementToArchive,
  isTestManagerView = false,
  isProcessManagerView = false,
  isAgentManagerView = false,
  data = [],
  currentView,
  handleTagOnClickForTags,
  error,
  isLoading,
  runUpdateElementApi,
  getDataForNoDataFoundComponent,
  pagination,
  onPageChange,
  scrollToTopRef,
  setTriggerOpenTestCasesSideModal,
  goBackToPrimaryMenu,
  setShowIsProcessStatusChanged = () => {},
  triggerOpenTestCasesSideModal,
  setIsCardButtonClicked = () => {},
  isCardButtonClicked,
  setActiveMenu,
  tabValue,
  onTabChange,
}) => {
  useEffect(() => {
    scrollToTopRef?.current?.view?.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [data]);

  if (isLoading) return <Spinner global />;

  if (error) {
    return null;
  }

  if (data.length === 0) {
    return (
      <div className={classes.cardsRootParent}>
        <NoDataFound {...getDataForNoDataFoundComponent()} />
      </div>
    );
  }

  return (
    <div className={classes.cardsRootParent}>
      <div className={classes.cardsRoot}>
        {data.map((item, index) => (
          <Cards
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            status={item.status}
            setShowSettingsSideDrawer={setShowSettingsSideDrawer}
            setShowAllTagsSideDrawer={setShowAllTagsSideDrawer}
            setClickedProcess={setClickedProcess}
            allTags={item.tags}
            setShowMoveElementToArchive={setShowMoveElementToArchive}
            isTestManagerView={isTestManagerView}
            isProcessManagerView={isProcessManagerView}
            isAgentManagerView={isAgentManagerView}
            data={item}
            runUpdateElementApi={runUpdateElementApi}
            currentView={currentView}
            handleTagOnClickForTags={handleTagOnClickForTags}
            setTriggerOpenTestCasesSideModal={setTriggerOpenTestCasesSideModal}
            setShowIsProcessStatusChanged={setShowIsProcessStatusChanged}
            goBackToPrimaryMenu={goBackToPrimaryMenu}
            triggerOpenTestCasesSideModal={triggerOpenTestCasesSideModal}
            setIsCardButtonClicked={setIsCardButtonClicked}
            isCardButtonClicked={isCardButtonClicked}
            setActiveMenu={setActiveMenu}
            tabValue={tabValue}
            onTabChange={onTabChange}
          />
        ))}
      </div>
      {pagination && (
        <div className={`${classes.pagination_bottom}`}>
          <Pagination
            initialPage={pagination.pageNumber}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
            pagination={pagination}
          />
        </div>
      )}
    </div>
  );
};

export default ManagerCards;

ManagerCards.propTypes = {
  setClickedProcess: PropTypes.func,
  isTestManagerView: PropTypes.bool,
  isAgentManagerView: PropTypes.bool,
  isProcessManagerView: PropTypes.bool,
  data: PropTypes.array,
  currentView: PropTypes.number,
  handleTagOnClickForTags: PropTypes.func,
  setShowSettingsSideDrawer: PropTypes.func,
  setShowAllTagsSideDrawer: PropTypes.func,
  setShowMoveElementToArchive: PropTypes.func,
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  runUpdateElementApi: PropTypes.func,
  getDataForNoDataFoundComponent: PropTypes.func,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  scrollToTopRef: PropTypes.object,
  setTriggerOpenTestCasesSideModal: PropTypes.func,
  setShowIsProcessStatusChanged: PropTypes.func,
  goBackToPrimaryMenu: PropTypes.func,
  setIsCardButtonClicked: PropTypes.func,
  triggerOpenTestCasesSideModal: PropTypes.bool,
  isCardButtonClicked: PropTypes.bool,
};
