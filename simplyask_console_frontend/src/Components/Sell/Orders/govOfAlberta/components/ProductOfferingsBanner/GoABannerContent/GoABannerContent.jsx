import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';

const GoABannerContent = ({ companyName = '', companyColor }) => {
  const [firstWord, secondWord, ...restWords] = companyName?.split(' ') || [];
  const shopText = (firstWord && secondWord) ? ` ${firstWord} ${secondWord}` : '';
  const offerText = restWords.length ? ` ${restWords.join(' ')}` : ` ${firstWord || ''} ${secondWord || ''}`.trim();

  const renderCompanyName = (name) => (
    <StyledText display="inline" size={40} weight={700} color={companyColor.color} wrap="nowrap" lh={60}>
      {name}
    </StyledText>
  );

  return (
    <StyledFlex position="relative" flex="auto" p="0px 78px">
      <StyledText size={40} weight={700} lh={60}>
        Shop
        {renderCompanyName(shopText)}
      </StyledText>
      <StyledText as="p" size={40} weight={700} wrap="nowrap" lh={60}>
        {renderCompanyName(offerText)}
        {' '}
        Offers
      </StyledText>
    </StyledFlex>
  );
};
export default GoABannerContent;
