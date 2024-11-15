import { useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { Copy, Download } from "../icons";

export function ToJson() {
  const [JSONSave, setJSONSave] = useState<object>();
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted: (files: File[]) => {
      setJSONSave(undefined);
      setAcceptedFiles([]);
      const [f] = files;

      const formData = new FormData();
      formData.append("file", f);

      fetch("/api/to_json", {
        method: "PUT",
        body: formData,
      })
        .then((r) => r.json())
        .then(({ data }) => {
          setJSONSave(data);
          setAcceptedFiles([f]);
          toast.success("File converted to .json successfully!");
        })
        .catch(e => {
          console.error(e);
          toast.error("Could not convert .sav to .json, please try again.");
        });
    },
    maxFiles: 1,
    accept: { "application/octet-stream": [".sav"] },
    onError: console.error,
  });

  function onDownload() {
    const [f] = acceptedFiles;
    if (!f || !JSONSave) return null;
    const blob = new Blob([JSON.stringify(JSONSave, null, 2)]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `${f.name.replace(".sav", "")}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  return (
    <section className="card">
      <h2>1.</h2>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Upload your UE .SAV file and convert it to .JSON</p>
      </div>
      <br />
      <div style={{ visibility: acceptedFiles.length ? "visible" : "hidden" }}>
        {JSONSave ? (
          <>
            <button onClick={onDownload} title="Download .JSON file">
              <Download />
            </button>{" "}
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(JSONSave, null, 2));
                toast.success("JSON copied to clipboard!");
              }}
              title="Copy JSON to clipboard"
            >
              <Copy />
            </button>
          </>
        ) : (
          <div className="loader" />
        )}
      </div>
    </section>
  );
}
