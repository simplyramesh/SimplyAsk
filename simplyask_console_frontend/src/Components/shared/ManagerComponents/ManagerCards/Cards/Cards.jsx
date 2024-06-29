import {useTheme} from '@mui/material/styles';
import PropTypes from 'prop-types';
import {
  memo, useEffect, useRef, useState,
} from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import ChatIconGrey from '../../../../../Assets/icons/chatWidgetAgentManagerIconGrey.svg?component';
import ChatIconOrange from '../../../../../Assets/icons/chatWidgetAgentManagerIconOrange.svg?component';
import PhoneNumberIconGrey from '../../../../../Assets/icons/phoneNumberManagementIconGrey.svg?component';
import PhoneNumberIconOrange from '../../../../../Assets/icons/phoneNumberManagementIconOrange.svg?component';
import ProcessManagerArchiveIcon from '../../../../../Assets/icons/processManagerArchiveIcon.svg';
import ProcessManagerArchiveIconClicked from '../../../../../Assets/icons/processManagerArchiveIconClicked.svg';
import ProcessManagerBlackPolygon from '../../../../../Assets/icons/ProcessManagerBlackPolygon.svg';
import ProcessManagerSettingsIcon from '../../../../../Assets/icons/processManagerSettingsIcon.svg';
import ProcessManagerStarIcon from '../../../../../Assets/icons/processManagerStarIcon.svg';
import ProcessManagerStarIconClicked from '../../../../../Assets/icons/processManagerStarIconClicked.svg';
import { MANAGER_API_KEYS } from '../../../../../config/managerKeys';
import routes from '../../../../../config/routes';
import { useUser } from '../../../../../contexts/UserContext';
import { useGetUserById } from '../../../../../hooks/useUserById';
import { ALL_TABS } from '../../../../../utils/constants';
import { BASE_DATE_FORMAT, getInFormattedUserTimezone } from '../../../../../utils/timeUtil';
import UserAvatar from '../../../../UserAvatar';
import CustomTableIcons from '../../../REDISIGNED/icons/CustomTableIcons';
import CircleArrowIcon from '../../../REDISIGNED/icons/svgIcons/CircleArrowIcon';
import { StyledTooltip } from '../../../REDISIGNED/tooltip/StyledTooltip';
import { StyledFadeInContainer, StyledFlex, StyledText } from '../../../styles/styled';
import { CHANGE_AGENT_MANAGER_MENUS } from '../../SideModals/SettingsSideDrawer/SettingsSideDrawer';

import classes from './Cards.module.css';
import ProcessStatus from './ProcessStatus/ProcessStatus';
import { SupportAgent } from '@mui/icons-material';
import { AgentTypeOptions } from "../../../../Managers/AgentManager/constants/core";

const WIDTH_OF_TAG = 'widthOfTag';
const TAGS_GAP_IN_PX = 20;
const TYPE_OF_ICON = {
  WIDGET: 'widget',
  PHONE_NUMBER: 'phoneNumber',
};

const TestCasesStats = ({ data }) => (
  <div className={classes.testDataStats}>
    {data?.[MANAGER_API_KEYS.TEST_CASE_COUNT] ?? '0'}
    {' '}
    {data?.[MANAGER_API_KEYS.TEST_CASE_COUNT] === 1 ? 'case' : 'cases'}
  </div>
);

const DisplayHoverComponentName = ({
  name,
  maintainFavoriteProcessSpace = false,
  maintainArchiveProcessSpace = false,
  isEditingDisabled = false,
}) => (
  <div className={classes.display_hover_comp_root}>
    <div
      className={`${classes.display_hover_comp}
      ${classes.favorite_text_absolute}
      ${maintainFavoriteProcessSpace && classes.maintainFavoriteProcessSpace}
      ${maintainArchiveProcessSpace && classes.maintainArchiveProcessSpace}
      ${isEditingDisabled && classes.isEditingDisabledHover}`}
    >
      {name}
    </div>
    <img
      className={`${classes.polygon_absolute} 
      ${isEditingDisabled && classes.isEditingDisabledHoverPolygon}`}
      src={ProcessManagerBlackPolygon}
      alt=""
    />
  </div>
);

