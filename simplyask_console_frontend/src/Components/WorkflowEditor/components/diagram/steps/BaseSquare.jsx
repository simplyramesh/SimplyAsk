import PropTypes from 'prop-types';
import React, { memo } from 'react';

import TriangleIcon from '../../../../../Assets/icons/triangle.svg?component';
import { stepTypes } from '../../../constants/graph';
import diagramStyles from '../diagram.module.css';

const BaseSquare = ({ type, infoBlocks, id }) => {
  const isStart = type === stepTypes.START;

  return (
    <section
      className={`step ${diagramStyles.BaseSquare} ${isStart ? diagramStyles.Start : diagramStyles.End}`}
      id={id}
    >
      <section className={diagramStyles.BaseSquareIcon}>
        {isStart ? (
          <TriangleIcon className={diagramStyles.TriangleIcon} />
        ) : (
          <section className={diagramStyles.BaseSquareIconEnd} />
        )}
        <section />
      </section>
      <section className={diagramStyles.BaseSquareText}>{isStart ? 'Start' : 'End'}</section>

      {infoBlocks}
    </section>
  );
};

BaseSquare.propTypes = {
  type: PropTypes.string,
  infoBlocks: PropTypes.element,
};

export default memo(BaseSquare);
