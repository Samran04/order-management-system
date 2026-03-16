async function test() {
  const token = 'fake-token-do-not-need'; // If we get 401 unauthorized, it means the payload size is fine. If 413, payload is too big.
  
  // Create a 2MB dummy base64 string
  let dummyBase64 = 'data:image/jpeg;base64,';
  for (let i = 0; i < 2000000; i++) {
    dummyBase64 += 'A';
  }

  const payload = {
    orderNumber: 'TEST-1234',
    type: 'Final Production',
    date: new Date().toISOString(),
    startDate: new Date().toISOString(),
    deliveryDate: new Date().toISOString(),
    clientName: 'Test Client',
    brand: 'Test Brand',
    productName: 'Test Product',
    itemDescription: 'Test Desc',
    fabric: ['Cotton'],
    color: 'Red',
    sleeve: 'Short Sleeve',
    fabricSupplier: ['Supplier A'],
    accessories: ['Buttons'],
    patternFollowed: 'P-123',
    cmPrice: [10],
    cmUnit: ['pcs'],
    cmPartner: 'In-House Line',
    embroideryPrint: ['Logo'],
    sizes: [{ size: 'M', quantity: 10 }],
    totalQuantity: 10,
    images: [dummyBase64], // huge payload
    status: 'Order Received'
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
    
    if (res.status === 413) {
      console.log('Got 413 Payload Too Large from server!');
    } else {
      console.log(`Status: ${res.status}`);
      const text = await res.text();
      console.log('Response:', text);
    }
  } catch (e) {
    console.error('Fetch failed:', e.message);
  }
}

test();
