import { useTheme } from '@mui/system';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';

import { getTelephonyInfo } from '../../../../../Services/axios/phoneNumberManagementAxios';
import routes from '../../../../../config/routes';
import { useFilter } from '../../../../../hooks/useFilter';
import { useGetCurrentUser } from '../../../../../hooks/useGetCurrentUser';
import { useTableSortAndFilter } from '../../../../../hooks/useTableSortAndFilter';
import { capitalizeFirstLetterOfRegion } from '../../../../../utils/helperFunctions';
import { LOCATION_VALUES } from '../../../../Settings/Components/FrontOffice/components/PhoneNumberManagement/constants/PhoneNumberManagementConstants';
import { PHONE_NUMBER_MANAGEMENT_QUERY_KEYS } from '../../../../Settings/Components/FrontOffice/constants/common';
import { PHONE_NUMBER_MANAGEMENT_SIDE_FILTER_INITIAL_VALUES } from '../../../../Settings/Components/FrontOffice/constants/initialValues';
import { EXPANDED_TYPES } from '../../../../Settings/Components/FrontOffice/constants/tabConstants';
import { PHONE_NUMBER_MANAGEMENT_COLUMNS } from '../../../../Settings/Components/FrontOffice/utils/formatters';
import {
  PHONE_NUMBER_MANAGEMENT_KEY,
  phoneNumberManagementFiltersMeta,
  phoneNumberManagementSearchFormatter,
} from '../../../../Settings/Components/FrontOffice/utils/helpers';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import CenterModalFixed from '../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import TableV2 from '../../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { agentEditorAssociatedPhoneNumbers } from '../../AgentEditor/store';
import useUpdateAgent from '../../hooks/useUpdateAgent';
import { StyledFlexTableRoot } from '../AgentManagerModalsAddWidget';
import AgentManagerModalPhoneNumberFilters from './AgentManagerModalPhoneNumberFilters';

