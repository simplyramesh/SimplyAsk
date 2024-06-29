import Select, { components } from 'react-select';

import { useUser } from '../../../../../../../contexts/UserContext';
import { getInFormattedUserTimezone } from '../../../../../../../utils/timeUtil';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';

const { Option } = components;

const AssociatedTicketSelectOption = ({ children, ...props }) => {
  const { data, innerProps, selectProps } = props;

  const { user: { timezone } } = useUser();

  return (
    <Option
      {...props}
      innerProps={{
        ...innerProps,
        onClick: () => {
          selectProps.onServiceTicket(data);
          selectProps.onMenuClose();
        },
      }}
    >
      <StyledFlex
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <StyledFlex width="157px" ml="16px">
          <StyledText size={13} lh={16} maxLines={1}>{data.displayName}</StyledText>
          <StyledText size={13} lh={16} maxLines={1}>{data.description}</StyledText>
          <StyledText display="inline" size={13} lh={16} maxLines={1} width="100%" wordBreak="break-word">
            <StyledText as="span" display="inline" size={13} lh={16} weight={600}>Process:</StyledText>
            {` ${data.createdBy}` ?? ''}
          </StyledText>
        </StyledFlex>
        <StyledFlex flex="1 1 auto">
          <StyledText size={13} lh={16} maxLines={1}>{`#${data.id}`}</StyledText>
          <StyledText display="inline" size={13} lh={16} maxLines={1} width="100%" wordBreak="break-word">
            <StyledText as="span" display="inline" size={13} lh={16} weight={600}>Create On:</StyledText>
            {` ${getInFormattedUserTimezone(data.createdAt, timezone)}` ?? 'N/A'}
          </StyledText>
        </StyledFlex>
      </StyledFlex>
      <StyledDivider borderWidth={2} flexItem />
    </Option>
  );
};

export default AssociatedTicketSelectOption;

AssociatedTicketSelectOption.propTypes = Select.propTypes;
