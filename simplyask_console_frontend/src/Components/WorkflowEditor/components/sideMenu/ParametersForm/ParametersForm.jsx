import { useFormik } from 'formik';
import PropTypes from 'prop-types';

import { useTheme } from '@emotion/react';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { SideMenuHeader } from '../SideMenu';
import { Button } from '../base';
import { Heading } from '../sub';
import { Scrollable } from '../wrappers';

const BODY_TITLE = 'API Request Body Parameters';

const ParametersForm = (props) => {
  const { title, description, initialValues, onClose, onConfirm, children, validation } = props;
  const { colors } = useTheme();

  const { values, errors, submitForm, setFieldValue, isValid } = useFormik({
    initialValues,
    onSubmit: onConfirm,
    validate: validation,
  });

  const handleChange = (field, value) => {
    setFieldValue(field, value);
  };

  const renderDescription = () => {
    return (title === BODY_TITLE ? description.body : description.header) || description;
  };

  return (
    <>
      <SideMenuHeader arrowIcon onArrowClick={onClose}>
        <Button
          onClick={submitForm}
          variant={isValid ? 'filled' : 'disabled'}
          color="primary"
          radius="ten"
          text="Confirm"
        />
      </SideMenuHeader>
      <Scrollable>
        <StyledFlex margin="0 22px" flexDirection="column">
          <form onSubmit={onConfirm}>
            <StyledFlex flexDirection="column" gap="16px" marginBottom="40px">
              <Heading size="medium" noWrap>
                {title}
              </Heading>
              {description && (
                <StyledText size={14} color={colors.information}>
                  {renderDescription()}
                </StyledText>
              )}
            </StyledFlex>
            <StyledFlex flexDirection="column">
              {children({
                values,
                errors,
                submitForm,
                handleChange,
              })}
            </StyledFlex>
          </form>
        </StyledFlex>
      </Scrollable>
    </>
  );
};

export default ParametersForm;

ParametersForm.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  initialValues: PropTypes.object,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.func,
  validation: PropTypes.func,
};
