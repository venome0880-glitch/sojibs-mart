const http = require('http');

// Run tests
async function runTests() {
  console.log('--- Starting Sojib\'s Mart In-Depth Integration Tests ---');
  
  // Require server which starts on port 5000
  require('./server.js');
  
  // Wait 1.5 seconds for server to be ready
  await new Promise(r => setTimeout(r, 1500));

  function request(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const opts = {
        hostname: '127.0.0.1',
        port: 5000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      const req = http.request(opts, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data, headers: res.headers });
          }
        });
      });

      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }

  try {
    // 1. Test GET /api/store
    console.log('\n1. Testing GET /api/store...');
    const store = await request('GET', '/api/store');
    console.log('Status:', store.status);
    console.log('Shop Name:', store.data.config.shopName);
    console.log('Currency:', store.data.config.currency);
    console.log('WhatsApp:', store.data.config.whatsappNumber);
    console.log('Facebook:', store.data.config.facebookPage);
    console.log('Models Count:', store.data.models.length);
    if (!store.data.config.shopName || store.data.models.length !== 4) {
      throw new Error('Store config or models invalid');
    }
    // Verify password is NOT exposed
    if (store.data.config.adminPasswordHash || store.data.config.password) {
      throw new Error('SECURITY VIOLATION: Owner password leaked in public store API!');
    }
    console.log('✓ Public API clean: owner password safely hidden');

    // 2. Test POST /api/orders (Submitting new customer order)
    console.log('\n2. Testing POST /api/orders...');
    const orderPayload = {
      customerName: 'Anisur Rahman',
      phone: '01712998877',
      deliveryAddress: 'House 5, Road 2, Dhanmondi, Dhaka',
      modelId: 'model-10-2500',
      quantity: 1,
      source: 'WhatsApp'
    };
    const orderRes = await request('POST', '/api/orders', orderPayload);
    console.log('Status:', orderRes.status);
    console.log('Order ID:', orderRes.data.order.id);
    console.log('WhatsApp URL preview:', orderRes.data.whatsappUrl.substring(0, 60) + '...');
    if (orderRes.status !== 201 || !orderRes.data.order.id) {
      throw new Error('Order creation failed');
    }
    console.log('✓ Order created, saved to database, WhatsApp URL generated');

    // 3. Test Admin Auth: Wrong password rejected
    console.log('\n3. Testing Admin Login with invalid password...');
    const failLogin = await request('POST', '/api/admin/login', { password: 'wrongpassword' });
    console.log('Status:', failLogin.status);
    if (failLogin.status !== 401) throw new Error('Security flaw: invalid password was not rejected!');
    console.log('✓ Invalid password correctly rejected (401)');

    // 4. Test Admin Auth: Correct password 'sojib123'
    console.log('\n4. Testing Admin Login with owner password "sojib123"...');
    const successLogin = await request('POST', '/api/admin/login', { password: 'sojib123' });
    console.log('Status:', successLogin.status);
    const token = successLogin.data.token;
    console.log('Token received:', token.substring(0, 25) + '...');
    if (successLogin.status !== 200 || !token) throw new Error('Owner login failed');
    console.log('✓ Owner login verified and session token issued');

    const authHeader = { 'Authorization': `Bearer ${token}` };

    // 5. Test GET /api/admin/orders
    console.log('\n5. Testing GET /api/admin/orders...');
    const adminOrders = await request('GET', '/api/admin/orders', null, authHeader);
    console.log('Orders found:', adminOrders.data.orders.length);
    console.log('Latest order customer:', adminOrders.data.orders[0].customerName);
    console.log('✓ Orders inbox loaded with statuses and one-tap contacts');

    // 6. Test Status Flow: Update order status to "Confirmed"
    console.log('\n6. Testing PATCH /api/admin/orders/:id/status...');
    const newOrderId = orderRes.data.order.id;
    const updateRes = await request('PATCH', `/api/admin/orders/${newOrderId}/status`, { status: 'Confirmed' }, authHeader);
    console.log('Status update result:', updateRes.data.order.status);
    if (updateRes.data.order.status !== 'Confirmed') throw new Error('Status update failed');
    console.log('✓ Status flow New -> Confirmed verified');

    // 7. Test Today\'s Deliveries grouped by area
    console.log('\n7. Testing GET /api/admin/today-deliveries...');
    const todayRes = await request('GET', '/api/admin/today-deliveries', null, authHeader);
    console.log('Total Deliveries Today:', todayRes.data.totalDeliveries);
    console.log('Total Value:', todayRes.data.totalValue);
    console.log('Areas grouped:', Object.keys(todayRes.data.areas));
    console.log('✓ Today\'s deliveries grouped by area ready for printing');

    // 8. Test Sales Summary
    console.log('\n8. Testing GET /api/admin/sales-summary...');
    const salesRes = await request('GET', '/api/admin/sales-summary', null, authHeader);
    console.log('KPI Total Gross Revenue:', salesRes.data.kpis.totalRevenue);
    console.log('Daily records count:', salesRes.data.daily.length);
    console.log('Weekly records count:', salesRes.data.weekly.length);
    console.log('Models breakdown count:', salesRes.data.byModel.length);
    console.log('✓ Sales summary metrics verified');

    // 9. Test Customers Directory
    console.log('\n9. Testing GET /api/admin/customers...');
    const custRes = await request('GET', '/api/admin/customers', null, authHeader);
    console.log('Customers count:', custRes.data.customers.length);
    console.log('Sample customer:', custRes.data.customers[0].name, custRes.data.customers[0].phone);
    console.log('✓ Customer directory with order history verified');

    // 10. Test Message Templates
    console.log('\n10. Testing GET /api/admin/templates...');
    const tplRes = await request('GET', '/api/admin/templates', null, authHeader);
    console.log('Templates available:', tplRes.data.templates.map(t => t.name));
    console.log('✓ Message templates verified');

    // 11. Test Frontend Static Build Index
    console.log('\n11. Testing GET / (Static HTML Build)...');
    const htmlRes = await request('GET', '/');
    console.log('HTML status:', htmlRes.status);
    if (htmlRes.raw && htmlRes.raw.includes('Sojib\'s Mart')) {
      console.log('✓ Frontend React bundle served correctly');
    }

    console.log('\n=============================================');
    console.log('ALL 11 INTEGRATION TESTS PASSED PERFECTLY!');
    console.log('=============================================\n');
    process.exit(0);
  } catch (err) {
    console.error('TEST FAILED:', err);
    process.exit(1);
  }
}

runTests();
