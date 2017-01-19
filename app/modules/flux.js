/* FLUX CORE v 0.2.0 by Wojciech Ludwin, <ludekarts@gmail.com> */

import * as utils from "./utils";
import Logger from "./logger";
import PubSub from "./pubsub";
import Select from "./select";
import Loader from "./loader";
import events from "./events";
import t5 from "../vendors/t5";
import Sortable from "sortablejs";
import Container from "./container";
import _pscroll from "perfect-scrollbar";

// UI References.
let _fluxContent, _toolbox, _widgetmenu, _widget, _sortable, _loaderbox;

// Locals.
const _plugins = [];

// Modules.
const _pubsub = PubSub(Logger), _fileLoader = Loader(_pubsub), _fluxElements = Select(_pubsub), _container = Container(t5, _pubsub);

// Assets.
const _loaders = {}, _widgets = {}, _transformers = {}, _converters = {};

// Assets Map.
const assetsMap = {
  loaders: _loaders,
  widgets: _widgets,
  tools: _transformers,
  converters: _converters
};

// ---- INSTALLATORS ------------------

const install = (...plugins) => {
  plugins.forEach(plugin => _plugins.push(plugin(_pubsub)));
};

// Register Widget.
const registerWidget = (widget) => {
  // Create Transformers references.
  _widgets[widget.name] = widget.template;
  // Destructureing.
  const {name, desc, icon} = widget;
  // Create buttons model.
  _widgetmenu.model.push({name, desc, icon});
};

// Register Transformer.
const registerTransformer = (tool) => {
  // Create Transformers references.
  _transformers[tool.name] = tool.transform;
  // Destructureing.
  const {name, desc, icon} = tool;
  // Create buttons model.
  _toolbox.model.push({name, desc, icon});
};

// Register Converter.
const registerConverter = (converter) => {
  // Create Converter references.
  _converters[converter.name] = converter.run;
};

// Register content loaders.
const registerLoader = (loader) => {
  // Create map of loaders.
  _loaders[loader.name] = loader.load;
};


// ---- ERROR HANDLE ------------------

const errorLogger = ({ msg, error }) => {
  console.error(msg, error);
};


// ---- APP REQUIRE ---------------------

const appRequire = (asset) => ({ name } = {}) => {
  _pubsub.publish(events.app.get[asset], name ? assetsMap[asset][name] : assetsMap[asset]);
};


// ---- CONTENT HANDLES -----------------

// Reorder elements in _fluxElements.
const reorderContent = (event) => {
  _fluxElements.update(Array.from(_flux.children));
};

// Update _flux content & nodes in _fluxElements.
const updateFluxContent = (content) => {
  _fluxContent.innerHTML = content;
  // Apply order identifiers for _docx nodes.
  _fluxElements.update(Array.from(_fluxContent.children));
};


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
};


// ---- INITIALIZE ----------------

const init = () => {

  // ---- Check for plugins --------------

  if (_plugins.length > 0)
    throw new Error('Initialization should run befroe Installation process!');

  // ---- Register templates -------------

  t5.template();

  // ---- UI Placeholders ----------------

  // Main content container.
  _fluxContent = document.querySelector('[data-flux="content"]');

  // Setup event listeners.
  _fluxContent.addEventListener('click', _fluxElements.select);

  // Widget placeholder.
  _widget = document.querySelector('[data-flux="widget"]');


  // ---- UI Containers ----------------

  // Left-hand-side tools menu.
  _toolbox = _container.create ('toolbox', 'toolbox', _transformers);

  // Right-hand-side widgets menu.
  _widgetmenu = _container.create ('widgetmenu', 'widgetmenu', _widgets);


  // ---- Content Enhancement ----------

  // Setup drag & drop handler.
  _sortable = Sortable.create(_fluxContent, { onEnd: reorderContent });

  // Set scrollbars from PerfectScroll lib.
  _pscroll.initialize(_fluxContent.parentNode, { suppressScrollX: true });


  // ---- Keyboard hendlers -----------

  document.addEventListener('keyup', keyUpHandler);
  document.addEventListener('keydown', keyDownHandler);

  // ---- Flux Listeners --------------

  _pubsub
    // Plugin Registration Listeners.
    .subscribe(events.register.loader, registerLoader)
    .subscribe(events.register.widget, registerWidget)
    .subscribe(events.register.converter, registerConverter)
    .subscribe(events.register.transformer, registerTransformer)
    // Require assets.
    .subscribe(events.app.require.tools, appRequire('tools'))
    .subscribe(events.app.require.loaders, appRequire('loaders'))
    .subscribe(events.app.require.widgets, appRequire('widgets'))
    .subscribe(events.app.require.converters, appRequire('converters'))
    // Listener for native File explorator.
    .subscribe(events.load.file, _fileLoader.load)
    // Handle errors with content.
    .subscribe(events.content.error, errorLogger)
    // Event generated by Loaders, when conten is ready.
    .subscribe(events.content.ready, updateFluxContent)
    // Render widget content.
    .subscribe(events.ui.widget.render, renderWidgetContent)
    // Finalize -> send notification.
    .publish(events.app.initialized);
};

// Public API.
export default { init, install }
