import { Link, createFileRoute, useRouter, redirect } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { QuizExecution } from "../components/QuizExecution";
import { CertificateViewer } from "../components/CertificateViewer";
import { useParams } from "@tanstack/react-router";
import { ArrowLeft, PlayCircle, FileText, HelpCircle, CheckCircle2, Lock, Award, Menu } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/ui/logo";

import { getStudentCourseDataFn, toggleSectionCompletionFn, markSectionViewedFn } from "../actions/courses";

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
function ClientPdfViewer({ url }: { url: string }) {
  const [PdfLib, setPdfLib] = useState<any>(null);
  const [numPages, setNumPages] = useState<number | null>(null);

  useEffect(() => {
    import('react-pdf').then((pdf) => {
      pdf.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdf.pdfjs.version}/build/pdf.worker.min.mjs`;
      setPdfLib(pdf);
    });
  }, []);

  if (!PdfLib) {
    return <div className="p-8 text-muted-foreground">Loading PDF Engine...</div>;
  }

  const { Document, Page } = PdfLib;

  return (
    <Document
      file={url}
      onLoadSuccess={({ numPages }: { numPages: number }) => setNumPages(numPages)}
      className="max-w-full"
      loading={<div className="p-8 text-muted-foreground">Loading PDF...</div>}
    >
      {Array.from(new Array(numPages || 0), (el, index) => (
        <Page 
          key={`page_${index + 1}`} 
          pageNumber={index + 1} 
          className="mb-4 shadow-lg rounded overflow-hidden"
          renderTextLayer={false}
          renderAnnotationLayer={false}
          width={typeof window !== 'undefined' ? Math.min(window.innerWidth < 640 ? window.innerWidth - 32 : window.innerWidth - 64, 1000) : 800}
        />
      ))}
    </Document>
  );
}

function CourseViewerPage() {
  const { courseId } = Route.useParams();
  const { course, completedSections: initialCompleted, viewedSections: initialViewed, quizPassed, isCompleted, studentName, completedAt } = Route.useLoaderData();
  const router = useRouter();
  
  // Track completed sections by their ID
  const [completedSections, setCompletedSections] = useState<string[]>(initialCompleted);
  const [viewedSections, setViewedSections] = useState<string[]>(initialViewed);
  const [isToggling, setIsToggling] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Safely find the first available section if any
  const firstSection = course?.modules?.[0]?.sections?.[0];
  const [activeSectionId, setActiveSectionId] = useState(firstSection?._id || firstSection?.id || null);
  const [isCurrentSectionViewed, setIsCurrentSectionViewed] = useState(false);
  const pdfWrapperRef = useRef<HTMLDivElement>(null);

  const handleMarkViewed = async (sectionId: string) => {
    if (!viewedSections.includes(sectionId)) {
      setViewedSections(prev => [...prev, sectionId]);
      try {
        await markSectionViewedFn({ data: { courseId, sectionId } });
      } catch(e) {}
    }
    setIsCurrentSectionViewed(true);
  };

  useEffect(() => {
    if (activeSectionId && viewedSections.includes(activeSectionId)) {
      setIsCurrentSectionViewed(true);
    } else {
      setIsCurrentSectionViewed(false);
    }
    // If the active section changes, we check if it's a PDF that is too small to scroll
    const timer = setTimeout(() => {
      if (pdfWrapperRef.current && activeSectionId) {
        const target = pdfWrapperRef.current;
        if (target.scrollHeight <= target.clientHeight + 10) {
          handleMarkViewed(activeSectionId);
        }
      }
    }, 1500); // give it time to render pages
    return () => clearTimeout(timer);
  }, [activeSectionId, viewedSections]);

  if (!course) {
    return <div className="p-8 text-center">Course not found.</div>;
  }

  // Find the currently active section object
  let activeSection = null;
  let activeModule = null;
  for (const module of course.modules || []) {
    const found = module.sections?.find((s: any) => (s._id || s.id) === activeSectionId);
    if (found) {
      activeSection = found;
      activeModule = module;
      break;
    }
  }

  const toggleCompletion = async (id: string) => {
    if (isToggling) return;
    setIsToggling(true);
    
    // Optimistic UI update
    setCompletedSections(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );

    try {
      await toggleSectionCompletionFn({ data: { courseId, sectionId: id } });
      router.invalidate(); // Refresh loader data behind the scenes
    } catch (error) {
      console.error("Failed to toggle completion:", error);
      // Revert on failure
      setCompletedSections(prev => 
        prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
      );
    } finally {
      setIsToggling(false);
    }
  };

  // Calculate Course Progress
  const totalModulesCount = course.modules?.length || 0;
  let completedModulesCount = 0;
  
  course.modules?.forEach((module: any) => {
    if (!module.sections || module.sections.length === 0) return;
    const isModuleComplete = module.sections.every((s: any) => completedSections.includes(s._id || s.id));
    if (isModuleComplete) {
      completedModulesCount++;
    }
  });
  
    const progressPercentage = totalModulesCount > 0 
    ? Math.round((completedModulesCount / totalModulesCount) * 100) 
    : 0;

  const renderCourseContent = (onSelectSection?: (id: string) => void) => (
    <div className="p-4">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">Course Content</h2>
      <Accordion type="multiple" defaultValue={course.modules?.[0]?.id ? [course.modules[0].id] : []} className="w-full">
        {course.modules?.map((module: any) => {
          const isModuleComplete = module.sections?.length > 0 && module.sections.every((s: any) => completedSections.includes(s._id || s.id));
          return (
            <AccordionItem value={module.id} key={module.id} className="border-border">
              <AccordionTrigger className="hover:no-underline hover:text-primary">
                <div className="flex items-center gap-2">
                  {isModuleComplete && <CheckCircle2 size={16} className="text-success shrink-0" />}
                  <span className={`font-bold text-left ${isModuleComplete ? 'text-foreground' : ''}`}>{module.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
              <div className="flex flex-col space-y-1">
                {module.sections?.map((section: any) => {
                  const sId = section._id || section.id;
                  const isActive = activeSectionId === sId;
                  const isCompleted = completedSections.includes(sId);
                  return (
                    <button
                      key={sId}
                      onClick={() => {
                        setActiveSectionId(sId);
                        onSelectSection?.(sId);
                      }}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        isActive
                          ? "bg-blue-50 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-[#F1F5F9] hover:text-foreground font-medium"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={16} className="text-success" />
                      ) : section.type === "video" ? (
                        <PlayCircle size={16} className={isActive ? "text-primary" : "text-muted-foreground"} />
                      ) : section.type === "pdf" ? (
                        <FileText size={16} className={isActive ? "text-primary" : "text-muted-foreground"} />
                      ) : (
                        <HelpCircle size={16} className={isActive ? "text-primary" : "text-muted-foreground"} />
                      )}
                      
                      <span className="flex-1 truncate">{section.title}</span>
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )})}
      </Accordion>
      
      {course.quiz && course.quiz.questions?.length > 0 && (
        <div className="mt-6">
          <button 
            onClick={() => {
              if (progressPercentage === 100) {
                setActiveSectionId('final-quiz');
                onSelectSection?.('final-quiz');
              }
            }}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              activeSectionId === 'final-quiz' 
                ? 'border-primary bg-primary/5 text-primary' 
                : quizPassed 
                  ? 'border-success bg-success/5 text-success'
                  : progressPercentage === 100 
                    ? 'border-border hover:border-primary/50 text-foreground bg-white' 
                    : 'border-border/50 bg-muted/30 text-muted-foreground cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-3">
              {quizPassed ? (
                <CheckCircle2 size={20} className="text-success" />
              ) : (
                <HelpCircle size={20} className={progressPercentage === 100 ? 'text-primary' : 'text-muted-foreground'} />
              )}
              <span className="font-bold">Final Quiz</span>
            </div>
            {!quizPassed && progressPercentage < 100 && (
              <div className="p-1.5 rounded-full bg-muted text-muted-foreground">
                <Lock size={14} />
              </div>
            )}
          </button>
          {!quizPassed && progressPercentage < 100 && (
            <p className="text-[10px] text-center text-muted-foreground mt-2 px-4">
              Complete all modules to unlock the final quiz.
            </p>
          )}
        </div>
      )}

      {isCompleted && (
        <div className="mt-4">
          <button 
            onClick={() => {
              setActiveSectionId('certificate');
              onSelectSection?.('certificate');
            }}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              activeSectionId === 'certificate' 
                ? 'border-primary bg-primary/5 text-primary' 
                : 'border-border hover:border-primary/50 text-foreground bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Award size={20} className="text-[#FFB800]" />
              <span className="font-bold">Certificate</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen w-full flex-col bg-[#F8FAFC]">
      {/* Top Header */}
      <header className="print:hidden flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <Link to="/dashboard" className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#F1F5F9] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <ArrowLeft size={18} />
          </Link>
          <div className="h-6 w-px bg-border shrink-0"></div>
          <div className="flex items-center gap-4 min-w-0">
            <h1 className="text-sm sm:text-lg font-bold text-foreground truncate max-w-[140px] sm:max-w-xs md:max-w-md lg:max-w-none">{course.title}</h1>
            <div className="hidden items-center gap-3 pl-4 border-l border-border md:flex">
              <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                {completedModulesCount} / {totalModulesCount} Modules
              </span>
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                <div 
                  className="h-full rounded-full bg-success transition-all duration-500 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-[#F1F5F9] text-xs font-semibold text-foreground hover:bg-muted lg:hidden"
            aria-label="Open Course Modules"
          >
            <Menu size={16} />
            <span>Modules</span>
          </button>
          <Logo />
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Course Modules (Desktop) */}
        <aside className="print:hidden w-80 flex-col overflow-y-auto border-r border-border bg-white lg:flex hidden shrink-0">
          {renderCourseContent()}
        </aside>

        {/* Mobile Course Modules Drawer (Sheet) */}
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetContent side="left" className="w-[320px] max-w-[88vw] p-0 bg-white border-r border-border flex flex-col h-full lg:hidden">
            <div className="flex h-16 items-center px-6 border-b border-border/50 justify-between">
              <Logo />
            </div>
            <div className="flex-1 overflow-y-auto">
              {renderCourseContent(() => setIsMobileNavOpen(false))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-white p-4 sm:p-6 md:p-10 relative flex flex-col print:overflow-visible print:p-0 print:bg-transparent">
          <div className="mx-auto w-full max-w-6xl flex-1 flex flex-col print:max-w-none print:w-full print:block">
            {/* Viewer Header */}
            <div className="print:hidden mb-4 sm:mb-6 flex flex-col space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-muted-foreground min-w-0">
                  <Link to="/dashboard" className="hover:text-primary transition-colors shrink-0">My Course</Link>
                  <span className="shrink-0">&gt;</span>
                  <span className="max-w-[120px] sm:max-w-xs truncate">{course.title}</span>
                  <span className="shrink-0">&gt;</span>
                  <span className="text-foreground font-semibold truncate max-w-[140px] sm:max-w-none">
                    {activeSectionId === 'final-quiz' ? 'Final Quiz' : 
                     activeSectionId === 'certificate' ? 'Certificate' : 
                     activeModule?.title.replace(/^\d+\.\s*/, '')}
                  </span>
                </div>
                
                {activeSectionId !== 'final-quiz' && activeSectionId !== 'certificate' && activeSection && (
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start sm:self-auto">
                    <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#F1F5F9] rounded-full text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {activeSection?.type}
                    </div>
                    {activeSection?.type !== 'quiz' && (() => {
                      const isCompleted = completedSections.includes(activeSectionId!);
                      const canMarkDone = isCompleted || isCurrentSectionViewed;

                      return (
                        <button
                          onClick={() => toggleCompletion(activeSectionId!)}
                          disabled={isToggling || !canMarkDone}
                          className={`flex items-center gap-1.5 sm:gap-2 rounded-full px-3.5 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                            isCompleted
                              ? "bg-success/10 text-success hover:bg-success/20"
                              : canMarkDone
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 size={16} /> Completed
                            </>
                          ) : canMarkDone ? (
                            "Mark as Done"
                          ) : (
                            <span><span className="sm:inline hidden">Watch/Read to the end to </span>unlock</span>
                          )}
                        </button>
                      );
                    })()}
                  </div>
                )}
              </div>
              
              {activeSectionId !== 'final-quiz' && activeSectionId !== 'certificate' && (
                <h2 className="text-base sm:text-2xl font-bold text-foreground leading-snug break-words">
                  {activeSection?.title.replace(/^\d+\.\d+\s*/, '')}
                </h2>
              )}
            </div>

            {/* Viewer Body */}
            <div className="flex-1 relative bg-[#F1F5F9] rounded-2xl overflow-hidden shadow-sm border border-border/50 print:border-none print:shadow-none print:rounded-none print:bg-white print:static">
              {activeSection?.type === "video" && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-border/50 relative">
                  <video 
                    className="absolute inset-0 h-full w-full object-contain bg-black" 
                    controls 
                    controlsList="nodownload"
                    preload="metadata"
                    src={(activeSection as any).url}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    onEnded={() => handleMarkViewed(activeSectionId!)}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {activeSection?.type === "pdf" && activeSectionId !== 'certificate' && activeSectionId !== 'final-quiz' && (
                <div 
                  ref={pdfWrapperRef}
                  className="absolute inset-0 h-full w-full overflow-y-auto bg-gray-100 flex flex-col items-center p-4"
                  onContextMenu={(e) => e.preventDefault()}
                  onScroll={(e) => {
                    const target = e.currentTarget;
                    if (target.scrollHeight - target.scrollTop - target.clientHeight < 50) {
                      handleMarkViewed(activeSectionId!);
                    }
                  }}
                >
                  <ClientPdfViewer url={(activeSection as any).url} />
                </div>
              )}

              {activeSection?.type === "quiz" && activeSectionId !== 'certificate' && activeSectionId !== 'final-quiz' && (
                <div className="h-full w-full bg-white relative">
                  <QuizExecution 
                    courseId={course.courseId} 
                    sectionId={activeSectionId!}
                    quizConfig={activeSection.quiz}
                    onPass={() => {
                      if (!completedSections.includes(activeSectionId!)) {
                        toggleCompletion(activeSectionId!);
                      }
                    }}
                  />
                </div>
              )}

              {activeSectionId === 'final-quiz' && (
                <QuizExecution 
                  courseId={course.courseId} 
                  quizConfig={course.quiz} 
                  onPass={() => {
                    router.invalidate();
                  }}
                />
              )}

              {activeSectionId === 'certificate' && (
                <CertificateViewer 
                  certificate={course.certificate} 
                  course={course}
                  studentName={studentName}
                  completedAt={completedAt}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


export const Route = createFileRoute('/course/$courseId')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
    if (context.user.role === "admin") throw redirect({ to: "/admin-dashboard" });
  },
  component: CourseViewerPage,
  loader: async ({ params }) => {
    try {
      return await getStudentCourseDataFn({ data: { courseId: params.courseId } });
    } catch (error: any) {
      if (error.message.includes("Not Enrolled")) {
        throw redirect({ to: "/dashboard" });
      }
      throw error;
    }
  },
  errorComponent: () => {
    return <div className="p-8 text-center">Course not found or you are not enrolled.</div>;
  }
});
