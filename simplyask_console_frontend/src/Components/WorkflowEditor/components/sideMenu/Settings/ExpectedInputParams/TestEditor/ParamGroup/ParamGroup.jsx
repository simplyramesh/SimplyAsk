import Accordion from '../../../../../Accordian/Accordion';
import { Button, Typography } from '../../../../base';
import ParamList from '../../../../base/inputs/ApiParamList/ParamList';
import ParameterCardText from '../../../../base/Typography/ParameterCardText';
import { Content } from '../../../../wrappers';
import ParamSetHeading from '../ParamSetHeading/ParamSetHeading';

import { StyledFlex } from '../../../../../../../shared/styles/styled';

const ParamGroup = ({
  groupHeading,
  inputParams,
  onEditParamSetName,
  onDeleteParamSet,
  onEdit,
  onDelete,
  onAddNewParam,
}) => {
  const inputParamsInfo = {
    hasInputParams: [...inputParams?.staticInputParams, ...inputParams?.dynamicInputParams]?.length > 0,
    length: [...inputParams?.staticInputParams, ...inputParams?.dynamicInputParams]?.length,
  };

  const title = (
    <ParamSetHeading
      disableActions={true}
      paramGroupName={groupHeading}
      onEdit={onEditParamSetName}
      onDelete={onDeleteParamSet}
    />
  );
  const subHeading = inputParamsInfo.hasInputParams ? (
    <Typography as="p" variant="small" weight="medium">
      {`${inputParamsInfo.length} Parameter${inputParamsInfo.length > 1 ? 's' : ''}`}
    </Typography>
  ) : null;

  return (
    <StyledFlex gap="14px">
      <Accordion title={title} subHeading={subHeading}>
        {inputParams?.staticInputParams.map((param, index) => (
          <ParamList
            key={`${param.paramName}-${index}`}
            editProps={{
              id: 'editBtn',
              onClick: () => onEdit(param, 'staticInputParams', index),
            }}
            onDeleteClick={() =>
              onDelete('deleteBtn', { paramName: param.paramName, type: 'staticInputParams' }, index)
            }
            deleteProps={{
              id: 'deleteBtn',
              onClick: (e) => onDelete(e, { paramName: param.paramName, type: 'staticInputParams' }, index),
            }}
          >
            <ParameterCardText title={param.paramName}>
              {({ renderParamCardOption }) => (
                <>
                  {renderParamCardOption({
                    paramValueName: 'Value',
                    paramType: !param?.value ? 'Dynamic' : 'Static',
                    paramValue: !param.value && param.isRequired ? 'Mandatory' : param?.value || 'Optional',
                    maxLines: 1,
                  })}
                  {renderParamCardOption({
                    paramValueName: 'Data Type',
                    paramValue: param.validationType,
                    maxLines: 1,
                  })}
                </>
              )}
            </ParameterCardText>
          </ParamList>
        ))}
        {inputParams?.dynamicInputParams.map((param, index) => (
          <ParamList
            key={param.paramName}
            editProps={{
              id: 'editBtn',
              onClick: () => onEdit(param, 'dynamicInputParams', index),
            }}
            onDeleteClick={() =>
              onDelete('deleteBtn', { paramName: param.paramName, type: 'dynamicInputParams' }, index)
            }
            deleteProps={{
              id: 'deleteBtn',
              onClick: (e) => onDelete(e, { paramName: param.paramName, type: 'dynamicInputParams' }, index),
            }}
          >
            <ParameterCardText title={param.paramName}>
              {({ renderParamCardOption }) => (
                <>
                  {renderParamCardOption({
                    paramValueName: 'Value',
                    paramType: !param?.value ? 'Dynamic' : 'Static',
                    paramValue: !param.value && param.isRequired ? 'Mandatory' : param?.value || 'Optional',
                    maxLines: 1,
                  })}
                  {renderParamCardOption({
                    paramValueName: 'Data Type',
                    paramValue: param.validationType,
                    maxLines: 1,
                  })}
                </>
              )}
            </ParameterCardText>
          </ParamList>
        ))}
      </Accordion>
      <Content>
        {onAddNewParam && <Button text="Add a New Parameter" variant="outline" flexWidth onClick={onAddNewParam} />}
      </Content>
    </StyledFlex>
  );
};

export default ParamGroup;
