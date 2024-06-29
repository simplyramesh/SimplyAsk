import { CallOutlined, Close, Done, MailOutline, RoomOutlined } from '@mui/icons-material';

import CopyIcon from '../../Assets/icons/copy.svg?component';
import { StyledFlex } from '../shared/styles/styled';

export const getConvDropdownItems = (conv) => [
  {
    title: conv.email,
    Icon: MailOutline,
    iconType: 'mui',
  },
  {
    title: 'Phone number',
    Icon: CallOutlined,
    iconType: 'mui',
  },
  {
    title: 'Service Name',
    Icon: CopyIcon,
  },
  {
    title: 'Address',
    Icon: RoomOutlined,
    iconType: 'mui',
  },
];

export const getCloseSessionDropdownItems = (onCloseSession, closeDropdown) => [
  {
    component: <StyledFlex>Are you sure you want to mark this conversation as complete?</StyledFlex>,
  },
  {
    title: 'Yes',
    Icon: Done,
    iconType: 'mui',
    onClick: onCloseSession,
  },
  {
    title: 'No',
    Icon: Close,
    iconType: 'mui',
    onClick: closeDropdown,
  },
];
