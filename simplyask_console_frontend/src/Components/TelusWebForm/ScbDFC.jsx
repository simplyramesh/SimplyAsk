import { toast } from 'react-toastify';

import { CATALOG_API as axios } from '../../Services/axios/AxiosInstance';
import TelusCheckbox from './components/inputs/TelusCheckbox';
import TelusTextInput from './components/inputs/TelusTextInput';
import TelusCard from './components/layouts/TelusCard/TelusCard';
import TelusCheckboxGroup from './components/layouts/TelusCheckboxGroup/TelusCheckboxGroup';
import TelusInputWrapper from './components/layouts/TelusInputWrapper/TelusInputWrapper';
import TelusPageLayout from './components/layouts/TelusPageLayout';
import TelusSubmitBtnSection from './components/layouts/TelusSubmitBtnSection/TelusSubmitBtnSection';
import useInputValidation from './hooks/useInputValidation/useInputValidation';
import useTranslate from './hooks/useTranslate/useTranslate';
import {
  agentEmailValidation,
  agentEmailValidationMessage,
  VALIDATION_MESSAGES,
  DFC_VALIDATIONS,
} from './utils/validations';
import { ORGANIZATION_ID, API_KEY } from './ScbConstants';

const INIT_CUSTOMER = {
  agentId: '',
  agentEmail: '',
  orderNumber: '',
  customerBAN: '', // Billing Account Number
  customerFullName: '',
  customerPhoneNumber: '',
  isEnglish: 'true',
};

const ScbDFC = () => {
  const { t } = useTranslate('en');

  const [inputValues, bindInput, isValid, isTouched, error, isFormValid, reset] = useInputValidation({
    validator: {
      ...DFC_VALIDATIONS,
      agentEmail: (value) => agentEmailValidation(value),
    },
    initialValue: INIT_CUSTOMER,
    message: {
      ...VALIDATION_MESSAGES(t),
      agentEmail: (agentEmail) => agentEmailValidationMessage(agentEmail, t),
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // NOTE: queue is currently always 'primary' and may change in the future (if c/p this code)

    const submitData = {
      eventType: 'uscb_request_fulfillment',
      eventSource: 'form_builder',
      fields: {
        telusAgentId: inputValues.agentId,
        telusAgentEmail: inputValues.agentEmail,
        customerOrderNumber: inputValues.orderNumber,
        customerBAN: inputValues.customerBAN,
        customerFullName: inputValues.customerFullName,
        customerPhoneNumber: inputValues.customerPhoneNumber,
        customerLanguage: inputValues.isEnglish === 'true' ? 'EN' : 'FR',
      },
      queue: 'primary',
      project: 'dfc',
    };

    const convertToJson = JSON.parse(JSON.stringify(submitData));

    try {
      axios.defaults.headers.common.organizationId = ORGANIZATION_ID;
      axios.defaults.headers.common.Apikey = API_KEY; // TODO: This is a temporary solution.

      await axios.post('/webhook/event-trigger/execute', convertToJson).then((res) => res.data);
      toast.success('Your Request has been submitted successfully');
      reset();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <TelusPageLayout
      title="Scheduled Callback Requester For DFC Order Fallouts"
      subtitle="Fill in the following fields to send a customer an SMS requesting them to book a scheduled callback to resolve an order-related issue."
    >
      <TelusCard
        overline="Step 1 of 2"
        title="Agent Information"
      >
        <TelusInputWrapper>
          <TelusTextInput
            type="number"
            label="Your TELUS Agent ID"
            bracketsLabel="only numbers, excluding “x” or “t”"
            id="agentId"
            name="agentId"
            placeholder="Enter TELUS Agent ID"
            {...bindInput('agentId')}
            isValid={isValid.agentId || !isTouched.agentId}
            error={error.agentId}
          />
          <TelusTextInput
            label="Your TELUS Email"
            id="agentEmail"
            name="agentEmail"
            placeholder="Enter TELUS Email"
            {...bindInput('agentEmail')}
            isValid={isValid.agentEmail || !isTouched.agentEmail}
            error={error.agentEmail}
          />
        </TelusInputWrapper>
      </TelusCard>
      <TelusCard
        overline="Step 2 of 2"
        title="Customer Information"
      >
        <TelusInputWrapper>
          <TelusCheckboxGroup
            label="Customer Language"
          >
            <TelusCheckbox
              id="english"
              name="isEnglish"
              label="English"
              {...bindInput('isEnglish')}
              value
              checked={inputValues.isEnglish === 'true'}
            />
            <TelusCheckbox
              id="french"
              name="isEnglish"
              label="French"
              {...bindInput('isEnglish')}
              value={false}
              checked={inputValues.isEnglish === 'false'}
            />
          </TelusCheckboxGroup>
        </TelusInputWrapper>
        <TelusInputWrapper>
          <TelusTextInput
            label="Order Number"
            id="orderNumber"
            name="orderNumber"
            placeholder="Enter DOMS Order Number"
            {...bindInput('orderNumber')}
            isValid={isValid.orderNumber || !isTouched.orderNumber}
            error={error.orderNumber}
          />
          <TelusTextInput
            label="Customer BAN (Optional)"
            id="customerBAN"
            name="customerBAN"
            placeholder="Enter BAN"
            {...bindInput('customerBAN')}
            error={error.customerBAN}
          />
        </TelusInputWrapper>
        <TelusInputWrapper>
          <TelusTextInput
            label="Customer Full Name"
            id="customerFullName"
            name="customerFullName"
            placeholder="Enter Full Name"
            {...bindInput('customerFullName')}
            isValid={isValid.customerFullName || !isTouched.customerFullName}
            error={error.customerFullName}
          />
          <TelusTextInput
            label="Customer Phone Number"
            id="customerPhoneNumber"
            name="customerPhoneNumber"
            placeholder="Enter Phone Number"
            {...bindInput('customerPhoneNumber')}
            isValid={isValid.customerPhoneNumber || !isTouched.customerPhoneNumber}
            error={error.customerPhoneNumber}
          />
        </TelusInputWrapper>
      </TelusCard>
      <TelusSubmitBtnSection
        text="Upon clicking the “Send SMS Callback Request” button below, the specified “Customer Phone Number” will receive an SMS message requesting the customer to book a scheduled callback."
        btnText="Send SMS Callback Request"
        btnWidth="388px"
        disabled={!isFormValid}
        onClick={handleSubmit}
      />
    </TelusPageLayout>
  );
};

export default ScbDFC;
