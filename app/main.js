// Get Flux Core.
import Flux from "./modules/flux";
import mammothConfig from "./configs/mammoth";

// Flux Styles.
require('./styles/style.scss');


Flux.install([]);
Flux.init(mammothConfig);



/*
Flux.init({
  mammoth : mammothConfig,
  convert: [
    CNXTitle,
    CNXTitleEnd,
    CNXHeading,
    CNXParagraph,
    CNXEmphasis,
    CNXExercise,
    CNXFigure
  ],
  transform: [
    title,
    heading,
    paragraph,
    figure,
    exercise,
    definition,
    cut,
    remove
  ],
  widgets : [
    colections,
    figures,
    // links,
    equations,
    // infos,
    // generator
  ]
});
*/
