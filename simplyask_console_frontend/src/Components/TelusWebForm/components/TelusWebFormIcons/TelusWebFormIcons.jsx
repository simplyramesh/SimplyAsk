import TelusLogo from './icons/telus_logo.svg?component';
import TelusTaglineLogoEn from './icons/telus_tagline_en.svg?component';
import TelusTaglineLogoFr from './icons/telus_tagline_fr.svg?component';

const icons = {
  logo: TelusLogo,
  en: TelusTaglineLogoEn,
  fr: TelusTaglineLogoFr,
};

const TelusWebFormIcons = ({ icon, ...props }) => {
  const Icon = icons[icon] || icons.logo;

  return <Icon {...props} />;
};

export default TelusWebFormIcons;