DisplayHoverComponentName.propTypes = {
  name: PropTypes.string,
  maintainFavoriteProcessSpace: PropTypes.bool,
  maintainArchiveProcessSpace: PropTypes.bool,
  isEditingDisabled: PropTypes.bool,
};

const CardsSettings = ({
  setClickedProcess,
  setShowSettingsSideDrawer,
  setShowMoveElementToArchive,
  data,
  isTestManagerView,
  isProcessManagerView,
  isAgentManagerView,
  runUpdateElementApi,
  currentView,
  goBackToPrimaryMenu = () => { },
  setIsCardButtonClicked = () => { },
  isCardButtonClicked,
}) => {
  const [isProcessFavorite, setIsProcessFavorite] = useState(false);
  const [isProcessArchive, setIsProcessArchive] = useState(false);

  useEffect(() => {
    if (data) {
      if (data[MANAGER_API_KEYS.IS_FAVORITE]) {
        setIsProcessFavorite(true);
      } else setIsProcessFavorite(false);

      if (data[MANAGER_API_KEYS.IS_ARCHIVED]) {
        setIsProcessArchive(true);
      } else setIsProcessArchive(false);
    }
  }, [isProcessManagerView, isTestManagerView, isAgentManagerView, data]);

  const handleSettingsClick = () => {
    if (isCardButtonClicked) {
      goBackToPrimaryMenu();
    }
    setIsCardButtonClicked(false);

    setClickedProcess(data);
    setShowSettingsSideDrawer(true);
  };

  const handleArchiveClick = () => {
    setClickedProcess(data);
    setShowMoveElementToArchive(true);
  };

  const handleFavoriteClick = () => {
    setClickedProcess(data);
    const apiData = {
      ...data,
      [MANAGER_API_KEYS.IS_FAVORITE]: !isProcessFavorite,
    };

    const changeOnlyFavoriteLoading = true;
    setTimeout(() => {
      runUpdateElementApi(apiData, changeOnlyFavoriteLoading);
    }, [300]);
  };

  return (
    <div className={classes.configurationRoot}>
      {currentView !== ALL_TABS.ARCHIVED && (
        <div
          className={`${classes.conf_icon_hover}
      ${classes.favorite_icon_hover}`}
          onClick={handleFavoriteClick}
        >
          <DisplayHoverComponentName
            name={isProcessFavorite ? 'Unfavorite' : 'Favorite'}
            maintainFavoriteProcessSpace={isProcessFavorite}
          />
          <img
            src={isProcessFavorite ? ProcessManagerStarIconClicked : ProcessManagerStarIcon}
            alt=""
            className={`${classes.fav_icon} ${classes.start_icon}`}
          />
        </div>
      )}
      <div
        className={`${classes.conf_icon_hover}
      ${classes.archive_icon_hover}`}
        onClick={handleArchiveClick}
      >
        <DisplayHoverComponentName
          name={isProcessArchive ? 'Unarchive' : 'Archive'}
          maintainArchiveProcessSpace={isProcessArchive}
        />
        <img
          src={isProcessArchive ? ProcessManagerArchiveIconClicked : ProcessManagerArchiveIcon}
          alt=""
          className={classes.archive_icon}
        />
      </div>
      <div
        className={`${classes.conf_icon_hover}
      ${classes.settings_icon_hover}`}
        onClick={handleSettingsClick}
      >
        <DisplayHoverComponentName name="Settings" />
        <img src={ProcessManagerSettingsIcon} alt="" className={classes.settings_icon} />
      </div>
    </div>
  );
};

