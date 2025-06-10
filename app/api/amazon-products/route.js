import { getProducts } from '../../../data/products.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const start = parseInt(searchParams.get('start')) || 1;
  const count = parseInt(searchParams.get('count')) || 12;

  try {
    const products = getProducts(start, count);
    
    return Response.json({
      products,
      hasMore: true, // Since we repeat products, there's always more
      total: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
