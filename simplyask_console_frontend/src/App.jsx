import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FlagsProvider } from 'react-feature-flags';
import { hotjar } from 'react-hotjar';
import { Navigate, Route, Routes, matchPath, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useRecoilState, useSetRecoilState } from 'recoil';

import AppLayout from './Components/AppLayout/AppLayout';
import DemoChat from './Components/DemoChat/DemoChat';
import ProtectedRoutes from './Components/ProtectedRoute/ProtectedRoutes';
import { Fallback } from './Components/TechPages/Fallback';
import { NotFound } from './Components/TechPages/NotFound';
import ScbDFC from './Components/TelusWebForm/ScbDFC';
import ScbMobility from './Components/TelusWebForm/ScbMobility';
import Unauthorized from './Components/Unauthorized/Unauthorized';
import Spinner from './Components/shared/Spinner/Spinner';
import { getGlobalPermissionsFeatures, getPages } from './Services/axios/permissions';
import { getIsAccountLocked } from './Services/axios/userAxios';
import { getWorkflowProcessTypes } from './Services/axios/workflowEditor';
import { getRoutesWithExactMatch, mapPermissionsWithPages } from './config/appRoutes';
import hotjarConfig from './config/hotjarConfig';
import { validateReadPermissionBasedOnRole } from './config/roles';
import routes from './config/routes';
import { ConversationProvider } from './contexts/ConversationContext';
import DataProvider from './contexts/DataProvider';
import { NotificationProvider } from './contexts/NotificationContext';
import { SideDrawerProvider } from './contexts/SideDrawerContext';
import { useUser } from './contexts/UserContext';
import { useGetIssuesCategoriesConfig } from './hooks/issue/useCategoriesConfig';
import { featureFlags, globalState, issuesCategories, organizationProcessTypes } from './store';
import { checkPageFeatureFlags, getIsManagerRoutesActivated, getMappedFeatureFlags } from './utils/helperFunctions';

const ForgotPassword = React.lazy(() => import('./Components/Auth/ForgotPassword/ForgotPassword'));
const Auth = React.lazy(() => import('./Components/Auth/Auth'));
const PublicFormPage = React.lazy(() => import('./Components/PublicFormPage/PublicFormPage'));
const CreateNewAccount = React.lazy(() => import('./Components/Auth/CreateNewAccount/CreateNewAccount'));

