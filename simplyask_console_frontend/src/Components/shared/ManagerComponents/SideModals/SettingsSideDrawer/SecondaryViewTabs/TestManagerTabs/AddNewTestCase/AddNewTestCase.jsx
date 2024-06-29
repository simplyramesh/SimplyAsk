import '../transition.css';

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CSSTransition } from 'react-transition-group';
import { Button, SearchBarWithValue } from 'simplexiar_react_components';

import DeleteTestCase from '../../../../../../../../Assets/icons/DeleteAccountBilling.svg';
import EditTestCase from '../../../../../../../../Assets/icons/EditTestCase.svg';
import OpenInTestEditor from '../../../../../../../../Assets/icons/OpenInTestEditor.svg';
import threeDotsIcon from '../../../../../../../../Assets/icons/threeDotsIcon.svg';
import { MANAGER_API_KEYS } from '../../../../../../../../config/managerKeys';
import routes from '../../../../../../../../config/routes';
import useAxiosGet from '../../../../../../../../hooks/useAxiosGet';
import useOutsideClick from '../../../../../../../../hooks/useOutsideClick';
import { TEST_ENGINE_API } from '../../../../../../../../Services/axios/AxiosInstance';
import { deleteTestCase } from '../../../../../../../../Services/axios/test';
import {
  ADD_NEW_TEST_CASE_KEYS,
  ADD_NEW_TEST_CASE_MODAL_TITLES,
  ADD_NEW_TEST_SUITE_KEYS,
} from '../../../../../../../../utils/constants';
import Pagination from '../../../../../../Pagination/Pagination';
import ConfirmationModal from '../../../../../../REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import Spinner from '../../../../../../Spinner/Spinner';
import AddNewTestCaseModal from '../../../../../Modals/TestManagerModals/AddNewTestCaseModal/AddNewTestCaseModal';
import {
  CSS_TRANSITION_ACTIVE_MENUS,
  SAVE_BUTTON_CONFIGURATION_SCHEMA,
  SAVE_BUTTON_KEYS,
} from '../../../SettingsSideDrawer';

import classes from './AddNewTestCase.module.css';

const TestCaseDropDown = ({ setActiveMenu, item, onDelete }) => {
  const navigate = useNavigate();
  const isRPA = item.testCaseType === 'RPA';
  const openPage = routes.TEST_MANAGER;
  const openId = isRPA ? item.workflowId : item.testCaseId;

  return (
    <div className={classes.testCaseDropDownRoot}>
      <div
        className={classes.editTestCaseDropDown}
        onClick={() =>
          setActiveMenu({
            value: CSS_TRANSITION_ACTIVE_MENUS.SECONDARY_MENU,
            data: item,
          })
        }
      >
        <img src={EditTestCase} alt="" className={classes.dropdownIcon} />
        Edit Details
      </div>
      <div className={classes.editTestCaseDropDown} onClick={() => navigate(`${openPage}/${openId}`)}>
        <img src={OpenInTestEditor} alt="" className={classes.dropdownIcon} />
        Open in Test Editor
      </div>
      <div className={classes.editTestCaseDropDown} onClick={onDelete}>
        <img src={DeleteTestCase} alt="" className={classes.dropdownIcon} />
        Delete test case
      </div>
    </div>
  );
};

