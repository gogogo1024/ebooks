import * as Handlebars from '../node_modules/handlebars/dist/handlebars.js';

export const main = Handlebars.compile(`
<div class="container">
  <h1>B4 - Book Bundler</h1>
  <div class="alerts"></div>
  <div class="main"></div>
</div>
`);

export const alert = Handlebars.compile(`
<div class="alert alert-{{type}} alert-dismissible fade in" role="alert">
  <button class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
  {{message}}
</div>
`);

export const welcome = Handlebars.compile(`
<div class="jumbotron">
  <h1>Welcome!</h1>
  <p>
    B4 is an application for creating book bundles.
  </p>
  <p>
    <a href="#list-bundles" class="btn btn-primary btn-lg">
      Go to bundle list
    </a>
  </p>
</div>
`);

export const listBundles = Handlebars.compile(`
<div class="panel panel-default">
  <div class="panel-heading">Create a new bundle.</div>
  <div class="panel-body">
    <form>
      <div class="input-group">
        <input class="form-control" placeholder="Bundle Name" />
        <span class="input-group-btn">
          <button class="btn btn-primary" type="submit">Create</button>
        </span>
      </div>
    </form>
  </div>
</div>

<div class="panel panel-default">
  <div class="panel-heading">Your Bundles</div>
  {{#if bundles.length}}
    <table class="table">
      <thead>
        <tr>
          <th>Bundle Name</th>
          <th class="actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        {{#each bundles}}
        <tr>
          <td>
            <a href="#view-bundle/{{this.id}}">{{this.name}}</a>
          </td>
          <td>
            <button class="btn delete" data-id="{{this.id}}">Delete</button>
          </td>
        </tr>
        {{/each}}
      </tbody>
    </table>
  {{else}}
    <div class="panel-body">
      <p>None yet!</p>
    </div>
  {{/if}}
</div>
`);

export const options = Handlebars.compile(`
{{#each this}}
<option value="{{this}}" />
{{/each}}
`);

export const viewBundle = Handlebars.compile(`
<p>
  <a href="#list-bundles">&laquo; back to bundle list</a>
</p>

<div class="panel panel-default">
  <div class="panel-heading">Add a book to this Bundle</div>
  <div class="panel-body">
    <form>
      <div class="input-group">
        <input class="form-control" list="results" placeholder="Search..." />
        <datalist id="results"></datalist>
        <span class="input-group-btn">
          <button class="btn btn-primary" type="submit">Search</button>
        </span>
      </div>
    </form>
  </div>
  <div class="search-results"></div>
</div>

<div class="panel panel-default">
  <div class="panel-heading">Books in this Bundle</div>
  {{#if bundle.books.length}}
    <table class="table">
      <thead>
        <tr>
          <th>Book Title</th>
          <th class="actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        {{#each bundle.books}}
        <tr>
          <td>
            <a href="#view-book/{{this.id}}">{{this.title}}</a>
          </td>
          <td>
            <button class="btn delete" data-id="{{this.id}}"
                data-title="{{this.title}}">Delete</button>
          </td>
        </tr>
        {{/each}}
      </tbody>
    </table>

  {{else}}
    <div class="panel-body">
      <p>None yet!</p>
    </div>
  {{/if}}
</div>
`);

export const viewBook = Handlebars.compile(`
<h2>{{book.title}}</h2>

<p>
  <a href="{{url}}">{{url}}</a>
</p>

<h3>Authors</h3>
{{#if book.authors.length}}
  <ul>
  {{#each book.authors}}
    <li>{{this}}</li>
  {{/each}}
  </ul>
{{else}}
  <p>None listed.</p>
{{/if}}

<h3>Subjects</h3>
{{#if book.subjects.length}}
  <ul>
  {{#each book.subjects}}
    <li>{{this}}</li>
  {{/each}}
  </ul>
{{else}}
  <p>None listed.</p>
{{/if}}
`);

export const listSearchResults = Handlebars.compile(`
<table class="table">
  <thead>
    <tr>
      <th>Title</th>
      <th class="actions">Actions</th>
    </tr>
  </thead>
  <tbody>
    {{#each this}}
    <tr>
      <td>
        {{this.title}}
      </td>
      <td>
        <button class="btn add"
          data-id="pg{{this.id}}" data-title="{{this.title}}">Add</button>
      </td>
    </tr>
    {{/each}}
  </tbody>
</table>
`);
