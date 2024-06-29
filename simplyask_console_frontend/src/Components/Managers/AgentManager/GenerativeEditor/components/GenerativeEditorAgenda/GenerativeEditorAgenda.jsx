import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { StyledFlex } from '../../../../../shared/styles/styled';
import { StyledStepErrorCircle } from '../../../../shared/components/CustomSteps/StyledStep';
import { generativeEditorErrors } from '../../store';
import { cards } from '../../util/generativeEditorData';
import { StyledGenerativeEditorAgenda, StyledGenerativeEditorAgendaItem } from './StyledGenerativeEditorAgenda';

const GenerativeEditorAgenda = ({ activeId }) => {
  const [clickedActiveId, setClickedActiveId] = useState(cards[0].id);
  const errors = useRecoilValue(generativeEditorErrors);

  useEffect(() => {
    if (activeId !== clickedActiveId) setClickedActiveId(activeId);
  }, [activeId]);

  const handleClick = (id) => {
    setClickedActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      const elementIndex = cards.findIndex((card) => card.id === id);
      const block = elementIndex % 2 !== 0 ? 'start' : 'center';
      element.scrollIntoView({ block, behavior: 'smooth' });
    }
  };

  const hasTabErrors = (tabName) => {
    switch (tabName) {
      case 'objectives':
        return Object.keys(errors).some((key) => key.startsWith('objectives'));
      case 'greeting':
        return 'greeting' in errors;
      default:
        return false;
    }
  };

  return (
    <StyledGenerativeEditorAgenda>
      {cards.map((card) => (
        <StyledGenerativeEditorAgendaItem
          key={card.id}
          active={activeId === card.id}
          onClick={() => handleClick(card.id)}
        >
          <StyledFlex gap="10px" direction="row" alignItems="center">
            {card.label}
            {hasTabErrors(card.id) && (
              <StyledFlex flexShrink="0">
                <StyledStepErrorCircle inline />
              </StyledFlex>
            )}
          </StyledFlex>
        </StyledGenerativeEditorAgendaItem>
      ))}
    </StyledGenerativeEditorAgenda>
  );
};

export default GenerativeEditorAgenda;
