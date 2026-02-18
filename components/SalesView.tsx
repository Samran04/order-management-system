import React, { useState, useRef } from 'react';
import { Plus, X, Search, Edit2, Printer, ChevronDown, Download, Phone, Send, Save, Clock } from 'lucide-react';
import { Order, OrderType, SizeQuantity, User } from '../types';
import { PDFDownloadLink } from '@react-pdf/renderer';
import OrderSheetPDF from './OrderPDF';

interface Props {
  orders: Order[];
  onAddOrder: (order: Order) => void;
  onUpdateOrder: (order: Order) => void;
  onBulkUpdateOrders?: (orderNumber: string, newOrders: Order[]) => void;
  currentUser: User;
}

interface ItemForm {
  id: string;
  productName: string;
  itemDescription: string;
  accessories: string[];
  fabric: string[];
  color: string;
  sleeve: string;
  embroideryPrint: string[];
  fabricSupplier: string[];
  patternFollowed: string;
  cmPrice: string[];
  cmUnit: string[];
  images: string[];
  sizes: SizeQuantity[];
  totalQuantity: number;
  sizeCategory?: 'Top' | 'Bottom' | 'Custom';
}

const TOP_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const BOTTOM_SIZES = ['28', '30', '32', '34', '36', '38', '40', '42'];

