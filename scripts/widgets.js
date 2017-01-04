
// ---- COLLECTIONS WIDGRT ----------------

const colections = (({ createElementWOL }, t5) => {
  const _collections = [], _model = [], _errors = [];
  const template = createElementWOL({ type: 'div.collection-widget' });

  // Create element helper.
  const createItem = (id, title, color) => {
    return createElementWOL({
      type: 'div.collection-widget-item.cfx',
      content : [{
          type: 'a.collection-widget-header',
          content: `<span class="dotMarker" style="background:${color}"></span> ${title.slice(0,25)}...`,
          attrs: [['href', '#head_' + id]]
        },{
          type: 'a.collection-widget-hook',
          attrs: [['href', '#tail_' + id]],
          content: '<i class="material-icons">vertical_align_bottom</i>'
        }]
    });
  };

  // Check if A or B encloses eachother.
  const enclose = (A, B) => {
    let x1, y1, x2, y2;
    if (A[0] < B[0]) {
      [x1, y1] = A; [x2, y2] = B;
    }
    else {
      [x1, y1] = B; [x2, y2] = A;
    }
    return (y1 <= x2 || x1 >= y2) || (y1 >= y2);
  };

  // Find new Collections.
  const registerCollection = (collection) => {
    const reference = createItem(collection.id, collection.head.innerHTML, collection.color);
    _collections.push(collection);
    _model.push(reference);
    template.appendChild(reference);
  };

  // Arange collcerions.
  const fitRange = (docxElements) => {
    const _toVerify = [];

    // Clear list errors.
    _errors.forEach(err => err.classList.remove('error'));

    // Check right oreder of arrays.
    _collections.forEach((coll, index) => {
      // Clear previous errors.
      coll.tail.classList.remove('collection-error');
      // Check order.
      const headIndex = docxElements.indexOf(coll.head);
      const tailIndex = docxElements.indexOf(coll.tail);
      if (headIndex > tailIndex){
        coll.tail.classList.add('collection-error');
        _errors.push(_model[index]);
        _model[index].classList.add('error');
      } else {
        // Accept item for further processing.
        _toVerify.push([headIndex, tailIndex]);
      }
    });

    // In no error since now start final processing.
    if (_toVerify.length === _collections.length) {
      let range = _toVerify.length;
      _toVerify.forEach((point, index) => {
        for(let i = index + 1; i < range; i++) {
          if (!enclose(point, _toVerify[i])) {
            docxElements[point[1]].classList.add('collection-error');
            docxElements[_toVerify[i][1]].classList.add('collection-error');
            _errors.push(_model[index]);
            _errors.push(_model[i]);
            _model[index].classList.add('error');
            _model[i].classList.add('error');
          }
        }
      });
    }
  };

  const init = ({subscribe, publish}) => {
    subscribe('registerCollection', registerCollection).subscribe('contentOrderChanged', fitRange);
    return template;
  };

  return {
    init,
    name: 'colections',
    tooltip: 'Kolekcje',
    icon: '<i class="material-icons">view_day</i>',
  }
})(FluxUtils2, t5);



// ---- FIGURES WIDGRT ----------------


const figures = (({ createElementWOL }, t5) => {
  let images;
  const template = createElementWOL({ type: 'ul.figures-widget' });

  const figure = (src) =>{
    return createElementWOL({
      type: 'li.figures-widget-card.cfx',
      content: `
        <div class="crop">
          <img src="${src}" alt="image">
        </div>
        <div class="figures-widget-data">
          <div><button><i class="material-icons">file_upload</i></button></div>
          <div class="header">Pospis</div>
          <div class="caption"> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </div>
        </div>`
    });
  };

  const fetchImages = (docx) => {
    images = Array.from(docx.querySelectorAll('img'))
    images.forEach(image => template.appendChild(figure(image.src)))
  };

  const init = ({subscribe, publish}) => {
    subscribe('docxParsed', fetchImages);
    return template;
  };

  return {
    init,
    name: 'figures',
    tooltip: 'Grafiki',
    icon: '<i class="material-icons">image</i>',
  }
})(FluxUtils2, t5);



// ---- EQUATIONS WIDGRT ----------------


const equations = (({ createElementWOL, eventDelegate }, MathJax) => {

  let _host, mathClickHadle;
  const _triggers = [];

  const editMathInline = (event) => {
    console.log(event.target.nextSibling.children[2].innerText);
  };

  const collectMath = (docx) => {
    mathClickHadle = eventDelegate('span.math-trigger', 'click', editMathInline ,docx)
    Array.from(docx.querySelectorAll('.math')).map((eq, index) => {
      return eq.innerHTML = `$${eq.innerHTML}$`;
    });
    MathJax.Hub.Typeset();
  };

  const findMathSiblings = (maths) => {
    if (maths.length > 0) {
      let newmath = createElementWOL({ type: 'span.math' });
      maths[0].parentNode.insertBefore(newmath, maths[0]);

      let merge = maths.reduce((result, math) => {
        result += math.innerText;
        math.parentNode.removeChild(math);
        return result;
      }, '');

      newmath.innerHTML = `$ ${merge} $`;
      // Render new node with MathJax.
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, newmath]);
    }
  };

  const resetTriggers = () => {
    _triggers.forEach(trigger => _host.removeChild(trigger));
  };

  const checkFofMath = (bucket) => {
    if (bucket.count() === 1) {
      
      _host = bucket.content(0);
      const maths = Array.from(_host.querySelectorAll('.math'));
      // findMathSiblings(maths);

      // Add math edit Triggers.
      if (maths.length > 0) {
        maths.forEach(element => {
          let ontop = createElementWOL({ type: 'span.math-trigger'});
          ontop.style.top = element.offsetTop;
          ontop.style.left = element.offsetLeft;
          ontop.style.width = element.offsetWidth + 'px',
          ontop.style.height = element.offsetHeight + 'px';
          element.parentNode.insertBefore(ontop, element);
          _triggers.push(ontop);
        });
      }
    } else {
      return false;
    }
  };

  const init = ({subscribe, publish}) => {
    // Configure MathJax.
    MathJax.Hub.Config({
      showProcessingMessages: false,
      tex2jax: { inlineMath: [['$','$'],['\\(','\\)']] }
    });

    subscribe('docxParsed', collectMath).subscribe('elementSelected', checkFofMath);

    return createElementWOL({
      type: 'div.equations',
      content: 'Equations'
    });
  };

  return {
    init,
    name: 'equations',
    tooltip: 'Rownania',
    icon: '<i class="material-icons">functions</i>',
  }
})(FluxUtils2, MathJax);



const links ='';
const infos ='';
const generator ='';
