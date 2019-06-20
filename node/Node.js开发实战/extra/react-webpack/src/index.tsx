import * as React from "react";
import * as ReactDOM from "react-dom";

export function Welcome(props: {}) {
  return (
    <div className="jumbotron">
      <h1>Welcome!</h1>
      <p>B4 is an application for creating book bundles.</p>
    </div>
  );
}

export class App extends React.Component<undefined, undefined> {
  render() {
    return (
      <div className="container">
        <h1>B4 - Book Bundler</h1>
        <div className="b4-alerts"></div>
        <div className="b4-main">
          <Welcome />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
