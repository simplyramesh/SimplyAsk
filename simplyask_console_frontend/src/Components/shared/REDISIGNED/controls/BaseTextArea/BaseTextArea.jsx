import PropTypes from 'prop-types';

import { StyledFlex } from '../../../styles/styled';
import { StyledBaseTextArea } from './StyledBaseTextArea';

export const BaseTextArea = ({ borderColor, inputRef, ...props }) => {
  const styles = {
    '--baseTextInput-borderColor': borderColor && `1px solid ${borderColor}`,
  };

  return (
    <StyledFlex direction="row" flex="auto" width="100%">
      <StyledBaseTextArea
        {...props}
        style={styles}
        ref={inputRef}
      />
    </StyledFlex>
  );
};

export default BaseTextArea;

BaseTextArea.propTypes = {
  borderColor: PropTypes.string,
  inputRef: PropTypes.object,
};
