const Flux = (function (t5, templates, Sortable, Pscroll, Mammoth, MathJax, $window) {

  let _upload, _toolbox, _toolset = [], _docx, _docxElements, _composer, _transformers = {}, _transformersIndex = [],
      _menu,  _sortable,  bucket = [], _mammothOpts, isShift = false, _equations = [], _outputNodes = new WeakMap(), _converters = {};

  // List of selectors excluded from CONVERSION process.
  const _excludedSelectors = ['div[data-flux-handle]'];

  // ---- HELPERS ----------------

  // Global falback function.
  const fallback = (message) => () => console.warn(message);

  // Get random value from range.
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Recucler function.
  const clearBucket = (toRemove) => {
    if (toRemove) {
      let removeIndex = bucket.indexOf(toRemove);
      if (removeIndex > -1) {
        bucket[removeIndex].classList.remove('selected');
        bucket.splice(removeIndex, 1);
      }
    } else {
      bucket.forEach(element => element.classList.remove('selected'));
      bucket = [];
    }
  };

  // Creates unique 8-chars IDs.
  const hashID = {
    chars : '23456789abdegjkmnpqrvwxyz',
    cache : [],
    hash() {
      let result = '';
      for (let i = 0; i < 8; i++) result += this.chars.charAt(Math.floor(Math.random() * 25));
      return result;
    },
    generate() {
      let id, retries = 0;
      while(!id && retries < 9999) {
        id = this.hash();
        if(~this.cache.indexOf(id)) {
          id = null;
          retries++;
        }
      }
      this.cache.push(id);
      return id;
    }
  };

  // Replace @nodeList with @newNode.
  const replaceNodes = (nodeList, newNodes) => {
    if(!Array.isArray(newNodes)) newNodes = [newNodes];
    // Locals.
    let cnversionHandle;
    const parent = nodeList[0].parentNode;
    const startElement = parent.children[[].indexOf.call(parent.children, nodeList[0])];
    // Append new nodes.
    newNodes.forEach((node, index) => {
      if (node.dataset.fluxType) cnversionHandle = node;
      parent.insertBefore(node, startElement);
    });
    // Detect if wrapper component need to be added?
    if (cnversionHandle && cnversionHandle.dataset.fluxHandle) {
      const wrappId = hashID.generate(startElement);
      const content = cnversionHandle.dataset.fluxHandle;
      cnversionHandle.dataset.fluxHandle = wrappId;
      parent.insertBefore(createWrapperHandle(content, wrappId), startElement);
    }
    // Remove old nodes.
    nodeList.forEach(node => parent.removeChild(node));
    // Clear.
    newNodes = undefined;
    // Return Conversion Handle.
    return cnversionHandle;
  };

  // Process .docx document with Mammoth.
  const processDOCXFile = (buffer) => {
    Mammoth.convertToHtml({ arrayBuffer: buffer }, _mammothOpts).then((result) => {
      _docx.innerHTML = result.value;
      _sortable = Sortable.create(_docx);

      // Log messages.
      result.messages.forEach((message) => console.log(message.message));

      // Apply order identifiers for _docx nodes.
      _docxElements = Array.from(_docx.children);
      // Tag DOCX children with `flux-type`.
      // !!IMPORTANT!! Only elements with this tag will be converted.
      _docxElements.forEach((element, index) => element.dataset.fluxType = 'default');

      // Convert Match sumbols.
      convertMath();
    }).done();
  };

  // create Wrapper Handle
  const createWrapperHandle = (content, id) => {
    const handle = document.createElement('div');
    handle.dataset.fluxHandle = id;
    handle.innerHTML = content;
    return handle;
  };

  // While error detected report parametres of element for debuging.
  const reportElement = (element) => {
    return element.innerHTML.slice(0,25);
  };

  // Convert Math Style to MathJax.
  const convertMath = () => {
    Array.from(document.querySelectorAll('.math')).map((eq, index) => {
      if (~eq.innerHTML.indexOf('RÓWNANIE')){
        _equations.push({
          content : eq.innerHTML,
          handler : 'EQH' + index
        });
        eq.id = 'EQH' + index;
    }
      return eq.innerHTML = `$${eq.innerHTML}$`;
    });
    MathJax.Hub.Typeset();

    t5.render('eqs', {equations :_equations});
  };


  // ---- KEYBOARD HANDLERS ----------------

  // Deal with keyDown evnet.
  const keyDownHandler = (event) => {
    isShift = event.shiftKey
  };

  // Deal with keyUp evnet.
  const keyUpHandler = (event) => {
    isShift = event.shiftKey
  };


  // ---- CLICK HANDLERS ----------------

  // Trigger proper format function.
  const toolboxHandler = (event) => {
    if (event.target.dataset && !!~_transformersIndex.indexOf(event.target.dataset.action) && bucket.length > 0) {
      try {
        // Find right transformer to run.
        const transform = _transformers[event.target.dataset.action].format(bucket);
        // Replace nodes in preview.
        const cnversionHandle = replaceNodes(bucket, transform.dom);
        // Add globaly avilabele mapping between element DOM & COM --> Imporove element search.
        if (transform.com && !_outputNodes.has(cnversionHandle)) _outputNodes.set(cnversionHandle, transform.com);
      } catch (e) {
        console.error(e);
      }
      clearBucket();
      t5.render('blocks', {bucket});
    }
  };

  // Handle content nodes selection.
  const docxHandler = (event) => {
    // Allow to 'unclick' selected element.
    if (bucket[0] === event.target && !isShift) {
      clearBucket();
    }
    else {
      if (!isShift) clearBucket();
      // Fill bucket with selecetd element.
      if (!~bucket.indexOf(event.target)) {
        bucket.push(event.target);
        event.target.classList.add('selected');
        // Render list.
        t5.render('blocks', {bucket});
      } else {
        clearBucket(event.target);
      }
    }
  };

  // handle uploaded file.
  const uploadHandler = (event) => {
    const reader = new FileReader();
    reader.onload = function(loadEvent) {
      processDOCXFile(loadEvent.target.result);
    };
    reader.readAsArrayBuffer(event.target.files[0]);
  };


  // ---- NON-STANDARD HANDLERS ----------------

  const getConverterFor = (element) => {
    const type = element.dataset.fluxType;
    return type ? _converters[element.tagName.toLowerCase() + (type === 'default' ? '' : '.' + type)] : undefined;
  }

  // Convert to CNXML.
  const convertHandler = (event) => {
    const hash = "#KED-PHY-";
    console.log(Array.from(_docx.children).reduce((result, element) => {
      // Parse only elements with `flux-type` attribute.
      console.log(element);
      const converter = getConverterFor(element);
      if (converter){
        try {
          result += converter.convert(_outputNodes.get(element) || { content : element.innerHTML });
        } catch (e) {
          console.warn(`Błąd konwertera ${element.tagName.toLowerCase()}.${element.dataset.fluxType}! Element zostanie pominięty`);
        }
      }
      else {
        console.warn(`Element otagowany jako "${reportElement(element)}" nie posiada konwertera`);
      }
      return result;
    },'')
    // Add Unique Identifiers.
    // TODO: Add better hashes.
    .replace(/#%UID%#/g, (a, b) => hash + b));
  };

  // Add New Transformer.
  const installTransformers = (transformers) => {
    if (!Array.isArray(transformers)) transformers = [transformers];

    transformers.forEach((transformer) => {
      let name = transformer.name;
      if (!~_transformersIndex.indexOf(name)) {
        // Add transfromer to UI toolbox.
        _toolset.push({
          tip: transformer.tooltip,
          icon: transformer.icon,
          name: transformer.name
        });
        // Refister transfromer.
        _transformersIndex.push(name);
        _transformers[name] = transformer;
      }
      else {
        console.warn(`Duplkacja deklaracji trasformera "${name}".`);
      }
    });
  };

  // Add New Converters.
  const installConverters = (converters) => {
    if (!Array.isArray(converters)) converters = [converters];
    converters.forEach(converter => {
       converter.match.split(',').forEach(name => {
         const _name = name.trim();
          _converters[_name] = converter
       });
     });
    //console.log(_converters);
  };

  // Switch View in composer panel.
  const switchView = (view) => {
    _composer.innerHTML = t5.render(view, []);
  };

  // Initialize.
  const init = ({ mammoth, convert, transform }) => {

    // Check for plugins.
    if (!(t5 && Sortable && Pscroll && Mammoth))
      throw new Error('Uwaga! Proces zatrzymany. Barak wumaganych bibliotek.');

    // Configure MathJax.
    MathJax.Hub.Config({
      showProcessingMessages: false,
      tex2jax: { inlineMath: [['$','$'],['\\(','\\)']] }
    });

    // Configure Mamooth.
    _mammothOpts = mammoth || {};

    // Add Transformer plugins.
    installTransformers(transform);

    // Add Converters plugins.
    installConverters(convert);

    // Register templates.
    Object.keys(templates).forEach(name => t5.template(name, templates[name]));

    // Create upload placeholder.
    _upload= document.createElement('input');
    _upload.type = 'file';

    // Get all DOM references for FLUX elements.
    _docx = document.querySelector('[data-flux="docx"]');
    _toolbox = document.querySelector('[data-flux="toolbox"]');
    _composer = document.querySelector('[data-flux="composer"]');

    // Render toolbox.
    _toolbox.innerHTML = t5.render('toolbox', { toolset: _toolset });

    if (!(_docx  && _toolbox && _composer))
      throw new Error('Uwaga! Proces zatrzymany. Barak jednego z wymaganych komponentow UI.');

    // Set scrollbars from PerfectScroll lib.
    Pscroll.initialize(_docx);

    // Add upload block.
    _docx.appendChild(_upload);

    // Setup event listeners.
    _docx.addEventListener('click', docxHandler);
    _upload.addEventListener('change', uploadHandler);
    _toolbox.addEventListener('click', toolboxHandler);
    // _composer.addEventListener('click', composerHandler);

    // Keyboard hendlers.
    $window.addEventListener('keyup', keyUpHandler);
    $window.addEventListener('keydown', keyDownHandler);
  };

  // Public API.
  return { init }
}(t5, FluxTemplates, Sortable, Ps, mammoth, MathJax, window));
