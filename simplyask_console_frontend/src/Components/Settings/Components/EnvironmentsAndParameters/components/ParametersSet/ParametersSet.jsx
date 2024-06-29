import { MoreHoriz } from '@mui/icons-material';
import AddRounded from '@mui/icons-material/AddRounded';
import { useTheme } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import routes from '../../../../../../config/routes';
import { useCreateParametersSet } from '../../../../../../hooks/environments/useCreateParametersSet';
import { useDeleteParameterSet } from '../../../../../../hooks/environments/useDeleteParametersSet';
import { useGetParametersSet } from '../../../../../../hooks/environments/useGetParametersSet';
import { useUpdateParametersSet } from '../../../../../../hooks/environments/useUpdateParametersSet';
import { usePopoverToggle } from '../../../../../../hooks/usePopoverToggle';
import { useNavigationBlock } from '../../../../../shared/REDISIGNED/BlockNavigate/BlockNavigate';
import LeavePageBlockerModal from '../../../../../shared/REDISIGNED/BlockNavigate/LeavePageBlockerModal/LeavePageBlockerModal';
import { delayedBlockerSyncNavigation } from '../../../../../shared/REDISIGNED/BlockNavigate/utils/helpers';
import BaseTextInput from '../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import ContentLayout from '../../../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import TableV2 from '../../../../../shared/REDISIGNED/table-v2/Table-v2';
import { HEADER_ACTIONS_POSITION } from '../../../../../shared/REDISIGNED/table-v2/TableHeader/TableHeader';
import Spinner from '../../../../../shared/Spinner/Spinner';
import { StyledCard, StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import FormErrorMessage from '../../../../AccessManagement/components/FormErrorMessage/FormErrorMessage';
import ParametersDeleteModal from '../../ParametersTable/ParametersDeleteModal';
import { ENVIRONMENT_PARAMETERS_SET_EMPTY_MODEL } from '../../constants/constants';
import {
  ENVIRONMENT_PARAMETERS_COLUMNS_MODEL,
  ENVIRONMENT_SPECIFIC_PARAMETERS_COLUMNS_MODEL,
} from '../../constants/formatters';
import EnvironmentParamsDeleteModal from '../../modals/EnvironmentParamsDeleteModal';
import EnvironmentSelectModal from '../../modals/EnvironmentSelectModal';
import ParametersSetActionsMenu from '../../modals/ParametersSetActionsMenu';
import { getParametersTypeOptions } from '../../utils/helpers';
import OverridableParameters from '../OverridableParameters/OverridableParameters';

const ParametersSet = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditState = !!id;

  const goToSettingsPage = () => navigate(routes.SETTINGS_BACK_OFFICE_TAB);

  const { data, isFetching } = useGetParametersSet({
    payload: {
      filter: `searchText=${id}`,
    },
    options: {
      enabled: isEditState,
      select: (data) => {
        return data.content[0] || null;
      },
    },
  });

  const { deleteParameterSet } = useDeleteParameterSet({
    onSuccess: goToSettingsPage,
  });

  const [openDeleteParametersSetModal, setOpenDeleteParametersSetModal] = useState(false);
  const [openSelectEnvironmentModal, setOpenSelectEnvironmentModal] = useState(false);
  const [openDeleteEnvironmentModal, setOpenDeleteEnvironmentModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    defaultParameters: [ENVIRONMENT_PARAMETERS_SET_EMPTY_MODEL],
    envSpecificParameters: [],
  });

  const { colors, boxShadows } = useTheme();
  const {
    anchorEl: paramsSetMenuAnchorEl,
    handleClose: onCloseParamsSetMenu,
    handleClick: onOpenParamsSetMenu,
  } = usePopoverToggle('parameter-set-actions-menu-control');

  const { createParameterSet, isCreateParameterSetLoading } = useCreateParametersSet({
    onSuccess: () => {
      toast.success('New Parameters Set successfully created!');
      resetForm();

      delayedBlockerSyncNavigation(() => goToSettingsPage());
    },
    onError: () => {
      toast.error('Error has occured during Parameters Set creation');
    },
  });

  const { updateParametersSet, isUpdateParameterSetLoading } = useUpdateParametersSet({
    onSuccess: () => {
      toast.success('Parameters Set successfully updated!');
      resetForm();

      delayedBlockerSyncNavigation(() => goToSettingsPage());
    },
    onError: () => {
      toast.error('Error has occured during Parameters Set update');
    },
  });

  const convertParamsArrayToMap = (paramArray) => {
    if (!paramArray) {
      return {};
    }

    return paramArray.reduce((acc, curr) => {
      const { envName, overwrittenValues } = curr;

      return { ...acc, [envName]: overwrittenValues };
    }, {});
  };

  const convertParamMapToArray = (paramMap) => {
    if (!paramMap) {
      return [];
    }

    return Object.entries(paramMap).map(([key, value]) => ({ envName: key, overwrittenValues: value || [] }));
  };

  const { values, setFieldValue, errors, touched, dirty, handleBlur, handleSubmit, resetForm } = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Name is required'),
      description: Yup.string().nullable(),
      defaultParameters: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required('Name is required'),
        })
      ),
    }),
    onSubmit: (values) => {
      const payload = {
        ...values,
        envSpecificParameters: convertParamsArrayToMap(values.envSpecificParameters),
      };

      isEditState ? updateParametersSet({ id, payload }) : createParameterSet(payload);
    },
  });

  useEffect(() => {
    if (data) {
      setInitialValues({
        name: data.name,
        description: data.description,
        defaultParameters: data.defaultParameters?.length
          ? data.defaultParameters
          : [ENVIRONMENT_PARAMETERS_SET_EMPTY_MODEL],
        envSpecificParameters: convertParamMapToArray(data.envSpecificParameters),
      });
    }
  }, [data]);

  const { navBlocker } = useNavigationBlock(dirty);

  const setDefaultParameters = (value) => setFieldValue('defaultParameters', value);

  const setEnvSpecificParameters = (value) => setFieldValue('envSpecificParameters', value);

  const onParamChange = (row, field, value) => {
    setDefaultParameters(
      values.defaultParameters.map((param, index) => (index === row.index ? { ...param, [field]: value } : param))
    );
  };

  const onParamDelete = (row) => {
    setDefaultParameters(values.defaultParameters.filter((_, index) => index !== row.index));
  };

  const addDefaultParameter = () =>
    setDefaultParameters([ENVIRONMENT_PARAMETERS_SET_EMPTY_MODEL, ...values.defaultParameters]);

  const onEnvironmentSelect = (envName) => {
    setEnvSpecificParameters([{ envName, overwrittenValues: [] }, ...values.envSpecificParameters]);
    setOpenSelectEnvironmentModal(false);
  };

  const handleCancelClick = () => {
    goToSettingsPage();
  };

  const onDeleteParametersSet = () => {
    deleteParameterSet(data.id);
  };

  const onEnvironmentDeleteClick = (row) => {
    setRowToDelete(row);
    setOpenDeleteEnvironmentModal(true);
  };

  const closeEnvironmentDeleteModal = () => {
    setOpenDeleteEnvironmentModal(false);
    setRowToDelete(null);
  };

  const onEnvironmentDelete = () => {
    setEnvSpecificParameters(values.envSpecificParameters.filter((_, index) => index !== rowToDelete.index));
    closeEnvironmentDeleteModal();
  };

  const getSelectedEnvironmentsNames = () => values.envSpecificParameters.map((env) => env.envName);

  const onOverridableParamChange = (envName, params) => {
    if (values.envSpecificParameters.some((env) => env.envName === envName)) {
      setEnvSpecificParameters(
        values.envSpecificParameters.map((env) => {
          if (env.envName === envName) {
            return {
              ...env,
              overwrittenValues: params,
            };
          }

          return env;
        })
      );
    } else {
      setEnvSpecificParameters([{ envName, overwrittenValues: params }, ...values.envSpecificParameters]);
    }
  };

  const ParametersHeaderActions = () => (
    <StyledButton variant="contained" tertiary startIcon={<AddRounded />} onClick={addDefaultParameter}>
      Add Parameter
    </StyledButton>
  );

  const EnvironmentHeaderTitle = () => (
    <>
      Environment-Specific Parameters
      <StyledText size={18} weight={600} color={colors.information} display="inline-block">
        &nbsp;(Optional)
      </StyledText>
    </>
  );

  const EnvironmentsHeaderActions = () => (
    <StyledButton
      variant="contained"
      tertiary
      startIcon={<AddRounded />}
      onClick={() => setOpenSelectEnvironmentModal(true)}
    >
      Add Environment
    </StyledButton>
  );

  const isLoading = isFetching || isUpdateParameterSetLoading || isCreateParameterSetLoading;

  return (
    <PageLayout
      top={
        <StyledFlex
          p="8px 36px"
          justifyContent="flex-end"
          backgroundColor={colors.white}
          boxShadow={boxShadows.box}
          gap={2}
          direction="row"
        >
          <StyledButton primary variant="outlined" onClick={() => handleCancelClick()}>
            {isEditState ? 'Cancel' : 'Discard Set'}
          </StyledButton>
          <StyledButton primary variant="contained" onClick={handleSubmit}>
            {isEditState ? 'Save Changes' : 'Create Set'}
          </StyledButton>

          {isEditState && (
            <>
              <StyledFlex
                position="relative"
                width="38px"
                height="38px"
                padding="6px 0px 7px 8px"
                cursor="pointer"
                borderRadius="7px"
                backgroundColor={colors.graySilver}
                onClick={onOpenParamsSetMenu}
                onMouseEnter={onOpenParamsSetMenu}
              >
                <ParametersSetActionsMenu
                  paramsSetMenuAnchorEl={paramsSetMenuAnchorEl}
                  onCloseParamsSetMenu={onCloseParamsSetMenu}
                  onDelete={() => setOpenDeleteParametersSetModal(true)}
                />
                <MoreHoriz />
              </StyledFlex>
            </>
          )}
        </StyledFlex>
      }
    >
      <ContentLayout fullHeight disableScroll={isFetching}>
        {isLoading && <Spinner fadeBgParent inline />}
        <StyledFlex gap="36px" pb="36px">
          <StyledCard p="30px">
            <StyledFlex gap="4px">
              <StyledText size={19} weight={600} lh={28}>
                General
              </StyledText>
              <StyledText size={16} lh={24}>
                Configure the name and description of your parameter set.
              </StyledText>
            </StyledFlex>
            <StyledFlex mt="30px" gap="30px" width="520px">
              <StyledFlex gap="4px">
                <InputLabel size={16} label="Name" isOptional={false} />
                <BaseTextInput
                  name="name"
                  placeholder="Enter a name for your parameter set..."
                  value={values.name}
                  onChange={(e) => setFieldValue('name', e.target.value)}
                  invalid={errors.name && touched.name}
                  onBlur={handleBlur}
                />
                {errors.name && touched.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
              </StyledFlex>

              <StyledFlex gap="4px">
                <InputLabel size={16} label="Description" isOptional={true} />
                <BaseTextInput
                  name="description"
                  placeholder="Enter a description of your parameter set..."
                  value={values.description}
                  onChange={(e) => setFieldValue('description', e.target.value)}
                  onBlur={handleBlur}
                />
              </StyledFlex>
            </StyledFlex>
          </StyledCard>

          <StyledCard p="0">
            <TableV2
              data={{ content: values.defaultParameters }}
              columns={ENVIRONMENT_PARAMETERS_COLUMNS_MODEL}
              title="Default Parameters"
              titleDescription="Create parameters and define default values for them."
              headerActions={<ParametersHeaderActions />}
              headerActionsPosition={HEADER_ACTIONS_POSITION.TITLE_BAR}
              isEmbedded
              enableSearch={false}
              enableShowFiltersButton={false}
              enableFooter={false}
              enableRowSelection={false}
              meta={{
                validationErrors: errors,
                touchedFields: touched,
                typesOptions: getParametersTypeOptions(),
                onParamChange,
                onParamDelete,
              }}
            />
          </StyledCard>

          <StyledCard p="0">
            <TableV2
              data={{ content: values.envSpecificParameters }}
              columns={ENVIRONMENT_SPECIFIC_PARAMETERS_COLUMNS_MODEL}
              title={<EnvironmentHeaderTitle />}
              titleDescription="Override default parameter values for specific environments."
              headerActions={<EnvironmentsHeaderActions />}
              headerActionsPosition={HEADER_ACTIONS_POSITION.TITLE_BAR}
              hideEmptyTitle
              emptyTableDescription="No Environments Have Been Added Yet"
              isEmbedded
              enableSearch={false}
              enableShowFiltersButton={false}
              enableRowSelection={false}
              enableFooter={false}
              meta={{
                onEnvironmentDelete: onEnvironmentDeleteClick,
              }}
              pinRowHoverActionColumns={['deleteById']}
              tableProps={{
                renderDetailPanel: (props) => (
                  <OverridableParameters
                    environment={props.row.original}
                    params={values.defaultParameters}
                    onChange={(params) => onOverridableParamChange(props.row.original.envName, params)}
                  />
                ),
              }}
            />
          </StyledCard>
        </StyledFlex>

        {openSelectEnvironmentModal && (
          <EnvironmentSelectModal
            open={openSelectEnvironmentModal}
            selectedEnvironments={getSelectedEnvironmentsNames()}
            onClose={() => setOpenSelectEnvironmentModal(false)}
            onConfirm={onEnvironmentSelect}
          />
        )}

        {openDeleteEnvironmentModal && (
          <EnvironmentParamsDeleteModal
            open={openDeleteEnvironmentModal}
            onClose={closeEnvironmentDeleteModal}
            onDelete={onEnvironmentDelete}
            name={rowToDelete?.original.envName}
          />
        )}

        {openDeleteParametersSetModal && (
          <ParametersDeleteModal
            open={openDeleteParametersSetModal}
            parameterSet={data}
            onClose={() => setOpenDeleteParametersSetModal(false)}
            onDelete={() => onDeleteParametersSet()}
          />
        )}

        <LeavePageBlockerModal navBlocker={navBlocker} isBlocked={dirty} />
      </ContentLayout>
    </PageLayout>
  );
};

export default ParametersSet;
