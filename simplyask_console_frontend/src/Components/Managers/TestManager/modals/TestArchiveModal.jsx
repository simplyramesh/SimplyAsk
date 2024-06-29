import { useState } from 'react';

import OpenIcon from '../../../shared/REDISIGNED/icons/svgIcons/OpenIcon';
import ConfirmationModal from '../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledDivOnHover, StyledFlex, StyledText } from '../../../shared/styles/styled';
import TestIcon from '../components/TestIcon/TestIcon';
import { LinkedTestsBox } from '../StyledTestManager';

const TestArchiveModal = ({
  linkedValues,
  isArchiveModalOpen,
  archiveTestBtnClick,
  onCloseArchiveModal,
  genericBulkRequestIds,
  rows,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const linkedValuesList = (linkedValues) => (
    <>
      {linkedValues?.map((value, index) => (
        <StyledDivOnHover
          key={index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => console.log('open in test editor')}
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
            <StyledFlex
              direction="row"
              gap="14px"
              alignItems="center"
            >
              <TestIcon entityType={value.genericTestType} />
              <StyledFlex>
                <StyledText size={15} weight={600} lh={22}>
                  {value.displayName}
                </StyledText>
                <StyledText size={13} lh={19}>
                  #
                  {value.testGenericId}
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

  const sumTotalSelected = () => Object.values(genericBulkRequestIds).reduce((totalSum, array) => totalSum + array.length, 0);

  const calculateDifference = (totalSum) => {
    const numUnlinkedRecords = linkedValues?.unLinkageRecordCount || 0;
    return Math.abs(totalSum - numUnlinkedRecords);
  };

  return (
    <ConfirmationModal
      isOpen={isArchiveModalOpen}
      onCloseModal={onCloseArchiveModal}
      alertType="WARNING"
      title="Are You Sure?"
      modalIconSize={70}
      successBtnText="Archive"
      onSuccessClick={archiveTestBtnClick}
      isLoading={false}
      titleTextAlign="center"
      thumbWidth="0px"
    >
      <StyledFlex gap="17px 0">
        <StyledText display="inline" size={16} lh={16} weight={600} textAlign="center">
          <StyledText as="span" display="inline" size={14} lh={19}>
            {sumTotalSelected() > 1 ? (
              <>
                <StyledText as="span" display="inline" weight={600}>
                  {calculateDifference(sumTotalSelected())}
                </StyledText>
                {' '}
                of your
                {' '}
                <StyledText as="span" display="inline" size={14} weight={600}>{sumTotalSelected()}</StyledText>
                {' '}
                selected record(s) are currently linked to
                {' '}
                {linkedValues?.totalRecordCount}
                {' '}
                other records. By archiving these
                {' '}
                {sumTotalSelected()}
                {' '}
                selected records, you will remove the
                {' '}
                {linkedValues?.totalRecordCount}
                {' '}
                linked records from the
                {' '}
                {calculateDifference(sumTotalSelected())}
                {' '}
                affected records
              </>
            )
              : (
                <>
                  <StyledText as="span" display="inline" weight={600}>{rows?.[0]?.displayName}</StyledText>
                  {' '}
                  is currently linked to
                  {' '}
                  <StyledText as="span" display="inline" size={14} weight={600}>{linkedValues?.totalRecordCount}</StyledText>
                  {' '}
                  other record(s).
                  By archiving this Test Case, you will remove it from those
                  {' '}
                  {linkedValues?.totalRecordCount}
                  {' '}
                  records
                </>
              )}
          </StyledText>
        </StyledText>
        <StyledText size={16} weight={600}>
          Linked Records
        </StyledText>
        {linkedValues?.genericLinkageDtoList?.length > 0 ? (
          <LinkedTestsBox>
            {linkedValuesList(linkedValues?.genericLinkageDtoList)}
          </LinkedTestsBox>
        ) : (
          <StyledFlex alignItems="center">
            <StyledText>
              No Linked Tests
            </StyledText>
          </StyledFlex>
        )}
      </StyledFlex>
    </ConfirmationModal>
  );
};

export default TestArchiveModal;
