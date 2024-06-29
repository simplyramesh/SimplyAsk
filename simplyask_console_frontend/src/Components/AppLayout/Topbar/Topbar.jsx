import { useTheme } from '@emotion/react';
import { KeyboardArrowDown } from '@mui/icons-material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Popover, Skeleton } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import { Modal, SidedrawerModal } from 'simplexiar_react_components';

import ChatIcon from '../../../Assets/icons/chat.svg?component';
import profileIcon from '../../../Assets/icons/profileIcon.svg';
import LogoutIcon from '../../../Assets/icons/vector.svg';
import routes from '../../../config/routes';
import { useConversation } from '../../../contexts/ConversationContext';
import { useGetCurrentUser } from '../../../hooks/useGetCurrentUser';
import useUserPfp from '../../../hooks/useUserPfp';
import { Logout } from '../../../Services/axios/authAxios';
import { postFeedback } from '../../../Services/axios/Support';
import {
  currentPageInfoSelector,
  mappedGrantedPagesSelector,
  modifiedCurrentPageDetailsSelector,
} from '../../../store/selectors';
import { LOCAL_STORAGE_KEYS } from '../../../utils/constants';
import ChatFileModalView from '../../Chat/ChatFileModalView/ChatFileModalView';
import ChatModalView from '../../Chat/ChatModalView/ChatModalView';
import HelpResourceFab from '../../HelpResourceFab/HelpResourceFab';
import NotificationsModalView from '../../NotificationsModalView/NotificationsModalView';
import AddFeatureIcon from '../../shared/REDISIGNED/icons/svgIcons/AddFeatureIcon';
import { StyledTooltip } from '../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledText } from '../../shared/styles/styled';
import UserAvatar from '../../UserAvatar';
import classes from '../Navbar.module.css';
import SidebarIcons from '../SidebarIcons/SidebarIcons';
import {
  ROUTES_TO_SHOW_ID,
  ROUTES_WITH_ADDITIONAL_MANUAL_BREADCRUMB,
  ROUTES_WITH_HIDDEN_BREADCRUMB,
  ROUTES_WITH_MODIFIED_BREADCRUMB_LABEL,
  ROUTES_WITH_MODIFIED_PAGE_TITLE,
} from '../utils/constants';
import { captureScreenshot, getBreadcrumbs, getFeedbackInfo } from '../utils/helpers';

