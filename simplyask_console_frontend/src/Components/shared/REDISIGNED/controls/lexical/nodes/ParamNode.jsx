import { TextNode } from 'lexical';

import { expressionBuilderParam } from '../StyledExpressionBuilder';

const PARAM_NODE_TYPE = 'param';

export const $createParamNode = (paramName) => {
  const paramNode = new ParamNode(paramName);

  paramNode.setMode('segmented').toggleDirectionless();

  return paramNode;
};

const convertParamElement = (domNode) => {
  const textContent = domNode.textContent;

  if (textContent !== null) {
    const node = $createParamNode(textContent);
    return {
      node,
    };
  }

  return null;
};

export class ParamNode extends TextNode {
  __paramName;

  constructor(paramName, text, key) {
    super(text ?? paramName, key);
    this.__paramName = paramName;
  }

  static getType() {
    return PARAM_NODE_TYPE;
  }

  static clone(node) {
    return new ParamNode(node.__paramName, node.__text, node.__key);
  }

  static importJSON(serializedNode) {
    const node = $createParamNode(serializedNode.text);
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      paramName: this.__paramName,
      type: PARAM_NODE_TYPE,
      version: 1,
    };
  }

  createDOM(config) {
    const element = super.createDOM(config);
    element.className = expressionBuilderParam;
    return element;
  }

  exportDOM() {
    const element = document.createElement('span');
    element.setAttribute('data-lexical-param', 'true');
    element.textContent = this.__text;
    return { element };
  }

  isSegmented = () => {
    return false;
  };

  static importDOM() {
    return {
      span: (domNode) => {
        if (!domNode.hasAttribute('data-lexical-param')) {
          return null;
        }
        return {
          conversion: convertParamElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity = () => {
    return true;
  };

  isToken = () => {
    return true;
  };
}
