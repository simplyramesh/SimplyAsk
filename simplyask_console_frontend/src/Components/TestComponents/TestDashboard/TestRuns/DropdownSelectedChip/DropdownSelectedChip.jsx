import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledFlex } from '../../../../shared/styles/styled';

const DropdownSelectedChip = ({ selectedArray, children, onRemove }) => {
  const { colors, borders: { chip } } = useTheme();

  return (
    <>
      {selectedArray.length > 0 && (
        <StyledFlex direction="row" mt="12px" gap="10px" flexWrap="wrap">
          {selectedArray.map((item, index) => (
            <StyledFlex key={index} direction="row" p="8px" gap="0 10px" backgroundColor={colors.chipBg} border={chip.default}>
              {children({ item, index })}
              <CustomTableIcons
                icon="CLOSE"
                width={16}
                color={`${colors.black}45`}
                onClick={() => {
                  const newArray = [...selectedArray];
                  newArray.splice(index, 1);

                  onRemove(newArray, index);
                }}
              />
            </StyledFlex>
          ))}
        </StyledFlex>
      )}
    </>
  );
};

export default DropdownSelectedChip;

DropdownSelectedChip.propTypes = {
  selectedArray: PropTypes.array,
  children: PropTypes.func,
  onRemove: PropTypes.func,
};
