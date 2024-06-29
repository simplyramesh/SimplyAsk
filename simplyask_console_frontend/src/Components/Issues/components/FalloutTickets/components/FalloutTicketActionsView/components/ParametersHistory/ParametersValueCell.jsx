import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import { VALIDATION_TYPES } from '../../../../../../../PublicFormPage/constants/validationTypes';
import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import ViewOnlySignature from '../../../../../../../shared/REDISIGNED/controls/Signature/ViewOnlySignature';
import { StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';

const ParametersValueCell = ({ cell, maxLines, lh }) => {
  const [needClampLines, setNeedClampLines] = useState(false);
  const [clampLines, setClampLines] = useState();
  const ref = useRef(null);

  const isSignature = cell.row.original.fieldValidationType === VALIDATION_TYPES.SIGNATURE;

  useEffect(() => {
    const isMoreLimit = ref.current.clientHeight / lh > maxLines;

    setNeedClampLines(isMoreLimit);
    setClampLines(maxLines);
  }, []);

  return (
    <StyledFlex>
      {!isSignature ? (
        <StyledText size={15} lh={lh} weight={400} maxLines={needClampLines && clampLines} ref={ref}>
          {cell.getValue()}
        </StyledText>
      ) : (
        <ViewOnlySignature src={cell.getValue()} alt="Signature" containerRef={ref} />
      )}
      {needClampLines && (
        <StyledFlex alignItems="flex-end">
          <StyledButton
            variant="text"
            size="small"
            onClick={() => setClampLines(clampLines === maxLines ? 'none' : maxLines)}
          >
            {clampLines === maxLines ? 'show more' : 'show less'}
          </StyledButton>
        </StyledFlex>
      )}
    </StyledFlex>
  );
};

export default ParametersValueCell;

ParametersValueCell.propTypes = {
  maxLines: PropTypes.string,
  lh: PropTypes.string,
  cell: PropTypes.any,
};
