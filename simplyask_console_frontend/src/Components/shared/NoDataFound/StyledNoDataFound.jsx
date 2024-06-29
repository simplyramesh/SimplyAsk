import styled from '@emotion/styled';

export const StyledNoDataRoot = styled('div', {
  shouldForwardProp: (prop) => !['minHeight', 'wrapperPadding'].includes(prop),
})`
  padding: ${({ wrapperPadding }) => wrapperPadding || '0'};
  min-height: ${({ minHeight }) => minHeight || 'auto'};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  animation: fadeIn ease-in 1;
  animation-fill-mode: forwards;
  animation-duration: 1s;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;

export const StyledNoDataFoundParent = styled.div`
  width: 100%;
  max-height: 650px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledNoDataFoundChild = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  width: 100%;
`;

export const StyledNoDataFoundImageParent = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const StyledNoDataFoundImage = styled('img', {
  shouldForwardProp: (prop) => !['width', 'height'].includes(prop),
})`
  width: ${({ width }) => width || '90px'};
  height: ${({ height, width }) => height || width || '90px'};
`;

export const StyledNoDataFoundTextParent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const StyledNoDataFoundText = styled('div', {
  shouldForwardProp: (prop) => !['fontSize', 'lineHeight', 'fontWeight'].includes(prop),
})`
  margin-top: 5px;
  font-size: ${({ fontSize }) => fontSize || '18px'};
  line-height: ${({ lineHeight }) => lineHeight || 'inherit'};
  font-weight: ${({ fontWeight }) => fontWeight || '600'};
  font-family: 'Montserrat', sans-serif;
  color: rgba(45, 58, 71, 1);
`;

export const StyledNoDataFoundTextCaption = styled('div', {
  shouldForwardProp: (prop) => !['fontSize', 'lineHeight', 'fontWeight', 'bodyWeight'].includes(prop),
})`
  margin-top: 10px;
  width: ${({ bodyWeight }) => bodyWeight || '400px'};
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-size: ${({ fontSize }) => fontSize || '15px'};
  line-height: ${({ lineHeight }) => lineHeight || '150%'};
  font-weight: ${({ fontWeight }) => fontWeight || '400'};
  color: rgba(45, 58, 71, 1);
`;

export const StyledNoDataLink = styled.span`
  display: flex;
  justify-content: center;
`;
