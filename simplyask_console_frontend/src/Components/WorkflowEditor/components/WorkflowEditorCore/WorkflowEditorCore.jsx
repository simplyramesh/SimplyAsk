import React, { memo, useContext } from 'react';

import { WorkflowEditorConfig } from '../../WorkflowEditorConfig';
import WorkflowEditorCoreWrapper from '../WorkflowEditorCoreWrapper/WorkflowEditorCoreWrapper';
import WorkflowEditorDrawer from '../WorkflowEditorDrawer/WorkflowEditorDrawer';
import WorkflowEditorHeader from '../WorkflowEditorHeader/WorkflowEditorHeader';
import WorkflowEditorHeaderCompact from '../WorkflowEditorHeader/WorkflowEditorHeaderCompact';

import css from './WorkflowEditorCore.module.css';

const WorkflowEditorCore = () => {
  const config = useContext(WorkflowEditorConfig);

  return (
    <WorkflowEditorCoreWrapper>
      {({
        zoomToElement,
        wheelZoomValue,
      }) => (
        <div
          className={css.WorkflowEditor}
          style={{
            ...(config?.isEmbeddedSideModalData && { position: 'relative' }),
          }}
        >
          {config.isReadOnly ? <WorkflowEditorHeaderCompact zoomToElement={zoomToElement} wheelZoomValue={wheelZoomValue} /> : (
            <div className={css.WorkflowEditorHeader}>
              <WorkflowEditorHeader zoomToElement={zoomToElement} wheelZoomValue={wheelZoomValue} />
            </div>
          )}

          <div className={css.WorkflowEditorBody}>
            <WorkflowEditorDrawer />
          </div>
        </div>
      )}
    </WorkflowEditorCoreWrapper>
  );
};

export default memo(WorkflowEditorCore);
