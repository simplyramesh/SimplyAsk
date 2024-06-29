import { Children, Fragment } from 'react';
import Select from 'react-select';

import CustomScrollbar from '../../../../../../shared/REDISIGNED/layouts/CustomScrollbar/CustomScrollbar';
import { StyledDivider, StyledFlex } from '../../../../../../shared/styles/styled';

const AssociatedTicketSelectMenuList = ({ children, ...props }) => {
  const childrenArray = Children.toArray(children);
  const childrenArrayLastIndex = childrenArray.length - 1;

  const { selectProps: { customTheme } } = props;

  return (
    <StyledFlex height="202px">
      <CustomScrollbar
        thumbWidth="4px"
        thumbColor={customTheme.colors.timberwolfGray}
        trackWidth="8px"
      >
        {childrenArray.map((child, index) => (index === childrenArrayLastIndex
          ? child
          : (
            <Fragment key={child.key}>
              {child}
              <StyledFlex px="10px">
                <StyledDivider borderWidth={1} />
              </StyledFlex>
            </Fragment>
          )))}
      </CustomScrollbar>
    </StyledFlex>
  );
};

export default AssociatedTicketSelectMenuList;

AssociatedTicketSelectMenuList.propTypes = Select.propTypes;
