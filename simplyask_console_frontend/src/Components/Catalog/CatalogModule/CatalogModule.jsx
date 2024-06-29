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
import classes from './CatalogModule.module.css';
import getCMHeaders, { uniqueId } from './cmHeadersSchema';

const CatalogModule = () => {
  const {
    response: productOfferings,
    fetchData: refetchTableData,
    isLoading,
    error,
  } = useAxiosGet('/catalogModule', true, CATALOG_API);

  const navigate = useNavigate();

  const searchBarHandler = () => {

  };

  const tableRowClick = (rowId) => {
    navigate(`${routes.CATALOG_MODULE}/${rowId}`);
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
          <span>Catalog Module</span>
        </div>
      </TopMenuBar>
      <Card className={classes.filters}>
        <SearchBar className={classes.searchBar} placeholder="Search" onChange={searchBarHandler} />
        <div>
          <Button
            className={classes.newCategoryButton}
            borderRadius="0"
            onClick={() => navigate(`${routes.CATALOG_MODULE_DETAILS}`, { state: { addNew: true } })}
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
              data={productOfferings?.content}
              pagination={productOfferings?.pagination}
              headers={getCMHeaders}
              uniqueIdSrc={uniqueId}
              onClick={tableRowClick}
              isLoading={isLoading}
              onPageChange={onPageChange}
            />
          )}
        </Scrollbars>
      </Card>
    </>
  );
};

export default CatalogModule;
