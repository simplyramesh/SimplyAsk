import React, { useCallback, useMemo, useState } from 'react';
import { SidedrawerModal } from 'simplexiar_react_components';

import { useGetCurrentUser } from '../../hooks/useGetCurrentUser';
import { getAgentSupportClosed } from '../../Services/axios/conversationHistoryAxios';
import NavTabs from '../shared/NavTabs/NavTabs';
import ContentLayout from '../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import TableV2 from '../shared/REDISIGNED/table-v2/Table-v2';

import { useUpdateTableFilterSearchParams } from '../../hooks/useTableFilterSearchParams';
import { useTableSortAndFilter } from '../../hooks/useTableSortAndFilter';
import ConvHisModalView from './ConvHisDetsView/ConvHisModalView';
import { CONVERSATION_HISTORY_COLUMNS } from './convsHeadersSchema';

const ConversationHistory = () => {
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useGetCurrentUser();

  const { updateSearchParams } = useUpdateTableFilterSearchParams({
    enableURLSearchParams: true,
    excludedSearchParams: ['pageSize'],
  });

  const { pagination, setPagination, sorting, setSorting, data, isFetching } = useTableSortAndFilter({
    queryFn: getAgentSupportClosed,
    queryKey: ['getAgentSupportClosed'],
    initialSorting: [
      {
        id: 'firstClosed',
        desc: true,
      },
    ],
    enableURLSearchParams: true,
    updateSearchParams,
  });

  const tableRowClick = useCallback((convId) => {
    setShowModal(true);
    setSelectedRowId(convId);
  }, []);

  const meta = useMemo(
    () => ({
      user: currentUser,
      onNameClick: tableRowClick,
    }),
    [currentUser, tableRowClick]
  );

  return (
    <PageLayout top={<NavTabs labels={[{ title: 'All Conversations' }]} value={0} />}>
      <ContentLayout noPadding fullHeight>
        <TableV2
          data={data}
          columns={CONVERSATION_HISTORY_COLUMNS}
          enableRowSelection={false}
          title="Conversation History"
          enableSearch={false}
          enableShowFiltersButton={false}
          isLoading={isFetching}
          meta={meta}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
        />
        <SidedrawerModal
          show={showModal}
          closeModal={() => setShowModal(false)}
          width="40vw"
          hasCloseButton={false}
          padding="0"
        >
          {selectedRowId && (
            <ConvHisModalView
              convId={selectedRowId}
              closeModal={() => setShowModal(false)}
              historyConvs={data?.content}
              convsIsLoading={isFetching}
            />
          )}
        </SidedrawerModal>
      </ContentLayout>
    </PageLayout>
  );
};

export default ConversationHistory;
