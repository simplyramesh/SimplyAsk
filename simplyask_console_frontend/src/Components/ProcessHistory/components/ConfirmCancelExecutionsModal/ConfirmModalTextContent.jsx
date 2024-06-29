import { StyledFlex, StyledText } from '../../../shared/styles/styled';

const ConfirmModalTextContent = ({ executions, inProgressCount, isBulkCancel }) => {
  const executionsCount = executions?.length ?? 0;

  const renderInlineText = (text, isBold = false) => (
    <StyledText display="inline" size={14} lh={21} weight={isBold ? 700 : 400}>
      {text}
    </StyledText>
  );

  const renderMessageStart = ({ isBulk, bulkCancelText }) => (
    <>
      {'You are about to cancel '}
      {isBulk ? renderInlineText(bulkCancelText) : renderInlineText('a Process Execution. ')}
    </>
  );

  const renderSingleProcessDetails = ({ processName, processId }) => (
    <>
      <StyledText size={14} lh={21} weight={700}>
        {'Process Name: '}
        {renderInlineText(processName)}
      </StyledText>
      <StyledText size={14} lh={21} weight={700}>
        {'Process ID: '}
        {renderInlineText(processId)}
      </StyledText>
    </>
  );

  const bulkCancelText =
    inProgressCount === executionsCount ? (
      <>{renderInlineText(inProgressCount, true)} Process Executions.</>
    ) : (
      <>
        {renderInlineText(inProgressCount, true)} of your {renderInlineText(executionsCount, true)} selected executions,
        as only in progress executions are eligible to be canceled.
      </>
    );

  return (
    <StyledFlex alignItems="center" justifyContent="center" mt="5px" gap="15px 0" width="417px">
      <StyledText size={14} lh={21}>
        {renderMessageStart({ isBulk: isBulkCancel, bulkCancelText })}
        {renderInlineText(' This action cannot be undone. Are you sure you want to proceed?')}
      </StyledText>
      {!isBulkCancel &&
        renderSingleProcessDetails({
          processName: executions?.[0]?.projectName,
          processId: `#${executions?.[0]?.procInstanceId}`,
        })}
    </StyledFlex>
  );
};

export default ConfirmModalTextContent;
