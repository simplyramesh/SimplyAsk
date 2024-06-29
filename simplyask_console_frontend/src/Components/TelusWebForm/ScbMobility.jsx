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
import { VALIDATION_MESSAGES, MOBILITY_VALIDATIONS } from './utils/validations';
import { ORGANIZATION_ID, API_KEY } from './ScbConstants';

const INIT_CUSTOMER = {
  orderNumber: '',
  customerBAN: '', // Billing Account Number
  customerFullName: '',
  customerPhoneNumber: '',
  isEnglish: 'true',
};

const ScbMobility = () => {
  const { language, setLanguage, t } = useTranslate();

  const [customer, bindCustomer, isValid, isTouched, error, isFormValid, reset] = useInputValidation({
    validator: { ...MOBILITY_VALIDATIONS },
    initialValue: { ...INIT_CUSTOMER, agentId: '' },
    message: { ...VALIDATION_MESSAGES(t) },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = {
      eventType: 'uscb_request_fulfillment',
      eventSource: 'form_builder',
      fields: {
        telusAgentId: customer.agentId,
        customerOrderNumber: customer.orderNumber,
        customerBAN: customer.customerBAN,
        customerFullName: customer.customerFullName,
        customerPhoneNumber: customer.customerPhoneNumber,
        customerLanguage: customer.isEnglish === 'true' ? 'EN' : 'FR',
      },
      queue: 'primary',
      project: 'mobility',
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
      title={t('heading.title')}
      subtitle={t('heading.body')}
      withTranslation
      onLanguageChange={(e) => setLanguage(e.target.value)}
      language={language}
    >
      <TelusCard
        overline={`${t('heading.step')} 1 ${t('heading.of')} 2`}
        title={t('agent.title')}
      >
        <TelusInputWrapper>
          <TelusTextInput
            type="number"
            label={t('agent.label')}
            bracketsLabel={t('agent.brackets')}
            id="agentId"
            name="agentId"
            placeholder={t('agent.placeholder')}
            isValid={isValid.agentId || !isTouched.agentId}
            error={error.agentId}
            {...bindCustomer('agentId')}
          />
        </TelusInputWrapper>
      </TelusCard>
      <TelusCard
        overline={`${t('heading.step')} 2 ${t('heading.of')} 2`}
        title={t('customerInfo')}
      >
        <TelusInputWrapper>
          <TelusCheckboxGroup label={t('checkbox.label')}>
            <TelusCheckbox
              id="english"
              name="isEnglish"
              label={t('checkbox.en')}
              {...bindCustomer('isEnglish')}
              value
              checked={customer.isEnglish === 'true'}
            />
            <TelusCheckbox
              id="french"
              name="isEnglish"
              label={t('checkbox.fr')}
              {...bindCustomer('isEnglish')}
              value={false}
              checked={customer.isEnglish === 'false'}
            />
          </TelusCheckboxGroup>
        </TelusInputWrapper>
        <TelusInputWrapper>
          <TelusTextInput
            label={t('doms.label')}
            id="orderNumber"
            name="orderNumber"
            placeholder={t('doms.placeholder')}
            {...bindCustomer('orderNumber')}
            isValid={isValid.orderNumber || !isTouched.orderNumber}
            error={error.orderNumber}
          />
          <TelusTextInput
            label={t('ban.label')}
            id="customerBAN"
            name="customerBAN"
            placeholder={t('ban.placeholder')}
            {...bindCustomer('customerBAN')}
            isValid={isValid.customerBAN || !isTouched.customerBAN}
            error={error.customerBAN}
          />
        </TelusInputWrapper>
        <TelusInputWrapper>
          <TelusTextInput
            label={t('fullName.label')}
            id="customerFullName"
            name="customerFullName"
            placeholder={t('fullName.placeholder')}
            {...bindCustomer('customerFullName')}
            isValid={isValid.customerFullName || !isTouched.customerFullName}
            error={error.customerFullName}
          />
          <TelusTextInput
            label={t('mobile.label')}
            id="customerPhoneNumber"
            name="customerPhoneNumber"
            placeholder={t('mobile.placeholder')}
            {...bindCustomer('customerPhoneNumber')}
            isValid={isValid.customerPhoneNumber || !isTouched.customerPhoneNumber}
            error={error.customerPhoneNumber}
          />
        </TelusInputWrapper>
      </TelusCard>
      <TelusSubmitBtnSection
        text={t('submit.message')}
        btnText={t('submit.button')}
        btnWidth="388px"
        disabled={!isFormValid}
        onClick={handleSubmit}
      />
    </TelusPageLayout>
  );
};

export default ScbMobility;
