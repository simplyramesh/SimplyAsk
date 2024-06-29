import { AddRounded } from '@mui/icons-material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

import { rowDragHandleProps } from '../../../../../../Issues/utills/formatters';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomSidebar from '../../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import TableV2 from '../../../../../../shared/REDISIGNED/table-v2/Table-v2';
import { HEADER_ACTIONS_POSITION } from '../../../../../../shared/REDISIGNED/table-v2/TableHeader/TableHeader';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { STATUSES_COLORS_OPTIONS } from '../../../constants/iconConstants';
import { TICKET_TYPE_STATUSES_COLUMNS } from '../../../utils/formatters';

import ServiceTicketTypeStatusPanel from './ServiceTicketTypeStatusPanel/ServiceTicketTypeStatusPanel';

const ServiceTicketTypeStatuses = ({
  values, onAdd, onEdit, onReorder, onDelete, typeIssues, setOpenStatusPanel, openStatusPanel,
}) => {
  const colorsKeys = Object.keys(STATUSES_COLORS_OPTIONS);
  const INITIAL_FORM_VALUE = {
    name: '',
    colour: colorsKeys[0],
  };

  const [editStatus, setEditStatus] = useState(null);
  const [data, setData] = useState({ content: values });

  const form = useFormik({
    enableReinitialize: true,
    initialTouched: false,
    initialValues: INITIAL_FORM_VALUE,
    validationSchema: Yup.object().shape({
      name: Yup.string().nullable().required('A name for your status is required'),
    }),
    onSubmit: (e, meta) => {
      if (editStatus) {
        onEdit(editStatus, editStatus.orderNumber, e);
      } else {
        onAdd(e);
      }

      setOpenStatusPanel(false);
      setEditStatus(null);
      meta.resetForm(INITIAL_FORM_VALUE);
    },
  });

  const { handleSubmit, setValues, resetForm } = form;

  const HeaderActions = () => (
    <StyledFlex direction="row" gap={2}>
      { false && <StyledButton variant="contained" tertiary>Edit Behaviours</StyledButton>}
      <StyledButton
        variant="contained"
        startIcon={<AddRounded />}
        tertiary
        onClick={() => setOpenStatusPanel(true)}
      >
        Add Status
      </StyledButton>
    </StyledFlex>
  );

  useEffect(() => {
    if (editStatus) {
      setValues({
        name: editStatus.name,
        colour: editStatus.colour,
      });
    }
  }, [editStatus]);

  useEffect(() => {
    setData((prev) => ({ ...prev, content: [...values] }));
  }, [values]);

  return (
    <>
      <TableV2
        title="Statuses"
        titleDescription="Manage the statues for this ticket type, including the workflow order, and their default behaviours"
        data={data}
        columns={TICKET_TYPE_STATUSES_COLUMNS}
        isEmbedded
        enableSearch={false}
        enableFooter={false}
        enableShowFiltersButton={false}
        enableRowSelection={false}
        headerActions={<HeaderActions />}
        headerActionsPosition={HEADER_ACTIONS_POSITION.TITLE_BAR}
        tableProps={{
          muiTableBodyRowDragHandleProps: ({ table }) => ({
            onDragEnd: () => {
              const { draggingRow, hoveredRow } = table.getState();
              if (hoveredRow && draggingRow) {
                data.content.splice(
                  hoveredRow.index,
                  0,
                  data.content.splice(draggingRow.index, 1)[0],
                );

                onReorder([...data.content]);
              }
            },
          }),
          ...rowDragHandleProps,
        }}
        meta={{
          onStatusChangeClick: (status) => {
            setEditStatus(status);
            setOpenStatusPanel(true);
          },
          onStatusDelete: (status) => onDelete(status),
          issues: typeIssues,
        }}
        pinRowHoverActionColumns={['delete']}
      />

      <CustomSidebar
        open={openStatusPanel}
        onClose={() => {
          setOpenStatusPanel(false);
          setEditStatus(null);
          resetForm(INITIAL_FORM_VALUE);
        }}
        headStyleType="filter"
        width={456}
        headerTemplate={(
          <StyledFlex>
            <StyledText size={19} weight={600} lh={29}>
              {editStatus ? 'Edit Status' : 'Add Status'}
            </StyledText>
          </StyledFlex>
        )}
        customHeaderActionTemplate={(<StyledButton variant="contained" primary onClick={handleSubmit}>{editStatus ? 'Save' : 'Create'}</StyledButton>)}
        sx={{ zIndex: 5002 }}
      >
        {() => <ServiceTicketTypeStatusPanel form={form} />}
      </CustomSidebar>
    </>
  );
};

export default ServiceTicketTypeStatuses;
