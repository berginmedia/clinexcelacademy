import { useState } from "react";
import { Award, Save, Settings } from "lucide-react";

export function CertificateBuilder({ certificate, course, onChange, onSave, isSaving }: { certificate: any, course: any, onChange: (c: any) => void, onSave: () => void, isSaving: boolean }) {
  const defaultCert = {
    signatoryName: "John Doe",
    signatoryTitle: "Director of Education",
    themeColor: "#0066FF",
    institutionName: "Clinexcel Academy"
  };

  const currentCert = certificate || defaultCert;

  const updateField = (field: string, value: string) => {
    onChange({ ...currentCert, [field]: value });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Certificate Builder</h2>
          <p className="text-sm text-muted-foreground mt-1">Design the digital certificate awarded upon course completion.</p>
        </div>
        <button onClick={onSave} disabled={isSaving} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:bg-primary/90 disabled:opacity-50">
          <Save size={16} /> {isSaving ? "Saving..." : "Save Certificate"}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-foreground font-bold pb-2 border-b">
              <Settings size={18} /> Settings
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Institution Name</label>
              <input type="text" value={currentCert.institutionName} onChange={e => updateField('institutionName', e.target.value)} className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-primary" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Signatory Name</label>
              <input type="text" value={currentCert.signatoryName} onChange={e => updateField('signatoryName', e.target.value)} className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-primary" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Signatory Title</label>
              <input type="text" value={currentCert.signatoryTitle} onChange={e => updateField('signatoryTitle', e.target.value)} className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-primary" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Theme Color</label>
              <div className="flex gap-3">
                <input type="color" value={currentCert.themeColor} onChange={e => updateField('themeColor', e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border-0 p-0" />
                <input type="text" value={currentCert.themeColor} onChange={e => updateField('themeColor', e.target.value)} className="flex-1 rounded-xl border border-border p-2.5 text-sm outline-none focus:border-primary font-mono uppercase" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white p-8 rounded-3xl border border-border shadow-lg overflow-hidden flex items-center justify-center min-h-[600px] relative bg-grid-slate-100">
            {/* Live Preview Certificate */}
            <div 
              className="w-full max-w-[800px] aspect-[1.414/1] bg-white relative shadow-2xl overflow-hidden p-12 flex flex-col items-center justify-between"
              style={{ border: `1px solid ${currentCert.themeColor}30` }}
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-4" style={{ backgroundColor: currentCert.themeColor }}></div>
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10" style={{ background: `radial-gradient(circle at top right, ${currentCert.themeColor}, transparent 70%)` }}></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10" style={{ background: `radial-gradient(circle at bottom left, ${currentCert.themeColor}, transparent 70%)` }}></div>
              
              <div className="absolute top-12 left-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: currentCert.themeColor }}>
                  <Award size={32} />
                </div>
              </div>

              {/* Content */}
              <div className="text-center mt-8 z-10 w-full">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-8" style={{ color: currentCert.themeColor }}>
                  {currentCert.institutionName}
                </h3>
                <h1 className="text-5xl font-black text-slate-800 mb-2 font-serif tracking-tight">
                  Certificate of Completion
                </h1>
                <p className="text-slate-500 uppercase tracking-widest text-xs font-semibold mt-4">This is to certify that</p>
                
                <h2 className="text-4xl font-bold text-slate-900 mt-6 mb-6">
                  [Student Name]
                </h2>
                
                <p className="text-slate-600 max-w-lg mx-auto text-sm leading-relaxed">
                  has successfully completed the comprehensive requirements for the digital course and is hereby awarded this certificate for
                </p>
                
                <h3 className="text-2xl font-bold text-slate-800 mt-6 max-w-xl mx-auto leading-tight">
                  {course.title || "Course Title"}
                </h3>
              </div>

              {/* Signatures & Footer */}
              <div className="w-full flex justify-between items-end px-12 z-10 mb-4 mt-12">
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-800">[Current Date]</p>
                  <div className="w-32 h-px bg-slate-300 my-2 mx-auto"></div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Date Issued</p>
                </div>
                
                <div className="text-center">
                  <div className="mb-2 w-48 mx-auto" style={{ fontFamily: "'Brush Script MT', cursive, serif" }}>
                    <span className="text-3xl text-slate-800">{currentCert.signatoryName}</span>
                  </div>
                  <div className="w-48 h-px bg-slate-300 my-2 mx-auto"></div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-800">{currentCert.signatoryName}</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">{currentCert.signatoryTitle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
