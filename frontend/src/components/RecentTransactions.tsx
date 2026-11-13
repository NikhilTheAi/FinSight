import { useNavigate } from 'react-router-dom';

import { TransactionCategoryIcon } from '../components/TransactionCategoryIcon';
import { recentTransactions } from '../data/mockData';

export function RecentTransactions() {
  const navigate = useNavigate();

  return (
    <div className="panel transactions-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Activity</p>
          <h2>Recent Transactions</h2>
        </div>
        <button type="button" className="text-button" onClick={() => navigate('/transactions')}>
          View All
        </button>
      </div>

      <div className="transaction-list">
        {recentTransactions.map((item) => {
          const isIncome = item.amount > 0;

          return (
            <div key={item.title} className="transaction-item">
              <div className="transaction-meta">
                <TransactionCategoryIcon category={item.category} type={isIncome ? 'Income' : 'Expense'} size={16} />
                <div>
                  <h3>{item.title}</h3>
                  <span>{item.category}</span>
                </div>
              </div>

              <strong className={isIncome ? 'amount-income' : 'amount-expense'}>
                {isIncome ? '+' : '-'}₹{Math.abs(item.amount).toLocaleString()}
              </strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}
