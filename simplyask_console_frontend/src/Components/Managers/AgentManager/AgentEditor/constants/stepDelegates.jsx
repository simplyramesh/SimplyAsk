
import ActionIcon from '../../../../../Assets/icons/agent/steps/action.svg?component';
import ActionErrorIcon from '../../../../../Assets/icons/agent/steps/arrowRtl.svg?component';
import InquiryIcon from '../../../../../Assets/icons/agent/steps/inquiry.svg?component';
import ParameterIcon from '../../../../../Assets/icons/agent/steps/parameter.svg?component';
import QuickRepliesIcon from '../../../../../Assets/icons/agent/steps/quickReplies.svg?component';
import SpeakIcon from '../../../../../Assets/icons/agent/steps/speak.svg?component';
import SwitchIcon from '../../../../../Assets/icons/agent/steps/switch.svg?component';
import TransferIcon from '../../../../../Assets/icons/agent/steps/transfer.svg?component';
import TransitionIcon from '../../../../../Assets/icons/agent/steps/transition.svg?component';
import PersonIconRed from '../../../../shared/REDISIGNED/icons/svgIcons/PersonIconRed';

import { STEP_ITEM_TYPES, SWITCH_TYPES, SWITCH_INPUT_KEYS } from './steps';

export const STEP_ITEM_ICONS = {
  [STEP_ITEM_TYPES.PARAMETER]: ParameterIcon,
  [STEP_ITEM_TYPES.SPEAK]: SpeakIcon,
  [STEP_ITEM_TYPES.QUICK_REPLIES]: QuickRepliesIcon,
  [STEP_ITEM_TYPES.ACTION]: ActionIcon,
  [STEP_ITEM_TYPES.ACTION_ERROR]: ActionErrorIcon,
  [STEP_ITEM_TYPES.INQUIRY]: InquiryIcon,
  [STEP_ITEM_TYPES.TRANSITION]: TransitionIcon,
  [STEP_ITEM_TYPES.SWITCH]: SwitchIcon,
};

export const stepDelegates = [
  {
    type: STEP_ITEM_TYPES.PARAMETER,
    name: 'Parameter',
    Icon: STEP_ITEM_ICONS[STEP_ITEM_TYPES.PARAMETER],
    multi: true,
    addable: true,
    visibleInSidebar: true,
  },
  {
    type: STEP_ITEM_TYPES.SPEAK,
    name: 'Speak',
    Icon: STEP_ITEM_ICONS[STEP_ITEM_TYPES.SPEAK],
    multi: true,
    addable: true,
    visibleInSidebar: true,
  },
  {
    type: STEP_ITEM_TYPES.QUICK_REPLIES,
    name: 'Quick Replies',
    Icon: STEP_ITEM_ICONS[STEP_ITEM_TYPES.QUICK_REPLIES],
    multi: true,
    addable: false,
    visibleInSidebar: false,
  },
  {
    type: STEP_ITEM_TYPES.ACTION,
    name: 'Action',
    Icon: STEP_ITEM_ICONS[STEP_ITEM_TYPES.ACTION],
    multi: true,
    addable: true,
    visibleInSidebar: true,
  },
  {
    type: STEP_ITEM_TYPES.ACTION_ERROR,
    name: 'Action Error',
    Icon: STEP_ITEM_ICONS[STEP_ITEM_TYPES.ACTION_ERROR],
    multi: true,
    addable: false,
    visibleInSidebar: false,
  },
  {
    type: STEP_ITEM_TYPES.INQUIRY,
    name: 'Inquiry',
    Icon: STEP_ITEM_ICONS[STEP_ITEM_TYPES.INQUIRY],
    multi: true,
    addable: true,
    visibleInSidebar: true,
  },
  {
    type: STEP_ITEM_TYPES.TRANSITION,
    name: 'Transition',
    Icon: STEP_ITEM_ICONS[STEP_ITEM_TYPES.TRANSITION],
    multi: true,
    addable: true,
    visibleInSidebar: true,
  },
  {
    type: STEP_ITEM_TYPES.SWITCH,
    name: 'Switch',
    Icon: STEP_ITEM_ICONS[STEP_ITEM_TYPES.SWITCH],
    visibleInSidebar: true,
    children: [
      {
        type: STEP_ITEM_TYPES.SWITCH,
        name: 'Transfer to Human',
        Icon: PersonIconRed,
        multi: false,
        [SWITCH_INPUT_KEYS.SWITCH_TYPE]: SWITCH_TYPES.HUMAN,
        visibleInSidebar: true,
      },
      {
        type: STEP_ITEM_TYPES.SWITCH,
        name: 'Change agent',
        Icon: TransferIcon,
        multi: false,
        [SWITCH_INPUT_KEYS.SWITCH_TYPE]: SWITCH_TYPES.AGENT,
        visibleInSidebar: true,
      },
    ],
  },
];

export const PROMPT_SYMPLY_INPUT_EXPANDED_TYPES = {
  PROMPT: "PROMPT",
  CONTEXT: "CONTEXT",
  GUIDANCE: "GUIDANCE",
}

