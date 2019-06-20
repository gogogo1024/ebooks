import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap-social/bootstrap-social.css';

import 'bootstrap';

import * as templates from './templates.ts';

/**
 * Convenience method to fetch and decode JSON.
 */
const fetchJSON = async (url, method = 'GET') => {
  try {
    const response = await fetch(url, {method, credentials: 'same-origin'});
    return response.json();
  } catch (error) {
    return {error};
  }
};

const getBundles = async () => {
  const bundles = await fetchJSON('/api/list-bundles');
  if (bundles.error) {
    throw bundles.error;
  }
  return bundles;
};

const listBundles = bundles => {
  const mainElement = document.body.querySelector('.b4-main');

  mainElement.innerHTML =
    templates.addBundleForm() + templates.listBundles({bundles});

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
      deleteBundle(deleteButton.getAttribute('data-bundle-id'));
    });
  }
};

/**
 * Delete the bundle with the specified ID, then list bundles.
 */
const deleteBundle = async (bundleId) => {
  try {
    // Delete the bundle, then render the updated list with listBundles().

    const bundles = await getBundles();

    const idx = bundles.findIndex(bundle => bundle.id === bundleId);
    if (idx === -1) {
      throw Error(`No bundle with id "${bundleId}" was found.`);
    }

    const url = `/api/bundle/${encodeURIComponent(bundleId)}`;
    await fetchJSON(url, 'DELETE');

    bundles.splice(idx, 1);

    listBundles(bundles);

    showAlert(`Bundle deleted!`, 'success');
  } catch (err) {
    showAlert(err);
  }
};

/**
 * Show an alert to the user.
 */
const showAlert = (message, type = 'danger') => {
  const alertsElement = document.body.querySelector('.b4-alerts');
  const html = templates.alert({type, message});
  alertsElement.insertAdjacentHTML('beforeend', html);
};

/**
 * Create a new bundle with the give name, then list bundles.
 */
const addBundle = async (name) => {
  try {
    // Grab the list of bundles already created.
    const bundles = await getBundles();

    // Add the new bundle.
    const url = `/api/bundle?name=${encodeURIComponent(name)}`;
    const resBody = await fetchJSON(url, 'POST');

    // Merge the new bundle into the original results and show them.
    bundles.push({id: resBody._id, name});
    listBundles(bundles);

    showAlert(`Bundle "${name}" created!`, 'success');
  } catch (err) {
    showAlert(err);
  }
};

const getBundle = bundleId =>
    fetchJSON(`/api/bundle/${encodeURIComponent(bundleId)}`);

/**
 * Given a bundle's ID and the bundle itself, render a view of the bundle.
 */
const viewBundle = async (id, bundle) => {
  try {
    const mainElement = document.body.querySelector('.b4-main');

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
      const resBody = await fetchJSON(url);

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

    await fetchJSON(`/api/bundle/${encodeURIComponent(bundleId)}` +
        `/book/${encodeURIComponent(bookId)}`, 'PUT');

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

    await fetchJSON(`/api/bundle/${encodeURIComponent(bundleId)}` +
        `/book/${encodeURIComponent(bookId)}`, 'DELETE');

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
const viewBook = async book => {
  const mainElement = document.body.querySelector('.b4-main');
  mainElement.innerHTML = templates.viewBook({book});
};

const getBook = bookId => fetchJSON(`/api/book/${encodeURIComponent(bookId)}`);

/**
 * Use Window location hash to show the specified view.
 */
const showView = async () => {
  const mainElement = document.body.querySelector('.b4-main');
  const [view, ...params] = window.location.hash.split('/');

  switch (view) {
    case '#welcome':
      const session = await fetchJSON('/api/session');
      mainElement.innerHTML = templates.welcome({session});
      if (session.err) {
        showAlert(session.err);
      }
      break;
    case '#list-bundles':
      try {
        const bundles = await getBundles();
        listBundles(bundles);
      } catch (err) {
        showAlert(err);
        window.location.hash = '#welcome';
      }
      break;
    case '#view-bundle':
      try {
        const {id: bundleId, bundle} = await getBundle(params[0]);
        await viewBundle(bundleId, bundle);
      } catch (err) {
      }
      break;
    case '#view-book':
      const book = await getBook(params[0]);
      await viewBook(book);
      break;
    default:
      // Unrecognized view.
      throw Error(`Unrecognized view: ${view}`);
  }
};

// Page setup.
(async () => {
  const session = await fetchJSON('/api/session');
  document.body.innerHTML = templates.main({session});
  window.addEventListener('hashchange', showView);
  showView().catch(err => window.location.hash = '#welcome');
})();

