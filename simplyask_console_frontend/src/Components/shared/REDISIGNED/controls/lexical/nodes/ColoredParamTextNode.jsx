import { TextNode } from 'lexical';

export const COLORED_PARAM_TEXT_NODE_TYPE = 'ColoredParamTextNode';

export function $createColoredParamTextNode(text, paramName, paramType, bgColor, id) {
  return new ColoredParamTextNode(text, paramName, paramType, bgColor, id);
}

export class ColoredParamTextNode extends TextNode {
  __bgColor;

  __paramName;

  __paramType;

  __id;

  constructor(text, paramName, paramType, bgColor, id, key) {
    super(text, key);
    this.__bgColor = bgColor;
    this.__paramName = paramName;
    this.__paramType = paramType;
    this.__id = id;
  }

  getBgColor() {
    return this.__bgColor;
  }

  getParamName() {
    return this.__paramName;
  }

  setParamName(newParamName) {
    const self = this.getWritable();
    self.__paramName = newParamName;
    return self;
  }

  getParamType() {
    return this.__paramType;
  }

  setParamType(newParamType) {
    const self = this.getWritable();
    self.__paramType = newParamType;
    return self;
  }

  getId() {
    return this.__id;
  }

  static getType() {
    return COLORED_PARAM_TEXT_NODE_TYPE;
  }

  static clone(node) {
    return new ColoredParamTextNode(
      node.__text,
      node.__paramName,
      node.__paramType,
      node.__bgColor,
      node.__id,
      node.__key
    );
  }

  static importJSON(serializedNode) {
    const node = $createColoredParamTextNode(
      serializedNode.text,
      serializedNode.paramName,
      serializedNode.paramType,
      serializedNode.bgColor,
      serializedNode.id
    );
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
      bgColor: this.__bgColor,
      paramName: this.__paramName,
      paramType: this.__paramType,
      id: this.__id,
      type: COLORED_PARAM_TEXT_NODE_TYPE,
      version: 1,
    };
  }

  createDOM(config) {
    const element = super.createDOM(config);
    element.style.backgroundColor = this.__bgColor;
    element.style.cursor = 'pointer';
    return element;
  }

  updateDOM(prevNode, dom, config) {
    const isUpdated = super.updateDOM(prevNode, dom, config);
    if (prevNode.__bgColor !== this.__bgColor) {
      dom.style.backgroundColor = this.__bgColor;
    }
    return isUpdated;
  }
}
