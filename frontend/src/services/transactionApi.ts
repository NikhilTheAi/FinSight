import type { PaymentMethod, TransactionRecord, TransactionType } from '../data/mockData';

type BackendTransactionResponse = {
  id: number;
  description: string;
  amount: number | string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  transactionDate: string;
  paymentMethod: string;
  note?: string | null;
};

type TransactionPayload = {
  description: string;
  amount: number | string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  transactionDate: string;
  paymentMethod: PaymentMethod;
  note?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

const mapTransactionType = (type: BackendTransactionResponse['type']): TransactionType =>
  type === 'INCOME' ? 'Income' : 'Expense';

const mapTransaction = (transaction: BackendTransactionResponse): TransactionRecord => ({
  id: String(transaction.id),
  title: transaction.description,
  type: mapTransactionType(transaction.type),
  category: transaction.category,
  date: transaction.transactionDate,
  paymentMethod: transaction.paymentMethod as PaymentMethod,
  amount: Number(transaction.amount),
  note: transaction.note ?? '',
});

const readErrorMessage = async (response: Response) => {
  try {
    const payload = await response.json();
    if (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string') {
      return payload.message;
    }
  } catch {
    // Ignore non-JSON responses.
  }

  return response.statusText || 'Request failed.';
};

export async function getTransactions(): Promise<TransactionRecord[]> {
  const response = await fetch(`${API_BASE_URL}/transactions`);

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const payload = (await response.json()) as BackendTransactionResponse[];
  return Array.isArray(payload) ? payload.map(mapTransaction) : [];
}

export async function createTransaction(payload: TransactionPayload): Promise<TransactionRecord> {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const transaction = (await response.json()) as BackendTransactionResponse;
  return mapTransaction(transaction);
}

export async function updateTransaction(id: string | number, payload: TransactionPayload): Promise<TransactionRecord> {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const transaction = (await response.json()) as BackendTransactionResponse;
  return mapTransaction(transaction);
}

export async function deleteTransaction(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
}
