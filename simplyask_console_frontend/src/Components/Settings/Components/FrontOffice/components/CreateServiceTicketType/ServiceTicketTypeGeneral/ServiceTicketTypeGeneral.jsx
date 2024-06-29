import { useState } from 'react';

import EditIcon from '../../../../../../../Assets/icons/EditIcon.svg?component';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { StyledFlex, StyledText, StyledCard } from '../../../../../../shared/styles/styled';
import FormErrorMessage from '../../../../../AccessManagement/components/FormErrorMessage/FormErrorMessage';
import ServiceTypeIconPreview from '../../shared/ServiceTypeIconPreview';
import { StyledServiceTicketTypeTextField } from '../../shared/StyledServiceTicketTypes';

import ServiceTicketTypeChangeIcon from './ServiceTicketTypeChangeIcon/ServiceTicketTypeChangeIcon';

const ServiceTicketTypeGeneral = ({ values, setFieldValue, errors, handleChange, touched, handleBlur }) => {
  const [isChangeIconOpen, setIsChangeIconOpen] = useState(false);

  return (
    <>
      <StyledCard p="30px 36px">
        <StyledText weight={600} size={19} lh={28} mb={2}>
          General
        </StyledText>
        <StyledText>
          Configure the name of your ticket type, its description, and the icon associated with it.
        </StyledText>
        <StyledFlex direction="column" flex="auto" maxWidth="545px" mt={5}>
          <InputLabel label="Name" isOptional={false} size={16} weight={600} />
          <StyledServiceTicketTypeTextField
            multiline
            maxRows={5}
            name="name"
            id="name"
            placeholder="Enter a name for your type..."
            value={values.name}
            onChange={handleChange}
            invalid={errors.name && touched.name}
            onBlur={handleBlur}
          />
          {errors.name && touched.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
        </StyledFlex>
        <StyledFlex direction="column" flex="auto" maxWidth="545px" mt={5}>
          <InputLabel label="Description" isOptional size={16} weight={600} />
          <StyledServiceTicketTypeTextField
            name="description"
            placeholder="Enter a description for your type..."
            value={values.description}
            onChange={handleChange}
            invalid={errors.description && touched.description}
            onBlur={handleBlur}
            multiline
            maxRows={5}
          />
          {errors.description && touched.description && <FormErrorMessage>{errors.description}</FormErrorMessage>}
        </StyledFlex>
        <StyledText display="inline" size={16} mt={36} mb={5} weight={600}>
          Icon
        </StyledText>
        <StyledFlex width="96px">
          <StyledButton
            variant="outlined"
            grey
            type="submit"
            onClick={() => setIsChangeIconOpen(true)}
            startIcon={<ServiceTypeIconPreview icon={values.icon} iconColour={values.iconColour} />}
            endIcon={<EditIcon width="17px" height="17px" />}
          />
        </StyledFlex>
      </StyledCard>

      <ServiceTicketTypeChangeIcon
        values={values}
        isOpen={isChangeIconOpen}
        onClose={() => setIsChangeIconOpen(false)}
        onSave={({ icon, iconColour }) => {
          setFieldValue('icon', icon);
          setFieldValue('iconColour', iconColour);
        }}
      />
    </>
  );
};

export default ServiceTicketTypeGeneral;
