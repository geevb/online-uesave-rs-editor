import { ToJson, EditJson, FromJson, Step } from './components';
import './App.css';

function App() {
  return (
    <>
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
