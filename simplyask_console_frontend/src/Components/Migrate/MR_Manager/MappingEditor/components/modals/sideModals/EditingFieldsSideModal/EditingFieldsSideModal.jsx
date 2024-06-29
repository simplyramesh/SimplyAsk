import classnames from 'classnames';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';

import {
  getAllSourcesOrTargetsOrFieldsNames as getFields,
  getAllSourcesOrTargetsOrFieldsObjects as getObjects,
  getAllSourcesOrTargetsOrFieldsSystems as getSystems,
} from '../../../../../../../../Services/axios/migrate';
import { convertToLabelValue } from '../../../../functions/convertForSelect';
import useStateWithValidation from '../../../../hooks/useStateWithValidation';
import FieldDropdown from '../../../dropdowns/FieldDropdown/FieldDropdown';
import MappingEditorIcons from '../../../icons/MappingEditorIcons';
import css from './EditingFieldsSideModal.module.css';

const assistiveExplanation = (systemName) => {
  return `First, select a ${systemName} System, then a ${systemName} Object, then a ${systemName} Name. You must select all 3 in that order, then click confirm, to successfully complete the configuration`;
};

const EditingFieldsSideModal = ({ onClose, onEdit, field, isEditOpen, onConfirm }) => {
  const system = {
    label: field.field?.parentObject?.parentSystem.systemName || null,
    value: field.field?.parentObject?.parentSystem.systemId || null,
  };

  const object = {
    label: field.field?.parentObject.objectName || null,
    value: field.field?.parentObject.objectId || null,
  };

  const name = {
    label: field.field?.fieldName || null,
    value: field.field?.fieldId || null,
  };

  const [systemName, setSystemName, isSystemValid] = useStateWithValidation((s) => s?.value, system);
  const [objectName, setObjectName, isObjectValid] = useStateWithValidation((o) => o?.value, object);
  const [fieldName, setFieldName, isFieldValid] = useStateWithValidation((f) => f?.value, name);

  const { data: getAllSystems } = useQuery({
    queryKey: ['getFieldSystem', field?.headerName],
    queryFn: () => getSystems(field?.headerName?.toUpperCase()),
    enabled: isEditOpen && !!field.headerName,
  });

  const { data: getAllObjects } = useQuery({
    queryKey: ['getFieldObjects', systemName?.value, field?.headerName?.toUpperCase()],
    queryFn: () => getObjects(systemName?.value, field?.headerName?.toUpperCase()),
    enabled: !!systemName?.value,
  });

  const { data: getAllFields } = useQuery({
    queryKey: ['getFieldNames', objectName?.value, field?.headerName],
    queryFn: () => getFields(objectName?.value, field?.headerName?.toUpperCase()),
    enabled: !!objectName?.value,
  });

  const handleClose = () => {
    onEdit({});
    onClose(false);
  };

  const handleConfirm = () => {
    const updateField = {
      field: {
        fieldId: fieldName?.value,
        fieldName: fieldName?.label,
        parentObject: {
          objectId: objectName?.value,
          objectName: objectName?.label,
          parentSystem: {
            systemId: systemName?.value,
            systemName: systemName?.label,
            isSourceSystem: field?.headerName?.toUpperCase() === 'SOURCE',
          },
        },
      },
    };

    onConfirm(field.columnId, field.parentId, 'meta.field', { ...updateField.field });

    handleClose();
  };

  return (
    <>
      <header className={css.sideModal_header}>
        <span className={css.close_icon} onClick={handleClose}>
          <MappingEditorIcons icon="CLOSE" />
        </span>
        <button
          type="button"
          className={classnames({
            [css.confirm_btn]: true,
            [css['confirm_btn-disabled']]: !isSystemValid || !isObjectValid || !isFieldValid,
          })}
          disabled={!isSystemValid || !isObjectValid || !isFieldValid}
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </header>
      <div className={css.sideModal_content}>
        <h2 className={css.content_title}>Editing Fields</h2>
        <p className={css.content_subTitle}>{field.headerName}</p>
        <p className={css.content_body}>{assistiveExplanation(field.headerName)}</p>
        <div className={css.content_fields}>
          <ul className={css.fields_list}>
            <li className={css.list_item}>
              <span className={css.list_number}>{`${1}. `}</span>
              <span className={css.list_select}>
                <FieldDropdown
                  placeholder={`Select ${field.headerName} System`}
                  onSelectChange={setSystemName}
                  value={systemName}
                  options={convertToLabelValue(getAllSystems, 'systemName', 'systemId')}
                />
              </span>
            </li>
            <li className={css.list_item}>
              <span className={css.list_number}>{`${2}. `}</span>
              <span className={css.list_select}>
                <FieldDropdown
                  placeholder={`Select ${field.headerName} Object`}
                  onSelectChange={setObjectName}
                  value={objectName}
                  isDisabled={!isSystemValid}
                  options={convertToLabelValue(getAllObjects, 'objectName', 'objectId')}
                />
              </span>
            </li>
            <li className={css.list_item}>
              <span className={css.list_number}>{`${3}. `}</span>
              <span className={css.list_select}>
                <FieldDropdown
                  placeholder={`Select ${field.headerName} Name`}
                  onSelectChange={setFieldName}
                  value={fieldName}
                  isDisabled={!isObjectValid}
                  options={convertToLabelValue(getAllFields, 'fieldName', 'fieldId')}
                />
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default EditingFieldsSideModal;

EditingFieldsSideModal.propTypes = {
  onClose: PropTypes.func,
  headerName: PropTypes.string,
  onEdit: PropTypes.func,
  field: PropTypes.object,
  isEditOpen: PropTypes.bool,
  onConfirm: PropTypes.func,
};
