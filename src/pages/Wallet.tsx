import React, { useState } from 'react';
import { 
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  TrendingUp
} from 'lucide-react';

export function Wallet() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock wallet data
  const walletData = {
    balance: 45000,
    totalEarnings: 125000,
    totalWithdrawals: 80000,
    pendingAmount: 12000
  };

  // Mock transactions
  const transactions = [
    {
      id: '1',
      type: 'credit',
      amount: 15000,
      description: 'Payment from Sarah Johnson - Plumbing Service',
      date: new Date('2024-01-23T10:30:00'),
      status: 'completed',
      reference: 'TXN-001234'
    },
    {
      id: '2',
      type: 'debit',
      amount: 25000,
      description: 'Withdrawal to Bank Account',
      date: new Date('2024-01-22T14:15:00'),
      status: 'completed',
      reference: 'WTH-005678'
    },
    {
      id: '3',
      type: 'credit',
      amount: 8000,
      description: 'Payment from David Okoro - Electrical Repair',
      date: new Date('2024-01-21T16:45:00'),
      status: 'completed',
      reference: 'TXN-001235'
    },
    {
      id: '4',
      type: 'debit',
      amount: 500,
      description: 'Platform Service Fee',
      date: new Date('2024-01-21T16:46:00'),
      status: 'completed',
      reference: 'FEE-001235'
    },
    {
      id: '5',
      type: 'credit',
      amount: 12000,
      description: 'Payment from Mary Adebayo - Carpentry Work',
      date: new Date('2024-01-20T09:30:00'),
      status: 'pending',
      reference: 'TXN-001236'
    }
  ];

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'pending') return <Clock className="h-4 w-4 text-yellow-600" />;
    if (status === 'failed') return <XCircle className="h-4 w-4 text-red-600" />;
    
    if (type === 'credit') {
      return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
    } else {
      return <ArrowUpRight className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
        <p className="text-gray-600 mt-2">
          Manage your earnings and withdrawals
        </p>
      </div>

      {/* Wallet Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-forest-600 to-forest-700 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-forest-100 text-sm">Available Balance</p>
              <p className="text-2xl font-bold">{formatCurrency(walletData.balance)}</p>
            </div>
            <CreditCard className="h-8 w-8 text-forest-200" />
          </div>
          <div className="flex space-x-2">
            <button className="flex-1 bg-white bg-opacity-20 text-white py-2 px-3 rounded text-sm font-medium hover:bg-opacity-30 transition-colors">
              Withdraw
            </button>
            <button className="flex-1 bg-white bg-opacity-20 text-white py-2 px-3 rounded text-sm font-medium hover:bg-opacity-30 transition-colors">
              Add Funds
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(walletData.totalEarnings)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-forest-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Withdrawals</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(walletData.totalWithdrawals)}</p>
            </div>
            <ArrowUpRight className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(walletData.pendingAmount)}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-forest-600 text-white p-4 rounded-lg hover:bg-forest-700 transition-colors">
          <Plus className="h-6 w-6 mb-2" />
          <h3 className="font-semibold">Withdraw Funds</h3>
          <p className="text-forest-100 text-sm">Transfer money to your bank</p>
        </button>

        <button className="bg-forest-500 text-white p-4 rounded-lg hover:bg-forest-600 transition-colors">
          <Download className="h-6 w-6 mb-2" />
          <h3 className="font-semibold">Download Statement</h3>
          <p className="text-forest-100 text-sm">Get transaction history</p>
        </button>

        <button className="bg-forest-400 text-white p-4 rounded-lg hover:bg-forest-500 transition-colors">
          <Eye className="h-6 w-6 mb-2" />
          <h3 className="font-semibold">Payment Methods</h3>
          <p className="text-forest-100 text-sm">Manage bank accounts</p>
        </button>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-forest-100 text-forest-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('credits')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'credits'
                    ? 'bg-forest-100 text-forest-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Credits
              </button>
              <button
                onClick={() => setActiveTab('debits')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'debits'
                    ? 'bg-forest-100 text-forest-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Debits
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y">
          {transactions
            .filter(transaction => {
              if (activeTab === 'credits') return transaction.type === 'credit';
              if (activeTab === 'debits') return transaction.type === 'debit';
              return true;
            })
            .map(transaction => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {getTransactionIcon(transaction.type, transaction.status)}
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900">
                        {transaction.description}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-sm text-gray-600">
                          {formatDate(transaction.date)}
                        </p>
                        <span className="text-gray-400">•</span>
                        <p className="text-sm text-gray-600">
                          {transaction.reference}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* No Transactions */}
        {transactions.length === 0 && (
          <div className="p-8 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Transactions Yet
            </h3>
            <p className="text-gray-500">
              Your transaction history will appear here once you start earning or making withdrawals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}