const EditButton = ({
  title = '',
  setTriggerOpenTestCasesSideModal = () => { },
  setShowSettingsSideDrawer = () => { },
  setClickedProcess = () => { },
  redirectFunction = () => { },
  data,
  setIsCardButtonClicked = () => { },
  isEditingDisabled = false,
}) => {
  const handleOnClick = () => {
    if (isEditingDisabled) return;
    redirectFunction();
    setIsCardButtonClicked(true);
    setShowSettingsSideDrawer(true);
    setClickedProcess(data);
    setTriggerOpenTestCasesSideModal(true);
  };

  return (
    <div className={classes.editProcessButtonRoot}>
      <button
        className={`${isEditingDisabled ? classes.isEditingDisabled : classes.editProcessBtn}`}
        onClick={handleOnClick}
      >
        {title}
        {isEditingDisabled && (
          <div
            className={`${classes.conf_icon_hover}
      ${classes.favorite_icon_hover}`}
          >
            <DisplayHoverComponentName
              name="You currently do not have permission from the administrator to view and edit this workflow."
              isEditingDisabled
            />
            <img src={CircleQuestionMark} alt="" />
          </div>
        )}
      </button>
    </div>
  );
};

const TitleAndDescriptionSection = ({ title = '---', description = '---' }) => {
  const { colors } = useTheme();

  return (
    <StyledFadeInContainer>
      <StyledFlex height="59px" justifyContent="flex-end">
        <StyledText size={20} weight={700} maxLines={2}>{title}</StyledText>
      </StyledFlex>

      <StyledFlex height="43px">
        <StyledText size={14} weight={400} color={colors.information} maxLines={2} wordBreak="break-all">{description}</StyledText>
      </StyledFlex>
    </StyledFadeInContainer>
  );
};

const DatesSection = memo(
  ({
    createdDate, updatedAt, processType, createdBy: createdUserId, updatedBy: updatedUserId, isProcessManagerView = false,
  }) => {
    const {
      user: { timezone },
    } = useUser();

    const { colors } = useTheme();
    const { userInfo: createdBy } = useGetUserById(createdUserId, { enabled: !!createdUserId });
    const { userInfo: updatedBy } = useGetUserById(updatedUserId, { enabled: !!updatedUserId });

    const renderDateAndUserName = (timeStamp, userName) => {
      const customUser = { firstName: userName?.firstName, lastName: userName?.lastName };
      const displayName = `${userName?.firstName} ${userName?.lastName?.[0]}.`;

      return (
        <StyledFlex direction="row" alignItems="center" gap="5px">
          <StyledText size={13} weight={400} maxLines={1}>
            {getInFormattedUserTimezone(timeStamp, timezone, BASE_DATE_FORMAT)}
          </StyledText>
          {userName && (
            <>
              {' - '}
              <StyledTooltip title={displayName} arrow placement="top" p="10px 15px" maxWidth="auto">
                <StyledFlex direction="row" gap="6px" alignItems="center" marginLeft="5px">
                  <UserAvatar customUser={customUser} size={18} color={colors.primary} />
                  <StyledText size={13} weight={400} maxLines={1}>
                    {displayName}
                  </StyledText>
                </StyledFlex>
              </StyledTooltip>
            </>
          )}
        </StyledFlex>
      );
    };

    if (isProcessManagerView) {
      return (
        <StyledFlex gap="7px" marginTop="5px" justifyContent="center">
          <DatesSectionItem
            icon={(
              <CircleArrowIcon
                sx={{
                  width: '19px',
                  height: '19px',
                  marginLeft: '-1px',
                  marginRight: '-1px',
                }}
              />
            )}
            headerLabel="Type: "
            subHeadingLabel={processType?.name}
            isProcessManagerView={isProcessManagerView}
          />

          <DatesSectionItem
            icon={<CustomTableIcons icon="CALENDAR_CREATED" width={17} />}
            headerLabel="Created: "
            subHeadingLabel={renderDateAndUserName(createdDate, createdBy)}
            isProcessManagerView={isProcessManagerView}
          />

          <DatesSectionItem
            icon={<CustomTableIcons icon="EDIT_PENCIL" width={17} />}
            headerLabel="Updated: "
            subHeadingLabel={renderDateAndUserName(updatedAt, updatedBy)}
            isProcessManagerView={isProcessManagerView}
          />
        </StyledFlex>
      );
    }

    return (
      <StyledFlex gap="15px" marginTop="5px">
        <DatesSectionItem
          icon={<SupportAgent />}
          headerLabel="Type"
          subHeadingLabel={processType}
        />

        <DatesSectionItem
          icon={<CustomTableIcons icon="CALENDAR_CREATED" width={20} />}
          headerLabel="Created"
          subHeadingLabel={renderDateAndUserName(createdDate, createdBy)}
        />
        <DatesSectionItem
          icon={<CustomTableIcons icon="EDIT_PENCIL" width={20} />}
          headerLabel="Updated"
          subHeadingLabel={renderDateAndUserName(updatedAt, updatedBy)}
        />
      </StyledFlex>
    );
  },
);

