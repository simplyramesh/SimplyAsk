import { useTheme } from '@emotion/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useEffect, useState } from 'react';
import routes from '../../../config/routes';
import LinkedItemIcon from '../../Issues/components/ServiceTickets/components/shared/LinkedItems/LinkedItemIcon/LinkedItemIcon';
import {
  ALL_ATTACHMENT_FORMATS,
  FALLBACK_DOC_ICON,
  FOLDER_ICON,
} from '../../Issues/components/ServiceTickets/constants/attachments';
import { ISSUE_ENTITY_TYPE } from '../../Issues/constants/core';
import { LinkedTestsBox } from '../../Managers/TestManager/StyledTestManager';
import OpenIcon from '../../shared/REDISIGNED/icons/svgIcons/OpenIcon';
import ConfirmationModal from '../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledTooltip } from '../../shared/REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../shared/Spinner/Spinner';
import { StyledDivOnHover, StyledFlex, StyledText } from '../../shared/styles/styled';
import { FILE, FOLDER, PROCESS } from '../constants';

const GetFileFormatIcon = ({ type, name }) => {
  if (type === FOLDER) {
    return <FOLDER_ICON style={{ width: '24px', height: '24px' }} />;
  } else {
    const lastIndexOfDot = name?.lastIndexOf('.');
    const getFileExtension = name?.slice(lastIndexOfDot + 1);
    const format = ALL_ATTACHMENT_FORMATS?.find(
      (format) => format.FORMAT_TYPE?.toLowerCase() === getFileExtension?.toLowerCase()
    );
    const IconComponent = format ? format.ICON : FALLBACK_DOC_ICON;
    return <IconComponent style={{ width: '24px', height: '24px' }} />;
  }
};

const convertUsageTypeToEntityType = (useageType) => {
  if (useageType === 'ServiceTask') {
    return ISSUE_ENTITY_TYPE.ISSUE;
  } else {
    return useageType?.toUpperCase() || '';
  }
};

