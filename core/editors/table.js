const tableEditor = (function({createElement, template}) {

  let targetElement;

  const refs = {
    summary: createElement('textarea.input[placeholder="Summary"]'),
    title: createElement('input.input[type="text" placeholder="Title"]'),
    theader : createElement('input#theader.input.vmiddle[type="checkbox"]'),
    tcols: createElement('input#tcols.input[type="number" min="1" max="20"]'),
    trows: createElement('input#trows.input[type="number" min="1" max="20"]'),
  };

  const scaffold = `
    div.content >
      @title
      @summary
    div.table-ctrls
      span >
        label[for="theader"] > "Header"
        @theader
      span >
        label[for="trows"] > "Rows"
        @trows
      span >
        label[for="tcols"] > "Cols"
        @tcols
    div.buttons.media >
      button[data-action="save"] > "Save"
      button[data-action="cancel"] > "Cancel"`;

  const element = template(refs, scaffold);

  const activate = (source) => {
    targetElement = source;
    refs.title.value = targetElement.getAttribute('title') || '';
    refs.summary.value = targetElement.getAttribute('summary') || '';
    refs.theader.checked = !!targetElement.querySelector('thead');
    refs.tcols.value = targetElement.getAttribute('cols');
    refs.trows.value = targetElement.querySelectorAll('tbody > tr').length;
  };

  const addColumns = (row, cols) => {
    for (let c=0; c < cols; c++)
      row.appendChild(createElement('td'));
    return row;
  };

  const manageEntries = (source, rows, cols) => {
    if (!source) return;

    let allRows = Array.from(source.querySelectorAll('tr'));
    const colsCount = allRows[0].querySelectorAll('td').length;

    // Add columns.
    if (colsCount < cols) {
      allRows.forEach(row => {
        addColumns(row, cols - colsCount);
      });
    }
    // Remove columns.
    else if (colsCount > cols) {
      allRows.forEach(row => {
        const columns = Array.from(row.querySelectorAll('td'));
        for (let c = cols; c < colsCount; c++) {
          columns[c].parentNode.removeChild(columns[c]);
        }
      });
    }

    // Add rows.
    if (allRows.length < rows) {
      const length = rows - allRows.length;

      for (let r = 0; r < length; r++) {
        const row = createElement('tr');
        source.appendChild(row);
        addColumns(row, cols);
      }
    }
    // Remove rows.
    else if (allRows.length > rows) {
      for (let r = rows; r < allRows.length; r++) {
        allRows[r].parentNode.removeChild(allRows[r]);
      }
    }
  };

  const toggleHeader = (table, checked, head, cols) => {
    if (!checked && head) {
      head.parentNode.removeChild(head);
    }
    else if (checked && !head) {
      table.insertBefore(addColumns(createElement('thead'), cols), table.firstChild);
    }
    else if (checked && head) {
      const columns = Array.from(head.querySelectorAll('td'))
      const colsCount = columns.length;

      // Add columns.
      if (colsCount < cols) {
        addColumns(head.firstElementChild, cols - colsCount);
      }
      // Remove columns.
      else if (colsCount > cols) {
        for (let c = cols; c < colsCount; c++) {
          columns[c].parentNode.removeChild(columns[c]);
        }
      }
    }
  };

  const save = () => new Promise((resolve) => {
    const table = targetElement;
    const cols = refs.tcols.value;
    const rows = refs.trows.value;
    const title = refs.title.value;
    const addHead = refs.theader.checked;
    const summary = refs.summary.value || '';
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    table.setAttribute('cols', cols);
    table.setAttribute('summary', summary);
    title.length > 0 && table.setAttribute('title', title);
    toggleHeader(table, addHead, thead, cols);
    manageEntries(tbody, rows, cols);

    resolve();
  });

  return {element, activate, save};
}(utils));