const TestCaseRow = ({ item, index, dataArray, setActiveMenu, fetchTestCases }) => {
  const ref = useRef();
  const [showDropdownOptions, setShowDropdownOptions] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useOutsideClick(ref, () => {
    if (showDropdownOptions) setShowDropdownOptions(false);
  });

  const handleDelete = (item) => {
    setItemToDelete(item);
  };

  const handleConfirmDelete = async (id) => {
    try {
      await deleteTestCase(id);

      await fetchTestCases();

      toast.success(`Test Case "${itemToDelete.displayName}" was deleted.`);
    } catch {
      toast.error('Something went wrong!');
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <div
      className={`${classes.testCasesDiv}
  ${index !== dataArray.length - 1 && classes.addSeparationLine}`}
      key={item.testCaseId}
      ref={ref}
    >
      <div className={classes.testDataRoot}>
        <div className={classes.testName}>{item.displayName ?? '---'}</div>
        <div className={classes.testDescription}>{item.settings?.description ?? '---'}</div>
      </div>

      <Button className={classes.threeDotsRoot} onClick={() => setShowDropdownOptions(() => !showDropdownOptions)}>
        <img src={threeDotsIcon} />
      </Button>
      {showDropdownOptions && (
        <TestCaseDropDown setActiveMenu={setActiveMenu} item={item} onDelete={() => handleDelete(item)} />
      )}

      <ConfirmationModal
        isOpen={!!itemToDelete}
        onCloseModal={() => setItemToDelete(null)}
        onSuccessClick={() => handleConfirmDelete(itemToDelete?.testCaseId)}
        successBtnText="Delete"
        alertType="DANGER"
        title="Are You Sure?"
        text={`You are about to permanently delete "${itemToDelete?.displayName}" Test Case.`}
      />
    </div>
  );
};

const DisplayAllTestCases = ({
  dataArray = [],
  pagination = [],
  error,
  isLoading,
  onPageChange,
  setActiveMenu,
  fetchTestCases,
}) => {
  const testCases = dataArray.filter((tc) => !tc.isDeleted);
  if (isLoading) return <Spinner parent medium />;

  if (error) {
    return <div className={classes.error}>Something went wrong ...</div>;
  }

  if (testCases.length === 0) {
    return (
      <div className={classes.noData}>
        <div className={classes.noDataText}>No Test Cases Yet</div>
        <div className={classes.noDataDescription}>Use the button above to create a Test Case</div>
      </div>
    );
  }

  return (
    <div className={classes.casesRoot}>
      <Scrollbars className={classes.scrollbarRoot}>
        {testCases.map((item, index) => (
          <TestCaseRow
            item={item}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            index={index}
            dataArray={testCases}
            setActiveMenu={setActiveMenu}
            fetchTestCases={fetchTestCases}
          />
        ))}
      </Scrollbars>

      {pagination && (
        <div className={`${classes.pagination_bottom}`}>
          <Pagination
            initialPage={pagination.pageNumber}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
            pagination={pagination}
            showPaginationText
          />
        </div>
      )}
    </div>
  );
};

const AddNewTestCase = ({
  goBackToPrimaryMenu,
  clickedProcess,
  isAddNewCaseApiLoading,
  setShowAddNewTestCaseModal,
  addNewTestCaseToSuite,
  setAddNewTestCaseFormCollector,
}) => {
  const ALL_TEST_CASES_MENU = { value: CSS_TRANSITION_ACTIVE_MENUS.PRIMARY_MENU };

  const [activeMenu, setActiveMenu] = useState(ALL_TEST_CASES_MENU);

  useEffect(() => {
    setActiveMenu((prev) => ({ ...prev, ...ALL_TEST_CASES_MENU }));
  }, [clickedProcess]);

  const handleAddNewTestCase = () => {
    setShowAddNewTestCaseModal(true);
  };

  const getGoBackTitle = () => 'View all Test Cases';

  const PrimaryView = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [searchInputValue, setSearchInputValue] = useState('');

    const {
      response: allCases,
      fetchData,
      error,
      isLoading,
    } = useAxiosGet(
      `/case/suite/${
        clickedProcess[MANAGER_API_KEYS.TEST_SUITE_ID]
      }?search=${searchInputValue}&pageNumber=${pageNumber}&pageSize=${10}`,
      true,
      TEST_ENGINE_API
    );

    useEffect(() => {
      if (activeMenu) {
        setSearchInputValue('');
      }
    }, [activeMenu]);

    const searchBarHandler = (event) => {
      setSearchInputValue(event.target.value);
    };

    const onPageChange = (page) => {
      setPageNumber(() => page - 1);
    };

    return (
      <div className={classes.root}>
        <div>
          <Button color="primary" className={`${classes.createNewCase}`} onClick={handleAddNewTestCase}>
            Create a New Test Case
          </Button>
        </div>

        <div className={classes.backBtnRoot}>
          <KeyboardBackspaceIcon className={classes.backBtnIcon} onClick={goBackToPrimaryMenu} />
          <div className={classes.viewTitle}>{getGoBackTitle()}</div>
        </div>

        <div className={classes.contentPadding}>
          <form className={classes.formRoot} action="">
            <SearchBarWithValue
              placeholder="Search"
              value={searchInputValue}
              onChange={searchBarHandler}
              className={`${classes.searchBar} ${searchInputValue.length > 0 ? classes.searchBarActive : ''}`}
            />
          </form>

          <div className={classes.contentRoot}>
            <div className={classes.currentTestCases}>Current Test Cases</div>

            <DisplayAllTestCases
              dataArray={allCases?.content}
              pagination={allCases?.pagination}
              error={error}
              isLoading={isLoading || isAddNewCaseApiLoading}
              onPageChange={onPageChange}
              setActiveMenu={setActiveMenu}
              fetchTestCases={fetchData}
            />
          </div>
        </div>
      </div>
    );
  };

  const SecondaryView = () => {
    const [saveButtonConfigurations, setSaveButtonConfigurations] = useState(SAVE_BUTTON_CONFIGURATION_SCHEMA);
    const [addNewLocalTestCaseFormCollector, setAddNewLocalTestCaseFormCollector] = useState();

    useEffect(() => {
      if (activeMenu) {
        setAddNewLocalTestCaseFormCollector((prev) => ({
          ...prev,
          [ADD_NEW_TEST_CASE_KEYS.name]: activeMenu?.data?.[MANAGER_API_KEYS.DISPLAY_NAME],
          [ADD_NEW_TEST_CASE_KEYS.description]:
            activeMenu?.data?.[MANAGER_API_KEYS.SETTINGS]?.[MANAGER_API_KEYS.DESCRIPTION],
          [ADD_NEW_TEST_SUITE_KEYS.TEST_CASE_ID]: activeMenu?.data?.[MANAGER_API_KEYS.TEST_CASE_ID],
        }));
      }
    }, [activeMenu]);

    const goBackToTestCasesMenu = () => {
      setActiveMenu((prev) => ({ ...prev, ...ALL_TEST_CASES_MENU }));
    };

    const deactivateTriggerApi = () => {
      setSaveButtonConfigurations((prev) => ({
        ...prev,
        [SAVE_BUTTON_KEYS.TRIGGER_API]: false,
      }));
    };

    const handleSaveButtonClick = () => {
      setSaveButtonConfigurations((prev) => ({
        ...prev,
        [SAVE_BUTTON_KEYS.TRIGGER_API]: true,
      }));
    };

    return (
      <div className={classes.fullHeight}>
        <div>
          <Button
            color="primary"
            className={`${classes.saveButton}
          ${saveButtonConfigurations[SAVE_BUTTON_KEYS.IS_BUTTON_DISABLED] && classes.disableSaveButton}`}
            onClick={handleSaveButtonClick}
          >
            Save
          </Button>
        </div>

        <div className={classes.backBtnRoot}>
          <KeyboardBackspaceIcon className={classes.backBtnIcon} onClick={goBackToTestCasesMenu} />
          <div className={classes.viewTitle}>Edit {activeMenu?.data?.[MANAGER_API_KEYS.DISPLAY_NAME]} Details</div>
        </div>
        <AddNewTestCaseModal
          ADD_NEW_MODAL_TITLES={ADD_NEW_TEST_CASE_MODAL_TITLES}
          activateEditElementSideModal
          setSaveButtonConfigurations={setSaveButtonConfigurations}
          saveButtonConfigurations={saveButtonConfigurations}
          isApiLoading={isAddNewCaseApiLoading}
          dataCollector={addNewLocalTestCaseFormCollector}
          addNewTestCaseToSuite={addNewTestCaseToSuite}
          deactivateTriggerApi={deactivateTriggerApi}
          setAddNewElementFormCollector={setAddNewTestCaseFormCollector}
          setActiveMenu={setActiveMenu}
        />
      </div>
    );
  };

  return (
    <div className={classes.mainRoot}>
      <CSSTransition
        in={activeMenu.value === CSS_TRANSITION_ACTIVE_MENUS.PRIMARY_MENU}
        timeout={1000}
        classNames="menu-primary-Test-Case-Transition"
        unmountOnExit
      >
        <PrimaryView />
      </CSSTransition>

      <CSSTransition
        in={activeMenu.value === CSS_TRANSITION_ACTIVE_MENUS.SECONDARY_MENU}
        timeout={1000}
        classNames="menu-secondary-Test-Case-Transition"
        unmountOnExit
      >
        <div className={`${classes.secondary_view_root}`}>
          <SecondaryView />
        </div>
      </CSSTransition>
    </div>
  );
};

export default AddNewTestCase;

TestCaseDropDown.propTypes = {
  setActiveMenu: PropTypes.func,
  item: PropTypes.object,
};

AddNewTestCase.propTypes = {
  goBackToPrimaryMenu: PropTypes.func,
  clickedProcess: PropTypes.object,
  isAddNewCaseApiLoading: PropTypes.bool,
  setShowAddNewTestCaseModal: PropTypes.func,
  addNewTestCaseToSuite: PropTypes.func,
  setAddNewTestCaseFormCollector: PropTypes.func,
};

DisplayAllTestCases.propTypes = {
  dataArray: PropTypes.array,
  pagination: PropTypes.object,
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  onPageChange: PropTypes.func,
  setActiveMenu: PropTypes.func,
};

TestCaseRow.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number,
  dataArray: PropTypes.array,
  setActiveMenu: PropTypes.func,
};
