
import React, { useState } from 'react';
import { Order, PostDeliveryIssue } from '../types';
import { Truck, CheckCircle, AlertTriangle, Send, ShieldAlert, MessageSquare } from 'lucide-react';

interface Props {
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
}

const DeliveryView: React.FC<Props> = ({ orders, onUpdateOrder }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [issueData, setIssueData] = useState<PostDeliveryIssue>({
    status: 'Successful',
    reason: '',
    solution: '',
    salesComments: ''
  });

  const relevantOrders = orders.filter(o => 
    o.status === 'Packing' || o.status === 'Quality Check' || o.status === 'Delivered'
  );

  const handleLogIssue = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedOrder) return;
    
    // Explicit validation check - only Solution is mandatory now
    if (issueData.status === 'Alteration Required') {
      if (!issueData.solution?.trim()) {
        alert("ACTION REQUIRED: Please fill in the 'Solution' field before logging.");
        return;
      }
    }
    
    const updatedOrder: Order = {
      ...selectedOrder,
      status: 'Delivered',
      postDelivery: {
        ...issueData,
        loggedAt: new Date().toISOString()
      }
    };
    
    onUpdateOrder(updatedOrder);
    setSelectedOrder(updatedOrder);
    alert(`Outcome successfully recorded for ${selectedOrder.orderNumber}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-8rem)]">
      <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-3 bg-slate-50/50 border-b border-slate-100">
          <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Quality Queue</h4>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50 custom-scrollbar">
          {relevantOrders.length > 0 ? (
            relevantOrders.map(order => (
              <div key={order.id} onClick={() => { setSelectedOrder(order); setIssueData(order.postDelivery || { status: 'Successful', reason: '', solution: '', salesComments: '' }); }}
                className={`p-4 cursor-pointer transition-all ${selectedOrder?.id === order.id ? 'bg-[#EAB308]/5 border-r-4 border-r-[#EAB308]' : 'hover:bg-slate-50'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] font-black text-slate-400">{order.orderNumber}</span>
                  <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{order.status}</span>
                </div>
                <h4 className="font-bold text-[11px] text-slate-800 truncate">{order.clientName}</h4>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-300 h-full flex flex-col items-center justify-center">
              <Truck size={32} className="mb-2 opacity-10" />
              <p className="text-[9px] font-black uppercase">Queue Empty</p>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-9 overflow-y-auto custom-scrollbar pr-1">
        {selectedOrder ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-50 pb-4">
              <ShieldAlert size={18} className="text-[#EAB308]" />
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Outcome Terminal: {selectedOrder.orderNumber}</h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setIssueData(prev => ({ ...prev, status: 'Successful' }))}
                className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 ${issueData.status === 'Successful' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-50 opacity-40'}`}>
                <CheckCircle size={20} /><span className="text-xs font-black uppercase">Success</span>
              </button>
              <button onClick={() => setIssueData(prev => ({ ...prev, status: 'Alteration Required' }))}
                className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 ${issueData.status === 'Alteration Required' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-50 opacity-40'}`}>
                <AlertTriangle size={20} /><span className="text-xs font-black uppercase">Alteration</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase flex items-center"><MessageSquare size={12} className="mr-2"/> Clients Comments</label>
                <textarea value={issueData.salesComments} onChange={(e) => setIssueData(prev => ({ ...prev, salesComments: e.target.value }))}
                  placeholder="Notes from the client..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs h-20 resize-none outline-none focus:ring-1 focus:ring-[#EAB308]" />
              </div>

              {issueData.status === 'Alteration Required' && (
                <div className="space-y-4 animate-in slide-in-from-top-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-green-600 uppercase">Solution (Mandatory)</label>
                    <textarea value={issueData.solution} onChange={(e) => setIssueData(prev => ({ ...prev, solution: e.target.value }))}
                      placeholder="Fix plan..."
                      className="w-full p-3 bg-green-50/30 border border-green-100 rounded-xl text-xs h-20 resize-none outline-none focus:ring-1 focus:ring-green-400" />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="button"
                onClick={handleLogIssue} 
                className="bg-slate-900 text-[#EAB308] px-8 py-3 rounded-xl font-black flex items-center gap-2 shadow-lg hover:bg-black transition-all active:scale-95 z-20"
              >
                <Send size={16} /><span className="text-xs uppercase">Send Message</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white h-full rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 p-12">
            <Truck size={32} className="opacity-10 mb-2" />
            <p className="text-[9px] font-black uppercase">Terminal Standby</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryView;
