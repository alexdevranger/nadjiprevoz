import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import { renderAsync } from "docx-preview";
import html2canvas from "html2canvas";

export default function ImagesToPDFUpload() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  // za Word
  const [wordFile, setWordFile] = useState(null);
  const [processingWord, setProcessingWord] = useState(false);
  const previewRef = useRef();

  const handleFiles = (e) => {
    const fl = Array.from(e.target.files || []);
    setFiles(fl);

    // preview
    const urls = fl.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
  };

  // helper: read file to dataURL
  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // helper: load image element from dataURL and wait onload
  const loadImage = (dataUrl) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = dataUrl;
      // ensure no CORS issues for local files
      img.crossOrigin = "Anonymous";
    });

  // 🧩 DOCX → PDF konverzija preko ConvertAPI
  const convertDocxToPdf = async (file) => {
    try {
      setProcessing(true);
      const formData = new FormData();
      formData.append("File", file);

      // 🔑 zameni YOUR_API_SECRET sa svojim ključem sa https://www.convertapi.com/a
      const response = await fetch(
        "https://v2.convertapi.com/convert/docx/to/pdf?Secret=YOUR_API_SECRET",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Greška u konverziji dokumenta.");
      const data = await response.json();

      const pdfUrl = data.Files[0].Url;
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = file.name.replace(".docx", ".pdf");
      a.click();
    } catch (err) {
      console.error(err);
      alert("Došlo je do greške prilikom konverzije Word dokumenta.");
    } finally {
      setProcessing(false);
    }
  };

  const createLongPdfAndDownload = async () => {
    if (files.length === 0) {
      alert("Molimo izaberite bar jednu sliku.");
      return;
    }

    try {
      setProcessing(true);

      // 1) učitaj sve fajlove kao dataURL-ove
      const dataUrls = await Promise.all(files.map((f) => fileToDataUrl(f)));

      // 2) učitaj Image objekte da dobijemo natural dimenzije
      const imgs = await Promise.all(dataUrls.map((d) => loadImage(d)));

      // 3) definicija širine PDF "stranice" u px (A4 ~595x842 po pt/px)
      const pageWidth = 595; // px
      // skalirane visine i ukupna visina
      const scaledHeights = imgs.map((img) => {
        const ratio = pageWidth / img.naturalWidth;
        return Math.round(img.naturalHeight * ratio);
      });
      const totalHeight = scaledHeights.reduce((s, h) => s + h, 0);

      // 4) kreiraj jsPDF sa custom formatom (pageWidth x totalHeight)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [pageWidth, totalHeight],
      });

      // 5) bela pozadina (izbegavanje render artefakata)
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, totalHeight, "F");

      // 6) dodaj svaku sliku jednu ispod druge
      let cursorY = 0;
      for (let i = 0; i < dataUrls.length; i++) {
        const dataUrl = dataUrls[i];
        const img = imgs[i];
        const h = scaledHeights[i];

        // odredi format slike za jsPDF
        const fileType = files[i].type || "";
        const format =
          fileType.includes("jpeg") || fileType.includes("jpg")
            ? "JPEG"
            : "PNG";

        // addImage podržava dataURL direktno
        pdf.addImage(
          dataUrl,
          format,
          0,
          cursorY,
          pageWidth,
          h,
          undefined,
          "FAST"
        );
        cursorY += h;
      }

      // 7) preuzmi PDF
      pdf.save("merged_images.pdf");
    } catch (err) {
      console.error("Greška pri generisanju PDF-a:", err);
      alert("Došlo je do greške prilikom kreiranja PDF-a.");
    } finally {
      setProcessing(false);
    }
  };

  // ---------------- WORD TO PDF ----------------
  const handleWordChange = (e) => {
    const f = e.target.files?.[0];
    if (f && f.name.endsWith(".docx")) {
      setWordFile(f);
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const arrayBuffer = ev.target.result;
        previewRef.current.innerHTML = "";
        await renderAsync(arrayBuffer, previewRef.current);
      };
      reader.readAsArrayBuffer(f);
    } else {
      alert("Molimo izaberite .docx fajl");
    }
  };

  const convertWordToPDF = async () => {
    if (!previewRef.current) return;
    setProcessingWord(true);
    try {
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(wordFile.name.replace(".docx", ".pdf"));
    } catch (err) {
      console.error("Greška:", err);
      alert("Greška pri konverziji Word dokumenta.");
    } finally {
      setProcessingWord(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-3">
          Spoji slike u jedan PDF (dugačka strana)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Izaberi PNG/JPG slike (redosled se čuva). Komponenta pravi jedan
          dugački PDF bez razmaka između strana.
        </p>

        <input
          type="file"
          accept="image/png,image/jpeg"
          multiple
          onChange={handleFiles}
          className="mb-4"
        />

        {previewUrls.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-3">
            {previewUrls.map((u, i) => (
              <div key={i} className="border rounded overflow-hidden">
                <img
                  src={u}
                  alt={`preview-${i}`}
                  className="w-full h-28 object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={createLongPdfAndDownload}
            disabled={processing || files.length === 0}
            className={`px-4 py-2 rounded-lg text-white ${
              processing || files.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {processing ? "Pravim PDF..." : "Preuzmi PDF"}
          </button>

          <div className="text-sm text-gray-500">
            Izabrano: <strong>{files.length}</strong> fajl(ova)
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Napomena: ako su slike velike, proces može potrajati par sekundi. PDF
          se generiše lokalno u browseru.
        </div>
      </div>
      {/* Word → PDF */}
      <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-3">📄 Word (.docx) → PDF</h2>
        <input
          type="file"
          accept=".docx"
          onChange={handleWordChange}
          className="mb-4"
        />

        <div
          ref={previewRef}
          className="border rounded p-4 min-h-[300px] overflow-auto bg-gray-50"
        ></div>

        <button
          onClick={convertWordToPDF}
          disabled={!wordFile || processingWord}
          className={`mt-4 px-4 py-2 rounded-lg text-white ${
            processingWord || !wordFile
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {processingWord ? "Pretvaram..." : "Preuzmi kao PDF"}
        </button>
      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import { jsPDF } from "jspdf";

// export default function ImagesToPdf() {
//   const [files, setFiles] = useState([]);

//   // Pretvori File u Base64
//   const toBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });

//   const handleFiles = (e) => {
//     setFiles(Array.from(e.target.files));
//   };

//   const createPdf = async () => {
//     if (files.length === 0) {
//       alert("Molimo izaberite slike prvo.");
//       return;
//     }

//     const pdf = new jsPDF();
//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const imgData = await toBase64(file);

//       const imgProps = pdf.getImageProperties(imgData);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//       if (i > 0) pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     }

//     pdf.save("combined.pdf");
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto text-center bg-white shadow rounded-lg">
//       <h2 className="text-lg font-semibold mb-3 text-gray-800">
//         📄 Spoji PNG fajlove u jedan PDF
//       </h2>

//       <input
//         type="file"
//         multiple
//         accept="image/png,image/jpeg"
//         onChange={handleFiles}
//         className="border p-2 rounded w-full mb-3"
//       />

//       <button
//         onClick={createPdf}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//       >
//         Preuzmi PDF
//       </button>

//       {files.length > 0 && (
//         <p className="text-sm text-gray-500 mt-3">
//           Izabrano fajlova: {files.length}
//         </p>
//       )}
//     </div>
//   );
// }
