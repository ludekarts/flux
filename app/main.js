// Get Flux Core.
import Flux from "./modules/flux";

// Loaders.
import DOCXLoader from "./loaders/docx";
import HTMLLoader from "./loaders/html";
import XHTMLLoader from "./loaders/xhtml";

// Widgets.
import FiguresWidget from "./widgets/figures";
import FLoaderWidget from "./widgets/floader";

// Flux Styles.
require('./styles/style.scss');

// Initialize Flux.
Flux.init();

// Install Plugins.
Flux.install(FLoaderWidget, HTMLLoader, DOCXLoader, XHTMLLoader, FiguresWidget);
