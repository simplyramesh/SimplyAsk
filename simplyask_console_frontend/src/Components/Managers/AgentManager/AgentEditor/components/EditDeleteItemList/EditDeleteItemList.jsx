import { useTheme } from '@mui/material/styles';
import React from 'react';

import DeleteIcon from '../../../../../../Assets/icons/agent/contextMenu/delete.svg?component';
import EditIcon from '../../../../../../Assets/icons/EditIcon.svg?component';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const EditDeleteItemList = ({
  type,
  icon,
  description,
  itemsArray,
  isEditable = false,
  disabledDeleteTooltipTitle,
  onEditIntentClick,
  onDeleteIntentClick,
}) => {
  const { colors } = useTheme();

  return (
    <StyledFlex display="flex" gap="30px">
      <StyledFlex display="flex" gap="7px">
        <StyledFlex display="flex" flexDirection="row" gap="12px" alignItems="center">
          <StyledFlex height="18px" width="16px">
            {icon}
          </StyledFlex>
          <StyledText size={16} weight={600}>
            {type}
          </StyledText>
        </StyledFlex>
        <StyledText size={14}>{description}</StyledText>
      </StyledFlex>
      {!itemsArray?.length ? (
        <StyledFlex display="flex" alignItems="center" justifyContent="center" height="11px">
          <StyledText width={318} size={14} weight={600}>
            There Are Currently No {type}
          </StyledText>
        </StyledFlex>
      ) : (
        <StyledFlex display="flex" gap="15px">
          {itemsArray?.map((item, idx) => (
            <StyledFlex display="flex" flexDirection="row" gap="20px" justifyContent="flex-start" key={idx}>
              <StyledText size={16} width="386px">
                {item.name}
              </StyledText>
              {!isEditable && (
                <StyledFlex display="flex" flexDirection="row" gap="12px">
                  <StyledTooltip title="Edit" arrow placement="top" p="10px 15px" maxWidth="auto">
                    <StyledButton
                      variant="text"
                      onClick={() => onEditIntentClick(item)}
                      minWidth="18px"
                      height="18px"
                      sx={{
                        '&:hover': {
                          backgroundColor: colors.palePeach,
                          opacity: 0.85,
                        },
                        padding: '8px',
                        borderRadius: '50%',
                      }}
                    >
                      <EditIcon style={{ height: '18px', width: '18px' }} />
                    </StyledButton>
                  </StyledTooltip>
                  <StyledTooltip
                    title={item.isUtilized ? disabledDeleteTooltipTitle : 'Delete'}
                    arrow
                    placement="top"
                    p="10px 15px"
                    maxWidth="auto"
                  >
                    <StyledFlex>
                      <StyledButton
                        variant="text"
                        onClick={() => onDeleteIntentClick(item)}
                        minWidth="18px"
                        height="18px"
                        sx={{
                          '&:hover': {
                            backgroundColor: colors.palePeach,
                            opacity: 0.85,
                          },
                          padding: '8px',
                          borderRadius: '50%',
                          ':disabled': {
                            opacity: '0.4',
                            pointerEvents: 'none',
                            backgroundColor: colors.white,
                            borderColor: colors.white,
                            color: colors.primary,
                          },
                        }}
                        disabled={item.isUtilized}
                      >
                        <DeleteIcon style={{ height: '18px', width: '18px' }} />
                      </StyledButton>
                    </StyledFlex>
                  </StyledTooltip>
                </StyledFlex>
              )}
            </StyledFlex>
          ))}
        </StyledFlex>
      )}
    </StyledFlex>
  );
};

export default EditDeleteItemList;
