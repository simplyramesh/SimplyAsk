import React, { memo, useContext, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { TransformWrapper } from 'react-zoom-pan-pinch';

import { panConfig } from '../../constants/layout';
import { useHistoricalRecoilState } from '../../hooks/useHistoricalRecoilState';
import { WorkflowEditorConfig } from '../../WorkflowEditorConfig';

const WorkflowEditorCoreWrapper = ({ children }) => {
  const config = useContext(WorkflowEditorConfig);
  const [wheelZoomValue, setWheelZoomValue] = useState();

  const { undo, redo, set, state } = useHistoricalRecoilState();

  useHotkeys(
    'ctrl+z',
    () => {
      undo();
    },
    [state, set, undo]
  );

  useHotkeys(
    'ctrl+y',
    () => {
      redo();
    },
    [state, set, redo]
  );

  const onZoomStop = (ref) => !!ref?.state?.scale && setWheelZoomValue(ref?.state?.scale);

  return (
    <TransformWrapper {...panConfig(config.paneConfig)} onZoomStop={onZoomStop}>
      {({ resetTransform, zoomToElement }) => children({ resetTransform, zoomToElement, wheelZoomValue })}
    </TransformWrapper>
  );
};

export default memo(WorkflowEditorCoreWrapper);
