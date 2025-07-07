const API_BASE_URL = 'http://192.168.0.167:8080';

// Test KPI with debug output
async function testKpiDebug() {
    console.log('🔍 Testing KPI with debug output...\n');
    
    // First, get a fresh token
    let token;
    try {
        const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'test', password: 'test123' })
        });
        const loginData = await loginResponse.json();
        token = loginData.token;
        console.log('✅ Got fresh token');
    } catch (error) {
        console.log('❌ Login failed:', error.message);
        return;
    }
    
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // Test 1: No filters
    console.log('\n1️⃣ Testing with NO filters:');
    try {
        const response1 = await fetch(`${API_BASE_URL}/kpi?start=2020-01-01&end=2020-01-31`, { headers });
        const data1 = await response1.json();
        console.log('✅ No filters result:', data1);
    } catch (error) {
        console.log('❌ No filters error:', error.message);
    }

    // Test 2: With category filter
    console.log('\n2️⃣ Testing with category filter:');
    try {
        const response2 = await fetch(`${API_BASE_URL}/kpi?start=2020-01-01&end=2020-01-31&categories=Classic`, { headers });
        const data2 = await response2.json();
        console.log('✅ Category filter result:', data2);
    } catch (error) {
        console.log('❌ Category filter error:', error.message);
    }

    // Test 3: With size filter
    console.log('\n3️⃣ Testing with size filter:');
    try {
        const response3 = await fetch(`${API_BASE_URL}/kpi?start=2020-01-01&end=2020-01-31&sizes=Large`, { headers });
        const data3 = await response3.json();
        console.log('✅ Size filter result:', data3);
    } catch (error) {
        console.log('❌ Size filter error:', error.message);
    }

    // Test 4: With both category and size
    console.log('\n4️⃣ Testing with both category and size:');
    try {
        const response4 = await fetch(`${API_BASE_URL}/kpi?start=2020-01-01&end=2020-01-31&categories=Classic&sizes=Large`, { headers });
        const data4 = await response4.json();
        console.log('✅ Both filters result:', data4);
    } catch (error) {
        console.log('❌ Both filters error:', error.message);
    }
}

// Run the test
testKpiDebug().catch(console.error); 