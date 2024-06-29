import { components } from 'react-select';

import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import TestIcon from '../../components/TestIcon/TestIcon';

const TestTypeOption = (props) => {
  const {
    data: {
      testGenericId,
      displayName,
      genericTestType,
    },
  } = props;

  return (
    <components.Option {...props}>
      <StyledFlex direction="row" gap="14px" alignItems="center">
        <TestIcon entityType={genericTestType} />
        <StyledFlex>
          <StyledText size={15} weight={600} lh={22}>{displayName}</StyledText>
          <StyledText size={13} lh={19}>
            #
            {testGenericId}
          </StyledText>
        </StyledFlex>
      </StyledFlex>
    </components.Option>
  );
};

export default TestTypeOption;
