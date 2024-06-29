import { components } from 'react-select';

export const IconOption = ({ children, getValue, ...props }) => {
  const { Icon } = props.data;
  return (
    <components.Option {...props}>
      {Icon && <Icon />}
      {children}
    </components.Option>
  );
};
