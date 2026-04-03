
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Factory, 
  Truck, 
  Search, 
  Menu, 
  X,
  LogOut,
  Bell,
  Settings,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Trash2,
  Edit2,
  User as UserIcon,
  Calendar,
  Phone,
  Building2,
  Save
} from 'lucide-react';
import { Order, ViewType, User, AppNotification } from './types';
import DashboardView from './components/DashboardView';
import SalesView from './components/SalesView';
import ProductionView from './components/ProductionView';
import DeliveryView from './components/DeliveryView';
import Login from './components/Login';
import { api } from './lib/api';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedOrderIdFromSearch, setSelectedOrderIdFromSearch] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  
  // Auth tokens from URL
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [verifyToken, setVerifyToken] = useState<string | null>(null);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  
  // Profile edit form state
  const [profileFormData, setProfileFormData] = useState<Partial<User>>({});

  useEffect(() => {
    const initApp = async () => {
      if (api.getToken()) {
        try {
          const user = await api.getCurrentUser();
          setCurrentUser(user);
          setProfileFormData(user);
          const backendOrders = await api.getOrders();
          setOrders(backendOrders);
          const backendNotifs = await api.getNotifications();
          setNotifications(backendNotifs);
        } catch (error) {
          console.error("Session failed to restore", error);
          api.logout();
          setCurrentUser(null);
        }
      }
    };
    initApp();

    // Check for tokens in URL
    const params = new URLSearchParams(window.location.search);
    const rt = params.get('resetToken');
    const vt = params.get('verifyToken');
    if (rt) setResetToken(rt);
    if (vt) setVerifyToken(vt);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setSearchQuery('');
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addNotification = async (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    try {
      const newNotif = await api.createNotification(notif as any);
      setNotifications(prev => [newNotif, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    setProfileFormData(user);
    try {
      const backendOrders = await api.getOrders();
      setOrders(backendOrders);
      const backendNotifs = await api.getNotifications();
      setNotifications(backendNotifs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    api.logout();
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const updatedUser = await api.updateUser(currentUser.id, profileFormData);
      setCurrentUser(updatedUser);
      setIsProfileModalOpen(false);
      addNotification({ title: 'Profile Updated', message: 'Your personal details have been saved successfully.', type: 'info' });
    } catch (error) {
      console.error(error);
    }
  };

  const addOrder = (order: Order) => {
    setOrders([order, ...orders]);
    addNotification({
      title: 'New Order Created',
      message: `${order.orderNumber} for ${order.clientName} has been added.`,
      type: 'success'
    });
  };

  const updateOrder = (updated: Order) => {
    setOrders(orders.map(o => o.id === updated.id ? updated : o));
    if (updated.postDelivery?.status === 'Alteration Required') {
      addNotification({
        title: 'ALTERATION ALERT',
        message: `Batch ${updated.orderNumber} for ${updated.clientName} needs alteration. Details: ${updated.postDelivery.solution}`,
        type: 'alert'
      });
    }
  };

  const markNotifsRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    try {
      await api.markAllNotificationsRead();
    } catch (e) {
      console.error(e);
    }
  };

  const clearNotifs = () => setNotifications([]);

  const filteredSearchResults = searchQuery.length > 0 
    ? orders.filter(o => 
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
        o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.productName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 10)
    : [];

  const handleSelectSearchResult = (order: Order) => {
    setSearchQuery('');
    setSelectedOrderIdFromSearch(order.id);
    setActiveView('Production');
  };

  const handleClearTokens = () => {
    setResetToken(null);
    setVerifyToken(null);
    // Remove params from URL without reload
    const url = new URL(window.location.href);
    url.searchParams.delete('resetToken');
    url.searchParams.delete('verifyToken');
    window.history.replaceState({}, '', url);
  };

  if (!currentUser) return (
    <Login 
      onLogin={handleLogin} 
      initialResetToken={resetToken} 
      initialVerifyToken={verifyToken} 
      onClearTokens={handleClearTokens}
    />
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className={`${isSidebarOpen ? 'w-56' : 'w-16'} bg-[#1E293B] text-white transition-all duration-300 ease-in-out hidden md:flex flex-col z-20 shadow-xl shrink-0`}>
        <div className="p-4 flex items-center justify-between">
          <div className={`flex items-center space-x-2 ${!isSidebarOpen && 'hidden'}`}>
            <div className="bg-[#EAB308] p-1 rounded-lg"><span className="font-black text-black text-base">US</span></div>
            <div className="flex flex-col">
              <span className="font-black text-xs leading-tight">STUDIO 81</span>
              <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">{currentUser.role}</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white p-1">
            {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        <nav className="flex-1 px-2 space-y-1 mt-2">
          {[
            { v: 'Dashboard', i: LayoutDashboard, l: 'Dashboard' },
            { v: 'Sales', i: ShoppingCart, l: 'Sales' },
            { v: 'Production', i: Factory, l: 'Production' },
            { v: 'Delivery', i: Truck, l: 'Delivery' }
          ].map(item => (
            <button key={item.v} onClick={() => { setActiveView(item.v as any); setSelectedOrderIdFromSearch(null); }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                activeView === item.v ? 'bg-[#EAB308] text-black font-black shadow-lg shadow-[#EAB308]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}>
              <item.i size={16} />
              <span className={`${!isSidebarOpen && 'hidden'} lg:block font-bold tracking-tight text-[11px]`}>{item.l}</span>
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-slate-700 space-y-1">
          <button onClick={() => setIsProfileModalOpen(true)} className={`w-full flex items-center space-x-2 px-2 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700 transition-all ${!isSidebarOpen && 'justify-center'}`}>
            <div className="h-7 w-7 rounded-lg bg-[#EAB308] flex items-center justify-center text-black font-black border border-white/20 uppercase shadow-md shrink-0 text-[10px]">{currentUser.name.substring(0, 2)}</div>
            <div className={`${!isSidebarOpen && 'hidden'} lg:block overflow-hidden text-left`}>
              <p className="text-[9px] font-black text-white leading-none truncate">{currentUser.name}</p>
              <p className="text-[7px] text-slate-400 uppercase font-black mt-0.5 flex items-center gap-1"><Edit2 size={8} /> Edit Profile</p>
            </div>
          </button>
          <button onClick={handleLogout} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all ${!isSidebarOpen && 'justify-center'}`}>
            <LogOut size={16} /><span className={`${!isSidebarOpen && 'hidden'} lg:block font-bold text-[11px]`}>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-[30] sticky top-0 shadow-sm shrink-0">
          <div className="flex items-baseline gap-2">
            <h1 className="text-base font-black text-slate-800 tracking-tight">{activeView}</h1>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em] opacity-50">Uniform Studio 81</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative" ref={searchRef}>
              <div className="hidden sm:flex items-center bg-slate-50 rounded-xl px-4 py-1.5 border border-slate-100 focus-within:ring-2 focus-within:ring-[#EAB308] transition-all">
                <Search size={14} className="text-slate-300 mr-2" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Batch search..." className="bg-transparent border-none outline-none text-[10px] w-40 font-bold text-slate-600 placeholder:text-slate-300" />
              </div>
              {searchQuery.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-1.5 z-[100] animate-in fade-in slide-in-from-top-2">
                  {filteredSearchResults.length > 0 ? filteredSearchResults.map(order => (
                    <button key={order.id} onClick={() => handleSelectSearchResult(order)} className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl transition-all group flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-[8px] font-black text-[#EAB308] uppercase truncate">{order.orderNumber}</p>
                        <p className="text-[10px] font-black text-slate-800 truncate">{order.clientName}</p>
                      </div>
                      <ArrowRight size={12} className="text-slate-200 group-hover:text-[#EAB308] shrink-0 ml-2" />
                    </button>
                  )) : (
                    <div className="p-4 text-center text-slate-300"><p className="text-[9px] font-black uppercase tracking-widest">No match</p></div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative" ref={notifRef}>
                <button onClick={() => { setIsNotifDropdownOpen(!isNotifDropdownOpen); markNotifsRead(); }}
                  className={`relative p-2 rounded-xl transition-all ${isNotifDropdownOpen ? 'bg-slate-100 text-[#EAB308]' : 'text-slate-400 hover:text-[#EAB308]'}`}>
                  <Bell size={18} />
                  {unreadCount > 0 && <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 text-white text-[7px] font-black rounded-full flex items-center justify-center border-2 border-white">{unreadCount}</span>}
                </button>
                {isNotifDropdownOpen && (
                  <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[110] overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-wider">Alerts Center</h3>
                      <button onClick={clearNotifs} className="text-[8px] font-black text-slate-400 hover:text-red-500 uppercase flex items-center gap-1"><Trash2 size={10} /> Clear</button>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-1.5">
                      {notifications.length > 0 ? notifications.map(n => (
                        <div key={n.id} className={`p-4 rounded-xl mb-2 transition-all flex gap-3 h-auto ${n.read ? 'opacity-60' : 'bg-white shadow-sm ring-1 ring-slate-100'}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            n.type === 'success' ? 'bg-green-50 text-green-500' : 
                            n.type === 'alert' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                          }`}>
                            {n.type === 'success' ? <CheckCircle size={16} /> : n.type === 'alert' ? <AlertTriangle size={16} /> : <Info size={16} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-slate-800">{n.title}</p>
                            <p className="text-[10px] font-medium text-slate-500 mt-1 leading-relaxed whitespace-normal break-words">{n.message}</p>
                          </div>
                        </div>
                      )) : (
                        <div className="p-12 text-center text-slate-300"><Bell size={32} className="mx-auto mb-2 opacity-10" /><p className="text-[8px] font-black uppercase tracking-widest">No Alerts</p></div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-1">
                <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Active</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-5 custom-scrollbar">
          {activeView === 'Dashboard' && <DashboardView orders={orders} onNavigate={setActiveView} />}
          {activeView === 'Sales' && <SalesView orders={orders} onAddOrder={addOrder} onUpdateOrder={updateOrder} currentUser={currentUser} />}
          {activeView === 'Production' && <ProductionView orders={orders} onUpdateOrder={updateOrder} preSelectedOrderId={selectedOrderIdFromSearch} />}
          {activeView === 'Delivery' && <DeliveryView orders={orders} onUpdateOrder={updateOrder} />}
        </div>
      </main>

      {/* Edit Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="bg-[#EAB308] p-3 rounded-xl shadow-lg text-black">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Edit Profile</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Update Personal Information</p>
                </div>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                  <UserIcon size={12} /> Full Name
                </label>
                <input 
                  required
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs outline-none focus:ring-4 focus:ring-[#EAB308]/10"
                  value={profileFormData.name || ''}
                  onChange={e => setProfileFormData({...profileFormData, name: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Building2 size={12} /> Organization
                </label>
                <input 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs outline-none focus:ring-4 focus:ring-[#EAB308]/10"
                  value={profileFormData.organization || ''}
                  onChange={e => setProfileFormData({...profileFormData, organization: e.target.value})}
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-[#EAB308] py-5 rounded-[1.5rem] font-black flex items-center justify-center space-x-3 shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-1 active:scale-95 group"
                >
                  <Save size={20} className="group-hover:rotate-12 transition-transform" />
                  <span className="text-xs uppercase tracking-widest">Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
