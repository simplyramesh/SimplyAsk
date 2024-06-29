import { useNavigate } from 'react-router-dom';
import LinkedItemCard from '../../../../Issues/components/ServiceTickets/components/shared/LinkedItems/LinkedItemCard/LinkedItemCard';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { TEST_MANAGER_LABELS } from '../../constants/constants';
import { testEntityTypeToLinkedItemsAdapter } from '../../utils/helpers';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { useState } from 'react';

const LINKED_ITEMS_CAP = 5;

const LinkedTestEntities = ({ entities = [], type, onUnlink, testEntityId }) => {
  const navigate = useNavigate();
  const [showFullList, setShowFullList] = useState(false);
  const linkedItems = showFullList ? entities : entities.slice(0, LINKED_ITEMS_CAP);
  const unshownItemsCount = entities.length - LINKED_ITEMS_CAP;

  if (!entities.length) {
    return null;
  }

  const linkedTestEntityMapper = (test, type) => {
    const id = test.testGroupId || test.testSuiteId || test.testCaseId;
    return {
      id,
      name: test.displayName,
      description: id ? `#${id}` : '',
      type: testEntityTypeToLinkedItemsAdapter(type),
    };
  };

  const goToTestEntity = (type, entity) => {
    const id = entity.testGroupId || entity.testSuiteId || entity.testCaseId;
    const currentPath = window.location.pathname;
    const dynamicSegmentRegex = /(case|suite|group)/;
    const pathParts = currentPath.split(dynamicSegmentRegex);

    if (pathParts.length === 3) {
      const newPath = `${pathParts[0]}${type.toLowerCase()}/${id}`;
      navigate(newPath);
    }
  };

  const toggleList = () => setShowFullList((prev) => !prev);

  return (
    <StyledFlex gap="12px">
      <StyledText size={14} weight={600}>
        {TEST_MANAGER_LABELS[type]}s
      </StyledText>
      <StyledFlex gap={1}>
        {linkedItems.map((test, index) => (
          <LinkedItemCard
            key={index}
            item={linkedTestEntityMapper(test, type)}
            onUnlink={(item) => onUnlink(testEntityId, [item.id])}
            closeTooltipText="Unassign"
            onClick={() => goToTestEntity(type, test)}
            isLinkedClickable
          />
        ))}
      </StyledFlex>

      {entities.length > LINKED_ITEMS_CAP && (
        <StyledFlex alignItems="flex-start">
          <StyledButton variant="text" onClick={toggleList}>
            Show {showFullList ? 'Less' : `${unshownItemsCount} More`}
          </StyledButton>
        </StyledFlex>
      )}
    </StyledFlex>
  );
};

export default LinkedTestEntities;
