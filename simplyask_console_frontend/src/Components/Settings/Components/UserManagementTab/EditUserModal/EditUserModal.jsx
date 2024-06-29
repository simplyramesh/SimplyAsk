import TagFacesIcon from '@mui/icons-material/TagFaces';
import { Chip, Paper, TextField, Tooltip, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from 'simplexiar_react_components';

import LockIcon from '../../../../../Assets/icons/lockClose.svg?component';
import UnlockIcon from '../../../../../Assets/icons/lockOpen.svg?component';
import { setUserPermission, updatePersonalData } from '../../../../../Services/axios/userAxios';
import { getUserPermissionOptions } from '../../../../../utils/functions/getUserPermissionOptions';
import { accessObjectProperty } from '../../../../../utils/helperFunctions';
import Spinner from '../../../../shared/Spinner/Spinner';
import Switch from '../../../../SwitchWithText/Switch';
import UserAvatar from '../../../../UserAvatar';
import classes from './EditUserModal.module.css';
import CustomDropdownIndicator from '../../../../shared/ManagerComponents/Modals/TestManagerModals/ExecuteTestSuiteModal/CustomDropdownIndicator';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';

const EditUserModal = ({
  user,
  groups,
  permissions,
  loading,
  readOnly,
  refetchTableData,
  closeModal,
  showEditModal,
}) => {
  const { firstName, lastName, pfp, email, permissionsList, agentGroupIdList } = user;
  const [loadingAPI, setLoadingAPI] = useState(false);
  const [formInput, setFormInput] = useState({ id: null, isLocked: false, permissionIds: null });
  const [groupsChipData, setGroupsChipData] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [userGroups, setUserGroups] = useState();
  const [checked, setChecked] = useState(false);
  const [initialLock] = useState(user.isLocked);
  const [userSelectedPermission, setUserSelectedPermission] = useState([]);

  useEffect(() => {
    if (user && showEditModal) {
      setUserGroups(user);
      setFirstLoad(true);
    }
  }, [user, showEditModal]);

  useEffect(() => {
    if (user) {
      setChecked(initialLock);
    }
  }, [closeModal]);

  useEffect(() => {
    const id = accessObjectProperty(user, 'id');
    const isLocked = accessObjectProperty(user, 'isLocked');
    if (isLocked) {
      setChecked(isLocked);
    }
    const permissionIds = accessObjectProperty(user, 'permissionsList');

    setFormInput(user ? { id, isLocked, permissionIds } : { id: '', isLocked: false, permissionIds: null });
  }, [user, closeModal]);

  useEffect(() => {
    if (user && groups) {
      const groupsChipDataArr = [];
      let chipKeyCounter = 0;
      if (agentGroupIdList) {
        for (let i = 0; i < agentGroupIdList.length; i++) {
          for (let n = 0; n < groups.length; n++) {
            if (agentGroupIdList[i] === groups[n].id) {
              groupsChipDataArr.push({
                key: chipKeyCounter++,
                label: groups[n].name,
                id: groups[n].id,
              });
            }
          }
        }
      }
      setGroupsChipData(groupsChipDataArr);
    } else {
      setGroupsChipData([]);
    }

    if (user && permissionsList) {
      const permissionsChipDataArr = permissionsList?.map((item) => ({ label: item?.role, value: item?.id }));
      setUserSelectedPermission(permissionsChipDataArr);
    } else {
      setUserSelectedPermission([]);
    }
  }, [formInput]);

  const saveUserEdits = async (event) => {
    event.preventDefault();
    setFirstLoad(false);

    if (userSelectedPermission.length === 0) return toast.error('Please select at least one permission!');
    setLoadingAPI(true);
    const permissionReq = {
      id: user.id,
      isLocked: checked,
      permissionIds: userSelectedPermission?.map(({ value }) => value),
    };
    if (user) user.id = permissionReq.id; // updating a group

    try {
      const res = await setUserPermission(permissionReq);

      if (res.status === 200) {
        // converting userGroup to array for backend
        setUserSelectedPermission([]);
        const groupsList = [];
        for (let i = 0; i < groupsChipData.length; i++) {
          groupsList.push(groupsChipData[i].id);
        }

        setUserGroups((prev) => ({
          ...prev,
          agentGroupIdList: groupsList,
        }));
      }

      closeModal();
    } catch (error) {
      if (error.response.status === 400) toast.error(`${error.response.data}`);
      else toast.error('Something went wrong!');
    } finally {
      setLoadingAPI(false);
      setChecked(initialLock);
    }
  };

  useEffect(() => {
    if (!firstLoad) {
      saveUserGroup();
    }
  }, [userGroups]);

  const saveUserGroup = async () => {
    await updatePersonalData(user.email, userGroups);
    refetchTableData(true);
    toast.success(`${user.firstName}'s account has been successfully ${user.id ? 'updated' : 'added'}.`);
    setLoadingAPI(false);
    closeModal();
  };

  const handleLockUserToggle = () => {
    if (checked) {
      setChecked(false);
    } else {
      setChecked(true);
    }
  };

  const onGroupsChange = (event, newValue) => {
    if (!newValue) return;

    // Checks if value is already selected
    // TODO Remove value from list after insert instead in the future
    for (let i = 0; i < groupsChipData.length; i++) {
      if (newValue.name === groupsChipData[i].label) {
        return;
      }
    }

    const newKey = groupsChipData[groupsChipData.length - 1] ? groupsChipData[groupsChipData.length - 1].key + 1 : 0;
    setGroupsChipData([...groupsChipData, { key: newKey, label: newValue.name, id: newValue.id }]);
  };

  const chipGroupsDelete = (chipToDelete) => () => {
    setGroupsChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const onUserRolesChange = (event) => {
    if (!event) return;

    setUserSelectedPermission([...event]);
  };

  if (loading || loadingAPI || !showEditModal) return <Spinner inline />;

  return (
    <div className={classes.root}>
      <section className={classes.userInfo}>
        <UserAvatar imgSrc={pfp} customUser={{ firstName, lastName }} size="50" />
        <Tooltip title={email} TransitionComponent={({ children }) => children}>
          <p>{`${firstName} ${lastName}`}</p>
        </Tooltip>
        {checked ? <LockIcon className={classes.lockIcon} /> : <UnlockIcon className={classes.lockIcon} />}
      </section>

      <section>
        <label htmlFor="lockUser">Locked Account</label>
        <Switch
          checked={checked}
          onChange={handleLockUserToggle}
          activeLabel="Locked"
          inactiveLabel="Unlocked"
          className={classes.switch}
          thumbClassName={classes.thumb}
        />
      </section>

      <section>
        <label>
          User's Roles
          <CustomSelect
            options={getUserPermissionOptions(permissions)}
            onChange={onUserRolesChange}
            value={[...userSelectedPermission]}
            placeholder="Add Roles ..."
            isMulti
            menuPlacement="top"
            components={{
              DropdownIndicator: CustomDropdownIndicator,
            }}
            withSeparator
            mb={0}
          />
        </label>
      </section>

      <section>
        <label>
          User's Groups
          <Autocomplete
            value={null}
            id="groups"
            classes={{
              root: classes.servicePickerRoot,
              inputRoot: classes.servicePickerInputRoot,
            }}
            options={groups}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} placeholder="add groups ..." variant="filled" />}
            size="small"
            onChange={onGroupsChange}
          />
        </label>
        <Paper component="ul" className={classes.paper}>
          {groupsChipData.map((data) => {
            let icon;

            if (data.label === 'React') {
              icon = <TagFacesIcon />;
            }

            return (
              <li key={data.key}>
                <Chip icon={icon} label={data.label} onDelete={chipGroupsDelete(data)} className={classes.chip} />
              </li>
            );
          })}
        </Paper>
      </section>

      <Button color="primary" onClick={saveUserEdits} disabled={loadingAPI} hasLoader={loading} isVisible={!readOnly}>
        Save
      </Button>
    </div>
  );
};

