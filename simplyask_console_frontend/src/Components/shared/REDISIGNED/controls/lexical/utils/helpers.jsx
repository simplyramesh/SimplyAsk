import { removeProperty } from '../../../utils/helpers';
import { PARAM_SOURCES } from "../../../../../WorkflowEditor/constants/layout";

export const BUILDER_ID = 'expression-builder-id';

const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = `\\b[A-Z][^\\s${PUNCTUATION}]`;
const TRIGGERS = ['@', '~'].join('');
const VALID_CHARS = `[^${TRIGGERS}${PUNCTUATION}\\s]`;
const LENGTH_LIMIT = 75;
const ALIAS_LENGTH_LIMIT = 50;

const CapitalizedNameParamsRegex = new RegExp(`(^|[^#])((?:${NAME}{${1},})$)`);

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS =
  `${
    '(?:' +
    '\\.[ |$]|' + // E.g. "r. " in "Mr. Smith"
    ' |' + // E.g. " " in "Josh Duck"
    '['
  }${PUNCTUATION}]|` + // E.g. "-' in "Salier-Hellendag"
  ')';

const AtSignParamsRegex = new RegExp(
  `${'(^|\\s|\\()(' + '['}${TRIGGERS}]` + `((?:${VALID_CHARS}${VALID_JOINS}){0,${LENGTH_LIMIT}})` + ')$'
);

// Regex used to match alias.
const AtSignParamsRegexAliasRegex = new RegExp(
  `${'(^|\\s|\\()(' + '['}${TRIGGERS}]` + `((?:${VALID_CHARS}){0,${ALIAS_LENGTH_LIMIT}})` + ')$'
);

function checkForCapitalizedNameParams(text, minMatchLength) {
  const match = CapitalizedNameParamsRegex.exec(text);
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[2];
    if (matchingString != null && matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: matchingString,
      };
    }
  }
  return null;
}

export const checkForAtSignParams = (text, minMatchLength) => {
  let match = AtSignParamsRegex.exec(text);

  if (match === null) {
    match = AtSignParamsRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
};

export const getPossibleQueryMatch = (text) => {
  const match = checkForAtSignParams(text, 0);
  return match === null ? checkForCapitalizedNameParams(text, 3) : match;
};

export const getStringifiedEditorState = (value) => {
  try {
    const children = JSON.parse(value || null)?.root?.children[0].children;

    return children?.reduce((acc, el) => {
      acc += el.text || '';
      return acc;
    }, '');
  } catch {
    return value;
  }
};

export const updateModelNodes = (model, updateFn) => ({
  ...model,
  root: {
    ...model.root,
    children: [
      {
        ...model.root.children[0],
        children: model.root.children[0].children.map(updateFn),
      },
    ],
  },
});

export const updateModelParamNodeValue = (node, value) => ({
  ...node,
  paramName: value,
  text: value,
});

export const convertModelParamNodeToTextNode = (node, value) => {
  const textNodeModel = removeProperty('paramName')(node);

  const updatedNode = {
    ...textNodeModel,
    text: value ?? node.text,
    mode: 'normal',
    type: 'text',
  };

  return updatedNode;
};


export const getFrom = (source, stepId, stepName) => {
  if (source === PARAM_SOURCES.STEP_PARAMS) {
    return `From ${stepName} (ID ${stepId})`;
  }

  if (source === PARAM_SOURCES.MULTIPLE_STEPS) {
    return 'From Multiple Places';
  }

  if (source === PARAM_SOURCES.MULTIPLE_PLACES) {
    return `From ${stepName} (Multiple Places)`;
  }

  if (source === PARAM_SOURCES.INPUT_PARAMS) {
    return 'From Input Parameters';
  }

  if (source === PARAM_SOURCES.DEFAULT_PARAMS) {
    return 'From Default Parameters';
  }

  if (source === PARAM_SOURCES.ENV_PARAMS) {
    return 'From Parameters Set';
  }


  return 'Multiple Places';
};