const DatesSectionItem = ({
  icon, headerLabel, subHeadingLabel, isProcessManagerView = false,
}) => {
  const { colors } = useTheme();

  if (isProcessManagerView) {
    return (
      <StyledFlex direction="row" alignItems="center">
        <StyledFlex width="100%" alignItems="center" direction="row">
          {icon}

          <StyledText
            as="span"
            alignItems="center"
            direction="row"
            weight={600}
            size={13}
            color={colors.primary}
            ml={10}
            maxLines={1}
          >
            {headerLabel}
          </StyledText>

          <StyledText as="span" alignItems="center" direction="row" weight={400} size={13} maxLines={1} ml={4}>
            {' '}
            {subHeadingLabel}
          </StyledText>
        </StyledFlex>
      </StyledFlex>
    );
  }

  return (
    <StyledFlex alignItems="center" direction="row">
      <StyledFlex gap="9px" alignItems="center" direction="row">
        {icon}
        <StyledFlex gap="4px" alignItems="center">
          <StyledText weight={600} size={12}>
            {headerLabel}:
          </StyledText>
        </StyledFlex>
      </StyledFlex>
      <StyledText size={12} color={colors.information} weight={400} textAlign="center" ml={8}>
        {subHeadingLabel}
      </StyledText>
    </StyledFlex>
  );
};

