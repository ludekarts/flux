/* FLUX CORE v 0.2.0 by Wojciech Ludwin, <ludekarts@gmail.com> */

import utils from "./utils";
import Logger from "./logger";
import PubSub from "./pubsub";
import Select from "./select";
import events from "./events";
import t5 from "../vendors/t5";
import Sortable from "sortablejs";
import buttonBlocks from "./blocks";
import _pscroll from "perfect-scrollbar";

// UI References.
let _flux, _toolbox, _widgetmenu, _widget, _converters, _sortable, _uploadInput, _loaderbox, _currentLoader = '';

// Locals.
const _plugins = [], _installed = [], _toolset = [], _widgetMenu = [], _pubsub = PubSub(Logger), _fluxElements = Select(_pubsub);

// Components.
const _loaders = {}, _widgets = {}, _transformers = {}, _loaderButtonsModel = [];

// ---- INSTALL PLUGINS -----------

const install = (...plugins) => {
  plugins.forEach(plugin => _plugins.push(plugin(_pubsub)));
};

// Register content loaders.
const registerLoader = (loader) => {
  // Create map of loaders.
  _loaders[loader.name] = loader.load;
  // Create model for buttons.
  _loaderbox.model.push({
    name: loader.name,
    desc: loader.desc
  });
};

// Register Widget.
const registerWidget = (widget) => {
  // Create Transformers references.
  _widgets[widget.name] = widget.template;
  // Create buttons model.
  _widgetmenu.model.push({
    name: widget.name,
    desc: widget.desc,
    icon: widget.icon
  });
};

// Register Converter.
const registerConverter = (converter) => {
  // Create Converter references.
  _converters[converter.name] = converter.run;
};

// Register Transformer.
const registerTransformer = (tool) => {
  // Create Transformers references.
  _transformers[tool.name] = tool.transform;
  // Create buttons model.
  _toolbox.model.push({
    name: tool.name,
    desc: tool.desc,
    icon: tool.icon
  });
};

// ---- ERROR HANDLE ------------------

const errorLogger = ({ msg, error }) => {
  console.error(msg, error);
};

// ---- CONTENT HANDLES -----------------

// Reorder elements in _fluxElements.
const reorderContent = (event) => {
  _fluxElements.update(Array.from(_flux.children));
};

// Update _flux content & nodes in _fluxElements.
const updateFluxContent = (content) => {
  _flux.innerHTML = content;
  // Apply order identifiers for _docx nodes.
  _fluxElements.update(Array.from(_flux.children));
};

// ---- UPLOAD HANDLE --------------------

// Handle selected file in explorator.
const uploadHandle = (event) => {
  const reader = new FileReader();
  // File lida success.
  reader.onload = function(loadEvent) {
    _pubsub.publish(events.load.success + _currentLoader, loadEvent.target.result);
  };
  // File lida failure.
  reader.onerror = function(error) {
    // TODO: Better error handeling.
    _pubsub.publish(events.load.error + _currentLoader, error);
  };
  // Get file to load.
  reader.readAsArrayBuffer(event.target.files[0]);
};


const selectCurrentLoader = (event) => {
  const action = event.target.dataset.action;
  if (action) {
    // Set Current Loader.
    _currentLoader = '.' + action;
    // Run Current Loader.
    _loaders[action]();
  }
};

// Open File Explorator on `load.file` event.
const openFileExplorator = ({ loader }) => {
  _uploadInput.click();
}

// ---- WIDGETS --------------------------

const renderWidgetContent = (template) => {
  if (_widget.children.length > 0) utils.removeChildren(_widget);
  _widget.appendChild(template);
};


// ---- KEYBOARD HANDLERS ----------------

// Deal with keyDown evnet.
const keyDownHandler = (event) => {
  _fluxElements.isCtrl(event.ctrlKey);
  _fluxElements.isShift(event.shiftKey);
};

// Deal with keyUp evnet.
const keyUpHandler = (event) => {
  _fluxElements.isCtrl(event.ctrlKey);
  _fluxElements.isShift(event.shiftKey);

  // Escape.
  if (event.keyCode === 27)
    _modal.classList.remove('on');
};


// ---- INITIALIZE ----------------

const init = () => {

  // Check for plugins.
  if (_plugins.length > 0)
    throw new Error('Initialization should run befroe Installation process!');

  // Register templates.
  t5.template();

  // Main content container.
  _flux = document.querySelector('[data-flux="flux"]');

  // Widgets placeholder.
  _widget = document.querySelector('[data-flux="widget"]');

  // Left handised toolbox panel.
  _toolbox = buttonBlocks({
    container: document.querySelector('[data-flux="toolbox"]'),
    render: t5.trace('toolbox'),
    triggers: _transformers
  });

  // Loader menu.
  _loaderbox = buttonBlocks({
    container: document.querySelector('[data-flux="loadersbox"]'),
    render: t5.trace('loaders'),
    triggers: _loaders
  });

  // Widgets menu.
  _widgetmenu = buttonBlocks({
    container: document.querySelector('[data-flux="widgetmenu"]'),
    render: t5.trace('widgetbox'),
    triggers: _widgets
  });

  // Upload input.
  _uploadInput = document.querySelector('[data-flux="upload"]'); // Hidden input-file.

  // Setup drag & drop handler.
  _sortable = Sortable.create(_flux, { onEnd: reorderContent });

  // Set scrollbars from PerfectScroll lib.
  _pscroll.initialize(_flux.parentNode, { suppressScrollX: true });

  // Setup event listeners.
  _flux.addEventListener('click', _fluxElements.select);

  // Keyboard hendlers.
  document.addEventListener('keyup', keyUpHandler);
  document.addEventListener('keydown', keyDownHandler);

  // Add Flux listeners.
  _pubsub
    // Registration liteners.
    .subscribe(events.register.loader, registerLoader)
    .subscribe(events.register.widget, registerWidget)
    .subscribe(events.register.converter, registerConverter)
    .subscribe(events.register.transformer, registerTransformer)
    // Listener for native File explorator.
    .subscribe(events.load.file, openFileExplorator)
    // Handle errors with content.
    .subscribe(events.content.error, errorLogger)
    // Event generated by Loaders, when conten is ready.
    .subscribe(events.content.ready, updateFluxContent)
    // Render widget content.
    .subscribe(events.ui.widget.render, renderWidgetContent)
    // Finalize -> send notification.
    .publish(events.app.initialized);
};

export default { init, install }
