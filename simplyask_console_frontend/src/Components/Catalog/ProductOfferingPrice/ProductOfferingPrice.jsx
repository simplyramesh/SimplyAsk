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
import { CATALOG_API } from '../../../Services/axios/AxiosInstance';
import Spinner from '../../shared/Spinner/Spinner';
import getPOHeaders, { uniqueId } from './poHeadersSchema';
import classes from './ProductOfferingPrice.module.css';

const ProductOfferingPrice = () => {
  const {
    response: productOfferingPrices,
    fetchData: refetchTableData,
    isLoading,
    error,
  } = useAxiosGet('/productOfferingPrice', true, CATALOG_API);

  const navigate = useNavigate();

  const searchBarHandler = () => {

  };

  const editButtonHandler = (val) => {
    navigate(`${routes.CATALOG_PRODUCT_OFFERING_PRICE}/${val.id}`);
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
          <span>Product Offering Price</span>
        </div>
      </TopMenuBar>
      <Card className={classes.filters}>
        <SearchBar className={classes.searchBar} placeholder="Search" onChange={searchBarHandler} />
        <div>
          <Button
            className={classes.newProductOfferingPriceButton}
            borderRadius="0"
            onClick={() => navigate(`${routes.CATALOG_PRODUCT_OFFERING_PRICE_DETAILS}`, { state: { addNew: true } })}
          >
            <span>+</span>
            Add New
          </Button>
        </div>
      </Card>
      <Card className={classes.tableCard}>
        <Scrollbars className={classes.scrollbars}>
          {isLoading || error ? (
            <Spinner parent />
          ) : (
            <Table
              data={productOfferingPrices?.content}
              pagination={productOfferingPrices?.pagination}
              headers={getPOHeaders(editButtonHandler)}
              uniqueIdSrc={uniqueId}
              isLoading={isLoading}
              onPageChange={onPageChange}
            />
          )}
        </Scrollbars>
      </Card>
    </>
  );
};

export default ProductOfferingPrice;
