import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, FileText, CheckCircle2 } from "lucide-react";

interface PrivacyConsentModalProps {
  open: boolean;
  onConsent: () => void;
  roleTitle?: string;
}

export default function PrivacyConsentModal({
  open,
  onConsent,
  roleTitle = "AI Voice Interview",
}: PrivacyConsentModalProps) {
  const [agreedBiometric, setAgreedBiometric] = useState(false);
  const [agreedTranscript, setAgreedTranscript] = useState(false);

  const canProceed = agreedBiometric && agreedTranscript;

  const handleConfirm = () => {
    if (canProceed) {
      onConsent();
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
              Kepatuhan Regulasi Privasi
            </span>
          </div>
          <DialogTitle className="text-xl font-bold leading-tight">
            Persetujuan Pemrosesan Data Pribadi & Biometrik Suara
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Berdasarkan Undang-Undang Republik Indonesia No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-foreground py-2">
          <div className="bg-muted/40 border rounded-lg p-3.5 space-y-2 text-xs leading-relaxed">
            <p className="font-medium text-foreground">
              Sebelum memulai sesi wawancara untuk posisi <strong>{roleTitle}</strong>, kami memerlukan persetujuan eksplisit Anda terkait pemrosesan data pribadi spesifik berikut:
            </p>
            <ul className="space-y-1.5 list-disc pl-4 text-muted-foreground">
              <li>
                <strong>Data Biometrik Suara:</strong> Suara Anda akan direkam dan diproses secara real-time oleh model kecerdasan buatan (Gemini Live API) untuk analisis kompetensi.
              </li>
              <li>
                <strong>Transkrip Percakapan:</strong> Setiap pertukaran dialog akan ditranskripsikan ke dalam bentuk teks untuk penilaian terstruktur oleh asesor dan hiring team.
              </li>
              <li>
                <strong>Penyimpanan & Retensi:</strong> Rekaman audio dan transkrip disimpan dalam repositori terenkripsi selama proses rekrutmen berlangsung dan tidak akan diperjualbelikan kepada pihak ketiga manapun.
              </li>
              <li>
                <strong>Hak Subjek Data (Pasal 5–13 UU PDP):</strong> Anda berhak mengakses hasil asesmen, meminta ralat jika terdapat kekeliruan, atau mengajukan penghapusan data dengan menghubungi rekruter terkait.
              </li>
            </ul>
          </div>

          {/* Interactive Consent Checkboxes */}
          <div className="space-y-3 pt-1">
            <label className="flex items-start gap-2.5 p-3 rounded-lg border bg-card hover:bg-accent/40 cursor-pointer transition-colors">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={agreedBiometric}
                onChange={(e) => setAgreedBiometric(e.target.checked)}
                data-testid="consent-biometric-checkbox"
              />
              <span className="text-xs leading-normal select-none">
                <strong className="text-foreground">Persetujuan Pemrosesan Suara (Biometrik):</strong> Saya secara sadar memberikan persetujuan kepada platform untuk memproses suara mikrofon saya secara real-time selama sesi wawancara.
              </span>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-lg border bg-card hover:bg-accent/40 cursor-pointer transition-colors">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={agreedTranscript}
                onChange={(e) => setAgreedTranscript(e.target.checked)}
                data-testid="consent-transcript-checkbox"
              />
              <span className="text-xs leading-normal select-none">
                <strong className="text-foreground">Persetujuan Transkripsi & Evaluasi Asesor:</strong> Saya menyetujui pembuatan transkrip dialog dan analisis portofolio kompetensi oleh sistem untuk evaluasi lowongan kerja.
              </span>
            </label>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-blue-50/60 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900 rounded-md p-2.5">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            <span>Kerahasiaan data terjamin dengan enkripsi TLS saat transit dan AES-256 saat istirahat (at-rest).</span>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between items-center gap-2 pt-2 border-t">
          <span className="text-xs text-muted-foreground">
            {!canProceed ? "Centang kedua persetujuan untuk melanjutkan" : "Siap melanjutkan ke pengecekan perangkat"}
          </span>
          <Button
            onClick={handleConfirm}
            disabled={!canProceed}
            className="w-full sm:w-auto"
            data-testid="consent-submit-button"
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" />
            Setuju & Lanjutkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

