//
// All Transformers should to return single DOM element or ARRAY of elememts.
//

// ---- TITLE --------------------

// Transform @elements into HTML Heading.
const title = (({strip, createElement}) => {
  return {
    name: 'title',
    tooltip: 'Tytuł',
    icon: '<i class="material-icons">title</i>',
    format (elements) {
      const com = {
        content: elements.reduce((result, element) => result += ' ' + strip(element), '')
      };
      return { com, dom: createElement('h1.title', com.content, 'title') }
    }
  }
})(FluxUtils);


// ---- HEADING --------------------

// Transform @elements into HTML Heading.
const heading = (({strip}) => {
  return {
    name: 'heading',
    tooltip: 'Nagłówek',
    icon: '<i class="material-icons">format_size</i>',
    format (elements) {
      const com = {
        content: elements.reduce((result, element) => result += ' ' + strip(element), '')
      };
      return { com, dom: createElement('h1', com.content, 'default') }
    }
  }
})(FluxUtils);


// ---- PARAGRAPH ------------------

// Transform @elements into HTML Paragraph.
const paragraph = (({createElement}) => {
  return {
    name: 'paragraph',
    tooltip: 'Paragraf',
    icon: '<i class="material-icons">sort</i>',
    format (elements) {
      const com = {
        content: elements.reduce((result, element) => result += ' ' + strip(element), '')
      };
      return { com, dom: createElement ('p', com.content, 'default')};
    }
  }
})(FluxUtils);


// ---- CUT ---------------------

// Transform unwrap @elements.
const cut = (() => {
  return {
    name: 'cut',
    tooltip: 'Rozdziel elemementy',
    icon: '<i class="material-icons">content_cut</i>',
    format(elements) {
      const result = [];
      elements.forEach(element => element.children.length > 0 ? result.push(...Array.from(element.children)) : result.push(element.cloneNode(true)));
      return { dom: result };
    }
  }
})();


// ---- REMOVE ------------------

// Transform @elements into empty array (remove elements).
const remove = (() => {
  return {
    name: 'remove',
    tooltip: 'Usuń element',
    shortcut: '46',
    icon: '<i class="material-icons">delete_forever</i>',
    format() { return { dom: [] } }
  }
})();


// ---- FIGURE ------------------

// Transform @elements into HTML Figure.
const figure = (({strip, createElement}) => {

  const getImgSource = (imgstring) => imgstring.match(/src="([^"]+)"/)[1];

  const matchImage = (element) => {
    const match = element.innerHTML.match(/<\s*\/?\s*img\s*.*?>/g);
    return match ? match[0] : '';
  };

  const template = (title, src, caption) => `
    <figure data-flux-type="default" title="${title}">
      <img src="${src}" alt="figure">
      <figcaption>${caption}</figcaption>
    </figure>`;

  return {
    name: 'figure',
    tooltip: 'Figura',
    icon: '<i class="material-icons">image</i>',
    format (elements) {
      const com = { title: '', caption: ''};
      elements.forEach(element => {
        if (!com.src) {
          com.title += ' ' + strip(element);
          com.src = getImgSource(matchImage(element));
        }
        else {
          com.caption += ' ' + strip(element);
        }
      });

      return {
        dom: Array.from(createElement('div', template(com.title, com.src, com.caption)).children),
        com : {
          src: 'imeges/1.jpeg',
          title: (com.title.trim().length > 0 ? com.title.trim() : undefined),
          caption: (com.caption.trim().length > 0 ? com.caption.trim() : undefined),
        }
      }
    }
  }
})(FluxUtils);


// ---- EXERCISE ------------------

// Transform @elements into HTML Exercise.
const exercise = (({strip, createElement}) => {
  const _solution = (content) => content ? `<div class="exercise__answers">${content}</div>` : '';

  const template = ({ label, problem, solution }) => `
    <div data-flux-type="exercise" class="exercise">
      <h3>${label}</h3>
      <div class="exercise__content">
        ${problem}
      </div>
      ${_solution(solution)}
    </div>`;

  return {
    name: 'exercise',
    tooltip: 'Zadanie',
    icon: '<i class="material-icons">assignment_turned_in</i>',
    format(elements) {
      if(elements.length > 3) throw new Error('Too many elements selected');
      const com = {
        label: elements[0].innerHTML,
        problem: elements[1].innerHTML,
        solution: elements[2] ? _solutions(elements[2].innerHTML) : ''
      };
      return { com, dom: Array.from(createElement('div', template(com)).children) }
    }
  }
})(FluxUtils);



// ---- DEFINITION ------------------

// Transform @elements into empty array (remove elements).
const definition = (({createElement}) => {
  return {
    name: 'definition',
    tooltip: 'Definicja',
    icon: '<i class="material-icons">format_quote</i>',
    format(elements) {
      const wrapper = createElement('div');
      wrapper.classList.add('definition');
      elements.forEach(element => {
        console.log(element);
        wrapper.appendChild(element.cloneNode(true))
      });
      // FIXME: Add correct Content Object Model.
      return { dom: [wrapper] };
    }
  }
})(FluxUtils);
