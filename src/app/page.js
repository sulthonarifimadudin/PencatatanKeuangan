'use client';

import { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Trash2 } from 'lucide-react';

export default function HomePage() {
  // State untuk data transaksi
  const [transactions, setTransactions] = useState([
    { id: 1, description: "Gaji Awal", amount: 7500000, type: "income", date: "1 Juni 2024" },
    { id: 2, description: "Sewa Apartemen", amount: 2500000, type: "expense", date: "2 Juni 2024" },
    { id: 3, description: "Makan Malam", amount: 150000, type: "expense", date: "3 Juni 2024" },
  ]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');

  // State untuk ringkasan keuangan
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  // Fungsi untuk menambah transaksi
  const addTransaction = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      type,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription('');
    setAmount('');
  };

  // Fungsi untuk menghapus transaksi
  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Efek untuk mengkalkulasi ulang ringkasan saat transaksi berubah
  useEffect(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    setTotalIncome(income);
    setTotalExpense(expense);
    setBalance(income - expense);
  }, [transactions]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-100 text-gray-800 font-sans">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">

        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 pb-2">
            FinanceFlow
          </h1>
          <p className="text-gray-600 mt-3 text-lg">Lacak setiap rupiah dengan mudah dan indah.</p>
        </header>

        {/* Bagian Ringkasan Keuangan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <SummaryCard title="Pemasukan" amount={totalIncome} icon={<TrendingUp />} color="green" />
          <SummaryCard title="Pengeluaran" amount={totalExpense} icon={<TrendingDown />} color="red" />
          <SummaryCard title="Saldo Saat Ini" amount={balance} icon={<DollarSign />} color="blue" />
        </div>

        {/* Bagian Form Tambah Transaksi */}
        <div className="bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-lg mb-12 border border-gray-200/50">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">Catat Transaksi Baru</h2>
          <form onSubmit={addTransaction} className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <InputField label="Deskripsi Transaksi" id="description" value={description} onChange={setDescription} placeholder="Contoh: Gaji bulanan" />
                </div>
                <div className="w-full md:w-1/2">
                  <InputField label="Jumlah (Rp)" id="amount" value={amount} onChange={setAmount} placeholder="Contoh: 5000000" type="number" />
                </div>
            </div>
            
            <TypeSelector selectedType={type} onSelectType={setType} />
            
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transform hover:-translate-y-1 transition-all duration-300">
              <Plus size={22} /> Tambah Transaksi
            </button>
          </form>
        </div>

        {/* Bagian Daftar Transaksi */}
        <div className="bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-lg border border-gray-200/50">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Riwayat Transaksi</h2>
          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <TransactionItem key={t.id} transaction={t} onDelete={deleteTransaction} />
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">
                <p className="font-semibold text-lg">Data masih kosong</p>
                <p>Silakan mulai dengan mencatat transaksi pertamamu.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Komponen Input Field Modern
const InputField = ({ label, id, value, onChange, type = 'text', placeholder }) => (
  <div className="relative">
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-300 text-lg peer"
    />
    <label htmlFor={id} className="absolute left-4 -top-5 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-5 peer-focus:text-blue-600 peer-focus:text-sm">
      {label}
    </label>
  </div>
);

// Komponen Pilihan Tipe Transaksi
const TypeSelector = ({ selectedType, onSelectType }) => (
  <div className="w-full flex rounded-xl bg-gray-200/70 p-1.5 gap-1.5">
    <button type="button" onClick={() => onSelectType('income')} className={`w-1/2 py-3 rounded-lg text-md font-bold transition-all duration-300 ${selectedType === 'income' ? 'bg-white text-green-600 shadow-md' : 'bg-transparent text-gray-500 hover:bg-white/50'}`}>Pemasukan</button>
    <button type="button" onClick={() => onSelectType('expense')} className={`w-1/2 py-3 rounded-lg text-md font-bold transition-all duration-300 ${selectedType === 'expense' ? 'bg-white text-red-600 shadow-md' : 'bg-transparent text-gray-500 hover:bg-white/50'}`}>Pengeluaran</button>
  </div>
);

// Komponen untuk Kartu Ringkasan
function SummaryCard({ title, amount, icon, color }) {
  const colors = {
    green: 'from-green-400/80 to-teal-400/80 text-white',
    red: 'from-red-400/80 to-orange-400/80 text-white',
    blue: 'from-blue-500/80 to-indigo-500/80 text-white',
  };

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${colors[color]} p-6 rounded-3xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
        <div className="relative z-10">
            <div className="flex justify-between items-start">
                <h2 className="text-lg font-bold text-white/90">{title}</h2>
                <div className="p-2 bg-white/30 rounded-full">
                    {icon}
                </div>
            </div>
            <p className={`text-4xl font-extrabold mt-4`}>
              Rp{amount.toLocaleString('id-ID')}
            </p>
        </div>
    </div>
  );
}

// Komponen untuk Item Transaksi
function TransactionItem({ transaction, onDelete }) {
  const isIncome = transaction.type === 'income';

  return (
    <div className="flex items-center justify-between bg-white/80 p-4 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {isIncome ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
        </div>
        <div>
            <p className="font-bold text-gray-800 text-md">{transaction.description}</p>
            <p className="text-sm text-gray-500">{transaction.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`font-bold text-md ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
          {isIncome ? '+' : '-'} Rp{transaction.amount.toLocaleString('id-ID')}
        </span>
        <button onClick={() => onDelete(transaction.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-100">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
