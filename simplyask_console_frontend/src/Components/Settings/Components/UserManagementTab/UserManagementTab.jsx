import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, SearchBar, SidedrawerModal, Table } from 'simplexiar_react_components';

import { getAllOrganizationGroups } from '../../../../Services/axios/agentGroupAxios';
import { getAllPermissionRoles } from '../../../../Services/axios/requestManagerAxios';
import { getUsers } from '../../../../Services/axios/userAxios';
import Spinner from '../../../shared/Spinner/Spinner';
import AddUserModal from './AddUserModal/AddUserModal';
import EditUserModal from './EditUserModal/EditUserModal';
import classes from './UserManagementTab.module.css';
import getUsersHeaders, { usersUniqueId } from './usersHeadersSchema';

const UserManagementTab = ({ readOnly }) => {
  // TODO: refetch is not the same as useAxiosGet fetchData and will need to be updated.
  const {
    data: users,
    isLoading,
    refetch: fetchData,
  } = useQuery({
    queryKey: ['getUsers'],
    queryFn: getUsers,
  });
  const { data: groups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['getAllAgentGroups'],
    queryFn: getAllOrganizationGroups,
  });
  const { data: permissions, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['getAllPermissionRoles'],
    queryFn: getAllPermissionRoles,
  });

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const editButtonHandler = (user) => {
    setSelectedUser(user);
    openEditModal();
  };

  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);

  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);

  const searchBarHandler = (event) => {
    const userInput = event.target.value.toLowerCase();
    const newFilteredUsers = [];
    for (const user of users) {
      if (`${user.firstName} ${user.lastName}`.toLowerCase().includes(userInput)) {
        newFilteredUsers.push(user);
      } else {
        for (const permission of user.permissionsList) {
          if (permission.role.toLowerCase().includes(userInput)) {
            newFilteredUsers.push(user);
            break;
          }
        }
      }
    }
    setFilteredUsers(newFilteredUsers);
  };

  useEffect(() => {
    if (users) {
      // filter in the formatter function in usersHeadersSchema only works for this page, and would not effect the modal.
      // this is a solution which works for both.
      const removeNullUndefinedFromPermissionsList = users.map((user) => {
        const newPermissionsList = user.permissionsList
          ? user.permissionsList.filter(
              (permission) =>
                (typeof permission?.role === 'string' && permission?.role?.trim() !== '') ||
                (typeof permission === 'string' && permission.trim() !== '')
            )
          : [];

        return { ...user, permissionsList: newPermissionsList };
      });

      setFilteredUsers(removeNullUndefinedFromPermissionsList);
    }
  }, [users]);

  if (!users || !filteredUsers || isLoading || isLoadingGroups || isLoadingPermissions) {
    return (
      <Card className={classes.root}>
        <Spinner inline />
      </Card>
    );
  }

  return (
    <Card className={classes.root}>
      <div className={classes.tableHeight}>
        <div className={classes.topMenu}>
          <div className={classes.rightTopMenu}>
            <SearchBar placeholder="Search User" onChange={searchBarHandler} className={classes.SearchBar} />

            <Button color="tertiary" onClick={openAddModal} isVisible={!readOnly} className={classes.addUserButton}>
              <span className={classes.plusCharacter}>+</span>
              Add Users
            </Button>
          </div>
        </div>

        <Table
          data={filteredUsers}
          onPageChange={fetchData}
          uniqueIdSrc={usersUniqueId}
          headers={getUsersHeaders(editButtonHandler)}
          isLoading={isLoading || isLoadingPermissions || isLoadingGroups}
        />

        {/* Add User Modal */}
        <SidedrawerModal show={showAddModal} closeModal={closeAddModal} width="40vw">
          <AddUserModal
            refetchUsers={fetchData}
            permissions={permissions}
            showAddModal={showAddModal}
            closeModal={() => setShowAddModal(false)}
          />
        </SidedrawerModal>

        {/* Edit User Modal */}
        <SidedrawerModal show={showEditModal} closeModal={closeEditModal} width="40vw">
          {selectedUser && permissions && groups && (
            <EditUserModal
              user={selectedUser}
              groups={groups}
              permissions={permissions}
              readOnly={readOnly}
              refetchTableData={fetchData}
              showEditModal={showEditModal}
              closeModal={() => setShowEditModal(false)}
            />
          )}
        </SidedrawerModal>
      </div>
    </Card>
  );
};

export default UserManagementTab;

UserManagementTab.propTypes = {
  readOnly: PropTypes.bool,
};
