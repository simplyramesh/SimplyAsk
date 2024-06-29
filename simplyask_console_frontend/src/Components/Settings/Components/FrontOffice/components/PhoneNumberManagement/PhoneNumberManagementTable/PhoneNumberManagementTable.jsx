import {AddRounded} from '@mui/icons-material';
import {useTheme} from '@mui/material/styles';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useFormik} from 'formik';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {getAllAgents} from '../../../../../../../Services/axios/conversationHistoryAxios';
import {
  getTelephonyCountryCode,
  getTelephonyCountryStateCode,
  getTelephonyInfo,
  getTelephonyInfoCountries,
} from '../../../../../../../Services/axios/phoneNumberManagementAxios';
import useDeletePhoneNumber from '../../../../../../../hooks/phoneNumberManagement/useDeletePhoneNumber';
import useGenerateNewPhoneNumber from '../../../../../../../hooks/phoneNumberManagement/useGenerateNewPhoneNumber';
import useGetAllPhoneNumbers from '../../../../../../../hooks/phoneNumberManagement/usePhoneNumberManagementGetAllPhoneNumbers';
import useUpdatePhoneNumber from '../../../../../../../hooks/phoneNumberManagement/useUpdatePhoneNumber';
import {useFilter} from '../../../../../../../hooks/useFilter';
import {useGetCurrentUser} from '../../../../../../../hooks/useGetCurrentUser';
import {useTableSortAndFilter} from '../../../../../../../hooks/useTableSortAndFilter';
import {formatPhoneNumber} from '../../../../../../../utils/helperFunctions';
import {createNewPhoneNumberSchema} from '../../../../../../Issues/components/TicketTasks/components/CreateTicketForm/validationSchemas';
import {StyledButton} from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import CustomSidebar from '../../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import TableV2 from '../../../../../../shared/REDISIGNED/table-v2/Table-v2';
import {CustomBlackAndWhiteStyledButtonSideBar, StyledFlex, StyledText} from '../../../../../../shared/styles/styled';
import {PHONE_NUMBER_MANAGEMENT_QUERY_KEYS} from '../../../constants/common';
import {PHONE_NUMBER_MANAGEMENT_SIDE_FILTER_INITIAL_VALUES} from '../../../constants/initialValues';
import {PHONE_NUMBER_MANAGEMENT_COLUMNS} from '../../../utils/formatters';
import {
  PHONE_NUMBER_MANAGEMENT_KEY,
  phoneNumberManagementFiltersMeta,
  phoneNumberManagementSearchFormatter,
} from '../../../utils/helpers';
import PhoneNumberNoProcessNoAgentsDeleteModal from '../PhoneNumberDeleteModals/PhoneNumberNoProcessNoAgentsDeleteModal';
import PhoneNumberOnlyAgentsModal from '../PhoneNumberDeleteModals/PhoneNumberOnlyAgents';
import PhoneNumberProcessAgentsNoAvailableNumbersModal from '../PhoneNumberDeleteModals/PhoneNumberProcessAgentsNoAvailableNumbers';
import PhoneNumberWithOnlyProcessesModal from '../PhoneNumberDeleteModals/PhoneNumberWithOnlyProcesses';
import PhoneNumberProcessAndAgentsModal from '../PhoneNumberDeleteModals/PhoneNumberWithProcessAndAgents';
import {PHONE_NUMBER_MANAGEMENT_TYPES, PHONE_NUMBER_VARIANTS} from '../constants/PhoneNumberManagementConstants';
import PhoneNumberManagementFiltersSideBar from './PhoneNumberManagementFiltersSideBar';
import PhoneNumberManagementGenerateNewPhoneNumber from './PhoneNumberManagementGenerateNewPhoneNumber';
import PhoneNumberManagementSideBarDetails from './PhoneNumberManagementSideBarDetails';

