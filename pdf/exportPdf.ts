
import { jsPDF } from 'jspdf';
import { QuizResult } from '../types';

export const exportToPdf = (result: QuizResult) => {
  const doc = new jsPDF();
  const margin = 20;
  let y = 20;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(32, 18, 110);
  doc.text('Video Quiz – Resultaat', margin, y);
  
  y += 15;
  doc.setFontSize(12);
  doc.setTextColor(51, 51, 51);
  doc.setFont('helvetica', 'normal');
  doc.text(`Naam: ${result.userName}`, margin, y);
  doc.text(`Klas: ${result.userClass}`, margin, y + 7);
  doc.text(`Route: ${result.route.toUpperCase()}`, margin, y + 14);
  doc.text(`Datum: ${result.date}`, margin, y + 21);
  
  y += 35;
  doc.setFont('helvetica', 'bold');
  doc.text(`Titel: ${result.formTitle}`, margin, y);
  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(0, 100, 180);
  doc.text(`Video Bron: ${result.videoEmbed.substring(0, 50)}${result.videoEmbed.length > 50 ? '...' : ''}`, margin, y);
  
  y += 15;
  doc.setFontSize(14);
  doc.setTextColor(32, 18, 110);
  doc.text(`Totaalscore: ${result.totalScore} / ${result.maxTotalPoints}`, margin, y);
  
  y += 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, 190, y);
  y += 10;

  result.results.forEach((q, index) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 51, 51);
    doc.text(`Vraag ${index + 1}:`, margin, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    const answerLines = doc.splitTextToSize(`Antwoord: ${q.answer}`, 160);
    doc.text(answerLines, margin, y);
    y += (answerLines.length * 6) + 2;
    if (q.similarityScore !== undefined) {
      doc.text(`Overeenkomst: ${Math.round(q.similarityScore * 100)}%`, margin, y);
      y += 6;
      doc.text(`AI-check: ${q.aiWarning ? 'WAARSCHUWING' : 'Geen waarschuwing'}`, margin, y);
      y += 10;
    } else {
      doc.text(`Score: ${q.isCorrect ? 'Correct' : 'Incorrect'}`, margin, y);
      y += 10;
    }
    y += 5;
  });

  const filename = `VideoQuiz_${result.userClass}_${result.userName.replace(/\s+/g, '_')}_${result.route}_${result.date.replace(/[:\/]/g, '-')}.pdf`;
  doc.save(filename);
};
