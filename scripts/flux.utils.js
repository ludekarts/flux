const FluxUtils2 = (() => {

  // ---- Create DOM element ----------------
  const createElement = (type, content, fluxType, isWrapper) => {
    console.warn('createElement() method will depracased soon! Try to use createElementWOL() instead.');
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

  // ---- Create DOM element from Object Literal ------------
  /*
    const element = {
      type: 'div.classname',
      content: 'Lorem ispum dolor sit amet.' || { element },
      attrs: [ ['name', 'value'], ... ],
      dataset: [ ['camelCaseName', 'value'], ... ],
    }
  */
  const createElementWOL = ({ type, content, attrs, dataset }) => {
    let classes = ~type.indexOf('.') ? type.split('.') : undefined;
    if (classes) {
      type = classes[0];
      classes = classes.slice(1,classes.length).join(' ');
    }
    const element = document.createElement(type);
    if (content) {
      if (typeof content === 'string') {
        element.innerHTML = content ;
      }
      else {
        if (!Array.isArray(content)) content = [content];
        element.innerHTML = content.reduce((result, subElement) => result += createElementWOL(subElement).outerHTML, '');
      }
    }
    if (attrs) attrs.forEach(attribute => element.setAttribute(attribute[0], attribute[1]));
    if (dataset) dataset.forEach(data => element.dataset[data[0]] = data[1]);
    if (classes) element.className = classes;
    return element;
  };

  // ---- Remove all HTML tags, leaves only Text content ----------------
  const strip = (elemnt) =>  elemnt.innerHTML.replace(/(<([^>]+)>)/ig, '').trim();

  // ---- Get random value from range ------------
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // ---- Prodice random HEX Color code ----------
  const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);

  // ---- Creates unique 8-chars IDs --------------
  const cache = [];
  const chars = '23456789abdegjkmnpqrvwxyz';
  const generateKey = () => {
    let result = '';
    for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * 25));
    return result;
  };

  const uid = () => {
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

  // ---- Bucket for item to ptrocess ----------------
  const bucket = () => {
    let _content = [];

    // Get bucket content.
    const content = (index) => index === undefined ? _content : _content[index];

    // Get bucket content.
    const reverse = () => _content.reverse();

    // Get bucket content length.
    const count = () => _content.length;

    // Add only one item.
    const addOne = (item, cleanUp = true) => {
      if (!~_content.indexOf(item)) {
        if(cleanUp) clean();
        _content.push(item);
        item.classList.add('selected');
      } else {
        clean(item);
      }
    };

    // Add many items.
    const addMany = (item) => addOne(item, false);

    // Clean all item or just one.
    const clean = (remove) => {
      if (remove) {
        let removeIndex = _content.indexOf(remove);
        if (removeIndex > -1) {
          _content[removeIndex].classList.remove('selected');
          _content.splice(removeIndex, 1);
        }
      } else {
        _content.forEach(element => element.classList.remove('selected'));
        _content = [];
      }
    };

    // API.
    return { content, clean, addOne, addMany, reverse, count };
  };

  // ---- While error detected report parametres of element for debuging ----------------
  const reportElement = (element) => {
    return element.innerHTML.slice(0,25);
  };

  // ---- Get index of a child in element ----------------
  const getChildIndex = (element, child) => {
    const index = Array.from(element.children).indexOf(child);
    return index > -1 ? index : undefined;
  };

  // ---- Swap arrays elements ---------------------------
  const swapItems = (array, indexA, indexB) => {
    let buffer = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = buffer;
  };

  // ---- Remove all child nodes from the tree -----------
  const removeChildren = (node) => {
    while (node.lastChild) {
      node.removeChild(node.lastChild);
    };
  };

  // ---- Helps with event delegation --------------------
  // USAGE:
  // let destroy = eventDelegate('button.one', 'click', (event) => {}, element);
  // destroy(); At the end, it'll remove the listener.
  const eventDelegate = (selector, event, callback, context = document) => {
    let id = selector + '_' + event;
    if (!context.__EventDelegates__) context.__EventDelegates__ = {};
    if (context.__EventDelegates__[id]) throw new Error (`Current context already have an eventListener for a selector: "${selector}" for "${event}" event.`);
    // Handle match selector.
    let handle = (event) => {
      let found;
      if (found = event.target.closest(selector)) {
        callback.call(found, event);
      }
    };
    // Remmember refeerence for detach action.
    context.__EventDelegates__[id] = handle;
    // Add Event listener.
    context.addEventListener(event, handle);
    // Return destory handle.
    return () => {
      context.removeEventListener(event, handle);
      context.__EventDelegates__[id] = undefined;
      handle = undefined;
    };
  };

  // Public API.
  return {
    createElement, createElementWOL, strip, replaceNodes, uid, randomInt,
    randomColor, reportElement, bucket, getChildIndex, swapItems, removeChildren,
    eventDelegate
  };
})();
