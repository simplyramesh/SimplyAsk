import React from 'react';

import { modifyStringENUMS } from '../utils/helperFunctions';

import routes, { modifyTitlesKeysENUM } from './routes';

// Main Components
const Chat = React.lazy(() => import('../Components/Chat/Chat'));
const Files = React.lazy(() => import('../Components/Files/Files'));
const People = React.lazy(() => import('../Components/People/People'));
const Support = React.lazy(() => import('../Components/Support/Support'));
const ServiceTickets = React.lazy(() => import('../Components/Issues/components/ServiceTickets/ServiceTickets'));
const FalloutTickets = React.lazy(() => import('../Components/Issues/components/FalloutTickets/FalloutTickets'));
const Catalog = React.lazy(() => import('../Components/Catalog/Catalog'));
const BoaDashboard = React.lazy(() => import('../Components/BOA_Dashboard/BoaDashboard'));
const ConverseDashboard = React.lazy(() => import('../Components/ConverseDashboard/ConverseDashboard'));
const ProfileContainer = React.lazy(() => import('../Components/Profile/ProfileContainer'));

const AgentManager = React.lazy(() => import('../Components/Managers/AgentManager/AgentManager'));

const MR_Manager = React.lazy(() => import('../Components/Migrate/MR_Manager/MR_Manager'));
const MrHistory = React.lazy(() => import('../Components/Migrate/MrHistory/MrHistory'));
const MappingEditor = React.lazy(() => import('../Components/Migrate/MR_Manager/MappingEditor/MappingEditor'));

const ProcessManager = React.lazy(() => import('../Components/Managers/ProcessManager/ProcessManager'));
const ProcessEditor = React.lazy(() => import('../Components/WorkflowEditor/ProcessEditor'));
const PersonFullView = React.lazy(() => import('../Components/People/PersonFullView/PersonFullView'));
const TicketsFullView = React.lazy(
  () => import('../Components/Issues/components/ServiceTickets/components/TicketsFullView/TicketsFullView')
);
const FalloutTicketsFullView = React.lazy(
  () =>
    import('../Components/Issues/components/FalloutTickets/components/FalloutTicketsFullView/FalloutTicketsFullView')
);

const ConversationHistory = React.lazy(() => import('../Components/ConversationHistory/ConversationHistory'));
const ProcessOrchestration = React.lazy(
  () => import('../Components/Managers/OrchestrationManager/ProcessOrchestratorList/ProcessOrchestratorList')
);
const ProcessOrchestrationEditor = React.lazy(
  () => import('../Components/Managers/OrchestrationManager/ProcessOrchestratorEditor/ProcessOrchestratorEditor')
);
const ProcessOrchestrationDetails = React.lazy(
  () => import('../Components/Managers/OrchestrationManager/ProcessOrchestratorDetails/ProcessOrchestratorDetails')
);
const ProcessOrchestrationHistory = React.lazy(
  () => import('../Components/Managers/OrchestrationManager/ProcessOrchestrationHistory/ProcessOrchestrationHistory')
);
const LiveChat = React.lazy(() => import('../Components/Chat/Chat'));
const AgentEditor = React.lazy(() => import('../Components/Managers/AgentManager/AgentEditorsCombiner'));
const Unauthorized = React.lazy(() => import('../Components/Unauthorized/Unauthorized'));
const Settings = React.lazy(() => import('../Components/Settings/Components/General/GeneralSettings'));
const MySummary = React.lazy(() => import('../Components/MySummary/MySummary'));
const ProcessHistory = React.lazy(() => import('../Components/ProcessHistory/ProcessHistory'));
const ProcessTrigger = React.lazy(() => import('../Components/ProcessTrigger/ProcessTrigger'));
const EventTriggerDetails = React.lazy(
  () => import('../Components/ProcessTrigger/Components/EventTriggers/EventTriggerDetails/EventTriggerDetails')
);
const BulkPreviewFullView = React.lazy(
  () => import('../Components/ProcessHistory/BulkPreviewFullView/BulkPreviewFullView')
);
const ProcessDataVisualizer = React.lazy(
  () => import('../Components/ProcessDataVisualizer/Components/ProcessDataVisualizer')
);

