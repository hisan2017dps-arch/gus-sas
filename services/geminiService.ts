import { GoogleGenAI, Type } from "@google/genai";
import { CurriculumData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Updated to the recommended stable preview model for complex text/multimodal tasks
const modelName = "gemini-3-flash-preview";

export const generateCurriculum = async (
  promptContext: string,
  base64Image?: string | null,
  mimeType?: string | null
): Promise<CurriculumData> => {
  
  const systemInstruction = `Anda adalah pakar kurikulum BDK Denpasar. 
  TUGAS UTAMA: 
  1. Ekstrak secara EKSAK Materi Pokok dan Sub Materi dari file yang diberikan. Jangan berhalusinasi.
  2. WAKTU (JP): Distribusikan Total JP yang tersedia ke dalam Indikator Keberhasilan. Indikator yang lebih kompleks atau materi yang lebih padat harus mendapatkan porsi JP lebih besar.
  3. REFERENSI: Ekstrak daftar referensi (Judul Buku, Peraturan, Link, atau Jurnal) yang relevan dengan materi ini. Daftar ini akan dipakai GABUNGAN (Merged) untuk RBPMP dan Rencana Pembelajaran. Pastikan isinya lengkap dan relevan.
  4. EVALUASI: Buatlah tepat 5 soal Pilihan Ganda (A, B, C, D) yang menguji pemahaman peserta terhadap Materi Pokok dan Indikator Keberhasilan yang telah diekstrak. Sertakan Kunci Jawaban.
  OUTPUT: JSON Murni sesuai skema.`;

  // Define the schema for structured output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      nama_pelatihan: { type: Type.STRING },
      mata_pelatihan: { type: Type.STRING },
      alokasi_waktu_total: { type: Type.STRING },
      deskripsi: { type: Type.STRING },
      tujuan: { type: Type.STRING },
      kompetensi: { type: Type.STRING },
      rbpmp_items: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            no: { type: Type.NUMBER },
            indikator: { type: Type.STRING },
            materi_pokok: { type: Type.STRING },
            sub_materi: { type: Type.STRING },
            metode: { type: Type.STRING },
            alat: { type: Type.STRING },
            waktu: { type: Type.STRING },
            // Removed per-row reference to enforce merged cell logic using global references
          },
        },
      },
      rp_items: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            no: { type: Type.NUMBER },
            tahapan: { type: Type.STRING },
            kegiatan_fasilitator: { type: Type.STRING },
            kegiatan_peserta: { type: Type.STRING },
            metode: { type: Type.STRING },
            alat: { type: Type.STRING },
            waktu: { type: Type.STRING },
          },
        },
      },
      evaluasi: { 
        type: Type.ARRAY, 
        items: { 
          type: Type.OBJECT,
          properties: {
            soal: { type: Type.STRING },
            opsi: { type: Type.ARRAY, items: { type: Type.STRING } },
            kunci: { type: Type.STRING }
          }
        } 
      },
      referensi: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["mata_pelatihan", "rbpmp_items", "rp_items", "evaluasi", "referensi"],
  };

  try {
    const parts: any[] = [{ text: promptContext }];
    
    if (base64Image && mimeType) {
      parts.push({
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("Respon AI kosong atau tidak valid.");
    }

    // Clean up markdown markers if present (e.g. ```json ... ```)
    const cleanedText = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');

    return JSON.parse(cleanedText) as CurriculumData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};