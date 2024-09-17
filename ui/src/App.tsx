import { ToJson, EditJson, FromJson, Step } from "./components";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <img className="logo" src="/ue.png" alt="UELogo" />
        <img className="logo" src="/rust.png" alt="RustLogo" />
      </div>
      <h1>UESave Online Editor</h1>
      <main className="main">
        <ToJson />
        <Step />
        <EditJson />
        <Step />
        <FromJson />
      </main>
      <p className="donation">
        If you found this tool useful, consider supporting the maintainers of{" "}
        <a href="https://github.com/trumank/uesave-rs">uesave-rs</a>.
      </p>
    </>
  );
}

export default App;
