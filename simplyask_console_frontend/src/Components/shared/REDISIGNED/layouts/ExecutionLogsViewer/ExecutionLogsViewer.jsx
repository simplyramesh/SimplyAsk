import React, { useState } from 'react';
import { Lightbox } from 'react-modal-image';
import { Portal } from 'react-portal';
import { Timeline } from 'simplexiar_react_components';

import CollapseIcon from '../../../../../Assets/icons/collapse.svg?component';
import { getColorByType, getTitleForTimeline, TEST_HISTORY_KEYS } from '../../../../../config/test';
import { StyledFlex, StyledText } from '../../../styles/styled';
import { StyledButton } from '../../controls/Button/StyledButton';

import AdditionalInfo from './AdditionalInfo/AdditionalInfo';
import ReadMore from './ReadMore/ReadMore';
import { StyledImg } from './StyledExecutionLogsViewer';

const ExecutionLogsViewer = ({ logs = [] }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [isExpandedAll, setIsExpandedAll] = useState(false);
  const [localLogs, setLocalLogs] = useState(logs);
  const isSomeOutputsPresent = localLogs?.some((l) => l.outputs?.length !== 0);

  const handleToggleAll = () => {
    const modifiedOpenedLogs = localLogs?.map((item) => ({
      ...item,
      opened: !isExpandedAll,
    }));
    setLocalLogs(modifiedOpenedLogs);

    setIsExpandedAll((prev) => !prev);
  };

  const handleToggleIndividual = (index) => {
    const updatedLogs = localLogs?.map((item, idx) => {
      if (index === idx) {
        return { ...item, opened: !item.opened };
      }

      return item;
    });

    setLocalLogs(updatedLogs);
  };

  const getTimelineData = (data, onImageClick, onToggle) =>
    data?.map((item, index) => ({
      color: getColorByType(item[TEST_HISTORY_KEYS.TYPE]),
      createdDate: item[TEST_HISTORY_KEYS.CREATED_DATE],
      description: item[TEST_HISTORY_KEYS.TITLE],
      title: getTitleForTimeline(item[TEST_HISTORY_KEYS.TYPE]),
      template: (
        <>
          <ReadMore text={item.errorMessage} />
          {!!item.images?.length && (
            <StyledFlex padding="26px 0 5px">
              {item.images?.map((img, idx) => {
                const image = `data:image/png;base64, ${img}`;

                return (
                  <StyledImg
                    key={idx}
                    onClick={() => onImageClick({ src: image, description: item.description })}
                    src={image}
                    alt="localLogs"
                  />
                );
              })}
            </StyledFlex>
          )}
          {!!item.outputs?.length && (
            <AdditionalInfo opened={item.opened} onToggle={() => onToggle(index)} outputs={item.outputs} />
          )}
        </>
      ),
    }));

  return (
    <StyledFlex>
      <StyledFlex direction="row" justifyContent="space-between" marginBottom="20px" alignItems="center">
        <StyledText size={19} weight={600}>
          Execution Logs
        </StyledText>

        <StyledButton
          variant="text"
          disabled={!isSomeOutputsPresent}
          onClick={handleToggleAll}
          fontSize={16}
          startIcon={<CollapseIcon width={16} height={16} />}
        >
          {isExpandedAll ? 'Collapse' : 'Expand'} All Additional Information
        </StyledButton>
      </StyledFlex>

      {localLogs?.length ? (
        <Timeline data={getTimelineData(localLogs, setPreviewImage, (index) => handleToggleIndividual(index))} />
      ) : (
        <StyledText>No Logs found</StyledText>
      )}
      {previewImage && (
        <Portal>
          <Lightbox
            medium={previewImage.src}
            large={previewImage.src}
            alt={previewImage.description}
            onClose={() => setPreviewImage(null)}
          />
        </Portal>
      )}
    </StyledFlex>
  );
};

export default ExecutionLogsViewer;
