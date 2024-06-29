import { useQuery } from '@tanstack/react-query';
import { MultiDirectedGraph } from 'graphology';
import { isEqual } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import { useNavigationBlock } from '../../shared/REDISIGNED/BlockNavigate/BlockNavigate';

import routes from '../../../config/routes';
import { useUser } from '../../../contexts/UserContext';
import { getUserById } from '../../../Services/axios/permissionsUsers';
import { STEP_INPUT_TYPE_KEYS } from '../components/sideMenu/SideMenu/keyConstants';
import { stepTypesForRender } from '../constants/graph';
import { DIAGRAM_ID, MAX_SCALE, MIN_SCALE, STEP, ZOOM_VALUES } from '../constants/layout';
import { getStringifiedOrParsedGraph, validateNodes } from '../services/layout';
import { workflowEditorConfig, workflowSettingsState, workflowState } from '../store';
import { canSubmit } from '../store/selectors';
import { findDefaultZoomNodeIdForEmbeddedSideModal } from '../utils/helperFunctions';

import { useHistoricalRecoilState } from './useHistoricalRecoilState';

export const useWorkflowEditorHeader = ({ zoomToElement, wheelZoomValue }) => {
  const config = useRecoilValue(workflowEditorConfig);
  const navigate = useNavigate();
  const [zoom, setZoom] = useState();
  const [isModalOpen, setIsModalOpen] = useState({});
  const [published, setPublished] = useState(false);
  const { undo, redo, canUndo, canRedo, set, state, setWithoutHistory } = useHistoricalRecoilState();
  const { id: userId } = useParams();
  const { user: authUser } = useUser();

  const initialRenderRef = useRef(0);

  const canSubmitWorkflow = useRecoilValue(canSubmit);
  const settingsTab = useRecoilValue(workflowSettingsState);
  const workflowData = useRecoilValue(workflowState);

  const [isNavigationBlocked, setIsNavigationBlocked] = useState(false);
  const { navBlocker } = useNavigationBlock(isNavigationBlocked);

  const [initialData, setInitialData] = useState();

  const { workflow } = state;

  const hasCreateServiceTicketNode = workflow.nodes.find(
    (node) => node.attributes.stepType === stepTypesForRender.CREATE_SERVICE_TICKET
  );

  const assigneeIdFromCreateServiceTicketNode = useMemo(() => {
    if (!hasCreateServiceTicketNode) return null;

    const dynamicTextSelector = hasCreateServiceTicketNode.attributes.stepInputParameters.find(
      (param) => param.stepSettingTemplate.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.DYNAMIC_TEXT_SELECTOR
    );

    if (!dynamicTextSelector || !dynamicTextSelector.currentValue) return null;

    return dynamicTextSelector.currentValue.value ? dynamicTextSelector.currentValue.value.id : null;
  }, [hasCreateServiceTicketNode]);

  const getId = assigneeIdFromCreateServiceTicketNode || userId || authUser?.id || null;

  const { data: userData } = useQuery({
    queryKey: ['getUser', getId],
    queryFn: () => getUserById(getId),
    enabled: !!getId,
  });

  const removeCustomModelProperties = (editorData) => {
    if (!editorData) return {};

    const { workflow, settingsTab } = editorData;

    const filteredNodes = workflow.nodes?.map(({ attributes: { hasError, ...restAttributes }, ...restNode }) => ({
      ...restNode,
      attributes: restAttributes,
    }));

    const filterInputParamSets = settingsTab?.inputParamSets?.filter(
      (set) => set.dynamicInputParams?.length || set.staticInputParams?.length
    );

    return {
      settingsTab: { ...settingsTab, inputParamSets: filterInputParamSets },
      workflow: { ...workflow, nodes: filteredNodes },
    };
  };

  const filteredInitialEditorData = useMemo(() => removeCustomModelProperties(initialData), [initialData]);

  const filteredCurrentEditorData = useMemo(
    () => removeCustomModelProperties({ workflow, settingsTab }),
    [workflow, settingsTab]
  );

  useEffect(() => {
    setZoom(config?.paneConfig?.initialScale || 1);
  }, [config?.paneConfig?.initialScale]);

  useEffect(() => {
    if (wheelZoomValue) {
      setZoom(wheelZoomValue);
    }
  }, [wheelZoomValue]);

  useEffect(() => {
    if (workflow && settingsTab) {
      setInitialData({ workflow, settingsTab });
    }

    setIsModalOpen({ restorePrevious: false });
  }, []);

  useEffect(() => {
    const hasDataChanged = !isEqual(filteredInitialEditorData, filteredCurrentEditorData);

    setIsNavigationBlocked(hasDataChanged);
  }, [filteredInitialEditorData, filteredCurrentEditorData]);

  const currentValue =
    ZOOM_VALUES.find((v) => v.value === zoom) ||
    (wheelZoomValue && {
      label: `${Math.round(wheelZoomValue * 100)}%`,
      value: wheelZoomValue,
    });

  const isZoomInDisabled = zoom === MAX_SCALE;

  const isZoomOutDisabled = zoom === MIN_SCALE;

  const isPredefinedValue = () => ZOOM_VALUES.some((v) => v.value === zoom);

  const handleZoomIn = () => {
    if (zoom < MAX_SCALE) {
      const nextZoomValue = isPredefinedValue()
        ? zoom + STEP
        : ZOOM_VALUES.find((v) => !!v.value && v.value > zoom)?.value;
      setZoom(nextZoomValue);

      zoomToElement?.(DIAGRAM_ID, nextZoomValue);
    }
  };

  const handleZoomOut = () => {
    if (zoom > MIN_SCALE) {
      const nextZoomValue = isPredefinedValue()
        ? zoom - STEP
        : ZOOM_VALUES.slice()
            .reverse()
            .find((v) => !!v.value && v.value < zoom)?.value;
      setZoom(nextZoomValue);

      zoomToElement?.(DIAGRAM_ID, nextZoomValue);
    }
  };

  const handleReset = () => {
    setWithoutHistory({
      past: [],
      present: {
        workflow: null,
        editingStep: null,
      },
      future: [],
    });
  };

  const handleZoomFit = () => {
    zoomToElement?.(DIAGRAM_ID);
  };

  const validateUserById = () => userData.isLocked === false;

  const handlePublish = () => {
    const isValidUserById = validateUserById();

    if (isValidUserById) {
      const importedGraph = new MultiDirectedGraph().import(workflow);

      validateNodes(importedGraph, ({ nodeWithErrors }) => {
        if (!nodeWithErrors.length) {
          importedGraph.replaceAttributes(settingsTab);

          const exportedGraph = importedGraph.export();
          const graphWithStringifyValues = getStringifiedOrParsedGraph(exportedGraph, 'stringify');

          setPublished(true);
          setIsNavigationBlocked(false);

          config?.api
            .updateWorkflow(workflowData[config?.entityIdName], graphWithStringifyValues)
            .then(() => {
              toast.success('Published successfully');

              navigate(config.isTestEditor ? routes.TEST_MANAGER : routes.PROCESS_MANAGER);
            })
            .catch((error) => {
              toast.error(error.message);
            });
        } else {
          set({ ...state, workflow: importedGraph.export() });
        }
      });
    } else {
      const toastErrorMsg = !isValidUserById ? 'Assignee is not a valid user' : 'Unable to publish process...';

      toast.error(toastErrorMsg);
    }
  };

  useEffect(() => {
    if (zoom && config && !initialRenderRef.current) {
      const sideModalProcessData = config.isEmbeddedSideModalData;

      if (sideModalProcessData) {
        const id = findDefaultZoomNodeIdForEmbeddedSideModal(sideModalProcessData, workflow);
        zoomToElement?.(id, zoom);
      } else {
        zoomToElement?.(DIAGRAM_ID, zoom);
      }

      initialRenderRef.current++;
    }
  }, [zoom, config]);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    published,
    canSubmitWorkflow,
    currentValue,
    isZoomInDisabled,
    isZoomOutDisabled,
    workflowData,
    isModalOpen,
    setZoom,
    zoom: isPredefinedValue() ? zoom : wheelZoomValue,
    setIsModalOpen,
    settingsTab,
    config,
    handleZoomIn,
    handleZoomOut,
    handlePublish,
    handleReset,
    handleZoomFit,
    navBlocker,
    isNavigationBlocked,
  };
};
