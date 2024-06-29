import InReach2Icon from '../../../icons/InReach2Icon';
import InReachExplorerIcon from '../../../icons/InReachExplorerIcon';
import MCG101Icon from '../../../icons/MCG101Icon';
import SpotGen4Icon from '../../../icons/SpotGen4Icon';
import SpotTraceIcon from '../../../icons/SpotTraceIcon';
import SpotXIcon from '../../../icons/SpotXIcon';
import SynchMobileIcon from '../../../icons/SynchMobileIcon';

export const getIconFromTitle = (title) => {
  switch (title) {
  case 'spotX':
    return <SpotXIcon fontSize="inherit" />;
  case 'spotTrace':
    return <SpotTraceIcon fontSize="inherit" />;
  case 'spotGen4':
    return <SpotGen4Icon fontSize="inherit" />;
  case 'inReachExplorer':
    return <InReachExplorerIcon fontSize="inherit" />;
  case 'inReach2':
    return <InReach2Icon fontSize="inherit" />;
  case 'mcg101':
    return <MCG101Icon fontSize="inherit" />;
  case 'synchMobile':
    return <SynchMobileIcon fontSize="inherit" />;
  default:
    return null;
  }
};

export const convertTitle = (title) => {
  if (!title || title?.includes('BYOD')) return title;

  const lowerTitle = title.toLowerCase().split(/\s+/);

  const mappings = {
    ...(!title?.includes('+') ? { noImage: ['basic', 'advanced', 'upgrade'] } : {}),
    spotX: ['spot x', 'spotx', 'spot x bluetooth', 'bluetooth'],
    spotTrace: ['spot trace', 'spottrace', 'trace'],
    spotGen4: ['spot gen4', 'spotgen4', 'gen4'],
    inReach2: ['inreach 2', 'in reach2', 'inreach2', 'in reach 2', '2'],
    inReachExplorer: ['inreach explorer', 'inreachexplorer', 'explorer+', 'explorer', 'in reach explorer', 'in reach', 'reach'],
    mcg101: ['mcg-101', 'mcg 101', 'mcg101', 'mcg101*', 'mcg-101*'],
    synchMobile: ['sync mobile', 'syncmobile', 'sync mobile*', 'app', 'sync', 'mobile', 'satellite'],
  };
  const matchedEntry = Object.entries(mappings).find(([, values]) => values.some((val) => lowerTitle.includes(val)));

  return matchedEntry ? matchedEntry[0] : title;
};
