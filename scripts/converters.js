
// ---- SECTION --------------------

// Convert @elements into CNXML Heading.
const CNXTitle = (() => {
  const template = ({ content }) => `<section id="#%UID%#"><title id="#%UID%#">${content}</title>`;
  return {
    match: 'h1.title',
    convert (element) {
      return template(element);
    }
  }
})();

const CNXTitleEnd = (() => {
  return {
    match: 'div.fluxHandle',
    convert (element) {
      return '</section>';
    }
  }
})();


// ---- HEADING --------------------

// Convert @elements into CNXML Heading.
const CNXHeading = (() => {
  const template = ({ content }) => `<title id="#%UID%#">${content}</title>`;
  return {
    match: 'h1',
    convert (element) {
      return template(element);
    }
  }
})();


// ---- PARAGRAPH -----------------

// Convert @elements into CNXML Paragraph.
const CNXParagraph = (() => {
  const template = ({ content }) => `<para id="#%UID%#">${content}</para>`;
  return {
    match: 'p',
    convert (element) {
      return template(element);
    }
  }
})();


// ---- EMPHASIS -----------------

// Convert @elements into CNXML Paragraph.
const CNXEmphasis = (() => {

  const styles = {
    '.italic'    : 'italic',
    '.bold'      : 'bold',
    '.underline' : 'underline',
  };

  const template = (content, effect) => `<emphasis effect="${effect}">${content}</emphasis>`;

  return {
    match: 'strong, em',
    convert (elements) {
      return elements.map((element, index) => template(element.innerHTML, styles[klass] || 'RED'));
    }
  }
})();


// ---- FIGURE --------------------

// Convert @elements into CNXML Figure.
const CNXFigure = (() => {

  const _title = (content) => content ? `<title>${content}</title>` : '';
  const _caption = (content) => content ? `<caption>${content}</caption>` : '';

  const _template = ({ title, src, caption }) => `
    <figure id="#%UID%#">
      ${_title(title)}
      <media id="#%UID%#" alt="">
        <image mime-type="image/jpeg" src="${src}" />
      </media>
      ${_caption(caption)}
    </figure>`;

  return {
    match: 'figure',
    convert (element) {
      return _template (element);
    }
  }
})();


// ---- EXERCISE --------------------

// Convert @elements into CNXML Figure.
const CNXExercise = (() => {

  const _label = (content) => content ? `<label>${content}</label>` : '';

  const _solution = (content) => content ? `
    <solution id="#%UID%#">
      <para id="#%UID%#">
        ${content}
      </para>
    </solution>` : '';

  const _template = ({ label, problem, solution }) => `
    <exercise id="#%UID%#">
      ${_label(label)}
      <problem id="#%UID%#">
        <para id="#%UID%#">
          ${problem}
        </para>
      </problem>
      ${_solution(solution)}
    </exercise>`;

  return {
    match: 'div.exercise',
    convert (element) {
      return _template (element);
    }
  }
})();
