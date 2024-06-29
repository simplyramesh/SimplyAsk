import React, { useEffect, useState } from 'react';
// import Scrollbars from 'react-custom-scrollbars-2';
import { useNavigate } from 'react-router-dom';
import { Card, SearchBar, Table } from 'simplexiar_react_components';

import routes from '../../config/routes';
import useAxiosGet from '../../hooks/useAxiosGet';
import Spinner from '../shared/Spinner/Spinner';
import classes from './People.module.css';
import headers, { uniqueId } from './peopleHeadersSchema';

const People = () => {
  const { response: people, isLoading, error } = useAxiosGet('/person/findAll', true);
  const [filteredPeople, setFilteredPeople] = useState(null);
  const [completeResponse, setCompleteResponse] = useState([{}]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && people) {
      setCompleteResponse(people.content);
    }
  }, [isLoading, people]);

  useEffect(() => {
    if (completeResponse) {
      setFilteredPeople(completeResponse);
    }
  }, [completeResponse]);

  useEffect(() => {
    if (filteredPeople) {
      setLoading(false);
    }
  }, [filteredPeople]);

  const tableRowClick = (rowId) => {
    navigate(`${routes.PEOPLE}/${rowId}`);
  };

  const searchBarHandler = (event) => {
    if (event.target.value.length > 0) {
      setFilteredPeople(
        completeResponse.filter(
          (item) => item?.contactInformation?.first_name?.toLowerCase().startsWith(event.target.value)
            || item?.contactInformation?.last_name?.toLowerCase().startsWith(event.target.value)
            || item?.contactInformation?.email?.toLowerCase().startsWith(event.target.value)
            || item?.contactInformation?.phone_number?.toLowerCase().startsWith(event.target.value)
            || item?.addressInformation?.address?.toLowerCase().startsWith(event.target.value),
        ),
      );
    } else {
      setFilteredPeople(completeResponse);
    }
  };

  if (error) return <p>{error}</p>;

  if (loading) return <Spinner global />;

  return (
    <div className={classes.root}>
      <Card className={classes.filters}>
        <SearchBar className={classes.searchBar} placeholder="Search Person" onChange={searchBarHandler} />
      </Card>
      <Card className={classes.tableCard}>
        {/* <Scrollbars className={classes.requestsScrollbar} autoHide> */}
        <Table
          data={filteredPeople}
          headers={headers}
          uniqueIdSrc={uniqueId}
          isScrollable
          scrollHeight={{ height: '70vh' }}
          onClick={tableRowClick}
          isLoading={isLoading}
        />
        {/* </Scrollbars> */}
      </Card>
    </div>
  );
};

export default People;
