import PropTypes from 'prop-types';
import { useState } from 'react';

import { updateUserGroups } from '../../../../../../Services/axios/permissionsUserGroups';
import { useEntityCreateDelete } from '../../../hooks/useGroupsCreateDelete';
import GeneralTabSide from '../../GeneralTab/GeneralTabSide/GeneralTabSide';
import UserGroupsModalForm from '../../modals/formModals/UserGroups/UserGroupsModalForm';

const UserGroupTabSide = ({ userGroupData, isSuperAdmin }) => {
  const { id, name, userIds, description, createdDate, modifiedDate } = userGroupData;
  const [isEditUserGroupOpen, setIsEditUserGroupOpen] = useState(false);
  const [currentName, setCurrentName] = useState(name);
  const [currentDescription, setCurrentDescription] = useState(description);

  const userCount = userIds.length;

  const { editEntity } = useEntityCreateDelete({
    editFn: updateUserGroups,
    invalidateQueryKey: 'editUserGroups',
    successEditMessage: ({ data }) => `User group "${data.name}" was successfully updated!`,
    onEditSuccess: ({ data }) => {
      setIsEditUserGroupOpen(false);
      setCurrentName(data.name);
      setCurrentDescription(data.description);
    },
  });

  const editModalStatusHandle = (status) => {
    setIsEditUserGroupOpen(status);
  };

  const handleEditUserGroup = async (formik) => {
    await editEntity({ id, body: formik.values });

    formik.resetForm();
  };

  return (
    <>
      <GeneralTabSide
        aboutGroup="User"
        onEdit={() => editModalStatusHandle(true)}
        name={currentName}
        description={currentDescription}
        count={userCount}
        createdDate={createdDate}
        modifiedDate={modifiedDate}
        isSuperAdmin={isSuperAdmin}
      />
      <UserGroupsModalForm
        title="Edit User Group"
        open={isEditUserGroupOpen}
        initState={{ name: currentName, description: currentDescription }}
        onSubmit={handleEditUserGroup}
        onClose={() => editModalStatusHandle(false)}
      />
    </>
  );
};

export default UserGroupTabSide;

UserGroupTabSide.propTypes = {
  userGroupData: PropTypes.any,
  isSuperAdmin: PropTypes.bool,
};
