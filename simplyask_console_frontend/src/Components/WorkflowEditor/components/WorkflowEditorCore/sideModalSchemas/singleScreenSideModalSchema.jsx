import serviceTicketSideModalIcon from '../../../Assets/Icons/serviceTicketSideModalIcon.svg?component';
import serviceTicketUpdateSideModalIcon from '../../../Assets/Icons/serviceTicketUpdateSideModalIcon.svg?component';

const pureStepComponentData = [
  {
    title: 'Create Service Ticket',
    body: 'Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum Loruj',
    Icon: serviceTicketSideModalIcon,
  },
  {
    title: 'Update Service Ticket Status',
    body: 'Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum Loruj',
    Icon: serviceTicketUpdateSideModalIcon,
  },
];

const tabsSingleScreenDataSchema = [
  {
    title: 'Step Library',
    // If isListView === false, it's mandatory to pass a react component or pureStepComponentData
    isListView: false,
    // Either pass pureStepComponentData or component
    pureStepComponentData,
    // component: SingleScreenSideModalFirstScreen,
  },
  {
    title: 'Settings',
    isListView: true,
    // If isListView === true, it's mandatory to pass a listViewData
    listViewData: [],
  },
];

export default tabsSingleScreenDataSchema;