const PhoneNumberManagementTable = () => {
  const { currentUser } = useGetCurrentUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { colors, boxShadows } = useTheme();
  const [phoneNumberDetailsOpen, setPhoneNumberDetailsOpen] = useState(null);
  const [createPhoneNumberSideBarOpen, setCreatePhoneNumberSideBarOpen] = useState(null);
  const [rowDataDetails, setRowDataDetails] = useState(null);
  const [clickedDeleteTableRow, setClickedDeleteTableRow] = useState(null);
  const [phoneNumberModal, setPhoneNumberModal] = useState();
  const [isPhoneNumberFilterOpen, setIsPhoneNumberFilterOpen] = useState(false);
  const { getAllPhoneNumbers } = useGetAllPhoneNumbers();

  const { sourceFilterValue, initialFilterValues, setFilterFieldValue, submitFilterValue } = useFilter({
    formikProps: {
      initialValues: {
        [PHONE_NUMBER_MANAGEMENT_KEY]: PHONE_NUMBER_MANAGEMENT_SIDE_FILTER_INITIAL_VALUES,
        timezone: currentUser?.timezone,
      },
    },
    onSubmit: ({ filterValue, selectedFilters }) => {
      const countryValue =
        selectedFilters.country && selectedFilters.country.label ? selectedFilters.country.label.split(' (+1)')[0] : '';
      const provinceValue =
        selectedFilters.province && selectedFilters.province.label ? selectedFilters.province.label : '';

      const regionValue = selectedFilters.region && selectedFilters.region.label ? selectedFilters.region.label : '';
      setColumnFilters(filterValue);
      setSelectedFiltersBar(() => ({
        ...selectedFilters,
        country: { label: 'Country', value: countryValue, k: 'country' },
        province: { label: 'Province', value: provinceValue, k: 'province' },
        region: { label: 'Region', value: regionValue, k: 'region' },
      }));
    },
    formatter: phoneNumberManagementSearchFormatter,
    selectedFiltersMeta: phoneNumberManagementFiltersMeta,
  });

  const {
    setColumnFilters,
    selectedFiltersBar,
    setSelectedFiltersBar,
    setSearchText,
    sorting,
    setSorting,
    pagination,
    setPagination,
    data: phoneNumberManagementData,
    isFetching,
    refetch,
  } = useTableSortAndFilter({
    queryFn: getTelephonyInfo,
    queryKey: PHONE_NUMBER_MANAGEMENT_QUERY_KEYS.GET_TELEPHONE_INFO,
    pageIndex: 0,
    pageSize: 20,
    initialSearchText: '',
    initialFilters: { isActive: true, ...initialFilterValues },
    initialSorting: [
      {
        id: 'createdDate',
        desc: false,
      },
    ],
  });
  const { data: countryDataOptions, isFetching: isCountryDataOptionsFetching } = useQuery({
    queryFn: () => getTelephonyInfoCountries(),
    queryKey: [PHONE_NUMBER_MANAGEMENT_QUERY_KEYS.GET_TELEPHONE_COUNTRIES],
    enabled: true,
    select: (res) => {
      const countryName = Object.keys(res)[0];
      const countryCode = Object.values(res)[0];

      const countryOptions = [
        {
          label: `${countryName}`,
          value: countryCode,
        },
      ];

      return countryOptions;
    },
  });

  const { values, errors, touched, handleBlur, setFieldValue, resetForm } = useFormik({
    initialValues: {
      country: '',
      countryCode: '',
      countryStateCode: '',
      region: '',
    },
    validationSchema: createNewPhoneNumberSchema,
  });

  const {
    values: deletePhoneNumber,
    setFieldValue: setDeletePhoneNumber,
    resetForm: resetDeletePhoneNumberForm,
  } = useFormik({
    initialValues: {
      phoneNumber: { label: '', value: '' },
    },
  });

  const handleGeneratePhoneNumber = () => {
    const payload = {
      countryCode: values.countryCode,
      provinceCode: values.countryStateCode.label,
      areaCode: values.region.label.toUpperCase(),
    };

    generatePhoneNumber(payload);
  };

  const { generatePhoneNumber, isPhoneNumberGenerating } = useGenerateNewPhoneNumber({
    onSuccess: () => {
      resetForm();
      setCreatePhoneNumberSideBarOpen(false);
      toast.success('A new number has been generated successfully.');
      resetDeletePhoneNumberForm();
    },
    onError: () => toast.error('Something went wrong...'),
    onSettled: (val) => {
      if (
        phoneNumberModal?.value &&
        [
          PHONE_NUMBER_VARIANTS.WITH_PROCESS_AND_AGENTS,
          PHONE_NUMBER_VARIANTS.WITH_ONLY_AGENTS,
          PHONE_NUMBER_VARIANTS.WITH_ONLY_PROCESSES,
        ].includes(phoneNumberModal?.additionalInfo)
      ) {
        const phoneNumber = val.data;
        const mostRecentGeneratedPhoneNumber = {
          label: <PhoneNumberLabel phoneNumber={phoneNumber} />,
          value: phoneNumber.telephoneNumberId,
        };
        setDeletePhoneNumber('phoneNumber', mostRecentGeneratedPhoneNumber);
      }
      queryClient.invalidateQueries({ queryKey: [PHONE_NUMBER_MANAGEMENT_QUERY_KEYS.GET_TELEPHONE_INFO] });
    },
  });

  const { deletePhoneNumberMutate, isPhoneNumberDeleting } = useDeletePhoneNumber({
    onSuccess: () => {
      toast.success(
        `${formatPhoneNumber(clickedDeleteTableRow?.phoneNumber) || formatPhoneNumber(rowDataDetails?.phoneNumber)} has been successfully deleted.`
      );
      resetDeletePhoneNumberForm();
      setPhoneNumberModal(null);
      setPhoneNumberDetailsOpen(false);
      queryClient.invalidateQueries({ queryKey: [PHONE_NUMBER_MANAGEMENT_QUERY_KEYS.GET_TELEPHONE_INFO] });
    },
    onError: () => toast.error('Something went wrong!'),
  });

  const { movePhoneNumber, isPhoneNumberMoving } = useUpdatePhoneNumber({
    onSuccess: () => deletePhoneNumberMutate(clickedDeleteTableRow?.phoneNumber || rowDataDetails?.phoneNumber),
    onError: () => toast.error('Something went wrong!'),
  });

  const {
    values: phoneNumberFilterValues,
    setFieldValue: phoneNumberSetFieldFilterValues,
    submitForm: phoneNumberSubmitForm,
    setValues: phoneNumberSetValues,
    resetForm: phoneNumberResetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: sourceFilterValue[PHONE_NUMBER_MANAGEMENT_KEY],
    onSubmit: (sideFilter) => {
      setIsPhoneNumberFilterOpen(false);
      setFilterFieldValue(PHONE_NUMBER_MANAGEMENT_KEY, sideFilter);
      submitFilterValue();
    },
  });

  const { data: provinceDataOptions, isFetching: isProvinceDataOptionsFetching } = useQuery({
    queryFn: () => getTelephonyCountryCode(values.countryCode || phoneNumberFilterValues.country.value),
    queryKey: [
      PHONE_NUMBER_MANAGEMENT_QUERY_KEYS.GET_TELEPHONE_PROVINCES,
      values.countryCode,
      phoneNumberFilterValues.country,
    ],
    enabled: values.countryCode.length > 0 || phoneNumberFilterValues.country?.value?.length > 0,
    select: (res) => {
      const transformedProvinceData = res.map((provinceCode) => ({
        label: provinceCode,
        value: provinceCode,
      }));
      return transformedProvinceData;
    },
  });

  const { data: regionDataOptions, isFetching: isRegionDataOptionsFetching } = useQuery({
    queryFn: () =>
      values.countryStateCode.label
        ? getTelephonyCountryStateCode(values.countryCode, values.countryStateCode.label)
        : getTelephonyCountryStateCode(phoneNumberFilterValues.country.value, phoneNumberFilterValues.province.value),
    queryKey: [
      PHONE_NUMBER_MANAGEMENT_QUERY_KEYS.GET_TELEPHONE_REGIONS,
      values.countryCode,
      values.countryStateCode.label,
      phoneNumberFilterValues.province,
    ],
    enabled: values.countryStateCode?.label?.length > 0 || phoneNumberFilterValues.province?.value?.length > 0,
    select: (res) => {
      const transformedData = res.map((item) => {
        const label = item.areaCode
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        return {
          label,
          value: item.regionId,
        };
      });
      return transformedData;
    },
  });

  const associatedAgentId = phoneNumberManagementData?.content
    ?.map((phoneNumber) => phoneNumber.associatedAgentId)
    .filter((associatedAgentId) => associatedAgentId?.length > 0)
    .join(',');

  const { data: assignedAgentsAll, isFetching: isAgentsFetching } = useQuery({
    queryFn: () => getAllAgents(`agentIds=${associatedAgentId}&pageSize=999`),
    queryKey: [PHONE_NUMBER_MANAGEMENT_QUERY_KEYS.GET_WIDGET_AGENTS_BY_ID, associatedAgentId],
    enabled: !!associatedAgentId,
    select: (res) => res?.content,
  });

  const getPhoneNumberManagementDataWithAgents = (type = PHONE_NUMBER_MANAGEMENT_TYPES.INPUT) => {
    if (type === PHONE_NUMBER_MANAGEMENT_TYPES.TABLE) {
      const appendAgentsToPhoneNumberManagementInfo = phoneNumberManagementData?.content?.map((phoneNumber) => {
        const associatedAgentIds = phoneNumber.associatedAgentId;
        const filterAgentsForPhoneNumbers = assignedAgentsAll?.filter((agent) =>
          associatedAgentIds?.includes(agent.agentId)
        );

        return { ...phoneNumber, agents: filterAgentsForPhoneNumbers };
      });
      return { ...phoneNumberManagementData, content: appendAgentsToPhoneNumberManagementInfo };
    } else {
      const appendAgentsToPhoneNumberManagementInfo = getAllPhoneNumbers?.content?.map((phoneNumber) => {
        const associatedAgentIds = phoneNumber.associatedAgentId;
        const filterAgentsForPhoneNumbers = assignedAgentsAll?.filter((agent) =>
          associatedAgentIds?.includes(agent.agentId)
        );
        return { ...phoneNumber, agents: filterAgentsForPhoneNumbers };
      });
      return { ...getAllPhoneNumbers, content: appendAgentsToPhoneNumberManagementInfo };
    }
  };

  const onTableRowClick = (row) => {
    setPhoneNumberDetailsOpen(true);
    setRowDataDetails(row);
  };
  const tableMeta = {
    currentUser,
    theme: { colors, boxShadows },
    onTableRowClick,
    navigate,
    onDeleteIcon: (row, event) => {
      const updatedRow = { ...row, agents: row.agents || [] };
      setClickedDeleteTableRow(updatedRow);
      chooseDeleteModal(updatedRow);
      event.stopPropagation();
    },
  };

  const PhoneNumberLabel = ({ phoneNumber }) => {
    return (
      <StyledText weight={600}>
        {formatPhoneNumber(phoneNumber.phoneNumber)}
        <StyledText display="inline" capitalize>
          {` - ${phoneNumber.country} (+1), ${phoneNumber.province}`}
        </StyledText>
      </StyledText>
    );
  };

  const getAvailableAndAllTelephoneNumbers = (numberType) => {
    if (numberType === PHONE_NUMBER_MANAGEMENT_TYPES.AVAILABLE) {
      let availableNumbers = [];
      getPhoneNumberManagementDataWithAgents(PHONE_NUMBER_MANAGEMENT_TYPES.INPUT)?.content?.map((phoneNumber) => {
        if (phoneNumber.agents?.length <= 0 || !phoneNumber.agents) {
          availableNumbers.push({
            label: <PhoneNumberLabel phoneNumber={phoneNumber} />,
            value: phoneNumber.telephoneNumberId,
          });
        }
      });
      return availableNumbers;
    } else {
      let allNumbers = [];
      getPhoneNumberManagementDataWithAgents(PHONE_NUMBER_MANAGEMENT_TYPES.INPUT)?.content?.map((phoneNumber) => {
        allNumbers.push({
          label: <PhoneNumberLabel phoneNumber={phoneNumber} />,
          value: phoneNumber.telephoneNumberId,
        });
      });
      return allNumbers;
    }
  };

  const chooseDeleteModal = (row) => {
    const getAvailableNumbersLength = getAvailableAndAllTelephoneNumbers(
      PHONE_NUMBER_MANAGEMENT_TYPES.AVAILABLE
    )?.length;

    if (row?.workflowIds?.length <= 0 && row?.agents?.length <= 0) {
      setPhoneNumberModal({ value: true, additionalInfo: PHONE_NUMBER_VARIANTS.WITH_NO_PROCESS_OR_AGENTS });
    } else if (row?.workflowIds?.length > 0 && row?.agents?.length > 0) {
      setPhoneNumberModal({ value: true, additionalInfo: PHONE_NUMBER_VARIANTS.WITH_PROCESS_AND_AGENTS });
    } else if (row?.agents?.length > 0 && row?.workflowIds?.length <= 0) {
      setPhoneNumberModal({ value: true, additionalInfo: PHONE_NUMBER_VARIANTS.WITH_ONLY_AGENTS });
    } else if (row?.workflowIds?.length > 0 && row?.agents?.length <= 0) {
      setPhoneNumberModal({ value: true, additionalInfo: PHONE_NUMBER_VARIANTS.WITH_ONLY_PROCESSES });
    } else if (row?.workflowIds?.length > 0 && row?.agents?.length > 0 && getAvailableNumbersLength <= 0) {
      setPhoneNumberModal({
        value: true,
        additionalInfo: PHONE_NUMBER_VARIANTS.WITH_PROCESS_AND_AGENTS_BUT_NO_AVAILABLE,
      });
    }
  };

  const handleSorting = (old) => {
    const { id, desc } = old()[0];

    setFilterFieldValue(
      PHONE_NUMBER_MANAGEMENT_KEY,
      { ...sourceFilterValue[PHONE_NUMBER_MANAGEMENT_KEY], [`${id}Sort`]: `${!desc}` },
      false
    );
    setSorting(old);
    submitFilterValue();
  };

  const renderHeaderActions = () => (
    <StyledFlex direction="row" gap="0 15px">
      <StyledButton
        variant="contained"
        tertiary
        startIcon={<AddRounded />}
        onClick={() => setCreatePhoneNumberSideBarOpen(true)}
      >
        Generate Phone Number
      </StyledButton>
    </StyledFlex>
  );

  const handleClearAll = () => {
    setFilterFieldValue(PHONE_NUMBER_MANAGEMENT_KEY, PHONE_NUMBER_MANAGEMENT_SIDE_FILTER_INITIAL_VALUES);
    submitFilterValue();
  };

  const handleClearFilterField = (key) => {
    setFilterFieldValue(PHONE_NUMBER_MANAGEMENT_KEY, {
      ...sourceFilterValue[PHONE_NUMBER_MANAGEMENT_KEY],
      [key]: PHONE_NUMBER_MANAGEMENT_SIDE_FILTER_INITIAL_VALUES[key],
    });
    submitFilterValue();
  };

  const toggleSidebar = (sidebar = 'filters', value = false) => {
    const stateSelector = {
      details: setPhoneNumberDetailsOpen,
      createPhoneNumber: setCreatePhoneNumberSideBarOpen,
    };

    stateSelector[sidebar](value);
  };

  return (
    <StyledFlex>
      <StyledFlex p="48px 17px 48px 10px">
        <TableV2
          data={getPhoneNumberManagementDataWithAgents(PHONE_NUMBER_MANAGEMENT_TYPES.TABLE)}
          columns={PHONE_NUMBER_MANAGEMENT_COLUMNS}
          entityName="Phone Numbers"
          searchPlaceholder="Search Phone Numbers..."
          onSearch={(e) => setSearchText(e.target.value)}
          sorting={sorting}
          setSorting={handleSorting}
          pagination={pagination}
          setPagination={setPagination}
          selectedFilters={selectedFiltersBar}
          headerActions={renderHeaderActions()}
          enableRowSelection={false}
          onShowFilters={() => setIsPhoneNumberFilterOpen(true)}
          onClearAllFilters={handleClearAll}
          onClearFilter={handleClearFilterField}
          meta={tableMeta}
          isLoading={isFetching || isAgentsFetching || isCountryDataOptionsFetching}
          pinRowHoverActionColumns={['delete']}
          isEmbedded
          pinColumns={['phoneNumber']}
          onTableRefresh={refetch}
        />
      </StyledFlex>

      <PhoneNumberManagementFiltersSideBar
        isPhoneNumberFilterOpen={isPhoneNumberFilterOpen}
        onFilterSideBarClose={() => {
          setIsPhoneNumberFilterOpen(false);
          phoneNumberResetForm();
        }}
        phoneNumberSetValues={phoneNumberSetValues}
        phoneNumberFilterValues={phoneNumberFilterValues}
        phoneNumberSetFieldFilterValues={phoneNumberSetFieldFilterValues}
        countryDataOptions={countryDataOptions}
        provinceDataOptions={provinceDataOptions}
        regionDataOptions={regionDataOptions}
        phoneNumberSubmitForm={phoneNumberSubmitForm}
      />

      <CustomSidebar
        open={phoneNumberDetailsOpen}
        onClose={() => toggleSidebar('details', null)}
        headBackgroundColor={colors.lightPinkRed}
        headerTemplate={
          <StyledFlex gap="10px">
            <StyledFlex direction="row" alignItems="center" gap="17px">
              <StyledText weight={600} size={24}>
                {formatPhoneNumber(rowDataDetails?.phoneNumber)}
              </StyledText>
            </StyledFlex>
          </StyledFlex>
        }
        customHeaderActionTemplate={
          <StyledFlex direction="row" alignItems="center">
            <CustomBlackAndWhiteStyledButtonSideBar
              onClick={() => chooseDeleteModal(rowDataDetails)}
              variant="outlined"
              startIcon={<CustomTableIcons icon="REMOVE" width={24} />}
            >
              Delete
            </CustomBlackAndWhiteStyledButtonSideBar>
          </StyledFlex>
        }
      >
        {() => <PhoneNumberManagementSideBarDetails rowDataDetails={rowDataDetails} />}
      </CustomSidebar>

      <CustomSidebar
        open={createPhoneNumberSideBarOpen}
        onClose={() => {
          resetForm();
          toggleSidebar('createPhoneNumber', null);
        }}
        headBackgroundColor={colors.white}
        width={374}
        sx={{
          zIndex: 999999,
        }}
        headerTemplate={
          <StyledFlex gap="10px">
            <StyledFlex direction="row" alignItems="center" gap="17px">
              <StyledText weight={600} size={19}>
                Generate New Phone Number
              </StyledText>
            </StyledFlex>
          </StyledFlex>
        }
      >
        {() => {
          return (
            <PhoneNumberManagementGenerateNewPhoneNumber
              values={values}
              isPhoneNumberGenerating={isPhoneNumberGenerating}
              countryDataOptions={countryDataOptions}
              provinceDataOptions={provinceDataOptions}
              countryInputOnBlur={handleBlur('country')}
              countryCustomSelectOnChange={(val) => {
                setFieldValue('countryCode', val.value);
                setFieldValue('country', val);
                setFieldValue('countryStateCode', '');
                setFieldValue('region', '');
              }}
              provinceOrStateCustomSelectOnChange={(val) => {
                setFieldValue('countryStateCode', val);
                setFieldValue('region', '');
              }}
              regionCustomSelectOnChange={(val) => setFieldValue('region', val)}
              errors={errors}
              touched={touched}
              isProvinceDataOptionsFetching={isProvinceDataOptionsFetching}
              isRegionDataOptionsFetching={isRegionDataOptionsFetching}
              regionDataOptions={regionDataOptions}
              generateNumberOnClick={handleGeneratePhoneNumber}
            />
          );
        }}
      </CustomSidebar>

      <PhoneNumberNoProcessNoAgentsDeleteModal
        isOpen={
          phoneNumberModal?.value &&
          phoneNumberModal?.additionalInfo === PHONE_NUMBER_VARIANTS.WITH_NO_PROCESS_OR_AGENTS
        }
        onCloseModal={() => {
          setPhoneNumberModal(null);
          setClickedDeleteTableRow();
        }}
        title={`Delete "${formatPhoneNumber(clickedDeleteTableRow?.phoneNumber || rowDataDetails?.phoneNumber)}"?`}
        onSuccessClick={() =>
          deletePhoneNumberMutate(clickedDeleteTableRow?.phoneNumber || rowDataDetails?.phoneNumber)
        }
        isLoading={isPhoneNumberDeleting}
      />

      <PhoneNumberProcessAndAgentsModal
        isOpen={
          phoneNumberModal?.value && phoneNumberModal?.additionalInfo === PHONE_NUMBER_VARIANTS.WITH_PROCESS_AND_AGENTS
        }
        onCloseModal={() => {
          setPhoneNumberModal(null);
          setClickedDeleteTableRow();
          resetDeletePhoneNumberForm();
        }}
        onSuccessClick={() =>
          movePhoneNumber({
            telephoneNumberId: deletePhoneNumber.phoneNumber.value,
            associatedAgentId: clickedDeleteTableRow?.agents[0]?.agentId || rowDataDetails?.agents[0]?.agentId,
            workflowIds: clickedDeleteTableRow?.workflowIds || rowDataDetails?.workflowIds,
          })
        }
        isPhoneNumberDeleting={isPhoneNumberDeleting || isPhoneNumberMoving}
        availableNumbers={getAvailableAndAllTelephoneNumbers(PHONE_NUMBER_MANAGEMENT_TYPES.AVAILABLE)}
        availableNumbersOnChange={(val) => setDeletePhoneNumber('phoneNumber', val)}
        phoneNumberValue={deletePhoneNumber.phoneNumber}
        linkColor={colors.blueLink}
        phoneNumberFromRow={formatPhoneNumber(clickedDeleteTableRow?.phoneNumber || rowDataDetails?.phoneNumber)}
        onOpenGenerateNewPhoneNumberModal={() => setCreatePhoneNumberSideBarOpen(true)}
      />

      <PhoneNumberOnlyAgentsModal
        isOpen={phoneNumberModal?.value && phoneNumberModal?.additionalInfo === PHONE_NUMBER_VARIANTS.WITH_ONLY_AGENTS}
        onCloseModal={() => {
          setPhoneNumberModal(null);
          setClickedDeleteTableRow();
          resetDeletePhoneNumberForm();
        }}
        onSuccessClick={() =>
          movePhoneNumber({
            telephoneNumberId: deletePhoneNumber.phoneNumber.value,
            associatedAgentId: clickedDeleteTableRow?.agents[0]?.agentId || rowDataDetails?.agents[0]?.agentId,
            workflowIds: clickedDeleteTableRow?.workflowIds || rowDataDetails?.workflowIds,
          })
        }
        isPhoneNumberDeleting={isPhoneNumberDeleting || isPhoneNumberMoving}
        phoneNumberTableRow={formatPhoneNumber(clickedDeleteTableRow?.phoneNumber || rowDataDetails?.phoneNumber)}
        availableNumbers={getAvailableAndAllTelephoneNumbers(PHONE_NUMBER_MANAGEMENT_TYPES.AVAILABLE)}
        availableNumbersOnChange={(val) => setDeletePhoneNumber('phoneNumber', val)}
        phoneNumberValue={deletePhoneNumber.phoneNumber}
        linkColor={colors.blueLink}
        onOpenGenerateNewPhoneNumberModal={() => setCreatePhoneNumberSideBarOpen(true)}
      />
      <PhoneNumberWithOnlyProcessesModal
        isOpen={
          phoneNumberModal?.value && phoneNumberModal?.additionalInfo === PHONE_NUMBER_VARIANTS.WITH_ONLY_PROCESSES
        }
        onCloseModal={() => {
          setPhoneNumberModal(null);
          setClickedDeleteTableRow();
          resetDeletePhoneNumberForm();
        }}
        onSuccessClick={() =>
          movePhoneNumber({
            telephoneNumberId: deletePhoneNumber.phoneNumber.value,
            associatedAgentId: clickedDeleteTableRow?.agents[0]?.agentId || rowDataDetails?.agents[0]?.agentId,
            workflowIds: clickedDeleteTableRow?.workflowIds || rowDataDetails?.workflowIds,
          })
        }
        isPhoneNumberDeleting={isPhoneNumberDeleting || isPhoneNumberMoving}
        phoneNumberTableRow={formatPhoneNumber(clickedDeleteTableRow?.phoneNumber || rowDataDetails?.phoneNumber)}
        availableNumbers={getAvailableAndAllTelephoneNumbers(PHONE_NUMBER_MANAGEMENT_TYPES.ALL)}
        availableNumbersOnChange={(val) => setDeletePhoneNumber('phoneNumber', val)}
        phoneNumberValue={deletePhoneNumber.phoneNumber}
        linkColor={colors.blueLink}
        onOpenGenerateNewPhoneNumberModal={() => setCreatePhoneNumberSideBarOpen(true)}
      />

      <PhoneNumberProcessAgentsNoAvailableNumbersModal
        isOpen={
          phoneNumberModal?.value &&
          phoneNumberModal?.additionalInfo === PHONE_NUMBER_VARIANTS.WITH_PROCESS_AND_AGENTS_BUT_NO_AVAILABLE
        }
        onCloseModal={() => {
          setPhoneNumberModal(null);
          setClickedDeleteTableRow();
          resetDeletePhoneNumberForm();
        }}
        onSuccessClick={() =>
          deletePhoneNumberMutate(clickedDeleteTableRow?.phoneNumber || rowDataDetails?.phoneNumber)
        }
        isLoading={isPhoneNumberDeleting}
        phoneNumberTableRow={formatPhoneNumber(clickedDeleteTableRow?.phoneNumber)}
        linkColor={colors.blueLink}
        onOpenGenerateNewPhoneNumberModal={() => setCreatePhoneNumberSideBarOpen(true)}
      />
    </StyledFlex>
  );
};

export default PhoneNumberManagementTable;
