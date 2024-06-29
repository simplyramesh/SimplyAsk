import { KeyboardBackspace } from '@mui/icons-material';
// import { useLocation } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, TopMenuBar } from 'simplexiar_react_components';

import routes from '../../../../config/routes';
import classes from './NotificationListenerDetails.module.css';

const NotificationListenerDetails = () => {
  const location = useLocation(); const navigate = useNavigate();

  return (
    <>
      <TopMenuBar>
        <div className={classes.topBarLeft}>
          <Button
            className={classes.backButton}
            onClick={() => navigate(`${routes.CATALOG_NOTIFICATION_LISTENER}`)}
            borderRadius="5"
          >
            <KeyboardBackspace />
          </Button>
          <span>
            {location.state?.addNew ? (
              <p>Add New Notification Listener</p>
            ) : (
              <p>Notification Listener Details</p>
            )}
          </span>
        </div>
      </TopMenuBar>
      <div className={classes.center}>
        <Card className={classes.formCard}>
          <p>Form</p>
        </Card>
      </div>
    </>
  );
};

export default NotificationListenerDetails;
