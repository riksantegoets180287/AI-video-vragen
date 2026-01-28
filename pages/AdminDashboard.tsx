
import React, { useState, useEffect } from 'react';
import { getForms, saveForms, getStats } from '../storage';
import { QuizForm, Question, RouteType, MCQQuestion, OpenQuestion } from '../types';
import VideoEmbed from '../components/VideoEmbed';

const AdminDashboard: React.FC = () => {
  const [forms, setForms] = useState<QuizForm[]>([]);
  const [editingForm, setEditingForm] = useState<QuizForm | null>(null);
  const [stats, setStats] = useState(getStats());
  const [activeTab, setActiveTab] = useState<'content' | 'stats'>('content');

  useEffect(() => {
    setForms(getForms());
    setStats(getStats());
  }, []);

  const handleSaveForm = () => {
    if (!editingForm) return;
    const newForms = [...forms];
    const index = newForms.findIndex(f => f.id === editingForm.id);
    if (index >= 0) newForms[index] = editingForm;
    else newForms.push(editingForm);
    setForms(newForms);
    saveForms(newForms);
    setEditingForm(null);
  };

  const createNewForm = () => {
    // Adding default videoId to satisfy the QuizForm interface requirement
    const newForm: QuizForm = {
      id: crypto.randomUUID(),
      videoId: 1,
      route: 'route1',
      title: 'Nieuwe Quiz',
      videoEmbed: '',
      isEnabled: true,
      questions: []
    };
    setEditingForm(newForm);
  };

  const deleteForm = (id: string) => {
    if (confirm("Weet je zeker dat je dit formulier wilt verwijderen?")) {
      const filtered = forms.filter(f => f.id !== id);
      setForms(filtered);
      saveForms(filtered);
    }
  };

  const duplicateForm = (form: QuizForm) => {
    const duplicated: QuizForm = { ...form, id: crypto.randomUUID(), title: `${form.title} (Kopie)` };
    const newForms = [...forms, duplicated];
    setForms(newForms);
    saveForms(newForms);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    if (!editingForm) return;
    const qs = [...editingForm.questions];
    qs[index] = { ...qs[index], ...updates } as any;
    setEditingForm({ ...editingForm, questions: qs });
  };

  const addMCQOption = (qIndex: number) => {
    if (!editingForm) return;
    const q = editingForm.questions[qIndex] as MCQQuestion;
    const newId = String.fromCharCode(65 + q.options.length); // A, B, C...
    const newOptions = [...q.options, { id: newId, text: `Optie ${newId}` }];
    updateQuestion(qIndex, { options: newOptions });
  };

  const removeMCQOption = (qIndex: number, optId: string) => {
    if (!editingForm) return;
    const q = editingForm.questions[qIndex] as MCQQuestion;
    const newOptions = q.options.filter(o => o.id !== optId);
    updateQuestion(qIndex, { options: newOptions });
  };

  const updateMCQOptionText = (qIndex: number, optId: string, text: string) => {
    if (!editingForm) return;
    const q = editingForm.questions[qIndex] as MCQQuestion;
    const newOptions = q.options.map(o => o.id === optId ? { ...o, text } : o);
    updateQuestion(qIndex, { options: newOptions });
  };

  return (
    <div className="min-h-screen bg-summaLightGray">
      <nav className="bg-summaIndigo text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="font-serif text-2xl">Admin Panel</h1>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-summa-inner ${activeTab === 'content' ? 'bg-white text-summaIndigo' : 'hover:bg-white/10'}`}>Beheer</button>
            <button onClick={() => setActiveTab('stats')} className={`px-4 py-2 rounded-summa-inner ${activeTab === 'stats' ? 'bg-white text-summaIndigo' : 'hover:bg-white/10'}`}>Statistieken</button>
            <button onClick={() => { sessionStorage.removeItem('admin_session'); window.location.hash = '/'; }} className="px-4 py-2 bg-summaRed text-white rounded-summa-inner hover:brightness-110">Log uit</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'stats' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-summa-card summa-shadow">
              <p className="text-sm text-gray-500 font-bold mb-1 uppercase">Bezoeken</p>
              <p className="text-4xl font-bold text-summaIndigo">{stats.visits}</p>
            </div>
            <div className="bg-white p-6 rounded-summa-card summa-shadow">
              <p className="text-sm text-gray-500 font-bold mb-1 uppercase">Gestart</p>
              <p className="text-4xl font-bold text-summaBlue">{stats.formsStarted}</p>
            </div>
            <div className="bg-white p-6 rounded-summa-card summa-shadow">
              <p className="text-sm text-gray-500 font-bold mb-1 uppercase">Voltooid</p>
              <p className="text-4xl font-bold text-summaGreen">{stats.formsFinished}</p>
            </div>
            <div className="bg-white p-6 rounded-summa-card summa-shadow">
              <p className="text-sm text-gray-500 font-bold mb-1 uppercase">Routes</p>
              <div className="text-xs space-y-1 mt-2">
                <p>VO-R1: {stats.routesChosen.route1} | VO-R2: {stats.routesChosen.route2}</p>
                <p>VO-R3: {stats.routesChosen.route3} | MBO: {stats.routesChosen.entree}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-summaIndigo">Quiz Formulieren</h2>
              <button onClick={createNewForm} className="bg-summaIndigo text-white px-6 py-3 rounded-summa-inner font-bold shadow-md hover:bg-summaBlue">+ Nieuwe Quiz</button>
            </div>
            <div className="bg-white rounded-summa-card summa-shadow overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4">Titel</th>
                    <th className="p-4">Route</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {forms.length === 0 ? (
                    <tr><td colSpan={4} className="p-10 text-center text-gray-400 italic">Geen formulieren gevonden. Maak er een aan!</td></tr>
                  ) : forms.map(f => (
                    <tr key={f.id} className="hover:bg-gray-50">
                      <td className="p-4 font-bold text-summaIndigo">{f.title}</td>
                      <td className="p-4">
                        {f.route === 'route1' ? 'VO-Route 1' : f.route === 'route2' ? 'VO-Route 2' : f.route === 'route3' ? 'VO-Route 3' : 'MBO-Opleiding'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${f.isEnabled ? 'bg-summaGreen/20 text-summaGreen' : 'bg-gray-200 text-gray-500'}`}>{f.isEnabled ? 'Actief' : 'Concept'}</span>
                      </td>
                      <td className="p-4 text-right space-x-4">
                        <button onClick={() => setEditingForm(f)} className="text-summaBlue hover:underline text-sm font-bold">Bewerk</button>
                        <button onClick={() => duplicateForm(f)} className="text-summaYellow hover:underline text-sm font-bold">Kopieer</button>
                        <button onClick={() => deleteForm(f.id)} className="text-summaRed hover:underline text-sm font-bold">Verwijder</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {editingForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-summa-card shadow-2xl p-6 sm:p-10 max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif text-summaIndigo">Quiz Bewerken</h2>
              <button onClick={() => setEditingForm(null)} className="text-gray-400 hover:text-summaDark p-2 text-2xl">&times;</button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
              <div className="space-y-6">
                <h3 className="font-bold border-b pb-2 text-summaIndigo uppercase text-sm tracking-wider">Algemene Instellingen</h3>
                <div>
                  <label className="block text-sm font-bold mb-1">Titel van de Quiz</label>
                  <input className="w-full p-3 border border-gray-200 rounded-summa-inner focus:ring-2 focus:ring-summaBlue outline-none" value={editingForm.title} onChange={e => setEditingForm({...editingForm, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Route</label>
                    <select className="w-full p-3 border border-gray-200 rounded-summa-inner" value={editingForm.route} onChange={e => setEditingForm({...editingForm, route: e.target.value as RouteType})}>
                      <option value="route1">VO-Route 1</option>
                      <option value="route2">VO-Route 2</option>
                      <option value="route3">VO-Route 3</option>
                      <option value="entree">MBO-Opleiding</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" className="w-5 h-5 accent-summaIndigo" checked={editingForm.isEnabled} onChange={e => setEditingForm({...editingForm, isEnabled: e.target.checked})} />
                      <span className="font-bold text-sm">Zichtbaar voor studenten</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Video Bron URL</label>
                  <input 
                    className="w-full p-3 border border-gray-200 rounded-summa-inner font-mono text-xs bg-gray-50 focus:bg-white transition-all" 
                    value={editingForm.videoEmbed} 
                    placeholder='Link naar de video (YouTube/Vimeo/etc.)' 
                    onChange={e => setEditingForm({...editingForm, videoEmbed: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Bronvermelding / Omschrijving</label>
                  <textarea 
                    className="w-full p-3 border border-gray-200 rounded-summa-inner text-sm h-20" 
                    value={editingForm.description || ''} 
                    placeholder='Bijv: Bron: Het Klokhuis' 
                    onChange={e => setEditingForm({...editingForm, description: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold border-b pb-2 text-summaIndigo uppercase text-sm tracking-wider">Preview Launcher</h3>
                <div className="bg-gray-100 p-4 rounded-summa-card border border-dashed border-gray-300 flex flex-col justify-center items-center">
                  <VideoEmbed content={editingForm.videoEmbed} />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-lg font-bold text-summaIndigo uppercase text-sm tracking-wider">Vragen Beheren ({editingForm.questions.length})</h3>
                <div className="flex gap-3">
                  <button onClick={() => {
                    const newQ: MCQQuestion = { id: crypto.randomUUID(), type: 'mcq', prompt: 'Nieuwe MCQ vraag', points: 5, options: [{id:'A', text: 'Optie A'}, {id:'B', text: 'Optie B'}], correctOptionId: 'A' };
                    setEditingForm({...editingForm, questions: [...editingForm.questions, newQ]});
                  }} className="text-xs bg-summaBlue text-white px-4 py-2 rounded-summa-inner hover:brightness-110 shadow-sm font-bold uppercase tracking-widest">+ MCQ Vraag</button>
                  <button onClick={() => {
                    const newQ: OpenQuestion = { id: crypto.randomUUID(), type: 'open', prompt: 'Nieuwe open vraag', points: 10, modelAnswer: '', grading: { method: 'similarity', thresholdGood: 0.7, thresholdOk: 0.5 } };
                    setEditingForm({...editingForm, questions: [...editingForm.questions, newQ]});
                  }} className="text-xs bg-summaIndigo text-white px-4 py-2 rounded-summa-inner hover:brightness-110 shadow-sm font-bold uppercase tracking-widest">+ Open Vraag</button>
                </div>
              </div>
              
              <div className="space-y-6">
                {editingForm.questions.map((q, idx) => (
                  <div key={q.id} className="p-6 border border-gray-200 rounded-summa-card bg-white relative group shadow-sm hover:border-summaBlue/50 transition-all">
                    <button onClick={() => { const qs = [...editingForm.questions]; qs.splice(idx, 1); setEditingForm({...editingForm, questions: qs}); }} className="absolute top-6 right-6 text-summaRed opacity-30 group-hover:opacity-100 hover:underline text-xs font-bold uppercase tracking-tighter transition-all">Verwijder Vraag</button>
                    
                    <div className="flex items-center gap-3 mb-6">
                       <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${q.type === 'mcq' ? 'bg-summaBlue/10 text-summaBlue' : 'bg-summaIndigo/10 text-summaIndigo'}`}>
                         {idx + 1}. {q.type === 'mcq' ? 'Meerkeuze' : 'Open Vraag'}
                       </span>
                       <div className="flex items-center gap-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase">Punten:</label>
                         <input type="number" className="w-12 text-center text-xs p-1 border rounded" value={q.points} onChange={e => updateQuestion(idx, { points: parseInt(e.target.value) || 0 })} />
                       </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Vraagtekst</label>
                        <input className="w-full p-3 border border-gray-100 rounded-summa-inner font-bold text-summaIndigo focus:ring-2 focus:ring-summaBlue outline-none" value={q.prompt} onChange={e => updateQuestion(idx, { prompt: e.target.value })} />
                      </div>

                      {q.type === 'mcq' ? (
                        <div className="bg-gray-50 p-4 rounded-summa-inner space-y-3">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Antwoordopties (vink de juiste aan)</label>
                          {q.options.map((opt) => (
                            <div key={opt.id} className="flex items-center gap-3">
                              <input 
                                type="radio" 
                                name={`correct-${q.id}`} 
                                checked={q.correctOptionId === opt.id} 
                                onChange={() => updateQuestion(idx, { correctOptionId: opt.id })}
                                className="w-5 h-5 accent-summaGreen" 
                              />
                              <input 
                                className="flex-1 p-2 border border-gray-200 rounded text-sm" 
                                value={opt.text} 
                                onChange={e => updateMCQOptionText(idx, opt.id, e.target.value)} 
                              />
                              <button onClick={() => removeMCQOption(idx, opt.id)} className="text-summaRed text-xs hover:bg-summaRed/10 p-2 rounded">✕</button>
                            </div>
                          ))}
                          <button onClick={() => addMCQOption(idx)} className="text-[10px] font-bold text-summaBlue uppercase hover:underline mt-2">+ Optie toevoegen</button>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-summa-inner">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Model Antwoord (ter controle & nakijken)</label>
                          <textarea 
                            className="w-full p-3 border border-gray-200 rounded text-sm h-32 focus:bg-white" 
                            value={q.modelAnswer} 
                            placeholder="Wat is het perfecte antwoord? Dit wordt gebruikt voor de automatische score-berekening."
                            onChange={e => updateQuestion(idx, { modelAnswer: e.target.value })} 
                          />
                          <p className="text-[10px] text-gray-400 mt-2 italic">Opmerking: De AI vergelijkt het antwoord van de student met deze tekst.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t flex justify-end gap-4">
              <button onClick={() => setEditingForm(null)} className="px-8 py-3 border border-gray-200 rounded-summa-inner font-bold text-gray-500 hover:bg-gray-50 transition-all">Annuleren</button>
              <button onClick={handleSaveForm} className="px-16 py-4 bg-summaIndigo text-white rounded-summa-inner font-bold shadow-xl hover:bg-summaGreen hover:text-summaIndigo transition-all uppercase tracking-widest text-sm">Wijzigingen Opslaan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
