import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Copy, Download } from '../icons'

export function ToJson() {
  const [JSONSave, setJSONSave] = useState<object>();
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDropAccepted: (files: File[]) => {
      setJSONSave({})
      const [f] = files;

      const formData = new FormData();
      formData.append('file', f);

      fetch('http://localhost:8000/to_json', {
        method: 'PUT',
        body: formData,
      }).then(r => r.json()).then(({ data }) => setJSONSave(data)).catch(console.error);
    },
    maxFiles: 1,
    accept: { 'application/octet-stream': ['.sav'] },
    onError: console.error
  });

  function onDownload() {
    const [f] = acceptedFiles;
    const blob = new Blob([JSON.stringify(JSONSave, null, 2)])
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${f.name.replace('.sav', '')}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  return (
    <section className="card">
      <h3>1.</h3>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Upload your UE .SAV file and convert it to .JSON</p>
      </div>
      <br/>
      <div style={{ visibility: !acceptedFiles.length ? 'visible' : 'hidden' }}>
        {JSONSave ? (
          <>
            <button onClick={onDownload} title="Download .JSON file"><Download/></button>
            {' '}
            <button onClick={() => navigator.clipboard.writeText(JSON.stringify(JSONSave, null, 2))}
                    title="Copy JSON to clipboard"><Copy /></button>
          </>
        ) : <div className="loader" />}
      </div>
    </section>
  )
}
