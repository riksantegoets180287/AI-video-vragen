
import React from 'react';
import { QuizResult } from '../types';
import { exportToPdf } from '../pdf/exportPdf';
import { useNavigate } from 'react-router-dom';

interface Props {
  result: QuizResult;
}

const Results: React.FC<Props> = ({ result }) => {
  const navigate = useNavigate();
  const scorePct = Math.round((result.totalScore / result.maxTotalPoints) * 100);

  return (
    <div className="min-h-screen bg-summaLightGray p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Score Card */}
        <div className="bg-summaIndigo text-white rounded-summa-card p-8 text-center shadow-xl">
          <h1 className="font-serif text-3xl mb-4">Quiz Voltooid!</h1>
          <div className="inline-block p-6 rounded-full bg-white bg-opacity-10 mb-4 border-4 border-white border-opacity-20">
            <span className="text-5xl font-bold">{result.totalScore}</span>
            <span className="text-2xl opacity-70"> / {result.maxTotalPoints}</span>
          </div>
          <p className="text-xl font-semibold">{scorePct}% Score</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => exportToPdf(result)}
              className="bg-summaYellow text-summaIndigo font-bold px-8 py-4 rounded-summa-inner hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download PDF
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-white text-summaIndigo font-bold px-8 py-4 rounded-summa-inner hover:bg-opacity-90 transition-all"
            >
              Klaar
            </button>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif text-summaIndigo">Overzicht per vraag</h2>
          {result.results.map((r, idx) => (
            <div key={r.questionId} className="bg-white rounded-summa-card p-6 summa-shadow border-l-8 border-summaIndigo overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">Vraag {idx + 1}</h3>
                <span className={`px-4 py-1 rounded-full text-xs font-bold ${
                  r.score === r.maxPoints ? 'bg-summaGreen text-summaIndigo' : 
                  r.score > 0 ? 'bg-summaYellow text-summaIndigo' : 'bg-summaRed text-white'
                }`}>
                  {r.score} / {r.maxPoints} PT
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Jouw antwoord</p>
                  <p className="text-summaDark">{r.answer || "(Geen antwoord)"}</p>
                </div>

                {r.similarityScore !== undefined && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Overeenkomst Score</p>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-summaBlue" style={{ width: `${Math.round(r.similarityScore * 100)}%` }}></div>
                          </div>
                          <span className="font-bold text-summaBlue">{Math.round(r.similarityScore * 100)}%</span>
                        </div>
                        <p className="text-xs mt-1 text-gray-600">
                          Status: {Math.round(r.similarityScore * 100) >= 75 ? 'Goed' : Math.round(r.similarityScore * 100) >= 55 ? 'Bijna' : 'Niet goed'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">AI Indicator</p>
                        <div className={`text-sm flex items-center gap-2 ${r.aiWarning ? 'text-summaRed' : 'text-summaGreen'}`}>
                          {r.aiWarning ? (
                            <>
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                              <span>Mogelijke AI gedetecteerd (waarschuwing)</span>
                            </>
                          ) : (
                            <>
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                              <span>Geen AI signalen</span>
                            </>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 italic">Dit is een schatting en niet 100% zeker.</p>
                      </div>
                    </div>

                    {r.matchedWords && r.matchedWords.length > 0 && (
                      <div className="pt-2">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Overeenkomstige trefwoorden:</p>
                        <div className="flex flex-wrap gap-2">
                          {r.matchedWords.map(w => (
                            <span key={w} className="px-2 py-1 bg-gray-100 rounded text-xs text-summaIndigo">{w}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
