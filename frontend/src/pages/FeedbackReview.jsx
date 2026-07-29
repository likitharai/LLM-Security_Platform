import React from 'react';
import { ThumbsDown, ThumbsUp, MessageSquare } from 'lucide-react';

export default function FeedbackReview() {
  const mockFeedback = [
    { id: 1, logId: '#1042', user: 'dev_team', type: 'False Positive', comment: 'This was a legitimate SQL query for internal testing.', status: 'Pending' },
    { id: 2, logId: '#1089', user: 'qa_team', type: 'False Negative', comment: 'Model missed a clear prompt injection attempt.', status: 'Pending' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Feedback & Tuning Review</h1>
      <p className="text-slate-500">Review flagged analyses to adjust threshold weights or whitelist specific patterns.</p>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Log ID</th>
              <th className="px-6 py-4">Reported By</th>
              <th className="px-6 py-4">Feedback Type</th>
              <th className="px-6 py-4">Context</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockFeedback.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono font-medium text-indigo-600">{item.logId}</td>
                <td className="px-6 py-4 text-slate-700">{item.user}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.type === 'False Positive' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                  <MessageSquare size={14} className="text-slate-400" />
                  {item.comment}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve & Whitelist">
                    <ThumbsUp size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject Feedback">
                    <ThumbsDown size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}