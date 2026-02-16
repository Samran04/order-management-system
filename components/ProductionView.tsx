
import React, { useState, useEffect } from 'react';
import { Order, ProductionStatus } from '../types';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Factory, 
  AlertCircle, 
  Plus, 
  FileText, 
  Image as ImageIcon,
  Calendar,
  ChevronRight
} from 'lucide-react';

interface Props {
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
  preSelectedOrderId?: string | null;
}

const STAGES: ProductionStatus[] = [
  'Order Received',
  'Inspection',
  'Cutting',
  'Stitching',
  'Embroidery/Printing',
  'Quality Check',
  'Packing',
  'Delivered'
];

const ProductionView: React.FC<Props> = ({ orders, onUpdateOrder, preSelectedOrderId }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (preSelectedOrderId) {
      const order = orders.find(o => o.id === preSelectedOrderId);
      if (order) setSelectedOrder(order);
    }
  }, [preSelectedOrderId, orders]);

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusUpdate = (status: ProductionStatus) => {
    if (!selectedOrder) return;
    const updated = { ...selectedOrder, status };
    onUpdateOrder(updated);
    setSelectedOrder(updated);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 h-[calc(100vh-8rem)]">
      <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-3 bg-slate-50/50 border-b border-slate-100">
          <div className="relative">
            <input placeholder="Search batch..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none" />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {filteredOrders.map(order => (
            <div key={order.id} onClick={() => setSelectedOrder(order)}
              className={`p-3 cursor-pointer rounded-xl transition-all border ${selectedOrder?.id === order.id ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 hover:border-[#EAB308]'}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-black uppercase">{order.orderNumber}</span>
                <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' : 'bg-[#EAB308]/20 text-[#EAB308]'}`}>{order.status}</span>
              </div>
              <h4 className="font-black text-[11px] truncate">{order.clientName}</h4>
              <p className="text-[9px] opacity-60 truncate">{order.productName}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="xl:col-span-9 overflow-y-auto custom-scrollbar pr-1">
        {selectedOrder ? (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between gap-6 border-l-4 border-l-[#EAB308]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-[#EAB308] shadow-inner"><Factory size={28} /></div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">{selectedOrder.orderNumber}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{selectedOrder.clientName}</p>
                </div>
              </div>
              <div className="flex items-center gap-8 pr-4">
                <div className="text-center"><p className="text-[8px] font-black text-slate-300 uppercase">Quantity</p><p className="text-lg font-black">{selectedOrder.totalQuantity}</p></div>
                <div className="text-center"><p className="text-[8px] font-black text-slate-300 uppercase">Deadline</p><p className="text-[10px] font-black text-red-500">{new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <div className="flex items-center gap-3 mb-6"><Clock size={16} className="text-[#EAB308]" /><h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Operational Milestone</h4></div>
               <div className="flex justify-between items-start gap-2 relative">
                  <div className="absolute top-4 left-0 right-0 h-1 bg-slate-50 z-0 rounded-full">
                    <div className="h-full bg-green-500 rounded-full transition-all duration-700" style={{ width: `${(STAGES.indexOf(selectedOrder.status) / (STAGES.length - 1)) * 100}%` }}></div>
                  </div>
                  {STAGES.map((stage, i) => {
                    const active = selectedOrder.status === stage;
                    const done = STAGES.indexOf(selectedOrder.status) >= i;
                    return (
                      <div key={stage} className="flex flex-col items-center flex-1 relative z-10">
                        <button onClick={() => handleStatusUpdate(stage)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${active ? 'bg-slate-900 text-[#EAB308] scale-110 shadow-lg' : done ? 'bg-green-500 text-white' : 'bg-white border border-slate-200 text-slate-200'}`}>
                          {done ? <CheckCircle2 size={16} /> : <span className="text-[10px] font-black">{i+1}</span>}
                        </button>
                        <p className={`text-[7px] font-black uppercase text-center mt-2 ${active ? 'text-slate-900' : 'text-slate-300'}`}>{stage}</p>
                      </div>
                    );
                  })}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h4 className="text-[9px] font-black uppercase tracking-widest mb-4 border-b pb-2">Technical Sheet</h4>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <div><p className="text-[7px] font-black text-slate-300 uppercase">Fabric</p><p className="text-xs font-bold text-slate-700">{selectedOrder.fabric}</p></div>
                    <div><p className="text-[7px] font-black text-slate-300 uppercase">Color</p><p className="text-xs font-bold text-slate-700 capitalize">{selectedOrder.color}</p></div>
                    <div><p className="text-[7px] font-black text-slate-300 uppercase">Embellishment</p><p className="text-xs font-bold text-slate-700">{selectedOrder.embroideryPrint}</p></div>
                    <div><p className="text-[7px] font-black text-slate-300 uppercase">Trims</p><p className="text-[10px] font-medium text-slate-500 italic">{selectedOrder.accessories || 'Standard'}</p></div>
                  </div>
               </div>
               <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                  {selectedOrder.image ? <img src={selectedOrder.image} className="max-h-40 object-contain" alt="Ref" /> : <div className="text-slate-200 flex flex-col items-center"><ImageIcon size={32} /><p className="text-[7px] font-black uppercase mt-1">No Image</p></div>}
               </div>
            </div>
          </div>
        ) : (
          <div className="h-full bg-white rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 p-12"><Factory size={40} className="mb-4 opacity-10" /><p className="text-[9px] font-black uppercase">Select from terminal queue</p></div>
        )}
      </div>
    </div>
  );
};

export default ProductionView;
