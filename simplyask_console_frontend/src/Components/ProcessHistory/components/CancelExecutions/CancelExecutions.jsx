import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import { toast } from 'react-toastify';
import { StyledLoadingButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledFlex } from '../../../shared/styles/styled';
import { useCancelExecutions } from '../../hooks/useCancelExecutions';

const CancelExecutions = ({ processId, isActive, invalidateKeys, copyBtn, processName }) => {
  const { isCancelExecutionsSuccess, isCancelExecutionsFetching, handleRefresh, handleCancelExecutions } =
    useCancelExecutions({
      processIds: processId,
      invalidateKeys,
      onSuccess: () => {
        toast.success(`${processName} - ${processId} Has Been Canceled`);
        handleRefresh();
      },
    });

  const renderRefreshBtn = () => {
    return (
      <StyledLoadingButton variant="outline" primary startIcon={<RefreshIcon />} onClick={handleRefresh}>
        Refresh
      </StyledLoadingButton>
    );
  };

  const renderCancelExecutionBtn = (variant) => {
    return (
      <StyledLoadingButton
        variant={variant}
        danger={variant === 'contained'}
        color="primary"
        startIcon={<CloseRoundedIcon />}
        onClick={handleCancelExecutions}
        loading={isCancelExecutionsFetching}
      >
        Cancel Execution
      </StyledLoadingButton>
    );
  };

  return (
    <StyledFlex direction="row" gap="0 15px" alignItems="center" position="absolute" right="30px" top="32px">
      {isActive && renderRefreshBtn()}
      {isActive && !isCancelExecutionsSuccess && renderCancelExecutionBtn('contained')}
      {copyBtn}
    </StyledFlex>
  );
};

export default CancelExecutions;
