
/* ---- FLUX Transformers ---- */

// ---- TITLE --------------------

// Transform @elements into HTML Title.
const title = (({strip, uid, createElementWOL, randomColor}) => {
  return {
    name: 'title',
    tooltip: 'Tytuł',
    icon: '<i class="material-icons">title</i>',
    format ({subscribe, publish}) {
      return (elements) => {
        const id = uid();
        const color = randomColor();
        const com = { content: elements.reduce((result, element) => result += ' ' + strip(element), '') };
        const dom = [
          createElementWOL({
            type: 'h1.title.stripeMarker',
            content: com.content,
            dataset: [['fluxType','title']],
            attrs: [['id', 'head_' + id], ['style', 'border-color:' + color]]
          }),
          createElementWOL({
            type: 'div.fluxHandle',
            content: `<span class="dotMarker" style="background:${color}"></span> Koniec sekcji: ${com.content.slice(0,25)}...`,
            attrs: [['id', 'tail_' + id]],
            dataset: [['fluxType','fluxHandle']],
          })
        ];
        // Setd notification (to widget).
        publish('registerCollection', { id, head: dom[0], tail: dom[1], color });
        return { com, dom }
      }
    }
  }
})(FluxUtils2);


// ---- HEADING --------------------

// Transform @elements into HTML Heading.
const heading = (({strip}) => {
  return {
    name: 'heading',
    tooltip: 'Nagłówek',
    icon: '<i class="material-icons">format_size</i>',
    format ({subscribe, publish}) {
      return (elements) => {
        const com = {
          content: elements.reduce((result, element) => result += ' ' + strip(element), '')
        };
        return { com, dom: createElement('h1', com.content, 'default') }
      }
    }
  }
})(FluxUtils2);


// ---- PARAGRAPH ------------------

// Transform @elements into HTML Paragraph.
const paragraph = (({strip, createElement}) => {
  return {
    name: 'paragraph',
    tooltip: 'Paragraf',
    icon: '<i class="material-icons">sort</i>',
    format ({subscribe, publish}) {
      return (elements) => {
        const com = {
          content: elements.reduce((result, element) => result += ' ' + strip(element), '')
        };
        return { com, dom: createElement ('p', com.content, 'default')};
      }
    }
  }
})(FluxUtils2);


// ---- CUT ---------------------

// Transform unwrap @elements.
const cut = (() => {
  return {
    name: 'cut',
    tooltip: 'Rozdziel elemementy',
    icon: '<i class="material-icons">content_cut</i>',
    format ({subscribe, publish}) {
      return (elements) => {
        const result = [];
        elements.forEach(element => element.children.length > 0 ? result.push(...Array.from(element.children)) : result.push(element.cloneNode(true)));
        return { dom: result };
      }
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
    format ({subscribe, publish}) {
      return () => { return { dom: [] } }
    }
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
    format ({subscribe, publish}) {
      return (elements) => {
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
            src: 'BTTF_Cover.jpg',
            title: (com.title.trim().length > 0 ? com.title.trim() : undefined),
            caption: (com.caption.trim().length > 0 ? com.caption.trim() : undefined),
          }
        }
      }
    }
  }
})(FluxUtils2);


// ---- EXERCISE ------------------

// Transform @elements into HTML Exercise.
const exercise = (({strip, createElement}) => {
  const _solution = (content) => content ? `<div class="exercise__answers">${content}</div>` : '';

  const template = ({ label, problem, solution }) => `
    <h3>${label}</h3>
    <div class="exercise__content">
      ${problem}
    </div>
    ${_solution(solution)}`;

  return {
    name: 'exercise',
    tooltip: 'Zadanie',
    icon: '<i class="material-icons">assignment_turned_in</i>',
    format ({subscribe, publish}) {
      return (elements) => {
        if(elements.length > 3) throw new Error('Too many elements selected');
        const com = {
          label: elements[0].innerHTML,
          problem: elements[1].innerHTML,
          solution: elements[2] ? _solution(elements[2].innerHTML) : ''
        };
        return { com, dom: createElement('div.exercise', template(com), 'exercise') }
      }
    }
  }
})(FluxUtils2);



// ---- DEFINITION ------------------

// Transform @elements into empty array (remove elements).
const definition = (({createElement}) => {
  return {
    name: 'definition',
    tooltip: 'Definicja',
    icon: '<i class="material-icons">format_quote</i>',
    format ({subscribe, publish}) {
      return (elements) => {
        const wrapper = createElement('div');
        wrapper.classList.add('definition');
        elements.forEach(element => {
          wrapper.appendChild(element.cloneNode(true))
        });
        // FIXME: Add correct Content Object Model.
        return { dom: wrapper };
      }
    }
  }
})(FluxUtils2);
