import { useTheme } from '@emotion/react';

import Spinner from '../../../shared/Spinner/Spinner';
import { StyledFlex } from '../../../shared/styles/styled';

import {
  StyledTr, StyledTh, StyledTableRoot, StyledPaddedScrollbar,
  StyledTableHead, StyledTdEven, StyledTdOdd, StyledTableBody,
} from './StyledProcessDataVisualizerTable';

const ProcessDataVisualizerTable = ({ processVisualizerTableData = [], isLoading = false }) => {
  const { colors } = useTheme();
  const classes = {};

  const generateTableHeaders = () => (
    <StyledTr>
      {processVisualizerTableData?.headers?.map((item, index) => (
        <StyledTh
          key={index}
          className={classes.bulk_table_header}
        >
          {item}
        </StyledTh>
      ))}
    </StyledTr>
  );

  const generateTableRows = () => (
    processVisualizerTableData?.bodyData?.map((data, index) => {
      const isOddElement = index % 2 !== 0;

      return (
        <StyledTr key={index}>
          {data?.map((item, i) => (
            isOddElement ? (
              <StyledTdOdd key={i}>
                {item}
              </StyledTdOdd>
            )
              : (
                <StyledTdEven key={i}>
                  {item}
                </StyledTdEven>
              )
          ))}
        </StyledTr>
      );
    })
  );

  return (
    <StyledFlex
      padding="20px 36px 40px 36px"
      height="100%"
    >
      <StyledFlex
        height="100%"
        backgroundColor={colors.white}
        position="relative"
      >
        {isLoading && <Spinner inline fadeBgParent />}

        <StyledPaddedScrollbar>
          <StyledTableRoot>
            <StyledTableHead>
              {generateTableHeaders()}
            </StyledTableHead>
            <StyledTableBody>
              {generateTableRows()}
            </StyledTableBody>
          </StyledTableRoot>
        </StyledPaddedScrollbar>
      </StyledFlex>
    </StyledFlex>
  );
};

export default ProcessDataVisualizerTable;
