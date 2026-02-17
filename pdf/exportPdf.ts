
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

  y += 12;

  // Video Number Box
  doc.setFillColor(32, 18, 110);
  doc.roundedRect(margin, y, 40, 18, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(`Video ${result.videoId}`, margin + 20, y + 12, { align: 'center' });

  // Participant Info
  y += 25;
  doc.setFontSize(12);
  doc.setTextColor(51, 51, 51);
  doc.setFont('helvetica', 'bold');
  doc.text('Deelnemer:', margin, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Naam: ${result.userName}`, margin + 5, y);
  doc.text(`Klas: ${result.userClass}`, margin + 5, y + 7);
  doc.text(`Route: ${result.route.toUpperCase()}`, margin + 5, y + 14);
  doc.text(`Datum: ${result.date}`, margin + 5, y + 21);

  y += 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(32, 18, 110);
  doc.text(`Quiz Titel: ${result.formTitle}`, margin, y);
  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(0, 100, 180);
  doc.setFont('helvetica', 'normal');
  doc.text(`Video Bron: ${result.videoEmbed.substring(0, 50)}${result.videoEmbed.length > 50 ? '...' : ''}`, margin, y);

  y += 15;
  doc.setFontSize(16);
  doc.setTextColor(32, 18, 110);
  doc.setFont('helvetica', 'bold');
  doc.text(`Totaalscore: ${result.totalScore} / ${result.maxTotalPoints}`, margin, y);
  
  y += 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, 190, y);
  y += 10;

  result.results.forEach((q, index) => {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 51, 51);
    doc.text(`Vraag ${index + 1}:`, margin, y);
    y += 10;

    doc.setFillColor(219, 234, 254);
    doc.setDrawColor(96, 165, 250);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, 170, 20, 2, 2, 'FD');

    const isCorrect = q.score === q.maxPoints;
    const checkmarkX = margin + 165;
    const checkmarkY = y + 3;

    doc.setFillColor(isCorrect ? 34 : 239, isCorrect ? 197 : 68, isCorrect ? 94 : 68);
    doc.circle(checkmarkX, checkmarkY, 4, 'F');

    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(1.5);
    if (isCorrect) {
      doc.line(checkmarkX - 1.5, checkmarkY, checkmarkX - 0.5, checkmarkY + 1.5);
      doc.line(checkmarkX - 0.5, checkmarkY + 1.5, checkmarkX + 2, checkmarkY - 2);
    } else {
      doc.line(checkmarkX - 2, checkmarkY - 2, checkmarkX + 2, checkmarkY + 2);
      doc.line(checkmarkX - 2, checkmarkY + 2, checkmarkX + 2, checkmarkY - 2);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(29, 78, 216);
    doc.text('JOUW ANTWOORD', margin + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    const userAnswerLines = doc.splitTextToSize(q.answer || '(Geen antwoord)', 155);
    doc.text(userAnswerLines, margin + 3, y + 10);
    y += Math.max(20, userAnswerLines.length * 5 + 10);

    doc.setFillColor(220, 252, 231);
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, 170, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(21, 128, 61);
    doc.text('GOEDE ANTWOORD', margin + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    const correctAnswerLines = doc.splitTextToSize(q.correctAnswer, 164);
    doc.text(correctAnswerLines, margin + 3, y + 10);
    y += Math.max(20, correctAnswerLines.length * 5 + 10);

    if (q.similarityScore !== undefined) {
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Overeenkomst: ${Math.round(q.similarityScore * 100)}% | AI-check: ${q.aiWarning ? 'WAARSCHUWING' : 'Geen waarschuwing'}`, margin, y);
      y += 8;
    } else {
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Score: ${q.isCorrect ? 'Correct' : 'Incorrect'}`, margin, y);
      y += 8;
    }
    y += 6;
  });

  const filename = `VideoQuiz_Video${result.videoId}_${result.userClass}_${result.userName.replace(/\s+/g, '_')}_${result.route}_${result.date.replace(/[:\/]/g, '-')}.pdf`;
  doc.save(filename);
};
