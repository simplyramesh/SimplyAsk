import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import UndoIcon from '@mui/icons-material/Undo';
import PropTypes from 'prop-types';

import { forwardRef, memo } from 'react';

import AddIcon from '../../../../Assets/icons/addIcon.svg?component';
import AddPermGroupIcon from '../../../../Assets/icons/addPermGroupIcon.svg?component';
import ArchiveIcon from '../../../../Assets/icons/archive.svg?component';
import SortDescIcon from '../../../../Assets/icons/arrowDropDown.svg?component';
import SortAscIcon from '../../../../Assets/icons/arrowDropUp.svg?component';
import SortIcon from '../../../../Assets/icons/arrowUpDown.svg?component';
import BangCircleIcon from '../../../../Assets/icons/bangCircle.svg?component';
import WarningTriangleIcon from '../../../../Assets/icons/bangTriangle.svg?component';
import BinIcon from '../../../../Assets/icons/bin.svg?component';
import BOAIcon from '../../../../Assets/icons/boaSideBar.svg?component';
import BuildingIcon from '../../../../Assets/icons/buildingIcon.svg?component';
import CalendarIcon from '../../../../Assets/icons/calendarPlus.svg?component';
import EditOutlinedPencilIcon from '../../../../Assets/icons/cellEditIcon.svg?component';
import CheckMarkIcon from '../../../../Assets/icons/checkMark.svg?component';
import CloseIcon from '../../../../Assets/icons/closeIcon.svg?component';
import CustomAccessIcon from '../../../../Assets/icons/customAccessIcon.svg?component';
import DiceIcon from '../../../../Assets/icons/dice.svg?component';
import EditIcon from '../../../../Assets/icons/editAlt.svg?component';
import EmptyIcon from '../../../../Assets/icons/emptyTable.svg?component';
import ErrorCircleIcon from '../../../../Assets/icons/errorCircle.svg?component';
import SeePasswordIcon from '../../../../Assets/icons/eyeIcon.svg?component';
import MaskPasswordIcon from '../../../../Assets/icons/eyeOffIcon.svg?component';
import FilterIcon from '../../../../Assets/icons/filterIcon.svg?component';
import FlowBackOfficeIcon from '../../../../Assets/icons/flowBackOfficeSideBar.svg?component';
import InfoIcon from '../../../../Assets/icons/infoIcon.svg?component';
import KeyIcon from '../../../../Assets/icons/keyIcon.svg?component';
import LockedIcon from '../../../../Assets/icons/locked.svg?component';
import MigrateBackOfficeIcon from '../../../../Assets/icons/migrateBackOfficeSideBar.svg?component';
import PermGroupsIcon from '../../../../Assets/icons/permGroupsIcon.svg?component';
import PermissionGroup from '../../../../Assets/icons/permissionGroup.svg?component';
import PermUsersIcon from '../../../../Assets/icons/permUsersIcon.svg?component';
import SettingsIcon from '../../../../Assets/icons/processManagerSettingsIcon.svg?component';
import QuestionMarkCircleIcon from '../../../../Assets/icons/questionMarkCircle.svg?component';
import RegenerateIcon from '../../../../Assets/icons/regenerate.svg?component';
import RenameIcon from '../../../../Assets/icons/rename.svg?component';
import SearchIcon from '../../../../Assets/icons/searchIcon.svg?component';
import SellBackOfficeIcon from '../../../../Assets/icons/sellBackOfficeIcon.svg?component';
import ServeFrontOfficeIcon from '../../../../Assets/icons/serveFrontOfficeSideBar.svg?component';
import SettingsGeneralIcon from '../../../../Assets/icons/settingsGeneralSideBar.svg?component';
import MoreHorizontalIcon from '../../../../Assets/icons/threeDotsHorizontal.svg?component';
import TooltipIcon from '../../../../Assets/icons/tooltipTriangle.svg?component';
import RemoveIcon from '../../../../Assets/icons/trashIcon.svg?component';
import UnlockedIcon from '../../../../Assets/icons/unlocked.svg?component';

import { StyledSpanIcon } from './StyledCustomTableIcons';
import FormReceivedIcon from './svgIcons/FormReceivedIcon';
import UndrawShareLinkIcon from './svgIcons/UndrawShareLinkIcon';

