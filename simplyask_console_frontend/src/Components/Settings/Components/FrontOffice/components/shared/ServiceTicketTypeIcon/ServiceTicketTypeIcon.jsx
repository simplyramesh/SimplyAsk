import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SellRoundedIcon from '@mui/icons-material/SellRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ShieldIcon from '@mui/icons-material/Shield';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import TextsmsRoundedIcon from '@mui/icons-material/TextsmsRounded';

import FalloutTicketIcon from '../../../../../../../Assets/icons/issues/types/FalloutTicketIcon.svg?component';
import DiamondIcon from '../../../../../../shared/REDISIGNED/icons/svgIcons/DiamondIcon';
import FlagIcon from '../../../../../../shared/REDISIGNED/icons/svgIcons/FlagIcon';
import InsertFileIcon from '../../../../../../shared/REDISIGNED/icons/svgIcons/InsertFileIcon';
import KeyIcon from '../../../../../../shared/REDISIGNED/icons/svgIcons/KeyIcon';
import LeafIcon from '../../../../../../shared/REDISIGNED/icons/svgIcons/LeafIcon';
import ReplyIcon from '../../../../../../shared/REDISIGNED/icons/svgIcons/ReplyIcon';
import TriangleIcon from '../../../../../../shared/REDISIGNED/icons/svgIcons/TriangleIcon';

const serviceTypeIcons = {
  SELL: SellRoundedIcon,
  TEXT: TextsmsRoundedIcon,
  INSERT: InsertFileIcon,
  MOON: DarkModeIcon,
  REPLY: ReplyIcon,
  TIME: AccessTimeFilledRoundedIcon,
  FLAG: FlagIcon,
  TRIANGLE: TriangleIcon,
  HOME: HomeRoundedIcon,
  EXPLORE: ExploreRoundedIcon,
  SETTINGS: SettingsRoundedIcon,
  SHIELD: ShieldIcon,
  STAR: StarRateRoundedIcon,
  CIRCLE: CircleRoundedIcon,
  LEAF: LeafIcon,
  DIAMOND: DiamondIcon,
  PERSON: PersonRoundedIcon,
  KEY: KeyIcon,
  FALLOUT: FalloutTicketIcon,
};

const ServiceTicketTypeIcon = ({ icon, ...props }) => {
  const Icon = serviceTypeIcons?.[icon] || serviceTypeIcons.SELL;

  return (
    <Icon {...props} />
  );
};

export default ServiceTicketTypeIcon;
