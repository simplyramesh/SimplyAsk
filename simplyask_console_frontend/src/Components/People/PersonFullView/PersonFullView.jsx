import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useLocation, useParams } from 'react-router-dom';

import routes from '../../../config/routes';
import useTabs from '../../../hooks/useTabs';
import { getFilesByPersonId, getPersonById, getServiceRequestsByPersonId } from '../../../Services/axios/peopleAxios';
import NavTabs from '../../shared/NavTabs/NavTabs';
import ContentLayout from '../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import Spinner from '../../shared/Spinner/Spinner';
import FilesTab from './FilesTab/FilesTab';
import InfoTab from './InfoTab/InfoTab';
import RequestsTab from './RequestsTab/RequestsTab';

const TAB_VALUES = { INFORMATION_TAB: 0, REQUESTS_TAB: 1, FILES_TAB: 2 };

const PersonFullView = () => {
  const location = useLocation();
  const { personId } = useParams();

  const { tabValue: tab, onTabChange } = useTabs(TAB_VALUES.INFORMATION_TAB);

  const {
    data: person,
    error: personError,
    isLoading: personLoading,
  } = useQuery({
    queryKey: ['getPersonById', personId],
    queryFn: () => getPersonById(personId),
  });
  // TODO: refetch is not the same as useAxiosGet fetchData and will need to be updated.
  const {
    data: requests,
    error: requestsError,
    isLoading: requestsLoading,
    refetch: refetchRequestsData,
  } = useQuery({
    queryKey: ['getServiceRequestsByPersonId', personId],
    queryFn: () => getServiceRequestsByPersonId(personId),
  });
  // TODO: refetch is not the same as useAxiosGet fetchData and will need to be updated.
  const {
    data: files,
    error: filesError,
    isLoading: filesLoading,
    refetch: refetchFilesData,
  } = useQuery({
    queryKey: ['getFilesByPersonId', personId],
    queryFn: () => getFilesByPersonId(personId),
  });

  useEffect(() => {
    if (location.state?.from === routes.TICKETS_FULLVIEW) {
      onTabChange(_, TAB_VALUES.REQUESTS_TAB);
    } else {
      onTabChange(_, TAB_VALUES.INFORMATION_TAB);
    }
  }, [location.state?.from]);

  const getContent = () => {
    switch (tab) {
      case TAB_VALUES.INFORMATION_TAB:
        return <InfoTab person={person} />;
      case TAB_VALUES.REQUESTS_TAB:
        return <RequestsTab requests={requests} refetchRequestsData={refetchRequestsData} personId={personId} />;
      case TAB_VALUES.FILES_TAB:
        return <FilesTab files={files} refetchFilesData={refetchFilesData} />;
      default:
        return <p>Something went wrong!</p>;
    }
  };

  if (personError || requestsError || filesError) return <Navigate to={`${routes.PEOPLE}`} replace />;

  if (personLoading || requestsLoading || filesLoading) return <Spinner global />;
  return (
    <PageLayout
      top={
        <NavTabs
          labels={[{ title: 'Information' }, { title: 'Requests' }, { title: 'Files' }]}
          value={tab}
          onChange={onTabChange}
        />
      }
    >
      <ContentLayout>{getContent()}</ContentLayout>
    </PageLayout>
  );
};

export default PersonFullView;
