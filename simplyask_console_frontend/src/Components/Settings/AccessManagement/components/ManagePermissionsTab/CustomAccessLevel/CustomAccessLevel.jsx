import { Popover } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { toast } from 'react-toastify';

import HelpIcon from '../../../../../../Assets/icons/helpCircle.svg?component';
import { patchPermissionFeatures, postPermissionFeatures } from '../../../../../../Services/axios/permissions';
import { StyledLoadingButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import ConfirmationModal from '../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import BaseSidebar from '../../../../../shared/REDISIGNED/sidebars/BaseSidebar';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { isDifferent } from '../../../utils/helpers';
import RadioGroup from '../../inputs/radio/RadioGroup';
import RadioInput from '../../inputs/radio/RadioInput';
import {
  ACCESS_LEVEL,
  ACCESS_LEVEL_SCHEME,
  EDIT_PERMISSIONS_TYPE,
  PERMISSIONS_CHAPTER,
} from '../PermissionSettingsScheme';

import MultiplePermissionsSwitcher from './MultiplePermissionsSwitcher/MultiplePermissionsSwitcher';
import PermissionStateTable from './PermissionStateTable/PermissionStateTable';

const CustomAccessLevel = ({
  id,
  initialPermissions,
  customAccessOpen,
  onCustomAccessClose,
  onAdd,
  onUpdate,
  isLoading,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const [indexSettings, setIndexSettings] = useState(0);
  const [permissionSettings, setPermissionSettings] = useState(initialPermissions);
  const [initialSettings, setInitialSettings] = useState(initialPermissions);

  const [isTouched, setIsTouched] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [editType, setEditType] = useState();

  const handleDiscardChanges = () => {
    setIsAlertModalOpen(false);
    setIsTouched(false);
    setIndexSettings(0);
    setPermissionSettings([]);
    setInitialSettings([]);
    onCustomAccessClose();
  };

  const { mutate: createCustomAccessLevel, isPending: isCreateLoading } = useMutation({
    mutationFn: async (permSettings) => {
      const customPermission = permSettings.reduce((acc, item) => {
        if (item.currentSelected.permissionAccessLevel === ACCESS_LEVEL.CUSTOM) {
          return item;
        }
        return acc;
      }, {});

      const { parentOrganizationPermissionId } = customPermission.currentSelected;
      const featureIds = customPermission.customInfo[ACCESS_LEVEL.CUSTOM].enabledFeatureIds;

      const createMutationResponse = await postPermissionFeatures(parentOrganizationPermissionId, featureIds).then(
        (response) => {
          const updatedPermissionSettings = permissionSettings.map((item) => {
            if (item.currentSelected.permissionAccessLevel === ACCESS_LEVEL.CUSTOM) {
              return {
                ...item,
                currentSelected: {
                  ...item.currentSelected,
                  permissionId: response.id,
                },
              };
            }

            return item;
          });

          return updatedPermissionSettings;
        },
      );

      return createMutationResponse;
    },
    onSuccess: (data) => {
      onAdd(data);
      handleDiscardChanges();
    },
  });

  const { mutate: editCustomAccessLevel, isPending: isEditLoading } = useMutation({
    mutationFn: async (permSettings) => {
      const isCustomAccess = permSettings.currentSelected.permissionAccessLevel === ACCESS_LEVEL.CUSTOM;

      if (isCustomAccess) {
        const featureIds = permSettings.customInfo[ACCESS_LEVEL.CUSTOM].enabledFeatureIds;
        const organizationPermissionId = permSettings.currentSelected.permissionId;

        const response = await patchPermissionFeatures(organizationPermissionId, featureIds);

        return response;
      }

      if (!isCustomAccess) return { id: permSettings.currentSelected.permissionId };
    },
    onSuccess: (responseData, { customInfo }) => {
      const currentApiPermissionId = customInfo.currentId;
      const newPermissionId = responseData.id;

      if (currentApiPermissionId === newPermissionId) {
        handleDiscardChanges();
        toast.success('Permission access level updated successfully');
      }

      if (currentApiPermissionId !== newPermissionId) {
        onUpdate({ id, body: { currentApiPermissionId, newPermissionId } });
        handleDiscardChanges();
      }
    },
  });

  useEffect(() => {
    setPermissionSettings(initialPermissions);
    setInitialSettings(initialPermissions);
    setEditType(initialPermissions[0]?.currentSelected.type);
  }, [customAccessOpen, initialPermissions]);

  const title = permissionSettings?.[indexSettings]?.customInfo?.pagePermission?.permission?.permissionName;

  const isMultiple = indexSettings + 1 !== permissionSettings.length;
  const isUpdated = () => {
    const itemPart = (item) => (item?.currentSelected.permissionAccessLevel === ACCESS_LEVEL.CUSTOM
      ? {
        currentSelected: item?.currentSelected,
        value: item?.customInfo.CUSTOM,
      }
      : item?.currentSelected);

    return JSON.stringify(initialSettings.map(itemPart)) !== JSON.stringify(permissionSettings.map(itemPart));
  };

  const handleClose = () => {
    if (editType === EDIT_PERMISSIONS_TYPE.ADD || (isTouched && isUpdated())) {
      setIsAlertModalOpen(true);
    } else {
      setIndexSettings(0);
      onCustomAccessClose();
    }
  };

  const onAccessLevelChange = (accessLevel) => {
    if (accessLevel === permissionSettings[indexSettings].currentSelected?.permissionAccessLevel) return;

    setPermissionSettings((prev) => {
      const newSettings = [...prev];

      const updatedAccessType = {
        ...newSettings[indexSettings],
        currentSelected: {
          ...newSettings[indexSettings].currentSelected,
          permissionAccessLevel: accessLevel,
          permissionId: newSettings[indexSettings].customInfo?.pagePermission?.[accessLevel]?.id || null,
        },
      };

      const updatedPermissionSettings = newSettings.map((item, index) => (index === indexSettings ? updatedAccessType : item));

      return updatedPermissionSettings;
    });

    setIsTouched(true);
  };

  const onEnableDisableChange = (id, value) => {
    setPermissionSettings((prev) => {
      const newSettings = [...prev];
      const previousAccessTypeObj = newSettings[indexSettings].customInfo[permissionSettings[indexSettings].currentSelected.permissionAccessLevel];

      const updatedFeatureIds = [...new Set([...previousAccessTypeObj[value], id])];
      const updatedOtherFeatureIds = previousAccessTypeObj[
        value === 'enabledFeatureIds' ? 'disabledFeatureIds' : 'enabledFeatureIds'
      ].filter((item) => item !== id);

      const updatedSetting = {
        ...newSettings[indexSettings],
        currentSelected: {
          ...newSettings[indexSettings].currentSelected,
          permissionAccessLevel: ACCESS_LEVEL.CUSTOM,
          permissionId: newSettings[indexSettings].customInfo?.pagePermission[ACCESS_LEVEL.CUSTOM]?.id || null,
        },
        customInfo: {
          ...newSettings[indexSettings].customInfo,
          [ACCESS_LEVEL.CUSTOM]: {
            ...newSettings[indexSettings].customInfo[ACCESS_LEVEL.CUSTOM],
            [value]: updatedFeatureIds,
            [value === 'enabledFeatureIds' ? 'disabledFeatureIds' : 'enabledFeatureIds']: updatedOtherFeatureIds,
          },
        },
      };

      const updatedPermissionsSettings = newSettings.map((item, index) => (index === indexSettings ? updatedSetting : item));

      return updatedPermissionsSettings;
    });

    setIsTouched(true);
  };

  const handleSave = async (permSettings, index) => {
    const isNewCustomAccess = permSettings.some(
      (item) => item.currentSelected.type === 'add' && item.currentSelected.permissionAccessLevel === ACCESS_LEVEL.CUSTOM,
    );

    if (isNewCustomAccess) createCustomAccessLevel(permSettings);

    if (!isNewCustomAccess) {
      if (permSettings.length > 1) {
        onAdd(permSettings);
        handleDiscardChanges();
      }

      if (permSettings.length === 1) editCustomAccessLevel(permSettings[index]);
    }
  };

  return (
    <BaseSidebar open={customAccessOpen} onClose={handleClose} width={642}>
      <StyledFlex direction="row" justifyContent="space-between" p="36px 36px 18px" mb="6px">
        <CustomTableIcons icon="CLOSE" width={26} onClick={handleClose} />
        <StyledLoadingButton
          primary
          variant="contained"
          disabled={editType === EDIT_PERMISSIONS_TYPE.EDIT ? !isUpdated() : isMultiple}
          onClick={() => handleSave(permissionSettings, indexSettings)}
          onMouseEnter={(event) => isMultiple && setAnchorEl(event.currentTarget)}
          onMouseLeave={() => isMultiple && setAnchorEl(null)}
          endIcon={isMultiple && <HelpIcon width="17px" height="17px" />}
          loading={isCreateLoading || isEditLoading || isLoading}
        >
          Save
        </StyledLoadingButton>
        {isMultiple && (
          <Popover
            sx={{
              top: 5,
              pointerEvents: 'none',
              borderRadius: '5px',
              '& .MuiPopover-paper': {
                boxShadow: '1px 1px 10px 2px rgba(0, 0, 0, 0.1)',
                borderRadius: '5px',
              },
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            onClose={() => isMultiple && setAnchorEl(null)}
            disableRestoreFocus
          >
            <StyledFlex p="11px 18px" width="354px">
              <StyledText size={16} lh={24}>
                To save the page permissions, you must select permissions for
                <b> all </b>
                pages. Once you reach the last page in the process, you will be able to save
              </StyledText>
            </StyledFlex>
          </Popover>
        )}
      </StyledFlex>
      {customAccessOpen && (
        <>
          {permissionSettings.length > 1 && (
            <MultiplePermissionsSwitcher
              quantity={permissionSettings.length}
              currentIndex={indexSettings}
              setActiveIndex={(index) => isDifferent(index, indexSettings) && setIndexSettings(index)}
            />
          )}
          <StyledFlex flex="1 1 0" overflow="auto">
            <StyledFlex mb="33px" p="0 36px" direction="row" alignItems="center" justifyContent="space-between">
              <StyledText size={20} weight={500}>
                {`${title} Permissions`}
              </StyledText>
            </StyledFlex>
            <StyledFlex width="100%" height="1024px">
              <StyledFlex gap=" 18px" mb=" 22px" p="0 36px">
                <StyledText as="h6" weight={600}>
                  Set Permissions
                </StyledText>
                <RadioGroup name="accessLevels">
                  {Object.values(ACCESS_LEVEL_SCHEME).map((item) => (
                    <RadioInput
                      key={item.value}
                      id={item.value}
                      label={item.label}
                      checked={item.value === permissionSettings[indexSettings]?.currentSelected?.permissionAccessLevel}
                      value={item.value}
                      onChange={(e) => onAccessLevelChange(e.target.value)}
                      // disabled={item.value === ACCESS_LEVEL.CUSTOM && permissionSettings[indexSettings]?.customInfo?.pagePermissionFeatures?.length === 0}
                    />
                  ))}
                </RadioGroup>
              </StyledFlex>
              <Scrollbars>
                {!!permissionSettings[indexSettings]?.customInfo && (
                  <StyledFlex flex="auto" p="0 36px">
                    <PermissionStateTable
                      title="Operation Permissions"
                      data={
                        permissionSettings[indexSettings]?.customInfo?.permissionFeatureTypes?.[
                          PERMISSIONS_CHAPTER.OPERATION
                        ]
                      }
                      enabledIds={
                        permissionSettings[indexSettings]?.customInfo[
                          permissionSettings[indexSettings]?.currentSelected?.permissionAccessLevel
                        ]?.enabledFeatureIds
                      }
                      disabledIds={
                        permissionSettings[indexSettings]?.customInfo[
                          permissionSettings[indexSettings]?.currentSelected?.permissionAccessLevel
                        ]?.disabledFeatureIds
                      }
                      isDisabled={false}
                      onRadioValueChange={onEnableDisableChange}
                    />
                    <PermissionStateTable
                      title="Data Permissions"
                      data={
                        permissionSettings[indexSettings]?.customInfo?.permissionFeatureTypes?.[
                          PERMISSIONS_CHAPTER.DATA
                        ]
                      }
                      enabledIds={
                        permissionSettings[indexSettings]?.customInfo[
                          permissionSettings[indexSettings]?.currentSelected?.permissionAccessLevel
                        ]?.enabledFeatureIds
                      }
                      disabledIds={
                        permissionSettings[indexSettings]?.customInfo[
                          permissionSettings[indexSettings]?.currentSelected?.permissionAccessLevel
                        ]?.disabledFeatureIds
                      }
                      isDisabled={false}
                      onRadioValueChange={onEnableDisableChange}
                    />
                  </StyledFlex>
                )}
              </Scrollbars>
            </StyledFlex>
          </StyledFlex>
          {editType === EDIT_PERMISSIONS_TYPE.ADD ? (
            <ConfirmationModal
              isOpen={isAlertModalOpen}
              onCloseModal={() => setIsAlertModalOpen(false)}
              cancelBtnText="Go Back"
              onSuccessClick={handleDiscardChanges}
              successBtnText="Discard Permissions"
              alertType="WARNING"
              title="You Have Unsaved Changes"
              text="There are custom permissions that still need to be set. You can either go back and finish setting the permissions, or discard all permissions, and exit the process without saving any of the permissions, finished or unfinished"
            />
          ) : (
            <ConfirmationModal
              isOpen={isAlertModalOpen}
              onCloseModal={setIsAlertModalOpen}
              onCancelClick={handleDiscardChanges}
              cancelBtnText="Discard"
              onSuccessClick={handleSave}
              successBtnText="Save Changes"
              alertType="WARNING"
              title="You Have Unsaved Changes"
              text="Do you want to save the changes you have made?"
              isLoading={isCreateLoading || isEditLoading || isLoading}
            />
          )}
        </>
      )}
    </BaseSidebar>
  );
};

export default CustomAccessLevel;

CustomAccessLevel.propTypes = {
  id: PropTypes.string,
  initialPermissions: PropTypes.arrayOf(PropTypes.object),
  customAccessOpen: PropTypes.bool,
  onCustomAccessClose: PropTypes.func,
  onAdd: PropTypes.func,
  onUpdate: PropTypes.func,
};
