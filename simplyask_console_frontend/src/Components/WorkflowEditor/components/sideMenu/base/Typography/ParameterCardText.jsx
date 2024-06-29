import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { getStringifiedEditorState } from '../../../../../shared/REDISIGNED/controls/lexical/utils/helpers';
import { StyledText } from '../../../../../shared/styles/styled';
import { getParamStaticDynamicText } from '../../../../utils/helperFunctions';

const ParameterCardText = ({ title, children }) => {
  const { colors } = useTheme();

  const renderParamCardOption = ({ paramValueName, paramType = '', paramValue = '', maxLines = 0 }) => {
    const params = getStringifiedEditorState(paramValue);

    const paramTypeValue = getParamStaticDynamicText(paramValue, paramType);
    const paramTypeString = paramTypeValue ? ` (${paramTypeValue}): ` : ': ';

    return (
      <StyledText
        display="inline"
        size={14}
        weight={500}
        lh={17}
        color={colors.information}
        maxLines={maxLines}
        wordBreak="break-all"
      >
        <StyledText
          as="span"
          display="inline"
          size={14}
          weight={700}
          lh={17}
          color={colors.information}
          wordBreak="break-all"
        >
          {`${paramValueName}${paramTypeString}`}
        </StyledText>
        {params || paramValue}
      </StyledText>
    );
  };

  return (
    <>
      {title && (
        <StyledText weight={600} lh={20} maxWidth="100%" ellipsis>
          {title}
        </StyledText>
      )}
      {children({ renderParamCardOption })}
    </>
  );
};

export default ParameterCardText;

ParameterCardText.propTypes = {
  title: PropTypes.string,
  children: PropTypes.func,
};