// Catalog Components
const Category = React.lazy(() => import('../Components/Catalog/Category/Category'));
const ImportJob = React.lazy(() => import('../Components/Catalog/ImportJob/ImportJob'));
const ExportJob = React.lazy(() => import('../Components/Catalog/ExportJob/ExportJob'));
const CatalogModule = React.lazy(() => import('../Components/Catalog/CatalogModule/CatalogModule'));
const ProductOffering = React.lazy(() => import('../Components/Catalog/ProductOffering/ProductOffering'));
const CategoryDetails = React.lazy(() => import('../Components/Catalog/Category/CategoryDetails/CategoryDetails'));
const EventsSubscription = React.lazy(() => import('../Components/Catalog/EventsSubscription/EventsSubscription'));
const ImportJobDetails = React.lazy(() => import('../Components/Catalog/ImportJob/ImportJobDetails/ImportJobDetails'));
const ExportJobDetails = React.lazy(() => import('../Components/Catalog/ExportJob/ExportJobDetails/ExportJobDetails'));
const ProductDetails = React.lazy(() => import('../Components/Catalog/ProductOffering/ProductDetails/ProductDetails'));
const ProductOfferingPrice = React.lazy(
  () => import('../Components/Catalog/ProductOfferingPrice/ProductOfferingPrice')
);
const ProductSpecification = React.lazy(
  () => import('../Components/Catalog/ProductSpecification/ProductSpecification')
);
const NotificationListeners = React.lazy(
  () => import('../Components/Catalog/NotificationListeners/NotificationListeners')
);
const CatalogModuleDetails = React.lazy(
  () => import('../Components/Catalog/CatalogModule/CatalogModuleDetails/CatalogModuleDetails')
);
const SubscriptionDetails = React.lazy(
  () => import('../Components/Catalog/EventsSubscription/SubscriptionDetails/SubscriptionDetails')
);
const ProductSpecificationDetails = React.lazy(
  () => import('../Components/Catalog/ProductSpecification/ProductSpecificationDetails/ProductSpecificationDetails')
);
const ProductOfferingPriceDetails = React.lazy(
  () => import('../Components/Catalog/ProductOfferingPrice/ProductOfferingPriceDetails/ProductOfferingPriceDetails')
);
const NotificationListenerDetails = React.lazy(
  () => import('../Components/Catalog/NotificationListeners/NotificationListenerDetails/NotificationListenerDetails')
);

// Settings Components
const GeneralSettings = React.lazy(() => import('../Components/Settings/Components/General/GeneralSettings'));
const CreateKnowledgeBase = React.lazy(
  () =>
    import(
      '../Components/Settings/Components/General/components/SimplyAssistantKnowledgeBases/components/CreateKnowledgeBase'
    )
);
const AccessManagement = React.lazy(() => import('../Components/Settings/AccessManagement/AccessManagement'));
const ProfileTab = React.lazy(() => import('../Components/Settings/AccessManagement/components/ProfileTab/ProfileTab'));
const ChangePassword = React.lazy(
  () => import('../Components/Settings/AccessManagement/components/ChangePassword/ChangePassword')
);
const EditUser = React.lazy(() => import('../Components/Settings/AccessManagement/components/EditUser/EditUser'));
const PermissionGroupsView = React.lazy(
  () => import('../Components/Settings/AccessManagement/views/PermissionGroups/PermissionGroupsView')
);
const PermissionGroupDetails = React.lazy(
  () => import('../Components/Settings/AccessManagement/components/PermissionGroupDetails/PermissionGroupDetails')
);
const UsersSettings = React.lazy(() => import('../Components/Settings/SubRoutes/UsersSettings/UsersSettings'));
const UserGroupTab = React.lazy(
  () => import('../Components/Settings/AccessManagement/components/UserGroupTab/UserGroupTab')
);
const FrontOffice = React.lazy(() => import('../Components/Settings/Components/FrontOffice/FrontOffice'));
const ChatWidgetCreateOrEdit = React.lazy(
  () =>
    import(
      '../Components/Settings/Components/FrontOffice/components/ChatWidget/ChatWidgetCreateOrEdit/ChatWidgetCreateOrEdit'
    )
);

