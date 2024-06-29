import { useTheme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import useGetIssues from '../../../../../../../hooks/issue/useGetIssues';
import { useGetCurrentUser } from '../../../../../../../hooks/useGetCurrentUser';
import { useTableSortAndFilter } from '../../../../../../../hooks/useTableSortAndFilter';
import { getFilteredProcesses } from '../../../../../../../Services/axios/processManager';
import { getInFormattedUserTimezone } from '../../../../../../../utils/timeUtil';
import ExecutionParameters from '../../../../../../shared/ExecutionParameters/ExecutionParameters';
import InfoList from '../../../../../../shared/REDISIGNED/layouts/InfoList/InfoList';
import InfoListGroup from '../../../../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import CustomIndicatorArrow from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCheckboxOption from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomSidebar from '../../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import TableV2 from '../../../../../../shared/REDISIGNED/table-v2/Table-v2';
import {
  StyledDivider,
  StyledEmptyValue,
  StyledFlex,
  StyledStatus,
  StyledText,
} from '../../../../../../shared/styles/styled';
import {
  ISSUE_CATEGORIES,
  ISSUE_ENTITY_TYPE,
  ISSUES_QUERY_KEYS,
  SERVICE_TICKET_BOA_STATUSES,
} from '../../../../../constants/core';
import { SERVICE_TICKET_BOA_STATUS_OPTIONS } from '../../../../../constants/options';
import { BOA_PROCESS_COLUMNS } from '../../../utils/formatters';

const BOAProcessesTab = () => {
  const { colors } = useTheme();
  const { ticketId: id } = useParams();

  const { currentUser: user } = useGetCurrentUser();

  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState(null);

  const tableRef = useRef(null);

  const { issues: boaProcesses } = useGetIssues({
    queryKey: ISSUES_QUERY_KEYS.GET_SERVICE_TICKETS,
    issueCategory: ISSUE_CATEGORIES.SERVICE_TICKET,
    filterParams: {
      issueId: id,
      returnRelatedEntities: true,
      returnAdditionalField: true,
      returnParameters: true,
    },
    options: {
      enabled: !!id,
      select: (data) => {
        const relatedEntities = data?.content?.[0]?.relatedEntities || [];

        const processes = relatedEntities.reduce(
          (acc, curr) =>
            curr?.type === ISSUE_ENTITY_TYPE.PROCESS ? [...acc, curr?.relatedEntity?.procInstanceId] : acc,
          []
        );

        return processes;
      },
      placeholderData: [],
    },
  });

  const { pagination, setPagination, setColumnFilters, setSearchText, data, isFetching } = useTableSortAndFilter({
    queryFn: getFilteredProcesses,
    queryKey: ['serviceTicketBOAProcesses'],
    initialFilters: {
      instanceId: boaProcesses,
      status: '',
    },
    pageSize: 10,
    options: {
      enabled: boaProcesses?.length > 0,
    },
  });

  useEffect(() => {
    if (boaProcesses?.length > 0) {
      setColumnFilters((prev) => ({ ...prev, instanceId: boaProcesses }));
    }
  }, [boaProcesses]);

  const renderHeaderActions = () => (
    <StyledFlex direction="row" alignItems="center" width="calc(244px + 12px + 57px)" gap="0 12px">
      <StyledText weight={600}>Status</StyledText>
      <CustomSelect
        name="statusFilter"
        placeholder="Select Status"
        options={SERVICE_TICKET_BOA_STATUS_OPTIONS}
        onChange={(value) => {
          const muiColumnFilter = value.map((v) => v.value);

          setColumnFilters((prev) => ({ ...prev, status: muiColumnFilter }));
        }}
        isMulti
        isSearchable={false}
        components={{
          DropdownIndicator: CustomIndicatorArrow,
          Option: CustomCheckboxOption,
        }}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        isClearable={false}
        openMenuOnClick
        menuPortalTarget={document.body}
        maxHeight={30}
        mb={0}
      />
    </StyledFlex>
  );

  const renderHeader = () => (
    <>
      <StyledText size={16} weight={500} lh={20}>{`#${rowSelection?.procInstanceId}`}</StyledText>
      <StyledText size={24} weight={600} lh={30}>
        {rowSelection?.projectName}
      </StyledText>
    </>
  );

  return (
    <>
      <TableV2
        emptyTableTitle="BOA Processes"
        emptyTableDescription="There are no BOA Processes associated to this Service Ticket"
        entityName="items"
        columns={BOA_PROCESS_COLUMNS}
        data={data}
        onSearch={(e) => setSearchText(e.target.value)}
        sorting={sorting}
        setSorting={setSorting}
        setPagination={setPagination}
        pagination={pagination}
        isLoading={!!tableRef?.current && isFetching}
        headerActions={renderHeaderActions()}
        enableRowSelection={false}
        enableShowFiltersButton={false}
        tableProps={{
          manualSorting: false,
        }}
        meta={{
          setRowSelection,
        }}
        tableRef={tableRef}
        isEmbedded
      />

      <CustomSidebar open={!!rowSelection} onClose={() => setRowSelection(null)} headerTemplate={renderHeader()}>
        {() => (
          <InfoList padding="22px 32px">
            <InfoListGroup>
              <InfoListItem name="Status">
                <StyledStatus color={rowSelection?.status === SERVICE_TICKET_BOA_STATUSES.SUCCESS ? 'green' : 'red'}>
                  {rowSelection?.status}
                </StyledStatus>
              </InfoListItem>
              <InfoListItem name="Status Details">
                <StyledEmptyValue />
              </InfoListItem>
              <InfoListItem name="Current Task">{rowSelection?.currentTask}</InfoListItem>
            </InfoListGroup>
            <StyledDivider borderWidth={2} color="#8A96AC50" m="40px 0" />
            <InfoListGroup title="Execution Details">
              <InfoListItem name="Execution Group">
                {rowSelection?.businessKey?.group || <StyledEmptyValue />}
              </InfoListItem>
              <InfoListItem name="Execution Method">{rowSelection?.businessKey?.source}</InfoListItem>
              <InfoListItem name="Executed By">{rowSelection?.businessKey?.user}</InfoListItem>
              <InfoListItem name="Start Time">
                {getInFormattedUserTimezone(rowSelection?.startTime, user?.timezone)}
              </InfoListItem>
              <InfoListItem name="End Time">
                {getInFormattedUserTimezone(rowSelection?.endTime, user?.timezone)}
              </InfoListItem>
            </InfoListGroup>
            <StyledDivider borderWidth={2} color={`${colors.regentGray}50`} m="40px 0" />
            <ExecutionParameters data={rowSelection} />
          </InfoList>
        )}
      </CustomSidebar>
    </>
  );
};

export default BOAProcessesTab;
