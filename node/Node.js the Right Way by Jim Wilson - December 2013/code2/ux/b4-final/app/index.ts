// Bootstrap styles and custom application styles.
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

// Bootstrap additions to jQuery.
import 'bootstrap';

import * as templates from './templates.ts';

document.body.innerHTML = templates.main();

const mainElement = document.body.querySelector('.main');

const getBundles = async () => {
  const esRes = await fetch('/es/b4/bundle/_search', {
    method: 'POST',
    body: '{"size":1000}',
  });

  const esResBody = await esRes.json();

  return esResBody.hits.hits.map(hit => ({
    id: hit._id,
    name: hit._source.name,
  }));
};

const listBundles = bundles => {
  mainElement.innerHTML = templates.listBundles({bundles});

  const form = mainElement.querySelector('form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = form.querySelector('input').value;
    addBundle(name);
  });

  const deleteButtons = mainElement.querySelectorAll('button.delete');
  for (let i = 0; i < deleteButtons.length; i++) {
    const deleteButton = deleteButtons[i];
    deleteButton.addEventListener('click', event => {
      deleteBundle(deleteButton.getAttribute('data-id'));
    });
  }
};

/**
 * Create a new bundle with the give name, then list bundles.
 */
const addBundle = async (name) => {
  try {
    const bundles = await getBundles();

    const url = `/api/bundle?name=${encodeURIComponent(name)}`;
    const res = await fetch(url, {method: 'POST'});
    const resBody = await res.json();

    bundles.push({id: resBody._id, name});

    await listBundles(bundles);

    showAlert(`Bundle "${name}" created!`, 'success');
  } catch (err) {
    showAlert(err);
  }
};

/**
 * Delete the bundle with the specified ID, then list bundles.
 */
const deleteBundle = async (id) => {
  try {
    const bundles = await getBundles();

    const idx = bundles.findIndex(bundle => bundle.id === id);
    if (idx === -1) {
      throw Error(`No bundle with id "${id}" was found.`);
    }

    await fetch(`/api/bundle/${encodeURIComponent(id)}`, {method: 'DELETE'});

    bundles.splice(idx, 1);

    await listBundles(bundles);

    showAlert(`Bundle deleted!`, 'success');
  } catch (err) {
    showAlert(err);
  }
};

const getBundle = async (bundleId) => {
  const res = await fetch(`/api/bundle/${encodeURIComponent(bundleId)}`);
  const resBody = await res.json();
  return {
    id: resBody._id,
    bundle: resBody._source,
  };
};

const getBook = async (bookId) => {
  const esRes = await fetch(`/es/books/book/${encodeURIComponent(bookId)}`);
  const esResBody = await esRes.json();
  return {
    id: bookId,
    book: esResBody._source,
  };
};

/**
 * Given a bundle's ID and the bundle itself, render a view of the bundle.
 */
const viewBundle = async (id, bundle) => {
  try {
    mainElement.innerHTML = templates.viewBundle({id, bundle});

    const form = mainElement.querySelector('form');
    const input = form.querySelector('input');
    const resultsElement = mainElement.querySelector('.search-results');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const url = `/api/search/books/title/${encodeURIComponent(input.value)}`;
      const res = await fetch(url);
      const resBody = await res.json();

      resultsElement.innerHTML = templates.listSearchResults(resBody);

      const addButtons = resultsElement.querySelectorAll('button.add');
      for (let i = 0; i < addButtons.length; i++) {
        const addButton = addButtons[i];
        addButton.addEventListener('click', event => {
          addBookToBundle(id, addButton.getAttribute('data-id'),
              addButton.getAttribute('data-title'));
        });
      }
    });

    const deleteButtons = mainElement.querySelectorAll('button.delete');
    for (let i = 0; i < deleteButtons.length; i++) {
      const deleteButton = deleteButtons[i];
      deleteButton.addEventListener('click', event => {
        removeBookFromBundle(id, deleteButton.getAttribute('data-id'),
            deleteButton.getAttribute('data-title'));
      });
    }

    let counter = 0;

    input.addEventListener('input', async (event) => {
      const words = input.value.trim().split(/\b/);

      if (!words.length) {
        return;
      }

      const last = words.pop();

      const ticket = ++counter;

      const url = `/api/suggest/title/${encodeURIComponent(last)}`;
      const res = await fetch(url);
      const resBody = await res.json();

      if (ticket !== counter) {
        return;  // Ignore stale request.
      }

      if (!resBody.length || !resBody[0].length) {
        return;
      }

      input.list.innerHTML = templates.options(
          resBody[0].options.map(option => words.join('') + option.text));
    });
  } catch (err) {
    showAlert(err);
  }
};

/**
 * Given a bundle and a book to add, add the book then show the bundle.
 */
const addBookToBundle = async (bundleId, bookId, title) => {
  try {
    const {bundle} = await getBundle(bundleId);

    await fetch(`/api/bundle/${encodeURIComponent(bundleId)}` +
        `/book/${encodeURIComponent(bookId)}`, {method: 'PUT'});

    bundle.books.push({id: bookId, title});

    await viewBundle(bundleId, bundle);
    
    showAlert(`Added "${title}" to bundle.`, 'success');
  } catch (err) {
    showAlert(err);
  }
};

/**
 * Given a bundle and a book in that bundle, remove the book then show the
 * bundle view.
 */
const removeBookFromBundle = async (bundleId, bookId, title) => {
  try {
    const {bundle} = await getBundle(bundleId);

    await fetch(`/api/bundle/${encodeURIComponent(bundleId)}` +
        `/book/${encodeURIComponent(bookId)}`, {method: 'DELETE'});

    bundle.books = bundle.books.filter(book => book.id !== bookId);

    await viewBundle(bundleId, bundle);
    
    showAlert(`Removed "${title}" from bundle.`, 'success');
  } catch (err) {
    showAlert(err);
  }
};

/**
 * Given a book, render a view of it.
 */
const viewBook = async (bookId, book) => {
  const url = bookId.replace(/^pg/, 'http://www.gutenberg.org/ebooks/');
  mainElement.innerHTML = templates.viewBook({url, book});
};

/**
 * Display an alert (notification) at the top of the main content area.
 */
const showAlert = (message, type = 'danger') => {
  const content = templates.alert({message, type});
  mainElement.insertAdjacentHTML('afterbegin', content);
};

/**
 * Use Window location hash to show the specified view.
 */
const showView = async () => {
  const [view, ...params] = window.location.hash.split('/');

  switch (view) {
    case '#welcome':
      mainElement.innerHTML = templates.welcome();
      break;
    case '#list-bundles':
      const bundles = await getBundles();
      await listBundles(bundles);
      break;
    case '#view-bundle':
      const {id: bundleId, bundle} = await getBundle(params[0]);
      await viewBundle(bundleId, bundle);
      break;
    case '#view-book':
      const {id: bookId, book} = await getBook(params[0]);
      await viewBook(bookId, book);
      break;
    default:
      // Unrecognized view.
      throw Error(`Unrecognized view: ${view}`);
  }
};

window.addEventListener('hashchange', showView);

showView().catch(err => window.location.hash = '#welcome');
