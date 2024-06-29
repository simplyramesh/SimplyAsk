import React from 'react';

import BaseTextArea from '../../../../../../../shared/REDISIGNED/controls/BaseTextArea/BaseTextArea';
import BaseTextInput from '../../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import InputLabel from '../../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import {
  StyledFlex,
} from '../../../../../../../shared/styles/styled';
import FormErrorMessage from '../../../../../../AccessManagement/components/FormErrorMessage/FormErrorMessage';

const ChatWidgetGeneralSetting = ({
  values,
  errors,
  touched,
  setFieldValue,
}) => (
  <StyledFlex
    flex="auto"
    p="25px"
  >
    <StyledFlex direction="column" flex="auto" width="100%" mb="30px">
      <InputLabel label="Name" size={16} mb={10} />
      <BaseTextInput
        name="name"
        placeholder="Enter Name of Chat Widget..."
        value={values.name}
        onChange={(e) => setFieldValue('name', (e.target.value))}
        invalid={errors.name && touched.name}
      />
      {(errors.name && touched.name) && <FormErrorMessage>{errors.name}</FormErrorMessage>}
    </StyledFlex>
    <StyledFlex direction="column" flex="auto" width="100%">
      <InputLabel label="Description" size={16} mb={10} />
      <BaseTextArea
        name="description"
        placeholder="Enter Description of Chat Widget..."
        value={values.description}
        onChange={(e) => setFieldValue('description', (e.target.value))}
        height="100px"
      />
    </StyledFlex>
  </StyledFlex>
);

export default ChatWidgetGeneralSetting;
