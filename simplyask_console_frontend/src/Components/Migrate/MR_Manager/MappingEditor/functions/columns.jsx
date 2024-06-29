import moment from 'moment';

import { BG_COLORS, BORDER_SETTINGS } from '../constants/styles';

export const replaceAndCapitalize = (inputString, substringsToRemove = ['field', 'value'], replace = ' ') => {
  const modifiedString = substringsToRemove.reduce((str, substr) => str.replace(new RegExp(substr, 'gi'), replace), inputString);

  const alphaRegex = /[a-zA-Z]+/;
  const numRegex = /\d+/;
  const [alphaMatch, numMatch] = [modifiedString.match(alphaRegex), modifiedString.match(numRegex)];

  if (alphaMatch && numMatch) {
    alphaMatch[0] = alphaMatch[0].charAt(0).toUpperCase() + alphaMatch[0].slice(1);
    return `${alphaMatch[0]} ${numMatch[0]}`;
  }

  return inputString;
};

export const headerStyles = (cell) => {
  const { FAT, DEFAULT, DISABLED } = BORDER_SETTINGS;
  const {
    SOURCE, SOURCES, TARGETS, TARGET, HOVER_SOURCES, HOVER_TARGETS, DEFAULT: DEFAULT_BG, HOVER_DEFAULT, DISABLED_BG,
  } = BG_COLORS;

  const isSources = cell.toLowerCase()?.includes('sources');
  const isTargets = cell.toLowerCase()?.includes('targets');

  const isSource = cell?.includes('source') && !isSources;
  const isTarget = cell?.includes('target') && !isTargets;

  const isDefault = cell?.match(/^move$|^delete$/) !== null;
  const isPlaceholder = !isSources && !isTargets && !isSource && !isTarget && !isDefault;
  const isNoStyle = isPlaceholder || isDefault;

  const isFirstCell = cell?.includes('1');

  const targetBorderLeft = (isTarget && isFirstCell) || isTargets ? FAT : DEFAULT;

  const bottom = isSource || isTarget || isDefault ? FAT : (!isPlaceholder && DEFAULT) || 'none';
  const left = isSource ? DEFAULT : (!isNoStyle && targetBorderLeft) || 'none';

  const sourceBg = isSource ? SOURCE : SOURCES;
  const targetBg = isTarget ? TARGET : TARGETS;

  const sourceTargetBg = isSource || isSources ? sourceBg : targetBg;
  const sourceTargetHoverBg = isSource || isSources ? HOVER_SOURCES : HOVER_TARGETS;

  return {
    '--border-top': 'none',
    '--border-bottom': bottom,
    '--border-right': 'none',
    '--border-left': left,
    '--bgColor': isNoStyle ? DEFAULT_BG : sourceTargetBg,
    '--hover-bgColor': isNoStyle ? HOVER_DEFAULT : sourceTargetHoverBg,
    '--disabled-bgColor': DISABLED_BG,
    '--disabled-border-left': (isTarget && isFirstCell) || isTargets ? FAT : DISABLED,
  };
};

export const columnHeaderSchema = (key, rule, isNew = false) => {
  const isSourceTarget = key
    .toLowerCase()
    .match(/source|target/) != null;

  if (isSourceTarget && rule[key] == null && !isNew) return null;

  return {
    header: replaceAndCapitalize(key),
    accessorFn: (info) => info[key]?.value,
    id: key,
    minSize: 95,
    meta: {
      priority: rule?.priority || 0,
      field: {
        fieldId: rule[key]?.field?.fieldId || null,
        fieldType: rule[key]?.field?.fieldType || null,
        fieldName: rule[key]?.field?.fieldName || null,
        parentObject: {
          objectId: rule[key]?.field?.parentObject?.objectId || null,
          objectName: rule[key]?.field?.parentObject?.objectName || null,
          parentSystem: {
            systemId: rule[key]?.field?.parentObject?.parentSystem?.systemId || null,
            systemName: rule[key]?.field?.parentObject?.parentSystem?.systemName || null,
            isSourceSystem: rule[key]?.field?.parentObject?.parentSystem?.isSourceSystem || null,
          },
        },
      },
      dates: {
        created: rule?.created || moment().toISOString().slice(0, 19),
        updated: rule?.modified || moment().toISOString().slice(0, 19),
      },
    },
  };
};

export const createColumnHeaders = (data) => {
  const rows = [];

  data?.forEach((rule) => {
    if (!rule) return;

    Object.keys(rule).forEach((key) => {
      const isKeyInRows = rows.some((row) => row?.id === key);
      if (isKeyInRows) return;

      rows.push(columnHeaderSchema(key, rule));
    });
  });

  return rows.filter(Boolean);
};