const CUSTOM_TABLE_ICONS = {
  ASSIGNMENT_TURNED: AssignmentTurnedInOutlinedIcon,
  ACTIVATED: UnlockedIcon,
  ADD: AddIcon,
  ADD_PERM_GROUP: AddPermGroupIcon,
  ARROW_LEFT: KeyboardArrowLeftIcon,
  ARROW_RIGHT: KeyboardArrowRightIcon,
  ARCHIVE: ArchiveIcon,
  BANG_CIRCLE: BangCircleIcon,
  BIN: BinIcon,
  BOA: BOAIcon,
  BUILDING: BuildingIcon,
  CALENDAR: CalendarIcon,
  CALENDAR_CREATED: CalendarTodayIcon,
  CAMERA: CameraAltOutlinedIcon,
  CHECK: CheckMarkIcon,
  CHECK_CIRCLE: CheckCircleOutlineRoundedIcon,
  CLOCK: AccessTimeIcon,
  CLOSE: CloseIcon,
  CUSTOM_ACCESS: CustomAccessIcon,
  DEACTIVATED: LockedIcon,
  DROPDOWN: SortDescIcon,
  EDIT: EditIcon,
  EDIT_OUTLINED_PENCIL: EditOutlinedPencilIcon,
  EDIT_PENCIL: EditOutlinedIcon,
  EMAIL: EmailOutlinedIcon,
  EMPTY: EmptyIcon,
  ERROR: WarningTriangleIcon,
  ERROR_CIRCLE: ErrorCircleIcon,
  FILTER: FilterIcon,
  FLOW: FlowBackOfficeIcon,
  GENERATE_PASSWORD: DiceIcon,
  HELP: HelpOutlineIcon,
  INFO: InfoIcon,
  KEY: KeyIcon,
  LOCATION: LocationOnOutlinedIcon,
  MASK_PASSWORD: MaskPasswordIcon,
  MIGRATE: MigrateBackOfficeIcon,
  SELL: SellBackOfficeIcon,
  MORE_TABLE: MoreHorizontalIcon,
  MORE_VERT: MoreVertIcon,
  OPEN_IN_NEW: OpenInNewIcon,
  PERM_GROUPS: PermGroupsIcon,
  PERM_SUMMARY: ListAltRoundedIcon,
  PERM_USERS: PermUsersIcon,
  PERMISSION_GROUP: PermissionGroup,
  PHONE: PhoneOutlinedIcon,
  REPLAY: ReplayIcon,
  QUESTION: QuestionMarkCircleIcon,
  REMOVE: RemoveIcon,
  RENAME: RenameIcon,
  SEARCH: SearchIcon,
  SEE_PASSWORD: SeePasswordIcon,
  SERVE: ServeFrontOfficeIcon,
  SETTINGS: SettingsIcon,
  SETTINGS_2: SettingsGeneralIcon,
  SORT: SortIcon,
  SORT_ASC: SortAscIcon,
  SORT_DESC: SortDescIcon,
  SUCCESS: CheckCircleOutlineIcon,
  TOOLTIP: TooltipIcon,
  UNDO: UndoIcon,
  UNDRAW_SHARE_LINK: UndrawShareLinkIcon,
  FORM_RECEIVED: FormReceivedIcon,
  REGENERATE: RegenerateIcon,
  VISIBLITY: VisibilityOutlined,
  VISIBLITY_OFF: VisibilityOffOutlined,
};

const CustomTableIcons = forwardRef(
  (
    {
      icon,
      display,
      width,
      height,
      color,
      colorHover,
      bgColor,
      bgColorHover,
      radius,
      padding,
      margin,
      turnAround,
      opacity,
      throughEvent,
      ...rest
    },
    ref
  ) => {
    const Icon = CUSTOM_TABLE_ICONS[icon] || CUSTOM_TABLE_ICONS.QUESTION;

    return (
      <StyledSpanIcon
        display={display}
        width={width}
        height={height ?? width}
        color={color}
        colorHover={colorHover}
        bgColor={bgColor}
        bgColorHover={bgColorHover}
        radius={radius}
        padding={padding}
        margin={margin}
        turnAround={turnAround}
        throughEvent={throughEvent}
        opacity={opacity}
        {...rest}
        ref={ref}
      >
        {Icon && <Icon />}
      </StyledSpanIcon>
    );
  }
);

export default memo(CustomTableIcons);

CustomTableIcons.propTypes = {
  icon: PropTypes.oneOf(Object.keys(CUSTOM_TABLE_ICONS)),
  display: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  colorHover: PropTypes.string,
  bgColor: PropTypes.string,
  bgColorHover: PropTypes.string,
  radius: PropTypes.string,
  padding: PropTypes.string,
  margin: PropTypes.string,
  turnAround: PropTypes.bool,
  throughEvent: PropTypes.bool,
};
