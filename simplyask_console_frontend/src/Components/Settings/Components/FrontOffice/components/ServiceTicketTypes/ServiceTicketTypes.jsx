import { AddRounded } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';

import routes from '../../../../../../config/routes';
import { useFilter } from '../../../../../../hooks/useFilter';
import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';
import { useTableSortAndFilter } from '../../../../../../hooks/useTableSortAndFilter';
import { getIssueTypes } from '../../../../../../Services/axios/issuesAxios';
import { getServiceTicketsCategory } from '../../../../../../store/selectors';
import { ISSUES_QUERY_KEYS } from '../../../../../Issues/constants/core';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CenterModalFixed from '../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import ConfirmationModal from '../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import CustomSidebar from '../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import TableV2 from '../../../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import {
  SERVICE_TICKET_TYPES_INITIAL_VALUES,
  SERVICE_TICKET_TYPES_SIDE_FILTER_INITIAL_VALUES,
} from '../../constants/initialValues';
import useDeleteServiceTicketType from '../../hooks/useDeleteServiceTicketType';
import useUpdateServiceTicketType from '../../hooks/useUpdateServiceTicketType';
import { SERVICE_TICKETS_TYPES_COLUMNS } from '../../utils/formatters';
import {
  SERVICE_TICKET_TYPES_FILTER_KEY,
  serviceTicketTypeFormatter,
  serviceTicketTypesFiltersMeta,
} from '../../utils/helpers';
import ServiceTypeIconPreview from '../shared/ServiceTypeIconPreview';

import { isEqual } from 'lodash';
import DefaultTicketTypeModal from './DefaultTicketTypeModal/DefaultTicketTypeModal';
import ServiceTicketTypeFilters from './ServiceTicketTypeFilters/ServiceTicketTypeFilters';

