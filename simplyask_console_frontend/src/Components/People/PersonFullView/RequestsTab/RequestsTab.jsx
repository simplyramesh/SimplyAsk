import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// import Scrollbars from 'react-custom-scrollbars-2';
import { MultiSelect } from 'react-multi-select-component';
import { useNavigate } from 'react-router-dom';
import { Card, SearchBar, Table } from 'simplexiar_react_components';

import routes from '../../../../config/routes';
import { serviceCodes, servicesNames, statuses } from '../../../../utils/serviceRequests';
import headers, { uniqueId } from '../../../Issues/components/ServiceTickets/utils/requestHeadersSchema';
import classes from './RequestsTab.module.css';

const RequestsTab = ({ requests, refetchRequestsData, personId }) => {
  const navigate = useNavigate();
  const [filteredRequests, setFilteredRequests] = useState({ ticketId: '', serviceType: [], status: [] });

  useEffect(() => {
    refetchRequestsData(false, {
      ticketId: filteredRequests.ticketId,
      serviceType: _formatDropdownParams(filteredRequests.serviceType),
      status: _formatDropdownParams(filteredRequests.status),
    });
  }, [filteredRequests, refetchRequestsData]);

  const _formatDropdownParams = (arr) => {
    return arr.map((item) => item.value);
  };

  const getServiceTypeOptions = () => {
    return Object.keys(serviceCodes).map((key) => ({
      label: servicesNames[key],
      value: serviceCodes[key],
    }));
  };

  const getStatusesOptions = () => {
    return Object.keys(statuses).map((key) => ({
      label: statuses[key],
      value: statuses[key].toLowerCase(),
    }));
  };

  const searchBarHandler = (event) => {
    setFilteredRequests((prevParams) => ({ ...prevParams, ticketId: event.target.value.trim().toLowerCase() }));
  };

  const tableRowClick = (rowId) => {
    navigate(`${routes.TICKETS}/${rowId}`, { state: { from: personId } });
  };

  const onPageChange = (page) => {
    // setFilterParams((prevParams) => ({ ...prevParams, ticketId: event.target.value }));
    refetchRequestsData(false, { pageNumber: page - 1 });
  };

  return (
    <>
      <Card className={classes.filters}>
        <div className={classes.multiSelect}>
          <SearchBar className={classes.searchBar} placeholder="Search Ticket ID" onChange={searchBarHandler} />
          <MultiSelect
            options={getServiceTypeOptions()}
            value={filteredRequests.serviceType}
            onChange={(newValue) => setFilteredRequests((prevParams) => ({ ...prevParams, serviceType: newValue }))}
            labelledBy="Service Type"
            overrideStrings={{ selectSomeItems: 'Service Type' }}
            hasSelectAll={false}
            disableSearch
            className={`${classes.selectFilter} ${classes.serviceFilter}`}
          />
          <MultiSelect
            options={getStatusesOptions()}
            value={filteredRequests.status}
            onChange={(newValue) => setFilteredRequests((prevParams) => ({ ...prevParams, status: newValue }))}
            labelledBy="Status"
            overrideStrings={{ selectSomeItems: 'Status' }}
            hasSelectAll={false}
            disableSearch
            className={`${classes.selectFilter} ${classes.statusFilter}`}
          />
        </div>
      </Card>
      <Card className={classes.tableCard}>
        {/* <Scrollbars className={classes.requestsScrollbar} autoHide> */}
        <Table
          data={requests?.content}
          pagination={requests?.pagination}
          headers={headers}
          uniqueIdSrc={uniqueId}
          isScrollable
          scrollHeight={{ height: '70vh' }}
          onClick={tableRowClick}
          onPageChange={onPageChange}
        />
        {/* </Scrollbars> */}
      </Card>
    </>
  );
};

export default RequestsTab;

RequestsTab.propTypes = {
  requests: PropTypes.shape({
    content: PropTypes.arrayOf(PropTypes.shape({
      addressInformation: PropTypes.shape({
        city: PropTypes.string,
        country: PropTypes.string,
        formattedAddress: PropTypes.string,
        fullAddress: PropTypes.string,
        postalCode: PropTypes.string,
        province: PropTypes.string,
        streetFullAddress: PropTypes.string,
        streetName: PropTypes.string,
        streetNumber: PropTypes.string,
      }),
      agentInfo: PropTypes.shape({
        agentId: PropTypes.string,
        agentType: PropTypes.string,
        location: PropTypes.string,
        projectId: PropTypes.string,
      }),
      assignedUser: PropTypes.shape({
        assignedByUserId: PropTypes.string,
        assignedUserId: PropTypes.string,
      }),
      contactInformation: PropTypes.shape({
        email: PropTypes.string,
        firstName: PropTypes.string,
        fullName: PropTypes.string,
        lastName: PropTypes.string,
        personId: PropTypes.string,
        phoneNumber: PropTypes.string,
      }),
      createdDateTime: PropTypes.object,
      // customFields: PropTypes. (currently null)
      id: PropTypes.string,
      // notifiedUserIds: PropTypes. (currently null),
      organizationId: PropTypes.string,
      sessionId: PropTypes.string,
      status: PropTypes.string,
      statusNotes: PropTypes.arrayOf(PropTypes.shape({
        action: PropTypes.string,
        description: PropTypes.string,
        timestamp: PropTypes.object,
        title: PropTypes.string,
      })),
      ticketRequestName: PropTypes.string,
      trackNumber: PropTypes.string,
      updatedDateTime: PropTypes.object,
    })),
    pagination: PropTypes.shape({
      endingPoint: PropTypes.number,
      numberOfElements: PropTypes.number,
      pageNumber: PropTypes.number,
      startingPoint: PropTypes.number,
      totalElements: PropTypes.number,
      totalPages: PropTypes.number,
    }),
  }),
  refetchRequestsData: PropTypes.func,
  personId: PropTypes.string,
};
