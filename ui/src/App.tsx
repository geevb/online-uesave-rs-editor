import { ToJson, FromJson, Step } from './components';

import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>UESave Online</h1>
      <main className="main">
        <ToJson/>
        <Step/>
        <div>2. Edit the .JSON in your favorite editor, e.g. <a href="https://jsoneditoronline.org">JSON Online Editor</a></div>
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
