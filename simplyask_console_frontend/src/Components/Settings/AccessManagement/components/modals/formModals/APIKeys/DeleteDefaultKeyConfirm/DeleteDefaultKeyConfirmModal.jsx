import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as Yup from 'yup';

import { listAPIKeys } from '../../../../../../../../Services/axios/apiKeys';
import BaseTextInput from '../../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import InputLabel from '../../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import ConfirmationModal from '../../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import CustomIndicatorArrow from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex } from '../../../../../../../shared/styles/styled';
import FormErrorMessage from '../../../../FormErrorMessage/FormErrorMessage';

const DeleteDefaultKeyConfirmModal = ({ open, onClose, onSuccess }) => {
  const [options, setOptions] = useState([]);
  const [isLastKey, setIsLastKey] = useState(false);
  const { data: allKeys, isLoading } = useQuery({
    queryKey: ['listAPIKeysNonDefault'],
    queryFn: () => listAPIKeys('pageSize=1000&isDefault=false'),
  });

  useEffect(() => {
    const isLast = allKeys?.content && allKeys.content.length === 0;

    setIsLastKey(isLast);

    if (!isLast) {
      setOptions(allKeys?.content);
    }
  }, [allKeys]);

  useEffect(() => setFieldValue('isLast', isLastKey), [isLastKey]);

  const { values, errors, touched, handleBlur, handleSubmit, setFieldValue, handleChange } = useFormik({
    initialTouched: false,
    initialValues: {
      id: '',
      name: '',
      isLast: false,
    },
    validationSchema: Yup.object({
      isLast: Yup.boolean(),
      id: Yup.string().when('isLast', {
        is: false,
        then: Yup.string().required('An API key is required'),
      }),
      name: Yup.string().when('isLast', {
        is: true,
        then: Yup.string().required('An API key is required'),
      }),
    }),
    onSubmit: onSuccess,
  });

  return (
    <ConfirmationModal
      isOpen={open}
      isLoading={isLoading}
      onCloseModal={onClose}
      onSuccessClick={handleSubmit}
      successBtnText="Continue"
      alertType="WARNING"
      title="Warning!"
      text={
        !isLastKey
          ? 'You must have a Default Key. Select a new API Key below in order to continue the deletion process'
          : 'You must have at least 1 API Key. Create a new API Key below in order to continue the deletion process'
      }
    >
      <StyledFlex width="100%" mt="16px" mb="10px">
        <StyledFlex direction="column" width="100%">
          <InputLabel label="API Key Name" />
          {!isLastKey ? (
            <>
              <CustomSelect
                id="id"
                name="id"
                mb="0"
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
              {errors.id && touched.id && <FormErrorMessage>{errors.id}</FormErrorMessage>}
            </>
          ) : (
            <>
              <BaseTextInput
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                invalid={errors.name && touched.name}
                onBlur={handleBlur}
              />
              {errors.name && touched.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
            </>
          )}
        </StyledFlex>
      </StyledFlex>
    </ConfirmationModal>
  );
};

export default DeleteDefaultKeyConfirmModal;
