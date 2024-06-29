import PropTypes from 'prop-types';
import { useState } from 'react';

import { Button, InputField } from '../../../../base';
import { Content, LabeledField } from '../../../../wrappers';
import SettingsHeading from '../../../SettingsHeading/SettingsHeading';

const INPUT_API_KEYS = {
  NAME: 'name',
  ORDER_NUMBER: 'orderNumber',
  DYNAMIC_INPUT_PARAMS: 'dynamicInputParams',
  STATIC_INPUT_PARAMS: 'staticInputParams',
};

const replaceParamSetName = (inputParams, newParamSetName, index) => {
  const updatedInputParams = inputParams.map((param, i) => {
    return i === index ? { ...param, [INPUT_API_KEYS.NAME]: newParamSetName } : param;
  });

  return updatedInputParams;
};

const AddEditParamSetName = ({ onNav, onConfirm, paramGroup }) => {
  const [paramSetName, setParamSetName] = useState(paramGroup?.paramSetName || '');
  const [index] = useState({ isIndex: typeof paramGroup?.index === 'number', indexNum: paramGroup?.index } || null);

  const handleConfirmSetName = () => {
    if (typeof onConfirm === 'function') {
      index?.isIndex
        ? onConfirm((prev) => {
          const updatedInputParams = replaceParamSetName(prev.inputParamSets, paramSetName, index.indexNum);

          return { ...prev, inputParamSets: updatedInputParams };
        })
        : onConfirm((prev) => ({
          ...prev,
          inputParamSets: [
            ...prev.inputParamSets,
            {
              [INPUT_API_KEYS.NAME]: paramSetName,
              [INPUT_API_KEYS.ORDER_NUMBER]: prev.inputParamSets.length,
              [INPUT_API_KEYS.DYNAMIC_INPUT_PARAMS]: [],
              [INPUT_API_KEYS.STATIC_INPUT_PARAMS]: [],
            }],
        }));
    }

    setParamSetName('');
    onNav((prev) => ({ current: prev.previous, previous: prev.current }));
  };

  return (
    <>
      <SettingsHeading
        heading={!index.isIndex ? 'New Parameter Set' : `Edit ${paramGroup.paramSetName}`}
        onBackClick={() => onNav((prev) => ({ current: prev.previous, previous: prev.current }))}
        withIcon
      />
      <Content variant="outer">
        <LabeledField label="Parameter Set Name" marginBottom={10}>
          <InputField
            name="parameterSetName"
            placeholder="Enter a name for this parameter set"
            value={paramSetName}
            onChange={(e) => setParamSetName(e.target.value)}
          />
        </LabeledField>
        <Content centered variant="outer">
          <Button
            variant={paramSetName?.length > 0 ? 'filled' : 'disabled'}
            onClick={handleConfirmSetName}
            text="Confirm"
            radius="ten"
            disabled={paramSetName?.length === 0}
          />
        </Content>
      </Content>
    </>
  );
};

export default AddEditParamSetName;

AddEditParamSetName.propTypes = {
  onNav: PropTypes.func,
  onConfirm: PropTypes.func,
  paramGroup: PropTypes.shape({
    index: PropTypes.number,
    paramSetName: PropTypes.string,
  }),
};
