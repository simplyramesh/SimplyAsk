import { OBJECT_WILD_CARD_KEY } from '../../../../utils/helperFunctions';
import AgentGroupTableIcon from '../../../shared/REDISIGNED/icons/CustomTableIcons';
import classes from './AgentGroupsTab.module.css';

export const groupsUniqueId = 'id';

const getAgentGroupsHeaders = (editButtonHandler, deleteButtonHandler) => [
  {
    name: 'Group Name',
    source: 'name',
    bold: true,
    // TODO
    // icon: {
    //   source: "name",
    //   formatter: (val) => getIcon(val),
    // },
  },
  { name: 'Number of Users', source: 'numberOfUser', formatter: _getUsers },
  {
    name: 'Actions',
    source: OBJECT_WILD_CARD_KEY,
    alignCenter: true,
    formatter: (val) => (
      <div className={classes.actionsFlex}>
        <div className={classes.tableButton} onClick={() => editButtonHandler(val)}>
          <AgentGroupTableIcon icon="EDIT" width={32} />
        </div>

        <div className={classes.tableButton} onClick={() => deleteButtonHandler(val)}>
          <AgentGroupTableIcon icon="BIN" width={32} />
        </div>
      </div>
    ),
  },
];

export default getAgentGroupsHeaders;

const _getUsers = (users) => <div className={classes.numberColumn}>{users}</div>;
