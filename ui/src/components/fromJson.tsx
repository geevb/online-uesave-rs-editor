import Dropzone from 'react-dropzone';

export function FromJson() {

  async function getSavFromJson(acceptedFiles: File[]) {
    const [f] = acceptedFiles;
    if (!f) return;

    if (!f.name.endsWith('.json')) {
      console.error('Invalid file type');
      return;
    }

    let jsonSave = null;
    try {
      jsonSave = JSON.parse(await f.text());
    } catch (e) {
      console.error('Invalid JSON', e);
      return;
    }

    fetch('http://localhost:8000/from_json', {
      method: 'PUT',
      body: JSON.stringify(jsonSave),
      headers: { 'Content-Type': 'application/json' },
    }).then(r => {
      if (!r.ok) throw new Error('Network response was not ok');
      let filename = 'save.sav';
      const contentDisposition = r.headers.get('Content-Disposition');
      if (contentDisposition) {
        const filenamePart = contentDisposition.split(';').map(part => part.trim()).find(p => p.startsWith('filename='));
        if (filenamePart) {
          filename = filenamePart.split('=')[1].trim().replace(/^"|"$/g, '');
        }
      }
      r.blob().then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
    })
  }

  return (
    <Dropzone onDrop={getSavFromJson} multiple={false}>
      {({getRootProps, getInputProps}) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>3. From your updated .JSON, recreate the UE .SAV file</p>
          </div>
        </section>
      )}
    </Dropzone>
  )
}
