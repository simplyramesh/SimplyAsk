import React, { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Button, Card, SidedrawerModal, Table } from 'simplexiar_react_components';

import AddIcon from '../../../../Assets/icons/addContrastIcon.svg?component';
import { useFixedSideModalWidth } from '../../../../hooks/useSideModalWidth';
import { deleteScheduler, getSchedulers } from '../../../../Services/axios/reporting';
import { sortReportingItemsByDateDesc } from '../../../../utils/helperFunctions';
import CustomModal from '../../../shared/CustomModal/CustomModal';
import Spinner from '../../../shared/Spinner/Spinner';
import buttons from '../../../shared/styles/buttons.module.css';
import CreateReportingForm from './forms/CreateReportingForm/CreateReportingForm';
import EditReportingForm from './forms/EditReportingForm/EditReportingForm';
import ViewReportingForm from './forms/ViewReportingForm/ViewReportingForm';
import { getMappedReportingItems, getReportingHeaders, reportingUniqueId } from './ReportingPageHeadersSchema';
import classes from './ReportingTab.module.css';

const ReportingTab = () => {
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEditOrView, setItemToEditOrView] = useState(null);
  const [formInfo, setFormInfo] = useState(null);
  const [confirmationModalShown, setConfirmationModalShown] = useState(null);
  const [sidebarType, setSidebarType] = useState(null);
  const queryClient = useQueryClient();
  const sideModalWidth = useFixedSideModalWidth();

  const {
    data: reportingItems,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['reporting'],
    queryFn: getSchedulers,
  });

  const { mutate: deleteReportingItem, isLoading: deleteLoading } = useMutation({
    mutationFn: (name) => deleteScheduler(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reporting'] });
    },
  });

  const handleSetFormInfo = useCallback((formInfo) => {
    setFormInfo(formInfo);
  }, []);

  const openSidebar = (reportingId, type, e) => {
    e?.stopPropagation();

    const item = getMappedReportingItems(reportingItems)?.find((i) => i.id === reportingId);

    setItemToEditOrView(item);
    setSidebarType(type);
  };

  const handleFormSubmit = () => {
    formInfo.submitForm();

    setFormInfo(null);
    setConfirmationModalShown(null);
  };

  const handleDelete = async (name) => {
    try {
      await deleteReportingItem(name);
      toast.success('Reporting was successfully removed!');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setItemToDelete(null);
    }
  };

  const openDeleteModal = (e, name) => {
    e?.stopPropagation();

    setItemToDelete(name);
  };

  const closeSidenavAndConfirmation = useCallback(() => {
    setItemToEditOrView(null);
    setSidebarType(null);
    setConfirmationModalShown(false);
  }, []);

  const handleCloseSidenav = () => {
    if (formInfo?.isChanged) {
      setConfirmationModalShown(true);
    } else {
      closeSidenavAndConfirmation();
    }
  };

  const renderSidebarForm = (type) => {
    switch (type) {
      case 'view':
        return (
          itemToEditOrView && (
            <ViewReportingForm item={itemToEditOrView} onEdit={() => openSidebar(itemToEditOrView.id, 'edit')} />
          )
        );
      case 'edit':
        return (
          itemToEditOrView && (
            <EditReportingForm
              initialValues={itemToEditOrView}
              onSuccess={closeSidenavAndConfirmation}
              onInitialFormValuesChanged={handleSetFormInfo}
            />
          )
        );
      case 'create':
        return (
          <CreateReportingForm onSuccess={closeSidenavAndConfirmation} onInitialFormValuesChanged={handleSetFormInfo} />
        );
      default:
        return null;
    }
  };

  if (isFetching || isLoading) {
    return (
      <Card className={classes.root}>
        <Spinner inline />
      </Card>
    );
  }

  return (
    <div>
      <Card className={classes.root}>
        <div className={classes.topMenu}>
          <h3 />
          <Button color="tertiary" className={buttons.iconButton} onClick={() => setSidebarType('create')}>
            <AddIcon />
          </Button>
        </div>

        {/* display list of web pages */}
        <Table
          data={getMappedReportingItems(sortReportingItemsByDateDesc(reportingItems))}
          headers={getReportingHeaders(openSidebar, openDeleteModal)}
          uniqueIdSrc={reportingUniqueId}
          isLoading={isLoading || isFetching}
          onClick={(id) => openSidebar(id, 'view')}
        />
      </Card>

      <CustomModal
        showModal={itemToDelete}
        onDecline={() => setItemToDelete(null)}
        onAccept={() => handleDelete(itemToDelete)}
        title="Are You Sure?"
        description={
          <>
            You are about to delete
            <b>{itemToDelete}</b>
          </>
        }
        isLoading={deleteLoading}
      />

      <CustomModal
        showModal={confirmationModalShown}
        onDecline={closeSidenavAndConfirmation}
        onAccept={handleFormSubmit}
        title="You Have Unsaved Changes"
        description="Do you want to save the changes you have made?"
        acceptBtnContent="Save Changes"
        declineBtnContent="Discard"
      />

      <SidedrawerModal show={sidebarType} closeModal={handleCloseSidenav} width={sideModalWidth}>
        {renderSidebarForm(sidebarType)}
      </SidedrawerModal>
    </div>
  );
};

export default ReportingTab;