const BackOfficeSettings = React.lazy(
  () => import('../Components/Settings/SubRoutes/BackOfficeSettings/BackOfficeSettings')
);
const ParametersSetPage = React.lazy(
  () => import('../Components/Settings/Components/EnvironmentsAndParameters/components/ParametersSet/ParametersSet')
);

const Billing = React.lazy(() => import('../Components/Settings/SubRoutes/BillingSettings/Billing'));
const Usage = React.lazy(() => import('../Components/Settings/Components/Usage/Usage'));

const CreateServiceTicketType = React.lazy(
  () =>
    import('../Components/Settings/Components/FrontOffice/components/CreateServiceTicketType/CreateServiceTicketType')
);

// Comment Settings components as we are migrating to new Settings

// Test Components
const TestManager = React.lazy(() => import('../Components/Managers/TestManager/TestManager'));
const TestDataFullView = React.lazy(
  () => import('../Components/Managers/TestManager/components/TestDataFullView/TestDataFullView')
);

const TestEditor = React.lazy(() => import('../Components/WorkflowEditor/TestEditor'));
const TestHistory = React.lazy(() => import('../Components/TestComponents/TestHistory/TestHistory'));
const TestDashboard = React.lazy(() => import('../Components/TestComponents/TestDashboard/TestDashboard'));

// Sell Components
const CustomerManager = React.lazy(() => import('../Components/Sell/Customer/CustomerManager'));
const CustomerProfile = React.lazy(() => import('../Components/Sell/Customer/CustomerProfile/CustomerProfile'));
const OrderManager = React.lazy(() => import('../Components/Sell/Orders/OrderManager'));
const OrderDetails = React.lazy(() => import('../Components/Sell/Orders/OrderDetails/OrderDetails'));
const ProductOfferings = React.lazy(() => import('../Components/Sell/Orders/ProductOfferings/ProductOfferings'));
const ProductOfferingsCheckout = React.lazy(
  () => import('../Components/Sell/Orders/ProductOfferings/ProductOfferingsCheckout/ProductOfferingsCheckout')
);
const ProductOfferingsConfirmation = React.lazy(
  () => import('../Components/Sell/Orders/ProductOfferings/ProductOfferingsConfirmation/ProductOfferingsConfirmation')
);

