// Get Flux Core.
import Flux from "./modules/flux";

// Loaders.
import HTMLLoader from "./loaders/html";
import DOCXLoader from "./loaders/docx";

// Widgets.
import FiguresWidget from "./widgets/figures";

// Flux Styles.
require('./styles/style.scss');

// Initialize Flux.
Flux.init();

// Install Plugins.
Flux.install(HTMLLoader, DOCXLoader, FiguresWidget);
