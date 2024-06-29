import styled from '@emotion/styled';


const MySummaryBottomBg = new URL('../../Assets/images/MySummaryBottomBg.svg', import.meta.url).href;
const MySummaryTopBgImg = new URL('../../Assets/images/MySummaryTopBg.svg?component', import.meta.url).href;

export const StyledMySummaryContent = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 1828px;
  height: 100%;

  &:before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    right: 0;
    padding-top: 35%;
    background-image: url(${MySummaryTopBgImg});
    background-position: top;
    background-repeat: no-repeat;
    background-size: contain;
    z-index: -1;
  }


    &:after {
      position: fixed;
      content: '';
      bottom: 0;
      left: 0;
      right: 0;
      height: 322px;
      background-image: url(${MySummaryBottomBg});
      background-position: bottom;
      background-repeat: no-repeat;
      background-size: cover;
      z-index: -2;
  }

  @media (max-width: 2048px) {
    &:before {
      background-size: 2048px;
    }

`;
