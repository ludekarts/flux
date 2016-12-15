// FLUX CORE v 0.0.5 by Wojciech Ludwin, ludekarts@gmail.com.
const Flux = ((utils, t5, PubSub, Sortable, Pscroll, Mammoth, MathJax, $window) => {
  // Constans.
  const _transformers = {}, _converters = {}, _widgets = {}, _toolset = [], _widgetsMenu = [],
  _bucket = utils.bucket(), _pubsub = PubSub(), _outputNodes = new WeakMap();
  // locsls.
  let _mammothOpts, _docxElements;
  // Flags.
  let isShift = false, isCtrl = false;
  // Flux Events.
  const _events = {
    initializationEnded: 'initializationEnded',
    errorReported: 'errorReported',
    docxParsed: 'docxParsed',
    contetOrderChanged: 'contetOrderChanged',
    transformationEillStart: 'transformationEillStart',
    transformationEnded: 'transformationEnded',
    convertionWillStart: 'convertionWillStart',
    convertionEnded: 'convertionEnded'
  };

  // ---- INSTALLATORS ----------------

  const installTransformers = (plugs) => {
    if (!Array.isArray(plugs)) plugs = [plugs];
    plugs.forEach((transformer) => {
      const _name = transformer.name;
      if (!_transformers[_name]) {
        // Add transfromer to UI toolbox.
        _toolset.push({
          tip: transformer.tooltip,
          icon: transformer.icon,
          name: transformer.name
        });
        _transformers[_name] = transformer.format(_pubsub);
      }
    });
  };

  const installConverters = (plugs) => {
    if (!Array.isArray(plugs)) plugs = [plugs];
    plugs.forEach(converter => {
       converter.match.split(',').forEach(name => {
         const _name = name.trim();
          _converters[_name] = converter;
       });
     });
  };

  const installWidgets = (plugs) => {
    if (!Array.isArray(plugs)) plugs = [plugs];
    plugs.forEach((widget) => {
      const _name = widget.name;
      if (!_widgets[_name]) {
        // Add widget to menu.
        _widgetsMenu.push({
          tip: widget.tooltip,
          icon: widget.icon,
          name: widget.name
        });
        _widgets[_name] = widget.init(_pubsub);
      }
    });
  };

  // ---- CLICK HANDLERS -------------------

  // Handle items selection.
  const docxHandler = (event) => {
    // Do not selcet perfect-scrollbar's containers.
    if (event.target.matches('div.docx.ps-container')) return;

    if (isShift) {
      // Select range of elements.
      _bucket.addMany(event.target);
      if (_bucket.content().length === 2) {
        let startIndex = _docxElements.indexOf(_bucket.content()[0]);
        let endIndex = _docxElements.indexOf(_bucket.content()[1]);
        _bucket.clean();
        if (startIndex < endIndex) {
          for (let i = startIndex; i < endIndex + 1; i++) {
            _bucket.addMany(_docxElements[i]);
          }
        }
        else {
          for (let i = startIndex; i > endIndex - 1; i--) {
            _bucket.addMany(_docxElements[i]);
          }
          _bucket.reverse();
        }
      }
    }
    // Select multiple OR single element.
    else {
      isCtrl ? _bucket.addMany(event.target) : _bucket.addOne(event.target);
    }
    console.log(_bucket.content()); // Debug.
  };

  // Start .docx processing.
  const uploadHandler = (event) => {
    const reader = new FileReader();
    reader.onload = function(loadEvent) {
      processDOCXFile(loadEvent.target.result);
    };
    reader.readAsArrayBuffer(event.target.files[0]);
  };

  // Run selected transformation.
  const toolboxHandler = (event) => {
    if (event.target.dataset && event.target.dataset.action && _bucket.content().length > 0) {
      try {
        // Send notification.
        _pubsub.publish(_events.transformationEillStart);
        // Find right transformer to run.
        const transform = _transformers[event.target.dataset.action](_bucket.content());
        // Replace nodes in preview.
        const cnversionHandle = utils.replaceNodes(_bucket.content(), transform.dom);
        // Add globaly avilabele mapping between element DOM & COM --> Imporove element search.
        if (transform.com && !_outputNodes.has(cnversionHandle)) _outputNodes.set(cnversionHandle, transform.com);
      } catch (error) {
        // Send notification.
        _pubsub.publish(_events.errorReported, {error});
        // Hendle error.
        console.error(error);
      }
      // Clear selection bucket.
      _bucket.clean();
      // Update `_docxElements` after each successful transformation.
      _docxElements = Array.from(_docx.children);
      // Send notification.
      _pubsub.publish(_events.transformationEnded, _docxElements);
    }
  };

  // Handle widget change actions.
  const composerHandler = (event) => {
    if (event.target.dataset && event.target.dataset.action) {
      console.log('Composer widget', event.target.dataset.action);
    }
  };

  // Handle actions within `widget` panel.
  const widgetHandler = (event) => {
    if (event.target.dataset && event.target.dataset.action) {
      console.log('Widget action', event.target.dataset.action);
    }
  };

  // ---- KEYBOARD HANDLERS ----------------

  // Deal with keyDown evnet.
  const keyDownHandler = (event) => {
    isShift = event.shiftKey;
    isCtrl = event.ctrlKey;
  };

  // Deal with keyUp evnet.
  const keyUpHandler = (event) => {
    isShift = event.shiftKey;
    isCtrl = event.ctrlKey;
  };

  // ---- MIXED HANDLERS -----------------



  // ---- DOCX PROCESSING ----------------

  const processDOCXFile = (buffer) => {
    Mammoth.convertToHtml({ arrayBuffer: buffer }, _mammothOpts).then((result) => {
      _docx.innerHTML = result.value;
      _sortable = Sortable.create(_docx, {
        onEnd (event) {
          // Reorder elements in _docxElements.
          utils.swapItems(_docxElements, event.newIndex, event.oldIndex);
          // Send notification.
          _pubsub.publish(_events.contetOrderChanged, _docxElements);
         }
      });

      // Log messages.
      result.messages.forEach((message) => console.log(message.message));
      // Apply order identifiers for _docx nodes.
      _docxElements = Array.from(_docx.children);

      // Tag DOCX children.
      _docxElements.forEach((element, index) => {
        // Add `flux-type` attribute. Only elements with this tag will be converted.
        element.dataset.fluxType = 'default';
        // Add `flux-order` attribute. This will help with sorting.
        element.dataset.fluxOrder = index;
      });
      // Convert Match sumbols.
      Array.from(document.querySelectorAll('.math')).map((eq, index) => eq.innerHTML = `$${eq.innerHTML}$`);
      MathJax.Hub.Typeset();

      // Send notification.
      _pubsub.publish(_events.docxParsed, _docxElements);
    }).done();
  };

  // ---- PUBSUB LISTENERS ----------



  // ---- INITIALIZE ----------------

  const init = ({ mammoth, convert, transform, widgets }) => {

    // Check for plugins.
    if (!(t5 && Sortable && Pscroll && Mammoth))
      throw new Error('Uwaga! Proces zatrzymany. Barak wymaganych bibliotek.');

    // Configure MathJax.
    MathJax.Hub.Config({
      showProcessingMessages: false,
      tex2jax: { inlineMath: [['$','$'],['\\(','\\)']] }
    });

    // Configure Mamooth.
    _mammothOpts = mammoth || {};

    // Add Transformer plugins.
    installTransformers(transform);
    // Add Converter plugins.
    installConverters(convert);
    // Add Widget panels.
    installWidgets(widgets);


    // Register templates.
    t5.template();
    // Render Toolset.
    t5.render('toolbox', {toolset: _toolset});
    // Render Widget Menu.
    t5.render('composer', {widgets: _widgetsMenu});


    // Create upload placeholder.
    _upload= document.createElement('input');
    _upload.type = 'file';

    // Get all DOM references for FLUX elements.
    _docx = document.querySelector('[data-flux="docx"]');
    _widget = document.querySelector('[data-flux="widget"]');
    _toolbox = document.querySelector('[data-flux="toolbox"]');
    _composer = document.querySelector('[data-flux="composer"]');

    // Render toolbox.
    _toolbox.innerHTML = t5.render('toolbox', { toolset: _toolset });

    // Chek for UI containers.
    if (!(_docx && _widget && _toolbox && _composer))
      throw new Error('Uwaga! Proces zatrzymany. Barak jednego z wymaganych kontenerwow interfejsu.');

    // Set scrollbars from PerfectScroll lib.
    Pscroll.initialize(_docx.parentNode, { suppressScrollX: true });

    // Add upload block.
    _docx.appendChild(_upload);

    // Setup event listeners.
    _docx.addEventListener('click', docxHandler);
    _widget.addEventListener('click', widgetHandler);
    _upload.addEventListener('change', uploadHandler);
    _toolbox.addEventListener('click', toolboxHandler);
    _composer.addEventListener('click', composerHandler);

    // Keyboard hendlers.
    $window.addEventListener('keyup', keyUpHandler);
    $window.addEventListener('keydown', keyDownHandler);

    // Finalize - send notification.
    _pubsub.publish(_events.initializationEnded);
  };

  // Public API.
  return { init }
})(FluxUtils2, t5, PubSub, Sortable, Ps, mammoth, MathJax, window);
