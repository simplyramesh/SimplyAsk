import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import { StyledFlex } from '../../../../../shared/styles/styled';
import Accordion from '../../../Accordian/Accordion';
import { Button, Typography } from '../../base';
import Heading from '../Heading/Heading';

const ParamGroup = ({
  children,
  heading,
  params = [],
  onAddParamClick,
  error,
  addNewButtonText = 'Add a New Parameter',
}) => {
  const paramsLength = params.length;

  const title = (
    <StyledFlex display="inline-flex" position="relative" alignItems="center" justifyContent="space-between" p="10px 0">
      <Heading as="h4" size={heading?.length > 16 ? 'small' : 'default'} withIcon>
        {heading}
      </Heading>
    </StyledFlex>
  );
  const subHeading = paramsLength ? (
    <Typography
      as="p"
      variant="small"
      weight="medium"
    >{`${paramsLength} Parameter${paramsLength > 1 ? 's' : ''}`}</Typography>
  ) : null;

  return (
    <>
      <StyledFlex gap="14px">
        {paramsLength > 0 && (
          <Accordion title={title} subHeading={subHeading}>
            {params.map((param, paramIndex) => (
              <Fragment key={paramIndex}>
                {children({
                  paramIndex,
                  param,
                })}
              </Fragment>
            ))}
          </Accordion>
        )}
        <Button error={error} text={addNewButtonText} variant="outline" flexWidth onClick={onAddParamClick} />
      </StyledFlex>
    </>
  );
};

export default ParamGroup;

ParamGroup.propTypes = {
  heading: PropTypes.string,
  children: PropTypes.func,
  params: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onAddParamClick: PropTypes.func,
  error: PropTypes.object,
};
