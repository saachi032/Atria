import React, { useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import toast, { Toaster } from 'react-hot-toast';
import Papa from 'papaparse';


// --- MOCK DATA ---
const initialInventoryData = [
  { id: 1, type: "A+", units: 60, collectionDate: "2025-10-01", expiryDate: "2025-11-10", location: "Fridge A-1", donorId: "D-123", notes: "Reserved for surgery ward." },
  { id: 2, type: "A-", units: 18, collectionDate: "2025-09-20", expiryDate: "2025-10-29", location: "Fridge A-2", donorId: "D-124", notes: "High antibody count." },
  { id: 3, type: "B+", units: 55, collectionDate: "2025-10-05", expiryDate: "2025-11-15", location: "Fridge B-1", donorId: "D-125", notes: "" },
  { id: 4, type: "O+", units: 110, collectionDate: "2025-09-15", expiryDate: "2025-10-25", location: "Main Storage", donorId: "D-126", notes: "" },
  { id: 5, type: "AB-", units: 10, collectionDate: "2025-10-02", expiryDate: "2025-10-12", location: "Emergency Shelf", donorId: "D-127", notes: "Urgent need expected." }, // Expiring soon & Low Stock
  { id: 6, type: "O-", units: 42, collectionDate: "2025-08-01", expiryDate: "2025-09-28", location: "Fridge C-1", donorId: "D-128", notes: "Archived." }, // Expired
];

// --- ICONS ---
const PlusIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const DownloadIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>);
const EditIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
const TrashIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>);

// --- HELPER FUNCTIONS ---
const LOW_STOCK_THRESHOLD = 20;
const EXPIRY_SOON_THRESHOLD_DAYS = 7;

const getRowStyle = (item) => {
    const today = new Date("2025-10-08"); // Fixed date for demo consistency
    const expiry = new Date(item.expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { style: 'bg-red-100 opacity-75', tooltip: 'Expired' };
    if (diffDays <= EXPIRY_SOON_THRESHOLD_DAYS) return { style: 'bg-yellow-100', tooltip: `Expires in ${diffDays} day(s)` };
    if (item.units < LOW_STOCK_THRESHOLD) return { style: 'bg-red-50', tooltip: 'Low stock' };
    return { style: '', tooltip: `Expires in ${diffDays} day(s)` };
};


export default function Inventory() {
  const [inventory, setInventory] = useState(initialInventoryData);
  const [filterType, setFilterType] = useState('');
  const [sort, setSort] = useState({ key: 'type', order: 'asc' });
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- DERIVED STATES ---
  const filteredAndSortedInventory = useMemo(() => {
    let result = [...inventory];
    
    // Filtering
    if (filterType) result = result.filter(item => item.type === filterType);

    // Sorting
    result.sort((a, b) => {
        let valA = a[sort.key] || '';
        let valB = b[sort.key] || '';
        if (sort.key === 'expiryDate') {
            valA = new Date(valA);
            valB = new Date(valB);
        }
        if (valA < valB) return sort.order === 'asc' ? -1 : 1;
        if (valA > valB) return sort.order === 'asc' ? 1 : -1;
        return 0;
    });

    return result;
  }, [inventory, filterType, sort]);
  
  // Pagination logic
  const paginatedInventory = filteredAndSortedInventory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredAndSortedInventory.length / itemsPerPage);

  // Summary Card Data
  const totalUnits = inventory.reduce((sum, item) => sum + item.units, 0);
  const lowStockCount = inventory.filter(item => item.units < LOW_STOCK_THRESHOLD && new Date(item.expiryDate) > new Date("2025-10-08")).length;
  const expiringSoonCount = inventory.filter(item => {
      const diffDays = Math.ceil((new Date(item.expiryDate) - new Date("2025-10-08")) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= EXPIRY_SOON_THRESHOLD_DAYS;
  }).length;


  // --- HANDLERS ---
  const handleSort = (key) => {
    setSort(prev => ({ key, order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc' }));
  };
  
  const handleDownload = () => {
    const csv = Papa.unparse(filteredAndSortedInventory);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `inventory_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Report downloaded successfully!");
  };

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setEditModalOpen(true);
  };
  
  const handleDeleteClick = (item) => {
    setCurrentItem(item);
    setDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    setInventory(prev => prev.filter(item => item.id !== currentItem.id));
    setDeleteModalOpen(false);
    toast.success(`Stock ID ${currentItem.id} removed.`);
  };


  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Toaster position="top-right" />
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Blood Stock Inventory</h2>
            <p className="text-gray-500 mt-1">Manage, track, and update blood unit availability.</p>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
               <DownloadIcon className="w-4 h-4" /> Download Report
             </button>
             <button onClick={() => setAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700">
               <PlusIcon className="w-4 h-4" /> Add New Stock
             </button>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-white rounded-lg shadow-sm border"><p className="text-sm text-gray-500">Total Units Available</p><p className="text-2xl font-bold text-gray-800">{totalUnits}</p></div>
            <div className="p-4 bg-white rounded-lg shadow-sm border"><p className="text-sm text-gray-500">Low Stock Types</p><p className="text-2xl font-bold text-red-600">{lowStockCount}</p></div>
            <div className="p-4 bg-white rounded-lg shadow-sm border"><p className="text-sm text-gray-500">Soon Expiring Units</p><p className="text-2xl font-bold text-yellow-600">{expiringSoonCount}</p></div>
        </div>

        {/* Filters */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border flex items-center gap-4">
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="text-sm border-gray-300 rounded-md">
                <option value="">All Blood Types</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b bg-gray-50 sticky top-0">
                <tr>
                  <th onClick={() => handleSort('type')} className="p-4 text-sm font-semibold text-gray-600 cursor-pointer">Blood Type</th>
                  <th onClick={() => handleSort('units')} className="p-4 text-sm font-semibold text-gray-600 cursor-pointer text-right">Units</th>
                  <th onClick={() => handleSort('expiryDate')} className="p-4 text-sm font-semibold text-gray-600 cursor-pointer">Expiry Date</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Location</th>
                  <th onClick={() => handleSort('notes')} className="p-4 text-sm font-semibold text-gray-600 cursor-pointer">Notes</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInventory.map((item) => {
                  const { style, tooltip } = getRowStyle(item);
                  return (
                    <tr key={item.id} className={`border-b hover:bg-gray-100 ${style}`} title={tooltip}>
                      <td className="p-4 text-lg font-bold text-red-600">{item.type}</td>
                      <td className="p-4 text-sm text-gray-800 font-mono text-right">{item.units}</td>
                      <td className="p-4 text-sm text-gray-500">{item.expiryDate}</td>
                      <td className="p-4 text-sm text-gray-500">{item.location}</td>
                      <td className="p-4 text-sm text-gray-500 truncate" style={{ maxWidth: '150px' }}>{item.notes}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleEditClick(item)} className="p-1 text-blue-600 hover:text-blue-800 mr-2"><EditIcon /></button>
                        <button onClick={() => handleDeleteClick(item)} className="p-1 text-red-600 hover:text-red-800"><TrashIcon /></button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="p-4 flex justify-between items-center text-sm">
              <p>Showing {paginatedInventory.length} of {filteredAndSortedInventory.length} entries</p>
              <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
                  {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-red-500 text-white' : ''}`}>{i + 1}</button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
              </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-bold">Confirm Deletion</h3>
            <p className="my-4">Are you sure you want to remove stock ID {currentItem?.id} ({currentItem?.type})?</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}