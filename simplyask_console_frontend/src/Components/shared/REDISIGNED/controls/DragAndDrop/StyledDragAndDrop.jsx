import styled from '@emotion/styled';

export const StyledLinkLabel = styled.label`
    color: ${({ theme }) => (theme.colors.linkColor)};
    font-weight: 600;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

export const StyledDummyInput = styled.input``;
