import Select, { components } from 'react-select';

import { StyledDivider, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';

const { Menu } = components;

const AssociatedTicketSelectMenu = ({ children, ...props }) => {
  const { selectProps: { customTheme } } = props;

  return (
    <Menu {...props}>
      <StyledFlex
        sx={{
          display: 'grid',
          gridTemplateColumns: 'min(157px, 100%) min(212px, 100%)',
          padding: '2px 0 0px 26px',
          marginBottom: '14px',
        }}
      >
        <StyledText size={15} weight={600} lh={18}>Ticket</StyledText>
        <StyledText size={15} weight={600} lh={18}>Details</StyledText>
      </StyledFlex>
      <StyledFlex px="10px">
        <StyledDivider borderWidth={1} color={customTheme.colors.primary} />
      </StyledFlex>
      {children}
    </Menu>
  );
};

export default AssociatedTicketSelectMenu;

AssociatedTicketSelectMenu.propTypes = Select.propTypes;
