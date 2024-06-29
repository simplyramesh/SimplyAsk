import PropTypes from 'prop-types';

import ParameterCardText from '../../Typography/ParameterCardText';
import ParamList from './ParamList';

const ApiParamList = ({
  param, onDeleteClick, onEditClick,
}) => {
  const paramName = param.label || param.value.paramName;
  const processParamName = param.value.paramName;
  const validationType = param.value?.validationType || param.value?.value?.validationType || param.value?.paramType || param.value?.value?.paramType;

  // TODO: should be splitted to different components
  const val = typeof param.value === 'string' ? param.value : '';
  const val1 = typeof param.value?.value === 'string' ? param.value.value : '';

  const paramValue = param.value?.value?.value || val1 || val;
  const paramType = paramValue && !param.value?.value?.value
    ? 'Static'
    : 'Dynamic';

  return (
    <ParamList onDeleteClick={onDeleteClick} onEditClick={onEditClick}>
      <ParameterCardText title={(processParamName && typeof processParamName === 'string' && processParamName) || paramName}>
        {({ renderParamCardOption }) => (
          <>
            {renderParamCardOption({
              paramValueName: 'Value',
              paramType,
              paramValue: param.value?.value ? param.value?.value?.paramName : paramValue,
              maxLines: param.value?.value ? 2 : 1,
            })}
            {!(param.value?.value) && validationType && renderParamCardOption({
              paramValueName: 'Data Type',
              paramValue: validationType,
              maxLines: 1,
            })}
          </>
        )}
      </ParameterCardText>
    </ParamList>
  );
};

export default ApiParamList;

ApiParamList.propTypes = {
  param: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onDeleteClick: PropTypes.func,
  onEditClick: PropTypes.func,
};
