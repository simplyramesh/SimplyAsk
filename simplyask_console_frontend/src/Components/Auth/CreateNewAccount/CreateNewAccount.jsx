import 'react-slidedown/lib/slidedown.css';
import { useTheme } from '@emotion/react';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import SymphonaIcon from '../../../Assets/images/SymphonLogo.svg?component';
import RecommendedProductsBanner from '../../../Assets/images/recommendedProductsBanners.svg?component';
import SuccessfulAccountCreationPage from './SuccessfulAccountCreationPage/SuccessfulAccountCreationPage';
import { StyledFlex, StyledText } from '../../shared/styles/styled';
import { StyledButton } from '../../shared/REDISIGNED/controls/Button/StyledButton';
import routes from '../../../config/routes';
import { StyledBlueGradientBackground, StyledRegistrationHeaderFooter } from './StyledCreateNewAccount';
import RegistrationForms from './RegistrationForms/RegistrationForms';
import { ALL_STEPS, SIMPLYASK_PRICING_LINK, QUERY_PARAM_KEY_PROMO } from '../utils/constants';
import { useGetPromoCodeDetails } from '../../../hooks/issue/useGetPromoCodeDetails';
import Spinner from '../../shared/Spinner/Spinner';
import { SvgIcon } from '@mui/material';

const CreateNewAccount = ({ setActiveMenu, CSS_TRANSITION_ACTIVE_MENUS }) => {
  const { colors, statusColors, boxShadows } = useTheme();

  const isTelusEnvActivated = import.meta.env.VITE_IS_TELUS_ENV_ACTIVATED;

  const navigate = useNavigate();
  const [searchParam,] = useSearchParams();

  const [isPromoCodeHidden, setIsPromoCodeHidden] = useState(true);

  const [currentView, setCurrentView] = useState(ALL_STEPS.STEP_1);

  const [showRecommendedPlan, setShowRecommendedPlan] = useState(false);

  const [workEmail, setWorkEmail] = useState('');

  const { offer, isPromoCodeDetailsLoading } = useGetPromoCodeDetails(searchParam.get(QUERY_PARAM_KEY_PROMO));

  useEffect(() => {
    if (offer?.active) setIsPromoCodeHidden(false);
  }, [isPromoCodeDetailsLoading]);

  const hidePromoCode = () => setIsPromoCodeHidden(true);

  const renderPromoCode = () => (
    <StyledFlex
      bgcolor={statusColors.darkGrassGreen.bg}
      height="31px"
      justifyContent="center"
      direction="row"
      boxShadow={boxShadows.headerFooterSection}
      alignItems="center"
    >
      <StyledFlex marginRight="11px">
        <SvgIcon fontSize="small" color="success">
          <CheckCircleOutlineRoundedIcon />
        </SvgIcon>
      </StyledFlex>

      <StyledFlex>
        <StyledText size={13}>
          <StyledText size={13} weight={600} display="inline">
            Welcome Offer {new Date().getFullYear()}
          </StyledText>{' '}
          - Recieve ${offer?.onetimeCreditDollarValue} of Symphona credits after completing registration.
        </StyledText>
      </StyledFlex>

      <StyledButton fontWeight={700} fontSize={13} variant="text" onClick={hidePromoCode}>
        Dismiss
      </StyledButton>
    </StyledFlex>
  );

  const renderRecommendedPlanBanner = () => {
    return (
      <StyledFlex gap="70px" width="475px" display="flex">
        <StyledFlex gap="25px">
          <StyledText size={30} weight={700}>
            Our Enterpirse Plan Might be Right for You
          </StyledText>
          <StyledText>
            Access extended features, priority support, and advanced customization tailored for fast growing and large
            businesses.
          </StyledText>
          <StyledFlex width="140px" mt="-4px">
            <StyledButton
              borderRadius="5px"
              variant="contained"
              href={SIMPLYASK_PRICING_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </StyledButton>
          </StyledFlex>
        </StyledFlex>
        <StyledFlex as="span">
          <RecommendedProductsBanner />
        </StyledFlex>
      </StyledFlex>
    );
  };

  if (isPromoCodeDetailsLoading) return <Spinner parent />;
  return (
    <StyledFlex height="100vh" width="100vw">
      <StyledFlex zIndex={9999}> {!isPromoCodeHidden && renderPromoCode()}</StyledFlex>

      {currentView !== ALL_STEPS.STEP_6 && (
        <StyledFlex display="flex" height="100%" width="100%" direction="row">
          <StyledFlex width="50%" height="100%">
            <StyledFlex bgcolor={colors.white} display="flex" height="100vh" width="100%" overflow="hidden">
              <StyledRegistrationHeaderFooter>
                <StyledFlex as="span">
                  <SymphonaIcon width="157px" height="30px" />
                </StyledFlex>
                <StyledFlex mt="5px">
                  <StyledText mr={2}>
                    Already Have an Account?
                    <StyledText
                      cursor="pointer"
                      display="inline"
                      themeColor="linkColor"
                      onClick={() => navigate(routes.DEFAULT)}
                      weight={600}
                    >
                      {' '}
                      Log In
                    </StyledText>
                  </StyledText>
                </StyledFlex>
              </StyledRegistrationHeaderFooter>

              <StyledFlex height="100%" display="flex" flex="1">
                <StyledFlex display="flex" height="100%" justifyContent="space-between">
                  <RegistrationForms
                    isTelusEnvActivated={isTelusEnvActivated}
                    setShowRecommendedPlan={setShowRecommendedPlan}
                    userAppliedPromoCode={offer}
                    onHidePromoCode={hidePromoCode}
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                    setWorkEmail={setWorkEmail}
                  />
                </StyledFlex>
              </StyledFlex>
            </StyledFlex>
          </StyledFlex>

          <StyledFlex width="50%">
            <StyledBlueGradientBackground>
              {showRecommendedPlan && renderRecommendedPlanBanner()}
            </StyledBlueGradientBackground>
          </StyledFlex>
        </StyledFlex>
      )}
      {currentView === ALL_STEPS.STEP_6 && <SuccessfulAccountCreationPage email={workEmail} />}
    </StyledFlex>
  );
};

export default CreateNewAccount;
