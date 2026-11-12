import { Sparkles } from 'lucide-react';

import { aiInsights } from '../data/mockData';

export function AIInsights() {
  return (
    <div className="panel insights-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Smart Advice</p>
          <h2>AI Insights</h2>
        </div>
        <Sparkles size={18} className="insight-icon" />
      </div>

      <ul className="insight-list">
        {aiInsights.map((insight) => (
          <li key={insight}>{insight}</li>
        ))}
      </ul>
    </div>
  );
}
