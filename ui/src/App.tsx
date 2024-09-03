import { useState } from 'react';
import Dropzone from 'react-dropzone'

import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0)

  function onDrop(acceptedFiles: File[]) {
    const [f] = acceptedFiles;
    if (!f) return;

    const formData = new FormData();
    formData.append('file', f);

    fetch('http://0.0.0.0:8000/upload', {
      method: 'PUT',
      body: formData,
    }).then(r => r.text()).then(console.log);
  }

  function fetchme() {
    fetch('http://0.0.0.0:8000/', {
      method: 'GET',
    }).then(r => r.text()).then(console.log);
  }

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
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={fetchme}>
          Fetch me
        </button>
        <Dropzone onDrop={onDrop} multiple={false}>
          {({getRootProps, getInputProps}) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
