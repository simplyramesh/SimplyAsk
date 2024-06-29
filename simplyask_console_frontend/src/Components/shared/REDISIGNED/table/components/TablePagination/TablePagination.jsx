import { Pagination as MuiTablePagination } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useState } from 'react';

export const Pagination = styled(MuiTablePagination)(() => ({
  display: 'flex',
  alignItems: 'center',

  fontFamily: 'Montserrat, sans-serif',
  fontSize: '14px',
  color: '#2D3A47',

  backgroundColor: 'transparent',

  '& .MuiPagination-ul': {
    flexWrap: 'nowrap',
  },

  '& .MuiPaginationItem-root': {
    borderRadius: '5px',

    fontWeight: '600',
  },

  '& .MuiPagination-ul > li > .MuiPaginationItem-root:hover': {
    backgroundColor: 'rgba(45, 58, 71, 0.10)',
  },

  '& .MuiPagination-ul > li > .Mui-selected': {
    backgroundColor: '#F57B20',

    color: '#FFFFFF',
  },

  '& .MuiPagination-ul > li > .Mui-selected:hover': {
    backgroundColor: '#F57B20',
  },

  '& .MuiPaginationItem-ellipsis': {
    height: '32px',
  },
}));

const TablePagination = ({ count, onPageChange, initialPage }) => {
  const [, setPage] = useState(initialPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);

    if (typeof onPageChange === 'function') {
      onPageChange(newPage - 1);
    }
  };

  return <Pagination onChange={handlePageChange} count={count} defaultPage={1} siblingCount={1} boundaryCount={1} />;
};

export default TablePagination;

TablePagination.defaultProps = {
  initialPage: 0,
};

TablePagination.propTypes = {
  count: PropTypes.number,
  onPageChange: PropTypes.func,
  initialPage: PropTypes.number,
};
