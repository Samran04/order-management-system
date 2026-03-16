async function test() {
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test7@test.com', password: 'password123' })
  });
  const data = await loginRes.json();
  const token = data.token;
  
  if(!token) {
    console.log("LOGIN FAILED", data); return;
  }
  
  const TOP_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
  
  const payload = {
    orderNumber: 'TEST-5006',
    type: 'Final Production',
    clientName: 'Client',
    brand: 'Brand',
    startDate: new Date().toISOString(),
    deliveryDate: new Date().toISOString(),
    
    id: Math.random().toString(36).substr(2, 9),
    productName: 'Polo Shirt',
    itemDescription: '',
    accessories: [''],
    fabric: [''],
    color: 'Navy',
    sleeve: 'Short Sleeve',
    embroideryPrint: [''],
    fabricSupplier: [''],
    patternFollowed: '',
    cmPrice: [0],
    cmUnit: [''],
    images: [],
    sizes: TOP_SIZES.map(s => ({ size: s, quantity: 0 })),
    totalQuantity: 0,
    sizeCategory: 'Top',
    
    salesPersonId: 'fake', 
    date: new Date().toISOString(),
    status: 'Order Received',
    cmPartner: 'In-House Line'
  };

  try {
    const res = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log('Response:', text);
    
  } catch (e) {
    console.error('Fetch failed:', e.message);
  }
}

test();
