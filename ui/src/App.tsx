import { ToJson, EditJson, FromJson, Step } from './components';

import reactLogo from './assets/react.svg';
import './App.css';

function App() {
  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>UESave Online</h1>
      <main className="main">
        <ToJson/>
        <Step/>
        <EditJson/>
        <Step/>
        <FromJson/>
      </main>
      <p className="donation">
        If you found this tool useful, consider donating to the maintainers of <a href="https://github.com/trumank/uesave-rs">uesave</a>.
      </p>
    </>
  )
}

export default App
