import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Portal } from 'react-portal';

import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomSidebar from '../../../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import {
  StyledDivider,
  StyledFlex,
  StyledText,
} from '../../../../../../../shared/styles/styled';
import { serviceTypeIconColors, serviceTypeIconNames } from '../../../../constants/iconConstants';
import ServiceTicketTypeIcon from '../../../shared/ServiceTicketTypeIcon/ServiceTicketTypeIcon';
import ServiceTypeIconPreview from '../../../shared/ServiceTypeIconPreview';
import {
  StyledServiceTicketTypeCheckIconWrapper,
  StyledServiceTicketTypeColorSelector,
  StyledServiceTicketTypeIconSelector,
} from '../../../shared/StyledServiceTicketTypes';

const ServiceTicketTypeChangeIcon = ({ values, isOpen, onSave, onClose }) => {
  const { colors } = useTheme();

  const [icon, setIcon] = useState(values?.icon || serviceTypeIconNames[0]);
  const [iconColour, setIconColour] = useState(values?.iconColour || serviceTypeIconColors[0]);

  const handleSave = () => {
    onSave({
      icon,
      iconColour,
    });
    onClose();
  };

  return (
    <CustomSidebar
      open={isOpen}
      onClose={onClose}
      headStyleType="filter"
    >
      {({ customActionsRef }) => (
        <>
          {isOpen && (
            <StyledFlex>
              <StyledFlex p="0 30px">
                <StyledText size={19} weight={600} lh={29}>
                  Change Icon
                </StyledText>
              </StyledFlex>
              <StyledDivider
                m="30px 0 30px 0"
                borderWidth={2}
                color={colors.cardGridItemBorder}
              />
              <StyledFlex p="0 30px" gap="10px 0">
                <StyledText size={16} weight={600} lh={24}>
                  Preview
                </StyledText>

                <ServiceTypeIconPreview icon={icon} iconColour={iconColour} />
              </StyledFlex>
              <StyledDivider
                m="30px 0 30px 0"
                borderWidth={2}
                color={colors.cardGridItemBorder}
              />
              <StyledFlex p="0 30px" gap="17px 0" mb="28px">
                <StyledText size={16} weight={600} lh={24}>
                  Icon
                </StyledText>

                <StyledFlex direction="row" flexWrap="wrap" gap="17px 23px">
                  {serviceTypeIconNames.map((iconName) => (
                    <StyledServiceTicketTypeIconSelector
                      key={iconName}
                      onClick={() => setIcon(iconName)}
                      isSelected={icon === iconName}
                    >
                      <ServiceTicketTypeIcon icon={iconName} />
                    </StyledServiceTicketTypeIconSelector>
                  ))}
                </StyledFlex>
              </StyledFlex>

              <StyledFlex p="0 30px" gap="17px 0" mb="28px">
                <StyledText size={16} weight={600} lh={24}>
                  Colour
                </StyledText>

                <StyledFlex direction="row" flexWrap="wrap" gap="17px 23px">
                  {serviceTypeIconColors.map((c) => (
                    <StyledServiceTicketTypeColorSelector
                      key={c}
                      color={c}
                      isSelected={iconColour === c}
                      onClick={() => setIconColour(c)}
                    >
                      <StyledServiceTicketTypeCheckIconWrapper as="span">
                        <CheckRoundedIcon />
                      </StyledServiceTicketTypeCheckIconWrapper>
                    </StyledServiceTicketTypeColorSelector>
                  ))}
                </StyledFlex>
              </StyledFlex>
            </StyledFlex>
          )}
          <Portal node={customActionsRef?.current}>
            <StyledButton
              width="125px"
              onClick={handleSave}
              variant="contained"
              primary
            >
              Save
            </StyledButton>
          </Portal>
        </>
      )}
    </CustomSidebar>
  );
};

export default ServiceTicketTypeChangeIcon;
