// Test script for backend endpoints
const testEndpoints = async () => {
  const baseUrl = 'http://localhost:8080';
  const start = '2020-06-01';
  const end = '2020-07-01';

  console.log('🧪 Testing Backend Endpoints...\n');

  // Test 1: Orders Chart
  try {
    const ordersResponse = await fetch(`${baseUrl}/orders/chart?start=${start}&end=${end}`);
    console.log('📊 Orders Chart Status:', ordersResponse.status);
    if (ordersResponse.ok) {
      const data = await ordersResponse.json();
      console.log('✅ Orders Chart Data:', data.length, 'records');
    } else {
      console.log('❌ Orders Chart Error:', await ordersResponse.text());
    }
  } catch (error) {
    console.log('❌ Orders Chart Exception:', error.message);
  }

  // Test 2: KPI Data
  try {
    const kpiResponse = await fetch(`${baseUrl}/kpi?start=${start}&end=${end}`);
    console.log('📈 KPI Status:', kpiResponse.status);
    if (kpiResponse.ok) {
      const data = await kpiResponse.json();
      console.log('✅ KPI Data:', data);
    } else {
      console.log('❌ KPI Error:', await kpiResponse.text());
    }
  } catch (error) {
    console.log('❌ KPI Exception:', error.message);
  }

  // Test 3: Product Ranking
  try {
    const productResponse = await fetch(`${baseUrl}/products/ranking?start=${start}&end=${end}`);
    console.log('🏆 Product Ranking Status:', productResponse.status);
    if (productResponse.ok) {
      const data = await productResponse.json();
      console.log('✅ Product Ranking Data:', data.length, 'records');
    } else {
      console.log('❌ Product Ranking Error:', await productResponse.text());
    }
  } catch (error) {
    console.log('❌ Product Ranking Exception:', error.message);
  }

  // Test 4: Store Ranking
  try {
    const storeResponse = await fetch(`${baseUrl}/stores/ranking?start=${start}&end=${end}`);
    console.log('🏪 Store Ranking Status:', storeResponse.status);
    if (storeResponse.ok) {
      const data = await storeResponse.json();
      console.log('✅ Store Ranking Data:', data.length, 'records');
    } else {
      console.log('❌ Store Ranking Error:', await storeResponse.text());
    }
  } catch (error) {
    console.log('❌ Store Ranking Exception:', error.message);
  }

  // Test 5: Order Times
  try {
    const timesResponse = await fetch(`${baseUrl}/orders/times?start=${start}&end=${end}`);
    console.log('⏰ Order Times Status:', timesResponse.status);
    if (timesResponse.ok) {
      const data = await timesResponse.json();
      console.log('✅ Order Times Data:', data.length, 'records');
    } else {
      console.log('❌ Order Times Error:', await timesResponse.text());
    }
  } catch (error) {
    console.log('❌ Order Times Exception:', error.message);
  }
};

// Run the test
testEndpoints(); 