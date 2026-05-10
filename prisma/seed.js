const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const cities = [
  { cityName: 'Paris', countryName: 'France', region: 'Île-de-France', description: 'The City of Light, famous for the Eiffel Tower, world-class cuisine, and romantic ambiance.', costIndex: 85.5, popularityScore: 98.0, imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', latitude: 48.8566, longitude: 2.3522 },
  { cityName: 'Tokyo', countryName: 'Japan', region: 'Kanto', description: 'A dazzling blend of ultramodern and traditional, from neon-lit skyscrapers to historic temples.', costIndex: 75.0, popularityScore: 97.5, imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', latitude: 35.6762, longitude: 139.6503 },
  { cityName: 'New York', countryName: 'USA', region: 'Northeast', description: 'The city that never sleeps — iconic skylines, Broadway shows, and world-class museums.', costIndex: 90.0, popularityScore: 96.8, imageUrl: 'https://images.unsplash.com/photo-1538970272646-f61fabb3bfb2?w=800', latitude: 40.7128, longitude: -74.0060 },
  { cityName: 'Bali', countryName: 'Indonesia', region: 'Bali', description: 'Tropical paradise with terraced rice paddies, Hindu temples, and pristine beaches.', costIndex: 35.0, popularityScore: 95.2, imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', latitude: -8.3405, longitude: 115.0920 },
  { cityName: 'Rome', countryName: 'Italy', region: 'Lazio', description: 'The Eternal City, overflowing with ancient ruins, Renaissance art, and exquisite pasta.', costIndex: 70.0, popularityScore: 94.8, imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', latitude: 41.9028, longitude: 12.4964 },
  { cityName: 'Barcelona', countryName: 'Spain', region: 'Catalonia', description: 'Gaudí architecture, vibrant nightlife, stunning beaches, and world-famous tapas.', costIndex: 65.0, popularityScore: 93.5, imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800', latitude: 41.3851, longitude: 2.1734 },
  { cityName: 'Santorini', countryName: 'Greece', region: 'South Aegean', description: 'Iconic white-washed buildings with blue domes overlooking the stunning Aegean caldera.', costIndex: 80.0, popularityScore: 92.0, imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', latitude: 36.3932, longitude: 25.4615 },
  { cityName: 'Dubai', countryName: 'UAE', region: 'Dubai', description: 'Futuristic skyline, luxury shopping, and record-breaking architecture in the Arabian desert.', costIndex: 88.0, popularityScore: 91.5, imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', latitude: 25.2048, longitude: 55.2708 },
  { cityName: 'Kyoto', countryName: 'Japan', region: 'Kansai', description: 'Japan\'s cultural heart with thousands of classical Buddhist temples, gardens, and geisha districts.', costIndex: 65.0, popularityScore: 90.8, imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', latitude: 35.0116, longitude: 135.7681 },
  { cityName: 'Cape Town', countryName: 'South Africa', region: 'Western Cape', description: 'Dramatic Table Mountain backdrop, stunning beaches, world-class wine, and vibrant culture.', costIndex: 45.0, popularityScore: 89.5, imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800', latitude: -33.9249, longitude: 18.4241 },
];

const activitiesData = {
  Paris: [
    { title: 'Eiffel Tower Visit', category: 'Sightseeing', durationHours: 3, estimatedCost: 35, rating: 4.8, description: 'Iconic iron lattice tower on the Champ de Mars. Visit the summit for breathtaking city views.', imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400' },
    { title: 'Louvre Museum Tour', category: 'Culture', durationHours: 4, estimatedCost: 22, rating: 4.9, description: 'World\'s largest art museum home to the Mona Lisa and thousands of other masterpieces.', imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400' },
    { title: 'Seine River Cruise', category: 'Experience', durationHours: 1.5, estimatedCost: 18, rating: 4.6, description: 'Scenic boat ride along the Seine passing Notre-Dame, the Eiffel Tower, and more.', imageUrl: 'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?w=400' },
  ],
  Tokyo: [
    { title: 'Shibuya Crossing Experience', category: 'Sightseeing', durationHours: 1, estimatedCost: 0, rating: 4.7, description: 'The world\'s busiest pedestrian crossing — a must-see Tokyo spectacle.', imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400' },
    { title: 'Tsukiji Outer Market Food Tour', category: 'Food', durationHours: 2, estimatedCost: 40, rating: 4.8, description: 'Sample fresh sushi, tamagoyaki, and Japanese street food at the famous market.', imageUrl: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400' },
    { title: 'Mount Fuji Day Trip', category: 'Nature', durationHours: 10, estimatedCost: 80, rating: 4.9, description: 'Day trip to Japan\'s iconic sacred volcano with stunning panoramic views.', imageUrl: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400' },
  ],
  Bali: [
    { title: 'Ubud Monkey Forest', category: 'Nature', durationHours: 2, estimatedCost: 5, rating: 4.5, description: 'Sacred forest sanctuary home to over 700 Balinese long-tailed monkeys.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { title: 'Tegalalang Rice Terrace', category: 'Nature', durationHours: 2.5, estimatedCost: 3, rating: 4.7, description: 'Stunning UNESCO-listed terraced rice paddies with beautiful green landscapes.', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' },
    { title: 'Tanah Lot Temple Sunset', category: 'Culture', durationHours: 3, estimatedCost: 8, rating: 4.8, description: 'Iconic sea temple perched on a rocky outcrop — spectacular at sunset.', imageUrl: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400' },
  ],
};

async function main() {
  console.log('🌱 Starting database seed...');

  // Create cities
  const createdCities = {};
  for (const city of cities) {
    const created = await prisma.city.upsert({
      where: { id: (await prisma.city.findFirst({ where: { cityName: city.cityName, countryName: city.countryName } }))?.id || '00000000-0000-0000-0000-000000000000' },
      update: city,
      create: city,
    });
    createdCities[city.cityName] = created;
    console.log(`  ✅ City: ${city.cityName}`);
  }

  // Create activities for cities
  for (const [cityName, acts] of Object.entries(activitiesData)) {
    const city = createdCities[cityName];
    if (!city) continue;
    for (const act of acts) {
      await prisma.activity.create({ data: { cityId: city.id, ...act } });
    }
    console.log(`  🎯 Activities added for ${cityName}`);
  }

  // Create demo admin user
  const passwordHash = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@traveloop.com' },
    update: {},
    create: {
      fullName: 'Traveloop Admin',
      email: 'admin@traveloop.com',
      passwordHash,
      bio: 'Platform administrator and travel enthusiast.',
      isAdmin: true,
      isVerified: true,
    },
  });
  console.log(`  👤 Admin user: admin@traveloop.com / admin123`);

  // Create demo regular user
  const demoHash = await bcrypt.hash('demo123', 12);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@traveloop.com' },
    update: {},
    create: {
      fullName: 'Alex Traveler',
      email: 'demo@traveloop.com',
      passwordHash: demoHash,
      bio: 'Adventure seeker exploring the world one city at a time.',
      isVerified: true,
    },
  });
  console.log(`  👤 Demo user: demo@traveloop.com / demo123`);

  // Create sample trip
  const sampleTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      title: 'European Summer Adventure',
      description: 'A beautiful journey through the heart of Europe visiting iconic cities.',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-07-21'),
      visibility: 'public',
      totalEstimatedBudget: 3500,
      coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    },
  });

  // Add stops
  const parisStop = await prisma.tripStop.create({
    data: { tripId: sampleTrip.id, cityId: createdCities['Paris'].id, arrivalDate: new Date('2024-07-01'), departureDate: new Date('2024-07-07'), stopOrder: 1, notes: 'Start with Paris — 6 amazing days!' },
  });
  const romeStop = await prisma.tripStop.create({
    data: { tripId: sampleTrip.id, cityId: createdCities['Rome'].id, arrivalDate: new Date('2024-07-07'), departureDate: new Date('2024-07-14'), stopOrder: 2, notes: 'Rome next — history and food!' },
  });

  // Add budgets
  await prisma.budget.createMany({
    data: [
      { tripId: sampleTrip.id, category: 'Accommodation', amount: 1200, description: 'Hotels for 20 nights' },
      { tripId: sampleTrip.id, category: 'Food & Dining', amount: 800, description: 'Meals and restaurant experiences' },
      { tripId: sampleTrip.id, category: 'Transport', amount: 600, description: 'Flights, trains, and local transport' },
      { tripId: sampleTrip.id, category: 'Activities', amount: 500, description: 'Tours, museums, and experiences' },
      { tripId: sampleTrip.id, category: 'Shopping', amount: 400, description: 'Souvenirs and shopping' },
    ],
  });

  // Add packing items
  await prisma.packingItem.createMany({
    data: [
      { tripId: sampleTrip.id, itemName: 'Passport', category: 'Documents', isPacked: true },
      { tripId: sampleTrip.id, itemName: 'Travel Insurance', category: 'Documents', isPacked: true },
      { tripId: sampleTrip.id, itemName: 'Comfortable Walking Shoes', category: 'Clothing', isPacked: false },
      { tripId: sampleTrip.id, itemName: 'Sunscreen SPF 50', category: 'Health', isPacked: false },
      { tripId: sampleTrip.id, itemName: 'Universal Power Adapter', category: 'Electronics', isPacked: true },
      { tripId: sampleTrip.id, itemName: 'Camera', category: 'Electronics', isPacked: false },
    ],
  });

  console.log(`  ✈️  Sample trip created: "European Summer Adventure"`);
  console.log('\n🎉 Seed completed successfully!\n');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
