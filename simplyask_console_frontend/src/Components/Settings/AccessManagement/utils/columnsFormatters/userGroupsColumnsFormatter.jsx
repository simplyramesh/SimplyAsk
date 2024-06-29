/* eslint-disable react/prop-types */

import React from 'react';

import AccessManagementIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import HeaderCell from '../../../../shared/REDISIGNED/table/components/HeaderCell/HeaderCell';
import RowCell from '../../../../shared/REDISIGNED/table/components/RowCell/RowCell';
import { StyledText } from '../../../../shared/styles/styled';
import { StyledActions, StyledActionsIconWrapper } from '../../components/table/StyledActions';
import UserGroupName from '../../components/table/UserGroupName/UserGroupName';
import { formatDateMonthDayYear } from '../formatters';

export const USER_GROUPS_COLUMNS = ({ onDelete }) => [
  {
    header: 'User Groups',
    accessorFn: (row) => row.name,
    Header: (props) => <HeaderCell {...props} />,
    Cell: (props) => <UserGroupName {...props} />,
    id: 'name',
    enableGlobalFilter: false,
    size: 150,
  },
  {
    header: 'Date Created',
    accessorFn: (row) => (row.createdDate ? formatDateMonthDayYear(row.createdDate) : '---'),
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'center' }} />,
    id: 'createdDate',
    align: 'center',
    enableGlobalFilter: false,
    size: 124,
  },
  {
    header: 'Last Modified',
    accessorFn: (row) => (row.modifiedDate ? formatDateMonthDayYear(row.modifiedDate) : '---'),
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'center' }} />,
    id: 'modifiedDate',
    align: 'center',
    enableGlobalFilter: false,
    size: 124,
  },
  {
    header: 'Number of Users',
    accessorFn: (row) => row.userCount,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'center' }} />,
    id: 'users',
    align: 'center',
    enableGlobalFilter: false,
    size: 100,
  },
  {
    header: 'Actions',
    id: 'actions',
    accessorFn: (row) => row,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ row }) => {
      const hasIsEditable = Object.keys(row.original).includes('isEditable')

      return (!hasIsEditable || row.original?.isEditable) && (
      <StyledActions>
        <StyledActionsIconWrapper onClick={() => onDelete(row)}>
          <AccessManagementIcons icon="BIN" width={24} />
        </StyledActionsIconWrapper>
      </StyledActions>
    )},
    enableGlobalFilter: false,
    enableSorting: false,
    align: 'center',
    size: 20,
  },
];

export const USER_GROUPS_COLUMNS_CONDENSED = [
  {
    header: 'User Groups',
    accessorFn: (row) => row.name,
    Header: (props) => <HeaderCell {...props} />,
    Cell: (props) => <UserGroupName {...props} />,
    id: 'name',
    enableGlobalFilter: false,
    size: 100,
  },
  {
    header: 'Last Modified',
    accessorFn: (row) => (row.modifiedDate ? formatDateMonthDayYear(row.modifiedDate) : '---'),
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'center', m: '0 auto' }} />,
    id: 'modifiedDate',
    align: 'center',
    enableGlobalFilter: false,
    size: 100,
  },
  {
    header: 'Number of Users',
    accessorFn: (row) => row.userCount,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'center', m: '0 auto' }} />,
    id: 'users',
    align: 'center',
    enableGlobalFilter: false,
    size: 50,
  },
];

export const PERMISSION_GROUP_COLUMNS = ({ onDelete }) => [
  {
    header: 'Permission Group',
    accessorFn: (row) => row.name,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell, table, row }) => (
      <StyledText
        cursor="pointer"
        onClick={() => table.options.meta.onGroupClick(row.original.id)}
        size={16}
        weight={600}
      >
        {cell.getValue()}
      </StyledText>
    ),
    id: 'name',
    enableGlobalFilter: false,
    minSize: 120,
    maxSize: 150,
  },
  {
    header: 'Date Created',
    accessorFn: (row) => (row.createdDate ? formatDateMonthDayYear(row.createdDate) : '---'),
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'center', m: '0 auto' }} />,
    id: 'createdDate',
    align: 'center',
    enableGlobalFilter: false,
    maxSize: 100,
    minSize: 100,
  },
  {
    header: 'Last Modified',
    accessorFn: (row) => (row.modifiedDate ? formatDateMonthDayYear(row.modifiedDate) : '---'),
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'center', m: '0 auto' }} />,
    id: 'modifiedDate',
    align: 'center',
    enableGlobalFilter: false,
    maxSize: 100,
    size: 100,
  },
  {
    header: 'Number of Permissions',
    accessorFn: (row) => row?.permissionCount,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'center', m: '0 auto' }} />,
    id: 'permissionCount',
    align: 'center',
    enableGlobalFilter: false,
    maxSize: 200,
    size: 180,
  },
  {
    header: 'Actions',
    id: 'actions',
    align: 'center',
    accessorFn: (row) => row,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ row }) => {
      const hasIsEditable = Object.keys(row.original).includes('isEditable')

      return (!hasIsEditable || row.original?.isEditable) && (
      <StyledActions>
        <StyledActionsIconWrapper onClick={() => onDelete(row)}>
          <AccessManagementIcons icon="BIN" width={24} />
        </StyledActionsIconWrapper>
      </StyledActions>
    )},
    enableGlobalFilter: false,
    enableSorting: false,
    maxSize: 60,
    size: 60,
  },
];
