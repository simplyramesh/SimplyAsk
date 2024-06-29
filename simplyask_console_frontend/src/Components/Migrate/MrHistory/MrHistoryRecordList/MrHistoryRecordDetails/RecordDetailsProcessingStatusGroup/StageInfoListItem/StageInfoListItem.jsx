import PropTypes from 'prop-types';

import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';

const StageInfoListItem = ({ name, children }) => {
  return (
    <StyledFlex>
      <StyledFlex p="14px 0" minHeight="50px">
        <StyledText weight={600} lh={19.5}>{name}</StyledText>
      </StyledFlex>
      {children}
    </StyledFlex>
  );
};

export default StageInfoListItem;

StageInfoListItem.propTypes = {
  name: PropTypes.string,
  children: PropTypes.node,
};
