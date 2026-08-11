import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://rimujcdpujtaiywmtnmq.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpbXVqY2RwdWp0YWl5d210bm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNzA0MzAsImV4cCI6MjEwMTk0NjQzMH0._v7xtjgQwPvILR8h32BayB_sLKlSQEJx4QadNAhGKzY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Curated high quality vintage stock images per category
const EXTRA_IMAGES = {
  jeans: [
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&auto=format&fit=crop&q=80'
  ],
  shoes: [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80'
  ],
  bags: [
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&auto=format&fit=crop&q=80'
  ],
  dresses: [
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&auto=format&fit=crop&q=80'
  ],
  tops: [
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80'
  ],
  accessories: [
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611591475878-0cf75037d800?w=800&auto=format&fit=crop&q=80'
  ]
};

async function main() {
  console.log('Fetching products...');
  const { data: products, error } = await supabase.from('products').select('id, name, category, images');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Found ${products.length} products.`);
  let updatedCount = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const catImages = EXTRA_IMAGES[p.category] || EXTRA_IMAGES.tops;
    
    // Pick 1 or 2 extra images from category pool based on index
    const extraImg1 = catImages[i % catImages.length];
    const extraImg2 = catImages[(i + 2) % catImages.length];

    const currentImages = p.images || [];
    const newImages = [...currentImages];
    if (!newImages.includes(extraImg1)) newImages.push(extraImg1);
    if (!newImages.includes(extraImg2) && extraImg2 !== extraImg1) newImages.push(extraImg2);

    const { error: updateErr } = await supabase
      .from('products')
      .update({ images: newImages })
      .eq('id', p.id);

    if (updateErr) {
      console.error(`Failed to update ${p.id}:`, updateErr);
    } else {
      updatedCount++;
    }
  }

  console.log(`Successfully enriched ${updatedCount} products with multiple images!`);
}

main();
