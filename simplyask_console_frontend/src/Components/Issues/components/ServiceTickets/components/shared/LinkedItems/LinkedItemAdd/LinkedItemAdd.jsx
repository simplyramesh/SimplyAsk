import { useTheme } from '@mui/material/styles';
import { debounce } from 'lodash';
import { useState } from 'react';
import { searchEntities } from '../../../../../../../../Services/axios/common';
import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomSelect from '../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import NoOptionsMessage from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/NoOptionsMessage';
import { StyledFlex } from '../../../../../../../shared/styles/styled';
import { ISSUE_ENTITY_SEARCH_TYPE, ISSUE_ENTITY_TYPE } from '../../../../../../constants/core';
import { ISSUE_ENTITY_RELATIONS_OPTIONS } from '../../../../../../constants/options';
import { CustomControl, IndicatorsContainer, LoadingMessage, Option, SingleValue } from './CustomSelectComponents';

const CustomClearText = () => <>clear Test</>;
const ClearIndicator = (props) => {
  const {
    children = <CustomClearText />,
    getStyles,
    innerProps: { ref, ...restInnerProps },
  } = props;
  return (
    <div {...restInnerProps} ref={ref} style={getStyles('clearIndicator', props)}>
      <div style={{ padding: '0px 5px' }}>{children}</div>
    </div>
  );
};

const LinkedItemAdd = ({ onCancel, onSave }) => {
  const [relation, setRelation] = useState(ISSUE_ENTITY_RELATIONS_OPTIONS[0]);
  const [linkedItem, setLinkedItem] = useState(null);
  const theme = useTheme();
  const [showControlButtons, setShowControlButtons] = useState(false);

  const linkedItemTypes = [
    ISSUE_ENTITY_TYPE.ISSUE,
    ISSUE_ENTITY_TYPE.PROCESS,
    ISSUE_ENTITY_TYPE.PROCESS_EXECUTION,
    ISSUE_ENTITY_TYPE.USER,
    ISSUE_ENTITY_TYPE.AGENT,
    ISSUE_ENTITY_TYPE.CONVERSATION,
  ];

  const mapSearchEntityTypeToLinkedItem = (searchType) => {
    if (searchType === ISSUE_ENTITY_SEARCH_TYPE.PROCESS_EXECUTION) {
      return ISSUE_ENTITY_TYPE.PROCESS;
    }

    if (searchType === ISSUE_ENTITY_SEARCH_TYPE.PROCESS) {
      return ISSUE_ENTITY_TYPE.WORKFLOW;
    }

    return searchType;
  };

  const mapEntitiesToOptions = (response) =>
    response?.content
      .map((entity) => ({
        label: entity.name,
        value: entity.id,
        relatedEntity: entity,
      }))
      .filter((entity) => !!entity.relatedEntity)
      .map((entity) => ({
        ...entity,
        relatedEntity: {
          ...entity.relatedEntity,
          type: mapSearchEntityTypeToLinkedItem(entity.relatedEntity.type),
        },
      }));

  const linkedItemsLoadFn = debounce((inputValue, setOptions) => {
    searchEntities({
      searchText: inputValue,
      entityTypes: linkedItemTypes,
    })
      .then(mapEntitiesToOptions)
      .then((resp) => setOptions(resp));
  }, 1000); // NOTE: Debounce time increased to prevent rate limiting from BE

  return (
    <StyledFlex>
      <StyledFlex direction="row" justifyContent="space-between">
        <StyledFlex width="190px" flexShrink={0} mr={1.5}>
          <CustomSelect
            options={ISSUE_ENTITY_RELATIONS_OPTIONS}
            placeholder="Relates to"
            value={relation}
            closeMenuOnSelect
            closeMenuOnScroll
            isClearable={false}
            isSearchable={false}
            onChange={(val) => setRelation(val)}
            components={{
              DropdownIndicator: CustomIndicatorArrow,
            }}
            maxHeight={30}
            menuPadding={0}
            form
          />
        </StyledFlex>
        <StyledFlex direction="column" flex="auto" width="100%">
          <CustomSelect
            defaultOptions
            isAsync
            loadOptions={linkedItemsLoadFn}
            placeholder="Search Items..."
            value={linkedItem}
            closeMenuOnSelect
            closeMenuOnScroll
            onChange={(val) => setLinkedItem(val)}
            components={{
              DropdownIndicator: CustomIndicatorArrow,
              Option,
              SingleValue,
              LoadingMessage,
              NoOptionsMessage,
              IndicatorsContainer,
              ClearIndicator,
              Control: CustomControl,
            }}
            maxHeight={30}
            menuPadding={0}
            form
            customControl
            menuPlacement="auto"
            onFocus={() => setShowControlButtons(true)}
            onBlur={() => setShowControlButtons(false)}
            bgColorSelected={theme.colors.bgColorOptionTwo}
          />
        </StyledFlex>
      </StyledFlex>
      {(showControlButtons || !!linkedItem) && (
        <StyledFlex direction="row" justifyContent="flex-end" mt={2} gap={1.5}>
          <StyledButton
            variant="contained"
            tertiary
            disableRipple
            onClick={() => {
              setLinkedItem(null);
              onCancel?.();
            }}
          >
            Cancel
          </StyledButton>
          <StyledButton
            variant="contained"
            secondary
            disabled={!linkedItem}
            disableRipple
            onClick={() => {
              setLinkedItem(null);
              onSave?.({
                relation: relation.value,
                relatedEntity: linkedItem.relatedEntity,
              });
            }}
          >
            Link
          </StyledButton>
        </StyledFlex>
      )}
    </StyledFlex>
  );
};

export default LinkedItemAdd;
