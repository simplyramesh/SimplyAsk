/* eslint-disable react/prop-types */
import { Pagination as MuiPagination } from '@mui/material';
import React, { useState } from 'react';

import classes from './Pagination.module.css';
import PaginationText from './PaginationText';

const Pagination = ({
  initialPage,
  totalPages,
  onPageChange,
  className,
  tableClass,
  pagination,
  showPaginationText,
  isChatWidgetView,
  isEntryAgentView,
}) => {
  const [page, setPage] = useState(initialPage);
  const onChange = (event, newPage) => {
    if (newPage === page) return;
    setPage(newPage);
    onPageChange(newPage);
  };

  return (
    <div className={`${classes.root} ${tableClass}`}>
      <MuiPagination
        onChange={onChange}
        count={totalPages}
        page={page}
        className={className}
        sx={{
          '& li div': {
            paddingTop: '3px',
          },
          '& .MuiPaginationItem-root': {
            borderRadius: '5px',
            fontWeight: '600',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '17px',
          },
          '& .MuiPaginationItem-root svg': {
            fontSize: '2rem',
          },
          '& .Mui-selected': {
            backgroundColor: '#f57b20',
            color: '#fff',
          },
          '& .Mui-selected:hover': {
            backgroundColor: '#f57b20',
          },
          '& .MuiPaginationItem-ellipsis': {
            height: '32px',
          },
        }}
      />
      {showPaginationText && (
        <PaginationText
          pagination={pagination}
          isChatWidgetView={isChatWidgetView}
          isEntryAgentView={isEntryAgentView}
        />
      )}
    </div>
  );
};

export default Pagination;