const appRoutes = [
  // MAIN/NAVBAR routes
  {
    pathName: routes.DEFAULT,
    component: MySummary,
  },
  {
    pathName: routes.UNAUTHORIZED,
    component: Unauthorized,
  },
  {
    pathName: routes.CHAT,
    component: Chat,
  },

  {
    pathName: routes.TICKETS,
    component: ServiceTickets,
  },
  {
    pathName: routes.TEST_MANAGER,
    component: TestManager,
  },
  {
    pathName: routes.TEST_CASE_DETAILS,
    component: TestDataFullView,
  },
  {
    pathName: routes.TEST_SUITE_DETAILS,
    component: TestDataFullView,
  },
  {
    pathName: routes.TEST_GROUP_DETAILS,
    component: TestDataFullView,
  },
  {
    pathName: routes.TEST_EDITOR_INFO,
    component: TestEditor,
  },
  {
    pathName: routes.TEST_HISTORY,
    component: TestHistory,
  },
  {
    pathName: routes.FALLOUT_TICKETS,
    component: FalloutTickets,
  },
  {
    pathName: routes.SETTINGS_CREATE_SERIVCE_TICKET_TYPE,
    component: CreateServiceTicketType,
  },
  {
    pathName: routes.SETTINGS_EDIT_SERIVCE_TICKET_TYPE,
    component: CreateServiceTicketType,
  },
  {
    pathName: routes.AGENT_MANAGER,
    component: AgentManager,
  },
  {
    pathName: routes.CONVERSATION_HISTORY,
    component: ConversationHistory,
  },
  {
    pathName: routes.PROCESS_ORCHESTRATION,
    component: ProcessOrchestration,
  },
  {
    pathName: routes.PROCESS_ORCHESTRATION_DETAILS,
    component: ProcessOrchestrationDetails,
  },
  {
    pathName: routes.PROCESS_ORCHESTRATION_EDIT,
    component: ProcessOrchestrationEditor,
  },
  {
    pathName: routes.PROCESS_ORCHESTRATION_HISTORY,
    component: ProcessOrchestrationHistory,
  },
  {
    pathName: routes.CHAT,
    component: LiveChat,
  },
  {
    pathName: routes.BOA_DASHBOARD,
    component: BoaDashboard,
  },
  {
    pathName: routes.CONVERSE_DASHBOARD,
    component: ConverseDashboard,
  },
  {
    pathName: routes.TEST_DASHBOARD,
    component: TestDashboard,
  },
  {
    pathName: routes.YOUR_ANALYTICS,
    component: BoaDashboard,
  },
  {
    pathName: routes.PROCESS_MANAGER,
    component: ProcessManager,
  },
  {
    pathName: routes.PROCESS_MANAGER_INFO,
    component: ProcessEditor,
  },
  {
    pathName: routes.PROCESS_TRIGGER,
    component: ProcessTrigger,
  },
  {
    pathName: routes.EVENT_TRIGGER_DETAILS,
    component: EventTriggerDetails,
  },
  {
    pathName: routes.EVENT_TRIGGER_DETAILS_EDIT,
    component: EventTriggerDetails,
  },
  {
    pathName: routes.PROCESS_DATA_VISUALIZER,
    component: ProcessDataVisualizer,
  },
  {
    pathName: routes.PROCESS_HISTORY,
    component: ProcessHistory,
  },
  {
    pathName: routes.PROCESS_HISTORY_BULK_PREVIEW,
    component: BulkPreviewFullView,
  },
  {
    pathName: routes.PEOPLE,
    component: People,
  },
  {
    pathName: routes.CATALOG,
    component: Catalog,
  },
  {
    pathName: routes.SETTINGS,
    component: Settings,
  },
  {
    pathName: routes.FILES,
    component: Files,
  },
  {
    pathName: routes.SUPPORT,
    component: Support,
  },

  // MAIN routes
  {
    pathName: routes.TICKETS_FULLVIEW,
    component: TicketsFullView,
  },
  {
    pathName: routes.FALLOUT_TICKETS_FULL_VIEW,
    component: FalloutTicketsFullView,
  },
  {
    pathName: routes.AGENT_MANAGER_DIAGRAM,
    component: AgentEditor,
  },
  {
    pathName: routes.PERSON_FULLVIEW,
    component: PersonFullView,
  },
  {
    pathName: routes.PROFILE,
    component: ProfileContainer,
  },
  {
    pathName: routes.PROFILE_CHANGE_PASSWORD,
    component: ChangePassword,
  },
  {
    pathName: routes.PROFILE_EDIT,
    component: EditUser,
  },
  {
    pathName: routes.CATALOG_MODULE_DETAILS,
    component: CatalogModuleDetails,
  },
  {
    pathName: routes.CATALOG_CATEGORY_DETAILS,
    component: CategoryDetails,
  },
  {
    pathName: routes.CATALOG_PRODUCT_OFFERING_PRICE_DETAILS,
    component: ProductOfferingPriceDetails,
  },
  {
    pathName: routes.CATALOG_PRODUCT_SPECIFICATION_DETAILS,
    component: ProductSpecificationDetails,
  },
  {
    pathName: routes.CATALOG_IMPORT_JOB_DETAILS,
    component: ImportJobDetails,
  },
  {
    pathName: routes.CATALOG_EXPORT_JOB_DETAILS,
    component: ExportJobDetails,
  },
  {
    pathName: routes.CATALOG_NOTIFICATION_LISTENER_DETAILS,
    component: NotificationListenerDetails,
  },
  {
    pathName: routes.CATALOG_EVENTS_SUBSCRIPTION_DETAILS,
    component: SubscriptionDetails,
  },
  {
    pathName: routes.CATALOG_PRODUCT_OFFERING_DETAILS,
    component: ProductDetails,
  },

  // CATALOG routes
  {
    pathName: routes.CATALOG_MODULE,
    component: CatalogModule,
  },
  {
    pathName: routes.CATALOG_CATEGORY,
    component: Category,
  },
  {
    pathName: routes.CATALOG_PRODUCT_OFFERING_PRICE,
    component: ProductOfferingPrice,
  },
  {
    pathName: routes.CATALOG_PRODUCT_SPECIFICATION,
    component: ProductSpecification,
  },
  {
    pathName: routes.CATALOG_IMPORT_JOB,
    component: ImportJob,
  },
  {
    pathName: routes.CATALOG_EXPORT_JOB,
    component: ExportJob,
  },
  {
    pathName: routes.CATALOG_NOTIFICATION_LISTENER,
    component: NotificationListeners,
  },
  {
    pathName: routes.CATALOG_EVENTS_SUBSCRIPTION,
    component: EventsSubscription,
  },
  {
    pathName: routes.CATALOG_PRODUCT_OFFERING,
    component: ProductOffering,
  },

  // SETTINGS routes

  {
    pathName: routes.SETTINGS_GENERAL_TAB,
    component: GeneralSettings,
  },
  {
    pathName: routes.SETTINGS_GENERAL_TAB_CREATE_KNOWLEDGE_BASE,
    component: CreateKnowledgeBase,
  },
  {
    pathName: routes.SETTINGS_GENERAL_TAB_EDIT_KNOWLEDGE_BASE,
    component: CreateKnowledgeBase,
  },
  {
    pathName: routes.SETTINGS_ACCESS_MANAGER,
    component: AccessManagement,
  },
  {
    pathName: routes.SETTINGS_ACCESS_MANAGER_USER_DETAILS,
    component: ProfileTab,
  },
  {
    pathName: routes.SETTINGS_ACCESS_MANAGER_USER_CHANGE_PASSWORD,
    component: ChangePassword,
  },
  {
    pathName: routes.SETTINGS_ACCESS_MANAGER_EDIT_USER,
    component: EditUser,
  },
  {
    pathName: routes.SETTINGS_ACCESS_MANAGER_PERMISSION_GROUPS,
    component: PermissionGroupsView,
  },
  {
    pathName: routes.SETTINGS_ACCESS_MANAGER_PERMISSION_GROUP_DETAILS,
    component: PermissionGroupDetails,
  },
  {
    pathName: routes.SETTINGS_USER_GROUPS,
    component: AccessManagement,
  },
  {
    pathName: routes.SETTINGS_USER_GROUPS_SINGLE_ITEM,
    component: UserGroupTab,
  },
  {
    pathName: routes.SETTINGS_USERS_TAB,
    component: UsersSettings,
  },
  {
    pathName: routes.SETTINGS_USER_GROUPS,
    component: AccessManagement,
  },
  {
    pathName: routes.SETTINGS_USER_GROUPS_SINGLE_ITEM,
    component: UserGroupTab,
  },
  {
    pathName: routes.SETTINGS_FRONT_OFFICE_TAB,
    component: FrontOffice,
  },
  {
    pathName: routes.SETTINGS_CREATE_CHAT_WIDGET,
    component: ChatWidgetCreateOrEdit,
  },
  {
    pathName: routes.SETTINGS_EDIT_CHAT_WIDGET,
    component: ChatWidgetCreateOrEdit,
  },
  {
    pathName: routes.SETTINGS_BACK_OFFICE_TAB,
    component: BackOfficeSettings,
  },
  {
    pathName: routes.SETTINGS_CREATE_PARAMETER_SET,
    component: ParametersSetPage,
  },
  {
    pathName: routes.SETTINGS_EDIT_PARAMETER_SET,
    component: ParametersSetPage,
  },
  {
    pathName: routes.SETTINGS_BILLING_TAB,
    component: Billing,
  },
  {
    pathName: routes.SETTINGS_USAGE_TAB,
    component: Usage,
  },
  // MIGRATE
  {
    pathName: routes.MR_MANAGER,
    component: MR_Manager,
  },
  {
    pathName: routes.MR_HISTORY,
    component: MrHistory,
  },
  {
    pathName: routes.MR_MANAGER_MAPPING_EDITOR,
    component: MappingEditor,
  },
  {
    pathName: routes.CUSTOMER_MANAGER,
    component: CustomerManager,
  },
  {
    pathName: routes.CUSTOMER_PROFILE,
    component: CustomerProfile,
  },
  {
    pathName: routes.ORDER_MANAGER,
    component: OrderManager,
  },
  {
    pathName: routes.PRODUCT_ORDER_HISTORY_DETAILS,
    component: OrderDetails,
  },
  {
    pathName: routes.PRODUCT_OFFERINGS,
    component: ProductOfferings,
  },
  {
    pathName: routes.PRODUCT_OFFERINGS_CHECKOUT,
    component: ProductOfferingsCheckout,
  },
  {
    pathName: routes.PRODUCT_OFFERINGS_CONFIRMATION,
    component: ProductOfferingsConfirmation,
  },
];