export default EditUserModal;

EditUserModal.propTypes = {
  closeModal: PropTypes.func,
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string,
      organizationId: PropTypes.string,
      skills: PropTypes.shape({
        SERVICE_TICKET_ASSIGNMENT: PropTypes.arrayOf(PropTypes.string),
        WORKFLOW_EXECUTION_VISIBILITY: PropTypes.arrayOf(PropTypes.string),
      }),
    })
  ),
  permissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      organizationId: PropTypes.string,
      role: PropTypes.string,
    })
  ),
  readOnly: PropTypes.bool,
  refetchTableData: PropTypes.func,
  showEditModal: PropTypes.bool,
  user: PropTypes.shape({
    accountNonExpired: PropTypes.bool,
    accountNonLocked: PropTypes.bool,
    agentGroupIdList: PropTypes.arrayOf(PropTypes.string),
    city: PropTypes.string,
    credentialsNonExpired: PropTypes.bool,
    department: PropTypes.string,
    email: PropTypes.string,
    enabled: PropTypes.bool,
    firstName: PropTypes.string,
    id: PropTypes.string,
    isLocked: PropTypes.bool,
    isTemp: PropTypes.bool,
    lastName: PropTypes.string,
    organizationId: PropTypes.string,
    password: PropTypes.string,
    permissionsList: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        organizationId: PropTypes.string,
        role: PropTypes.string,
      })
    ),
    pfp: PropTypes.string,
    phone: PropTypes.string,
    platformConfigurationId: PropTypes.string,
    preferences: PropTypes.shape({
      emailNotifications: PropTypes.bool,
      newLoginNotifications: PropTypes.bool,
    }),
    province: PropTypes.string,
    role: PropTypes.string,
    timezone: PropTypes.string,
  }),
  loading: PropTypes.bool,
};
