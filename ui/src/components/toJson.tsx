import Dropzone from 'react-dropzone';

export function ToJson() {

  function getJsonFromSav(acceptedFiles: File[]) {
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

  return (
    <Dropzone onDrop={getJsonFromSav} multiple={false}>
      {({getRootProps, getInputProps}) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>1. Upload your UE .SAV file and convert it to .JSON</p>
          </div>
        </section>
      )}
    </Dropzone>
  )
}
