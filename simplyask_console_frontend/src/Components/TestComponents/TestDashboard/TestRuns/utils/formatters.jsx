/* eslint-disable react/prop-types */
import moment from 'moment';

import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import EditableCommentsCell from '../TestRunsTable/EditableCommentsCell/EditableCommentsCell';
import TextFieldCell from '../TestRunsTable/EditableCommentsCell/TextFieldCell';
import EnvironmentCell from '../TestRunsTable/EnvironmentCell/EnvironmentCell';
import EnvironmentStatusGroupHeader from '../TestRunsTable/EnvironmentStatusGroupHeader/EnvironmentStatusGroupHeader';
import TestCasesCell from '../TestRunsTable/TestCasesCell/TestCasesCell';
import TestSuiteCell from '../TestRunsTable/TestSuiteCell/TestSuiteCell';
import TwoRowHeaderCell from '../TestRunsTable/TwoRowHeaderCell/TwoRowHeaderCell';
import { TEST_RUN_COLUMN_KEYS } from './helpers';

const environmentBgColorAndBorder = ({ colors, borders }) => ({
  backgroundColor: colors.tertiary,
  border: 'none',
  borderRight: borders.table.default,
  borderBottom: borders.table.separator,
});

const twoRowHeaderCellProps = (isBorderRight = true) => {
  return {
    rowSpan: 0,
    sx: ({ colors, borders }) => ({
      padding: '0px',
      backgroundColor: colors.tertiary,
      borderBottom: borders.table.separator,
      borderRight: isBorderRight ? borders.table.default : 'none',
      '& .Mui-TableHeadCell-Content': {
        marginTop: '36px',
      },
    }),
  };
};

const emptyHeaderCellProps = () => {
  return {
    sx: () => ({
      display: 'none',
    }),
  };
};

export const environmentStatusColumns = (data) => {
  const ENVIRONMENT = TEST_RUN_COLUMN_KEYS.TEST_CASE_ENVIRONMENT;

  return {
    header: `${data[ENVIRONMENT]}`,
    Header: () => <StyledText weight={600}>{data[ENVIRONMENT]}</StyledText>,
    accessorFn: (row) => row?.[data[ENVIRONMENT]],
    Cell: EnvironmentCell,
    id: `${data[ENVIRONMENT].toLowerCase()}`,
    muiTableHeadCellProps: {
      sx: (theme) => ({
        ...environmentBgColorAndBorder(theme),
        width: 'fit-content',
        '& .Mui-TableHeadCell-Content': {
          justifyContent: 'center',
          margin: '0 auto',
        },
      }),
    },
    size: 90,
    enableEditing: false,
    rowSpan: 1,
  };
};

