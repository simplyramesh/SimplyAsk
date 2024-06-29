import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import React, { memo, useState } from 'react';
import ReactJson from 'react-json-view';
import { toast } from 'react-toastify';

import TicketDetailsAttachmentsPreview from '../../Issues/components/ServiceTickets/components/shared/TicketDetailsAttachments/TicketDetailsAttachmentsPreview/TicketDetailsAttachmentsPreview';
import useIssueGetDownloadSingleAttachment from '../../Issues/hooks/useIssueGetDownloadSingleAttachment';
import NoDataFound from '../NoDataFound/NoDataFound';
import { StyledButton } from '../REDISIGNED/controls/Button/StyledButton';
import ViewOnlySignature from '../REDISIGNED/controls/Signature/ViewOnlySignature';
import InfoListGroup from '../REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../REDISIGNED/layouts/InfoList/InfoListItem';
import { StyledDivider, StyledEmptyValue, StyledFlex, StyledText } from '../styles/styled';

const FILES_TYPES = ['EXCEL', 'SQL'];

const jsonTheme = {
  // Bg color
  base00: 'rgba(45, 58, 71, 0.05)',
  base01: '#ddd',
  // Line beneath caret and to the left of expanded object or array
  base02: 'rgba(45, 58, 71, 0.25)',
  base03: '#444',
  base04: 'purple',
  base05: '#444',
  base06: '#444',
  // Key color #F57B20
  base07: '#2d3a47',
  base08: '#444',
  // Value: string color
  base09: '#E03B24',
  base0A: 'rgba(70, 70, 230, 1)',
  base0B: 'rgba(70, 70, 230, 1)',
  base0C: 'rgba(70, 70, 230, 1)',
  // Caret color (expanded)
  base0D: '#2d3a47',
  // Caret (collapsed) and Boolean color
  base0E: '#5F9936',
  // Integer color
  base0F: '#F57B20',
};

const jsonStyles = {
  fontSize: '16px',
  fontWeight: '400',
  fontFamily: '"Montserrat", sans-serif',
  flex: '1 1 auto',
  textAlign: 'left',
  overflowX: 'auto',
  borderRadius: '5px',
  padding: '8px',
};

const parsedItem = (item) => {
  try {
    let obj = item;

    if (typeof item === 'object' && !Array.isArray(item) && item !== null) {
      obj = JSON.stringify(item);
    }

    obj = JSON.parse(obj);

    if (obj && typeof obj === 'object') {
      return obj;
    }
  } catch (e) {}

  return null;
};

