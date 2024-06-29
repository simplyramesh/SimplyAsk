import React from 'react';
import { Card } from 'simplexiar_react_components';

import classes from './Unauthorized.module.css';

const Unauthorized = () => {
  return (
    <Card className={classes.root}>
      <div className={classes.topMenu}>
        <h3>Unauthorized</h3>
      </div>
      <div className={classes.text}>Please contact admin about page permissions.</div>
    </Card>
  );
};

export default Unauthorized;
