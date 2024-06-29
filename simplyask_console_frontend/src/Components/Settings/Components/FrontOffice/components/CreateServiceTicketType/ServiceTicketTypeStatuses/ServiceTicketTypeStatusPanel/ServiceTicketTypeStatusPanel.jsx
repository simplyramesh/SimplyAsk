import { useTheme } from '@mui/material/styles';
import { StyledColourButton, StyledColourButtonSelected, StyledDivider, StyledFlex, StyledStatus } from "../../../../../../../shared/styles/styled";
import BaseTextInput from '../../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';

import InputLabel from '../../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { STATUSES_COLORS_OPTIONS } from '../../../../constants/iconConstants';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import FormErrorMessage from '../../../../../../AccessManagement/components/FormErrorMessage/FormErrorMessage';

const ServiceTicketTypeStatusPanel = ({ form }) => {
  const { touched, errors, values, setFieldValue } = form;
  const { colors } = useTheme();

  return (
    <StyledFlex>
      <StyledDivider
        borderWidth={2}
        color={colors.cardGridItemBorder} />
      <StyledFlex p="30px 20px" alignItems="flex-start">
        <InputLabel label="Preview" size={16} lh={24}/>
        <StyledStatus
          minWidth="auto"
          textColor={STATUSES_COLORS_OPTIONS[values.colour]?.primary}
          bgColor={STATUSES_COLORS_OPTIONS[values.colour]?.secondary}
        >
          {values.name || 'Status Name'}
        </StyledStatus>
      </StyledFlex>
      <StyledDivider
        borderWidth={2}
        color={colors.cardGridItemBorder} />

      <StyledFlex p="30px 20px">
        <InputLabel label="Name" size={16} lh={24}/>
        <BaseTextInput
          value={values.name}
          maxLength={15}
          onChange={(e) => setFieldValue('name', e.target.value)}
          invalid={errors.name && touched.name}
          showLength
        />
        {(errors.name && touched?.name) && <FormErrorMessage>{errors.name}</FormErrorMessage>}
      </StyledFlex>

      <StyledFlex p="0 20px">
        <InputLabel label="Colour" size={16} lh={24}/>

        <StyledFlex direction="row" flexWrap="wrap" gap="23px">
          { Object.keys(STATUSES_COLORS_OPTIONS).map((key, index) => (
            <StyledColourButton
              key={index}
              isSelected={key === values.colour}
              bgColor={STATUSES_COLORS_OPTIONS[key].secondary}
              textColor={STATUSES_COLORS_OPTIONS[key].primary}
              onClick={() => setFieldValue('colour', key)}
            >
              <StyledColourButtonSelected>
                <CheckRoundedIcon />
              </StyledColourButtonSelected>
            </StyledColourButton>
          ))}
        </StyledFlex>
      </StyledFlex>
    </StyledFlex>
  );
};

export default ServiceTicketTypeStatusPanel;
