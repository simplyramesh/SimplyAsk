import { useTheme } from '@emotion/react';

import DefineExecutionSideBar from '../../../../shared/ProcessExecutionDetails/DefineExecutionSideBar/DefineExecutionSideBar';

import ExpectedColumnsSideBar from './Step2ProcessExecution/FileUpload/ExpectedColumnsSideBar';
import DeleteModalFormEntryTable from './Step2ProcessExecution/FormEntry/DeleteModalFormEntryTable';

const ProcessTriggerExecuteSideModals = ({
  values,
  dataHeaderColumns,
  isDataHeaderFetching,
  setDefineExecutionDetailsSideBarOpen,
  defineExecutionDetailsSideBarOpen,
  defineExecutionResetForm,
  setClickedUpdateTableRowId,
  toggleSidebar,
  errors,
  handleBlur,
  touched,
  clickedUpdateTableRowId,
  defineExecutionSubmitSideBarForm,
  searchBarHandler,
  searchableColumns,
  defineExecutionSideBarValues,
  defineExecutionSideBarSetFieldValues,
  expectedColumnFieldsSideBarOpen,
  deleteExecutionDetailRowModal,
  setDeleteExecutionDetailRowModal,
  setClickedDeleteTableRow,
  handleRowDeletion,
  clickedDeleteTableRow,
  editModeData,
}) => {
  const { colors } = useTheme();

  return (
    <>
      <DefineExecutionSideBar
        openDefineExecution={!!defineExecutionDetailsSideBarOpen}
        onCloseDefineExecution={() => {
          defineExecutionResetForm();
          setClickedUpdateTableRowId(null);
          toggleSidebar('details', null);
        }}
        values={values}
        errors={errors}
        handleBlur={handleBlur}
        touched={touched}
        clickedUpdateTableRowId={clickedUpdateTableRowId}
        submitDefineExecutionUploadProcess={() => {
          defineExecutionSubmitSideBarForm();
          setDefineExecutionDetailsSideBarOpen(null);
        }}
        submitDefineExecutionSaveProgress={() => {
          defineExecutionSubmitSideBarForm();
          setDefineExecutionDetailsSideBarOpen(null);
        }}
        searchBarHandler={searchBarHandler}
        searchableColumns={searchableColumns}
        dataHeaderColumns={dataHeaderColumns}
        defineExecutionSideBarValues={defineExecutionSideBarValues}
        defineExecutionSideBarSetFieldValues={defineExecutionSideBarSetFieldValues}
        editModeData={editModeData}
      />

      <ExpectedColumnsSideBar
        openExpectedColumnsSideBar={!!expectedColumnFieldsSideBarOpen}
        closeExpectedColumnsSideBar={() => toggleSidebar('expectedColumnFields', null)}
        colors={colors}
        values={values}
        searchBarHandler={searchBarHandler}
        searchableColumns={searchableColumns}
        editModeData={editModeData}
      />

      <DeleteModalFormEntryTable
        deleteExecutionDetailRowModalOpen={deleteExecutionDetailRowModal}
        deleteExecutionDetailRowModalOnClose={() => {
          setDeleteExecutionDetailRowModal(null);
          setClickedDeleteTableRow();
        }}
        onSuccessClickDeleteRow={() => handleRowDeletion()}
        isDeleteModalLoading={isDataHeaderFetching}
        clickedDeleteTableRow={clickedDeleteTableRow}
      />
    </>
  );
};

export default ProcessTriggerExecuteSideModals;