export const testRunsTableColumns = [
  {
    header: 'Test Suites',
    Header: ({ header }) => <TwoRowHeaderCell header={header} />,
    id: 'testSuitesHeader',
    columns: [{
      header: '',
      accessorFn: (row) => {
        if (!row) return null;

        return {
          [TEST_RUN_COLUMN_KEYS.TEST_SUITE_NAME]: row[TEST_RUN_COLUMN_KEYS.TEST_SUITE_NAME],
          [TEST_RUN_COLUMN_KEYS.TEST_SUITE_EXECUTED_AT]: row[TEST_RUN_COLUMN_KEYS.TEST_SUITE_EXECUTED_AT],
          [TEST_RUN_COLUMN_KEYS.TEST_SUITE_CASES_TOTAL]: row[TEST_RUN_COLUMN_KEYS.TEST_SUITE_CASES_TOTAL],
          [TEST_RUN_COLUMN_KEYS.TEST_SUITE_CASES_PASSED]: row[TEST_RUN_COLUMN_KEYS.TEST_SUITE_CASES_PASSED],
        };
      },
      id: 'testSuites',
      Cell: TestSuiteCell,
      muiTableBodyCellProps: ({ row, cell, table }) => ({
        sx: ({ colors, borders }) => ({
          position: 'relative',
          display: row.depth === 0 ? 'table-cell' : 'none',
          borderRight: borders.table.default,
          borderBottom: borders.table.separator,
          padding: '20px 16px 28px 20px',

          '& .Mui-TableHeadCell-Content': {
            justifyContent: 'center',
            margin: '0 auto',
          },

          '& div span svg': {
            display: 'none',
          },

          '&:hover': {
            backgroundColor: colors.white,
            cursor: 'pointer',
            zIndex: 2,
            overflow: 'unset',
            '& div span svg': {
              display: 'block',
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              boxShadow: '0px 0px 0px 2px #4299FF inset',
            },
          },
        }),
        colSpan: 0,
        rowSpan: row.getLeafRows().length + 1,
        onClick: () => table.options.meta.onNavigate({ row, cell, table }),
      }),
      muiTableHeadCellProps: (props) => ({ ...emptyHeaderCellProps(props) }),
      size: 334,
      enableEditing: false,
    }],
    muiTableHeadCellProps: () => ({ ...twoRowHeaderCellProps() }),
    size: 334,
    enableEditing: false,
  },
  {
    header: 'Test Cases',
    Header: ({ header }) => <TwoRowHeaderCell header={header} />,
    columns: [{
      header: '',
      accessorFn: (row) => row?.[TEST_RUN_COLUMN_KEYS.TEST_CASE_NAME],
      id: 'testCases',
      Cell: TestCasesCell,
      size: 140,
      enableEditing: false,
      muiTableHeadCellProps: (props) => ({ ...emptyHeaderCellProps(props) }),
    }],
    muiTableHeadCellProps: () => ({ ...twoRowHeaderCellProps() }),
  },
  {
    header: 'Environment Status',
    id: 'environmentStatus',
    Header: EnvironmentStatusGroupHeader,
    muiTableHeadCellProps: () => ({
      sx: (theme) => ({
        ...environmentBgColorAndBorder(theme),
        borderBottom: theme.borders.table.default,
        '& .Mui-TableHeadCell-Content': {
          padding: '10px 0px 4px 0px',
        },
      }),
    }),
    columns: [],
    rowSpan: 1,
  },
  {
    header: 'Comments',
    Header: ({ header }) => <TwoRowHeaderCell header={header} />,
    muiTableHeadCellProps: () => ({ ...twoRowHeaderCellProps(false) }),
    columns: [{
      header: '',
      id: 'comments',
      accessorFn: (row) => row?.[TEST_RUN_COLUMN_KEYS.TEST_CASE_COMMENT],
      Cell: EditableCommentsCell,
      Edit: TextFieldCell,
      enableEditing: true,
      size: 224,
      muiTableHeadCellProps: (props) => ({ ...emptyHeaderCellProps(props) }),
    }],
  },
];

export const createNewTestRunDropdownColumns = [
  {
    header: 'Execution ID',
    Header: ({ header }) => <StyledText size={14} weight={600} wrap="nowrap">{header.column.columnDef.header}</StyledText>,
    accessorFn: (row) => (row.displayName !== 'None'
      ? row.testSuiteExecutionId
      : row.displayName),
    id: 'executionId',
    Cell: ({ cell }) => {
      return (
        <StyledFlex direction="row" alignItems="center" p="16px">
          <StyledText size={14} cursor="pointer" lh={17}>{cell.getValue()}</StyledText>
        </StyledFlex>
      );
    },
    size: 156,
    enableEditing: false,
  },
  {
    header: 'Completion Time',
    Header: ({ header }) => <StyledText size={14} weight={600} wrap="nowrap">{header.column.columnDef.header}</StyledText>,
    accessorFn: (row) => row.createdAt,
    id: 'completionTime',
    Cell: ({ cell }) => {
      const isCellValueNull = cell.getValue() == null;

      return (
        <StyledFlex width="134px">
          {!isCellValueNull && (
            <>
              <StyledText size={14} cursor="pointer" lh={19.5}>{moment(cell.getValue()).format('MMM D, YYYY')}</StyledText>
              <StyledFlex direction="row" gap="0 4px">
                <StyledText size={14} cursor="pointer" lh={19.5}>{moment(cell.getValue()).format('h:mm a')}</StyledText>
                {cell.row.index === 1 && (
                  <StyledText
                    size={14}
                    cursor="pointer"
                    lh={19.5}
                    color="#808080"
                  >
                    (Latest)
                  </StyledText>
                )}
              </StyledFlex>
            </>
          )}
          {isCellValueNull && <StyledText size={14} cursor="pointer" lh={19.5}>---</StyledText>}
        </StyledFlex>
      );
    },
    size: 155,
    enableEditing: false,
  },
  {
    header: 'Result',
    Header: ({ header }) => <StyledText size={14} weight={600} wrap="nowrap">{header.column.columnDef.header}</StyledText>,
    accessorFn: (row) => Math.ceil((row.testCasePass / row.testCaseCount) * 100),
    id: 'result',
    Cell: ({ cell }) => {
      const cellValue = cell.getValue() >= 0 ? `${cell.getValue()}% Success` : '---';

      return <StyledText size={14} cursor="pointer">{cellValue}</StyledText>;
    },
    size: 95,
    enableEditing: false,
  },
];