const ServiceTicketTypes = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();

  const { currentUser: user } = useGetCurrentUser();
  const { name: serviceTicketCategoryName } = useRecoilValue(getServiceTicketsCategory);

  const [isDefaultTypeOpen, setIsDefaultTypeOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(null);
  const [isServiceTicketFilterOpen, setIsServiceTicketFilterOpen] = useState(false);
  const [isNumberOfTicketsSorting, setIsNumberOfTicketsSorting] = useState(false);
  const [updatedServiceTicketTypes, setUpdatedServiceTicketsTypes] = useState(false);

  const { sourceFilterValue, initialFilterValues, setFilterFieldValue, submitFilterValue } = useFilter({
    formikProps: {
      initialValues: {
        [SERVICE_TICKET_TYPES_FILTER_KEY]: SERVICE_TICKET_TYPES_SIDE_FILTER_INITIAL_VALUES,
        ...SERVICE_TICKET_TYPES_INITIAL_VALUES,
        category: serviceTicketCategoryName,
        timezone: user?.timezone,
      },
    },
    onSubmit: ({ filterValue, selectedFilters }) => {
      setColumnFilters(filterValue);
      setSelectedFiltersBar(selectedFilters);
    },
    formatter: serviceTicketTypeFormatter,
    selectedFiltersMeta: serviceTicketTypesFiltersMeta,
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

    data: serviceTicketTypes,
    isFetching,
    refetch,
  } = useTableSortAndFilter({
    queryFn: getIssueTypes,
    queryKey: ISSUES_QUERY_KEYS.GET_SERVICE_TYPE_CONFIGURATIONS,
    pageIndex: 0,
    pageSize: 10,
    initialSearchText: '',
    initialFilters: initialFilterValues,
    initialSorting: [
      {
        id: 'updatedAt',
        desc: false,
      },
    ],
    options: {
      enabled: !!serviceTicketCategoryName && !isNumberOfTicketsSorting,
      select: (data) => {
        return {
          data,
          defaultType: data?.content.find((item) => item.isDefault),
          issueTypeOptions: data?.content?.map((item) => ({
            label: item?.name,
            value: item?.id,
            Icon: () => <ServiceTypeIconPreview icon={item?.icon} iconColour={item?.iconColour} />,
          })),
        };
      },
    },
  });

  const prevPaginationRef = useRef(pagination);
  const prevSortingRef = useRef(sorting);

  useEffect(() => {
    if (isNumberOfTicketsSorting) {
      if (!isEqual(prevPaginationRef.current, pagination)) {
        setIsNumberOfTicketsSorting(false);
        setSorting(() => [
          {
            id: 'name',
            desc: true,
          },
        ]);
        prevPaginationRef.current = pagination;
      } else {
        const sortedContent = [...serviceTicketTypes.data.content].sort((a, b) => {
          const sortOrderAsc = a.issues.length - b.issues.length;
          return sorting[0]?.desc ? sortOrderAsc * -1 : sortOrderAsc;
        });
        const updatedServiceTicketType = {
          ...serviceTicketTypes,
          data: { ...serviceTicketTypes.data, content: sortedContent },
        };
        setUpdatedServiceTicketsTypes(updatedServiceTicketType);
        prevSortingRef.current = sorting;
      }
    }
  }, [isNumberOfTicketsSorting, sorting, pagination]);

  useEffect(() => {
    if (!isFetching && prevSortingRef.current[0].id === 'numOfTickets') {
      setIsNumberOfTicketsSorting(true);
      setSorting(() => [
        {
          id: 'numOfTickets',
          desc: true,
        },
      ]);
    }
  }, [isFetching]);

  const { updateServiceTicketType, isUpdateServiceTicketTypeLoading } = useUpdateServiceTicketType({
    onSuccess: () => {
      // TODO: Add check if a default type was deleted, then open modal to set a new default type -> when BE is updated
      toast.success('Service Ticket Type updated successfully');
      setIsDefaultTypeOpen(false);
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  const { deleteServiceTicketType } = useDeleteServiceTicketType({
    onSuccess: () => {
      toast.success('Service Ticket Type Configuration deleted successfully');
      setIsDeleteConfirmOpen(null);
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  const renderHeaderActions = () => (
    <StyledFlex direction="row" gap="0 15px">
      <StyledButton variant="contained" tertiary onClick={() => setIsDefaultTypeOpen(true)}>
        Set Default Type
      </StyledButton>
      <StyledButton
        variant="contained"
        tertiary
        startIcon={<AddRounded />}
        onClick={() =>
          navigate({
            pathname: routes.SETTINGS_CREATE_SERIVCE_TICKET_TYPE,
          })
        }
      >
        Create Ticket Type
      </StyledButton>
    </StyledFlex>
  );

  const handleClearAll = () => {
    setFilterFieldValue(SERVICE_TICKET_TYPES_FILTER_KEY, SERVICE_TICKET_TYPES_SIDE_FILTER_INITIAL_VALUES);
    submitFilterValue();
  };

  const handleDefaultTypeChange = ({ issueType }) => {
    const payload = [
      {
        id: issueType.value,
        isDefault: true,
      },
      ...(serviceTicketTypes.defaultType
        ? [
            {
              id: serviceTicketTypes.defaultType.id,
              isDefault: false,
            },
          ]
        : []),
    ];

    updateServiceTicketType(payload);
  };

  const handleClearFilterField = (key) => {
    setFilterFieldValue(SERVICE_TICKET_TYPES_FILTER_KEY, {
      ...sourceFilterValue[SERVICE_TICKET_TYPES_FILTER_KEY],
      [key]: SERVICE_TICKET_TYPES_SIDE_FILTER_INITIAL_VALUES[key],
    });
    submitFilterValue();
  };

  const handleSorting = (old) => {
    const { id, desc } = old()[0];

    setFilterFieldValue(
      SERVICE_TICKET_TYPES_FILTER_KEY,
      {
        ...sourceFilterValue[SERVICE_TICKET_TYPES_FILTER_KEY],
        [`${id}Sort`]: `${!desc}`,
      },
      false
    );

    id === 'numOfTickets' ? setIsNumberOfTicketsSorting(true) : setIsNumberOfTicketsSorting(false);
    setSorting(old);
    prevSortingRef.current = old();
    submitFilterValue();
  };

  const tableMeta = {
    user,
    updateServiceTicketType,
    onDeleteIcon: (row) => setIsDeleteConfirmOpen(row),
    navigateToType: (row) => navigate(routes.SETTINGS_EDIT_SERIVCE_TICKET_TYPE.replace(':id', row.id)),
    theme: { colors },
  };

  return (
    <>
      <StyledFlex p="48px 17px 48px 10px">
        <TableV2
          data={isNumberOfTicketsSorting ? updatedServiceTicketTypes.data : serviceTicketTypes?.data}
          columns={SERVICE_TICKETS_TYPES_COLUMNS}
          entityName="Service Ticket Types"
          searchPlaceholder="Search Ticket Types..."
          onSearch={(e) => setSearchText(e.target.value)}
          sorting={sorting}
          setSorting={handleSorting}
          pagination={pagination}
          setPagination={setPagination}
          onShowFilters={() => setIsServiceTicketFilterOpen(true)}
          selectedFilters={selectedFiltersBar}
          enableRowSelection={false}
          headerActions={renderHeaderActions()}
          onClearAllFilters={handleClearAll}
          onClearFilter={handleClearFilterField}
          meta={tableMeta}
          isLoading={isFetching || isUpdateServiceTicketTypeLoading}
          pinRowHoverActionColumns={['delete']}
          isEmbedded
          onTableRefresh={refetch}
        />
      </StyledFlex>

      <CenterModalFixed
        open={isDefaultTypeOpen}
        onClose={() => setIsDefaultTypeOpen(false)}
        maxWidth="622px"
        title="Set Default Ticket Type"
      >
        <DefaultTicketTypeModal
          onSave={handleDefaultTypeChange}
          typeOptions={serviceTicketTypes?.issueTypeOptions}
          defaultValue={serviceTicketTypes?.defaultType}
        />
      </CenterModalFixed>

      <ConfirmationModal
        isOpen={!!isDeleteConfirmOpen}
        onCloseModal={() => setIsDeleteConfirmOpen(null)}
        actionConfirmationText="delete ticket type"
        alertType="DANGER"
        title="Are you sure?"
        modalIcon="BIN"
        modalIconSize={76}
        successBtnDanger
        onSuccessClick={() => deleteServiceTicketType(isDeleteConfirmOpen?.id)}
      >
        <StyledFlex gap="17px 0">
          <StyledText display="inline" size={16} lh={16} weight={600}>
            <StyledText as="span" display="inline" size={14} lh={19}>
              {`You are about to delete ${isDeleteConfirmOpen?.name}. Completing this action will`}
            </StyledText>
            <StyledText as="span" display="inline" size={14} lh={19} weight={700}>
              {' permanently delete '}
            </StyledText>
            <StyledText as="span" display="inline" size={14} lh={19}>
              the ticket type and its configurations, as well as all Service Tickets currently using this ticket type.
            </StyledText>
          </StyledText>
          <StyledText display="inline" size={16} lh={16} weight={600}>
            <StyledText as="span" display="inline" size={14} lh={19} weight={700} color={colors.statusOverdue}>
              {'Warning: '}
            </StyledText>
            <StyledText as="span" display="inline" size={14} lh={19}>
              Any Processes or Agents using this Service Ticket Type will fail during execution after deleting the Type.
            </StyledText>
          </StyledText>
        </StyledFlex>
      </ConfirmationModal>

      <CustomSidebar
        open={isServiceTicketFilterOpen}
        onClose={() => setIsServiceTicketFilterOpen(false)}
        headStyleType="filter"
      >
        {({ customActionsRef }) => (
          <>
            {isServiceTicketFilterOpen && (
              <ServiceTicketTypeFilters
                initialValues={sourceFilterValue[SERVICE_TICKET_TYPES_FILTER_KEY]}
                onApplyFilters={(sideFilter) => {
                  setIsServiceTicketFilterOpen(false);
                  setFilterFieldValue(SERVICE_TICKET_TYPES_FILTER_KEY, sideFilter);
                  submitFilterValue();
                }}
                customActionsRef={customActionsRef}
              />
            )}
          </>
        )}
      </CustomSidebar>
    </>
  );
};

export default ServiceTicketTypes;
