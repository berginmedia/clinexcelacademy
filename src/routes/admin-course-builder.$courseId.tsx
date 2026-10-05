import { Link, createFileRoute, useRouter, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { QuizBuilder } from "../components/QuizBuilder";
import { CertificateBuilder } from "../components/CertificateBuilder";
import { 
  ArrowLeft, 
  Settings, 
  BookOpen, 
  Eye, 
  HelpCircle, 
  Award, 
  Save, 
  Plus,
  GripVertical,
  Trash2,
  Video,
  FileText,
  UploadCloud,
  CheckCircle2
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export const Route = createFileRoute('/admin-course-builder/$courseId')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
    if (context.user.role !== "admin") throw redirect({ to: "/dashboard" });
  },
  component: AdminCourseBuilderPage,
  loader: async ({ params }) => {
    if (params.courseId === 'new') return null;
    const { getCourseFn } = await import('../actions/courses');
    return await getCourseFn({ data: { courseId: params.courseId } });
  }
});

function AdminCourseBuilderPage() {
  const { courseId } = Route.useParams();
  const existingCourse = Route.useLoaderData();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>("details");
  const [isSaving, setIsSaving] = useState(false);

  // State
  const [courseTitle, setCourseTitle] = useState(existingCourse?.title || "New Course Title");
  const [courseDescription, setCourseDescription] = useState(existingCourse?.description || "Description here...");
  const [status, setStatus] = useState(existingCourse?.visibility || "draft");
  const [category, setCategory] = useState(existingCourse?.category || "CODE");
  const [author, setAuthor] = useState(existingCourse?.author || "Clinexcel Team");
  const [bg, setBg] = useState(existingCourse?.bg || "bg-blue-50");
  const [modules, setModules] = useState<any[]>(existingCourse?.modules || []);
  const [quizConfig, setQuizConfig] = useState<any>(existingCourse?.quiz || null);
  const [certificateConfig, setCertificateConfig] = useState<any>(existingCourse?.certificate || null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { createCourseFn, updateCourseFn } = await import('../actions/courses');
      const payload = {
        title: courseTitle,
        description: courseDescription,
        visibility: status,
        category,
        author,
        bg,
        modules,
        quiz: quizConfig,
        certificate: certificateConfig
      };

      if (courseId === 'new') {
        const res = await createCourseFn({ data: payload });
        router.navigate({ to: `/admin-course-builder/${res.courseId}` });
      } else {
        await updateCourseFn({ data: { courseId, updates: payload } });
        alert("Course updated successfully!");
        router.invalidate();
      }
    } catch (e: any) {
      alert(e.message || "Failed to save course");
    } finally {
      setIsSaving(false);
    }
  };

  const [uploadingSections, setUploadingSections] = useState<Record<string, number>>({});

  const handleFileUpload = async (mIndex: number, sIndex: number, file: File) => {
    const key = `${mIndex}-${sIndex}`;
    setUploadingSections(prev => ({ ...prev, [key]: 0 }));
    
    try {
      const { getPresignedUrlFn } = await import('../actions/upload');
      
      const { signedUrl, finalUrl } = await getPresignedUrlFn({ 
        data: { filename: file.name, contentType: file.type } 
      });

      // We'll use XMLHttpRequest to track progress
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadingSections(prev => ({ ...prev, [key]: percentComplete }));
          }
        };
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(null);
          } else {
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        
        xhr.open("PUT", signedUrl, true);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      updateSection(mIndex, sIndex, 'url', finalUrl);
      
    } catch (e: any) {
      alert(`Upload failed: ${e.message}`);
    } finally {
      setUploadingSections(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handlePreview = async (s3Url: string) => {
    try {
      if (!s3Url.startsWith("s3://")) {
        window.open(s3Url, "_blank");
        return;
      }
      const { getDownloadUrlFn } = await import('../actions/upload');
      const res = await getDownloadUrlFn({ data: { s3Url } });
      window.open(res.url, "_blank");
    } catch (e: any) {
      alert("Failed to load preview: " + e.message);
    }
  };

  const handleDelete = async () => {
    if (courseId === 'new') {
      router.navigate({ to: '/admin-courses' });
      return;
    }
    const { deleteCourseFn } = await import('../actions/courses');
    if (confirm("Are you sure you want to delete this course?")) {
      const res = await deleteCourseFn({ data: { courseId } });
      if (res.success) {
        router.navigate({ to: '/admin-courses' });
      }
    }
  };

  const addModule = () => {
    setModules([...modules, { id: 'm' + Date.now(), title: "New Module", sections: [] }]);
  };

  const updateModuleTitle = (mIndex: number, title: string) => {
    const newMods = [...modules];
    newMods[mIndex].title = title;
    setModules(newMods);
  };

  const deleteModule = (mIndex: number) => {
    const newMods = [...modules];
    newMods.splice(mIndex, 1);
    setModules(newMods);
  };

  const addSection = (mIndex: number) => {
    const newMods = [...modules];
    newMods[mIndex].sections.push({ id: 's' + Date.now(), title: "New Section", type: "video", url: "" });
    setModules(newMods);
  };

  const updateSection = (mIndex: number, sIndex: number, key: string, value: string) => {
    const newMods = [...modules];
    newMods[mIndex].sections[sIndex][key] = value;
    setModules(newMods);
  };

  const deleteSection = (mIndex: number, sIndex: number) => {
    const newMods = [...modules];
    newMods[mIndex].sections.splice(sIndex, 1);
    setModules(newMods);
  };

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === "module") {
      const newMods = Array.from(modules);
      const [moved] = newMods.splice(source.index, 1);
      newMods.splice(destination.index, 0, moved);
      setModules(newMods);
      return;
    }

    if (type === "section") {
      const sourceModuleId = source.droppableId;
      const destModuleId = destination.droppableId;

      const sourceModuleIndex = modules.findIndex(m => m.id === sourceModuleId);
      const destModuleIndex = modules.findIndex(m => m.id === destModuleId);

      if (sourceModuleIndex === -1 || destModuleIndex === -1) return;

      const newMods = Array.from(modules);
      const sourceSections = Array.from(newMods[sourceModuleIndex].sections);
      
      const [movedSection] = sourceSections.splice(source.index, 1);
      newMods[sourceModuleIndex].sections = sourceSections;

      if (sourceModuleId === destModuleId) {
        sourceSections.splice(destination.index, 0, movedSection);
      } else {
        const destSections = Array.from(newMods[destModuleIndex].sections);
        destSections.splice(destination.index, 0, movedSection);
        newMods[destModuleIndex].sections = destSections;
      }
      
      setModules(newMods);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-[#F8FAFC]">
      {/* Top Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <Link to="/admin-courses" className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#F1F5F9] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <ArrowLeft size={18} />
          </Link>
          <div className="h-6 w-px bg-border shrink-0"></div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-foreground truncate">Course Builder</h1>
            <span className="text-[11px] sm:text-xs text-muted-foreground truncate">Editing: {courseTitle}</span>
          </div>
          <div className={`hidden sm:inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shrink-0 ${status === 'published' ? 'bg-success/10 text-success' : 'bg-orange-100 text-orange-600'}`}>
            {status}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-primary px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition-opacity hover:bg-primary/90 disabled:opacity-50">
            <Save size={16} /> <span>{isSaving ? "Saving..." : "Save"}</span>
          </button>
          <div className="hidden sm:block h-6 w-px bg-border"></div>
          <div className="hidden sm:block"><Logo /></div>
        </div>
      </header>

      {/* Mobile/Tablet Horizontal Tabs */}
      <div className="flex lg:hidden overflow-x-auto border-b border-border bg-white p-2.5 gap-2 shrink-0">
        <MobileTabPill active={activeTab === "details"} onClick={() => setActiveTab("details")} icon={Settings} label="Details" />
        <MobileTabPill active={activeTab === "modules" || activeTab.startsWith("quiz-")} onClick={() => setActiveTab("modules")} icon={BookOpen} label="Modules" />
        <MobileTabPill active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quiz" />
        <MobileTabPill active={activeTab === "certificate"} onClick={() => setActiveTab("certificate")} icon={Award} label="Certificate" />
        <MobileTabPill active={activeTab === "visibility"} onClick={() => setActiveTab("visibility")} icon={Eye} label="Visibility" />
      </div>

      {/* Main Builder Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tabs (Desktop Only) */}
        <aside className="w-64 flex-col border-r border-border bg-white hidden lg:flex shrink-0">
          <div className="p-4">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground pl-2">Configuration</h2>
            <nav className="space-y-1">
              <TabButton active={activeTab === "details"} onClick={() => setActiveTab("details")} icon={Settings} label="Course Details" />
              <TabButton active={activeTab === "modules"} onClick={() => setActiveTab("modules")} icon={BookOpen} label="Modules & Sections" />
              <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quiz Builder" />
              <TabButton active={activeTab === "certificate"} onClick={() => setActiveTab("certificate")} icon={Award} label="Certificate Config" />
              <div className="my-4 h-px bg-border w-full" />
              <TabButton active={activeTab === "visibility"} onClick={() => setActiveTab("visibility")} icon={Eye} label="Visibility & Danger" />
            </nav>
          </div>
        </aside>

        {/* Tab Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative flex justify-center">
          <div className="w-full max-w-4xl">
            
            {activeTab === "details" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Course Details</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage the core information of this course.</p>
                </div>
                
                <div className="space-y-6 bg-white p-5 sm:p-8 rounded-2xl border border-border shadow-sm">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Course Title</label>
                    <input 
                      type="text" 
                      value={courseTitle} 
                      onChange={(e) => setCourseTitle(e.target.value)}
                      className="w-full rounded-xl border border-border bg-transparent p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Course Description</label>
                    <textarea 
                      rows={4}
                      value={courseDescription}
                      onChange={(e) => setCourseDescription(e.target.value)}
                      className="w-full rounded-xl border border-border bg-transparent p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Category</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-border bg-transparent p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                        <option value="DESIGN">Design</option>
                        <option value="CODE">Code</option>
                        <option value="BUSINESS">Business</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Author</label>
                      <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full rounded-xl border border-border bg-transparent p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Background Color (Thumbnail)</label>
                    <select value={bg} onChange={(e) => setBg(e.target.value)} className="w-full rounded-xl border border-border bg-transparent p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                      <option value="bg-orange-100">Orange</option>
                      <option value="bg-red-100">Red</option>
                      <option value="bg-blue-400">Blue</option>
                      <option value="bg-green-100">Green</option>
                      <option value="bg-purple-100">Purple</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "modules" && (
              <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Modules & Sections</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Build your curriculum by adding modules and content sections.</p>
                  </div>
                  <button onClick={addModule} className="flex items-center justify-center gap-2 rounded-full bg-blue-50 text-primary px-4 py-2 text-sm font-semibold transition-colors hover:bg-blue-100 w-full sm:w-auto">
                    <Plus size={16} /> Add Module
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-border shadow-sm p-2 sm:p-3">
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="course-modules" type="module">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          <Accordion type="multiple" defaultValue={modules.map(m => m.id)} className="w-full">
                            {modules.map((mod, mIndex) => (
                              <Draggable key={mod.id} draggableId={mod.id} index={mIndex}>
                                {(providedMod) => (
                                  <div ref={providedMod.innerRef} {...providedMod.draggableProps}>
                                    <AccordionItem value={mod.id} className="border-border px-3 sm:px-4 py-2 border-b last:border-0 bg-white">
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2 sm:gap-0">
                                        <div className="flex items-center justify-between w-full sm:w-auto">
                                          <AccordionTrigger className="hover:no-underline text-foreground py-2 sm:py-4 flex-1 sm:flex-initial" onClick={(e) => {
                                            // Ensure drag handle doesn't trigger accordion open if clicked on
                                            if ((e.target as HTMLElement).closest('.drag-handle')) {
                                              e.preventDefault();
                                              e.stopPropagation();
                                            }
                                          }}>
                                            <div className="flex items-center gap-2 sm:gap-3">
                                              <div {...providedMod.dragHandleProps} className="drag-handle p-1 -ml-1 text-muted-foreground hover:bg-muted rounded cursor-grab">
                                                <GripVertical size={16} />
                                              </div>
                                              <span className="font-bold text-sm sm:text-base whitespace-nowrap">Module {mIndex + 1}</span>
                                            </div>
                                          </AccordionTrigger>
                                          <button onClick={() => deleteModule(mIndex)} className="sm:hidden p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0">
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                        
                                        <div className="flex items-center flex-1 w-full sm:w-auto sm:mx-4">
                                          <input 
                                            className="font-bold text-sm sm:text-base border border-border rounded-lg px-3 py-1.5 flex-1 bg-[#F8FAFC] sm:bg-transparent w-full" 
                                            placeholder="Module title..."
                                            value={mod.title} 
                                            onChange={(e) => updateModuleTitle(mIndex, e.target.value)} 
                                            onClick={(e) => e.stopPropagation()} 
                                          />
                                        </div>

                                        <button onClick={() => deleteModule(mIndex)} className="hidden sm:block p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0">
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                      
                                      <AccordionContent className="pt-2 sm:pt-4 pb-4 sm:pb-6">
                                        <div className="space-y-4 pl-0 sm:pl-7 pr-0 sm:pr-2">
                                          <Droppable droppableId={mod.id} type="section">
                                            {(providedSecList) => (
                                              <div {...providedSecList.droppableProps} ref={providedSecList.innerRef} className="space-y-4 min-h-[50px]">
                                                {mod.sections?.map((sec: any, sIndex: number) => (
                                                  <Draggable key={sec.id} draggableId={sec.id} index={sIndex}>
                                                    {(providedSec) => (
                                                      <div 
                                                        ref={providedSec.innerRef} 
                                                        {...providedSec.draggableProps} 
                                                        className="border border-border rounded-xl p-3 sm:p-4 bg-[#F8FAFC]"
                                                      >
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 mb-4">
                                                          <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 w-full sm:w-auto">
                                                            <div className="flex items-center gap-2">
                                                              <div {...providedSec.dragHandleProps} className="p-1 -ml-1 text-muted-foreground hover:bg-muted rounded cursor-grab">
                                                                <GripVertical size={14} />
                                                              </div>
                                                              <select 
                                                                value={sec.type} 
                                                                onChange={(e) => updateSection(mIndex, sIndex, 'type', e.target.value)}
                                                                className="border border-border rounded-lg p-1.5 text-xs font-semibold bg-white cursor-pointer"
                                                              >
                                                                <option value="video">Video</option>
                                                                <option value="pdf">PDF</option>
                                                                <option value="quiz">Quiz</option>
                                                              </select>
                                                            </div>
                                                            <button onClick={() => deleteSection(mIndex, sIndex)} className="sm:hidden text-muted-foreground hover:text-red-500 transition-colors p-1">
                                                              <Trash2 size={15} />
                                                            </button>
                                                          </div>
                                                          
                                                          <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
                                                            <input 
                                                              className="font-semibold text-sm flex-1 border border-border rounded-lg px-2.5 py-1.5 bg-white sm:bg-transparent w-full" 
                                                              placeholder="Section title..."
                                                              value={sec.title} 
                                                              onChange={(e) => updateSection(mIndex, sIndex, 'title', e.target.value)}
                                                            />
                                                          </div>

                                                          <button onClick={() => deleteSection(mIndex, sIndex)} className="hidden sm:block text-muted-foreground hover:text-red-500 transition-colors ml-2 sm:ml-4 shrink-0">
                                                            <Trash2 size={14} />
                                                          </button>
                                                        </div>

                                                        <div className="space-y-2">
                                                          {sec.type === 'quiz' ? (
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-2 border-dashed border-border rounded-xl p-4 sm:p-6 bg-white">
                                                              <div className="flex-1">
                                                                <label className="text-sm font-bold text-foreground block mb-1">Module Quiz</label>
                                                                <p className="text-xs text-muted-foreground">Configure the questions for this quiz module.</p>
                                                              </div>
                                                              <button 
                                                                onClick={() => setActiveTab(`quiz-${mIndex}-${sIndex}`)}
                                                                className="rounded-xl bg-blue-50 text-blue-600 px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold transition-colors hover:bg-blue-100 border border-blue-200 text-center w-full sm:w-auto"
                                                              >
                                                                Configure Quiz
                                                              </button>
                                                            </div>
                                                          ) : (
                                                            <>
                                                              <label className="text-xs font-bold text-foreground">Upload Content ({sec.type.toUpperCase()})</label>
                                                              
                                                              {uploadingSections[`${mIndex}-${sIndex}`] !== undefined ? (
                                                                <div className="w-full mt-2">
                                                                  <div className="w-full bg-muted rounded-full h-2">
                                                                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${uploadingSections[`${mIndex}-${sIndex}`]}%` }}></div>
                                                                  </div>
                                                                  <p className="text-xs text-muted-foreground mt-2 text-center">Uploading... {uploadingSections[`${mIndex}-${sIndex}`]}%</p>
                                                                </div>
                                                              ) : sec.url ? (
                                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-2">
                                                                  <div className="flex-1 flex items-center gap-2 text-xs sm:text-sm text-success font-medium border border-success/30 bg-success/5 p-2.5 rounded-lg">
                                                                    <CheckCircle2 size={16} className="shrink-0" />
                                                                    <span className="truncate">{sec.type === 'video' ? 'Video File Attached' : 'PDF Document Attached'}</span>
                                                                  </div>
                                                                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                                                    <button 
                                                                      onClick={() => handlePreview(sec.url)}
                                                                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-blue-200 transition-colors"
                                                                    >
                                                                      <Eye size={15} /> View
                                                                    </button>
                                                                    <label className="flex-1 sm:flex-initial flex items-center justify-center cursor-pointer bg-muted hover:bg-muted/80 text-foreground text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-border transition-colors">
                                                                      Replace
                                                                      <input 
                                                                        type="file" 
                                                                        className="hidden" 
                                                                        accept={sec.type === 'video' ? 'video/*' : 'application/pdf'}
                                                                        onChange={(e) => e.target.files?.[0] && handleFileUpload(mIndex, sIndex, e.target.files[0])}
                                                                      />
                                                                    </label>
                                                                  </div>
                                                                </div>
                                                              ) : (
                                                                <label className="cursor-pointer flex items-center justify-center w-full border-2 border-dashed border-border rounded-xl p-4 sm:p-6 bg-white hover:bg-muted/50 transition-colors">
                                                                  <div className="flex flex-col items-center gap-2 text-muted-foreground text-center">
                                                                    <UploadCloud size={24} />
                                                                    <span className="text-xs sm:text-sm font-medium">Click to upload {sec.type === 'video' ? 'video' : 'PDF'}</span>
                                                                  </div>
                                                                  <input 
                                                                    type="file" 
                                                                    className="hidden" 
                                                                    accept={sec.type === 'video' ? 'video/*' : 'application/pdf'}
                                                                    onChange={(e) => e.target.files?.[0] && handleFileUpload(mIndex, sIndex, e.target.files[0])}
                                                                  />
                                                                </label>
                                                              )}
                                                            </>
                                                          )}
                                                        </div>
                                                      </div>
                                                    )}
                                                  </Draggable>
                                                ))}
                                                {providedSecList.placeholder}
                                              </div>
                                            )}
                                          </Droppable>

                                          <button onClick={() => addSection(mIndex)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-white py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                                            <Plus size={16} /> Add Section
                                          </button>
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            {modules.length === 0 && <div className="p-4 text-center text-muted-foreground text-sm">No modules added yet.</div>}
                          </Accordion>
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>
            )}

            {activeTab === "visibility" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Visibility & Danger Zone</h2>
                  <p className="text-sm text-muted-foreground mt-1">Control who can see this course, or permanently delete it.</p>
                </div>
                
                <div className="space-y-6 bg-white p-8 rounded-2xl border border-border shadow-sm">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-foreground">Publish Status</label>
                    <div className="flex gap-4">
                      <button onClick={() => setStatus('draft')} className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-all ${status === 'draft' ? 'border-primary bg-blue-50 text-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>Draft</button>
                      <button onClick={() => setStatus('hidden')} className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-all ${status === 'hidden' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-border text-muted-foreground hover:bg-muted'}`}>Hidden</button>
                      <button onClick={() => setStatus('published')} className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-all ${status === 'published' ? 'border-success bg-success/10 text-success' : 'border-border text-muted-foreground hover:bg-muted'}`}>Published</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 bg-red-50 p-8 rounded-2xl border border-red-100 shadow-sm">
                  <div>
                    <h3 className="text-lg font-bold text-red-600 mb-1">Delete Course</h3>
                    <p className="text-sm text-red-600/80 mb-4">Once you delete a course, there is no going back. Please be certain.</p>
                    <button onClick={handleDelete} className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90">
                      Delete Course
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "quiz" && (
              <QuizBuilder 
                quiz={quizConfig} 
                onChange={setQuizConfig} 
                onSave={handleSave} 
                isSaving={isSaving} 
              />
            )}

            {activeTab === "certificate" && (
              <CertificateBuilder
                certificate={certificateConfig}
                course={{ title: courseTitle }}
                onChange={setCertificateConfig}
                onSave={handleSave}
                isSaving={isSaving}
              />
            )}

            {activeTab.startsWith("quiz-") && (() => {
              const [_, mIndexStr, sIndexStr] = activeTab.split("-");
              const mIndex = parseInt(mIndexStr);
              const sIndex = parseInt(sIndexStr);
              const module = modules[mIndex];
              const section = module?.sections?.[sIndex];

              if (!section) return null;

              return (
                <div className="space-y-4">
                  <button 
                    onClick={() => setActiveTab("modules")}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                  >
                    <ArrowLeft size={16} /> Back to Course Outline
                  </button>
                  
                  <QuizBuilder 
                    quiz={section.quiz}
                    title={`${section.title}`}
                    description={`Configure the questions for ${section.title} in ${module.title}.`}
                    onChange={(newQuiz) => {
                      const newModules = [...modules];
                      newModules[mIndex].sections[sIndex].quiz = newQuiz;
                      setModules(newModules);
                    }}
                    onSave={handleSave}
                    isSaving={isSaving}
                  />
                </div>
              );
            })()}

          </div>
        </main>
      </div>
    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? "bg-blue-50 text-primary font-semibold"
          : "text-muted-foreground hover:bg-[#F1F5F9] hover:text-foreground"
      }`}
    >
      <Icon size={18} className={active ? "text-primary" : "text-muted-foreground"} />
      {label}
    </button>
  );
}

function MobileTabPill({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
        active 
          ? "bg-primary text-white shadow-sm" 
          : "bg-[#F1F5F9] text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon size={14} />
      <span>{label}</span>
    </button>
  );
}
