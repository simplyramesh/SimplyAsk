import { WifiRounded } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import TVIcon from '../../../icons/TVIcon';

export const ProductOffersCardTextBody = ({
  pre, bold, post, wrap,
}) => (
  <StyledText as="p" size={14} lh={21} wrap={wrap || 'collapse balance'}>
    {pre}
    {bold ? <StyledText display="inline" size={14} weight={600} lh={21}>{pre ? ` ${bold} ` : `${bold} `}</StyledText> : null}
    {post && bold ? post : null}
  </StyledText>
);

export const ProductOffersCardPricePerUnit = ({
  price, unit, color, flexGrow, strikeThrough,
}) => {
  const { colors } = useTheme();

  const textColor = color ? colors[color] : colors.primary;
  const containerFlexGrow = flexGrow || 0;
  return (
    <StyledFlex direction="row" gap="5px 0" flexGrow={containerFlexGrow}>
      <StyledText as="p" size={19} lh={29} color={textColor} weight={color ? 700 : 300}>
        <StyledText
          display="inline"
          size={30}
          lh={45}
          color={textColor}
          {...(color && { weight: 700 })}
        >
          {`$${price} `}
        </StyledText>
        {`/ ${unit} `}
        {strikeThrough
          ? (
            <StyledText
              as="s"
              display="inline"
              size={19}
              weight={300}
              lh={29}
              textDecoration={`line-through ${colors.primary}50`}
              color={`${colors.primary}50`}
            >
              <StyledText
                as="s"
                display="inline"
                size={19}
                lh={29}
                textDecoration={`line-through ${colors.primary}50`}
                color={`${colors.primary}50`}
              >
                {`$${strikeThrough?.price} `}
              </StyledText>
              {`/ ${strikeThrough?.unit}`}
            </StyledText>
          )
          : null}
      </StyledText>
    </StyledFlex>
  );
};

export const ProductOffersCardTitle = ({
  title, pricePerUnit, icon, isSubtitle,
}) => {
  const { colors } = useTheme();

  const subtitleIcons = {
    INTERNET: <WifiRounded fontSize="inherit" color="inherit" />,
    TV: <TVIcon fontSize="inherit" color="inherit" />,
  };

  const renderIcon = () => (
    <StyledFlex as="span" color={colors.primary} alignItems="center" justifyContent="center" fontSize="28px">
      {subtitleIcons[icon]}
    </StyledFlex>
  );

  const renderTitle = () => <StyledText as="h3" size={20} weight={700} lh={24}>{title}</StyledText>;

  const renderSubtitle = () => (
    <StyledFlex direction="row" gap="12px" mb="-5px" alignItems="center">
      {icon ? renderIcon() : null}
      <StyledFlex flex="1 1 auto">
        <StyledText as="p" weight={700}>{title}</StyledText>
      </StyledFlex>
      {pricePerUnit
        ? (
          <StyledText as="p" lh={24}>
            <StyledText display="inline" lh={24}>{`$${pricePerUnit?.price} `}</StyledText>
            {`/ ${pricePerUnit?.unit}`}
          </StyledText>
        )
        : null}
    </StyledFlex>
  );

  return (
    <>
      {!isSubtitle && renderTitle()}
      {isSubtitle && renderSubtitle()}
    </>
  );
};

export const GoAProductOffersCardPricePerUnit = ({
  price, unit, flexGrow, isBundle,
}) => (
  <StyledFlex flexGrow={flexGrow}>
    {isBundle ? <StyledText as="p" lh={19}>Plans from</StyledText> : null}
    <StyledText as="p" size={19} lh={23} weight={400}>
      <StyledText display="inline" size={30} lh={36} weight={400}>{`$${price} `}</StyledText>
      {`/ ${unit} `}
    </StyledText>
  </StyledFlex>
);
