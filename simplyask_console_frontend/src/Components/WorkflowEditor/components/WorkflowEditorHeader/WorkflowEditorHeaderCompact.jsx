import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import CollapseIcon from '../../../../Assets/icons/collapse.svg?component';
import ExpandMoreIcon from '../../../../Assets/icons/expand.svg?component';
import { useWorkflowEditorHeader } from '../../hooks/useWorkflowEditorHeader';
import { WorkflowEditorConfig } from '../../WorkflowEditorConfig';

import ZoomControl from '../ZoomControl/ZoomControl';
import css from './WorkflowEditorHeader.module.css';

const WorkflowEditorHeaderCompact = ({ zoomToElement, wheelZoomValue }) => {
  const { isEmbeddedSideModalData, onFullScreenTriggered, fullScreen } = useContext(WorkflowEditorConfig);
  const { zoom, setZoom, isZoomInDisabled, isZoomOutDisabled, handleZoomFit, handleZoomIn, handleZoomOut } =
    useWorkflowEditorHeader({ zoomToElement, wheelZoomValue });

  return (
    <div
      className={css.WorkflowEditorHeaderCompact}
      style={{
        ...(isEmbeddedSideModalData && { top: '10px' }),
      }}
    >
      <ZoomControl
        zoom={zoom}
        isZoomInDisabled={isZoomInDisabled}
        isZoomOutDisabled={isZoomOutDisabled}
        onZoomOut={handleZoomOut}
        onZoomIn={handleZoomIn}
        onZoomFit={handleZoomFit}
        onZoomOption={setZoom}
        onZoomToElement={zoomToElement}
      />
      <button className={css.WorkflowEditorExpandBtn} onClick={() => onFullScreenTriggered(!fullScreen)}>
        {fullScreen ? (
          <CollapseIcon className={css.WorkflowEditorZoomBtnIcon} />
        ) : (
          <ExpandMoreIcon className={css.WorkflowEditorZoomBtnIcon} />
        )}
      </button>
    </div>
  );
};

WorkflowEditorHeaderCompact.propTypes = {
  zoomToElement: PropTypes.func,
  wheelZoomValue: PropTypes.number,
};

export default WorkflowEditorHeaderCompact;
