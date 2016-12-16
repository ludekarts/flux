// FLUX CORE v 0.0.5 by Wojciech Ludwin, ludekarts@gmail.com.
const Flux = ((utils, t5, PubSub, Sortable, Pscroll, Mammoth, MathJax, cnxmlModule, $window) => {
  // Constans.
  const _transformers = {}, _converters = {}, _widgets = {}, _toolset = [], _widgetsMenu = [],
  _bucket = utils.bucket(), _pubsub = PubSub(), _outputNodes = new WeakMap();
  // locsls.
  let _mammothOpts, _docxElements, _activeWidget, _modal, _activeWidgetBtn;
  // Flags.
  let isShift = false, isCtrl = false;
  // Flux Events.
  const _events = {
    initializationEnded: 'initializationEnded',
    errorReported: 'errorReported',
    docxParsed: 'docxParsed',
    contetChanged: 'contetChanged',
    contentOrderChanged: 'contentOrderChanged',
    transformationEillStart: 'transformationEillStart',
    transformationEnded: 'transformationEnded',
    convertionWillStart: 'convertionWillStart',
    convertionEnded: 'convertionEnded',
    widgetSelected: 'widgetSelected'
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
        // Register widget template with access to comuncation pipe.
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
    // console.log(_bucket.content()); // Debug.
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
      _pubsub.publish(_events.transformationEnded, _docxElements).publish(_events.contetChanged);
    }
  };


  // Select active widget.
  const composerHandler = (event) => {

    if (_activeWidgetBtn) _activeWidgetBtn.classList.remove('active');

    _activeWidgetBtn = event.target;
    _activeWidgetBtn.classList.add('active');

    if (_activeWidgetBtn.dataset && _activeWidgetBtn.dataset.action) {
      if (_activeWidgetBtn.dataset.action === 'more') {
        convertHandler();
      } else {
        _activeWidget = _widgets[_activeWidgetBtn.dataset.action];
        renderWidgets();
      }
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

    if (event.keyCode === 27) {
      _modal.classList.remove('on');
    }
  };

  // ---- MIXED HANDLERS -----------------

  // Render active widget.
  const renderWidgets = () => {
    if (_activeWidget) {
      if (_widget.children.length > 0) utils.removeChildren(_widget);
      _widget.appendChild(_activeWidget);
    }
  };

  // Reorder elements in _docxElements.
  const reorderContent = (event) => {
    _docxElements = Array.from(_docx.children);
    // Send notification.
    _pubsub.publish(_events.contentOrderChanged, _docxElements);
  };

  // Get converter for element helper.
  const getConverterFor = (element) => {
    const type = element.dataset.fluxType;
    return type ? _converters[element.tagName.toLowerCase() + (type === 'default' ? '' : '.' + type)] : undefined;
  };

  // Convert to CNXML.
  const convertHandler = (event) => {
    const hash = "KED-PHY-";
    const output = Array.from(_docx.children).reduce((result, element) => {
      // Parse only elements with `flux-type` attribute.
      const converter = getConverterFor(element);
      if (converter){
        try {
          result += converter.convert(_outputNodes.get(element) || { content : element.innerHTML });
        } catch (e) {
          console.warn(`Błąd konwertera ${element.tagName.toLowerCase()}.${element.dataset.fluxType}! Element zostanie pominięty`);
        }
      }
      else {
        console.warn(`Element otagowany jako "${utils.reportElement(element)}" nie posiada konwertera`);
      }
      return result;
    },'')
    // Add Unique Identifiers.
    // TODO: Add better hashes.
    .replace(/#%UID%#/g, (a, b) => hash + b);

    console.log(output);
    _modal.querySelector('textarea').value = cnxmlModule(output);
    _modal.classList.add('on');
  };

  // ---- DOCX PROCESSING ----------------

  const processDOCXFile = (buffer) => {
    Mammoth.convertToHtml({ arrayBuffer: buffer }, _mammothOpts).then((result) => {
      _docx.innerHTML = result.value;
      _sortable = Sortable.create(_docx, { onEnd: reorderContent });

      // Log messages.
      result.messages.forEach((message) => console.log(message.message));
      // Apply order identifiers for _docx nodes.
      _docxElements = Array.from(_docx.children);

      // Tag DOCX children.
      _docxElements.forEach((element, index) => {
        // Add `flux-type` attribute. Only elements with this tag will be converted.
        element.dataset.fluxType = 'default';
        // Add `flux-order` attribute. This will help with sorting.
        // element.dataset.fluxOrder = index;
      });
      // Convert Match sumbols.
      Array.from(document.querySelectorAll('.math')).map((eq, index) => eq.innerHTML = `$${eq.innerHTML}$`);
      MathJax.Hub.Typeset();

      // Send notification.
      _pubsub.publish(_events.docxParsed, _docxElements).publish(_events.contetChanged)
      .publish('parseDocx', _docx);
    }).done();
  };

  // ---- PUBSUB LISTENERS ----------

  _pubsub.subscribe(_events.contetChanged, renderWidgets);

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
    _modal = document.querySelector('[data-flux="modal"]');
    _widget = document.querySelector('[data-flux="widget"]');
    _toolbox = document.querySelector('[data-flux="toolbox"]');
    _composer = document.querySelector('[data-flux="composer"]');

    // Render toolbox.
    _toolbox.innerHTML = t5.render('toolbox', { toolset: _toolset });

    // Chek for UI containers.
    if (!(_docx && _modal && _widget && _toolbox && _composer))
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
})(FluxUtils2, t5, PubSub, Sortable, Ps, mammoth, MathJax, cnxmlModule, window);
