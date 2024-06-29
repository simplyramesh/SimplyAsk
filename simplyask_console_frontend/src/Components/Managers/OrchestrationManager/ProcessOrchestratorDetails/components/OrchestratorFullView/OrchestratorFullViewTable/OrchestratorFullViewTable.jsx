import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import routes from '../../../../../../../config/routes';
import { useGetCurrentUser } from '../../../../../../../hooks/useGetCurrentUser';
import { useTableSortAndFilter } from '../../../../../../../hooks/useTableSortAndFilter';
import { getOrchestratorExecutionsById } from '../../../../../../../Services/axios/orchestrator';
import TableV2 from '../../../../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { ORCHESTRATOR_RECENT_EXECUTIONS_INITIAL_VALUES } from '../../../constants/initialValues';
import { ORCHESTRATOR_GROUP_EXECUTIONS_COLUMNS } from '../../../utils/formatters';

const ORCHESTRATOR_RECENT_EXECUTIONS_QUERY_KEY = 'ORCHESTRATOR_RECENT_EXECUTIONS_QUERY_KEY';

const OrchestratorFullViewTable = ({ groupId }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { currentUser: user } = useGetCurrentUser();

  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
    data,
    isFetching,
  } = useTableSortAndFilter({
    queryFn: (filterParams) => {
      const params = new URLSearchParams(filterParams);
      const paramsObj = Object.fromEntries(params.entries());

      return getOrchestratorExecutionsById(groupId, paramsObj);
    },
    queryKey: [ORCHESTRATOR_RECENT_EXECUTIONS_QUERY_KEY, groupId],
    initialFilters: {
      ...ORCHESTRATOR_RECENT_EXECUTIONS_INITIAL_VALUES,
      timezone: user?.timezone,
    },
    initialSorting: [{
      id: 'createdAt',
      desc: true,
    }],
    pageSize: 10,
  });

  const tableMeta = {
    theme,
    timezone: user?.timezone,
    handleNavigateToOrchestration: () => navigate({
      pathname: `${routes.PROCESS_ORCHESTRATION}/${groupId}`,
      search: '?tab=orchestration',
    }),
  };

  return (
    <StyledFlex>
      <StyledText mb={16} weight={600} lh={20}>Recent Executions</StyledText>
      <TableV2
        data={data}
        columns={ORCHESTRATOR_GROUP_EXECUTIONS_COLUMNS}
        isLoading={isFetching}
        sorting={sorting}
        setSorting={setSorting}
        pagination={pagination}
        setPagination={setPagination}
        emptyTableDescription="There Are No Executions"
        meta={tableMeta}
        entityName="Executions"
        enableHeader={false}
        enableRowSelection={false}
        rootHeight="100%"
        tableProps={{
          muiTableBodyRowProps: ({ row }) => ({
            onClick: () => navigate(`${routes.PROCESS_ORCHESTRATION}/${row.original.groupId}/history/${row.original.groupExecutionId}`),
          }),
        }}
      />
    </StyledFlex>
  );
};

export default OrchestratorFullViewTable;
