const cnxmlElements = (function({createElement}) {

  // <section>.
  const section = {
    tag: 'section',
    title: 'Section',
    icon: '<i class="material-icons">view_stream</i>',
    template: (uid) =>
      `<div id="${uid()}" data-type="section">Content here.</div>`,
    wrapp: (uid) =>
      createElement(`div[id="${uid()}" data-type="section"]`)
  };

  // <title>.
  const title = {
    tag: 'title',
    title: 'Title',
    icon: '<i class="material-icons">title</i>',
    template: (uid) =>
      `<div data-type="title">Title here.</div>`,
    wrapp: (uid) =>
      createElement(`div[data-type="title"]`)
  };

  // <para>.
  const para = {
    tag: 'para',
    title: 'Paragraph',
    icon: '<i class="material-icons">subject</i>',
    template: (uid) =>
      `<div id="${uid()}" data-type="para">Content here.</div>`,
    wrapp: (uid) =>
      createElement(`div[id="${uid()}" data-type="para"]`)
  };

  // <term>.
  const term = {
    tag: 'term',
    title: 'Term',
    icon: '<i class="material-icons">book</i>',
    template: (uid) =>
      `<term>Term here.</term>`,
    wrapp: (uid) =>
      createElement(`term`)
  };

  // <reference> to <link>.
  const reference = {
    tag: 'reference',
    title: 'Reference',
    icon: '<i class="material-icons">link</i>',
    template: (uid) =>
      `<reference>Reference here.</reference>`,
    wrapp: (uid) =>
      createElement(`reference`)
  };

  // <note>.
  const note = {
    tag: 'note',
    title: 'Note',
    icon: '<i class="material-icons">receipt</i>',
    template: (uid) =>
      `<div data-type="note">Content here.</div>`,
    wrapp: (uid) =>
      createElement(`div[data-type="note"]`)
  };

  // <problem>
  const problem = {
    tag: 'problem',
    title: 'Problem',
    icon: '<i class="material-icons">assignment_late</i>',
    template: (uid) =>
      `<div id="${uid()}" data-type="problem">
        <div id="${uid()}" data-type="para">Problem here.</div>
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
        <div id="${uid()}" data-type="para">Solution here.</div>
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
          <div id="${uid()}" data-type="para">Problem here.</div>
        </div>
        <div id="${uid()}" data-type="solution">
          <div id="${uid()}" data-type="para">Solution here.</div>
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
      `<div data-type="caption">Caption here.</div>`,
    wrapp: (uid) =>
      createElement(`div[id="${uid()}" data-type="caption"]`)
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
        <div data-type="title">Title here.</div>
        <div id="${uid()}" data-type="media" alt="alt text here">
          <img src="images/empty.jpg" mime-type="image/jpeg" />
        </div>
        <div data-type="caption">
          Caption here.
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
      `<div data-type="item">Item here.</div>`,
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
        <div data-type="title">Title here.</div>
        <div data-type="item">Item here.</div>
      </div>`,
    wrapp: (uid) =>
      createElement(`div[id="${uid()}" data-type="list"]`)
  }

  // Content with math.
  const ctm = {
    tag: 'math',
    title: 'Content with math',
    icon: '<i class="material-icons">code</i>',
    template: (uid) =>
      `<div data-type="math">MATH</div>`,
    wrapp: (uid) =>
      createElement(`div[data-type="math"]`)
  };

  // <eqiation>
  const eqiation = {
    tag: 'eqiation',
    title: 'Eqiation',
    icon: '<i class="material-icons">functions</i>',
    template: (uid) =>
      `<div id="${uid()}" data-type="eqiation">
        <div data-type="title">Title here.</div>
        <div data-type="math">MATH</div>
      </div>`,
    wrapp: (uid) =>
      createElement(`div[id="${uid()}" data-type="eqiation"]`)
  }

  return [section, title, para, note, list, exercise, reference, figure, eqiation, term, ctm];
}(utils));
