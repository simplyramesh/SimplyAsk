import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import React from 'react';

import CountUpNumberAnimation from '../shared/CountUpNumberAnimation/CountUpNumberAnimation';
import { StyledFlex, StyledText } from '../shared/styles/styled';

import { StyledDashboardHeader } from './StyledFOADashboard';

const ConversationsInformation = ({
  total, voice, text, average,
}) => {
  const { colors } = useTheme();

  return (
    <StyledFlex width="-webkit-fill-available">
      <StyledDashboardHeader>
        <StyledText as="p" color={colors.white} size={22} weight={700} lh={27}>{total.label}</StyledText>
        <StyledText as="p" color={colors.white} size={40} weight={700} textAlign="end" lh={49}>
          <CountUpNumberAnimation
            number={+total.value}
          />
        </StyledText>
      </StyledDashboardHeader>

      <StyledFlex
        height="142px"
        backgroundColor={colors.peachOrange}
        borderRadius="0 0 10px 10px"
        mb="18px"
      >
        <StyledFlex
          alignItems="center"
          direction="row"
          flex="1 1 auto"
          px="19px"
          borderBottom="1px solid"
          borderColor={colors.secondary}
        >
          <StyledText size={16} weight={500}>{voice.label}</StyledText>
          <StyledText size={25} weight={500} textAlign="end">{voice.value}</StyledText>
        </StyledFlex>

        <StyledFlex
          alignItems="center"
          direction="row"
          flex="1 1 auto"
          px="19px"
        >
          <StyledText size={16} weight={500}>{text.label}</StyledText>
          <StyledText size={25} weight={500} textAlign="end">{text.value}</StyledText>
        </StyledFlex>
      </StyledFlex>

      <StyledFlex
        direction="row"
        flex="1 1 auto"
        alignItems="center"
        borderRadius="10px"
        height="89px"
        px="19px"
        backgroundColor={colors.statusUnassignedBackground}
      >
        <StyledText size={16} weight={500}>{average.label}</StyledText>
        <StyledText size={25} weight={600} textAlign="end">{average.value}</StyledText>
      </StyledFlex>
    </StyledFlex>
  );
};

export default ConversationsInformation;

ConversationsInformation.propTypes = {
  total: PropTypes.object,
  voice: PropTypes.object,
  text: PropTypes.object,
  average: PropTypes.object,
  // isFetching: PropTypes.bool,
};
