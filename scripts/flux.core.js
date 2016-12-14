// FLUX CORE v 0.0.5 by Wojciech Ludwin, ludekarts@gmail.com.
const Flux = ((utils, t5, Sortable, Pscroll, Mammoth, MathJax, $window) => {

  // Constans.
  const _transformers = {}, _converters = {}, _widgets = {}, _toolset = [], _widgetsMenu = [];
  // locsls.
  let _mammothOpts;

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
        _transformers[_name] = transformer;
      }
    });
  };

  const installConverters = (plugs) => {
    if (!Array.isArray(plugs)) plugs = [plugs];
    plugs.forEach(converter => {
       converter.match.split(',').forEach(name => {
         const _name = name.trim();
          _converters[_name] = converter
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
        _widgets[_name] = widget.init();
      }
    });
  };

  // ---- CLICK HANDLERS -------------------

  // Handle actions within `content`.
  const docxHandler = (event) => {

  };

  // Start .docx processing.
  const uploadHandler = (event) => {
    const reader = new FileReader();
    reader.onload = function(loadEvent) {
      processDOCXFile(loadEvent.target.result);
    };
    reader.readAsArrayBuffer(event.target.files[0]);
  };

  // Run proper transformer.
  const toolboxHandler = (event) => {
    if (event.target.dataset && event.target.dataset.action) {
      console.log('Transformer', event.target.dataset.action);
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
    isShift = event.shiftKey
  };

  // Deal with keyUp evnet.
  const keyUpHandler = (event) => {
    isShift = event.shiftKey
  };

  // ---- DOCX PROCESSING ----------------

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
      Array.from(document.querySelectorAll('.math')).map((eq, index) => eq.innerHTML = `$${eq.innerHTML}$`);
      MathJax.Hub.Typeset();
      
    }).done();
  };

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
    Pscroll.initialize(_docx);

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
  };

  // Public API.
  return { init }
})(FluxUtils2, t5, Sortable, Ps, mammoth, MathJax, window);
