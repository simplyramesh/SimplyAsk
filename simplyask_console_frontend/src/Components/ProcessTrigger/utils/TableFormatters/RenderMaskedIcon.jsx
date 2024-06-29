import { renderRowHoverAction } from '../../../Issues/utills/formatters';
import CustomTableIcons from '../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledFlex } from '../../../shared/styles/styled';
const RenderMaskedIcon = ({ row, table }) => {
  const rowId = row.original?.uniqueIdFormEntryTable;
  const isTextMaskDisbaled = !!table.options.meta?.showMaskedTableRows?.[rowId];

  return (
    <StyledFlex position="relative">
      {renderRowHoverAction({
        icon: <CustomTableIcons icon={isTextMaskDisbaled ? 'VISIBLITY_OFF' : 'VISIBLITY'} width={27} />,
        onClick: (event) => table.options.meta?.onToggleProtectedEye(row.original, event),
        toolTipTitle: isTextMaskDisbaled ? 'Hide' : 'Show',
      })}
    </StyledFlex>
  );
};

export default RenderMaskedIcon;
