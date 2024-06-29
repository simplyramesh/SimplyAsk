import { useTheme } from '@emotion/react';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { useGetExecutionHeaders } from '../../../../hooks/process/useProcessDefinitionExecutionHeaders';
import DefineExecutionSideBar from '../../../ProcessTrigger/shared/ProcessExecutionDetails/DefineExecutionSideBar/DefineExecutionSideBar';
import { createDynamicValidationSchema } from '../../../ProcessTrigger/utils/formatters';
import InputLabel from '../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CustomIndicatorArrow from '../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledDivider, StyledText, StyledFlex } from '../../../shared/styles/styled';
import { useGenerateProcessDataVisualizer } from '../../hooks/useGenerateProcessDataVisualizer';
import { QUERY_KEYS } from '../../utils/constants';

const ProcessDataDefineExecutionsSideModal = ({
  showDefineExecutionsSideModal,
  setShowDefineExecutionsSideModal,
  allProcessesOptions,
  isProcessesLoading,
}) => {
  const queryClient = useQueryClient();

  const { colors } = useTheme();

  const [selectExecutionProcess, setSelectExecutionProcess] = useState();

  const { generateProcessVisualization, isGenerateProcessVisualizationLoading } = useGenerateProcessDataVisualizer({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PROCESS_EXECUTIONS_FOR_VISUALIZER] });
      setShowDefineExecutionsSideModal(false);
      resetForm();
      setSelectExecutionProcess();
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const { dataHeaderColumns, isDataHeaderFetching } = useGetExecutionHeaders({
    pathVariable: selectExecutionProcess?.deploymentId,
    options: {
      enabled: selectExecutionProcess?.deploymentId?.length > 0,
      select: (res) => res.data,
    },
  });

  const sideBarInitialValues = () => {
    const initialValues = {};
    dataHeaderColumns?.forEach((item) => {
      initialValues[item.fieldName] = '';
    });

    return initialValues;
  };

  const { values, errors, setFieldValue, submitForm, resetForm, touched, handleBlur } = useFormik({
    validateOnMount: false,
    enableReinitialize: true,
    initialValues: sideBarInitialValues(),
    validationSchema: createDynamicValidationSchema(sideBarInitialValues, dataHeaderColumns),
    onSubmit: (val) => {
      const payload = {
        processId: selectExecutionProcess.value,
        processDeploymentId: selectExecutionProcess.deploymentId,
        processInputParams: Object.keys(val)?.map((key) => {
          // TODO: Remove Cost Center custom null value when BE is ready
          if (key === 'Cost Center' && !val[key]?.length > 0) return { [key]: 'null' };
          return { [key]: val[key] };
        }),
      };

      generateProcessVisualization(payload);
    },
  });

  const onCloseDefineExecution = () => {
    if (isGenerateProcessVisualizationLoading) return;
    resetForm();
    setShowDefineExecutionsSideModal(false);
  };

  const renderStaticFields = () => (
    <StyledFlex gap="12px">
      <InputLabel label="Select Process" size={16} mb={0} />

      <StyledFlex width="85%">
        <CustomSelect
          placeholder="Select a Process..."
          options={allProcessesOptions}
          value={selectExecutionProcess}
          closeMenuOnSelect
          closeMenuOnScroll
          onChange={setSelectExecutionProcess}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
          }}
          maxHeight={39}
          menuPadding={0}
          form
          menuPlacement="auto"
          withSeparator
          isSearchable
          menuPortalTarget={document.body}
        />
      </StyledFlex>

      <StyledText size={15}>
        Note that the selected Process must output a Process Parameter with name “Data” with type “File” in CSV / Excel
        format. If not, the visualization generation will fail.
      </StyledText>
      <StyledDivider borderWidth={2} color={colors.geyser} flexItem />
    </StyledFlex>
  );

  return (
    <DefineExecutionSideBar
      openDefineExecution={showDefineExecutionsSideModal}
      onCloseDefineExecution={onCloseDefineExecution}
      errors={errors}
      handleBlur={handleBlur}
      touched={touched}
      submitDefineExecutionUploadProcess={() => {
        submitForm();
      }}
      searchableColumns={dataHeaderColumns}
      dataHeaderColumns={dataHeaderColumns}
      defineExecutionSideBarValues={values}
      defineExecutionSideBarSetFieldValues={setFieldValue}
      renderStaticFields={renderStaticFields}
      isProcessDataVisualizerView
      isLoadingFields={isDataHeaderFetching}
      isLoading={isGenerateProcessVisualizationLoading || isProcessesLoading}
    />
  );
};

export default ProcessDataDefineExecutionsSideModal;
