
import React from 'react';
import { Order, OrderType, ProductionStatus, ViewType } from '../types';
import { 
  Briefcase, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Truck
} from 'lucide-react';

interface Props {
  orders: Order[];
  onNavigate: (view: ViewType) => void;
}

const DashboardView: React.FC<Props> = ({ orders, onNavigate }) => {
  const stats = [
    { label: 'Registry', value: orders.length, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Production', value: orders.filter(o => o.status !== 'Delivered' && o.status !== 'Order Received').length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Completed', value: orders.filter(o => o.status === 'Delivered').length, icon: Truck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Alerts', value: orders.filter(o => o.postDelivery?.status === 'Alteration Required').length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-lg">
            <div className="flex justify-between items-start">
              <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl shadow-sm`}>
                <stat.icon size={20} />
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest mb-0.5">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-800 leading-none">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
            <h3 className="font-black text-slate-800 text-sm tracking-tight">Active Operations Registry</h3>
            <button onClick={() => onNavigate('Sales')} className="text-[#EAB308] text-[10px] font-black uppercase tracking-widest hover:underline">Full Registry</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                  <th className="px-6 py-4">Identity</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.slice(0, 8).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-all cursor-pointer group text-xs" onClick={() => onNavigate('Production')}>
                    <td className="px-6 py-4">
                      <p className="text-[9px] font-black text-[#EAB308] tracking-widest uppercase mb-0.5">{order.orderNumber}</p>
                      <p className="font-bold text-slate-800 truncate max-w-[120px]">{order.productName || order.itemDescription}</p>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-700">{order.clientName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full shadow-sm ${order.status === 'Delivered' ? 'bg-green-500' : order.status === 'Packing' ? 'bg-blue-500' : 'bg-[#EAB308]'}`}></div>
                        <span className="text-[10px] text-slate-600 font-black uppercase tracking-tight">{order.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <h3 className="font-black text-slate-800 text-sm tracking-tight mb-6">Line Intensity</h3>
          <div className="flex-1 space-y-6">
            {[
              { label: 'Received', progress: 100, color: 'bg-[#EAB308]' },
              { label: 'Cutting', progress: 82, color: 'bg-slate-900' },
              { label: 'Stitching', progress: 30, color: 'bg-blue-500' },
              { label: 'Quality', progress: 15, color: 'bg-green-500' }
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                  <span className="text-xs font-black text-slate-800">{item.progress}%</span>
                </div>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden shadow-inner">
                  <div className={`${item.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${item.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
