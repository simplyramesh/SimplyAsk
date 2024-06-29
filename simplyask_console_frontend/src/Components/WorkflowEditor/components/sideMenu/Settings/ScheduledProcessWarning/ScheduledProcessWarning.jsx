import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import routes from '../../../../../../config/routes';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import OpenIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/OpenIcon';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const ScheduledProcessWarning = ({ altText = null }) => {
  const navigate = useNavigate();
  const { colors, statusColors } = useTheme();

  const renderBoldText = (text, color) => <StyledText weight={600} size={14} lh={20} color={color}>{text}</StyledText>;
  const renderBodyText = (text) => <StyledText as="p" size={14} lh={20}>{text}</StyledText>;

  return (
    <StyledFlex px="16px" bgcolor={statusColors.burntYellow.bg} borderRadius="10px" mb="30px">
      <StyledFlex p="14px" gap="10px 0">

        <StyledFlex as="p" direction="row" gap="0 10px" alignItems="center">
          <StyledFlex as="span" fontSize="18px" color={colors.mustardBrown}><WarningAmberRoundedIcon fontSize="inherit" /></StyledFlex>
          {renderBoldText('Warning', colors.mustardBrown)}
        </StyledFlex>
        <StyledFlex gap="10px">
          {altText
            ? renderBodyText(altText)
            : (
              <>
                {renderBodyText(
                  'This Process has actively scheduled executions in Process Trigger. Creating or editing expected input parameters will cause conflicts with the existing executions.',
                )}
                {renderBodyText('To create or make changes to input parameters, you will be asked to delete the scheduled executions upon saving.')}
              </>
            )}
        </StyledFlex>
        <StyledFlex>
          {!altText
            ? (
              <StyledButton
                variant="text"
                startIcon={<OpenIcon />}
                onClick={() => navigate({ pathname: routes.PROCESS_TRIGGER, search: '?tab=view' })}
                fontSize="20px"
              >
                {renderBoldText('View execution details in Process Trigger', 'inherit')}
              </StyledButton>
            )
            : null}
        </StyledFlex>
      </StyledFlex>
    </StyledFlex>
  );
};

export default ScheduledProcessWarning;
