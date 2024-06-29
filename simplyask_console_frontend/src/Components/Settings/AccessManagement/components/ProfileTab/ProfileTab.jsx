import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import routes from '../../../../../config/routes';
import { useGetCurrentUser } from '../../../../../hooks/useGetCurrentUser';
import { useTableSortAndFilter } from '../../../../../hooks/useTableSortAndFilter';
import { useGetUserById } from '../../../../../hooks/useUserById';
import { getUserGroupsWithFilters } from '../../../../../Services/axios/permissionsUserGroups';
import { modifiedCurrentPageDetails } from '../../../../../store';
import { DEFAULT_PAGINATION } from '../../../../shared/constants/core';
import NavTabs from '../../../../shared/NavTabs/NavTabs';
import TabPanel from '../../../../shared/NavTabs/TabPanel';
import ContentLayout from '../../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import PageableTable from '../../../../shared/REDISIGNED/table/PageableTable';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledCard, StyledFlex } from '../../../../shared/styles/styled';
import { USER_FIND_BY_ID_RESPONSE } from '../../constants/apiConstants';
import useTabNavigation from '../../hooks/useTabNavigation';
import { USER_GROUPS_COLUMNS_CONDENSED } from '../../utils/columnsFormatters/userGroupsColumnsFormatter';
import CardGroupsHeader from '../CardGroupsHeader/CardGroupsHeader';
import EmptyTable from '../EmptyTable/EmptyTable';
import ManagePermissionsTab from '../ManagePermissionsTab/ManagePermissionsTab';
import ManageUserGroupsTab from '../ManageUserGroupsTab/ManageUserGroupsTab';
import PermissionSummary from '../PermissionSummary/PermissionSummary';

import ProfileTabSide from './ProfileTabSide/ProfileTabSide';

const NAV_TAB_LABELS = [{ title: 'Profile' }, { title: 'Manage Permissions' }, { title: 'Manage User Groups' }];

const ProfileTab = () => {
  const location = useLocation();
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);

  const { currentUser } = useGetCurrentUser();

  const id = currentUser?.id;
  const timezone = currentUser?.timezone;

  const {
    tabIndex, onTabChange, id: userId, navigate,
  } = useTabNavigation(NAV_TAB_LABELS);

  const {
    pagination, setPagination, sorting, setSorting, data, isFetching, refetch,
  } = useTableSortAndFilter({
    queryKey: ['getUserGroupsWithFilters'],
    queryFn: getUserGroupsWithFilters,
    initialSorting: [
      {
        id: 'modifiedDate',
        desc: false,
      },
    ],
    initialFilters: {
      userIds: userId,
      timezone,
    },
    pageSize: DEFAULT_PAGINATION.PAGE_SIZE,
    pageIndex: DEFAULT_PAGINATION.PAGE_NUMBER,
  });

  const FIVE_MINUTES = 300000;

  const { userInfo: userData, isUserFetching } = useGetUserById(userId, {
    queryKey: ['getUser', userId],
    enabled: !!userId,
    staleTime: 0,
    gcTime: FIVE_MINUTES,
    placeholderData: {
      firstName: '',
      lastName: '',
      pfp: '',
    },
  });

  useEffect(() => {
    if (userData) {
      const firstName = userData?.[USER_FIND_BY_ID_RESPONSE.FIRST_NAME];
      const lastName = userData?.[USER_FIND_BY_ID_RESPONSE.LAST_NAME];

      firstName?.length > 0
      && setCurrentPageDetailsState({
        pageUrlPath: routes.SETTINGS_ACCESS_MANAGER_USER_DETAILS,
        breadCrumbLabel: `${firstName} ${lastName}`,
      });
    }

    return () => {
      setCurrentPageDetailsState({
        pageUrlPath: null,
        breadCrumbLabel: null,
      });
    };
  }, [userData]);

  useEffect(() => {
    if (location.search.includes('tab=profile')) refetch();
  }, [location.search]);

  return (
    <PageLayout top={<NavTabs onChange={onTabChange} value={tabIndex} labels={NAV_TAB_LABELS} />}>
      {isUserFetching && <Spinner fadeBgParentFixedPosition />}
      <TabPanel value={tabIndex} index={0}>
        <ContentLayout
          side={<ProfileTabSide userData={userData} invalidateQuery="getUser" authUserId={userData?.id === id} />}
        >
          <StyledFlex mr="36px" gap="36px">
            <PermissionSummary groupType="user" onPermissions={(e) => onTabChange(e, 1)} />
            <StyledFlex>
              <StyledCard>
                <CardGroupsHeader association="PROFILE_GROUPS" onManage={(e) => onTabChange(e, 2)} />
                <PageableTable
                  data={data}
                  pagination={pagination}
                  setPagination={setPagination}
                  sorting={sorting}
                  setSorting={setSorting}
                  isLoading={isFetching}
                  enableStickyHeader={false}
                  columns={USER_GROUPS_COLUMNS_CONDENSED}
                  muiTableBodyProps={EmptyTable}
                  meta={{
                    onUserGroupNameClick: (id) => navigate({
                      pathname: `${routes.SETTINGS_USER_GROUPS}/${id}`,
                      search: 'tab=general',
                    }),
                  }}
                />
              </StyledCard>
            </StyledFlex>
          </StyledFlex>
        </ContentLayout>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <ManagePermissionsTab groupType="user" />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <ContentLayout>
          <ManageUserGroupsTab currentView="user" />
        </ContentLayout>
      </TabPanel>
    </PageLayout>
  );
};

export default ProfileTab;
