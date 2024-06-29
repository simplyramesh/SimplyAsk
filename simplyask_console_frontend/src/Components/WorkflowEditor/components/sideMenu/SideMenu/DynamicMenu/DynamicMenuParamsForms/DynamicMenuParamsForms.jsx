import { MultiDirectedGraph } from 'graphology';
import React, { useMemo } from 'react';

import { promptText } from '../../../../../constants/graph';
import { useHistoricalRecoilState } from '../../../../../hooks/useHistoricalRecoilState';
import { updateNode } from '../../../../../services/graph';
import SpreadsheetBuilder from '../../../../SpreadsheetBuilder/SpreadsheetBuilder';
import { updateAllSpreadsheetsAfterCurrent } from '../../../../SpreadsheetBuilder/utils/spreadsheet';
import APIRequestParametersForm from '../../../ParametersForm/APIRequestParametersForm/APIRequestParametersForm';
import ExcelExtractionForm from '../../../ParametersForm/ExcelExtractionForm/ExcelExtractionForm';
import OutputParameterAndMapperForm from '../../../ParametersForm/OutputParameterAndMapperForm/OutputParameterAndMapperForm';
import OutputParameterNewValuesForm from '../../../ParametersForm/OutputParameterNewValuesForm/OutputParameterNewValuesForm';
import RpaExtractionForm from '../../../ParametersForm/RpaExtractionForm/RpaExtractionForm';

const DynamicMenuParamsForms = ({
  paramOpened, meta, step,
}) => {
  const {
    set, state,
  } = useHistoricalRecoilState();

  const { workflow } = state;

  const graph = useMemo(() => new MultiDirectedGraph().import(workflow), [state]);

  const prompt = paramOpened.stepSettingTemplate.promptText;
  const handleServiceRequestFieldChange = ({
    index, paramsName, value, indexToEdit,
  }) => {
    const mappedParams = step[paramsName]?.map((param, i) => {
      if (index === i) {
        let currentValue;

        if (indexToEdit >= 0) {
          currentValue = param.currentValue?.map((v, i) => {
            if (i === indexToEdit) {
              return value;
            }

            return v;
          });
        } else {
          currentValue = param.currentValue ? [...param.currentValue, value] : [value];
        }

        return {
          ...param,
          currentValue,
        };
      }

      return param;
    });

    updateNode(graph, step.stepId, { [paramsName]: mappedParams });

    set({ ...state, workflow: graph.export() });
    meta.setParamOpened(null);
  };
  const handleSpreadsheetChange = ({ index, paramsName, value: currentValue }) => {
    const mappedParams = step[paramsName]?.map((param, i) => {
      if (index === i) {
        return {
          ...param,
          currentValue,
        };
      }

      return param;
    });

    // update current spreadsheet value
    updateNode(graph, step.stepId, { [paramsName]: mappedParams });

    // update all spreadsheets after current
    updateAllSpreadsheetsAfterCurrent(graph, step.stepId, currentValue);

    set({ ...state, workflow: graph.export() });
    meta.setParamOpened(null);
  };

  return (
    <>
      {[
        promptText.API_REQUEST_BODY,
        promptText.API_REQUEST_HEADERS,
        promptText.SERVICE_REQUEST_FIELD_MAPPING,
      ].includes(prompt) && (
        <APIRequestParametersForm
          step={step}
          param={paramOpened}
          onClose={() => meta.setParamOpened(null)}
          onConfirm={(value, indexToEdit) => handleServiceRequestFieldChange({
            index: paramOpened.index, paramsName: paramOpened.paramsName, value, indexToEdit,
          })}
        />
      )}

      {prompt === promptText.API_RESPONSE_DATA && (
        <OutputParameterAndMapperForm
          param={paramOpened}
          onClose={() => meta.setParamOpened(null)}
          onConfirm={(value, indexToEdit) => handleServiceRequestFieldChange({
            index: paramOpened.index, paramsName: paramOpened.paramsName, value, indexToEdit,
          })}
        />
      )}

      {prompt === promptText.SPREADSHEET_TARGET_DATA && (
        <ExcelExtractionForm
          param={paramOpened}
          onClose={() => meta.setParamOpened(null)}
          onConfirm={(value, indexToEdit) => handleServiceRequestFieldChange({
            index: paramOpened.index, paramsName: paramOpened.paramsName, value, indexToEdit,
          })}
        />
      )}
      {prompt === promptText.RPA_FORUM_TARGET_DATA && (
        <RpaExtractionForm
          param={paramOpened}
          onClose={() => meta.setParamOpened(null)}
          onConfirm={(value, indexToEdit) => handleServiceRequestFieldChange({
            index: paramOpened.index, paramsName: paramOpened.paramsName, value, indexToEdit,
          })}
        />
      )}

      {prompt === promptText.PARAM_NAME && (
        <OutputParameterNewValuesForm
          param={paramOpened}
          onClose={() => meta.setParamOpened(null)}
          onConfirm={(value, indexToEdit) => handleServiceRequestFieldChange({
            index: paramOpened.index, paramsName: paramOpened.paramsName, value, indexToEdit,
          })}
        />
      )}

      <SpreadsheetBuilder
        step={step}
        param={paramOpened}
        open={prompt === promptText.SPREADSHEET_EDITOR}
        onClose={() => meta.setParamOpened(null)}
        onSave={(value) => handleSpreadsheetChange({ index: paramOpened.index, paramsName: paramOpened.paramsName, value })}
      />
    </>
  );
};

export default DynamicMenuParamsForms;
