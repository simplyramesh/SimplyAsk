import { KeyboardBackspace } from '@mui/icons-material';
// import { useLocation } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, TopMenuBar } from 'simplexiar_react_components';

import routes from '../../../../config/routes';
import classes from './SubscriptionDetails.module.css';

const SubscriptionDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <TopMenuBar>
        <div className={classes.topBarLeft}>
          <Button
            className={classes.backButton}
            onClick={() => navigate(`${routes.CATALOG_EVENTS_SUBSCRIPTION}`)}
            borderRadius="5"
          >
            <KeyboardBackspace />
          </Button>
          <span>
            {
              location.state?.addNew ? <p>Add New Events Subscription</p>
                : <p>Subscription Details</p>
            }
          </span>
        </div>
      </TopMenuBar>
      <Card className={classes.formCard}>
        <p>Form</p>
      </Card>
    </>
  );
};

export default SubscriptionDetails;
