import ProcessTriggerSuccessCheckIcon from '../../../../../../../../Assets/icons/processTriggerCheckIcon.svg?component';
import ProcessTriggerDeleteIcon from '../../../../../../../../Assets/icons/processTriggerDeleteIcon.svg?component';
import { StyledTooltip } from '../../../../../../../Settings/Components/FrontOffice/components/ChatWidget/ChatWidgetCreateOrEdit/ChatWidgetPreview/ChatWidgetView/components/shared/styles/styled';
import { StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';
import {
  StyledFilePreviewContainer,
  StyledLoadingPreviewLine,
  StyledPreviewTable,
  StyledScrollbars,
  StyledTableCell,
  StyledTableHeader,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../StyledProcessTriggerExecuteProcess';

const SuccessFileUploadView = ({
  colors,
  uploadFileState,
  onFileRemovalClick,
  uploadedFileResponse,
  editModeData,
}) => {
  const generateTableHeaders = (data, index) => (
    <StyledTableRow key={index}>
      {data?.map((item) => (
        <StyledTableHeaderCell key={index}>{item}</StyledTableHeaderCell>
      ))}
    </StyledTableRow>
  );

  const generateTableRows = (data, index) => {
    const isOddElement = index % 2 !== 0;

    return (
      <StyledTableRow key={index}>
        {data?.map((item, i) => (
          <StyledTableCell key={i} className={isOddElement ? 'bulk_table_row_odd' : 'bulk_table_row_even'}>
            {item}
          </StyledTableCell>
        ))}
      </StyledTableRow>
    );
  };

  const renderFilePreviewHeader = (item, index = 0) => (
    <StyledFlex key={index}>
      <StyledFlex alignItems="end">
        <StyledTooltip title="Delete" arrow placement="top" p="10px 15px" maxWidth="auto">

          <StyledFlex
            display="flex"
            alignItems="center"
            cursor="pointer"
            justifyContent="center"
            width="44px"
            height="44px"
            backgroundColor={colors.palePeach}
            borderRadius="50%"
            m="10px"
          >
            <ProcessTriggerDeleteIcon width="22px" height="24px" onClick={onFileRemovalClick} />
          </StyledFlex>
        </StyledTooltip>

      </StyledFlex>

      <StyledFlex alignItems="center" flexDirection="column">
        <ProcessTriggerSuccessCheckIcon width="47px" height="46px" />
        <StyledText mt={8} weight={500} size={16}>
          {editModeData ? editModeData?.filename : item?.name}
        </StyledText>
      </StyledFlex>
    </StyledFlex>
  );

  return (
    <StyledFlex
      flexDirection="column"
      width="100%"
      height="516px"
      border={`3px dotted ${colors.statusResolved}`}
      borderRadius="15px"
    >
      {uploadFileState?.length > 0
        ? uploadFileState?.map((item, index) => renderFilePreviewHeader(item, index))
        : renderFilePreviewHeader()}
      <StyledFlex justifyContent="center" alignItems="center">
        <StyledFilePreviewContainer isLoading={!uploadedFileResponse}>
          {!uploadedFileResponse ? (
            <StyledLoadingPreviewLine>Preview of data from uploaded files here...</StyledLoadingPreviewLine>
          ) : (
            <StyledScrollbars className="bulk_contentHeightModal">
              <StyledPreviewTable id="renderUploadedFile">
                <StyledTableHeader className="bulk_preview_table_thead">
                  {uploadedFileResponse?.map((row, index) => {
                    if (index < 1) {
                      return generateTableHeaders(row, index);
                    }
                    return generateTableRows(row, index);
                  })}
                </StyledTableHeader>
              </StyledPreviewTable>
            </StyledScrollbars>
          )}
        </StyledFilePreviewContainer>
      </StyledFlex>
    </StyledFlex>
  );
};

export default SuccessFileUploadView;
