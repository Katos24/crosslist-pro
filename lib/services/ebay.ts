import axios from 'axios';

interface ListingData {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  quantity?: number;
}

export async function postToEbay(listing: ListingData, userToken: string) {
  try {
    console.log('🛒 Posting to eBay with user token...');
    
    const sku = `ITEM-${Date.now()}`;

    // Step 1: Create inventory item
    console.log('Creating inventory item...');
    await axios.put(
      `https://api.ebay.com/sell/inventory/v1/inventory_item/${sku}`,
      {
        availability: {
          shipToLocationAvailability: {
            quantity: listing.quantity || 1
          }
        },
        condition: mapCondition(listing.condition),
        product: {
          title: listing.title.substring(0, 80),
          description: listing.description,
          imageUrls: listing.images.slice(0, 12).filter(img => img.startsWith('http')),
          aspects: {
            Brand: ['Unbranded']
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
          'Content-Language': 'en-US'
        }
      }
    );

    console.log('✅ Inventory item created');

    // Step 2: Create offer
    console.log('Creating offer...');
    const offerResponse = await axios.post(
      'https://api.ebay.com/sell/inventory/v1/offer',
      {
        sku,
        marketplaceId: 'EBAY_US',
        format: 'FIXED_PRICE',
        availableQuantity: listing.quantity || 1,
        categoryId: getEbayCategoryId(listing.category),
        listingDescription: listing.description,
        listingPolicies: {
          fulfillmentPolicyId: process.env.EBAY_FULFILLMENT_POLICY_ID,
          paymentPolicyId: process.env.EBAY_PAYMENT_POLICY_ID,
          returnPolicyId: process.env.EBAY_RETURN_POLICY_ID
        },
        pricingSummary: {
          price: {
            value: listing.price.toFixed(2),
            currency: 'USD'
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
          'Content-Language': 'en-US'
        }
      }
    );

    const offerId = offerResponse.data.offerId;
    console.log('✅ Offer created:', offerId);

    // Step 3: Publish offer
    console.log('Publishing offer...');
    const publishResponse = await axios.post(
      `https://api.ebay.com/sell/inventory/v1/offer/${offerId}/publish`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const listingId = publishResponse.data.listingId;
    console.log('✅ Published! Listing ID:', listingId);

    return {
      success: true,
      ebayId: listingId,
      ebayUrl: `https://www.ebay.com/itm/${listingId}`,
      message: 'Successfully posted to eBay!'
    };

  } catch (error: any) {
    console.error('❌ eBay posting error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    throw new Error(`Failed to post to eBay: ${error.message}`);
  }
}

function mapCondition(condition: string): string {
  const map: { [key: string]: string } = {
    'NEW': 'NEW',
    'LIKE_NEW': 'LIKE_NEW',
    'USED_EXCELLENT': 'USED_EXCELLENT',
    'USED_GOOD': 'USED_GOOD'
  };
  return map[condition] || 'USED_EXCELLENT';
}

function getEbayCategoryId(category: string): string {
  const categories: { [key: string]: string } = {
    '11450': '11450',
    '293': '293',
    '33034': '33034',
    '619': '619',
    '63889': '63889',
    '220': '220',
    '99': '99'
  };
  return categories[category] || '99';
}
