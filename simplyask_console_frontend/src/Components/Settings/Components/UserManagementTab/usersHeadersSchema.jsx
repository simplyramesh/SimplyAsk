import { _reformatRoles, DEFAULT_RETURN_VALUE, OBJECT_WILD_CARD_KEY } from '../../../../utils/helperFunctions';
import UserManagementTableIcon from '../../../shared/REDISIGNED/icons/CustomTableIcons';
import UserAvatar from '../../../UserAvatar';
import classes from './UserManagementTab.module.css';

export const usersUniqueId = 'id';

// const nameAddArr = [];

// const fetchAPI = async (groupIds) => {
//   try {
//     return await getGroupsById(groupIds).then((response) => {
//       return response;
//     });
//   } catch (err) {
//     console.log(err);
//     return '';
//   }
// };

// const getGroupNames = (groupIds) => {
//   fetchAPI(groupIds).then((data) => {
//     nameAddArr = [];
//     for (let i = 0; i < data.data.length; i++) {
//       if (!nameAddArr.includes(data.data[i].name)) {
//         nameAddArr.push(data.data[i].name);
//       }
//     }
//     return nameAddArr;
//   });
// };

const getUsersHeaders = (editButtonHandler) => [
  {
    name: 'Users',
    source: OBJECT_WILD_CARD_KEY,
    formatter: ({ firstName, lastName, pfp }) => (
      <UserAvatar imgSrc={pfp} customUser={{ firstName, lastName }} size="50" />
    ),
  },
  {
    name: '',
    source: ['firstName', 'lastName'],
    bold: true,
  },
  {
    name: 'Account Type',
    source: 'permissionsList',
    formatter: (val) => {
      if (val.length === 0) return DEFAULT_RETURN_VALUE;
      return (
        <div className={classes.roleContainer}>
          {val?.map((item, index) => (
            <span key={index}>{_reformatRoles(item?.role)}</span>
          ))}
        </div>
      );
    },
  },
  // {
  //   name: "User Groups",
  //   source: "agentGroupIdList",
  //   formatter: (val) => {
  //     if (val.length === 0 || !val || val === "---") return DEFAULT_RETURN_VALUE;
  //     getGroupNames(val);
  //     if (nameAddArr) {
  //       return (
  //         <div className={classes.roleContainer}>
  //           {nameAddArr.map((group, i) => (
  //             <span key={i}>{group}</span>
  //           ))}
  //         </div>
  //       );
  //     }
  //   },
  // },

  {
    name: 'Actions',
    source: OBJECT_WILD_CARD_KEY,
    formatter: (val) => (
      <div className={classes.buttons}>
        <div className={classes.tableButton} onClick={() => deleteButtonHandler(val)}>
          {val?.isLocked && <UserManagementTableIcon icon="DEACTIVATED" width={32} />}
        </div>
        <div className={classes.editButton} onClick={() => editButtonHandler(val)}>
          <UserManagementTableIcon icon="EDIT" width={32} />
        </div>
      </div>
    ),
  },
];

export default getUsersHeaders;
