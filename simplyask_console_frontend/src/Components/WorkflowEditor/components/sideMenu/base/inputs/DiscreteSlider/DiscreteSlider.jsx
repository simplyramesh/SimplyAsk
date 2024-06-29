import React from 'react';
import { StyledKnowledgeBaseSlider } from '../../../../../../Settings/Components/General/components/SimplyAssistantKnowledgeBases/StyledSimplyAssistantKnowledgeBases';
import { StyledFlex, StyledTextField } from '../../../../../../shared/styles/styled';

const DiscreteSlider = ({ param, value, onChange }) => {
  const { step, min, max } = param?.stepSettingOptions || {};

  const handleChange = (val) => {
    if (val === '') return onChange(min);

    if (val >= min && val <= max) {
      onChange(val);
    }
  };

  return (
    <StyledFlex direction="row" alignItems="center" gap="10px">
      <StyledKnowledgeBaseSlider value={value} min={min} max={max} step={step} onChange={(e, val) => onChange(val)} />
      <StyledFlex>
        <StyledTextField
          placeholder=""
          value={parseFloat(value)}
          onChange={(e) => handleChange(e.target.value)}
          variant="standard"
          step={step}
          min={min}
          max={max}
          type="number"
          height="32px"
          minHeight="32px"
          p="4px 10px"
          width="60px"
        />
      </StyledFlex>
    </StyledFlex>
  );
};

export default DiscreteSlider;
