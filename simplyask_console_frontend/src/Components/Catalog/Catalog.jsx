import { ChevronRight } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import LinesEllipsis from 'react-lines-ellipsis';
import { useNavigate } from 'react-router-dom';
import { Button, Card, SearchBar } from 'simplexiar_react_components';

import { mapIconsWithMenuItems, mapPermissionsWithPages } from '../../config/appRoutes';
import { getChildrenPages } from '../../Services/axios/pagePermissionsAxios';
import Spinner from '../shared/Spinner/Spinner';
import classes from './Catalog.module.css';

const Catalog = () => {
  const navigate = useNavigate();
  // const { response: pages, isLoading } = useAxiosGet("/user/allPagePermissions?type=CATALOG");
  const [filteredPages, setFilteredPages] = useState();
  const [isLoading, setLoading] = useState(true);
  const [pages, setPages] = useState();

  useEffect(() => {
    const getPages = async () => {
      try {
        // gets the pages of the catalog from the BE
        const catalogPages = (await getChildrenPages('61773bbc4450394fa85f4fad')).data;
        setFilteredPages(catalogPages);
      } catch {}
    };
    getPages();
  }, []);

  useEffect(() => {
    if (filteredPages) {
      const p = mapPermissionsWithPages(filteredPages);
      setPages(p);
    }
  }, [filteredPages]);

  useEffect(() => {
    if (pages) setLoading(false);
  }, [pages]);

  const searchBarHandler = (event) => {
    const query = event.target.value.toLowerCase();
    setFilteredPages(
      filteredPages.filter(
        ({ title, description }) => title.toLowerCase().includes(query) || description.toLowerCase().includes(query),
      ),
    );
  };

  if (isLoading) return <Spinner parent />;

  return (
    !isLoading && (
      <div className={classes.root}>
        <Card className={classes.filters}>
          <SearchBar className={classes.searchBar} placeholder="Search Module" onChange={searchBarHandler} />
        </Card>
        <div className={classes.modules}>
          {pages.length === 0 ? (
            <p className={classes.noSettingsFound}>No Catalog Modules Found</p>
          ) : (
            mapIconsWithMenuItems(pages).map(({
              title, description, pathName,
            }, index) => (
              <div className={classes.page} key={index}>
                <div className={classes.titleContainer}>
                  <h3>{title}</h3>
                </div>
                <LinesEllipsis
                  className={classes.description}
                  text={description || ''}
                  maxLine="3"
                  ellipsis="..."
                  trimRight
                  basedOn="letters"
                />
                <Button className={classes.button} onClick={() => navigate(`${pathName}`)}>
                  View Details
                  <ChevronRight />
                </Button>
              </div>
            ))
          )}
          {/* {filteredPages.map((page, i) => (
            <div className={classes.page} key={i}>
              <div className={classes.titleContainer}>
                <h3>{page.title}</h3>
                <div className={classes.iconContainer}>
                  {getIcon(page.title)}
                  </div>
              </div>
              // <LinesEllipsis
              //   className={classes.description}
              //   text={page.description}
              //   maxLine="3"
              //   ellipsis="..."
              //   trimRight
              //   basedOn="letters"
              // />
              <Button className={classes.button} onClick={() => moduleOnClick(page.title)}>
                View Details
                <ChevronRight />
              </Button>
            </div>
          ))} */}
        </div>
      </div>
    )
  );
};

export default Catalog;
