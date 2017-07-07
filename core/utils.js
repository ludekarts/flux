const utils = (function(travrs, toCnxml) {

  const {createElement, template} = travrs;

  const arrayToObject = (array, key) =>
    array.reduce((result, object) => {
      result[object[key]] = object;
      return result;
    }, {});


  // Fortam XML input.
  const formatXml = (xml) => {
    let pad = 0;
    return xml
      .replace(/(>)(<)(\/*)/g, '$1\r\n$2$3')
      .split('\r\n')
      .reduce((result, node) => {
        let indent = 0;
        let padding = '';

        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (node.match(/^<\/\w/) && pad !== 0) {
          pad--;
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          indent = 1;
        } else {
          indent = 0;
        }

        for (let i = 0; i < pad; i++) padding += '  ';
        pad += indent;
        return result += padding + node + '\r\n';
      }, '')
      // Uncoment to escape angle beackets.
      // .replace(/&/g, '&amp;')
      // .replace(/</g, '&lt;')
      // .replace(/>/g, '&gt;')
      // .replace(/ /g, '&nbsp;');
  };

  // Convert elemets objects to
  const elemntsToCnxml = (elements, init = {}) =>
    elements.reduce((result, object) => {
      if (object.tag && !result[object.tag]) {
        result[object.tag] = object;
        if (result[object.tag].extend) elemntsToCnxml(result[object.tag].extend, result);
      }
      return result;
    }, init);

  const uid = () =>
    'ked-' + ((+new Date) + Math.random()* 100).toString(32);

  const elFromString = (source) =>
    document.createRange().createContextualFragment(source);

  const addToolButton = (root, ext = false) => (tool) => {
    root.appendChild(createElement(`button[title="${tool.title}" data-action="${tool.tag}" ${ext ? 'data-ext="true"' : ''}]`, tool.icon));
  };

  const getNodesOut = (current) => {
    const parent = current.parentNode;
    let next, node = current.firstChild;
    while (node) {
      next = node.nextSibling;
      parent.insertBefore(node, current);
      node = next;
    }
    parent.removeChild(current);
  };

  const unwrapElement = (element) => {
    if (!element) {
      const selection = window.getSelection();
      const anchor = selection.anchorNode;
      if (anchor && !anchor.parentNode.matches('#content')) {
        if (anchor.nodeType === 3)
          getNodesOut(anchor.parentNode);
        else
          anchor.parentNode.removeChild(anchor);
      }
    }
    else getNodesOut(element);
  };

  const insertSiblingNode = (target, node) => {
    target.nodeType === 3 ? target.parentNode.parentNode.appendChild(node) : target.parentNode.appendChild(node);
  }

  // Wrap 'elements' with HTMLElement of given 'type' with provided 'attrs'.
  // EXAMPLE: wrapElement(node, 'del', { "data-skip-merge" : true });
  const wrapElement = (elements, type, attrs) => {
    if (!Array.isArray(elements)) elements = [elements];
    const parent = elements[0].parentNode;

    if (parent) {
      const wrapper = document.createElement(type);
      parent.insertBefore(wrapper, elements[0]);
      elements.forEach(node => wrapper.appendChild(node));
      attrs && Object.keys(attrs).forEach(name => wrapper.setAttribute(name, attrs[name]));
      return wrapper;
    }
  };

  // Pares Equations.
  const wrapMath = (content) => () => {
    // Render all math and apply click wrapper.
    MathJax.Hub.getAllJax(content).forEach(math => {
      const equation = document.getElementById(`${math.inputID}-Frame`);
      // MathJax generate 3 nodes per equation -> wrap them all in one.
      if (!equation.parentNode.matches('span.flux-math')) {
        const wrapper = wrapElement([equation.previousSibling, equation, equation.nextSibling], 'span');
        wrapper.className = 'flux-math';
        wrapper.dataset.mathId = math.inputID;
        wrapper.setAttribute('contenteditable', false);
      }
    });
  };

  // Copy arributes 'from' one element 'to' another.
  const copyAttrs = (from, to) =>
    Array.from(from.attributes).forEach(attr => to.setAttribute(attr.name, attr.value));

  // Encode Base 64
  const base64 = (str) =>
    btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
      String.fromCharCode('0x' + p1)
    ));

  // To CNXML module.
  const toCNXML = toCnxml(uid, copyAttrs, createElement);

  return {
    uid,
    base64,
    template,
    wrapMath,
    formatXml,
    copyAttrs,
    wrapElement,
    elFromString,
    createElement,
    addToolButton,
    arrayToObject,
    unwrapElement,
    elemntsToCnxml,
    insertSiblingNode,
    toCnxml: toCNXML.transform,
    cleanMath: toCNXML.cleanMath

  };
}(travrs, toCnxml));
