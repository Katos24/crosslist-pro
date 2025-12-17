interface ListingData {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  quantity?: number;
}

export async function postToEbay(listing: ListingData) {
  try {
    console.log('🛒 Preparing eBay listing...');
    
    const ebayListing = {
      title: listing.title.substring(0, 80),
      description: listing.description,
      price: listing.price,
      category: getEbayCategoryId(listing.category),
      condition: mapConditionToId(listing.condition),
      images: listing.images.slice(0, 12),
      quantity: listing.quantity || 1
    };

    console.log('📦 eBay listing prepared:', ebayListing.title);
    
    // Mock response for now (until we connect real eBay API)
    const mockListingId = `EBAY-${Date.now()}`;
    
    return {
      success: true,
      ebayId: mockListingId,
      ebayUrl: `https://www.ebay.com/itm/${mockListingId}`,
      message: 'eBay listing prepared. Connect production API to post live.'
    };

  } catch (error: any) {
    console.error('❌ eBay error:', error);
    throw new Error(`Failed to prepare eBay listing: ${error.message}`);
  }
}

function getEbayCategoryId(category: string): string {
  const categories: { [key: string]: string } = {
    'Clothing': '11450',
    'Electronics': '293',
    'Guitar Parts': '33034',
    'Musical Instruments': '619',
    'Other': '99'
  };
  return categories[category] || '99';
}

function mapConditionToId(condition: string): string {
  const conditions: { [key: string]: string } = {
    'new': '1000',
    'like-new': '1500',
    'used': '3000',
    'used-fair': '4000'
  };
  return conditions[condition] || '3000';
}
