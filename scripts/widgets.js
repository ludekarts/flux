
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
    template.appendChild(reference)
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
    subscribe('parseDocx', fetchImages);
    return template;
  };

  return {
    init,
    name: 'figures',
    tooltip: 'Grafiki',
    icon: '<i class="material-icons">image</i>',
  }
})(FluxUtils2, t5);


const links ='';

const equations ='';

const infos ='';

const generator ='';
