import PropTypes from 'prop-types';

import RadioInput from '../../../inputs/radio/RadioInput';
// import { ACCESS_LEVEL } from '../PermissionSettingsScheme';
import classes from './PermissionStateTable.module.css';

const PermissionStateTableRow = ({
  item, onRadioRuleChange, isDisabled, enabledIds, disabledIds,
}) => {
  return (
    <tr className={item?.description ? classes.hasDescription : null}>
      <td>
        {item?.permissionFeatureName}
        {item?.description && <p className={classes.item__description}>{item.description}</p>}
      </td>
      <td>
        <RadioInput
          id="enabledFeatureIds"
          name={item.permissionFeatureName}
          disabled={isDisabled}
          checked={enabledIds?.includes(item?.id)}
          onChange={(e) => onRadioRuleChange(item.id, e.target.id)}
          withButton
        />
      </td>
      <td>
        <RadioInput
          id="disabledFeatureIds"
          name={item.permissionFeatureName}
          disabled={isDisabled}
          checked={disabledIds?.includes(item?.id)}
          onChange={(e) => onRadioRuleChange(item.id, e.target.id)}
          withButton
        />
      </td>
    </tr>
  );
};

PermissionStateTableRow.propTypes = {
  item: PropTypes.object,
  isDisabled: PropTypes.bool,
  onRadioRuleChange: PropTypes.func,
  enabledIds: PropTypes.arrayOf(PropTypes.number),
  disabledIds: PropTypes.arrayOf(PropTypes.number),
};

const PermissionStateTable = ({
  title, data, onRadioValueChange, isDisabled, enabledIds, disabledIds,
}) => {
  if (!data) return null;

  return (
    <table className={classes.StateTable}>
      <thead>
        <tr>
          <th>{title}</th>
          <th>Enable</th>
          <th>Disable</th>
        </tr>
      </thead>
      <tbody>
        {!!data && data.map((item) => (
          <PermissionStateTableRow
            key={item?.id}
            item={item}
            onRadioRuleChange={onRadioValueChange}
            isDisabled={isDisabled}
            enabledIds={enabledIds}
            disabledIds={disabledIds}
          />
        ))}
      </tbody>
    </table>
  );
};

export default PermissionStateTable;

PermissionStateTable.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
  isDisabled: PropTypes.bool,
  onRadioValueChange: PropTypes.func,
  enabledIds: PropTypes.arrayOf(PropTypes.number),
  disabledIds: PropTypes.arrayOf(PropTypes.number),
};
