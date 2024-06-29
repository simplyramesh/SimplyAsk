import { AddRounded, InfoOutlined } from '@mui/icons-material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTheme } from '@mui/system';
import React, { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

import FormErrorMessage from '../../../../../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import BaseTextInput from '../../../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import TrashBinIcon from '../../../../../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';
import CustomSelect from '../../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { IconOption } from '../../../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/IconOption';
import { StyledTooltip } from '../../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import {
  StyledDivider,
  StyledFlex,
  StyledIconButton,
  StyledSwitch,
} from '../../../../../../../../shared/styles/styled';
import SidebarGenerateVariant from '../../../../../../../shared/components/SidebarGenerateVariant/SidebarGenerateVariant';
import { INTENT_PARAMETER_COLORS, paramTypeOptions } from '../../../../../constants/common';
import { intentsParameterTemplate } from '../../../../../utils/defaultTemplates';
import { IntentsContext } from '../../IntentsContex';

import ParamColorIndicator from './ColorIndicator';

const IntentsCreateOrEditInputs = ({
  values,
  setFieldValue,
  errors,
  touched,
  isCurrentIntentGlobal,
  submitIntentTrainingPhrases,
}) => {
  const { colors } = useTheme();
  const [paramBlurTrigger, setParamBlurTrigger] = useState(0);

  const isGenerateVariantDisabled = values.name.length < 1;

  const onGenerateVariant = (num) => {
    const payload = {
      params: `intents=${values.name}&noOfPhrases=${num}&isTrainingBot=true`,
      body: values.trainingPhrases?.map((item) => item.value),
    };

    submitIntentTrainingPhrases(payload);
  };

  const getUniqueColorForIntentParams = (usedBgColors = []) => {
    const uniqueColor = INTENT_PARAMETER_COLORS.find((color) => !usedBgColors?.includes(color.BG_COLOR));

    return uniqueColor || INTENT_PARAMETER_COLORS[Math.floor(Math.random() * INTENT_PARAMETER_COLORS.length)];
  };

  const handleAddNewParameter = () => {
    const getAllUsedBgColors = values.parameters?.map((param) => param.bgColor);
    setFieldValue('parameters', [
      ...values.parameters,
      intentsParameterTemplate(getUniqueColorForIntentParams(getAllUsedBgColors)),
    ]);
  };

  const handleDeleteParameter = (id) => {
    setFieldValue(
      'parameters',
      values.parameters?.filter((item) => item?.id !== id)
    );
  };

  const onParameterChange = (id, key, value) => {
    setFieldValue(
      'parameters',
      values.parameters?.map((item) => (item?.id === id ? { ...item, [key]: value } : item))
    );
  };

  return (
    <IntentsContext.Provider value={{ ...values, paramBlurTrigger, setParamBlurTrigger }}>
      <StyledFlex height="calc(100% - 100px)">
        <Scrollbars>
          <StyledFlex p="0 20px">
            <StyledFlex margin="30px 0 40px 0">
              <StyledFlex direction="column" flex="auto" width="100%" mb="35px">
                <InputLabel label="Name" size={15} mb={14} />
                <BaseTextInput
                  name="intentName"
                  placeholder="Enter a name for your intent..."
                  value={values.name}
                  onChange={(e) => setFieldValue('name', e.target.value)}
                  invalid={errors.name && touched.name}
                  fontSize="15px"
                />
                {errors.name && touched.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
              </StyledFlex>

              <StyledFlex direction="column" flex="auto" width="100%" mb="35px">
                <StyledFlex direction="row" alignItems="center" justifyContent="space-between" fontSize="15px">
                  <StyledFlex direction="row" alignItems="center" justifyContent="center" gap="0 10px">
                    <InputLabel label="Parameters" name="parameters" size={15} weight={600} mb={0} lh={24} />
                    <StyledTooltip
                      arrow
                      placement="top"
                      title="Parameters are used to capture values from end-user statements. Each parameter must have a Parameter Name and Type.
                       Parameters do not need to be used in each Training Phrase. To assign a Parameter to a Training Phrase, click and drag to highlight the desired text. Once you let go, a prompt will appear, allowing you assign a Parameter."
                      maxWidth="auto"
                      p="10px 15px"
                    >
                      <InfoOutlined fontSize="inherit" />
                    </StyledTooltip>
                  </StyledFlex>
                  <StyledButton startIcon={<AddRounded />} variant="text" onClick={handleAddNewParameter}>
                    Add Parameter
                  </StyledButton>
                </StyledFlex>
                <StyledFlex direction="column" flex="auto" width="100%" position="relative" marginTop="10px">
                  <StyledFlex gap="17px">
                    {values.parameters?.map((param) => (
                      <StyledFlex key={param.id} direction="row" alignItems="center" position="relative">
                        <ParamColorIndicator id={param.id} bgColor={param.bgColor} />
                        <StyledFlex
                          marginLeft="10px"
                          direction="row"
                          gap="10px"
                          flex="1"
                          marginRight="12px"
                          justifyContent="space-between"
                        >
                          <StyledFlex minWidth="188px">
                            <BaseTextInput
                              name="parameterName"
                              placeholder="Parameter Name..."
                              value={param.paramName}
                              onChange={(e) => onParameterChange(param.id, 'paramName', e.target.value)}
                              onBlur={() => setParamBlurTrigger(paramBlurTrigger + 1)}
                              fontSize="15px"
                            />
                          </StyledFlex>

                          <CustomSelect
                            menuPlacement="auto"
                            placeholder="param.type"
                            options={paramTypeOptions}
                            getOptionValue={({ value }) => value}
                            closeMenuOnSelect
                            isClearable={false}
                            isSearchable={false}
                            value={paramTypeOptions.find(({ value }) => value === param.paramType)}
                            onChange={({ value }) => {
                              onParameterChange(param.id, 'paramType', value);
                              setParamBlurTrigger(paramBlurTrigger + 1);
                            }}
                            components={{
                              DropdownIndicator: CustomIndicatorArrow,
                              Option: IconOption,
                            }}
                            maxHeight={30}
                            menuPadding={0}
                            controlTextHidden
                            menuPortalTarget={document.body}
                            form
                          />
                        </StyledFlex>

                        <StyledTooltip arrow placement="top" title="Delete" p="10px 15px">
                          <StyledFlex as="span">
                            <StyledIconButton
                              size="34px"
                              iconSize="22px"
                              onClick={() => handleDeleteParameter(param.id)}
                            >
                              <TrashBinIcon />
                            </StyledIconButton>
                          </StyledFlex>
                        </StyledTooltip>
                      </StyledFlex>
                    ))}
                  </StyledFlex>
                </StyledFlex>
              </StyledFlex>

              <StyledFlex direction="column" flex="auto" width="100%" position="relative">
                <SidebarGenerateVariant
                  labelTooltipTitle="Training Phrases enable the system to understand what end-users might say when they are expressing a given Intent.
                  You do not need to provide all possible phrases a user might say, however, we recommend using at least 8-10 unique phrases for optimal performance"
                  label="Training Phrases"
                  addButtonText="Add Phrase"
                  btnTooltipTitle="You must provide at least a Name in order to auto-generate variants for this Intent. You cannot auto-generate using only Training Phrases."
                  autoGenerateBtnType="Phrases"
                  inputPlaceholder="Enter a message..."
                  onGenerateVariant={onGenerateVariant}
                  onChange={(phrasesInputArray) => setFieldValue('trainingPhrases', phrasesInputArray)}
                  errors={errors.trainingPhrases}
                  touched={touched.trainingPhrases}
                  values={values.trainingPhrases}
                  isGenerateVariantDisabled={isGenerateVariantDisabled}
                  richTextEditorField
                />
              </StyledFlex>

              <StyledDivider borderWidth={1.5} color={colors.cardGridItemBorder} m="30px -20px 25px -20px" />

              {!isCurrentIntentGlobal && (
                <StyledFlex
                  direction="row"
                  position="relative"
                  justifyContent="space-between"
                  alignItems="center"
                  marginBottom="50px"
                >
                  <InputLabel label="Change into a Global Intent" size={15} mb={0} />
                  <StyledTooltip
                    title="Making an intent global will make it available in all agent editors. This is a permanent, and cannot be changed once saved."
                    arrow
                    placement="top"
                    p="10px"
                    maxWidth="auto"
                  >
                    <InfoOutlinedIcon
                      sx={{
                        color: colors.charcoal,
                        position: 'absolute',
                        left: '227px',
                        fontSize: '19px',
                      }}
                    />
                  </StyledTooltip>
                  <StyledSwitch
                    name="isGlobalIntent"
                    checked={values.isGlobalIntent}
                    onChange={(e) => {
                      setFieldValue('isGlobalIntent', e.target.checked);
                    }}
                  />
                </StyledFlex>
              )}
            </StyledFlex>
          </StyledFlex>
        </Scrollbars>
      </StyledFlex>
    </IntentsContext.Provider>
  );
};

export default IntentsCreateOrEditInputs;
