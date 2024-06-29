import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import SvgIcon from '@mui/material/SvgIcon';
import { useTheme } from '@mui/system';
import { useQuery } from '@tanstack/react-query';

import SimplyAskFullLogo from '../../assets/SimplyAskFullLogo.svg?component';
import { getUserAvatar } from '../../axios/fileAxios';
import { fileToBase64 } from '../../utils/helperFunctions';
import { StyledFlex, StyledText, StyledHeaderImage } from '../shared/styles/styled';

const Header = ({ closeWidgetPreview, title, subTitle, appearances, getDynamicHoverColorBasedOnBgColor }) => {
  const { colors } = useTheme();

  const { data: headerLogoBlob } = useQuery({
    queryFn: () => getUserAvatar(appearances.logoDownloadUrl),
    queryKey: ['getUserAvatarById', appearances.logoDownloadUrl],
    enabled: !!appearances.logoDownloadUrl,
  });

  const { data: headerLogo } = useQuery({
    queryFn: () => fileToBase64(headerLogoBlob?.data),
    queryKey: ['fileToBase64HeaderLogo', headerLogoBlob?.data],
    enabled: !!headerLogoBlob?.data,
  });

  return (
    <StyledFlex
      backgroundColor={appearances.primaryColourHex || colors.primary}
      padding="25px 15px 20px"
      borderRadius="15px 15px 0 0"
      position="relative"
    >
      <StyledFlex>{headerLogo ? <StyledHeaderImage src={headerLogo} alt="Logo" /> : <SimplyAskFullLogo />}</StyledFlex>
      <StyledText
        weight={500}
        size={26}
        smSize={20}
        color={appearances.primaryAccentColourHex || colors.white}
        mt={18}
        lh={39}
        smMt={8}
      >
        {title}
      </StyledText>
      <StyledText
        weight={500}
        size={14}
        smSize={12}
        color={appearances.primaryAccentColourHex || colors.white}
        mt={3}
        lh={17}
        smLh={10}
      >
        {subTitle}
      </StyledText>

      <StyledFlex direction="row" gap="4px" position="absolute" right="20px">
        <StyledFlex
          color={appearances.primaryAccentColourHex || colors.white}
          cursor="pointer"
          onClick={closeWidgetPreview}
          hoverBg={getDynamicHoverColorBasedOnBgColor()}
          borderRadius="5px"
        >
          <SvgIcon component={RemoveIcon} />
        </StyledFlex>
        <StyledFlex
          color={appearances.primaryAccentColourHex || colors.white}
          cursor="pointer"
          onClick={closeWidgetPreview}
          hoverBg={getDynamicHoverColorBasedOnBgColor()}
          borderRadius="5px"
        >
          <SvgIcon component={CloseIcon} />
        </StyledFlex>
      </StyledFlex>
    </StyledFlex>
  );
};

export default Header;
