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

    if (!f.name.endsWith('.sav')) {
      console.error('Invalid file type');
      return;
    }

    const formData = new FormData();
    formData.append('file', f);

    fetch('http://localhost:8000/to_json', {
      method: 'PUT',
      body: formData,
    }).then(r => r.json()).then(console.log);
  }

  function onDropJSON(acceptedFiles: File[]) {
    const [f] = acceptedFiles;
    if (!f) return;

    fetch('http://localhost:8000/from_json', {
      method: 'PUT',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(r => {
      console.log('r', r);
      return r.blob();  // Convert the response to a Blob
    })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);  // Create a URL for the Blob
        const a = document.createElement('a');  // Create a <a> element
        a.style.display = 'none';  // Hide the element
        a.href = url;  // Set the download URL
        a.download = 'file_name.ext';  // Set the file name and extension
        document.body.appendChild(a);  // Append the element to the body
        a.click();  // Programmatically click the link to trigger download
        window.URL.revokeObjectURL(url);  // Revoke the object URL after download
        document.body.removeChild(a);  // Clean up by removing the <a> element
      })
  }

  function fetchme() {
    fetch('http://localhost:8000/', {
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
        <Dropzone onDrop={onDropJSON} multiple={false}>
          {({getRootProps, getInputProps}) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>DROP JSON TO SAV</p>
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