const MultiInput = ({ label, field, placeholder, values, onAdd, onChange, onRemove }: {
  label: string,
  field: keyof ItemForm,
  placeholder: string,
  values: string[],
  onAdd: () => void,
  onChange: (idx: number, val: string) => void,
  onRemove: (idx: number) => void
}) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center px-1">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <button
        type="button"
        tabIndex={-1}
        onClick={onAdd}
        className="bg-slate-50 hover:bg-[#EAB308] text-[#EAB308] hover:text-black w-6 h-6 rounded-lg flex items-center justify-center transition-all shadow-sm border border-slate-100 cursor-pointer"
      >
        <Plus size={14} className="stroke-[3px]" />
      </button>
    </div>
    <div className="space-y-2">
      {values.map((val, idx) => (
        <div key={idx} className="relative flex items-center group">
          <input
            placeholder={placeholder}
            value={val}
            onChange={(e) => onChange(idx, e.target.value)}
            className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-black text-xs outline-none focus:border-[#EAB308]/50 transition-colors shadow-sm"
          />
          {values.length > 1 && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => onRemove(idx)}
              className="absolute right-3 p-1 text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
);

const SalesView: React.FC<Props> = ({ orders, onAddOrder, onUpdateOrder, currentUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [registrySearch, setRegistrySearch] = useState('');
  const [editingOrderNumber, setEditingOrderNumber] = useState<string | null>(null);


  const [headerData, setHeaderData] = useState({
    orderNumber: '',
    type: 'Final Production' as OrderType,
    clientName: '',
    brand: '',
    startDate: '',
    deliveryDate: '',
  });

  const [items, setItems] = useState<ItemForm[]>([createNewItem()]);

  function createNewItem(): ItemForm {
    return {
      id: Math.random().toString(36).substr(2, 9),
      productName: '',
      itemDescription: '',
      accessories: [''],
      fabric: [''],
      color: '',
      sleeve: '',
      embroideryPrint: [''],
      fabricSupplier: [''],
      patternFollowed: '',
      cmPrice: [''],
      cmUnit: [''],
      images: [],
      sizes: TOP_SIZES.map(s => ({ size: s, quantity: 0 })),
      totalQuantity: 0,
      sizeCategory: 'Top'
    };
  }

  const resetForm = () => {
    setHeaderData({
      orderNumber: '',
      type: 'Final Production' as OrderType,
      clientName: '',
      brand: '',
      startDate: '',
      deliveryDate: '',
    });
    setItems([createNewItem()]);
    setActiveTab(0);
    setEditingOrderNumber(null);
  };

  const openFormForEdit = (orderNumber: string) => {
    const relatedOrders = orders.filter(o => o.orderNumber === orderNumber);
    if (relatedOrders.length === 0) return;

    const base = relatedOrders[0];
    setEditingOrderNumber(orderNumber);
    setHeaderData({
      orderNumber: base.orderNumber,
      type: base.type,
      clientName: base.clientName,
      brand: base.brand,
      startDate: base.startDate,
      deliveryDate: base.deliveryDate.split('T')[0],
    });

    const mappedItems: ItemForm[] = relatedOrders.map(o => ({
      id: o.id,
      productName: o.productName,
      itemDescription: o.itemDescription,
      accessories: Array.isArray(o.accessories) ? o.accessories : [o.accessories || ''],
      fabric: Array.isArray(o.fabric) ? o.fabric : [o.fabric || ''],
      color: o.color,
      sleeve: o.sleeve,
      embroideryPrint: Array.isArray(o.embroideryPrint) ? o.embroideryPrint : [o.embroideryPrint || ''],
      fabricSupplier: Array.isArray(o.fabricSupplier) ? o.fabricSupplier : [o.fabricSupplier || ''],
      patternFollowed: o.patternFollowed,
      cmPrice: Array.isArray(o.cmPrice) ? o.cmPrice.map(p => String(p)) : [String(o.cmPrice)],
      cmUnit: Array.isArray(o.cmUnit) ? o.cmUnit : [o.cmUnit || ''],
      images: o.images || [],
      sizes: [...o.sizes],
      totalQuantity: o.totalQuantity,
      sizeCategory: 'Custom'
    }));

    setItems(mappedItems);
    setActiveTab(0);
    setShowForm(true);
  };

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'startDate' && value) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const timePart = `${hours}:${minutes}`;
      setHeaderData(prev => ({ ...prev, [name]: `${value}T${timePart}` }));
      return;
    }
    setHeaderData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: keyof ItemForm, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    if (field === 'sizeCategory') {
      if (value === 'Top') {
        newItems[index].sizes = TOP_SIZES.map(s => ({ size: s, quantity: 0 }));
      } else if (value === 'Bottom') {
        newItems[index].sizes = BOTTOM_SIZES.map(s => ({ size: s, quantity: 0 }));
      } else {
        newItems[index].sizes = [];
      }
      newItems[index].totalQuantity = newItems[index].sizes.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
    }
    setItems(newItems);
  };

  const handleMultiItemChange = (itemIdx: number, field: keyof ItemForm, subIdx: number, value: string) => {
    const newItems = [...items];
    const list = [...(newItems[itemIdx][field] as string[])];
    list[subIdx] = value;
    (newItems[itemIdx] as any)[field] = list;
    setItems(newItems);
  };

  const addMultiItem = (itemIdx: number, field: keyof ItemForm) => {
    const newItems = [...items];
    const list = [...(newItems[itemIdx][field] as string[])];
    list.push('');
    (newItems[itemIdx] as any)[field] = list;
    setItems(newItems);
  };

  const removeMultiItem = (itemIdx: number, field: keyof ItemForm, subIdx: number) => {
    const newItems = [...items];
    const list = (newItems[itemIdx][field] as string[]).filter((_, i) => i !== subIdx);
    if (list.length === 0) list.push('');
    (newItems[itemIdx] as any)[field] = list;
    setItems(newItems);
  };

  const handleSizeChange = (itemIdx: number, sizeIdx: number, field: keyof SizeQuantity, value: string | number) => {
    const newItems = [...items];
    const newSizes = [...newItems[itemIdx].sizes];
    newSizes[sizeIdx] = { ...newSizes[sizeIdx], [field]: value };
    newItems[itemIdx].sizes = newSizes;
    newItems[itemIdx].totalQuantity = newSizes.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
    setItems(newItems);
  };

  const addSizeRow = (itemIdx: number) => {
    const newItems = [...items];
    newItems[itemIdx].sizes.push({ size: '', quantity: 0 });
    setItems(newItems);
  };

  const removeSizeRow = (itemIdx: number, sizeIdx: number) => {
    const newItems = [...items];
    newItems[itemIdx].sizes = newItems[itemIdx].sizes.filter((_, i) => i !== sizeIdx);
    newItems[itemIdx].totalQuantity = newItems[itemIdx].sizes.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
    setItems(newItems);
  };

  const addItemTab = () => {
    const newItem = createNewItem();
    setItems([...items, newItem]);
    setActiveTab(items.length);
  };

  const removeItemTab = (index: number) => {
    if (items.length <= 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setActiveTab(prev => Math.max(0, prev >= index ? prev - 1 : prev));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, itemIndex: number) => {
    const files = e.target.files;
    if (files) {
      (Array.from(files) as File[]).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const newItems = [...items];
          newItems[itemIndex].images = [...newItems[itemIndex].images, base64String];
          setItems(newItems);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (itemIdx: number, imgIdx: number) => {
    const newItems = [...items];
    newItems[itemIdx].images = newItems[itemIdx].images.filter((_, i) => i !== imgIdx);
    setItems(newItems);
  };



  const finalizeSheet = async () => {
    if (!headerData.orderNumber || !headerData.clientName) {
      alert("Missing Required Data: Order ID and Client Name are mandatory.");
      return;
    }
    const validItems = items.filter(item => item.productName.trim() !== '');
    if (validItems.length === 0) {
      alert("Validation Error: Please add at least one item.");
      return;
    }
    const startTimestamp = headerData.startDate || new Date().toISOString();
    const deadlineTimestamp = headerData.deliveryDate ? `${headerData.deliveryDate}T00:00:00` : new Date().toISOString();

    const finalOrders: Order[] = validItems.map(item => ({
      ...headerData,
      ...item,
      cmPrice: item.cmPrice.map(p => parseFloat(p) || 0),
      startDate: startTimestamp,
      deliveryDate: deadlineTimestamp,
      id: item.id.length > 10 ? item.id : Math.random().toString(36).substr(2, 9),
      salesPerson: currentUser.name,
      date: new Date().toISOString(),
      status: 'Order Received' as any,
      cmPartner: 'In-House Line',
    }));

    if (editingOrderNumber) {
      finalOrders.forEach(o => onUpdateOrder(o));
    } else {
      finalOrders.forEach(o => onAddOrder(o));
    }

    setShowForm(false);
    resetForm();
  };

  const orderGroups = orders.reduce((groups, order) => {
    const key = order.orderNumber;
    if (!groups[key]) groups[key] = [];
    groups[key].push(order);
    return groups;
  }, {} as Record<string, Order[]>);

  const filteredGroups = Object.keys(orderGroups).filter(key => {
    const group = orderGroups[key];
    const search = registrySearch.toLowerCase();
    return key.toLowerCase().includes(search) ||
      group[0].clientName.toLowerCase().includes(search) ||
      group.some(o => o.productName.toLowerCase().includes(search));
  });

  const currentItem = items[activeTab];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">


      {/* REMAINDER OF UI REMAINS CONSISTENT */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-sm gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Orders & Registry</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-56">
            <input value={registrySearch} onChange={(e) => setRegistrySearch(e.target.value)} placeholder="Filter..." className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none" />
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="w-full sm:w-auto bg-[#EAB308] text-black px-6 py-2.5 rounded-xl font-black flex items-center justify-center space-x-2 shadow-lg transition-all text-xs">
            <Plus size={16} /><span>New Order Sheet</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl h-auto max-h-[95vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="bg-[#EAB308] p-3 rounded-xl shadow-lg">
                  <Printer size={24} className="text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Generate Quotation</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Multi-item Data Entry Portal</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <PDFDownloadLink
                  document={<OrderSheetPDF order={headerData as any} items={items} />}
                  fileName={`Uniform_Studio_81_OrderSheet_${headerData.orderNumber || 'Draft'}.pdf`}
                  className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#EAB308] hover:text-black transition-all"
                >
                  {({ blob, url, loading, error }) => (
                    <>
                      <Download size={14} /> {loading ? 'Loading...' : 'Download PDF'}
                    </>
                  )}
                </PDFDownloadLink>
                <button onClick={() => { setShowForm(false); resetForm(); }} tabIndex={-1} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <X size={28} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Order ID</label>
                  <input name="orderNumber" placeholder="2026029" onChange={handleHeaderChange} value={headerData.orderNumber} className="w-full p-3 bg-white border border-slate-200 rounded-2xl font-black text-xs outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Client Name</label>
                  <input name="clientName" placeholder="Client" onChange={handleHeaderChange} value={headerData.clientName} className="w-full p-3 bg-white border border-slate-200 rounded-2xl font-black text-xs outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Location</label>
                  <input name="brand" placeholder="Address" onChange={handleHeaderChange} value={headerData.brand} className="w-full p-3 bg-white border border-slate-200 rounded-2xl font-black text-xs outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-[#EAB308] uppercase tracking-widest px-1">Start Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="startDate"
                      value={headerData.startDate.split('T')[0]}
                      onChange={handleHeaderChange}
                      className="w-full p-3 bg-white border border-[#EAB308]/30 rounded-2xl font-black text-[11px] outline-none"
                    />
                    {headerData.startDate.includes('T') && (
                      <div className="absolute -bottom-4 right-2 flex items-center gap-1">
                        <Clock size={8} className="text-[#EAB308]" />
                        <span className="text-[7px] font-black text-slate-400 uppercase">Captured: {headerData.startDate.split('T')[1]}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-red-500 uppercase tracking-widest px-1">Deadline</label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={headerData.deliveryDate}
                    onChange={handleHeaderChange}
                    className="w-full p-3 bg-white border border-red-100 rounded-2xl font-black text-[11px] text-red-600 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {items.map((item, idx) => (
                    <div key={item.id} className="relative group shrink-0">
                      <button onClick={() => setActiveTab(idx)} tabIndex={-1}
                        className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${activeTab === idx ? 'bg-[#1E293B] text-[#EAB308]' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                        Item {idx + 1}
                      </button>
                      {items.length > 1 && (
                        <button onClick={() => removeItemTab(idx)} tabIndex={-1} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 hover:bg-red-600">
                          <X size={10} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50/30 p-10 rounded-[2.5rem] border border-slate-100 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Product</label>
                      <input placeholder="e.g. Polo Shirt" value={currentItem.productName} onChange={(e) => handleItemChange(activeTab, 'productName', e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-black text-xs outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Color</label>
                      <input placeholder="e.g. Navy Blue" value={currentItem.color} onChange={(e) => handleItemChange(activeTab, 'color', e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-black text-xs outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Sleeve Style</label>
                      <div className="relative">
                        <select value={currentItem.sleeve} onChange={(e) => handleItemChange(activeTab, 'sleeve', e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-black text-xs appearance-none outline-none cursor-pointer pr-10">
                          <option value="">Select Sleeve</option>
                          <option>Short Sleeve</option>
                          <option>Long Sleeve</option>
                          <option>Sleeveless</option>
                          <option>3/4 Sleeve</option>
                          <option>N/A</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <MultiInput
                      label="Embellishment"
                      field="embroideryPrint"
                      placeholder="e.g. Sublimation Print"
                      values={currentItem.embroideryPrint}
                      onAdd={() => addMultiItem(activeTab, 'embroideryPrint')}
                      onChange={(idx, val) => handleMultiItemChange(activeTab, 'embroideryPrint', idx, val)}
                      onRemove={(idx) => removeMultiItem(activeTab, 'embroideryPrint', idx)}
                    />
                    <MultiInput
                      label="Accessories"
                      field="accessories"
                      placeholder="e.g. Rib collar, 2 buttons..."
                      values={currentItem.accessories}
                      onAdd={() => addMultiItem(activeTab, 'accessories')}
                      onChange={(idx, val) => handleMultiItemChange(activeTab, 'accessories', idx, val)}
                      onRemove={(idx) => removeMultiItem(activeTab, 'accessories', idx)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <MultiInput
                      label="Fabric"
                      field="fabric"
                      placeholder="e.g. Dry-fit Mesh"
                      values={currentItem.fabric}
                      onAdd={() => addMultiItem(activeTab, 'fabric')}
                      onChange={(idx, val) => handleMultiItemChange(activeTab, 'fabric', idx, val)}
                      onRemove={(idx) => removeMultiItem(activeTab, 'fabric', idx)}
                    />
                    <MultiInput
                      label="Fabric Supplier"
                      field="fabricSupplier"
                      placeholder="e.g. Textile Hub"
                      values={currentItem.fabricSupplier}
                      onAdd={() => addMultiItem(activeTab, 'fabricSupplier')}
                      onChange={(idx, val) => handleMultiItemChange(activeTab, 'fabricSupplier', idx, val)}
                      onRemove={(idx) => removeMultiItem(activeTab, 'fabricSupplier', idx)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <MultiInput
                      label="CM Unit"
                      field="cmUnit"
                      placeholder="e.g. crt"
                      values={currentItem.cmUnit}
                      onAdd={() => addMultiItem(activeTab, 'cmUnit')}
                      onChange={(idx, val) => handleMultiItemChange(activeTab, 'cmUnit', idx, val)}
                      onRemove={(idx) => removeMultiItem(activeTab, 'cmUnit', idx)}
                    />
                    <MultiInput
                      label="CM Price AED"
                      field="cmPrice"
                      placeholder="Enter Price"
                      values={currentItem.cmPrice}
                      onAdd={() => addMultiItem(activeTab, 'cmPrice')}
                      onChange={(idx, val) => handleMultiItemChange(activeTab, 'cmPrice', idx, val)}
                      onRemove={(idx) => removeMultiItem(activeTab, 'cmPrice', idx)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Pattern Followed</label>
                    <input placeholder="US-81-STD" value={currentItem.patternFollowed} onChange={(e) => handleItemChange(activeTab, 'patternFollowed', e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-black text-xs outline-none focus:border-[#EAB308]/50 transition-colors" />
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Size Breakdown</label>
                        <div className="relative">
                          <select
                            value={currentItem.sizeCategory}
                            tabIndex={0}
                            onChange={(e) => handleItemChange(activeTab, 'sizeCategory', e.target.value)}
                            className="bg-slate-100 text-slate-800 font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg border border-slate-200 outline-none cursor-pointer pr-8 hover:bg-slate-200 transition-colors"
                          >
                            <option value="Top">Top (XS-3XL)</option>
                            <option value="Bottom">Bottom (28-42)</option>
                            <option value="Custom">Custom</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={10} />
                        </div>
                      </div>
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => addSizeRow(activeTab)}
                        className="text-[9px] font-black text-[#EAB308] hover:text-white flex items-center gap-1 uppercase tracking-widest bg-yellow-50 hover:bg-[#EAB308] px-4 py-2 rounded-lg transition-all border border-[#EAB308]/20 group cursor-pointer shadow-sm active:scale-95"
                      >
                        <Plus size={12} className="group-hover:rotate-90 transition-transform" /> Add Size
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                      {currentItem.sizes.map((s, si) => (
                        <div key={si} className="relative bg-white p-2.5 rounded-2xl border border-slate-100 flex flex-col items-center justify-center group shadow-sm transition-all hover:shadow-md h-24">
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => removeSizeRow(activeTab, si)}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 cursor-pointer"
                          >
                            <X size={10} />
                          </button>
                          <div className="flex flex-col items-center justify-center w-full space-y-0.5">
                            <input
                              placeholder="SIZE"
                              value={s.size}
                              tabIndex={0}
                              onChange={(e) => handleSizeChange(activeTab, si, 'size', e.target.value)}
                              className="w-full text-center font-black text-sm text-slate-800 uppercase outline-none bg-transparent border-none placeholder:text-slate-200"
                            />
                            <div className="w-full flex justify-center">
                              <input
                                type="number"
                                tabIndex={0}
                                value={s.quantity === 0 ? '' : s.quantity}
                                onChange={(e) => handleSizeChange(activeTab, si, 'quantity', parseInt(e.target.value) || 0)}
                                className="w-full text-center font-black text-lg text-[#EAB308] outline-none bg-transparent placeholder:text-slate-100 border-none focus:ring-0 leading-none"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Detailed Description</label>
                    <textarea
                      rows={6}
                      placeholder="Technical specification..."
                      value={currentItem.itemDescription}
                      onChange={(e) => handleItemChange(activeTab, 'itemDescription', e.target.value)}
                      className="w-full p-6 bg-white border border-slate-200 rounded-3xl font-medium text-[11px] outline-none shadow-sm resize-none focus:ring-2 focus:ring-[#EAB308]/20 transition-all leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 text-center block w-full">Ref Images</label>
                    <div className="bg-white rounded-[2.5rem] p-10 min-h-[200px] border-2 border-dashed border-slate-200 flex flex-wrap gap-6 items-center justify-center relative shadow-lg overflow-hidden group">
                      {currentItem.images.map((img, idx) => (
                        <div key={idx} className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-lg ring-1 ring-slate-100 group/img transition-transform hover:scale-105">
                          <img src={img} className="w-full h-full object-cover" alt={`Ref ${idx}`} />
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => removeImage(activeTab, idx)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <label tabIndex={-1} className="w-32 h-32 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-[#EAB308] cursor-pointer hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-md border-dashed">
                        <Plus size={32} className="stroke-[3px]" />
                        <span className="text-[8px] font-black uppercase mt-1">Upload</span>
                        <input type="file" tabIndex={-1} multiple accept="image/*" onChange={(e) => handleFileUpload(e, activeTab)} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-center pt-8 border-t border-slate-100">
                    <button onClick={addItemTab} tabIndex={-1} className="bg-[#EAB308] text-black px-12 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-[0_15px_35px_-10px_rgba(234,179,8,0.4)] hover:scale-[1.03] active:scale-95 transition-all text-[12px] uppercase tracking-[0.2em]">
                      <Plus size={20} /><span>Add Another Item</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50/80 border-t border-slate-100 flex flex-col md:flex-row justify-end items-center gap-6">
              <div className="flex items-center gap-10">
                <button onClick={() => { setShowForm(false); resetForm(); }} tabIndex={-1} className="text-[11px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">Discard</button>
                <button onClick={finalizeSheet} tabIndex={-1} className="bg-[#1E293B] text-[#EAB308] px-14 py-5 rounded-[1.5rem] font-black flex items-center gap-3 shadow-[0_15px_40px_rgba(30,41,59,0.3)] hover:scale-[1.02] active:scale-95 transition-all group border-b-4 border-black">
                  <Save size={22} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm uppercase tracking-wider">Save Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredGroups.map(orderNum => {
          const group = orderGroups[orderNum];
          const base = group[0];
          const totalQty = group.reduce((sum, o) => sum + o.totalQuantity, 0);
          const productList = group.map(o => o.productName).filter(Boolean).join(', ');

          return (
            <div key={orderNum} onClick={() => openFormForEdit(orderNum)} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-xl transition-all group cursor-pointer border-l-8 border-l-[#EAB308] overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[9px] font-black text-[#EAB308] uppercase tracking-widest">{orderNum}</span>
                <div className="bg-slate-50 p-1.5 rounded-lg opacity-40 group-hover:opacity-100 transition-opacity">
                  <Edit2 size={12} className="text-slate-800" />
                </div>
              </div>
              <h4 className="font-black text-slate-800 text-sm truncate mb-1">{base.clientName}</h4>
              <p className="text-[11px] text-slate-400 font-bold truncate">{productList || 'Items Registry'}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-[10px] font-black bg-slate-900 text-[#EAB308] px-3 py-1 rounded-xl shadow-sm">Sheet Qty: {totalQty}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SalesView;
