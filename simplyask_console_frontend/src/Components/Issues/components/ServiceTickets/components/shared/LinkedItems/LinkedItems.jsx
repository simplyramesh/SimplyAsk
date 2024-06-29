import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';

import { groupBy } from '../../../../../../../utils/helperFunctions';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { ISSUE_ENTITY_RELATIONS, ISSUE_RELATIONS_LABELS } from '../../../../../constants/core';
import ServiceTicketsEmptySectionDetail from '../ServiceTicketsEmptySectionDetail/ServiceTicketsEmptySectionDetail';

import LinkedItemAdd from './LinkedItemAdd/LinkedItemAdd';
import LinkedItemCard from './LinkedItemCard/LinkedItemCard';

const LinkedItems = ({
  relatedEntities,
  entityMapper,
  titleSize = 16,
  onSave,
  onUnlink,
  showAddFormByDefault,
  ticketId,
  onLinkedChildEntity,
  hideLinking,
}) => {
  const [groupedItems, setGroupedItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const groupItemsEntries = Object.entries(groupedItems);
  const groupItemsKeysCount = Object.keys(groupedItems)?.length;

  useEffect(() => {
    if (relatedEntities) {
      const filterItemsWithEntity = relatedEntities?.filter((item) => item.relatedEntity) || [];
      setGroupedItems(groupBy(filterItemsWithEntity, 'relation'));
    }
  }, [relatedEntities]);

  const getLinkedConditionalProp = (linkedItem) => {
    const isChildRelation = ISSUE_ENTITY_RELATIONS.CHILD === linkedItem.relation;

    return isChildRelation && onLinkedChildEntity
      ? { onClick: () => onLinkedChildEntity(linkedItem.relatedEntity) }
      : {};
  };

  return (
    <StyledFlex>
      {hideLinking ? null : (
        <StyledFlex direction="row" justifyContent="space-between" mb={2}>
          <StyledText size={titleSize} weight={600}>
            Linked Items
          </StyledText>
          {!showAddFormByDefault && (
            <StyledButton variant="text" onClick={() => setShowAddForm(true)} startIcon={<AddIcon />}>
              Link an Item
            </StyledButton>
          )}
        </StyledFlex>
      )}
      {(showAddForm || showAddFormByDefault) && !hideLinking && (
        <StyledFlex mb={4}>
          <LinkedItemAdd
            onCancel={() => setShowAddForm(false)}
            onSave={(e) => {
              onSave?.(e);
              setShowAddForm(false);
            }}
          />
        </StyledFlex>
      )}
      {groupedItems && groupItemsKeysCount ? (
        groupItemsEntries.map(([key, items], index) => (
          <StyledFlex mb={index === groupItemsEntries.length - 1 ? 0 : 4} key={key}>
            {hideLinking ? null : (
              <StyledFlex mb={1}>
                <StyledText size={14} weight={600}>{`${ISSUE_RELATIONS_LABELS[key]}:`}</StyledText>
              </StyledFlex>
            )}
            <StyledFlex gap={1}>
              {!!items?.length &&
                items.map((item) => (
                  <LinkedItemCard
                    item={entityMapper ? entityMapper(item) : item}
                    key={item.id}
                    onUnlink={(e) => onUnlink?.(e)}
                    relation={item.relation}
                    ticketId={ticketId}
                    isLinkedClickable
                    {...getLinkedConditionalProp(item)}
                  />
                ))}
            </StyledFlex>
          </StyledFlex>
        ))
      ) : (
        <ServiceTicketsEmptySectionDetail title="There Are No Linked Items" />
      )}
    </StyledFlex>
  );
};

export default LinkedItems;