const ExecutionParameters = ({
  children,
  data,
  isDataStringified = true,
  noPaddings = false,
  showRootDivider = true,
  showInputParamEmptyCard = false,
  showExecutionParamEmptyCard = false,
}) => {
  const { colors } = useTheme();

  const { executionData, requestData } = data || {};
  const [showFilePreview, setShowFilePreview] = useState(null);

  const { downloadSingleAttachment, isDownloadSingleAttachmentLoading } = useIssueGetDownloadSingleAttachment({
    onSuccess: () => {
      toast.info('Downloading file. This may take a while, please wait…');
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const renderReactJson = (src) => (
    <ReactJson
      src={src}
      name={false}
      theme={jsonTheme}
      style={jsonStyles}
      enableClipboard={false}
      collapsed={false}
      displayObjectSize={false}
      displayDataTypes={false}
      collapseStringsAfterLength={15}
    />
  );

  const renderFileInfo = (val) => {
    const onFileIdClick = () => {
      setShowFilePreview({
        fileData: {
          fileName: val?.fileName,
          fileStorage: {
            referenceFileId: val?.fileId,
          },
        },
      });
    };

    return val?.fileId ? (
      <StyledFlex direction="column" justifyContent="flex-end" width="max-content">
        <StyledText textAlign="right">{val?.fileName}</StyledText>
        <StyledButton variant="text" onClick={onFileIdClick} justifycontent="flex-end">
          {val?.fileId}
        </StyledButton>
      </StyledFlex>
    ) : (
      <StyledEmptyValue />
    );
  };

  const getParsedValue = (val) => {
    const isFile = FILES_TYPES.includes(val?.fileType);
    const parsedValue = parsedItem(val);

    switch (true) {
      case parsedValue && isFile:
        return renderFileInfo(val);
      case parsedValue:
        return renderReactJson(parsedValue);
      case val.includes('-;-'):
        return (
          <StyledFlex>
            {val.split('-;-').map((el) => (
              <StyledText textAlign="right" key={el}>
                {el}
              </StyledText>
            ))}
          </StyledFlex>
        );
      case val.includes('data:image'):
        return (
          <StyledFlex>
            <ViewOnlySignature src={val} alt="Signature" />
          </StyledFlex>
        );
      default:
        return (
          <StyledText lh={20} textAlign="right">
            {val}
          </StyledText>
        );
    }
  };

  const getValuesArr = (obj) => {
    try {
      const parsed = JSON.parse(obj);

      return Object.keys(parsed).reduce((acc, el) => {
        acc.push({
          key: el,
          value: getParsedValue(parsed[el]),
        });

        return acc;
      }, []);
    } catch {
      return [];
    }
  };

  const renderEmptyCard = (text) => (
    <NoDataFound
      title={`There are no ${text}`}
      customStyle={{
        minHeight: '195px',
        iconSize: '66px',
        titleFontSize: '16px',
      }}
    />
  );

  const prepareData = (data) =>
    data?.reduce(
      (acc, { field, value }) => [
        ...acc,
        ...(field === 'params' ? getValuesArr(value) : [{ key: field, value: getParsedValue(value) }]),
      ],
      []
    );

  const stringifiedRequestData = isDataStringified
    ? JSON.stringify(JSON.parse(requestData || null)?.params)
    : requestData;
  const inputParams = isDataStringified ? getValuesArr(stringifiedRequestData) : prepareData(stringifiedRequestData);
  const executionParams = isDataStringified ? getValuesArr(executionData) : prepareData(executionData);

  if (!inputParams?.length && !showInputParamEmptyCard && !executionParams?.length && !showExecutionParamEmptyCard)
    return null;

  if (children) return children({ inputParams, executionParams });

  return (
    <>
      {showRootDivider && <StyledDivider color={colors.regentGray} m="40px 0 40px 0" />}
      <StyledFlex>
        <InfoListGroup noPaddings={noPaddings}>
          {(inputParams?.length || showInputParamEmptyCard) && (
            <InfoListGroup title="Input Parameters">
              {inputParams?.length
                ? inputParams?.map(({ key, value }) => (
                    <InfoListItem name={key} key={key} wordBreak="break-word">
                      {value}
                    </InfoListItem>
                  ))
                : renderEmptyCard('Input Parameters')}
            </InfoListGroup>
          )}

          {(!!executionParams?.length || showExecutionParamEmptyCard) && (
            <InfoListGroup title="Execution Parameters">
              {executionParams?.length
                ? executionParams?.map?.(({ key, value }) => (
                    <InfoListItem name={key} key={key} wordBreak="break-word">
                      {value}
                    </InfoListItem>
                  ))
                : renderEmptyCard('Execution Parameters')}
            </InfoListGroup>
          )}
        </InfoListGroup>
      </StyledFlex>

      {showFilePreview && (
        <TicketDetailsAttachmentsPreview
          setIsFilePreviewOpen={setShowFilePreview}
          downloadSingleAttachment={downloadSingleAttachment}
          isLoading={isDownloadSingleAttachmentLoading}
          isFilePreviewOpen={showFilePreview}
          isProcessHistorySideModalView
        />
      )}
    </>
  );
};

export default memo(ExecutionParameters);

ExecutionParameters.propTypes = {
  data: PropTypes.shape({
    businessKey: PropTypes.shape({
      group: PropTypes.string,
      orgId: PropTypes.string,
      source: PropTypes.string,
      user: PropTypes.string,
      uuid: PropTypes.string,
    }),
    currentTask: PropTypes.string,
    data: PropTypes.string,
    duration: PropTypes.string,
    endTime: PropTypes.string,
    header: PropTypes.string,
    procInstanceId: PropTypes.string,
    projectName: PropTypes.string,
    startTime: PropTypes.string,
    status: PropTypes.string,
    // TODO: incidentId is not in the processExecutionSideModalData structure.
    incidentId: PropTypes.string,
  }),
};
