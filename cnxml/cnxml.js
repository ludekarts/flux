const cnxmlElements = (function({createElement}) {

  // <section>.
  const section = {
    tag: 'section',
    title: 'Section',
    icon: '<i class="material-icons">view_stream</i>',
    template: (uid) =>
      `<div id="${uid()}" data-type="section">CONTENT</div>`,
    wrapp: (uid) =>
      createElement(`div[id="${uid()}" data-type="section"]`)
  };

  // <title>.
  const title = {
    tag: 'title',
    title: 'Title',
    icon: '<i class="material-icons">title</i>',
    template: (uid) =>
      `<div data-type="title">TITLE</div>`,
    wrapp: (uid) =>
      createElement(`div[data-type="title"]`)
  };

  // <para>.
  const para = {
    tag: 'para',
    title: 'Paragraph',
    icon: '<i class="material-icons">subject</i>',
    template: (uid) =>
      `<div id="${uid()}" data-type="para">PARA</div>`,
    wrapp: (uid) =>
      createElement(`div[id="${uid()}" data-type="para"]`)
  };

  // <term>.
  const term = {
    tag: 'term',
    title: 'Term',
    icon: '<i class="material-icons">book</i>',
    template: (uid) =>
      `<term>TERM</term>`,
    wrapp: (uid) =>
      createElement(`term`)
  };

  // <reference> to <link>.
  const reference = {
    tag: 'reference',
    title: 'Reference',
    icon: '<i class="material-icons">link</i>',
    template: (uid) =>
      `<reference>REFERENCE</reference>`,
    wrapp: (uid) =>
      createElement(`reference`)
  };

  // <note>.
  const note = {
    tag: 'note',
    title: 'Note',
    icon: '<i class="material-icons">receipt</i>',
    template: (uid) =>
      `<div id="${uid()}" data-type="note">CONTENT</div>`,
    wrapp: (uid) =>
      createElement(`div[id="${uid()}" data-type="note"]`)
  };

  // <problem>
  const problem = {
    tag: 'problem',
    title: 'Problem',
    icon: '<i class="material-icons">assignment_late</i>',
    template: (uid) =>
      `<div id="${uid()}" data-type="problem">
        <div id="${uid()}" data-type="para">PROBLEM</div>
      </div>`,
    wrapp: (uid) =>
      createElement(`div[id="${uid()}" data-type="problem"]`)
  };

  // <solution>
  const solution = {
    tag: 'solution',
    title: 'Solution',
    icon: '<i class="material-icons">assignment_turned_in</i>',
    template: (uid) =>
      `<div id="${uid()}" data-type="solution">
        <div id="${uid()}" data-type="para">SOLUTION</div>
      </div>`,
    wrapp: (uid) =>
      createElement(`div[id="${uid()}" data-type="solution"]`)
  };

  // <exercise>
  const exercise = {
    tag: 'exercise',
    title: 'Exercise',
    extend: [problem, solution],
    icon: '<i class="material-icons">assignment</i>',
    template: (uid) =>
      `<div id="${uid()}" data-type="exercise">
        <div id="${uid()}" data-type="problem">
          <div id="${uid()}" data-type="para">PROBLEM</div>
        </div>
        <div id="${uid()}" data-type="solution">
          <div id="${uid()}" data-type="para">SOLUTION</div>
        </div>
      </div>`,
    wrapp: (uid) =>
      createElement(`div[id="${uid()}" data-type="exercise"]`)
  };

  // <solution>
  const caption = {
    tag: 'caption',
    title: 'Caption',
    icon: '<i class="material-icons">short_text</i>',
    template: (uid) =>
      `<div data-type="caption">CAPTION</div>`,
    wrapp: (uid) =>
      createElement(`div[data-type="caption"]`)
  };

  // <media>
  const media = {
    tag: 'media',
    title: 'Image',
    icon: '<i class="material-icons">crop_original</i>',
    template: (uid) =>
      `<div id="${uid()}" data-type="media" alt="alt text here">
        <img src="images/empty.jpg" mime-type="image/jpeg" />
      </div>`,
    wrapp: (uid) =>
      createElement(`div[id="${uid()}" data-type="media" alt="alt text here"]`, '<img src="images/empty.jpg" mime-type="image/jpeg" />')
  };

  // <figure>
  const figure = {
    tag: 'figure',
    title: 'Figure',
    extend: [media, caption],
    icon: '<i class="material-icons">image</i>',
    template: (uid) =>
      `<div id="${uid()}" data-type="figure">
        <div data-type="title">TITLE</div>
        <div id="${uid()}" data-type="media" alt="alt text here">
          <img src="images/empty.jpg" mime-type="image/jpeg" />
        </div>
        <div data-type="caption">
          CAPTION
        </div>
      </div>`,
    wrapp: (uid) =>
      createElement(`div[id="${uid()}" data-type="figure"]`)
  };

  // <item>.
  const item = {
    tag: 'item',
    title: 'List Item',
    icon: '<i class="material-icons">label</i>',
    template: (uid) =>
      `<div data-type="item">ITEM</div>`,
    wrapp: (uid) =>
      createElement(`div[data-type="item"]`)
  };

  // <list>
  const list = {
    tag: 'list',
    title: 'List',
    extend: [item],
    icon: '<i class="material-icons">list</i>',
    template: (uid) =>
      `<div id="${uid()}" data-type="list">
        <div data-type="title">TITLE</div>
        <div data-type="item">ITEM</div>
      </div>`,
    wrapp: (uid) =>
      createElement(`div[id="${uid()}" data-type="list"]`)
  };


  // Math wrapper
  const math = {
    tag: 'math',
    title: 'Content with math',
    icon: '<i class="material-icons">plus_one</i>',
    template: (uid) =>
      `<div data-type="math">MATH</div>`,
    wrapp: (uid) =>
      createElement(`div[data-type="math"]`)
  };

  // <equation>
  const equation = {
    tag: 'equation',
    title: 'Equation',
    extend: [math],
    icon: '<i class="material-icons">functions</i>',
    template: (uid) =>
      `<div id="${uid()}" data-type="equation">
        <div data-type="title">TITLE</div>
        <div data-type="math">MATH</div>
      </div>`,
    wrapp: (uid) =>
      createElement(`div[id="${uid()}" data-type="equation"]`)
  };

  // <example>.
  const example = {
    tag: 'example',
    title: 'Example',
    icon: '<i class="material-icons">playlist_add_check</i>',
    template: (uid) =>
      `<div id="${uid()}" data-type="example">EXAMPLE</div>`,
    wrapp: (uid) =>
      createElement(`div[id="${uid()}" data-type="example"]`)
  };

  // <meaning>.
  const meaning = {
    tag: 'meaning',
    title: 'Meaning',
    icon: '<i class="material-icons">subtitles</i>',
    template: (uid) =>
      `<div id="${uid()}" data-type="meaning">MEANING</div>`,
    wrapp: (uid) =>
      createElement(`div[id="${uid()}" data-type="meaning"]`)
  };

  // <definition>
  const definition = {
    tag: 'definition',
    title: 'Definition',
    extend: [meaning, example],
    icon: '<i class="material-icons">check_box</i>',
    template: (uid) =>
      `<div id="${uid()}" data-type="definition">
        <term>TERM</term>
        <div id="${uid()}" data-type="meaning">MEANING</div>
        <div id="${uid()}" data-type="example">EXAMPLE</div>
      </div>`,
    wrapp: (uid) =>
      createElement(`div[id="${uid()}" data-type="definition"]`)
  };


  // Export elements.
  return [section, title, para, note, list, exercise, reference, figure, equation, term, example, definition];
}(utils));
