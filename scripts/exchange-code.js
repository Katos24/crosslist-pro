const axios = require('axios');
require('dotenv').config({ path: '.env' });

const code = 'v^1.1#i^1#p^3#I^3#f^0#r^1#t^Ul41XzU6MDA1ODJBMDQzMTUwQTU1NDJBRkY1NkQ1NjNCODlDOEFfMV8xI0VeMjYw';
const userId = 'cmj8tk17w0000qw2m3ryr22o3';

async function exchangeCode() {
  try {
    const authString = Buffer.from(
      `${process.env.EBAY_APP_ID}:${process.env.EBAY_CERT_ID}`
    ).toString('base64');

    console.log('🔑 Exchanging code for token...');

    const response = await axios.post(
      'https://api.ebay.com/identity/v1/oauth2/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.EBAY_RUNAME
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authString}`
        }
      }
    );

    console.log('✅ Got tokens!');
    console.log('Access Token:', response.data.access_token.substring(0, 20) + '...');
    console.log('Expires in:', response.data.expires_in, 'seconds');

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    await prisma.user.update({
      where: { id: userId },
      data: {
        ebayToken: response.data.access_token,
        ebayRefreshToken: response.data.refresh_token
      }
    });

    console.log('✅ Token saved to database!');
    console.log('🎉 You are now connected to eBay!');
    console.log('Go to your dashboard and try creating a listing!');

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

exchangeCode();
