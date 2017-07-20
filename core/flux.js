// Flux 3
// Wojciech Ludwin 2017, ludekarts@gmail.com

const flux3 = (function(elements, modal, scrollbar, key, {
  uid, elemntsToCnxml, createElement, elFromString, addToolButton, unwrapElement,
  insertSiblingNode, wrapMath, toCnxml, cleanMath, formatXml, base64, pause, loopstack,
  moveElement, clipboard, setCaret
}) {

  // Global state.
  const state = {
    history: loopstack(15),
    cnxml: elemntsToCnxml(elements)
  };

  // MathJax Config.
  window.MathJax = {
    showProcessingMessages: false,
    messageStyle: "none",
    tex2jax: {
      inlineMath: [["$", "$"]]
    }
  };


  // Set keyboardActions scope to flux3 namesapce.
  key.setScope('flux3');

  // UI References.
  const out = document.querySelector('#out');
  const flux3 = document.querySelector('#flux3');
  const intro = document.querySelector('#intro');
  const close = document.querySelector('#close');
  const confirm = document.querySelector('#confirm');
  const content = document.querySelector('#content');
  const toolbar = document.querySelector('#toolbar');
  const closeOut = document.querySelector('#closeOut');
  const clipInput = document.querySelector('#clipInput');
  const equationsPanel = document.querySelector('[data-mthlib]');
  const toolbox = document.querySelector('#toolbar > div[data-tools-main]');
  const extensions = document.querySelector('#toolbar > div[data-tools-ext]');

  // Init Clipboard copy.
  const clip = clipboard(document.body);

  // Add CNXML tools.
  elements.forEach(addToolButton(toolbox));

  // Add unwrap element.
  toolbox.appendChild(createElement('i.separator'));
  toolbox.appendChild(createElement('button[title="Unwrap" data-action="unwrap"]' , '<i class="material-icons">content_cut</i>'));

  // Equations Panel scrollbar.
  scrollbar.initialize(equationsPanel);


  // ---- Helpers ----------------

  const isInContent = (el) => el.parentNode.closest('#content');

  const openExtensionPanel = (tool) => {
    extensions.innerHTML = '';
    tool.extend.forEach(addToolButton(extensions, true));
    // Add options button.
    if (tool.options) {
      extensions.appendChild(createElement('i.separator'));
      extensions.appendChild(createElement(`button[title="Options" data-action="opts" data-opts="${tool.options}"]` , '<i class="material-icons">settings</i>'));
    }
    extensions.classList.add('open');
  };

  const wrapEquation = wrapMath(content);

  const reRenderMath = (callback) =>
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, wrapEquation, callback]);

  const confirmAnimation = () => {
    confirm.classList.add('show')
    const removeClass = (event) => {
      confirm.classList.remove('show');
      confirm.removeEventListener("animationend", removeClass);
    };
    confirm.addEventListener("animationend", removeClass);
  };

  const importEquations = (source) => {
    source.reverse().forEach((math, index) => {
      const content = (typeof math === 'string' ? math : math.outerHTML);
      equationsPanel.firstElementChild.insertBefore(
        createElement(`button${index === 0 ? '.last' : ''}[data-action="addEq"]`, content),
        equationsPanel.firstElementChild.firstChild
      );
    });
    reRenderMath();
  };

  // ---- Local history ----------

  const recordState = () => {
    state.history.push(cleanMath(content.cloneNode(true)).innerHTML);
  };

  const restoreState = () => {
    // content.innerHTML = state.history.length > 0 ? state.history.pop() : '';
    const ct = state.history.pull();
    if (!ct) return;
    content.innerHTML = ct;
    reRenderMath();
    return false;
  };

  const backupContent = () => {
    try {
      const math = Array
        .from(equationsPanel.querySelectorAll('script'))
        .reverse()
        .map(eq => eq.textContent);

      localStorage.setItem('flux3-ct-backup', JSON.stringify({
        math: math,
        content: cleanMath(content.cloneNode(true)).innerHTML
      }));

    } catch (error) {
      console.error(error);
      alert('Cannot save Backup Copy. See console for more details');
    }
    confirmAnimation();

    return false;
  };

  const restoreContent = () => {
    const backup = JSON.parse(localStorage.getItem('flux3-ct-backup') || false);
    if (!backup.content) return alert('Backup copy does not exist!');
    else {
      content.innerHTML = backup.content;
      if (backup.math) {
        importEquations(backup.math.reverse());
      }
    }
    return false;
  };

  // ---- Event handlers ---------

  const clipController = (evnet) => {
    evnet.preventDefault();

    // Clean clipboard data.
    const clipContent = event.clipboardData.getData('text/plain')
      // Remove empty labels.
      .replace(/<label\s*?\/>/g,'')
      // Remove newlines.
      .replace(/<newline\/*>|<\/newline>/g,'')
      //Replace links.
      .replace(/<link(.+?)\/>/g, (match, attrs) => `<reference ${attrs}>REFERENCE</reference>`)
      // Remove MathML namespace.
      .replace(/<(\/?)m:|\s*xmlns(:m)?\s*="[\s\S\w]+?"/g, (match, slash) => ~match.indexOf('<') ? ('<' + slash) : '');

    // Add entry to edit history.
    recordState();

    // Remove styles before paste.
    document.execCommand("insertHTML", false, clipContent);

    // Search for equations and add it to the equationsPanel.
    if (~clipContent.indexOf('<math>')) {
      importEquations(Array.from(createElement('div', clipContent).querySelectorAll('math')));
    }
  };

  // Detect typing and debounce.
  const saveHistory = pause(({ctrlKey, key}) => {
    if (!ctrlKey && key !== 'Escape') {
      state.history.push(cleanMath(content.cloneNode(true)).innerHTML);
    }
  }, 1500);

  // Hide all UI panels.
  const hidePanels = () => {
    out.classList.remove('show');
    intro.classList.remove('show');
    extensions.classList.remove('open');
    equationsPanel.classList.remove('show');
    return false;
  }

  // Show/Hide equationsPanel.
  const toggleEqPanel = () => {
    equationsPanel.classList.toggle('show');
    return false;
  };

  // Show CNXML output.
  const showCnxm = () => {
    out.classList.add('show');
    out.firstElementChild.value = formatXml(toCnxml(content));
    return false;
  };

  // Add '___' at the end of the element.
  const extendElement = ({target}) => {
    if (!target.lastChild.data) target.appendChild(document.createTextNode('___'));
    else if (target.lastChild.data.trim().length === 0) target.lastChild.data = '___';
  };

  // Detect tool that user select.
  const detectSelectedTool = ({target, altKey, ctrlKey}) => {

    // Detect action.
    const action = target.dataset.action;
    if (!action) return extensions.classList.remove('open');

    // Add entry to edit history.
    recordState();

    // Intersect unwrap action.
    if (action === 'unwrap') return unwrapElement('#content');

    // Detect tool.
    const tool = state.cnxml[action];
    if (!tool || !target.dataset.ext) extensions.classList.remove('open');
    if (tool && tool.extend) openExtensionPanel(tool);

    // Add editable element.
    const selection = window.getSelection();

    if (selection.anchorNode && isInContent(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      // If selection contain end-sapce (double-click on word in Widnows) remove it from selection.
      if (/\s/.test(selectedText.slice(-1))) range.setEnd(range.endContainer, range.endOffset - 1);

      try {
        // Wrapp element / Add template.
        (selectedText.length > 0)
          ? tool.wrapp
            ? range.surroundContents(tool.wrapp(uid))
            : false
          : altKey
            ? ctrlKey
              ? content.appendChild(elFromString(tool.template(uid)))
              : insertSiblingNode(selection.anchorNode, elFromString(tool.template(uid)))
            : range.insertNode(elFromString(tool.template(uid)));

      } catch (e) {
        alert('Cannot add element. Most probably incorrect selection of elements.');
      }

      // Prevent from multiple wrapping in the same spot.
      selection.removeAllRanges();
    }
    else {
      // Add at the end.
      content.appendChild(elFromString(tool.template(uid)));
    }
  };

  // Handle alternative content actions. Alt + Click.
  const detectAltActions = (event) => {

    // Get modifiers.
    const {target, altKey, shiftKey, ctrlKey, keyCode} = event;

    // Element type.
    const type = target.dataset.type;

    // Detect request for extension menu.
    if (altKey && state.cnxml[type] && state.cnxml[type].extend) openExtensionPanel(state.cnxml[type]);

    // Detect request for additional editor + stash current target for options panel.
    if (altKey) modal.show(target);

    // Detect request for options panel.
    if (key.isPressed("f2")) modal.secondary(target);

    // Detect request for element ID.
    if (shiftKey) clip(target.id);

  };

  // Add Math Equation in place where caret is.
  const addMathAtCaret = (mml, callback) => {
    const selection = window.getSelection();
    if (selection.anchorNode && isInContent(selection.anchorNode) ) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if (selectedText.length === 0) {
        // Add entry to edit history.
        recordState();
        range.insertNode(elFromString(mml));
        reRenderMath(callback);
      }
    }
  };

  // Add selected equation after the cursor.
  const addEquation = ({target, altKey}) => {
    if (!target.matches('button')) return;

    // Delete equation button. 'Alt + LMB + Button'.
    if (altKey) return target.parentNode.removeChild(target);

    // Add Equation.
    addMathAtCaret(target.querySelector('script').textContent);
  };

  const addEmptyMathNode = () => {
    addMathAtCaret('<math><mtext>MATH</mtext></math>', () => {
      const latestId = MathJax.Hub.getAllJax(content).map(m => m.inputID).sort().pop();
      if (latestId) modal.show(content.querySelector(`span[data-math-id="${latestId}"]`));
    });
  };


  const removeDuplicates = () => {
    const hashes = [];
    const btnsContainer = equationsPanel.firstElementChild;
    Array.from(btnsContainer.children)
      .forEach(eq => {
        eq.classList.remove('last');
        const hash = base64(eq.querySelector('script').textContent);
        if (!~hashes.indexOf(hash)) hashes.push(hash);
        else btnsContainer.removeChild(eq);
      });
  };

  const toggleIntro = (event) => intro.classList.toggle('show');
  const closeOutput = (event) => out.classList.toggle('show');

  // ---- Detect added element ---

  const acceptNodes = ['DIV', 'REFERENCE', 'EMPHASIS'];

  // Fires on add element to the content.
  const traceMutations = (mutations) =>
    mutations.forEach((mutation) => {
      const node = mutation.addedNodes[0];
      if (!node || !node.tagName) return;
      // Set caret at the end of added element.
      if (~acceptNodes.indexOf(node.tagName)) setCaret(node);
    });

  // Instantiate new observer to track added elements.
  const observer = new MutationObserver(traceMutations);

  // Configure & run.
  observer.observe(content, {childList: true, subtree:true});


  // ---- Keyboard shortcuts -----

  // Panles.
  key('esc, escape', 'flux3', hidePanels);
  key('⌘+space, ctrl+space', 'flux3', toggleEqPanel);
  key('⌥+shift+d, alt+shift+d', 'flux3', removeDuplicates);
  // Edit.
  key('⌥+q, alt+x', 'flux3', showCnxm);
  key('⌘+z, ctrl+z', 'flux3', restoreState);
  key('⌘+s, ctrl+s', 'flux3', backupContent);
  key('⌘+r, ctrl+r', 'flux3', restoreContent);
  key('⌘+q, ctrl+q', 'flux3', addEmptyMathNode);

  // Traverse.
  key('⌘+up, ctrl+up', 'flux3', moveElement.bind(null, '#content', true));
  key('⌘+down, ctrl+down', 'flux3', moveElement.bind(null, '#content', false));


  // ---- Event listeners --------

  flux3.addEventListener('click', toggleIntro);
  close.addEventListener('click', toggleIntro);
  toolbar.addEventListener('click', detectSelectedTool);
  closeOut.addEventListener('click', closeOutput);
  content.addEventListener("keydown", saveHistory);
  content.addEventListener("paste", clipController);
  content.addEventListener('click', detectAltActions);
  content.addEventListener('dblclick', extendElement);
  equationsPanel.addEventListener('click', addEquation);

}(cnxmlElements, Modal, Ps, key, utils));