import NavbarButton from './NavbarButton/NavbarButton';
import {
  StyledBreadCrumbIcon,
  StyledBreadCrumbLabel,
  StyledBreadCrumbLink,
  StyledHeader,
  StyledHeaderRight,
} from './StyledTopbar';
import { CustomHelmet } from '../../shared/REDISIGNED/CustomHelmet/CustomHelmet';

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const modifiedCurrentPage = useRecoilValue(modifiedCurrentPageDetailsSelector);
  const currentRoute = useRecoilValue(currentPageInfoSelector);
  const grantedPages = useRecoilValue(mappedGrantedPagesSelector);
  const breadcrumbs = useMemo(() => getBreadcrumbs(currentRoute, grantedPages), [currentRoute, grantedPages]);
  const { pageName } = currentRoute || {};
  const { hasUnreadChat } = useConversation();
  const [showChatModalView, setShowChatModalView] = useState(false);
  const [showNotifModalView, setShowNotifModalView] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const profileMenuRef = useRef(null);
  const { currentUser, refetchCurrentUser } = useGetCurrentUser();
  const { colors } = useTheme();

  const [feedback, setFeedback] = useState(null);
  const [feedbackStateRef, setFeedbackStateRef] = useState(null);
  const [screenshot, setScreenshot] = useState('');

  const feedbackRef = useRef(null);

  const breadCrumbRootRef = useRef(null);

  const [profileImg] = useUserPfp(currentUser?.pfp);

  const replaceToCurrentId = () => `#${location.pathname.split('/').at(-1)}`;

  const getBreadcrumbLabel = (b) => {
    if (
      b.pageUrlPath === modifiedCurrentPage?.pageUrlPath &&
      ROUTES_WITH_MODIFIED_BREADCRUMB_LABEL.includes(b?.pageUrlPath)
    )
      return modifiedCurrentPage?.breadCrumbLabel || b.pageName;

    return ROUTES_TO_SHOW_ID.includes(b.pageUrlPath) ? replaceToCurrentId() : b.pageName;
  };

  const getManualBreadcrumbs = () => {
    const isManualBreadcrumbPresent =
      modifiedCurrentPage?.manualBreadCrumbLastEntry &&
      ROUTES_WITH_ADDITIONAL_MANUAL_BREADCRUMB.includes(modifiedCurrentPage?.pageUrlPath);

    const filterBreadCrumbs = breadcrumbs?.filter((item) => !ROUTES_WITH_HIDDEN_BREADCRUMB.includes(item.pageUrlPath));

    let result = isManualBreadcrumbPresent
      ? [...filterBreadCrumbs, modifiedCurrentPage.manualBreadCrumbLastEntry]
      : filterBreadCrumbs;

    result = result?.map((breadCrumb) => ({
      ...breadCrumb,
      breadCrumbLabel: getBreadcrumbLabel(breadCrumb),
    }));

    return result;
  };

  const { mutate: submitFeedback, isPending: isSubmitFeedbackLoading } = useMutation({
    mutationFn: (payload) => postFeedback(payload),
    onSuccess: () => {
      setFeedback(null);
      setScreenshot('');
      toast.success(`${feedback.reportType === 'BUG' ? 'Bug Report' : 'Feedback'} submitted successfully.`);
    },
    onError: () => {
      toast.error(`Unable to submit ${feedback.reportType === 'BUG' ? 'Bug Report' : 'Feedback'}`);
    },
  });

  const logout = () => {
    setOpenProfileMenu(false);
    Logout();
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CART);
    window.location = routes.DEFAULT;
  };

  const toggleChatModal = () => {
    if (showChatModalView) return;

    const currentPath = location.pathname;
    if (currentPath.startsWith(routes.CHAT))
      return toast.error('Chats shortview can not be opened when viewing the chat page.');
    setShowChatModalView(true);
  };

  const handleManageProfile = () => {
    setOpenProfileMenu(false);
    navigate(`${routes.PROFILE}`);
  };

  const handleshowProfileMenu = () => {
    setAnchorEl(profileMenuRef.current);
    setOpenProfileMenu(true);
    refetchCurrentUser();
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
    setOpenProfileMenu(false);
  };

  const onSubmitFeedback = () => {
    const payload = {
      ...feedback,
      encodedScreenshot: screenshot,
    };

    submitFeedback(payload);
  };

  const onFeedback = async (data) => {
    const currentView = breadcrumbs.slice(-1)[0].pageName;
    const isNullData = data === null;

    if (isNullData && !!feedbackStateRef) setFeedbackStateRef(null);

    const feedbackData =
      typeof data === 'function' || isNullData
        ? data
        : {
            description: '',
            reportType: 'BUG',
            ...getFeedbackInfo(currentView),
            encodedScreenshot: screenshot,
          };

    setFeedback(feedbackData);

    if (feedbackData && feedback === null) {
      const data = await captureScreenshot();

      setScreenshot(data);
    }
  };

  const isBreadcrumbClickable = (index) => index !== 0 && index !== getManualBreadcrumbs()?.length - 1;

  const getLinkColor = (b, index) => {
    if (b.colour) return b.colour;

    return index === getManualBreadcrumbs()?.length - 1 ? colors.primary : colors.information;
  };

  const getLinkBreadcrumbs = () =>
    getManualBreadcrumbs()?.map((b, index) => {
      let { breadCrumbLabel } = b;
      let urlPath = b.pageUrlPath;

      const clickableIdRoute = modifiedCurrentPage?.clickableIdRoutes?.find((item) => item.path === b.pageUrlPath);

      if (clickableIdRoute?.clickablePath) {
        urlPath = clickableIdRoute?.clickablePath;
      }

      if (clickableIdRoute?.breadCrumbLabel) {
        breadCrumbLabel = clickableIdRoute?.breadCrumbLabel;
      }

      return (
        <StyledBreadCrumbLink
          key={b.pageName}
          to={urlPath}
          isActive={isBreadcrumbClickable(index)}
          color={getLinkColor(b, index)}
        >
          {b.icon && (
            <StyledBreadCrumbIcon>
              <SidebarIcons icon={b.icon} />
            </StyledBreadCrumbIcon>
          )}

          <StyledBreadCrumbLabel>{breadCrumbLabel}</StyledBreadCrumbLabel>
        </StyledBreadCrumbLink>
      );
    });

  const renderLinkBreadcrumbs = () => (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
      {getLinkBreadcrumbs()}
    </Breadcrumbs>
  );

  const renderBreadcrumb = () => {
    if (ROUTES_WITH_MODIFIED_BREADCRUMB_LABEL.includes(currentRoute?.pageUrlPath)) {
      if (
        (currentRoute?.pageUrlPath === modifiedCurrentPage?.pageUrlPath && modifiedCurrentPage.breadCrumbLabel) ||
        modifiedCurrentPage.disableBreadCrumbLoading
      ) {
        return renderLinkBreadcrumbs();
      }

      return <Skeleton variant="rounded" width={400} height={24} />;
    }
    return renderLinkBreadcrumbs();
  };

  const renderPageTitleText = (text = '') => (
    <>
      <CustomHelmet dynamicText={text} />
      <StyledTooltip arrow placement="bottom-end" title={text} p="10px 15px">
        <StyledText weight={700} size={19} lh={28} maxLines={1}>
          {text}
        </StyledText>
      </StyledTooltip>
    </>
  );

  const renderPageTitle = () => {
    if (ROUTES_WITH_MODIFIED_PAGE_TITLE.includes(currentRoute?.pageUrlPath)) {
      if (currentRoute?.pageUrlPath === modifiedCurrentPage?.pageUrlPath && modifiedCurrentPage.pageName) {
        return renderPageTitleText(modifiedCurrentPage.pageName);
      }

      return <Skeleton variant="rounded" width={350} height={28} />;
    }

    return renderPageTitleText(pageName);
  };

  return (
    <>
      <StyledHeader>
        <StyledFlex gap="2px" justifyContent="space-between">
          <StyledFlex alignItems="center" width="fit-content">
            {renderPageTitle()}
          </StyledFlex>
          <StyledFlex alignItems="center" flexDirection="row" margin="0" lineHeight="28px" ref={breadCrumbRootRef}>
            {renderBreadcrumb()}
          </StyledFlex>
        </StyledFlex>

        <StyledHeaderRight>
          <NavbarButton
            Icon={AddFeatureIcon}
            onClick={() => {
              onFeedback();
              setFeedbackStateRef(feedbackRef.current);
            }}
            isVisible
            feedbackRef={feedbackRef}
            name="Submit Feedback"
          />

          <NavbarButton Icon={ChatIcon} onClick={toggleChatModal} unread={hasUnreadChat} isVisible name="Chat" />

          <HelpResourceFab
            currentProduct={breadcrumbs}
            onFeedback={(data) => onFeedback(data)}
            onSubmitFeedback={onSubmitFeedback}
            feedback={feedback}
            feedbackRef={feedbackStateRef}
            isSubmitFeedbackLoading={isSubmitFeedbackLoading}
          />

          <button ref={profileMenuRef} className={classes.profileMenuButton} onClick={handleshowProfileMenu}>
            <div className={classes.profile}>
              <UserAvatar imgSrc={profileImg} className={classes.avatar} />
              <KeyboardArrowDown className={classes.trendDown} />
            </div>
          </button>
          <Popover
            open={openProfileMenu}
            onClose={handleCloseProfileMenu}
            anchorEl={anchorEl}
            sx={{
              top: 20,
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <StyledFlex className={classes.popOverWrapper}>
              <span className={classes.arrow} />
              <span className={classes.arrow_shadow} />
              <div className={classes.profileMenuTop}>
                <UserAvatar imgSrc={profileImg} className={classes.menuAvatar} />
                <div className={classes.profileMenuTopText}>
                  <p className={classes.menuUserName}>
                    {currentUser?.firstName} {currentUser?.lastName}
                  </p>
                  <p className={classes.menuSimplyAskTitle}>{currentUser?.organizationName}</p>
                </div>
              </div>
              <button className={classes.profileMenuMiddle} onClick={handleManageProfile}>
                <img src={profileIcon} className={classes.menuProfileImage} />
                <span className={classes.profileMenuMiddleText}>Manage My Profile</span>
              </button>
              <hr className={classes.menuMiddleBottomLine} />
              <button className={classes.profileMenuBottom} onClick={logout}>
                <img src={LogoutIcon} className={classes.menuProfileImage} />
                <span className={classes.profileMenuBottomText}>Log Out</span>
              </button>
            </StyledFlex>
          </Popover>
          <SidedrawerModal
            show={showNotifModalView}
            closeModal={() => setShowNotifModalView(false)}
            width="40vw"
            hasCloseButton={false}
            padding="0"
          >
            <NotificationsModalView closeModal={() => setShowNotifModalView(false)} />
          </SidedrawerModal>
          {/* Chat modal */}
          <SidedrawerModal
            show={showChatModalView}
            closeModal={() => setShowChatModalView(false)}
            width="720px"
            hasCloseButton={false}
            padding="0"
            hasShrinkButton
          >
            <ChatModalView
              closeModal={() => setShowChatModalView(false)}
              openAttachModal={() => setShowFileModal(true)}
            />
          </SidedrawerModal>
          {/* Notifications modal */}
          <SidedrawerModal
            show={showNotifModalView}
            closeModal={() => setShowNotifModalView(false)}
            width="40vw"
            hasCloseButton={false}
            padding="0"
          >
            <NotificationsModalView closeModal={() => setShowNotifModalView(false)} />
          </SidedrawerModal>
          {/* File upload modal for chat shortview */}
          <Modal show={showFileModal} modalClosed={() => setShowFileModal(false)} className={classes.fileModal}>
            <ChatFileModalView closeModal={() => setShowFileModal(false)} />
          </Modal>
        </StyledHeaderRight>
      </StyledHeader>
    </>
  );
};

export default Topbar;

Topbar.propTypes = {};
