import PropTypes from 'prop-types';
import React, { memo } from 'react';

import { Button, InputField } from '../../base';
import { Heading } from '../../sub';
import { LabeledField } from '../../wrappers';
import css from './Configuration.module.css';

const Configuration = ({
  edges, onChange, onAdd, onDelete, errors,
}) => {
  return (
    <>
      <div className={css.configuration_title}>
        <Heading as="h3" size="large">Branch Configuration</Heading>
      </div>
      <div className={css.configuration}>
        <LabeledField label="Branch Logic" gap={14} marginBottom={14} noPad>
          {edges.map((edge, index) => (
            <InputField
              key={edge.stepId}
              placeholder={`Branch #${edge.stepId}`}
              id={edge.stepId}
              onIconClick={() => onDelete(edge.stepId)}
              value={edge.condition}
              onChange={(value) => onChange(edge.stepId, value)}
              onBlur={() => {}}
              deleteIcon={index >= 0}
              error={errors[index]}
              paramAutocomplete
              maxWidth={index >= 0 ? '246px' : '291px'}
              isIconDisabled={edges.length <= 2}
            />
          ))}
        </LabeledField>
        <LabeledField noPad>
          <Button
            text="Add a New Branch"
            variant="outline"
            onClick={onAdd}
            flexWidth
          />
        </LabeledField>
      </div>
    </>
  );
};

export default memo(Configuration);

Configuration.propTypes = {
  edges: PropTypes.arrayOf(PropTypes.object),
  onAdd: PropTypes.func,
  errors: PropTypes.shape({
    type: PropTypes.string,
    message: PropTypes.string,
  }),
};