const App = () => {
  const isTelusEnvActivated = import.meta.env.VITE_IS_TELUS_ENV_ACTIVATED;
  const TRUE_KEY = 'true';

  const { user, loadingUser } = useUser();
  const location = useLocation();
  const scrollToTopRef = useRef();
  const [state, setState] = useRecoilState(globalState);
  const [flags, setFlags] = useRecoilState(featureFlags);
  const setProcessTypes = useSetRecoilState(organizationProcessTypes);
  const setIssuesCategories = useSetRecoilState(issuesCategories);
  const [lockedUserAccountReason, setLockedAccoundReason] = useState();
  const { data: categoriesConfig } = useGetIssuesCategoriesConfig({
    enabled: !!user && !user.isTemp,
  });

  useEffect(() => {
    let script;

    if (!isTelusEnvActivated) {
      script = document.createElement('script');
      script.src = import.meta.env.VITE_CHARGE_BEE_URL;
      script.async = true;

      script.onload = () => {
        console.log('Chargebee script loaded successfully');

        try {
          if (window.Chargebee) {
            window.Chargebee?.init({
              site: import.meta.env.VITE_CHARGE_BEE_SITE,
              publishableKey: import.meta.env.VITE_CHARGE_BEE_PUBLISH_API_KEY, //TODO: later this should be accessed from GCP secret manager or any other secret resource
            });
            console.log('Chargebee initialized successfully');
          } else {
            console.error('Chargebee object not found');
          }
        } catch (error) {
          console.error('Error initializing Chargebee:', error);
        }
      };

      document.body.appendChild(script);
    }

    return () => {
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [isTelusEnvActivated]);

  useEffect(() => {
    const recentlyViewedPages = JSON.parse(localStorage.getItem('recentlyViewedPages')) || [];

    setState({
      ...state,
      recentlyViewedPages,
    });
  }, []);

  useEffect(() => {
    if (state?.pages) {
      const viewedPages =
        state?.recentlyViewedPages.length >= 10
          ? [location.pathname, ...state?.recentlyViewedPages.slice(0, 11)]
          : [location.pathname, ...state?.recentlyViewedPages];

      const recentlyViewedPages = [...new Set(viewedPages)];

      setState({
        ...state,
        recentlyViewedPages,
        currentPageId: state?.pages?.grantedPages?.find((page) => {
          // getRoutesWithExactMatch is required to handle falsePositive cases such as -
          // matchPath returns true during the comparison of following -
          // 1 - "/Sell/OrderManager/ProductOfferings"
          // 2- "/Sell/OrderManager/123234343"
          // 2nd route is for individual Id but matchPath thinks "ProductOfferings" of point 1 as Id and returns true
          // which should not happen as "/dashboard/Sell/OrderManager/ProductOfferings" is not the ID route

          if (getRoutesWithExactMatch()?.includes(location.pathname) && page.pageUrlPath !== location.pathname) {
            return;
          }

          return matchPath(page.pageUrlPath, location.pathname);
        })?.pageId,
      });

      localStorage.setItem('recentlyViewedPages', JSON.stringify(recentlyViewedPages));
    }
  }, [location, state.pages]);

  useEffect(() => {
    if (user && !user.isTemp) {
      getPages().then((result) => {
        setFlags({
          ...flags,
          featureFlags: getMappedFeatureFlags(result?.data?.featureFlags),
        });

        // Temp removal of temp remove :)
        // Temp remove Process Orchestrator as per SC-4171
        // const filterGrantedPages = result?.data?.grantedPages?.filter(
        //   (page) => page.pageUrlPath !== routes.PROCESS_ORCHESTRATION
        // );

        setState({
          ...state,
          // pages: checkPageFeatureFlags({ ...result?.data, grantedPages: filterGrantedPages }),
          pages: checkPageFeatureFlags(result?.data),
        });
      });

      getIsAccountLocked()
        .then((result) => {
          if (result?.data) {
            setLockedAccoundReason(result.data);
          }
        })
        .catch(console.log);

      getWorkflowProcessTypes()
        .then((result) => {
          setProcessTypes(result);
        })
        .catch(console.log);
    } else {
      getGlobalPermissionsFeatures().then((data) => {
        setFlags({
          ...flags,
          featureFlags: getMappedFeatureFlags(data),
        });
      });
    }
  }, [user]);

  useEffect(() => {
    if (categoriesConfig) {
      setIssuesCategories(categoriesConfig);
    }
  }, [categoriesConfig]);

  useEffect(() => {
    // Initialize after all async calls are done -> User must be logged in and not isTemp;
    if (hotjarConfig.enabled && state.pages && !hotjar.initialized()) {
      hotjar.initialize(hotjarConfig.hjid, hotjarConfig.hjsv);
    }
  }, [state.pages]);

  if (loadingUser) {
    return <Spinner global />;
  }

  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <FlagsProvider value={flags.featureFlags}>
        <ToastContainer enableMultiContainer />

        {user && !user.isTemp ? (
          <DataProvider>
            <NotificationProvider>
              <ConversationProvider>
                <SideDrawerProvider>
                  <AppLayout pages={state.pages}>
                    <Suspense fallback={<Spinner global />}>
                      <Routes>
                        {mapPermissionsWithPages(state.pages?.grantedPages).map(
                          ({ pageId, pathName, component, permissionStatus, ...rest }) => {
                            const isManagerRouteActivated = getIsManagerRoutesActivated(location);
                            return (
                              component &&
                              pathName && (
                                <Route
                                  key={pageId}
                                  {...rest}
                                  path={`${pathName}`}
                                  scrollToTopRef={scrollToTopRef}
                                  element={
                                    <ProtectedRoutes
                                      component={component}
                                      alternativeComponent={Unauthorized}
                                      visible
                                      readOnly={validateReadPermissionBasedOnRole(permissionStatus)}
                                      isAccountDisabled={!!lockedUserAccountReason}
                                      isAccountDisabledText={lockedUserAccountReason}
                                      isManagerRouteActivated={isManagerRouteActivated}
                                    />
                                  }
                                />
                              )
                            );
                          }
                        )}
                        <Route path="/forms/:organizationId/:processId" element={<PublicFormPage />} />
                        <Route path="/demo-page" element={<DemoChat />} />
                        <Route path="/" element={<Navigate to={routes.DEFAULT} replace />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </AppLayout>
                </SideDrawerProvider>
              </ConversationProvider>
            </NotificationProvider>
          </DataProvider>
        ) : (
          <Suspense fallback={<Spinner global />}>
            <Routes>
              <Route path="/forms/:organizationId/:processId" element={<PublicFormPage />} />
              {/* just to support old links */}
              <Route path="/dashboard/dfc-scb-requester" replace element={<Navigate to="/scb/dfc" />} />
              <Route path="/dashboard/scb/mobility" element={<Navigate to="/scb/mobility" />} />
              <Route path="/dashboard/scheduledCallbackRequester" element={<Navigate to="/scb/mobility" />} />
              <Route path="/dashboard/scb/dfc" element={<Navigate to="/scb/dfc" />} />

              <Route path="/scb/mobility" element={<ScbMobility />} />
              <Route path="/scb/dfc" element={<ScbDFC />} />
              <Route path={routes.DEFAULT} exact element={<Auth />} />
              <Route path={routes.FORGOT_PASSWORD} element={<ForgotPassword />} />
              {isTelusEnvActivated !== TRUE_KEY && (
                <Route path={routes.REGISTER_USER} exact element={<CreateNewAccount />} />
              )}
              <Route path="/" element={<Navigate to={routes.DEFAULT} replace />} />
              <Route exact path={routes.REGISTER} element={<CreateNewAccount />} />
              <Route path="*" element={<Auth />} />
            </Routes>
          </Suspense>
        )}
      </FlagsProvider>
    </ErrorBoundary>
  );
};

export default App;
