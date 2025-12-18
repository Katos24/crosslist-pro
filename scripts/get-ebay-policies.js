const axios = require('axios');
require('dotenv').config({ path: '.env' });

async function getPolicies() {
  try {
    console.log('🔑 Getting OAuth token...');
    const authString = Buffer.from(`${process.env.EBAY_APP_ID}:${process.env.EBAY_CERT_ID}`).toString('base64');
    
    const tokenResponse = await axios.post(
      'https://api.ebay.com/identity/v1/oauth2/token',
      'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope/sell.inventory',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authString}`
        }
      }
    );
    
    const token = tokenResponse.data.access_token;
    console.log('✅ Got token!\n');

    console.log('📦 FULFILLMENT POLICIES:');
    const fulfillment = await axios.get(
      'https://api.ebay.com/sell/account/v1/fulfillment_policy?marketplace_id=EBAY_US',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (fulfillment.data.fulfillmentPolicies) {
      fulfillment.data.fulfillmentPolicies.forEach(p => {
        console.log(`  ${p.name}: ${p.fulfillmentPolicyId}`);
      });
    } else {
      console.log('  No fulfillment policies found');
    }

    console.log('\n💳 PAYMENT POLICIES:');
    const payment = await axios.get(
      'https://api.ebay.com/sell/account/v1/payment_policy?marketplace_id=EBAY_US',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (payment.data.paymentPolicies) {
      payment.data.paymentPolicies.forEach(p => {
        console.log(`  ${p.name}: ${p.paymentPolicyId}`);
      });
    } else {
      console.log('  No payment policies found');
    }

    console.log('\n🔄 RETURN POLICIES:');
    const returns = await axios.get(
      'https://api.ebay.com/sell/account/v1/return_policy?marketplace_id=EBAY_US',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (returns.data.returnPolicies) {
      returns.data.returnPolicies.forEach(p => {
        console.log(`  ${p.name}: ${p.returnPolicyId}`);
      });
    } else {
      console.log('  No return policies found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

getPolicies();
