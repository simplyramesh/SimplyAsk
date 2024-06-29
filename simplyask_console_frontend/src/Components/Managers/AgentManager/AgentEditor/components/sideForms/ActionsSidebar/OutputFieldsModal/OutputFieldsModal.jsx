import React, { useEffect, useState } from 'react';
import { AddNewRowButton, StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';
import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CenterModalFixed from '../../../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import TableV2 from '../../../../../../../shared/REDISIGNED/table-v2/Table-v2';
import { OUTPUT_FIELDS_COLUMNS } from '../../../../utils/formatters';
import AddRowIcon from '../../../../../../../../Assets/icons/agent/sidebar/addRow.svg?component';

const INITIAL_VALUE = [
  {
    processParamName: '',
    agentParamName: '',
  },
];

const OutputFieldsModal = ({ initialFields, open, onClose, onSave }) => {
  const [fields, setFields] = useState({ content: [] });
  const [sorting, setSorting] = useState([
    {
      desc: true,
    },
  ]);

  useEffect(() => {
    const content = initialFields.length ? initialFields : INITIAL_VALUE;

    setFields({ content });
  }, [initialFields]);

  const handleValueChange = (e, index, key) => {
    const { value } = e.target;

    const updatedFields = fields.content.map((field, i) => ({
      ...field,
      [key]: i === index ? value : field[key],
    }));

    setFields({ content: updatedFields });
  };

  const handleAddNewRow = () => {
    const newFields = [
      ...fields.content,
      {
        processParamName: '',
        agentParamName: '',
      },
    ];

    setFields({ content: newFields });
  };

  const handleRowDelete = (index) => {
    const newFields = fields.content.filter((field, i) => i !== index);

    setFields({ content: newFields });
  };

  return (
    <CenterModalFixed
      open={open}
      onClose={onClose}
      enableScrollbar={false}
      bodyPadding="0"
      maxWidth="1075"
      title={
        <StyledFlex p="20px 0 10px">
          <StyledFlex>Edit Process Output Fields</StyledFlex>
          <StyledText size={16} weight={400}>
            Configure the values for process execution. Lorem ipsum dolor sit amet, consectetur adipiscing edit, sed do.
          </StyledText>
        </StyledFlex>
      }
      actions={
        <StyledFlex mt="12px" direction="row" justifyContent="flex-end" width="100%" gap="20px">
          <StyledButton primary variant="contained" onClick={() => onSave(fields.content)}>
            Save
          </StyledButton>
        </StyledFlex>
      }
    >
      <StyledFlex p="10px 0 0">
        <TableV2
          emptyTableTitle="Process Output Fields"
          emptyTableDescription="There are no Process Output Fields"
          entityName="items"
          columns={OUTPUT_FIELDS_COLUMNS}
          meta={{
            onChange: handleValueChange,
            onDelete: handleRowDelete,
          }}
          data={fields}
          setSorting={setSorting}
          sorting={sorting}
          isLoading={false}
          headerActions={null}
          enableRowSelection={false}
          enableHeader={false}
          enableFooter={false}
          enableShowFiltersButton={false}
          footerTemplate={
            <StyledFlex alignItems="flex-end" mt="auto" p="22px 20px">
              <AddNewRowButton onClick={handleAddNewRow}>
                <AddRowIcon />
                <StyledText size={14} weight={600}>
                  New Row
                </StyledText>
              </AddNewRowButton>
            </StyledFlex>
          }
        />
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default OutputFieldsModal;
