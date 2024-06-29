import { KeyboardBackspace } from '@mui/icons-material';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useNavigate } from 'react-router-dom';
import {
  Button, Card, SearchBar, Table,
  TopMenuBar,
} from 'simplexiar_react_components';

import routes from '../../../config/routes';
import useAxiosGet from '../../../hooks/useAxiosGet';
import headers, { uniqueId } from '../../../utils/headers/mySummary/catalogHeaders';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './ProductSpecification.module.css';

const ProductSpecification = () => {
  const {
    response: productOfferings,
    fetchData: refetchTableData,
    isLoading,
    error,
  } = useAxiosGet(
    '/widget/allServiceRequests',
    true,
  );
  const navigate = useNavigate();

  const searchBarHandler = () => {

  };

  const tableRowClick = (rowId) => {
    navigate(`${routes.CATALOG_PRODUCT_SPECIFICATION}/${rowId}`);
  };

  const onPageChange = (page) => {
    refetchTableData(true, { pageNumber: page - 1 });
  };

  return (
    <>
      <TopMenuBar>
        <div className={classes.topBarLeft}>
          <Button
            className={classes.backButton}
            onClick={() => navigate(`${routes.CATALOG}`)}
            borderRadius="5"
          >
            <KeyboardBackspace />
          </Button>
          <span>Product Specification</span>
        </div>
      </TopMenuBar>
      <Card className={classes.filters}>
        <SearchBar className={classes.searchBar} placeholder="Search" onChange={searchBarHandler} />
        <div>
          <Button
            className={classes.newCategoryButton}
            borderRadius="0"
            onClick={() => navigate(`${routes.CATALOG_PRODUCT_SPECIFICATION_DETAILS}`, { state: { addNew: true } })}
          >
            <span>+</span>
            Add New
          </Button>
        </div>
      </Card>
      <Card className={classes.tableCard}>
        <Scrollbars className={classes.scrollbars}>
          {
            (isLoading || error) ? <Spinner parent />
              : (
                <Table
                  data={productOfferings?.content}
                  pagination={productOfferings?.pagination}
                  headers={headers}
                  uniqueIdSrc={uniqueId}
                  onClick={tableRowClick}
                  isLoading={isLoading}
                  onPageChange={onPageChange}
                />
              )
          }
        </Scrollbars>
      </Card>
    </>
  );
};

export default ProductSpecification;
