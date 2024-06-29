import fileDownload from 'js-file-download';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { toast } from 'react-toastify';
import {
  SearchBarWithValue,
  Table,
} from 'simplexiar_react_components';

import { downloadExecutionReport } from '../../../../../Services/axios/migrate';
import Spinner from '../../../../shared/Spinner/Spinner';
import classes from './DownloadResults.module.css';
import headers, { DOWNLOAD_REPORTS_KEYS } from './requestHeadersSchema';

const DownloadResults = ({
  executionIdData,
  loading,
  setSearchDownloadReportFilterAPI,
  searchDownloadReportFilterAPI,
}) => {
  const [loadingDownloadReport, setLoadingDownloadReport] = useState(false);

  const searchBarHandler = (event) => {
    setSearchDownloadReportFilterAPI(event.target.value);
  };

  const downloadReportOnTableClick = async (val) => {
    const id = val?.[DOWNLOAD_REPORTS_KEYS.executionId];
    if (!id) {
      toast.error('Something went wrong...');
      return;
    }

    setLoadingDownloadReport(true);

    try {
      const res = await downloadExecutionReport(id);

      if (res) {
        fileDownload(res, 'ExecutionFile.csv');
        toast.success('The file is being being downloaded successfully...');
      }
    } catch (error) {
      toast.error('Something went wrong...');
    } finally {
      setLoadingDownloadReport(false);
    }
  };

  return (
    <div className={classes.root}>
      <Scrollbars>
        <div className={classes.upperSection}>
          <div className={classes.titleRoot}>
            Download Results
          </div>
          <div className={classes.searchBarRoot}>
            <SearchBarWithValue
              placeholder="Search Execution ID..."
              value={searchDownloadReportFilterAPI}
              onChange={searchBarHandler}
              className={`${classes.searchBar} ${searchDownloadReportFilterAPI.length > 0 ? classes.searchBarActive : ''}`}
            />
          </div>
        </div>
        {loadingDownloadReport || loading ? (
          <div className={classes.fileExecutionLoaderRoot}>
            <Spinner medium inline />
          </div>
        )
          : (
            <Table
              className={classes.tableWidth}
              tableParentClassName={classes.tableRoot}
              data={executionIdData}
              headers={headers(downloadReportOnTableClick)}
              isLoading={loadingDownloadReport || loading}
              noDataFoundTitle="No Results"
              noDataFoundCaption="You currently have no results to download"
            />
          )}
      </Scrollbars>
    </div>
  );
};

export default DownloadResults;

DownloadResults.propTypes = {
  executionIdData: PropTypes.array,
  loading: PropTypes.bool,
  setSearchDownloadReportFilterAPI: PropTypes.func,
  searchDownloadReportFilterAPI: PropTypes.string,
};
