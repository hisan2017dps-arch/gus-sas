import React, { useState, useRef } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import DocumentPreview from './components/DocumentPreview';
import { FormData, FileData, CurriculumData } from './types';
import { generateCurriculum } from './services/geminiService';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fasilitatorName: '',
    fasilitatorNip: '',
    docLocation: '',
    alokasiJP: '',
    trainingName: '',
    mataPelatihan: '',
    userInput: ''
  });

  const [fileData, setFileData] = useState<FileData>({
    file: null,
    base64: null,
    mimeType: null,
    name: null
  });

  const [generatedData, setGeneratedData] = useState<CurriculumData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!formData.userInput && !fileData.base64) {
      alert("Pilih file silabus atau masukkan teks materi.");
      return;
    }

    setIsLoading(true);

    try {
      const prompt = `Ekstrak dan susun kurikulum secara presisi dari data berikut:
      Nama Pelatihan: ${formData.trainingName}
      Mata Pelatihan: ${formData.mataPelatihan}
      Total JP: ${formData.alokasiJP}
      Input Teks: ${formData.userInput}
      
      INSTRUKSI KHUSUS:
      1. RBPMP dan RP harus benar-benar mencerminkan isi file yang diupload. Jangan mengarang materi di luar konteks file.
      2. Sesuaikan pembagian Waktu (JP) di RBPMP secara proporsional dengan kompleksitas Indikator Keberhasilan. Total JP harus sama dengan ${formData.alokasiJP || 'alokasi di dokumen'}.
      3. Buat 5 Soal Evaluasi Pilihan Ganda (A,B,C,D) beserta Kunci Jawaban yang relevan dengan Indikator Keberhasilan dan Materi Pokok.`;

      const result = await generateCurriculum(prompt, fileData.base64, fileData.mimeType);
      
      const finalData: CurriculumData = {
        ...result,
        nama_pelatihan: formData.trainingName || result.nama_pelatihan,
        mata_pelatihan: formData.mataPelatihan || result.mata_pelatihan,
      };

      setGeneratedData(finalData);
      
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error: any) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan tidak diketahui.";
      alert(`Gagal memproses data:\n${errorMessage}\n\nSilakan coba lagi atau periksa koneksi internet.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('exportWrapper');
    if (!element) return;
    
    // @ts-ignore
    if (typeof window.html2pdf !== 'function') {
      alert("Library PDF sedang dimuat, silakan coba sesaat lagi.");
      return;
    }

    const btnPdf = document.getElementById('btn-pdf');
    const originalBtnText = btnPdf?.innerText;
    if (btnPdf) btnPdf.innerText = "⏳ Memproses...";

    try {
      // 1. Clone element
      const clone = element.cloneNode(true) as HTMLElement;

      // 2. Setup Container for PDF Generation
      // Kita gunakan lebar sedikit lebih kecil (265mm) dari area cetak (277mm)
      // untuk memberikan margin keamanan agar garis tidak terpotong.
      const contentWidth = '270mm';
      
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '-10000px';
      container.style.left = '0';
      container.style.width = '297mm'; // Full A4 Landscape width
      container.style.background = '#fff';
      
      // Menambahkan wrapper internal untuk scaling
      const innerWrapper = document.createElement('div');
      innerWrapper.style.width = contentWidth;
      innerWrapper.style.margin = '0 auto';
      innerWrapper.style.padding = '5mm 0';
      innerWrapper.style.boxSizing = 'border-box';
      innerWrapper.style.transform = 'scale(0.97)'; // REDUCE PERCENTAGE (Sesuai request user)
      innerWrapper.style.transformOrigin = 'top center';
      
      innerWrapper.appendChild(clone);
      container.appendChild(innerWrapper);
      document.body.appendChild(container);

      // 3. Apply Styles to Clone for perfect fit
      clone.style.width = '100%'; 
      clone.style.margin = '0';
      clone.style.padding = '0';
      clone.style.boxSizing = 'border-box';
      
      const papers = clone.getElementsByClassName('paper');
      for (let i = 0; i < papers.length; i++) {
        const p = papers[i] as HTMLElement;
        p.style.boxShadow = 'none';
        p.style.border = 'none';
        p.style.margin = '0';
        p.style.width = '100%'; 
        p.style.minHeight = 'auto'; 
        p.style.boxSizing = 'border-box';
        p.style.padding = '2mm'; // Memberi padding internal kecil agar teks tidak nempel garis luar
        
        if (i < papers.length - 1) {
            p.style.pageBreakAfter = 'always';
        }
      }

      // Pastikan semua tabel di dalam clone memiliki border yang utuh
      const tables = clone.querySelectorAll('table');
      tables.forEach(table => {
        (table as HTMLElement).style.border = '1.2px solid black';
        (table as HTMLElement).style.width = '100%';
        (table as HTMLElement).style.borderCollapse = 'collapse';
      });

      // 4. Html2Pdf Options
      const opt = {
        margin: [10, 10, 10, 10], // top, left, bottom, right in mm
        filename: `GUSSAS_${formData.mataPelatihan || 'Dokumen'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2.5, // Meningkatkan DPI untuk ketajaman garis
          useCORS: true,
          scrollY: 0,
          letterRendering: true,
          windowWidth: 1200 // Memaksa lebar virtual agar render konsisten
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      // 5. Execute
      // @ts-ignore
      await window.html2pdf().set(opt).from(container).save();

      // 6. Cleanup
      document.body.removeChild(container);

    } catch (err) {
      console.error(err);
      alert("Gagal mengunduh PDF. Silakan coba lagi.");
    } finally {
      if (btnPdf && originalBtnText) btnPdf.innerText = originalBtnText;
    }
  };

  const handleDownloadWord = () => {
    const content = document.getElementById('exportWrapper')?.innerHTML;
    if (!content) return;

    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'>
      <style>
          @page Section1 { size: 841.9pt 595.3pt; mso-page-orientation: landscape; margin: 0.75in 0.5in; }
          div.Section1 { page: Section1; }
          table { border-collapse: collapse; width: 100%; border: 1pt solid black; }
          th, td { border: 1pt solid black; padding: 4pt; font-family: 'Arial', sans-serif; font-size: 10pt; vertical-align: top; }
          .text-center { text-align: center; }
          .font-bold { font-weight: bold; }
          .uppercase { text-transform: uppercase; }
          .underline { text-decoration: underline; }
          .italic { font-style: italic; }
      </style>
      </head><body><div class="Section1">
    `;
    const footer = "</div></body></html>";
    
    const blob = new Blob([header + content + footer], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `GUSSAS_Dokumen_${Date.now()}.doc`;
    link.click();
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="no-print">
        <Header />
        
        <InputForm 
          formData={formData}
          setFormData={setFormData}
          fileData={fileData}
          setFileData={setFileData}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
      </div>

      <div ref={resultRef}>
        {generatedData && (
          <div id="outputArea">
            <div className="no-print bg-slate-900 text-white p-3 sticky top-0 z-50 flex flex-wrap gap-2 justify-between items-center rounded-t-lg shadow-lg mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-600 px-3 py-1 rounded">
                Hasil Dokumen Tersinkronisasi
              </span>
              <div className="flex gap-2">
                 <button 
                  id="btn-pdf"
                  onClick={handleDownloadPDF}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-[10px] font-bold transition-all flex items-center gap-2"
                >
                  <span>⬇️</span> UNDUH PDF
                </button>
                <button 
                  onClick={handleDownloadWord}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-[10px] font-black transition-all flex items-center gap-2"
                >
                  <span>📄</span> UNDUH WORD
                </button>
              </div>
            </div>

            <div className="preview-container bg-slate-700/50 p-4 lg:p-8 rounded-b-lg overflow-x-auto print:bg-white print:p-0 print:overflow-visible">
              <DocumentPreview data={generatedData} formData={formData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;