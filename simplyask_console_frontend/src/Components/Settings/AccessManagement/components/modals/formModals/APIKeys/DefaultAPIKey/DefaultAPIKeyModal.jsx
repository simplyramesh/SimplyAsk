import { InputLabel } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as Yup from 'yup';

import { listAPIKeys } from '../../../../../../../../Services/axios/apiKeys';
import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CenterModalFixed from '../../../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import CustomIndicatorArrow from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex } from '../../../../../../../shared/styles/styled';
import FormErrorMessage from '../../../../FormErrorMessage/FormErrorMessage';

const DefaultAPIKeyModal = ({ open, onSubmit, onClose }) => {
  const [options, setOptions] = useState([]);
  const { data: allKeys } = useQuery({
    queryKey: ['listAPIKeysNonDefault'],
    queryFn: () => listAPIKeys('pageSize=1000&isDefault=false'),
  });

  const { errors, touched, isValid, handleBlur, handleSubmit, setFieldValue } = useFormik({
    initialTouched: false,
    initialValues: {
      id: '',
    },
    validationSchema: Yup.object({
      id: Yup.string().required('An API key is required'),
    }),
    onSubmit,
  });

  useEffect(() => {
    if (allKeys?.content?.length) {
      setOptions(allKeys?.content);
    }
  }, [allKeys]);

  return (
    <CenterModalFixed
      open={open}
      onClose={onClose}
      maxWidth="512px"
      title="Select Default API Key"
      actions={
        <StyledFlex direction="row" justifyContent="flex-end" width="100%">
          <StyledButton primary variant="contained" type="submit" onClick={handleSubmit} disabled={!isValid}>
            Confirm
          </StyledButton>
        </StyledFlex>
      }
    >
      <StyledFlex p="24px">
        <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
          <InputLabel label="API Key Name" />
          <CustomSelect
            id="id"
            name="id"
            options={options}
            closeMenuOnSelect
            isClearable={false}
            menuPosition="fixed"
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            onChange={(e) => setFieldValue('id', e.id)}
            onBlur={handleBlur}
            withSeparator
            invalid={errors.id && touched.id}
            components={{
              DropdownIndicator: CustomIndicatorArrow,
            }}
          />
          {errors.name && touched.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
        </StyledFlex>
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default DefaultAPIKeyModal;
