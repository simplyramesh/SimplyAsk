import { components } from 'react-select';

export const IconControl = ({ children, getValue, ...props }) => {
  const Icon = getValue()?.[0]?.Icon;

  return (
    <components.Control {...props}>
      {Icon && <Icon />}
      {children}
    </components.Control>
  );
};
