import type { LucideIcon } from 'lucide-react';
import {
  BriefcaseBusiness,
  Car,
  CircleDollarSign,
  Landmark,
  Play,
  ShoppingBag,
  Utensils,
  Wallet,
  Zap,
} from 'lucide-react';

const categoryToIcon: Record<string, LucideIcon> = {
  'Food & Dining': Utensils,
  Shopping: ShoppingBag,
  Transport: Car,
  Entertainment: Play,
  Bills: Zap,
  Salary: Landmark,
  Freelance: BriefcaseBusiness,
  Other: CircleDollarSign,
  Income: Wallet,
};

const categoryToneMap: Record<string, string> = {
  'Food & Dining': 'food',
  Shopping: 'shopping',
  Transport: 'transport',
  Entertainment: 'entertainment',
  Bills: 'bills',
  Salary: 'income',
  Freelance: 'income',
  Other: 'other',
  Income: 'income',
};

type TransactionCategoryIconProps = {
  category: string;
  type?: 'Income' | 'Expense';
  size?: number;
  className?: string;
};

export function TransactionCategoryIcon({ category, type, size = 16, className = '' }: TransactionCategoryIconProps) {
  const normalizedCategory = category || 'Other';
  const iconKey = category === 'Income' || category === 'Salary' || category === 'Freelance' ? 'Income' : normalizedCategory;
  const Icon = categoryToIcon[iconKey] ?? CircleDollarSign;
  const tone = categoryToneMap[normalizedCategory] ?? (type === 'Income' ? 'income' : 'other');

  return (
    <span className={`transaction-category-icon ${tone} ${className}`.trim()}>
      <Icon size={size} />
    </span>
  );
}
