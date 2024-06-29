import React, { useEffect, useState } from 'react';
import { $createTextNode, $getNodeByKey } from 'lexical';
import { Portal } from 'react-portal';
import { StyledParameterCard } from '../../StyledIntentsSidebar';
import ParamColorIndicator from './ColorIndicator';
import { StyledIconButton, StyledText } from '../../../../../../../../shared/styles/styled';
import TrashBinIcon from '../../../../../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';

const ParameterCard =  ({ e, editor, nodeKey, setPopover, interval }) => {
  const [currentNode, setCurrentNode] = useState(null);

  const backgroundColor = currentNode?.getBgColor();
  const paramName = currentNode?.getParamName();
  const paramType = currentNode?.getParamType();

  const { top, left } = e.target.getBoundingClientRect();
  const { offsetHeight } = e.target;
  const finalTop = top + offsetHeight + 10;

  useEffect(() => {
    editor.getEditorState().read(() => {
      const node = $getNodeByKey(nodeKey);

      if (node) {
        setCurrentNode(node);
      }
    })
  }, [e, nodeKey, editor]);

  const handleMouseEnter = () => {
    clearTimeout(interval.current)
  }

  const handleMouseLeave = () => {
    interval.current = setTimeout(() => {
      setPopover(null)
    }, 200)
  }

  const handleClick = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);

      const nodeText = node.getTextContent();

      node.replace(
        $createTextNode(nodeText),
      )
    })

    setPopover(null)
  }

  return (
    <Portal node={document.body}>
      <StyledParameterCard
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ position: 'fixed', zIndex: 99999, top: finalTop, left }}
      >
        <ParamColorIndicator bgColor={backgroundColor} />
        <StyledText>{paramName}: {paramType}</StyledText>
        <StyledIconButton
          bgColor="transparent"
          size="22px"
          iconSize="18px"
          onClick={handleClick}
        >
          <TrashBinIcon />
        </StyledIconButton>
      </StyledParameterCard>
    </Portal>
  )
}

export default ParameterCard;
