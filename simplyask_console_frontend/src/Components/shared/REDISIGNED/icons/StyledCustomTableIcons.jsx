import styled from '@emotion/styled';

export const StyledSpanIcon = styled.span`
  position: revert;
  padding: ${(props) => (props.padding ? props.padding : '0')};
  margin: ${(props) => (props.margin ? props.margin : '0')};

  display: ${(props) => (props.display ? props.display : 'flex')};
  align-items: center;
  vertical-align: middle;

  color: ${(props) => props.color || '#2d3a47'};

  background: ${(props) => props.bgColor || 'transparent'};
  border-radius: ${(props) => props.radius || '0'};
  transform: ${(props) => (props.turnAround ? 'scale(-1, 1)' : 'none')};
  z-index: 1;

  cursor: pointer;
  pointer-events: ${(props) => (props.throughEvent ? 'all' : 'auto')};
  opacity: ${(props) => props.opacity ?? 1};

  &:hover {
    color: ${(props) => props.colorHover || props.color || '#2d3a47'};
    background: ${(props) => props.bgColorHover || props.bgColor || 'transparent'};
  }

  > svg {
    width: ${(props) => (props.width ? `${props.width}px` : '16px')};
    height: ${(props) => (props.height ? `${props.height}px` : '16px')};

    vertical-align: top;

    pointer-events: none;
  }
`;
