/* eslint-disable react/prop-types */

import { useGetUserById } from '../../../../../hooks/useUserById';
import AccessManagementIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import HeaderCell from '../../../../shared/REDISIGNED/table/components/HeaderCell/HeaderCell';
import RowCell from '../../../../shared/REDISIGNED/table/components/RowCell/RowCell';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import SpecialRoles from '../../components/table/SpecialRoles/SpecialRoles';
import { StyledActions, StyledActionsIconWrapper } from '../../components/table/StyledActions';
import UsernameWithAvatar from '../../components/table/UsernameWithAvatar/UsernameWithAvatar';
import { formatDateMonthDayYear } from '../formatters';

export const MANAGE_USERS_COLUMNS = ({ onDelete }) => [
  {
    header: 'User',
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    Header: (props) => <HeaderCell {...props} />,
    Cell: (props) => <UsernameWithAvatar {...props} />,
    id: 'lastName', // id set to lastName for sorting (has to be either lastName or firstName but not both)
    enableGlobalFilter: false,
    minSize: 140,
    maxSize: 300,
  },
  {
    header: 'Date Added',
    accessorFn: (row) => (row.createdDate ? formatDateMonthDayYear(row.createdDate) : '---'),
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} />,
    id: 'createdDate', // id needs to match api sort options
    enableGlobalFilter: false,
    align: 'center',
    maxSize: 124,
    size: 124,
  },
  {
    header: 'Last Modified',
    accessorFn: (row) => (row.modifiedDate ? formatDateMonthDayYear(row.modifiedDate) : '---'),
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} />,
    id: 'modifiedDate',
    enableGlobalFilter: false,
    align: 'center',
    maxSize: 124,
    size: 124,
  },
  {
    header: 'Special Role',
    accessorFn: (row) => row.roles,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <SpecialRoles roles={cell.getValue()} {...cell} />,
    id: 'roles',
    enableGlobalFilter: false,
    align: 'center',
    maxSize: 112,
    size: 112,
  },
  {
    header: 'Status',
    accessorFn: (row) => (row.isLocked ? 'DEACTIVATED' : 'ACTIVATED'),
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <StatusBadge icon={cell.getValue()} {...cell} />,
    id: 'isLocked',
    enableGlobalFilter: false,
    align: 'center',
    size: 136,
    maxSize: 136,
  },
  {
    header: 'Actions',
    id: 'actions',
    accessorFn: (row) => row.isLocked,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ row }) => {
      const id = row.original?.id;
      const isEditable = row.original?.isEditable;
      // NOTE: This is not a good practice - making API requests for each row; change implementation when time permits
      const { userInfo, isUserFetching } = useGetUserById(id, {
        queryKey: ['getUser', id],
        enabled: !!id && !isEditable,
        placeholderData: {
          firstName: '',
          lastName: '',
          pfp: '',
        },
      });

      const showAction = !isEditable ? userInfo?.role !== 'admin' && !isUserFetching : true;

      return (
        showAction && (
          <StyledActions>
            <StyledActionsIconWrapper onClick={() => onDelete(row)}>
              <AccessManagementIcons icon="BIN" width={24} />
            </StyledActionsIconWrapper>
          </StyledActions>
        )
      );
    },
    enableGlobalFilter: false,
    enableSorting: false,
    align: 'center',
    maxSize: 60,
    size: 60,
  },
];