export default appRoutes;

export const mapIconsWithMenuItems = (links) => {
  const res = links.map((link) => {
    const obj = appRoutes.filter(({ pathName }) => pathName === link.pathName);
    const src = obj.map((o) => o.iconSrc);
    const icon = src.length === 0 ? '' : src[0];
    return Object.assign(link, { iconSrc: icon });
  });
  return res;
};

export const getPermissionsBasedOnRoute = (pages, route) => {
  // pages.find(({ pathName }) => pathName === route).permissions;
  const pagesByRoute = pages.find((page) => page.pathName === route);

  if (pagesByRoute) {
    return pagesByRoute.permissionStatus;
  }
  const childrenPages = pages.filter((page) => page.dropdowns.length !== 0);

  for (let i = 0; i < childrenPages.length; i++) {
    for (let j = 0; j < childrenPages[i].dropdowns.length; j++) {
      if (childrenPages[i].dropdowns[j].pathName === route) {
        return childrenPages[i].dropdowns[j].permissionStatus;
      }
    }
  }
};

export const mapPermissionsWithPages = (pages) => {
  const BOA_DASHBOARD_KEYS = {
    processViewPathName: '/boaDashboard/',
    boaViewPathName: '/boaDashboard',
  };
  const appendAppRoutesToPaths = [];

  appRoutes.forEach((item) => {
    pages?.forEach((page) => {
      if (
        page?.pageUrlPath === item?.pathName ||
        (page?.pageUrlPath?.startsWith(BOA_DASHBOARD_KEYS.processViewPathName) &&
          item?.pathName?.startsWith(BOA_DASHBOARD_KEYS.boaViewPathName))
      ) {
        const pageTitle = page?.pageName;
        if (pageTitle?.includes(modifyTitlesKeysENUM.UNDERSCORE)) {
          page.title = modifyStringENUMS(pageTitle);
        }

        appendAppRoutesToPaths.push({ ...page, ...item });
      }
    });
  });
  return appendAppRoutesToPaths;
};

export const getTitleByRoute = (pages, route) => {
  const foundPage = pages.find(({ pathName }) => pathName === route);

  if (foundPage) {
    return foundPage.title;
  }
  const childrenPages = pages.filter((page) => page.dropdowns.length !== 0);

  for (let i = 0; i < childrenPages.length; i++) {
    for (let j = 0; j < childrenPages[i].dropdowns.length; j++) {
      if (childrenPages[i].dropdowns[j].pathName === route) {
        return childrenPages[i].dropdowns[j].title;
      }
    }
  }
};

export const getNestedTitleByRoute = (pages, route, currentPath) => {
  const getNestedPageName = currentPath.replace(`${route}/`, '');
  const modifiedSubTitlePageName = modifyStringENUMS(getNestedPageName);
  const foundPage = pages.find(({ pathName }) => pathName === route);
  const mainTitle = foundPage?.title;

  if (mainTitle) {
    return { mainTitle, modifiedSubTitlePageName };
  }
};

export const getRoutesWithExactMatch = () => [routes.PRODUCT_OFFERINGS];
