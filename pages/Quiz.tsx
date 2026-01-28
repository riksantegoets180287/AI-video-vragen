
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserSession, QuizForm, QuizResult, QuestionResult, Question, MCQQuestion } from '../types';
import { getForms, getStats, saveStats } from '../storage';
import VideoEmbed from '../components/VideoEmbed';
import { calculateSimilarity } from '../grading/similarity';
import { checkAIUsage } from '../grading/aiHeuristics';

interface Props {
  session: UserSession;
  onFinish: (result: QuizResult) => void;
}

const Quiz: React.FC<Props> = ({ session, onFinish }) => {
  const [form, setForm] = useState<QuizForm | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pasteTracking, setPasteTracking] = useState<Record<string, boolean>>({});
  const [speedTracking, setSpeedTracking] = useState<Record<string, boolean>>({});
  const [typingTimestamps, setTypingTimestamps] = useState<Record<string, number[]>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const allForms = getForms();
    const selectedForm = allForms.find(f => 
      f.videoId === session.selectedVideo && 
      f.route === session.selectedRoute && 
      f.isEnabled
    );
    
    if (!selectedForm || selectedForm.questions.length === 0) {
      alert("Geen actieve quiz gevonden of vragen ontbreken.");
      navigate('/video-select');
      return;
    }

    setForm(selectedForm);
    
    const stats = getStats();
    stats.formsStarted++;
    saveStats(stats);
  }, [session, navigate]);

  // Shuffling MCQ options logic
  const shuffledQuestions = useMemo(() => {
    if (!form) return [];
    return form.questions.map(q => {
      if (q.type === 'mcq') {
        const options = [...q.options].sort(() => Math.random() - 0.5);
        return { ...q, options };
      }
      return q;
    });
  }, [form]);

  const currentQuestion = shuffledQuestions[currentIndex];

  const handleAnswerChange = (qId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
    const now = Date.now();
    setTypingTimestamps(prev => {
      const times = prev[qId] || [];
      const newTimes = [...times, now].slice(-20);
      if (newTimes.length >= 10) {
        const diff = newTimes[newTimes.length - 1] - newTimes[0];
        if (diff < 100) setSpeedTracking(p => ({ ...p, [qId]: true }));
      }
      return { ...prev, [qId]: newTimes };
    });
  };

  const handleSubmit = () => {
    if (!form) return;
    const unansweredCount = form.questions.filter(q => !answers[q.id]).length;
    if (unansweredCount > 0) {
      if (!confirm(`Je hebt nog ${unansweredCount} vragen niet beantwoord. Toch inleveren?`)) return;
    }

    const results: QuestionResult[] = form.questions.map(q => {
      const answer = answers[q.id] || "";
      if (q.type === 'mcq') {
        const isCorrect = answer === q.correctOptionId;
        return {
          questionId: q.id,
          answer: q.options.find(o => o.id === answer)?.text || "Geen antwoord",
          score: isCorrect ? q.points : 0,
          maxPoints: q.points,
          isCorrect
        };
      } else {
        const sim = calculateSimilarity(answer, q.modelAnswer);
        const aiCheck = checkAIUsage(answer, q.prompt, q.modelAnswer, sim.score, !!pasteTracking[q.id], !!speedTracking[q.id]);
        let awardedPoints = 0;
        if (sim.score >= q.grading.thresholdGood) awardedPoints = q.points;
        else if (sim.score >= q.grading.thresholdOk) awardedPoints = q.points * 0.5;
        return {
          questionId: q.id,
          answer,
          score: Math.round(awardedPoints),
          maxPoints: q.points,
          similarityScore: sim.score,
          matchedWords: sim.matchedWords,
          aiWarning: aiCheck.warning
        };
      }
    });

    onFinish({
      id: crypto.randomUUID(),
      sessionId: crypto.randomUUID(),
      userName: session.name,
      userClass: session.class,
      route: session.selectedRoute!,
      videoId: session.selectedVideo!,
      formTitle: form.title,
      videoEmbed: form.videoEmbed,
      date: new Date().toLocaleString('nl-NL'),
      results,
      totalScore: results.reduce((sum, r) => sum + r.score, 0),
      maxTotalPoints: form.questions.reduce((sum, q) => sum + q.points, 0)
    });
    navigate('/results');
  };

  if (!form || !currentQuestion) return null;

  const routeLabel = session.selectedRoute === 'route1' ? 'VO-Route 1' : session.selectedRoute === 'route2' ? 'VO-Route 2' : session.selectedRoute === 'route3' ? 'VO-Route 3' : 'MBO-Opleiding';

  return (
    <div className="h-screen flex flex-col bg-summaLightGray overflow-hidden">
      <header className="bg-summaIndigo text-white p-4 flex justify-between items-center shrink-0 shadow-md">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-lg">{form.title}</h2>
          <span className="text-[10px] bg-white/20 px-2 py-1 rounded uppercase tracking-widest">{routeLabel}</span>
        </div>
        <div className="text-[10px] uppercase font-bold tracking-widest">
           Vraag {currentIndex + 1} van {form.questions.length}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Fixed Video Launcher */}
        <div className="w-5/12 p-10 flex flex-col items-center justify-center bg-gray-50 border-r border-gray-200 overflow-hidden shrink-0">
          <div className="w-full max-w-lg">
            <VideoEmbed content={form.videoEmbed} />
            {form.description && (
              <div className="mt-6 bg-white p-4 rounded-summa-card border border-gray-100 shadow-sm text-center">
                <p className="text-xs text-gray-500 italic uppercase tracking-wider mb-1">Bronvermelding</p>
                <p className="text-sm font-medium text-summaIndigo">{form.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Paginated Question */}
        <div className="w-7/12 bg-white flex flex-col overflow-hidden relative">
          <div className="flex-1 flex flex-col items-center justify-center p-12 lg:p-20">
            <div className="w-full max-w-2xl space-y-10">
              <div className="flex items-start gap-6">
                 <span className="bg-summaIndigo text-white w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
                   {currentIndex + 1}
                 </span>
                 <h3 className="font-bold text-2xl text-summaIndigo leading-tight">
                   {currentQuestion.prompt}
                 </h3>
              </div>

              {currentQuestion.type === 'mcq' ? (
                <div className="grid grid-cols-1 gap-4 pl-18">
                  {currentQuestion.options.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswerChange(currentQuestion.id, opt.id)}
                      className={`flex items-center gap-4 p-6 border-2 rounded-summa-inner text-left transition-all ${
                        answers[currentQuestion.id] === opt.id 
                        ? 'border-summaIndigo bg-summaIndigo/5 shadow-md' 
                        : 'border-gray-100 hover:border-summaBlue/30 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentQuestion.id] === opt.id ? 'border-summaIndigo bg-summaIndigo' : 'border-gray-300'}`}>
                        {answers[currentQuestion.id] === opt.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <span className="font-semibold text-lg">{opt.text}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="pl-18 space-y-4">
                  <textarea
                    className="w-full p-8 border-2 border-gray-100 rounded-summa-card h-64 focus:outline-none focus:border-summaIndigo focus:ring-4 focus:ring-summaIndigo/5 transition-all text-lg leading-relaxed bg-gray-50/30"
                    placeholder="Typ hier je volledige antwoord op basis van de beelden..."
                    value={answers[currentQuestion.id] || ""}
                    onPaste={(e) => { e.preventDefault(); setPasteTracking(p => ({...p, [currentQuestion.id]: true})); alert("Plakken is niet toegestaan."); }}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="h-24 bg-gray-50 border-t border-gray-100 flex items-center justify-between px-10 shrink-0">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="px-8 py-3 font-bold text-summaIndigo disabled:opacity-30 flex items-center gap-2 hover:bg-gray-100 rounded-summa-inner transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Vorige
            </button>

            <div className="flex gap-2">
              {form.questions.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-summaIndigo w-6' : 'bg-gray-200'}`}></div>
              ))}
            </div>

            {currentIndex < form.questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="px-8 py-3 bg-summaIndigo text-white font-bold rounded-summa-inner hover:bg-summaBlue shadow-lg flex items-center gap-2 transition-all active:scale-95"
              >
                Volgende
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-10 py-3 bg-summaGreen text-summaIndigo font-bold rounded-summa-inner hover:brightness-110 shadow-lg flex items-center gap-2 transition-all active:scale-95 uppercase tracking-widest text-sm"
              >
                Inleveren
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
