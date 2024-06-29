import { useFormik } from 'formik';
import { toast } from 'react-toastify';

import { useGetCurrentUser } from '../../hooks/useGetCurrentUser';
import FormErrorMessage from '../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { StyledLoadingButton } from '../shared/REDISIGNED/controls/Button/StyledButton';
import ContentLayout from '../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import CustomIndicatorArrow from '../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../shared/REDISIGNED/selectMenus/CustomSelect';
import Spinner from '../shared/Spinner/Spinner';
import {
  StyledCard, StyledFlex, StyledText, StyledTextareaAutosize, StyledTextField,
} from '../shared/styles/styled';

import useSubmitSupportRequest from './hooks/useSubmitSupportRequest';
import { SUPPORT_REQUEST_INITIAL_VALUES } from './utils/initialValueHelpers';
import { supportRequestValidationSchema } from './utils/validationSchema';

const Support = () => {
  const { currentUser, isFetchingCurrentUser } = useGetCurrentUser();

  const userFullName = `${currentUser?.firstName} ${currentUser?.lastName}`;

  const {
    submitSupportRequest,
    isSubmitSupportRequestLoading,
  } = useSubmitSupportRequest({
    onSuccess: () => {
      toast.success('Your Request has been submitted successfully');
      resetForm();
    },
    onError: () => {
      toast.error('Something went wrong !');
    },
  });

  const handleSubmitSupport = (val) => {
    const payload = {
      name: userFullName,
      email: currentUser?.email,
      subject: val?.subject.value,
      message: val?.message,
    };

    submitSupportRequest(payload);
  };

  const {
    values, setFieldValue, submitForm, resetForm, errors, touched,
  } = useFormik({
    enableReinitialize: true,
    initialValues: SUPPORT_REQUEST_INITIAL_VALUES,
    validationSchema: supportRequestValidationSchema,
    onSubmit: (val) => {
      handleSubmitSupport(val);
    },
  });

  const options = [
    { value: 'Bug Report', label: 'Bug Report' },
    { value: 'Feature Request', label: 'Feature Request' },
    { value: 'General Request', label: 'General Request' },
    { value: 'Implementation support request', label: 'Implementation Support Request' },
  ];

  const handleInputChange = (val, action) => setFieldValue(action.name, val);

  return (
    <PageLayout>
      <ContentLayout>
        <StyledCard>
          {isFetchingCurrentUser ? (
            <Spinner parent />
          ) : (
            <StyledFlex>
              <StyledFlex mb="20px">
                <StyledText weight={600} size={20}>
                  Have a Question, Suggestion, or Issue?
                </StyledText>
              </StyledFlex>
              <StyledText weight={600} mb={20}>
                Please fill out the form below and a member from our team will follow up as soon as possible
              </StyledText>
              <StyledFlex>
                <StyledFlex gap="20px">
                  <StyledFlex direction="row" gap="20px">
                    <StyledFlex gap="5px" flexGrow="1">
                      <StyledText weight={600} size={18}>
                        Full Name
                      </StyledText>
                      <StyledTextField
                        type="text"
                        value={userFullName}
                        variant="standard"
                        height="41px"
                        p="4px 10px"
                        isDisabled
                      />
                    </StyledFlex>
                    <StyledFlex gap="5px" flexGrow="1">
                      <StyledText weight={600} size={18}>
                        Email Address
                      </StyledText>
                      <StyledTextField
                        type="text"
                        value={currentUser?.email}
                        variant="standard"
                        height="41px"
                        p="4px 10px"
                        isDisabled
                      />
                    </StyledFlex>
                  </StyledFlex>

                  <StyledFlex gap="5px">
                    <StyledText weight={600} size={18}>
                      Subject
                    </StyledText>
                    <CustomSelect
                      name="subject"
                      options={options}
                      value={values?.subject}
                      placeholder="Select Subject"
                      onChange={handleInputChange}
                      components={{
                        DropdownIndicator: CustomIndicatorArrow,
                      }}
                      menuPortalTarget={document.body}
                      isSearchable={false}
                      isClearable={false}
                      closeMenuOnSelect
                      form
                      mb={0}
                      maxHeight={37}
                      invalid={errors.subject && touched.subject}
                    />
                    {(errors.subject && touched.subject) && <FormErrorMessage>{errors.subject}</FormErrorMessage>}
                  </StyledFlex>

                  <StyledFlex gap="5px">
                    <StyledText weight={600} size={18}>
                      Message
                    </StyledText>
                    <StyledTextareaAutosize
                      name="message"
                      minRows={15}
                      type="text"
                      placeholder="Type your message here ..."
                      value={values?.message}
                      onChange={(e) => handleInputChange(e.target.value, e.target)}
                      invalid={errors.message && touched.message}
                    />
                    {(errors.message && touched.message) && <FormErrorMessage>{errors.message}</FormErrorMessage>}

                  </StyledFlex>

                  <StyledLoadingButton
                    variant="contained"
                    secondary
                    loading={isSubmitSupportRequestLoading}
                    onClick={submitForm}
                  >
                    Submit Request
                  </StyledLoadingButton>
                </StyledFlex>
              </StyledFlex>
            </StyledFlex>
          )}
        </StyledCard>
      </ContentLayout>
    </PageLayout>
  );
};

export default Support;
