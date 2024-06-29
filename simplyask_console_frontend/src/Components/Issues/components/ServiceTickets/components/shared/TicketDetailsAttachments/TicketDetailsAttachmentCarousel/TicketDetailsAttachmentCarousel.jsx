import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

import CarouselArrow from '../../../../../../../../Assets/icons/issues/attachments/CarouselArrow.svg?component';
import { StyledFlex } from '../../../../../../../shared/styles/styled';

const StyledContainer = styled(StyledFlex)`
  &:hover {
    & button {
      display: flex;
    }
  }
`;

const StyledArrowLeft = styled(Button)`
  position: absolute;
  z-index: 100;
  transform: rotate(180deg);
  cursor: pointer;
  left: -7px;
  display: none;

  & > svg > g > path {
    transition: all 200ms ease-in;
  }

  & > svg > g:hover {
    & > path {
      fill: ${({ theme }) => theme.colors.primary};
    }

    & > path:last-child {
      stroke: ${({ theme }) => theme.colors.white};
    }
  }
`;

const StyledArrowRight = styled(StyledArrowLeft)`
  left: auto;
  right: -7px;
  transform: rotate(0deg);
`;

const TicketDetailsAttachmentCarousel = ({
  children,
  getAllAttachedFiles,
  isTicketDetailFullView,
  isCreateTicketView = false,
  isUploadFileToIssueLoading,
}) => {
  const scrollbarRef = useRef(null);

  const [showScrollbarArrow, setShowScrollbarArrow] = useState({ leftArrow: false, rightArrow: false });

  const showRightArrowBasedOnFilesLength = () => {
    const filesLength = getAllAttachedFiles?.length;

    if (isTicketDetailFullView) return filesLength > 5;
    if (isCreateTicketView) return filesLength > 4;

    return filesLength > 3;
  };

  useEffect(() => {
    setShowScrollbarArrow({ leftArrow: false, rightArrow: showRightArrowBasedOnFilesLength() });
  }, [getAllAttachedFiles]);

  const onScroll = (scroll) => {
    const getFullScrollWidth = scroll?.target?.scrollWidth;
    const getFullClientWidth = scroll?.target?.clientWidth;
    const getLeftScrollOffsetWidth = scroll?.target?.scrollLeft;

    const getDistanceDifference = getFullScrollWidth - getLeftScrollOffsetWidth;

    if (getLeftScrollOffsetWidth > 0) {
      setShowScrollbarArrow({ leftArrow: true, rightArrow: getDistanceDifference > getFullClientWidth + 1 });
    } else {
      setShowScrollbarArrow({ leftArrow: false, rightArrow: showRightArrowBasedOnFilesLength() });
    }
  };

  const SCROLL_CLICK_OFFSET = 495;

  const onRightArrowClick = (e) => {
    e.stopPropagation();

    scrollbarRef?.current?.view.scroll({
      left: scrollbarRef.current.getScrollLeft() + SCROLL_CLICK_OFFSET,
      behavior: 'smooth',
    });
  };

  const onLeftArrowClick = (e) => {
    e.stopPropagation();

    scrollbarRef?.current?.view.scroll({
      left: scrollbarRef.current.getScrollLeft() - SCROLL_CLICK_OFFSET,
      behavior: 'smooth',
    });
  };

  const getArrowsTopPos = () => (isCreateTicketView ? '154px' : '122px');

  return (
    <StyledContainer height={isUploadFileToIssueLoading ? '230px' : '100%'}>
      {showScrollbarArrow?.leftArrow && (
        <StyledArrowLeft style={{ top: getArrowsTopPos() }}>
          <CarouselArrow onClick={onLeftArrowClick} />
        </StyledArrowLeft>
      )}
      <Scrollbars ref={scrollbarRef} onScroll={onScroll}>
        {children}
      </Scrollbars>
      {showScrollbarArrow?.rightArrow && (
        <StyledArrowRight style={{ top: getArrowsTopPos() }}>
          <CarouselArrow onClick={onRightArrowClick} />
        </StyledArrowRight>
      )}
    </StyledContainer>
  );
};

export default TicketDetailsAttachmentCarousel;
