import { Award, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { downloadSecureCertificateFn } from "../actions/courses";
import { toast } from "sonner";

export function CertificateViewer({ 
  certificate, 
  course, 
  studentName, 
  completedAt 
}: { 
  certificate: any; 
  course: any; 
  studentName: string; 
  completedAt: string | null; 
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const defaultCert = {
    signatoryName: "John Doe",
    signatoryTitle: "Director of Education",
    themeColor: "#0066FF",
    institutionName: "Clinexcel Academy"
  };

  const cert = certificate || defaultCert;
  const dateStr = completedAt 
    ? new Date(completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const res = await downloadSecureCertificateFn({ data: { courseId: course.courseId } });
      
      // Decode base64 and trigger download
      const binaryString = window.atob(res.base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = res.filename;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Certificate downloaded successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to download certificate");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white overflow-y-auto">
      {/* Header - Hidden during print */}
      <div className="print:hidden sticky top-0 z-10 flex flex-col items-center justify-center border-b border-border bg-white p-6 shadow-sm">
        <h3 className="mb-2 text-2xl font-black text-foreground">Course Completed!</h3>
        <p className="mb-4 text-sm text-muted-foreground">Your certificate of completion is ready.</p>
        <button 
          onClick={handleDownload} 
          disabled={isDownloading}
          className="rounded-xl bg-success px-8 py-3 font-bold text-white shadow-sm transition-opacity hover:opacity-90 flex items-center gap-2 disabled:opacity-70"
        >
          {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
          {isDownloading ? "Generating PDF..." : "Download as PDF"}
        </button>
      </div>

      {/* Certificate Container */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F8FAFC] print:bg-white print:p-0 print:fixed print:inset-0 print:z-[9999] print:m-0 print:flex print:items-center print:justify-center print:w-screen print:h-screen">
        
        {/* Certificate Card */}
        <div 
          className="w-full max-w-[800px] aspect-[1.414/1] bg-white relative shadow-2xl overflow-hidden p-12 flex flex-col items-center justify-between print:shadow-none print:w-full print:h-[100vh] print:max-w-none print:aspect-auto print:border-none"
          style={{ border: `1px solid ${cert.themeColor}30` }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-4 print:h-6" style={{ backgroundColor: cert.themeColor }}></div>
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10 print:w-64 print:h-64" style={{ background: `radial-gradient(circle at top right, ${cert.themeColor}, transparent 70%)` }}></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10 print:w-64 print:h-64" style={{ background: `radial-gradient(circle at bottom left, ${cert.themeColor}, transparent 70%)` }}></div>
          
          <div className="absolute top-12 left-12 print:top-16 print:left-16">
            <div className="w-16 h-16 print:w-24 print:h-24 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: cert.themeColor }}>
              <Award className="w-8 h-8 print:w-12 print:h-12" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mt-8 print:mt-24 z-10 w-full flex-1 flex flex-col justify-center items-center">
            <h3 className="text-sm print:text-lg font-bold uppercase tracking-[0.2em] mb-8 print:mb-12" style={{ color: cert.themeColor }}>
              {cert.institutionName}
            </h3>
            <h1 className="text-5xl print:text-7xl font-black text-slate-800 mb-2 font-serif tracking-tight">
              Certificate of Completion
            </h1>
            <p className="text-slate-500 uppercase tracking-widest text-xs print:text-sm font-semibold mt-4 print:mt-8">This is to certify that</p>
            
            <h2 className="text-4xl print:text-6xl font-bold text-slate-900 mt-6 mb-6 print:mt-10 print:mb-10">
              {studentName}
            </h2>
            
            <p className="text-slate-600 max-w-lg print:max-w-2xl mx-auto text-sm print:text-lg leading-relaxed">
              has successfully completed the comprehensive requirements for the digital course and is hereby awarded this certificate for
            </p>
            
            <h3 className="text-2xl print:text-4xl font-bold text-slate-800 mt-6 print:mt-10 max-w-xl print:max-w-3xl mx-auto leading-tight">
              {course.title || "Course Title"}
            </h3>
          </div>

          {/* Signatures & Footer */}
          <div className="w-full flex justify-between items-end px-12 print:px-24 z-10 mb-4 mt-12 print:mt-24 print:mb-12">
            <div className="text-center">
              <p className="text-sm print:text-lg font-bold text-slate-800">{dateStr}</p>
              <div className="w-32 print:w-48 h-px bg-slate-300 my-2 mx-auto"></div>
              <p className="text-[10px] print:text-xs uppercase font-bold tracking-wider text-slate-500">Date Issued</p>
            </div>
            
            <div className="text-center">
              <div className="mb-2 w-48 print:w-64 mx-auto" style={{ fontFamily: "'Brush Script MT', cursive, serif" }}>
                <span className="text-3xl print:text-5xl text-slate-800">{cert.signatoryName}</span>
              </div>
              <div className="w-48 print:w-64 h-px bg-slate-300 my-2 mx-auto"></div>
              <p className="text-xs print:text-sm font-bold uppercase tracking-wider text-slate-800">{cert.signatoryName}</p>
              <p className="text-[10px] print:text-xs uppercase tracking-wider text-slate-500 mt-0.5">{cert.signatoryTitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