export const AllTagsSection = ({
  allTags,
  data,
  setShowAllTagsSideDrawer,
  setClickedProcess,
  handleTagOnClickForTags,
}) => {
  const [findOverFlowingIndex, setFindOverFlowingIndex] = useState();
  const [filterOverflowTags, setFilterOverflowTags] = useState([]);
  const [filterUnderFlowTags, setFilterUnderFlowTags] = useState([]);

  const ref = useRef();

  function isOverflown(element) {
    const findElementIndexThatOverflows = [0];
    let isOverflowingIndexFound;

    allTags.forEach((item, index) => {
      if (isOverflowingIndexFound !== undefined) return;

      const getId = document.getElementById(`${WIDTH_OF_TAG}${index}`);

      if (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) {
        const transferWidthToDummyArray = [...findElementIndexThatOverflows];
        const sum = transferWidthToDummyArray?.reduce((previousValue, currentValue) => previousValue + currentValue);

        if (sum + getId?.clientWidth + TAGS_GAP_IN_PX > element.clientWidth) {
          setFindOverFlowingIndex(() => index);
          isOverflowingIndexFound = true;
          return;
        }
      }

      findElementIndexThatOverflows.push(getId?.clientWidth + TAGS_GAP_IN_PX);
    });
  }

  useEffect(() => {
    isOverflown(ref.current);
  }, [allTags, ref]);

  useEffect(() => {
    if (findOverFlowingIndex && allTags?.length > 0) {
      setFilterOverflowTags([...JSON.parse(JSON.stringify(allTags)).splice(findOverFlowingIndex)]);
      setFilterUnderFlowTags([...JSON.parse(JSON.stringify(allTags)).splice(0, findOverFlowingIndex)]);
    } else {
      setFilterUnderFlowTags([...allTags]);
    }
  }, [findOverFlowingIndex, allTags]);

  const handleOverFlownTagsClick = () => {
    setClickedProcess(data);
    setShowAllTagsSideDrawer(true);
  };

  const handleAddTagsFilter = (item) => {
    handleTagOnClickForTags(item);
  };

  return (
    <div className={classes.AllTagsRoot}>
      <div className={classes.tagsHeading}>TAGS</div>
      <div className={classes.selectedTagsRoot} ref={ref}>
        {allTags.length === 0 && <div className={classes.noTags}>No Tags</div>}
        {!filterUnderFlowTags.length > 0
          && allTags?.map((item, index) => (
            <div
              className={classes.selectedTagsRootMap}
              key={index}
              id={`${WIDTH_OF_TAG}${index}`}
              onClick={() => handleAddTagsFilter(item)}
            >
              <div className={classes.tagname}>{typeof item === 'string' ? item : item.name}</div>
            </div>
          ))}

        {filterUnderFlowTags.length > 0
          && filterUnderFlowTags?.map((item, index) => (
            <div className={classes.selectedTagsRootMap} key={index}>
              <div className={classes.tagname} onClick={() => handleAddTagsFilter(item)}>
                {typeof item === 'string' ? item : item.name}
              </div>
            </div>
          ))}

        {filterOverflowTags?.length > 0 && (
          <div className={`${classes.selectedTagsRootMap}`} onClick={handleOverFlownTagsClick}>
            <div className={classes.tagname}>
              +
              {filterOverflowTags.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Cards = memo(
  ({
    status,
    allTags = [],
    setClickedProcess,
    setShowSettingsSideDrawer,
    setShowAllTagsSideDrawer,
    setShowIsProcessStatusChanged,
    setShowMoveElementToArchive,
    isTestManagerView = false,
    isProcessManagerView = false,
    isAgentManagerView = false,
    data,
    runUpdateElementApi = () => { },
    currentView,
    handleTagOnClickForTags,
    setTriggerOpenTestCasesSideModal,
    goBackToPrimaryMenu,
    triggerOpenTestCasesSideModal,
    setIsCardButtonClicked = () => { },
    isCardButtonClicked,
    setActiveMenu,
    onTabChange,
  }) => {
    const navigate = useNavigate();
    const { colors, boxShadows } = useTheme();
    const [isHoveringOnTitle, setIsHoveringOnTitle] = useState(false);
    const [tooltipState, setTooltipState] = useState({
      widgetTooltip: false,
      phoneNumberTooltip: false,
    });

    const handleMouseEnter = () => {
      setIsHoveringOnTitle(true);
    };

    const handleMouseExit = () => {
      setIsHoveringOnTitle(false);
    };

    const showConfigureChannels = (tab = TYPE_OF_ICON.WIDGET) => {
      if (isCardButtonClicked) {
        goBackToPrimaryMenu();
      }
      setIsCardButtonClicked(false);

      if (tab === TYPE_OF_ICON.PHONE_NUMBER) {
        setClickedProcess(data);
        setShowSettingsSideDrawer(true);
        setTimeout(() => {
          onTabChange(null, 1);
          setActiveMenu(CHANGE_AGENT_MANAGER_MENUS.CONFIGURE_CHANNELS);
        }, 1);
      } else {
        setClickedProcess(data);
        setShowSettingsSideDrawer(true);
        setTimeout(() => {
          onTabChange(null, 0);
          setActiveMenu(CHANGE_AGENT_MANAGER_MENUS.CONFIGURE_CHANNELS);
        }, 1);
      }
    };

    if (isTestManagerView) {
      return (
        <div className={classes.root}>
          <div className={classes.flex_bw}>
            <TestCasesStats data={data} />

            <CardsSettings
              setShowMoveElementToArchive={setShowMoveElementToArchive}
              setClickedProcess={setClickedProcess}
              data={data}
              setShowSettingsSideDrawer={setShowSettingsSideDrawer}
              isTestManagerView={isTestManagerView}
              runUpdateElementApi={runUpdateElementApi}
              currentView={currentView}
              goBackToPrimaryMenu={goBackToPrimaryMenu}
              triggerOpenTestCasesSideModal={triggerOpenTestCasesSideModal}
              setTriggerOpenTestCasesSideModal={setTriggerOpenTestCasesSideModal}
              isCardButtonClicked={isCardButtonClicked}
              setIsCardButtonClicked={setIsCardButtonClicked}
            />
          </div>

          <div className={classes.flex_col_title} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseExit}>
            {isHoveringOnTitle ? (
              <EditButton
                title="View All Test Cases"
                setTriggerOpenTestCasesSideModal={setTriggerOpenTestCasesSideModal}
                setClickedProcess={setClickedProcess}
                data={data}
                setShowSettingsSideDrawer={setShowSettingsSideDrawer}
                setIsCardButtonClicked={setIsCardButtonClicked}
              />
            ) : (
              <TitleAndDescriptionSection title={data?.displayName} description={data.description} />
            )}
          </div>

          <DatesSection createdDate={data.createdAt} updatedAt={data.updatedAt} />

          <AllTagsSection
            allTags={allTags}
            data={data}
            setClickedProcess={setClickedProcess}
            setShowAllTagsSideDrawer={setShowAllTagsSideDrawer}
            handleTagOnClickForTags={handleTagOnClickForTags}
          />
        </div>
      );
    }

    if (isProcessManagerView) {
      return (
        <StyledFlex
          width="376px"
          height="372px"
          boxSizing="border-box"
          bgcolor={colors.white}
          boxShadow={boxShadows.box}
          borderRadius="25px"
        >
          <StyledFlex padding="24px 22px 33px 24px">
            <StyledFlex direction="row" justifyContent="space-between" width="100%">
              <ProcessStatus
                status={status}
                setShowIsProcessStatusChanged={setShowIsProcessStatusChanged}
                setClickedProcess={setClickedProcess}
                data={data}
              />

              <CardsSettings
                setShowMoveElementToArchive={setShowMoveElementToArchive}
                setClickedProcess={setClickedProcess}
                data={data}
                setShowSettingsSideDrawer={setShowSettingsSideDrawer}
                currentView={currentView}
                isProcessManagerView={isProcessManagerView}
                runUpdateElementApi={runUpdateElementApi}
              />
            </StyledFlex>

            <StyledFlex
              mt="14px"
              height="114px"
              onMouseEnter={() => setIsHoveringOnTitle(true)}
              onMouseLeave={() => setIsHoveringOnTitle(false)}
            >
              {isHoveringOnTitle ? (
                <EditButton
                  title="Edit Process"
                  redirectFunction={() =>
                    navigate(generatePath(routes.PROCESS_MANAGER_INFO, { processId: data?.workflowId }))
                  }
                  data={data}
                  isEditingDisabled={data[MANAGER_API_KEYS.IS_EDITING_DISABLED]}
                />
              ) : (
                <TitleAndDescriptionSection title={data?.displayName} description={data?.description} />
              )}
            </StyledFlex>

            <DatesSection
              createdDate={data.createdAt}
              updatedAt={data.updatedAt}
              processType={data.processType}
              isProcessManagerView={isProcessManagerView}
              createdBy={data.createdBy}
              updatedBy={data.updatedBy}
            />

            <AllTagsSection
              allTags={allTags}
              setClickedProcess={setClickedProcess}
              setShowAllTagsSideDrawer={setShowAllTagsSideDrawer}
              data={data}
              handleTagOnClickForTags={handleTagOnClickForTags}
            />
          </StyledFlex>
        </StyledFlex>
      );
    }

    if (isAgentManagerView) {
      return (
        <div className={classes.root}>
          <StyledText display="flex" as="span" justifyContent="space-between">
            <div>
              {!data.associatedWidgets?.length ? (
                <StyledTooltip
                  title={(
                    <StyledText color={colors.white} size={14} textAlign="center" as="span">
                      There are no chat widgets assigned to this agent. Assign widgets by clicking on the Settings icon,
                      and selecting “Configure Channels” or
                      {' '}
                      <StyledText
                        onClick={() => {
                          showConfigureChannels(TYPE_OF_ICON.WIDGET);
                          setTooltipState({ ...tooltipState, widgetTooltip: false });
                        }}
                        color={colors.white}
                        size={14}
                        textAlign="center"
                        textDecoration="underline"
                        cursor="pointer"
                        display="inline"
                      >
                        Click Here
                      </StyledText>
                    </StyledText>
                  )}
                  arrow
                  placement="top"
                  p="10px 15px"
                  maxWidth="auto"
                  open={tooltipState.widgetTooltip}
                  onOpen={() => setTooltipState({ ...tooltipState, widgetTooltip: true })}
                  onClose={() => setTooltipState({ ...tooltipState, widgetTooltip: false })}
                >
                  <ChatIconGrey style={{ marginRight: '15px' }} />
                </StyledTooltip>
              ) : (
                <StyledTooltip
                  title={`${data.associatedWidgets.length} Chat Widgets assigned to this agent`}
                  arrow
                  placement="top"
                  p="10px 15px"
                  maxWidth="auto"
                >
                  <ChatIconOrange style={{ marginRight: '15px' }} />
                </StyledTooltip>
              )}

              {!data.associatedPhoneNumbers?.length ? (
                <StyledTooltip
                  title={(
                    <StyledText color={colors.white} size={14} textAlign="center" as="span">
                      There are currently no phone numbers assigned to this agent. Assign a number by clicking on the
                      Settings icon, and selecting “Configure Channels” or
                      {' '}
                      <StyledText
                        onClick={() => {
                          showConfigureChannels(TYPE_OF_ICON.PHONE_NUMBER);
                          setTooltipState({ ...tooltipState, phoneNumberTooltip: false });
                        }}
                        color={colors.white}
                        size={14}
                        textAlign="center"
                        textDecoration="underline"
                        cursor="pointer"
                        display="inline"
                      >
                        Click Here
                      </StyledText>
                    </StyledText>
                  )}
                  arrow
                  placement="top"
                  p="10px 15px"
                  maxWidth="auto"
                  open={tooltipState.phoneNumberTooltip}
                  onOpen={() => setTooltipState({ ...tooltipState, phoneNumberTooltip: true })}
                  onClose={() => setTooltipState({ ...tooltipState, phoneNumberTooltip: false })}
                >
                  <PhoneNumberIconGrey />
                </StyledTooltip>
              ) : (
                <StyledTooltip
                  title={`${data.associatedPhoneNumbers.length} Phone Numbers assigned to this agent`}
                  arrow
                  placement="top"
                  p="10px 15px"
                  maxWidth="auto"
                >
                  <PhoneNumberIconOrange />
                </StyledTooltip>
              )}
            </div>
            <div className={classes.flex_end}>
              <CardsSettings
                setShowMoveElementToArchive={setShowMoveElementToArchive}
                setClickedProcess={setClickedProcess}
                data={data}
                setShowSettingsSideDrawer={setShowSettingsSideDrawer}
                currentView={currentView}
                isAgentManagerView={isAgentManagerView}
                runUpdateElementApi={runUpdateElementApi}
              />
            </div>
          </StyledText>

          <div
            className={classes.flex_col_title}
            onMouseEnter={() => setIsHoveringOnTitle(true)}
            onMouseLeave={() => setIsHoveringOnTitle(false)}
          >
            {isHoveringOnTitle ? (
              <EditButton
                title="Edit Agent"
                redirectFunction={() => navigate(`${routes.AGENT_MANAGER}/${data.agentId}`)}
                data={data}
              />
            ) : (
              <TitleAndDescriptionSection title={data?.name} description={data?.description} />
            )}
          </div>

          <DatesSection
            createdDate={data?.createdAt}
            updatedAt={data?.updatedAt}
            createdBy={data?.createdBy}
            updatedBy={data?.updatedBy}
            processType={AgentTypeOptions.find(agentTypeOpt => agentTypeOpt.value === data?.edition).label}
          />

          <AllTagsSection
            allTags={allTags}
            setClickedProcess={setClickedProcess}
            setShowAllTagsSideDrawer={setShowAllTagsSideDrawer}
            data={data}
            handleTagOnClickForTags={handleTagOnClickForTags}
          />
        </div>
      );
    }

    return <></>;
  },
);

export default Cards;

Cards.propTypes = {
  status: PropTypes.string,
  allTags: PropTypes.array,
  setClickedProcess: PropTypes.func,
  setShowSettingsSideDrawer: PropTypes.func,
  setShowAllTagsSideDrawer: PropTypes.func,
  setShowIsProcessStatusChanged: PropTypes.func,
  setShowMoveElementToArchive: PropTypes.func,
  isTestManagerView: PropTypes.bool,
  isProcessManagerView: PropTypes.bool,
  isAgentManagerView: PropTypes.bool,
  data: PropTypes.object,
  runUpdateElementApi: PropTypes.func,
  currentView: PropTypes.number,
  handleTagOnClickForTags: PropTypes.func,
  setTriggerOpenTestCasesSideModal: PropTypes.func,
  goBackToPrimaryMenu: PropTypes.func,
  triggerOpenTestCasesSideModal: PropTypes.bool,
  setIsCardButtonClicked: PropTypes.func,
  isCardButtonClicked: PropTypes.bool,
};

AllTagsSection.propTypes = {
  allTags: PropTypes.array,
  setClickedProcess: PropTypes.func,
  data: PropTypes.object,
  handleTagOnClickForTags: PropTypes.func,
  setShowAllTagsSideDrawer: PropTypes.func,
};

DatesSection.propTypes = {
  createdDate: PropTypes.string,
  updatedAt: PropTypes.string,
};

EditButton.propTypes = {
  data: PropTypes.object,
  setClickedProcess: PropTypes.func,
  redirectFunction: PropTypes.func,
  title: PropTypes.string,
  setTriggerOpenTestCasesSideModal: PropTypes.func,
  setShowSettingsSideDrawer: PropTypes.func,
  setIsCardButtonClicked: PropTypes.func,
  isEditingDisabled: PropTypes.bool,
};

TitleAndDescriptionSection.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

TestCasesStats.propTypes = {
  data: PropTypes.object,
};

CardsSettings.propTypes = {
  setClickedProcess: PropTypes.func,
  setShowSettingsSideDrawer: PropTypes.func,
  setShowMoveElementToArchive: PropTypes.func,
  isTestManagerView: PropTypes.bool,
  isProcessManagerView: PropTypes.bool,
  isAgentManagerView: PropTypes.bool,
  data: PropTypes.object,
  runUpdateElementApi: PropTypes.func,
  currentView: PropTypes.number,
  goBackToPrimaryMenu: PropTypes.func,
  isCardButtonClicked: PropTypes.bool,
  setIsCardButtonClicked: PropTypes.func,
};
