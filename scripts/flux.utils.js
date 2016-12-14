const FluxUtils2 = (() => {

  // ---- Create DOM element ----------------
  const createElement = (type, content, fluxType, isWrapper) => {
    let classes = ~type.indexOf('.') ? type.split('.') : undefined;
    if (classes) {
      type = classes[0];
      classes = classes.slice(1,classes.length).join(' ');
    }
    const result = document.createElement(type);
    if (classes) result.className = classes;
    if (content) result.innerHTML = content;
    if (fluxType) result.dataset.fluxType = fluxType;
    if (isWrapper) result.dataset.fluxHandle = isWrapper;
    return result;
  };

  // ---- Remove all HTML tags, leaves only Text content ----------------
  const strip = (elemnt) =>  elemnt.innerHTML.replace(/(<([^>]+)>)/ig, '').trim();

  // ---- Get random value from range ------------
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // ---- Creates unique 8-chars IDs --------------
  const cache = [];
  const chars = '23456789abdegjkmnpqrvwxyz';
  const generateKey = () => {
    let result = '';
    for (let i = 0; i < 8; i++) result += this.chars.charAt(Math.floor(Math.random() * 25));
    return result;
  };

  const getUID = () => {
    let id, retries = 0;
    while(!id && retries < 9999) {
      id = generateKey();
      if(~cache.indexOf(id)) {
        id = null;
        retries++;
      }
    }
    cache.push(id);
    return id;
  };

  // ---- Create Wrapper Handle ----------------
  const createWrapperHandle = (content, id) => {
    const handle = document.createElement('div');
    handle.dataset.fluxHandle = id;
    handle.innerHTML = content;
    return handle;
  };

  // ---- Replace @nodeList with @newNode ----------------
  const replaceNodes = (nodeList, newNodes) => {
    if (!Array.isArray(newNodes)) newNodes = [newNodes];
    // SETUP: Locals.
    let cnversionHandle;
    const parent = nodeList[0].parentNode;
    const startElement = parent.children[Array.prototype.indexOf.call(parent.children, nodeList[0])];
    // APPEND: Add new nodes.
    newNodes.forEach((node, index) => {
      if (node.dataset.fluxType) cnversionHandle = node;
      parent.insertBefore(node, startElement);
    });
    // CLEAN-UP: Remove old nodes.
    nodeList.forEach(node => parent.removeChild(node));
    newNodes = undefined;
    // Return Conversion Handle.
    return cnversionHandle;
  };

  // ---- While error detected report parametres of element for debuging ----------------
  const reportElement = (element) => {
    return element.innerHTML.slice(0,25);
  };

  // Public API.
  return { createElement, strip, replaceNodes, getUID, getRandomInt, reportElement };
})();


// -------------------------------------------------------
const FluxUtils = {
  // Create DOM element.
  createElement (type, content, fluxType, isWrapper) {
    let classes = ~type.indexOf('.') ? type.split('.') : undefined;
    if (classes) {
      type = classes[0];
      classes = classes.slice(1,classes.length).join(' ');
    }
    const result = document.createElement(type);
    if (classes) result.className = classes;
    if (content) result.innerHTML = content;
    if (fluxType) result.dataset.fluxType = fluxType;
    if (isWrapper) result.dataset.fluxHandle = isWrapper;
    return result;
  },

  // Remove all HTML tags, leaves only Text content.
  strip(elemnt) {
    return elemnt.innerHTML.replace(/(<([^>]+)>)/ig, '').trim();
  }
};
