import { SvgIcon } from '@mui/material';
import { useTheme } from '@mui/system';
import { useFormik } from 'formik';
import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import MoreHorizontalIcon from '../../../../../../../Assets/icons/threeDotsHorizontal.svg?component';
import routes from '../../../../../../../config/routes';
import { usePopoverToggle } from '../../../../../../../hooks/usePopoverToggle';
import { modifiedCurrentPageDetails } from '../../../../../../../store';
import { StyledPopoverActionsBtn } from '../../../../../../shared/ManagerComponents/SubNavBar/StyledSubNavBar';
import { useNavigationBlock } from '../../../../../../shared/REDISIGNED/BlockNavigate/BlockNavigate';
import LeavePageBlockerModal from '../../../../../../shared/REDISIGNED/BlockNavigate/LeavePageBlockerModal/LeavePageBlockerModal';
import { delayedBlockerSyncNavigation } from '../../../../../../shared/REDISIGNED/BlockNavigate/utils/helpers';
import { StyledButton, StyledLoadingButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import TrashBinIcon from '../../../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';
import ContentLayout from '../../../../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../../../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../../../shared/Spinner/Spinner';
import {
  StyledCard,
  StyledFlex,
  StyledIconButton,
  StyledPopover,
  StyledText,
  StyledTextField,
} from '../../../../../../shared/styles/styled';
import FormErrorMessage from '../../../../../AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { useCreateKnowledgeBase } from '../hooks/useCreateKnowledgeBase';
import { useDeleteKnowledgeBase } from '../hooks/useDeleteKnowledgeBase';
import useGetKnowledgeBaseById from '../hooks/useGetKnowledgeBaseById';
import useGetKnowledgeBases from '../hooks/useGetKnowledgeBases';
import { useUpdateKnowledgeBase } from '../hooks/useUpdateKnowledgeBase';
import { MODAL_TYPE } from '../utils/constants';
import { createKnowledgeBaseValidationSchema } from '../utils/validationSchema';
import KnowledgeSources from './KnowledgeSources/KnowledgeSources';

const CreateKnowledgeBase = () => {
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);
  const { colors, boxShadows } = useTheme();
  const navigate = useNavigate();
  const { knowledgeBaseId } = useParams();
  const [filteredKnowledgeSources, setFilteredKnowledgeSources] = useState([]);

  const { knowledgeBase, isLoading } = useGetKnowledgeBaseById({
    knowledgeBaseId,
    enabled: !!knowledgeBaseId,
  });

  const { knowledgeBases, isFetching: isKnowledgeBasesLoading } = useGetKnowledgeBases();

  const knowledgeBasesNames = knowledgeBases?.content.map((knowledgeBase) => knowledgeBase.name);

  const initialValues = {
    name: knowledgeBaseId ? knowledgeBase?.name : '',
    description: knowledgeBaseId ? knowledgeBase?.description : '',
    knowledgeSources: knowledgeBaseId
      ? knowledgeBase?.knowledgeSources?.map((ks) => {
          if (ks.type === MODAL_TYPE.FILE) {
            return { ...ks, source: { ...ks.source, fileId: [{ name: ks.source.fileName, id: ks.source.url }] } };
          }

          return ks;
        })
      : [],
  };

  const resetFormAndNavigate = () => {
    resetForm();

    delayedBlockerSyncNavigation(() => navigate(routes.SETTINGS_GENERAL_TAB));
  };

  const onSuccessAndErrorHandler = (operation) => ({
    onSuccess: () => {
      toast.success(`knowledge base has been ${operation}`);
      resetFormAndNavigate();
    },
    onError: (error) => {
      if (error?.code === 'ERR_NETWORK') { //TODO: remove later when BE/Proxy server issue is fixed
        toast.warning('Knowledge Base has been created and is being processed');
        resetFormAndNavigate();
      } else {
        toast.error('Something went wrong');
      }
    },
    knowledgeBaseId,
  });

  const { createKnowledgeBaseTask: createKnowledgeBase, isCreateKnowledgeBaseTaskLoading } = useCreateKnowledgeBase(
    onSuccessAndErrorHandler('created')
  );

  const { updateKnowledgeBaseTask, isUpdateKnowledgeBaseTaskLoading } = useUpdateKnowledgeBase(
    onSuccessAndErrorHandler('updated')
  );

  const { deleteKnowledgeBase, isDeleteKnowledgeBaseLoading } = useDeleteKnowledgeBase(
    onSuccessAndErrorHandler('deleted')
  );

  const { values, setFieldValue, handleSubmit, dirty, resetForm, setValues, errors, touched, handleBlur } = useFormik({
    initialValues,
    validationSchema: () => createKnowledgeBaseValidationSchema(knowledgeBasesNames, initialValues?.name, values?.name),
    onSubmit: (values) => {
      const updatedKnowledgeSources = values.knowledgeSources.map((ks) => {
        if (ks.type === MODAL_TYPE.FILE) {
          return {
            ...ks,
            source: { ...ks.source, fileId: ks.source.fileId[0].url },
          };
        }
        return ks;
      });
      const updatedValues = { ...values, knowledgeSources: updatedKnowledgeSources };
      knowledgeBaseId ? updateKnowledgeBaseTask(updatedValues) : createKnowledgeBase(updatedValues);
    },
  });

  const isNavigationBlocked = dirty && !isEqual(initialValues, values);

  const { navBlocker } = useNavigationBlock(isNavigationBlocked);

  useEffect(() => {
    setValues(
      knowledgeBase
        ? {
            name: knowledgeBase?.name,
            description: knowledgeBase?.description,
            knowledgeSources: knowledgeBase?.knowledgeSources?.map((ks) => {
              if (ks.type === MODAL_TYPE.FILE) {
                return { ...ks, source: { ...ks.source, fileId: [{ name: ks.source.fileName }] } };
              }

              return ks;
            }),
          }
        : initialValues
    );

    knowledgeBase &&
      setCurrentPageDetailsState({
        pageUrlPath: routes.SETTINGS_GENERAL_TAB_EDIT_KNOWLEDGE_BASE,
        breadCrumbLabel: knowledgeBase.name,
      });
  }, [isLoading]);

  const onKnowledgeBasePopoverClick = (e) => {
    e.stopPropagation();
    handleClickKnowledgeBasePopover(e);
  };

  const {
    id: idKnowledgeBasePopover,
    open: openKnowledgeBasePopover,
    anchorEl: anchorElKnowledgeBasePopover,
    handleClick: handleClickKnowledgeBasePopover,
    handleClose: handleCloseKnowledgeBasePopover,
  } = usePopoverToggle('knowledgeBase-actions');

  const getActionsPopover = () => (
    <StyledPopover
      id={idKnowledgeBasePopover}
      open={openKnowledgeBasePopover}
      anchorEl={anchorElKnowledgeBasePopover}
      onClose={(e) => {
        e.stopPropagation();
        handleCloseKnowledgeBasePopover(e);
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{
        '& .MuiPopover-paper': {
          overflow: 'hidden',
        },
        '&': {
          zIndex: 5002,
        },
      }}
    >
      <StyledFlex overflow="hidden">
        <StyledPopoverActionsBtn
          onClick={(e) => {
            handleCloseKnowledgeBasePopover(e);
            deleteKnowledgeBase(knowledgeBaseId);
          }}
        >
          <StyledFlex cursor="pointer" p="7px 16px" direction="row" gap="10px" alignItems="center" width="141px">
            <SvgIcon
              component={TrashBinIcon}
              sx={{
                position: 'absolute',
                bottom: '11px',
                width: '19px',
                height: '19px',
                left: '14px',
                color: colors.primary,
              }}
            />
            <StyledText ml={26}>Delete</StyledText>
          </StyledFlex>
        </StyledPopoverActionsBtn>
      </StyledFlex>
    </StyledPopover>
  );

  if ((!!knowledgeBaseId && isLoading) || isDeleteKnowledgeBaseLoading || isKnowledgeBasesLoading)
    return <Spinner parent />;

  const isKnowledgeBaseLoading = isCreateKnowledgeBaseTaskLoading || isUpdateKnowledgeBaseTaskLoading;

  const onSubmitHandler = () =>
    values.knowledgeSources.length ? handleSubmit() : toast.warning('At least one knowledge source is required');

  return (
    <>
      <PageLayout
        top={
          <StyledFlex
            justifyContent="flex-end"
            direction="row"
            gap="12px"
            backgroundColor={colors.white}
            boxShadow={boxShadows.table}
            p="8px 36px"
          >
            <StyledButton variant="outlined" primary onClick={() => navigate(routes.SETTINGS_GENERAL_TAB)}>
              {knowledgeBaseId ? 'Close' : 'Discard'}
            </StyledButton>
            <StyledLoadingButton variant="contained" primary onClick={onSubmitHandler} loading={isKnowledgeBaseLoading}>
              {knowledgeBaseId ? 'Save Changes' : 'Create Knowledge Base'}
            </StyledLoadingButton>
            {knowledgeBaseId && (
              <StyledTooltip arrow placement="top" title="Actions" p="10px 15px" maxWidth="325px">
                <StyledIconButton
                  onClick={onKnowledgeBasePopoverClick}
                  iconSize="20px"
                  size="38px"
                  bgColor={colors.lightBlueShade}
                  hoverBgColor={colors.mischkaShade}
                  borderRadius="8px"
                >
                  <MoreHorizontalIcon />
                </StyledIconButton>
              </StyledTooltip>
            )}
            {knowledgeBaseId && getActionsPopover()}
          </StyledFlex>
        }
      >
        <ContentLayout>
          <StyledFlex gap="36px">
            <StyledCard p="30px">
              <StyledFlex gap="30px">
                <StyledFlex>
                  <StyledText size={19} weight={600}>
                    General
                  </StyledText>
                  <StyledText>Configure the name and description of your knowledge base.</StyledText>
                </StyledFlex>
                <StyledFlex width={545}>
                  <InputLabel label="Name" />
                  <StyledTextField
                    id="name"
                    name="name"
                    placeholder="Enter a name..."
                    value={values.name}
                    onChange={(e) => setFieldValue('name', e.target.value)}
                    variant="standard"
                    minHeight="41px"
                    multiline
                    onBlur={handleBlur}
                    invalid={errors?.name && touched?.name}
                  />
                  {errors?.name && touched?.name && <FormErrorMessage>{errors?.name}</FormErrorMessage>}
                </StyledFlex>
                <StyledFlex width={545}>
                  <InputLabel label="Description" isOptional />
                  <StyledTextField
                    id="description"
                    name="description"
                    placeholder="Enter a description..."
                    value={values.description}
                    onChange={(e) => setFieldValue('description', e.target.value)}
                    minHeight="41px"
                    multiline
                    variant="standard"
                  />
                </StyledFlex>
              </StyledFlex>
            </StyledCard>
            <KnowledgeSources
              values={values}
              setFieldValue={setFieldValue}
              setFilteredKnowledgeSources={setFilteredKnowledgeSources}
              filteredKnowledgeSources={filteredKnowledgeSources}
            />
          </StyledFlex>
        </ContentLayout>
      </PageLayout>

      <LeavePageBlockerModal navBlocker={navBlocker} isBlocked={isNavigationBlocked} />
    </>
  );
};

export default CreateKnowledgeBase;
