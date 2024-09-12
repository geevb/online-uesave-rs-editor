import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Download } from '../icons';

export function FromJson() {
  const [SAVSave, setSAVSave] = useState<Blob>();
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDropAccepted: async (files: File[]) => {
      const [f] = files;

      let jsonSave: object | null = null;
      try {
        jsonSave = JSON.parse(await f.text());
      } catch (e) {
        console.error('Invalid JSON', e);
        return;
      }

      fetch('http://localhost:8000/api/from_json', {
        method: 'PUT',
        body: JSON.stringify(jsonSave),
        headers: { 'Content-Type': 'application/json' },
      }).then(r => r.blob()).then(setSAVSave)
    },
    maxFiles: 1,
    accept: { 'application/json': ['.json'] },
    onError: console.error
  });

  function onDownload() {
    const [f] = acceptedFiles;
    if (!f || !SAVSave) return;
    const url = window.URL.createObjectURL(SAVSave);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${f.name.replace('.json', '')}.sav`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  return (
    <section className="card">
      <h2>3.</h2>
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>From your updated .JSON, recreate the UE .SAV file</p>
      </div>
      <br/>
      <div style={{visibility: acceptedFiles.length ? 'visible' : 'hidden'}}>
        {SAVSave
          ? (
            <button
              onClick={onDownload}
              title="Download .SAV file"
            >
              <Download/>
            </button>
          )
          : <div className="loader"/>
        }
      </div>
    </section>
  )
}
