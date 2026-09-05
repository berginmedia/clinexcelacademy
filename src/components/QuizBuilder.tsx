import { useState } from "react";
import { Plus, Trash2, Edit2, Settings, List, Save } from "lucide-react";

export function QuizBuilder({ quiz, onChange, onSave, isSaving, title = "Final Course Quiz", description = "Configure the final assessment for this course." }: { quiz: any, onChange: (q: any) => void, onSave: () => void, isSaving: boolean, title?: string, description?: string }) {
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  const defaultQuiz = {
    timeLimit: 10,
    passPercentage: 70,
    displayCount: 10,
    questions: []
  };

  const currentQuiz = quiz || defaultQuiz;

  const updateField = (field: string, value: number) => {
    onChange({ ...currentQuiz, [field]: value });
  };

  const addQuestion = () => {
    const newQ = {
      id: Math.random().toString(36).substring(7),
      text: "New Question",
      options: ["Option 1", "Option 2"],
      correctOptionIndex: 0
    };
    onChange({ ...currentQuiz, questions: [...currentQuiz.questions, newQ] });
    setEditingQuestionIndex(currentQuiz.questions.length);
  };

  const deleteQuestion = (index: number) => {
    const newQs = [...currentQuiz.questions];
    newQs.splice(index, 1);
    onChange({ ...currentQuiz, questions: newQs });
    if (editingQuestionIndex === index) setEditingQuestionIndex(null);
  };

  const updateQuestion = (index: number, q: any) => {
    const newQs = [...currentQuiz.questions];
    newQs[index] = q;
    onChange({ ...currentQuiz, questions: newQs });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <button onClick={onSave} disabled={isSaving} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:bg-primary/90 disabled:opacity-50">
          <Save size={16} /> {isSaving ? "Saving..." : "Save Quiz"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-foreground font-bold pb-2 border-b">
              <Settings size={18} /> Settings
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Time Limit (mins)</label>
              <input type="number" min="1" value={currentQuiz.timeLimit} onChange={e => updateField('timeLimit', parseInt(e.target.value) || 1)} className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-primary" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Passing Score (%)</label>
              <input type="number" min="1" max="100" value={currentQuiz.passPercentage} onChange={e => updateField('passPercentage', parseInt(e.target.value) || 1)} className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-primary" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Questions per Attempt</label>
              <input type="number" min="1" value={currentQuiz.displayCount} onChange={e => updateField('displayCount', parseInt(e.target.value) || 1)} className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-primary" />
              <p className="text-[10px] text-muted-foreground leading-tight mt-1">
                If you add {currentQuiz.questions.length} questions to the bank, the quiz will randomly select {currentQuiz.displayCount} for each student attempt.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-2 border-b">
              <div className="flex items-center gap-2 text-foreground font-bold">
                <List size={18} /> Question Bank ({currentQuiz.questions.length})
              </div>
              <button onClick={addQuestion} className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80">
                <Plus size={14} /> Add Question
              </button>
            </div>

            <div className="space-y-4">
              {currentQuiz.questions.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground bg-muted/30 rounded-xl">
                  No questions added yet.
                </div>
              )}

              {currentQuiz.questions.map((q: any, i: number) => (
                <div key={q.id} className="border border-border rounded-xl overflow-hidden transition-all">
                  {editingQuestionIndex === i ? (
                    <div className="p-4 bg-[#F8FAFC] space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground">Question Text</label>
                        <textarea value={q.text} onChange={e => updateQuestion(i, { ...q, text: e.target.value })} className="w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-primary min-h-[80px]" placeholder="Enter question..." />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground flex justify-between">
                          Options
                          {q.options.length < 4 && (
                            <button onClick={() => updateQuestion(i, { ...q, options: [...q.options, `Option ${q.options.length + 1}`] })} className="text-primary hover:underline">Add Option</button>
                          )}
                        </label>
                        {q.options.map((opt: string, optIdx: number) => (
                          <div key={optIdx} className="flex items-center gap-3">
                            <input type="radio" checked={q.correctOptionIndex === optIdx} onChange={() => updateQuestion(i, { ...q, correctOptionIndex: optIdx })} className="w-4 h-4 text-primary" name={`correct-${q.id}`} />
                            <input type="text" value={opt} onChange={e => {
                              const newOpts = [...q.options];
                              newOpts[optIdx] = e.target.value;
                              updateQuestion(i, { ...q, options: newOpts });
                            }} className={`flex-1 rounded-lg border p-2 text-sm outline-none focus:border-primary ${q.correctOptionIndex === optIdx ? 'border-success bg-success/5' : 'border-border bg-white'}`} placeholder={`Option ${optIdx + 1}`} />
                            {q.options.length > 2 && (
                              <button onClick={() => {
                                const newOpts = [...q.options];
                                newOpts.splice(optIdx, 1);
                                let newCorrect = q.correctOptionIndex;
                                if (newCorrect === optIdx) newCorrect = 0;
                                else if (newCorrect > optIdx) newCorrect--;
                                updateQuestion(i, { ...q, options: newOpts, correctOptionIndex: newCorrect });
                              }} className="text-muted-foreground hover:text-red-500 p-1"><Trash2 size={14}/></button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end pt-2">
                        <button onClick={() => setEditingQuestionIndex(null)} className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90">Done Editing</button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 flex gap-4 hover:bg-muted/30 transition-colors">
                      <div className="font-bold text-muted-foreground w-6 shrink-0">{i + 1}.</div>
                      <div className="flex-1 space-y-2">
                        <div className="font-medium text-sm text-foreground">{q.text}</div>
                        <div className="text-xs text-muted-foreground">
                          {q.options.length} options • Answer: {q.options[q.correctOptionIndex]}
                        </div>
                      </div>
                      <div className="flex items-start gap-2 shrink-0">
                        <button onClick={() => setEditingQuestionIndex(i)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => deleteQuestion(i)} className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
