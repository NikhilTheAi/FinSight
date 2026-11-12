import { AIInsights } from '../components/AIInsights';
import { BudgetCard } from '../components/BudgetCard';
import { Header } from '../components/Header';
import { MoneyFlowChart } from '../components/MoneyFlowChart';
import { QuickActions } from '../components/QuickActions';
import { RecentTransactions } from '../components/RecentTransactions';
import { SavingGoals } from '../components/SavingGoals';
import { Sidebar } from '../components/Sidebar';
import { SummaryCard } from '../components/SummaryCard';
import { summaryCards } from '../data/mockData';

export function Dashboard() {
  return (
    <div className="app-shell">
      <Sidebar activeItem="Dashboard" />

      <main className="main-panel">
        <Header />

        <section className="summary-grid" aria-label="Financial summary">
          {summaryCards.map((card) => (
            <SummaryCard key={card.label} {...card} />
          ))}
        </section>

        <section className="content-grid top-row">
          <MoneyFlowChart />
          <BudgetCard />
        </section>

        <section className="content-grid lower-row">
          <RecentTransactions />
          <SavingGoals />
        </section>

        <section className="bottom-row">
          <AIInsights />
          <QuickActions />
        </section>
      </main>
    </div>
  );
}
