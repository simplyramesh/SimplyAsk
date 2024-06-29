import { KeyboardBackspace } from '@mui/icons-material';
import { useState } from 'react';
// import { useLocation } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Tabs,
  TopMenuBar,
} from 'simplexiar_react_components';

import routes from '../../../../config/routes';
import FormTab from './FormTab/FormTab';
import classes from './ProductDetails.module.css';
import TreeTab from './TreeTab/TreeTab';

const TAB_VALUES = { FORM: 0, TREE: 1 };

const ProductDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tabValue, setTabValue] = useState(TAB_VALUES.FORM);

  const onTabChange = (event, newValue) => {
    if (newValue === tabValue) return;
    setTabValue(newValue);
  };

  return (
    <>
      <TopMenuBar>
        <div className={classes.topBarLeft}>
          <Button
            className={classes.backButton}
            onClick={() => navigate(`${routes.CATALOG_PRODUCT_OFFERING}`)}
            borderRadius="5"
          >
            <KeyboardBackspace />
          </Button>
          <span>
            {
              location.state?.addNew ? <p>Add New Product Offering</p>
                : <p>Product Offering Details</p>
            }
          </span>
        </div>
      </TopMenuBar>
      <Card className={classes.filters}>
        <Tabs
          labels={[{ title: 'Form View' }, { title: 'Tree View' }]}
          value={tabValue}
          onChange={onTabChange}
        />
      </Card>
      <Card className={classes.formCard}>
        {
          (() => {
            if (tabValue === TAB_VALUES.FORM) {
              return (
                <FormTab />
              );
            }
            if (tabValue === TAB_VALUES.TREE) {
              return (
                <TreeTab />
              );
            }
          })()
        }
      </Card>
    </>
  );
};

export default ProductDetails;
