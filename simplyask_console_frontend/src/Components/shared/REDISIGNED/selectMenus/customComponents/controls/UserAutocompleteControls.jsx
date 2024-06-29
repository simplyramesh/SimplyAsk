import { components } from 'react-select';

import useUserPfp from '../../../../../../hooks/useUserPfp';
import UserAvatar from '../../../../../UserAvatar';
import { StyledFlex } from '../../../../styles/styled';

export const FormattedUserAvatar = ({ value }) => {
  const [pfp] = useUserPfp(value?.pfp);

  return <UserAvatar imgSrc={pfp} customUser={value} size="30" color={value?.id ? '#F57B20' : '#C4C4C4'} />;
};

export const ControlWithAvatar = ({ children, getValue, ...props }) => {
  const value = getValue()?.[0]?.value;

  return (
    <components.Control {...props}>
      {value && <FormattedUserAvatar value={value} />}
      {children}
    </components.Control>
  );
};

export const OptionWithAvatar = ({ children, data, ...rest }) => {
  return (
    <components.Option
      {...rest}
    >
      <StyledFlex direction="row" gap="14px" alignItems="center">
        <FormattedUserAvatar value={data.value} />
        {children}
      </StyledFlex>
    </components.Option>
  );
};