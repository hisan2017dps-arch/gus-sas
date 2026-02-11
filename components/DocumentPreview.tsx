import React from 'react';
import { CurriculumData, FormData } from '../types';

interface DocumentPreviewProps {
  data: CurriculumData;
  formData: FormData;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ data, formData }) => {
  const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const finalPlaceDate = formData.docLocation || `Denpasar, ${currentDate}`;
  const facilitatorName = formData.fasilitatorName || "..................................................";
  const facilitatorNip = formData.fasilitatorNip ? `NIP. ${formData.fasilitatorNip}` : "NIP. ..................................................";
  const trainingTitle = formData.trainingName || data.nama_pelatihan;
  const courseTitle = formData.mataPelatihan || data.mata_pelatihan;

  const MetaDataSection = () => (
    <div className="grid grid-cols-[180px_20px_1fr] gap-y-1.5 mb-6 text-[11px] leading-tight">
      <div className="font-bold text-slate-700">1. Nama Pelatihan</div><div>:</div><div>{trainingTitle}</div>
      <div className="font-bold text-slate-700">2. Mata Pelatihan</div><div>:</div><div>{courseTitle}</div>
      <div className="font-bold text-slate-700">3. Alokasi Waktu</div><div>:</div><div>{formData.alokasiJP || data.alokasi_waktu_total} JP</div>
      <div className="font-bold text-slate-700">4. Deskripsi Singkat</div><div>:</div><div>{data.deskripsi}</div>
      <div className="font-bold text-slate-700">5. Tujuan Pembelajaran</div><div>:</div><div>{data.tujuan}</div>
      <div className="font-bold text-slate-700">6. Kompetensi Dasar</div><div>:</div><div>{data.kompetensi}</div>
    </div>
  );

  const SignatureSection = () => (
    <div className="flex justify-end mt-12 avoid-break">
      <div className="text-center min-w-[250px] text-[11px]">
        <p className="italic mb-16">{finalPlaceDate}</p>
        <p className="font-bold underline uppercase">{facilitatorName}</p>
        <p>{facilitatorNip}</p>
      </div>
    </div>
  );

  return (
    <div id="exportWrapper" className="bg-white">
      {/* RBPMP Document */}
      <div className="paper mb-8" id="rbpmpDoc">
        <div className="text-center mb-6">
          <h2 className="font-bold text-lg uppercase underline">RANCANG BANGUN PEMBELAJARAN MATA PELATIHAN (RBPMP)</h2>
        </div>

        <MetaDataSection />

        <table className="doc-table">
          <thead className="bg-gray-100 text-[10px] font-bold text-center uppercase">
            <tr>
              {/* TOTAL WIDTH: 100% */}
              {/* No: 4% */}
              {/* Indikator: 16% */}
              {/* Materi: 16% */}
              {/* Sub Materi: 16% */}
              {/* Metode: 8% */}
              {/* Alat: 7% */}
              {/* Waktu: 5% */}
              {/* Referensi: 28% (REQUESTED) */}
              <th style={{ width: '4%' }}>NO</th>
              <th style={{ width: '16%' }}>INDIKATOR KEBERHASILAN</th>
              <th style={{ width: '16%' }}>MATERI POKOK</th>
              <th style={{ width: '16%' }}>SUB MATERI POKOK</th>
              <th style={{ width: '8%' }}>METODE</th>
              <th style={{ width: '7%' }}>ALAT BANTU</th>
              <th style={{ width: '5%' }}>WAKTU</th>
              <th style={{ width: '28%' }}>REFERENSI</th>
            </tr>
          </thead>
          <tbody className="text-[10px]">
            {data.rbpmp_items.map((item, idx) => (
              <tr key={idx}>
                <td className="text-center">{item.no}</td>
                <td>{item.indikator}</td>
                <td className="font-bold">{item.materi_pokok}</td>
                <td>{item.sub_materi}</td>
                <td className="text-center">{item.metode}</td>
                <td className="text-center">{item.alat}</td>
                <td className="text-center font-bold">{item.waktu}</td>
                
                {/* Merged Reference Column: Only render on the first row */}
                {idx === 0 && (
                  <td 
                    rowSpan={data.rbpmp_items.length} 
                    className="italic align-top"
                  >
                     <ul className="list-decimal pl-4 space-y-1">
                        {data.referensi.map((ref, rIdx) => (
                          <li key={rIdx}>{ref}</li>
                        ))}
                     </ul>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <SignatureSection />
      </div>

      {/* RP Document */}
      <div className="paper" id="rpDoc">
        <div className="text-center mb-6">
          <h2 className="font-bold text-lg uppercase underline">RENCANA PEMBELAJARAN (RP)</h2>
        </div>

        <MetaDataSection />

        <table className="doc-table mb-6">
          <thead className="bg-gray-100 text-[10px] font-bold text-center uppercase">
            <tr>
              <th style={{ width: '4%' }}>NO</th>
              <th style={{ width: '12%' }}>TAHAPAN</th>
              <th>KEGIATAN FASILITATOR</th>
              <th>KEGIATAN PESERTA</th>
              <th style={{ width: '10%' }}>METODE</th>
              <th style={{ width: '10%' }}>ALAT BANTU</th>
              <th style={{ width: '7%' }}>WAKTU</th>
            </tr>
          </thead>
          <tbody className="text-[10px]">
            {data.rp_items.map((item, idx) => (
              <tr key={idx}>
                <td className="text-center font-bold">{item.no}</td>
                <td className="bg-gray-50 uppercase font-bold text-[9px]">{item.tahapan}</td>
                <td>{item.kegiatan_fasilitator}</td>
                <td>{item.kegiatan_peserta}</td>
                <td className="text-center">{item.metode}</td>
                <td className="text-center">{item.alat}</td>
                <td className="text-center font-bold">{item.waktu}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Sequential Evaluation and Reference Section */}
        <div className="mt-4 text-[11px] space-y-6">
          {/* No 7: Evaluasi */}
          <div className="avoid-break">
            <div className="grid grid-cols-[180px_20px_1fr] gap-y-1.5 leading-tight">
               <div className="font-bold text-slate-700">7. EVALUASI PEMBELAJARAN</div><div>:</div>
               <div>
                  <div className="space-y-4">
                    {data.evaluasi.map((item, i) => (
                      <div key={i}>
                        <p className="font-bold mb-1">{i + 1}. {item.soal}</p>
                        <ul className="pl-4 mb-1 space-y-0.5" style={{ listStyleType: 'upper-alpha' }}>
                          {item.opsi.map((opt, oIdx) => (
                            <li key={oIdx}>{opt}</li>
                          ))}
                        </ul>
                        <p className="text-[9px] font-bold text-emerald-800">Kunci: {item.kunci}</p>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* No 8: Referensi */}
          <div className="avoid-break">
            <div className="grid grid-cols-[180px_20px_1fr] gap-y-1.5 leading-tight">
               <div className="font-bold text-slate-700">8. REFERENSI</div><div>:</div>
               <div>
                  <ul className="list-decimal pl-4 italic space-y-1">
                    {data.referensi.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
               </div>
            </div>
          </div>
        </div>

        <SignatureSection />
      </div>
    </div>
  );
};

export default DocumentPreview;