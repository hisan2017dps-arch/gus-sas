import React, { useRef } from 'react';
import { FormData, FileData } from '../types';

interface InputFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  fileData: FileData;
  setFileData: React.Dispatch<React.SetStateAction<FileData>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({
  formData,
  setFormData,
  fileData,
  setFileData,
  onGenerate,
  isLoading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // remove data:image/jpeg;base64, prefix
        const base64 = result.split(',')[1];
        setFileData({
          file: file,
          base64: base64,
          mimeType: file.type,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 border border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1">NAMA FASILITATOR</label>
          <input
            type="text"
            id="fasilitatorName"
            value={formData.fasilitatorName}
            onChange={handleChange}
            className="w-full p-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1">NIP</label>
          <input
            type="text"
            id="fasilitatorNip"
            value={formData.fasilitatorNip}
            onChange={handleChange}
            className="w-full p-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1">KOTA & TANGGAL</label>
          <input
            type="text"
            id="docLocation"
            value={formData.docLocation}
            onChange={handleChange}
            className="w-full p-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            placeholder="Contoh: Denpasar, 11 Feb 2026"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1">ALOKASI WAKTU (JP)</label>
          <input
            type="number"
            id="alokasiJP"
            value={formData.alokasiJP}
            onChange={handleChange}
            className="w-full p-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            placeholder="Contoh: 6"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Upload File Silabus (Akurasi Tinggi)</label>
          <div
            onClick={handleDropZoneClick}
            className="border-2 dashed border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer min-h-[140px] bg-slate-50 hover:bg-emerald-50 transition-colors"
          >
            <svg className="w-8 h-8 text-emerald-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="text-[10px] text-center font-bold text-slate-600">Klik/Tarik file ke sini</p>
            {fileData.name && (
              <p className="text-[9px] mt-2 text-emerald-700 font-black truncate w-full text-center">
                File: {fileData.name}
              </p>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">NAMA PELATIHAN</label>
            <input
              type="text"
              id="trainingName"
              value={formData.trainingName}
              onChange={handleChange}
              className="w-full p-2.5 text-sm border border-slate-200 rounded-lg outline-none bg-slate-50"
              placeholder="Masukkan Nama Pelatihan"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">MATA PELATIHAN</label>
            <input
              type="text"
              id="mataPelatihan"
              value={formData.mataPelatihan}
              onChange={handleChange}
              className="w-full p-2.5 text-sm border border-slate-200 rounded-lg outline-none bg-slate-50"
              placeholder="Masukkan Mata Pelatihan"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">MATERI / CATATAN TAMBAHAN</label>
            <textarea
              id="userInput"
              rows={2}
              value={formData.userInput}
              onChange={handleChange}
              className="w-full p-2.5 text-sm border border-slate-200 rounded-lg outline-none bg-slate-50"
              placeholder="Salin teks materi di sini jika ada..."
            ></textarea>
          </div>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading}
        className={`mt-4 bg-emerald-800 hover:bg-emerald-900 text-white font-black py-3.5 px-8 rounded-xl w-full transition-all shadow-lg text-xs uppercase tracking-widest flex items-center justify-center gap-3 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            MEMPROSES...
          </>
        ) : (
          '🚀 PROSES DATA & SUSUN DOKUMEN'
        )}
      </button>
    </div>
  );
};

export default InputForm;