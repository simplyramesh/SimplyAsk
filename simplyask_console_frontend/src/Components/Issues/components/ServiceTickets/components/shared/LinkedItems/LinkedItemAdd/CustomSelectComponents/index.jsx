import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { components } from 'react-select';
import { StyledIconWrapper } from '../../../../../../../../Settings/Components/FrontOffice/components/shared/StyledServiceTicketTypes';
import Spinner from '../../../../../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../../../../../shared/styles/styled';
import { ISSUE_ENTITY_TYPE } from '../../../../../../../constants/core';
import LinkedItemIcon from '../../LinkedItemIcon/LinkedItemIcon';

export const LoadingMessage = () => {
  return (
    <StyledFlex height="240px" alignItems="center" justifyContent="center" p="24px 0">
      <Spinner small />
      <StyledText mt={2}>Loading Results</StyledText>
    </StyledFlex>
  );
};

export const SingleValue = ({ children, data, clearValue, ...rest }) => {
  const theme = useTheme();
  const { relatedEntity, value, label } = data;

  const handleClear = () => {
    clearValue();
    rest.selectProps.onMenuOpen();
  };

  return (
    <components.SingleValue {...rest}>
      <StyledFlex overflow="auto" direction="row" gap="10px" alignItems="center" justifyContent="space-between">
        <StyledFlex overflow="auto" direction="row" gap="10px" alignItems="center">
          <StyledFlex width="30px" height="30px" alignItems="center" justifyContent="center" flexShrink={0}>
            <LinkedItemIcon type={relatedEntity.type} relatedEntity={relatedEntity} showTooltip={false} />
          </StyledFlex>
          <StyledFlex overflow="hidden" direction="row" gap={0.5}>
            <StyledText wrap="nowrap" ellipsis>
              <StyledText display="inline" wrap="nowrap" size={16} weight={600} lh={24}>
                {label}
                {relatedEntity.type !== ISSUE_ENTITY_TYPE.USER ? (
                  <StyledText display="inline" wrap="nowrap" size={16} lh={24}>
                    {`- #${value}`}
                  </StyledText>
                ) : null}
              </StyledText>
            </StyledText>
          </StyledFlex>
        </StyledFlex>
        {rest.hasValue && (
          <StyledFlex paddingRight="2px">
            <StyledFlex
              width="30px"
              height="30px"
              alignItems="center"
              justifyContent="center"
              borderRadius="50%"
              bgcolor={theme.colors?.graySilver}
              color={theme.colors?.charcoal}
              onClick={handleClear}
              position="relative"
              zIndex={1}
            >
              <StyledIconWrapper iconWidth={20} iconHeight={20}>
                <CloseIcon />
              </StyledIconWrapper>
            </StyledFlex>
          </StyledFlex>
        )}
      </StyledFlex>
    </components.SingleValue>
  );
};

export const Option = ({ children, data, ...rest }) => {
  const { relatedEntity, value, label } = data;

  return (
    <components.Option {...rest}>
      <StyledFlex direction="row" gap="14px" alignItems="center">
        <LinkedItemIcon type={relatedEntity.type} relatedEntity={relatedEntity} showTooltip={false} />
        <StyledFlex>
          <StyledText size={15} weight={600} lh={22}>
            {label}
          </StyledText>
          {relatedEntity.type !== ISSUE_ENTITY_TYPE.USER ? (
            <StyledText size={13} lh={19}>
              #{value}
            </StyledText>
          ) : null}
        </StyledFlex>
      </StyledFlex>
    </components.Option>
  );
};

export const IndicatorsContainer = ({ hasValue, ...rest }) =>
  hasValue ? null : <components.IndicatorsContainer {...rest} />;

export const CustomControl = ({ hasValue, innerProps, ...rest }) => {
  const onMouseDown = (event) => (hasValue ? event.preventDefault() : innerProps.onMouseDown(event));

  return (
    <components.Control
      {...rest}
      hasValue={hasValue}
      innerProps={{
        ...innerProps,
        onMouseDown,
      }}
    />
  );
};
