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
import classes from './ProductOffering.module.css';

const ProductOffering = () => {
  // use axios.get instead because function doesn't work on port 8090
  const {
    response: productOfferings,
    fetchData: refetchTableData,
    isLoading,
    error,
  } = useAxiosGet(
    '/productOffering',
    true,
    CATALOG_API,
  );
  const navigate = useNavigate();

  const searchBarHandler = () => {

  };

  const editButtonHandler = (val) => {
    navigate(`${routes.CATALOG_PRODUCT_OFFERING}/${val.id}`);
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
          <span>Product Offering</span>
        </div>
      </TopMenuBar>
      <Card className={classes.filters}>
        <SearchBar className={classes.searchBar} placeholder="Search" onChange={searchBarHandler} />
        <div>
          <Button
            className={classes.newCategoryButton}
            borderRadius="0"
            onClick={() => navigate(`${routes.CATALOG_PRODUCT_OFFERING_DETAILS}`, { state: { addNew: true } })}
          >
            <span>+</span>
            Add New
          </Button>
        </div>
      </Card>
      <Card className={classes.tableCard}>
        <Scrollbars className={classes.scrollbars}>
          {
            (isLoading || error)
              ? <Spinner parent />
              : (
                <Table
                  data={productOfferings?.content}
                  pagination={productOfferings?.pagination}
                  headers={getPOHeaders(editButtonHandler)}
                  uniqueIdSrc={uniqueId}
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

export default ProductOffering;