const AgentManagerModalsAddPhoneNumber = ({
  open = false,
  onClose,
  onCloseSettingsAndCreateWidgetModals,
  clickedProcess,
  setPreventGoBackToPrimaryMenu,
  setClickedProcess,
  isAgentEditorSettingsView = false,
}) => {
  const navigate = useNavigate();
  const { currentUser } = useGetCurrentUser();
  const { colors, boxShadows } = useTheme();
  const [selectedTablePhoneNumbers, setSelectedTablePhoneNumbers] = useState([]);

  const [agentEditorPhoneNumbers, setAgentEditorPhoneNumbers] = useRecoilState(agentEditorAssociatedPhoneNumbers);

  const { sourceFilterValue, initialFilterValues, setFilterFieldValue, submitFilterValue } = useFilter({
    formikProps: {
      initialValues: {
        [PHONE_NUMBER_MANAGEMENT_KEY]: PHONE_NUMBER_MANAGEMENT_SIDE_FILTER_INITIAL_VALUES,
        timezone: currentUser?.timezone,
      },
    },
    onSubmit: ({ filterValue, selectedFilters }) => {
      let region = '',
        province = '',
        country = '';

      if (selectedFilters?.location) {
        const locationValue = selectedFilters.location.value;

        const locationParts = locationValue.split(' ');
        const partsCount = locationParts.length;

        if (partsCount === 1) {
          country = locationValue;
        } else if (partsCount === 2) {
          province = locationParts[0];
          country = locationParts[1];
        } else if (partsCount === 3) {
          region = locationParts[0];
          province = locationParts[1];
          country = locationParts[2];
        }
      }

      const updatedSelectedFilters = { ...selectedFilters };
      delete updatedSelectedFilters.location;
      const updatedFilterValue = {
        ...filterValue,
        country: country,
        province: province,
        region: region,
      };

      setColumnFilters(updatedFilterValue);

      setSelectedFiltersBar(() => ({
        ...updatedSelectedFilters,
        country: { label: 'Country', value: country, k: LOCATION_VALUES.COUNTRY },
        province: { label: 'Province', value: province, k: LOCATION_VALUES.PROVINCE },
        region: { label: 'Region', value: capitalizeFirstLetterOfRegion(region), k: LOCATION_VALUES.REGION },
      }));
    },
    formatter: phoneNumberManagementSearchFormatter,
    selectedFiltersMeta: phoneNumberManagementFiltersMeta,
  });

  const {
    setColumnFilters,
    selectedFiltersBar,
    setSelectedFiltersBar,
    searchText,
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
    pageSize: 999,
    initialSearchText: '',
    initialFilters: { isActive: true, ...initialFilterValues },
    initialSorting: [
      {
        id: 'createdDate',
        desc: false,
      },
    ],
  });

  const { updateAgentById, isUpdateAgentByIdLoading } = useUpdateAgent({
    onSuccess: (data) => {
      toast.success('The phone number has been added successfully');
      setClickedProcess(data);
      onClose();

      setTimeout(() => {
        setPreventGoBackToPrimaryMenu?.(false);
      }, 3000);
    },
    onError: () => {
      toast.error('Something went wrong...');
      setPreventGoBackToPrimaryMenu?.(false);
    },
  });

  const addPhoneNumberIdToAgent = () => {
    if (!selectedTablePhoneNumbers?.length > 0) {
      toast.error('Could not add, as no phone number(s) were selected');
      return;
    }

    if (isAgentEditorSettingsView) {
      const refactoredSelectedPhoneNumbers = selectedTablePhoneNumbers.map((telephoneNumberId) => ({
        telephoneNumberId,
      }));
      const updatedPhoneNumber = [...agentEditorPhoneNumbers, ...refactoredSelectedPhoneNumbers];

      setAgentEditorPhoneNumbers(updatedPhoneNumber);
    } else {
      setPreventGoBackToPrimaryMenu?.(true);

      const body = {
        ...clickedProcess,
        associatedPhoneNumbers: [...clickedProcess.associatedPhoneNumbers, ...selectedTablePhoneNumbers],
      };

      const payload = {
        agentId: clickedProcess.agentId,
        ...body,
      };

      updateAgentById(payload);
    }
  };

  const getPhoneNumberManagementDataAvailableNumbers = () => {
    const getAvailableNumbers = phoneNumberManagementData?.content?.filter(
      (phoneNumber) => !phoneNumber.associatedAgentId
    );

    return {
      ...phoneNumberManagementData,
      content: getAvailableNumbers,
      numberOfElements: getAvailableNumbers?.length,
      totalElements: getAvailableNumbers?.length,
    };
  };

  const redirectToPhoneNumberManagementTable = () => {
    navigate({
      pathname: routes.SETTINGS_FRONT_OFFICE_TAB,
      search: `?autoExpandTab=${EXPANDED_TYPES.PHONE_NUMBER}`,
    });
  };

  const renderTableDescription = () => (
    <StyledText weight={400} size={14} mt={6} mb={10} display="block">
      Don’t see a phone number that works for you?{' '}
      <StyledButton
        variant="text"
        fontWeight={400}
        fontSize={15}
        display="inline"
        cursor="pointer"
        onClick={redirectToPhoneNumberManagementTable}
        mt={-2}
        lineHeight="0px"
      >
        Click here
      </StyledButton>{' '}
      to go to Settings and generate a new phone number
    </StyledText>
  );

  const renderEmptyTable = () => (
    <StyledFlex gap="18px" flex="1" alignItems="center" justifyContent="center" mt="10vh" mb="10vh">
      <CustomTableIcons icon="EMPTY" width={88} />
      <StyledFlex width="290px" alignItems="center" justifyContent="center">
        <StyledText as="h3" size={18} lh={22} weight={600} mb={12} textAlign="center">
          There Are No Phone Numbers Available
        </StyledText>

        <StyledButton fontSize={16} variant="text" onClick={redirectToPhoneNumberManagementTable}>
          Create a New Phone Number
        </StyledButton>
      </StyledFlex>
    </StyledFlex>
  );
  const renderTableTitle = () => (
    <StyledText size={19} weight={600}>
      Select Phone Numbers
    </StyledText>
  );

  const tableMeta = {
    currentUser,
    theme: { colors, boxShadows },
    navigate: (data) => {
      onCloseSettingsAndCreateWidgetModals();
      navigate(data);
    },
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

  const handleClearAll = () => {
    setFilterFieldValue(PHONE_NUMBER_MANAGEMENT_KEY, PHONE_NUMBER_MANAGEMENT_SIDE_FILTER_INITIAL_VALUES);
    submitFilterValue();
    setSearchText('');
  };

  const handleClearFilterField = (key) => {
    if (key === LOCATION_VALUES.REGION) {
      const locationValue = sourceFilterValue?.sideFilter?.location?.value.substring(
        sourceFilterValue?.sideFilter?.location?.value.indexOf(' ') + 1
      );
      const locationLabel = sourceFilterValue?.sideFilter?.location?.label.substring(
        sourceFilterValue?.sideFilter?.location?.label.indexOf(' ') + 1
      );
      setFilterFieldValue(PHONE_NUMBER_MANAGEMENT_KEY, {
        ...sourceFilterValue[PHONE_NUMBER_MANAGEMENT_KEY],
        location: { label: locationLabel, value: locationValue },
      });
    } else if (key === LOCATION_VALUES.PROVINCE) {
      if (sourceFilterValue?.sideFilter?.location?.value.split(' ').length === 3) {
        const locationValue = sourceFilterValue?.sideFilter?.location?.value.split(' ').pop();
        const locationLabel = locationValue;
        setFilterFieldValue(PHONE_NUMBER_MANAGEMENT_KEY, {
          ...sourceFilterValue[PHONE_NUMBER_MANAGEMENT_KEY],
          location: { label: locationLabel, value: locationValue },
        });
      } else {
        const locationValue = sourceFilterValue?.sideFilter?.location?.value.substring(
          sourceFilterValue?.sideFilter?.location?.value.indexOf(' ') + 1
        );
        const locationLabel = sourceFilterValue?.sideFilter?.location?.label.substring(
          sourceFilterValue?.sideFilter?.location?.label.indexOf(' ') + 1
        );
        setFilterFieldValue(PHONE_NUMBER_MANAGEMENT_KEY, {
          ...sourceFilterValue[PHONE_NUMBER_MANAGEMENT_KEY],
          location: { label: locationLabel, value: locationValue },
        });
      }
    } else if (key === LOCATION_VALUES.COUNTRY) {
      setFilterFieldValue(PHONE_NUMBER_MANAGEMENT_KEY, {
        ...sourceFilterValue[PHONE_NUMBER_MANAGEMENT_KEY],
        location: PHONE_NUMBER_MANAGEMENT_SIDE_FILTER_INITIAL_VALUES['location'],
      });
    } else {
      setFilterFieldValue(PHONE_NUMBER_MANAGEMENT_KEY, {
        ...sourceFilterValue[PHONE_NUMBER_MANAGEMENT_KEY],
        [key]: PHONE_NUMBER_MANAGEMENT_SIDE_FILTER_INITIAL_VALUES[key],
      });
    }
    submitFilterValue();
  };

  const renderHeaderFilterActions = () => (
    <AgentManagerModalPhoneNumberFilters
      initialValues={sourceFilterValue[PHONE_NUMBER_MANAGEMENT_KEY]}
      onApplyFilters={(sideFilter) => {
        setFilterFieldValue(PHONE_NUMBER_MANAGEMENT_KEY, sideFilter);
        submitFilterValue();
      }}
      onSearch={(e) => setSearchText(e.target.value)}
      searchText={searchText}
      phoneNumberManagementData={phoneNumberManagementData}
    />
  );

  const getRowId = (row) => row?.telephoneNumberId;

  const phoneNumberColumnsNoDeleteAndAgentsColumn = PHONE_NUMBER_MANAGEMENT_COLUMNS?.filter(
    (column) => column.id !== 'delete' && column.id !== 'associatedAgent'
  );

  return (
    <CenterModalFixed
      open={open}
      onClose={onClose}
      maxWidth="80%"
      height="80%"
      width="min-content"
      bodyHeight="100%"
      bodyPadding="0"
      enableScrollbar={false}
    >
      <StyledFlexTableRoot height="100%">
        <TableV2
          data={getPhoneNumberManagementDataAvailableNumbers()}
          columns={phoneNumberColumnsNoDeleteAndAgentsColumn}
          entityName="Phone Numbers"
          searchPlaceholder="Search Numbers..."
          sorting={sorting}
          setSorting={handleSorting}
          pagination={pagination}
          setPagination={setPagination}
          selectedFilters={selectedFiltersBar}
          enableRowSelection
          onClearAllFilters={handleClearAll}
          onClearFilter={handleClearFilterField}
          meta={tableMeta}
          isLoading={isFetching || isUpdateAgentByIdLoading}
          isEmbedded
          enableShowFiltersButton={false}
          enableSearch={false}
          pinColumns={['phoneNumber']}
          enableSelectedToolbar={false}
          pinSelectColumn
          rootHeight="100%"
          title={renderTableTitle()}
          titleDescription={renderTableDescription()}
          onSelectionChange={setSelectedTablePhoneNumbers}
          tableProps={{
            renderEmptyRowsFallback: () => renderEmptyTable(),
          }}
          getRowId={getRowId}
          showActionsInActionBar
          headerActions={renderHeaderFilterActions()}
          onTableRefresh={refetch}
          isRefreshAfterAction
        />
      </StyledFlexTableRoot>

      <StyledFlex position="absolute" bottom="18px" right="30px">
        <StyledFlex direction="row" gap="15px">
          <StyledButton primary variant="contained" minWidth={107} onClick={onClose}>
            Close
          </StyledButton>
          <StyledButton primary variant="contained" secondary minWidth={107} onClick={addPhoneNumberIdToAgent}>
            Add
          </StyledButton>
        </StyledFlex>
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default AgentManagerModalsAddPhoneNumber;
