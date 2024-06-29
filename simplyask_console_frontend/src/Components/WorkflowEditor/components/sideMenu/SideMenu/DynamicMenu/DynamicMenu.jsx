/* eslint-disable react/jsx-key */
import { useFormik } from 'formik';
import { MultiDirectedGraph } from 'graphology';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistoricalRecoilState } from '../../../../hooks/useHistoricalRecoilState';
import { updateNode } from '../../../../services/graph';
import { getNodesValidationInfo } from '../../../../services/layout';
import { handleRemoveStep } from '../../../../utils/helperFunctions';
import { getValidatedParams } from '../../../../utils/validation';
import { Divider } from '../../base';
import { RequestConfigTitle } from '../../sub';
import { Content, Scrollable } from '../../wrappers';
import { STEP_PARAMS } from '../keyConstants';

import SideMenuCard from '../SideMenuCard/SideMenuCard';
import SideMenuHeader from '../SideMenuHeader/SideMenuHeader';
import DynamicMenuFields from './DynamicMenuFields/DynamicMenuFields';
import DynamicMenuParamsForms from './DynamicMenuParamsForms/DynamicMenuParamsForms';

const DynamicMenu = ({ stepId, onClose }) => {
  const [paramOpened, setParamOpened] = useState(null);

  const { set, state } = useHistoricalRecoilState();

  const { workflow, editingStep } = state;

  const graph = useMemo(() => new MultiDirectedGraph().import(workflow), [state]);

  const step = graph.getNodeAttributes(stepId);

  const { stepIcon, displayName, stepInputParameters, stepOutputParameters } = step;

  const { values, errors } = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues: {
      stepOutputParameters: stepOutputParameters ?? [],
      stepInputParameters,
      displayName,
    },
    validate: (values) => {
      const stepInputParameters = getValidatedParams(values, STEP_PARAMS.INPUT) || [];
      const stepOutputParameters = getValidatedParams(values, STEP_PARAMS.OUTPUT) || [];

      return { stepInputParameters, stepOutputParameters };
    },
  });

  const allParams = [...(values.stepInputParameters || []), ...(values.stepOutputParameters || [])];
  const { hasError, hasWarning, countOfRequiredFields, completedRequiredFields } = getNodesValidationInfo(allParams);

  const handleDisplayNameChange = (value) => {
    updateNode(graph, stepId, { displayName: value });

    set({ ...state, workflow: graph.export() });
  };

  const handleStepRemove = () => {
    handleRemoveStep({ graph, stepId, editingStep, set, state });
  };

  useEffect(() => {
    updateNode(graph, stepId, { hasError, hasWarning: hasWarning && !hasError });

    set({ ...state, workflow: graph.export() });
  }, [hasError, hasWarning]);

  const renderConfiguration = ({ paramsName, title }) => {
    if (!values[paramsName].length) return null;

    return (
      <>
        <Divider color="gray" />
        <Content>{title}</Content>

        <Content gap={26}>
          <DynamicMenuFields
            paramsName={paramsName}
            values={values}
            errors={errors}
            step={step}
            meta={{
              setParamOpened,
            }}
          />
        </Content>
      </>
    );
  };

  const renderParamForm = () => (
    <DynamicMenuParamsForms
      paramOpened={paramOpened}
      step={step}
      meta={{
        setParamOpened,
      }}
    />
  );

  const renderDynamicForm = () => (
    <>
      <SideMenuHeader text={displayName} withColor closeIcon onClose={onClose} onRemoveStepClick={handleStepRemove} />
      <Scrollable>
        <Content variant="group">
          <Content>
            <SideMenuCard
              displayName={values.displayName}
              stepId={stepId}
              stepIcon={stepIcon}
              error={errors.displayName}
              onChange={handleDisplayNameChange}
            />
          </Content>

          {/* Request Configuration */}

          {renderConfiguration({
            paramsName: STEP_PARAMS.INPUT,
            title: (
              <RequestConfigTitle
                title="Request Configuration"
                withValidation
                required={countOfRequiredFields}
                completed={completedRequiredFields}
              />
            ),
          })}

          {/* Response Configuration */}

          {renderConfiguration({
            paramsName: STEP_PARAMS.OUTPUT,
            title: <RequestConfigTitle title="Output Configuration" />,
          })}
        </Content>
      </Scrollable>
    </>
  );

  return <>{paramOpened ? renderParamForm() : renderDynamicForm()}</>;
};

export default DynamicMenu;

DynamicMenu.propTypes = {
  stepId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClose: PropTypes.func,
};
