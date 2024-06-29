import routes from '../../config/routes';
import { matchPath } from 'react-router-dom';

export const SUMMARY_TABS = {
  OVERVIEW: 0,
  MY_ISSUES: 1,
  MY_ACTIVITY: 2,
};

export const getShortcutInfo = (urlKey, index, pages, id, order) => {
  const [match] = pages?.filter((page) =>
    matchPath(
      {
        path: page.pageUrlPath,
        caseSensitive: true,
        end: true,
      },
      urlKey
    )
  );

  const { pageName, name } = match || {};

  const label = name || pageName;

  const shortcuts = [
    { route: [routes.BOA_DASHBOARD], icon: 'BOA_DASHBOARD', chapter: 'BOA_DASHBOARD' },
    { route: [routes.CONVERSE_DASHBOARD], icon: 'CONVERSE_DASHBOARD', chapter: 'CONVERSE_DASHBOARD' },
    { route: [routes.TEST_DASHBOARD], icon: 'TEST_DASHBOARD', chapter: 'TEST_DASHBOARD' },
    { route: [routes.TEST_MANAGER, routes.TEST_HISTORY], icon: 'TEST', chapter: 'TEST' },
    { route: [routes.AGENT_MANAGER, routes.CONVERSATION_HISTORY, routes.CHAT], icon: 'CONVERSE', chapter: 'CONVERSE' },
    { route: [routes.TICKETS], icon: 'SERVE', chapter: 'SERVE', recentlyView: true },
    {
      route: [
        routes.PROCESS_MANAGER,
        routes.PROCESS_TRIGGER,
        routes.PROCESS_HISTORY,
        routes.PROCESS_DATA_VISUALIZER,
        routes.PROCESS_ORCHESTRATION
      ]
      , icon: 'FLOW', chapter: 'FLOW', recentlyView: true
    },
    { route: [routes.FALLOUT_TICKETS], icon: 'RESOLVE', chapter: 'RESOLVE' },
    { route: [routes.MR_MANAGER, routes.MR_HISTORY], icon: 'MIGRATE', chapter: 'MIGRATE' },
    { route: [routes.ORDER_MANAGER, routes.CUSTOMER_MANAGER], icon: 'SELL', chapter: 'SELL' },
    { route: [routes.SETTINGS], icon: 'SETTINGS', chapter: 'SETTINGS' },
    { route: [routes.FILES], icon: 'FILE_MANAGER', chapter: 'FILE_MANAGER' },
    { route: [routes.SUPPORT], icon: 'SUPPORT', chapter: 'SUPPORT' }
  ];

  const shortcut = shortcuts.find(shortcut => shortcut.route.some(route => urlKey.includes(route)));

  const { icon = 'MY_SUMMARY', recentlyView = false, chapter = 'MY_SUMMARY' } = shortcut || {};

  return {
    id: id || index,
    icon,
    label,
    recentlyView,
    chapter,
    urlKey,
    order
  };
};
