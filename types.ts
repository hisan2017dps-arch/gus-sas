export interface RbpmpItem {
  no: number;
  indikator: string;
  materi_pokok: string;
  sub_materi: string;
  metode: string;
  alat: string;
  waktu: string;
  referensi: string;
}

export interface RpItem {
  no: number;
  tahapan: string;
  kegiatan_fasilitator: string;
  kegiatan_peserta: string;
  metode: string;
  alat: string;
  waktu: string;
}

export interface EvaluasiItem {
  soal: string;
  opsi: string[];
  kunci: string;
}

export interface CurriculumData {
  nama_pelatihan: string;
  mata_pelatihan: string;
  alokasi_waktu_total: string;
  deskripsi: string;
  tujuan: string;
  kompetensi: string;
  rbpmp_items: RbpmpItem[];
  rp_items: RpItem[];
  evaluasi: EvaluasiItem[];
  referensi: string[];
}

export interface FormData {
  fasilitatorName: string;
  fasilitatorNip: string;
  docLocation: string;
  alokasiJP: string;
  trainingName: string;
  mataPelatihan: string;
  userInput: string;
}

export interface FileData {
  file: File | null;
  base64: string | null;
  mimeType: string | null;
  name: string | null;
}