import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalTypeaheadMenuPlugin, useBasicTypeaheadTriggerMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import React, { useCallback, useState } from 'react';
import { Portal } from 'react-portal';

import ParamsAutocompleteDropdown from '../components/ParamsAutocompleteDropdown';
import { ParamsAutocompleteDropdownItem } from '../components/ParamsAutocompleteDropdownItem';
import { useParamsLookupService } from '../hooks/useParamsLookupService';
import { $createParamNode } from '../nodes/ParamNode';
import { getPossibleQueryMatch } from '../utils/helpers';

const ParamsAutocompletePlugin = ({ id, params }) => {
  const [editor] = useLexicalComposerContext();

  const [queryString, setQueryString] = useState(null);

  const options = useParamsLookupService(queryString, params);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', { minLength: 0 });

  const onSelectOption = useCallback(
    (selectedOption, nodeToReplace, closeMenu) => {
      editor.update(() => {
        const paramNode = $createParamNode(selectedOption.value);
        if (nodeToReplace) {
          nodeToReplace.replace(paramNode);
        }
        paramNode.select();
        closeMenu();
      });
    },
    [editor]
  );

  const checkForParamsMatch = useCallback(
    (text = '') => {
      const paramMatch = getPossibleQueryMatch(text);
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      return !slashMatch && paramMatch ? paramMatch : null;
    },
    [checkForSlashTriggerMatch, editor]
  );

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForParamsMatch}
      options={options}
      menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => {
        const anchorNode = document && document.getElementById(id);

        return anchorElementRef && options.length ? (
          <Portal node={anchorNode}>
            <ParamsAutocompleteDropdown>
              {options.map((option, i) => (
                <ParamsAutocompleteDropdownItem
                  index={i}
                  isSelected={selectedIndex === i}
                  onClick={() => {
                    setHighlightedIndex(i);
                    selectOptionAndCleanUp(option);
                  }}
                  onMouseEnter={() => {
                    setHighlightedIndex(i);
                  }}
                  key={option.value}
                  option={option}
                />
              ))}
            </ParamsAutocompleteDropdown>
          </Portal>
        ) : null;
      }}
    />
  );
};

export default ParamsAutocompletePlugin;