const DeleteFilesInUse = ({
  linkedValues,
  isDeleteModalOpen,
  deleteBtnClick,
  onCloseDeleteModal,
  fileInfo,
  fileParent,
  onFileClick,
  onBackButtonClick,
  isLoading,
}) => {
  const { colors } = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [fileInfoState, setFileInfoState] = useState(fileInfo);
  const isFolder = fileInfoState?.type === FOLDER || fileInfo?.type === FOLDER;
  const fileDataStructure = Array.isArray(linkedValues) ? linkedValues : [linkedValues]; //TODO change to LinkedValues
  const fileDataStrucutreLen = fileDataStructure?.length || 0;

  useEffect(() => {
    setFileInfoState(fileInfo);
  }, [fileInfo]);

  const handleFileClick = async (value) => {
    try {
      await onFileClick({ ...value, type: FILE });
    } catch (error) {
      console.error('Error loading file:', error);
    } finally {
      setFileInfoState({ ...value, type: FILE });
    }
  };

  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleBackButtonClick = async () => {
    try {
      await onBackButtonClick(fileParent);
    } catch (error) {
      console.error('Error handling back button click:', error);
    }
  };

  const handleFileNavigationClick = (usageType, usedById) => {
    if (usageType === PROCESS) {
      openInNewTab(routes.PROCESS_HISTORY_BULK_PREVIEW.replace(':ticketId', usedById));
    } else {
      openInNewTab(routes.TICKETS_FULLVIEW.replace(':ticketId', usedById));
    }
  };

  const linkedValuesList = () => {
    return (
      <>
        {isFolder
          ? fileDataStructure?.map((value, index) => (
              <StyledDivOnHover
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <StyledFlex
                  direction="row"
                  alignItems="center"
                  my="6px"
                  ml="8px"
                  mr="10px"
                  justifyContent="space-between"
                  py="10px"
                  cursor="pointer"
                  onClick={() => handleFileClick(value)}
                  maxWidth="410px"
                  overflow="hidden"
                  position="relative"
                >
                  <StyledFlex direction="row" gap="14px" alignItems="center" maxLines={1}>
                    <GetFileFormatIcon type={value?.type || ''} name={value?.fileName} />
                    <StyledFlex>
                      <StyledText size={14} weight={600} lh={22} maxLines={1} maxWidth="400px">
                        {value?.fileName}
                        {hoveredIndex === index && (
                          <StyledFlex postion="relative" alignItems="end" justifyContent="end" textAlign="end">
                            <StyledFlex
                              position="absolute"
                              right="0"
                              backgroundColor={colors.altoGray}
                              width="30px"
                              height="30px"
                              alignItems="end"
                              justifyContent="end"
                            >
                              <StyledTooltip
                                title="View Items Using This File"
                                arrow
                                placement="top"
                                p="10px 15px"
                                maxWidth="auto"
                              >
                                <ArrowForwardIcon />
                              </StyledTooltip>
                            </StyledFlex>
                          </StyledFlex>
                        )}
                      </StyledText>
                    </StyledFlex>
                  </StyledFlex>
                </StyledFlex>
              </StyledDivOnHover>
            ))
          : fileDataStructure?.map((value, index) => (
              <StyledDivOnHover
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleFileNavigationClick(value?.usageType, value?.usedById)}
                cursor="pointer"
              >
                <StyledFlex
                  direction="row"
                  gap="14px"
                  alignItems="center"
                  my="6px"
                  ml="8px"
                  mr="15px"
                  justifyContent="space-between"
                >
                  <StyledFlex direction="row" gap="14px" alignItems="center">
                    <LinkedItemIcon
                      type={convertUsageTypeToEntityType(value?.usageType)}
                      relatedEntity=""
                      tooltipText={value?.usageType || null}
                    />
                    <StyledFlex>
                      <StyledText size={15} weight={600} lh={22} maxLines={1}>
                        {value?.usageType}
                      </StyledText>
                      <StyledText size={13} lh={19} maxLines={1}>
                        #{value?.usedById}
                      </StyledText>
                    </StyledFlex>
                  </StyledFlex>
                  {hoveredIndex === index && (
                    <StyledFlex alignItems="end" justifyContent="end" textAlign="end">
                      <OpenIcon />
                    </StyledFlex>
                  )}
                </StyledFlex>
              </StyledDivOnHover>
            ))}
      </>
    );
  };

  const showLinkedFiles = () => {
    const adjustedFileDataStructureLen =
      fileDataStructure.length === 1 && fileDataStructure[0] === undefined ? 0 : fileDataStrucutreLen;

    if (isLoading) {
      return (
        <LinkedTestsBox height={59}>
          <Spinner small inline />
        </LinkedTestsBox>
      );
    }
    if (adjustedFileDataStructureLen > 0) {
      return <LinkedTestsBox>{linkedValuesList()}</LinkedTestsBox>;
    } else {
      return 'No Files Found';
    }
  };

  return (
    <ConfirmationModal
      isOpen={isDeleteModalOpen}
      onCloseModal={() => {
        setFileInfoState({});
        onCloseDeleteModal();
      }}
      alertType="WARNING"
      title="Are You Sure?"
      modalIconSize={70}
      successBtnText="Confirm"
      onSuccessClick={() => {
        setFileInfoState({});
        deleteBtnClick();
      }}
      isLoading={false}
      titleTextAlign="center"
      thumbWidth="0px"
      zIndexRoot={5002}
    >
      {fileDataStrucutreLen > 0 ? (
        <StyledFlex gap="17px 0">
          <StyledText display="inline" size={16} lh={16} weight={600} textAlign="center">
            <StyledText as="span" display="inline" size={14} lh={19}>
              <StyledText as="span" display="inline" weight={600}>
                {fileParent?.name || fileInfo?.name}
              </StyledText>{' '}
              {!isFolder && fileParent?.type !== FOLDER ? (
                <>
                  is currently being used by{' '}
                  <StyledText as="span" display="inline" size={14} weight={600}>
                    {fileDataStrucutreLen}
                  </StyledText>{' '}
                  item(s). By deleting this file, you will remove it from those {fileDataStrucutreLen} item(s)
                </>
              ) : (
                <>
                  contains{' '}
                  <StyledText as="span" display="inline" size={14} weight={600}>
                    {fileParent?.fileDataLength || 0}
                  </StyledText>{' '}
                  files that are currently in use. By deleting this folder, those files will be removed from the items,
                  such as tickets and issues that are using them.
                </>
              )}
            </StyledText>
          </StyledText>
          <StyledFlex flexDirection="row" mb="-10px">
            {fileInfoState?.fileStorage?.fileFolder ? (
              <StyledFlex flexDirection="row" onClick={handleBackButtonClick}>
                <ArrowBackIcon cursor="pointer" />
                <StyledText cursor="pointer" mt={2} ml={3} size={14} weight={600}>
                  Places File Is Used
                </StyledText>
              </StyledFlex>
            ) : (
              <StyledText mt={3} ml={3} size={14} weight={600}>
                Files In Use
              </StyledText>
            )}
          </StyledFlex>
          {showLinkedFiles()}
        </StyledFlex>
      ) : (
        <StyledFlex gap="17px 0">
          <StyledText display="inline" size={16} lh={18} weight={400} textAlign="center">
            You are about to delete{' '}
            <StyledText as="span" display="inline" weight={600}>
              {fileInfoState?.name || fileInfo?.name}
            </StyledText>{' '}
            {isFolder && 'and all its files'}. This action cannot be undone. Are you sure you want to proceed?
          </StyledText>
        </StyledFlex>
      )}
    </ConfirmationModal>
  );
};

export default DeleteFilesInUse;
