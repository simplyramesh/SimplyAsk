import Close from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Button, Card, Modal, SidedrawerModal, Table } from 'simplexiar_react_components';

import useSideModalWidth from '../../../../hooks/useSideModalWidth';
import { deleteGroup, getAllOrganizationGroups, getNumberOfUsers } from '../../../../Services/axios/agentGroupAxios';
import { getAllSkillConfigurations } from '../../../../Services/axios/skillAxios';
import Spinner from '../../../shared/Spinner/Spinner';
import getAgentGroupsHeaders, { groupsUniqueId } from './agentGroupHeadersSchema';
import classes from './AgentGroupsTab.module.css';
import AgentGroupsTabModalView from './AgentGroupsTabModalView/AgentGroupsTabModalView';

const AgentGroupsTab = ({ readOnly }) => {
  // TODO: refetch is not the same as useAxiosGet fetchData and will need to be updated.
  const {
    data: agentGroups,
    isLoading,
    refetch: fetchData,
  } = useQuery({
    queryKey: ['getAllAgentGroups'],
    queryFn: getAllOrganizationGroups,
  });
  const { data: skills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ['getAllSkillConfigurations'],
    queryFn: getAllSkillConfigurations,
  });
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agentGroupData, setAgentGroupData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const sideModalWidth = useSideModalWidth();

  useEffect(() => {
    const fetchData = async () => {
      const groupIds = agentGroups.map((item) => item.id);
      try {
        await getNumberOfUsers(groupIds)
          .then((res) => {
            const responseObject = res.data;
            const responseIdKeys = Object.keys(responseObject);

            const combinedData = agentGroups.map((item) => {
              const matchResponseKey = responseIdKeys.find((key) => key === item.id);

              return { ...item, numberOfUser: responseObject[matchResponseKey] };
            });

            setAgentGroupData(combinedData);
            setIsLoadingData(false);
          })
          .catch(() => {
            setIsLoadingData(false);
          });
      } catch (error) {
        setIsLoadingData(false);
      }
    };

    if (!isLoading && agentGroups) fetchData();
  }, [agentGroups, isLoading]);

  const editButtonHandler = (group) => {
    setSelectedGroup(group);
    setShowGroupModal(true);
  };

  const deleteButtonHandler = (group) => {
    setSelectedGroup(group);
    setShowDeleteModal(true);
  };

  const addButtonHandler = () => {
    setSelectedGroup(null);
    setShowGroupModal(true);
  };

  const onDeleteGroup = async () => {
    setShowDeleteModal(false);
    setIsLoadingData(true);
    try {
      await deleteGroup(selectedGroup.id);
      toast.success(`${selectedGroup.name} group has been deleted successfully!`);
      await fetchData(false);
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  if (isLoading || isLoadingSkills || isLoadingData) {
    return (
      <Card className={classes.root}>
        <Spinner inline />
      </Card>
    );
  }

  return (
    <Card className={classes.root}>
      <div className={classes.topMenu}>
        <Button
          color="tertiary"
          className={classes.addGroupTypeButton}
          onClick={addButtonHandler}
          isVisible={!readOnly}
        >
          <span className={classes.plusCharacter}>+</span>
          Add new group
        </Button>
      </div>

      <Table
        data={agentGroupData}
        uniqueIdSrc={groupsUniqueId}
        headers={getAgentGroupsHeaders(editButtonHandler, deleteButtonHandler)}
        isLoading={isLoading}
        className={classes.tableWidth}
        tableParentClassName={classes.tableParentClassName}
      />

      <SidedrawerModal show={showGroupModal} closeModal={() => setShowGroupModal(false)} width={sideModalWidth}>
        <AgentGroupsTabModalView
          group={selectedGroup}
          skills={skills}
          readOnly={readOnly}
          refetchTableData={fetchData}
          closeModal={() => setShowGroupModal(false)}
        />
      </SidedrawerModal>

      {/* Delete Group Modal */}
      <Modal show={showDeleteModal} modalClosed={() => setShowDeleteModal(false)} className={classes.modal}>
        <Close className={classes.closeIcon} onClick={() => setShowDeleteModal(false)} />
        <ErrorOutlineIcon className={classes.warningIcon} />
        <p>Delete Group</p>

        <div className={classes.description}>
          <p>
            Are you sure you want to delete <span className={classes.ModalValueBold}>{selectedGroup?.name}</span>
          </p>
        </div>

        <div className={classes.deleteButtons}>
          <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button color="primary" onClick={onDeleteGroup}>
            Delete
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

export default AgentGroupsTab;

AgentGroupsTab.propTypes = {
  readOnly: PropTypes.bool,
};
