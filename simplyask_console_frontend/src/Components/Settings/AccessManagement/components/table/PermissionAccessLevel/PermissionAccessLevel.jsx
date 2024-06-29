import { Popover } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';

import { getPermissionSummary } from '../../../../../../Services/axios/permissions';
import CustomTableIcons from '../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { constructUrlSearchString } from '../../../utils/formatters';
import { customAccessLevelInfo } from '../../../utils/helpers';
import { ACCESS_LEVEL, ACCESS_LEVEL_SCHEME } from '../../ManagePermissionsTab/PermissionSettingsScheme';

const btnStyles = {
  cursor: 'pointer',
  bgcolor: 'transparent',
  border: 'none',
  padding: '6px',
  outline: 'none',
};

const popoverBtnStyles = (transitions, colors, isSelected) => ({
  ...btnStyles,
  gap: '0 8px',
  transition: `background-color ${transitions.default}`,
  '&:hover': {
    bgcolor: !isSelected && colors.passwordStrengthUndefined,
  },
});

const reduceApiPermissionsToId = (apiPermissions) => {
  return apiPermissions.reduce((acc, value) => {
    const { permissionName } = value.permission || {};
    const isCustom = permissionName.includes('CUSTOM');
    const customAccessLevel = isCustom ? 'CUSTOM' : 'WRITE';
    const permissionAccessLevel = permissionName.includes('READ') ? 'READ' : customAccessLevel;

    return { ...acc, [permissionAccessLevel]: value.id };
  }, {});
};

const PermissionsAccessLevel = ({ cell, table }) => {
  const value = cell.getValue();
  const { original } = cell.row;

  const { boxShadows, transitions, colors } = useTheme();

  const [anchorEl, setOpen] = useState(false);

  const open = Boolean(anchorEl);

  const { isSuperAdmin } = value;

  const currentApiPermissionId = original.id;
  const parentPagePermissionId = original.pagePermission?.id;

  const { onAccessLevel } = table.options.meta;
  const { onShowAccessSettings } = table.options.meta;

  const cellValue = ACCESS_LEVEL?.[value.accessLevel];

  const singlePagePermissionUrlParams = constructUrlSearchString({ permissionIds: parentPagePermissionId });

  const { data: apiAccessLevelAndId, refetch } = useQuery({
    queryKey: ['getAllPagePermissions', singlePagePermissionUrlParams],
    queryFn: () => getPermissionSummary(singlePagePermissionUrlParams),
    enabled: !!parentPagePermissionId && !!singlePagePermissionUrlParams && open,
    select: (data) => {
      const customInfo = customAccessLevelInfo(data);

      return {
        apiPermissions: reduceApiPermissionsToId(data.content[0].apiPermissions),
        customAccessLevelInfo: {
          ...customInfo,
          currentId: currentApiPermissionId,
          currentAccessLevel: cellValue,
          pagePermissionFeatures: customInfo.pagePermissionFeatures,
        },
      };
    },
  });

  const handleChangeAccessLevel = (newPermissionId, type) => {
    if (type === ACCESS_LEVEL.CUSTOM) {
      onShowAccessSettings(apiAccessLevelAndId.customAccessLevelInfo);

      setOpen(null);
    }

    if (type !== ACCESS_LEVEL.CUSTOM) {
      onAccessLevel({ currentApiPermissionId, newPermissionId });

      setOpen(null);
    }
    refetch();
  };

  const styleProps = {
    isSuperAdmin: {
      justifyContent: 'center',
    },
    default: {
      m: '0 auto',
    },
  };

  return (
    <>
      <StyledFlex
        as={!isSuperAdmin ? 'button' : 'div'}
        direction="row"
        alignItems="center"
        {...styleProps[isSuperAdmin ? 'isSuperAdmin' : 'default']}
        gap="18px"
        {...btnStyles}
        onClick={(e) => !isSuperAdmin && setOpen(e.currentTarget)}
      >
        <StyledText as="span" cursor="pointer" textAlign="center">
          {!isSuperAdmin ? ACCESS_LEVEL_SCHEME[cellValue]?.label : value.accessLevel}
        </StyledText>
        {!isSuperAdmin && <CustomTableIcons icon="DROPDOWN" width={12} />}
      </StyledFlex>
      <Popover
        open={open}
        onClose={() => setOpen(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPopover-paper': {
            borderRadius: '10px',
            boxShadow: boxShadows.box,
          },
        }}
        anchorEl={anchorEl}
      >
        {open && (
          <StyledFlex gap="4px 0" p="8px 8px">
            {Object.values(ACCESS_LEVEL_SCHEME).map((item, index) => (
              <Fragment key={item.value}>
                {index === Object.values(ACCESS_LEVEL_SCHEME).length - 1 && <StyledDivider flexItem />}
                <StyledFlex
                  as="button"
                  direction="row"
                  sx={{ ...popoverBtnStyles(transitions, colors, cellValue === item.value) }}
                  disabled={item.value !== ACCESS_LEVEL.CUSTOM && cellValue === item.value}
                  onClick={() => {
                    const accessLevelAndId = apiAccessLevelAndId?.apiPermissions?.[item.value];

                    handleChangeAccessLevel(accessLevelAndId, item.value);
                  }}
                >
                  {item.value === ACCESS_LEVEL.CUSTOM && <CustomTableIcons icon="CUSTOM_ACCESS" width={20} />}
                  <StyledText
                    as="span"
                    lh={20}
                    cursor={cellValue === ACCESS_LEVEL.CUSTOM || cellValue !== item.value ? 'pointer' : 'default'}
                    weight={cellValue === item.value && cellValue !== ACCESS_LEVEL.CUSTOM ? 600 : 400}
                  >
                    {item.title}
                  </StyledText>
                </StyledFlex>
              </Fragment>
            ))}
          </StyledFlex>
        )}
      </Popover>
    </>
  );
};

export default PermissionsAccessLevel;

PermissionsAccessLevel.propTypes = {
  cell: PropTypes.shape({
    row: PropTypes.shape({
      id: PropTypes.string,
      original: PropTypes.shape({
        id: PropTypes.number,
        pagePermission: PropTypes.shape({
          id: PropTypes.number,
        }),
        permission: PropTypes.shape({
          permissionId: PropTypes.string,
          permissionName: PropTypes.string,
          pagePermissionFeatures: PropTypes.array,
          parentPermissionId: PropTypes.number, // TODO: check to see if this is changed to parentOrganizationPermissionId
        }),
      }),
    }),
    getValue: PropTypes.func,
  }),
  table: PropTypes.shape({
    options: PropTypes.shape({
      meta: PropTypes.shape({
        onAccessLevel: PropTypes.func,
        onShowAccessSettings: PropTypes.func,
      }),
    }),
  }),
};
