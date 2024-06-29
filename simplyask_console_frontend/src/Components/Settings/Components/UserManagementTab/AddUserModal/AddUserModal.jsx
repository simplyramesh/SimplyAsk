// import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Input } from 'simplexiar_react_components';

import { validatePassword } from '../../../../../contexts/PasswordPolicyContext';
import { createNewAccount } from '../../../../../Services/axios/authAxios';
import { getUserPermissionOptions } from '../../../../../utils/functions/getUserPermissionOptions';
import { _catchAPIError, _emptyInputVals } from '../../../../../utils/helperFunctions';
import Spinner from '../../../../shared/Spinner/Spinner';
import classes from './AddUserModal.module.css';
import CustomDropdownIndicator from '../../../../shared/ManagerComponents/Modals/TestManagerModals/ExecuteTestSuiteModal/CustomDropdownIndicator';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';

const AddUserModal = ({ refetchUsers, permissions, showAddModal, closeModal }) => {
  // const [usesCustomPass, setUsesCustomPass] = useState(true);
  const [usesCustomPass] = useState(true);
  const [passwordValidation, setPasswordValidation] = useState(false);
  const [loadingAPI, setLoadingAPI] = useState(false);
  const [toolTipMessage, setToolTipMessage] = useState([]);
  const [toolTipHead, setToolTipHead] = useState([]);
  const [open, setOpen] = useState(false);
  const [userSelectedPermission, setUserSelectedPermission] = useState([]);

  // Popover String set and popover show and hide
  function handlePasswordChange(event) {
    const strValidation = validatePassword(event.target.value);
    if (strValidation.length > 0) {
      setPasswordValidation(true);
      setToolTipMessage(strValidation);
      setToolTipHead(['Password Criteria:']);
      setOpen(true);
    } else {
      setPasswordValidation(false);
      setOpen(false);
      setToolTipMessage([]);
      setToolTipHead([]);
    }
  }

  // TO Close the popover
  function onOut() {
    setOpen(false);
  }

  const onInvite = async (e) => {
    e.preventDefault();
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.userEmail.value;

    if (userSelectedPermission.length === 0) return toast.error('Please select at least one permission!');

    setLoadingAPI(true);
    try {
      await createNewAccount(firstName, lastName, email, userSelectedPermission);
      toast.success(`An email invitation has been sent to ${email} successfully!`);
      _emptyInputVals(e, ['firstName', 'lastName', 'userEmail']);
      setUserSelectedPermission([]);
    } catch (err) {
      _catchAPIError(err);
    }

    setLoadingAPI(false);
    refetchUsers(false);
  };

  const onCreateAccount = async (e) => {
    e.preventDefault();
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.userEmail.value;
    const password = e.target.userPassword1.value;
    const password2 = e.target.userPassword2.value;

    if (userSelectedPermission.length === 0) return toast.error('Please select at least one permission!');
    if (open) return toast.error('Please enter valid password!');
    if (passwordValidation) return toast.error('Please enter valid password!');

    if (password !== password2) return toast.error('Passwords do not match!');

    setLoadingAPI(true);
    try {
      await createNewAccount(firstName, lastName, email.toLowerCase(), userSelectedPermission, password);
      toast.success('Successfully created a new account!');
      _emptyInputVals(e, ['firstName', 'lastName', 'userEmail', 'userPassword1', 'userPassword2']);
      setUserSelectedPermission([]);
      closeModal();
    } catch (err) {
      _emptyInputVals(e, ['userPassword1', 'userPassword2']);
      _catchAPIError(err);
    }

    setLoadingAPI(false);
    refetchUsers(false);
  };

  // const handleCustomPasswordSwitch = () => {
  //   if (usesCustomPass) {
  //     setUsesCustomPass(false);
  //   } else {
  //     setUsesCustomPass(true);
  //   }
  // };

  const onUserRolesChange = (event) => {
    if (!event) return;

    setUserSelectedPermission([...event]);
  };

  if (!showAddModal) return <Spinner parent />;

  return (
    <div className={classes.root}>
      <h3>Add New User</h3>

      <form className={classes.form} onSubmit={usesCustomPass ? onCreateAccount : onInvite}>
        <section>
          <label htmlFor="firstName">First Name</label>
          <Input id="firstName" required />
        </section>
        <section>
          <label htmlFor="lastName">Last Name</label>
          <Input id="lastName" required />
        </section>
        <section>
          <label htmlFor="userEmail">Email Address</label>
          <Input id="userEmail" type="email" required />
        </section>

        <section>
          <label>User's Role(s)</label>
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
        </section>

        {/*
        <section>
          <label htmlFor="usesCustomPass" className={classes.inlineLabel}>
            Use Custom Password
          </label>
          <Switch
            id="usesCustomPass"
            checked={usesCustomPass}
            onChange={() => handleCustomPasswordSwitch()}
            className={classes.passwordSwitch}
            thumbClassName={classes.thumb}
          />
        </section>

        {/* React.createElement('p',{},validatePassword(toolTipMessage)); */}
        {usesCustomPass && (
          <>
            <section className={classes.sectionSpacing}>
              <label htmlFor="userPassword1">Password</label>

              <Tooltip
                open={open}
                title={
                  toolTipMessage === null
                    ? ' '
                    : toolTipHead.concat(toolTipMessage.map((message) => <li key={message}>{message}</li>))
                }
                arrow
                placement="top"
              >
                <Input
                  id="userPassword1"
                  type="password"
                  onChange={handlePasswordChange}
                  onFocus={handlePasswordChange}
                  onBlur={onOut}
                  required
                />
              </Tooltip>
            </section>
            <section>
              <label htmlFor="userPassword2">Confirm Password</label>
              <Input id="userPassword2" type="password" required />
            </section>
          </>
        )}

        <Button color="primary" type="Submit" hasLoader={loadingAPI}>
          Add User
        </Button>
      </form>
    </div>
  );
};

export default AddUserModal;

AddUserModal.propTypes = {
  closeModal: PropTypes.func,
  permissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      organizationId: PropTypes.string,
      role: PropTypes.string,
    })
  ),
  refetchUsers: PropTypes.func,
  showAddModal: PropTypes.bool,
};
