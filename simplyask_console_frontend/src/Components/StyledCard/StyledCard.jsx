import { ChevronRight } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Card } from 'simplexiar_react_components';

import classes from './StyledCard.module.css';

const StyledCard = ({
  id, img, name, onClick,
}) => (
  <Card className={classes.root} onClick={() => onClick(id)}>
    <div className={classes.imgContainer}>
      <img alt={`${name} card`} src={img} />
    </div>

    <p>{name}</p>
    <Button color="tertiary" borderRadius="20">
      View Details
      <ChevronRight />
    </Button>
  </Card>
);

export default StyledCard;

StyledCard.propTypes = {
  id: PropTypes.string,
  img: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func,
};
