import PropTypes from 'prop-types';

import BOAIcon from '../../../Assets/icons/boaSideBar.svg?component';
import ConverseDashboardIcon from '../../../Assets/icons/converseDashboardSideBar.svg?component';
import ConverseFrontOfficeIcon from '../../../Assets/icons/converseFrontOfficeSideBar.svg?component';
import FileManagerGeneralIcon from '../../../Assets/icons/fileManagerGeneralSideBar.svg?component';
import FlowBackOfficeIcon from '../../../Assets/icons/flowBackOfficeSideBar.svg?component';
import BackIcon from '../../../Assets/icons/leftArrow.svg?component';
import MigrateBackOfficeIcon from '../../../Assets/icons/migrateBackOfficeSideBar.svg?component';
import MySummaryIcon from '../../../Assets/icons/mySummarySideBar.svg?component';
import ResolveBackOfficeIcon from '../../../Assets/icons/resolveBackOfficeSideBar.svg?component';
import SearchIcon from '../../../Assets/icons/searchIcon.svg?component';
import SellBackOfficeIcon from '../../../Assets/icons/sellBackOfficeIcon.svg?component';
import ServeFrontOfficeIcon from '../../../Assets/icons/serveFrontOfficeSideBar.svg?component';
import SettingsGeneralIcon from '../../../Assets/icons/settingsGeneralSideBar.svg?component';
import OpenCloseIcon from '../../../Assets/icons/sideBarOpenClose.svg?component';
import SimplyAskIcon from '../../../Assets/icons/simplyAskLogo.svg?component';
import SupportGeneralIcon from '../../../Assets/icons/supportGeneralSideBar.svg?component';
import SymphonaLogo from '../../../Assets/icons/symphonaLogo.svg?component';
import TestBackOfficeIcon from '../../../Assets/icons/testBackOfficeSideBar.svg?component';
import TestDashboardIcon from '../../../Assets/icons/testDashboardSideBar.svg?component';
import WebPagesGeneralIcon from '../../../Assets/icons/webPagesGeneralSideBar.svg?component';

const SIDE_BAR_ICONS = {
  MY_SUMMARY: MySummaryIcon,
  BOA_DASHBOARD: BOAIcon,
  CONVERSE_DASHBOARD: ConverseDashboardIcon,
  TEST_DASHBOARD: TestDashboardIcon,
  CONVERSE: ConverseFrontOfficeIcon,
  SERVE: ServeFrontOfficeIcon,
  FLOW: FlowBackOfficeIcon,
  RESOLVE: ResolveBackOfficeIcon,
  TEST: TestBackOfficeIcon,
  MIGRATE: MigrateBackOfficeIcon,
  SELL: SellBackOfficeIcon,
  SETTINGS: SettingsGeneralIcon,
  WEB_PAGES: WebPagesGeneralIcon,
  FILE_MANAGER: FileManagerGeneralIcon,
  SUPPORT: SupportGeneralIcon,
  OPEN_CLOSE: OpenCloseIcon,
  SIMPLY_ASK: SimplyAskIcon,
  SYMPHONA: SymphonaLogo,
  SEARCH: SearchIcon,
  BACK: BackIcon,
};

const SidebarIcons = ({ icon, ...restProps }) => {
  const Icon = SIDE_BAR_ICONS[icon] || SIDE_BAR_ICONS.MY_SUMMARY;

  return <>{Icon && <Icon {...restProps} />}</>;
};

export default SidebarIcons;

SidebarIcons.propTypes = {
  icon: PropTypes.string,
};
