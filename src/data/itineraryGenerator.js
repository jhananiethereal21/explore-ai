// Built-in intelligent fallback itinerary generator for EXPLORE AI
// Generates realistic, tailored day-by-day itineraries and INR budget breakdowns
// without requiring an active Gemini API key. Clearly labeled as demo content.

const DESTINATION_DAY_TEMPLATES = {
  jaipur: [
    {
      title: 'Royal Arrival & Pink City Heritage Walk',
      morning: 'Arrive in Jaipur and settle in. Start with a walking exploration of the walled Pink City, visiting the stunning facade of Hawa Mahal at morning golden hour.',
      afternoon: 'Explore the City Palace royal complex and courtyard of peacock gates. Walk next door to Jantar Mantar observatory.',
      evening: 'Watch the sunset over Nahargarh Fort ramparts overlooking the illuminated city. Dinner with Pyaaz Kachori and Dal Baati Churma.',
      tip: 'Get the composite ticket at the first monument to skip ticket queues at subsequent sites.'
    },
    {
      title: 'Majestic Amber Fort & Stepwell Architecture',
      morning: 'Early morning excursion to Amber Fort before tour buses arrive. Walk through the Sheesh Mahal (Mirror Palace) and royal pavilions.',
      afternoon: 'Stop by the ancient Panna Meena Ka Kund stepwell for architectural photography, followed by the water palace Jal Mahal viewpoint.',
      evening: 'Browse traditional handcrafted textiles, blue pottery, and jewelry in Bapu Bazaar and Johari Bazaar. Friendly polite haggling is customary.',
      tip: 'Government emporiums provide fixed-price baselines before bargaining in street markets.'
    },
    {
      title: 'Artisan Traditions & Jaigarh Fort Cannon',
      morning: 'Drive up to Jaigarh Fort to view Jaivana, once the world’s largest wheeled cannon, and take in the panoramic Aravalli mountain views.',
      afternoon: 'Take a cultural excursion to Sanganer or Bagru village to witness live wooden block printing and indigo dyeing techniques.',
      evening: 'Relax at a quiet heritage haveli rooftop cafe with Rajasthani folk music and saffron lassi.',
      tip: 'Carry cash for rural artisan cooperatives as UPI connectivity can sometimes be spotty.'
    },
    {
      title: 'Hidden Haveli Trails & Albert Hall Museum',
      morning: 'Explore the Albert Hall Museum with its rare Indo-Saracenic design and historical armor collections.',
      afternoon: 'Wander through the tranquil Sisodia Rani Bagh garden pavilions or visit Galta Ji (the Monkey Temple) nestled in the mountain pass.',
      evening: 'Farewell sunset rooftop dinner with traditional Ghewar dessert.',
      tip: 'Wear shoes that slip off easily for temple visits.'
    }
  ],
  varanasi: [
    {
      title: 'Sacred Ganga Dawn & Timeless Ghats',
      morning: 'Pre-dawn hand-rowed wooden boat glide on the holy river Ganga from Assi Ghat to Dashashwamedh as sunrise illuminates the historic sandstone steps.',
      afternoon: 'Explore the winding labyrinth alleys (galis) behind the ghats, visiting centuries-old silk weaving lofts and historic shrines.',
      evening: 'Witness the grand Maha Ganga Aarti ceremony at Dashashwamedh Ghat from the stone steps or a shared wooden boat.',
      tip: 'Arrive at the Aarti ghat by 5:15 PM to secure front-row step seating.'
    },
    {
      title: 'Buddhist Pilgrimage of Sarnath & Weavers Quarters',
      morning: 'Excursion to peaceful Sarnath (10km), where Gautama Buddha delivered his first sermon. Visit Dhamek Stupa and the Archaeological Museum holding the Ashoka Lion Capital.',
      afternoon: 'Visit the authentic handloom weavers of Madanpura to learn about authentic Banarasi silk brocades directly from craft families.',
      evening: 'Savor traditional Tamatar Chaat at Kashi Chaat Bhandar and chilled saffron Malaiyo frothy milk dessert.',
      tip: 'Do not follow unauthorized touts claiming to offer "government factory" silk tours.'
    },
    {
      title: 'Heritage Universities & Spiritual Serenity',
      morning: 'Visit the green sprawling campus of Banaras Hindu University (BHU) and the serene New Vishwanath Temple.',
      afternoon: 'Stroll along the southern quiet ghats like Chet Singh Ghat and Tulsi Ghat, observing traditional wrestling akharas.',
      evening: 'Attend peaceful evening musical prayers at Assi Ghat accompanied by classical sitar and tabla recitals.',
      tip: 'Keep your smartphone and camera put away around cremation ghats out of religious respect.'
    }
  ],
  alleppey: [
    {
      title: 'Backwater Welcome & Shikara Serenade',
      morning: 'Arrive in Alleppey and board a morning non-motorized Shikara boat to glide through small, lush village canals fringed with coconut palms.',
      afternoon: 'Check into your waterfront homestay or eco-resort. Savor an authentic Kerala banana leaf Sadya lunch with red rice and avial.',
      evening: 'Stroll along the historic Alleppey Beach pier and lighthouse for a peaceful sunset over the Arabian Sea.',
      tip: 'Shikara boats can access narrow village channels that large houseboats cannot navigate.'
    },
    {
      title: 'Houseboat Lagoon Cruise & Village Life',
      morning: 'Board a traditional wooden Kettuvallam houseboat cruise along Vembanad Lake and the Kuttanad farming waterways.',
      afternoon: 'Enjoy freshly prepared Karimeen Pollichathu (pearl spot fish in banana leaf) cooked on board by your houseboat chef.',
      evening: 'Moor alongside peaceful village canals at dusk; observe local coir making and duck farmers heading home.',
      tip: 'Ensure your houseboat operators follow eco-guidelines and avoid discarding plastics in backwaters.'
    },
    {
      title: 'Marari Beach Relaxation & Coastal Culture',
      morning: 'Short morning ride to Marari Beach. Walk along pristine soft golden sands and meet local fishermen returning with morning catch.',
      afternoon: 'Experience a rejuvenating traditional Ayurvedic massage at a certified local coastal wellness center.',
      evening: 'Dine at a beachside shack with fresh grilled seafood and tender coconut water.',
      tip: 'Confirm government certification for Ayurvedic therapy centers.'
    }
  ],
  ladakh: [
    {
      title: 'Acclimatization & Gentle Leh Old Town Walk',
      morning: 'Land at Leh Airport (3,500m). Check into hotel and strictly REST for the first 24 hours to adapt to high altitude. Hydrate with warm water and garlic soup.',
      afternoon: 'Gentle late-afternoon stroll to Leh Main Bazaar and Central Asian Museum. No strenuous climbing.',
      evening: 'Watch the sunset glow from the flat terrace of your homestay. Early night sleep to let your body adjust.',
      tip: 'Avoid alcohol and caffeine for the first 48 hours; drink minimum 3.5 liters of water daily.'
    },
    {
      title: 'Cliffside Monasteries & Royal Heritage',
      morning: 'Early morning prayers at Thiksey Monastery, with its remarkable twelve-story complex resembling Lhasa’s Potala Palace.',
      afternoon: 'Visit the historic Shey Palace and the peaceful riverside gardens of Sindhu Darshan.',
      evening: 'Climb slowly to Shanti Stupa for sweeping 360-degree views over the Indus Valley and snowcapped Stok Kangri range.',
      tip: 'Always walk clockwise around Buddhist stupas and prayer wheels.'
    },
    {
      title: 'Khardung La & Dramatic Nubra Valley',
      morning: 'Scenic high-altitude drive across Khardung La pass (5,359m). Quick photo stop at the pass then descend into Nubra Valley.',
      afternoon: 'Visit the towering 32-meter Maitreya Buddha statue at Diskit Monastery overlooking the valley floor.',
      evening: 'Sunset walk among the silver sand dunes of Hunder; observe the rare double-humped Bactrian camels.',
      tip: 'Do not stay more than 15 minutes at Khardung La top to prevent sudden altitude nausea.'
    },
    {
      title: 'Pangong Tso Color-Shifting Waters',
      morning: 'Drive via the scenic Shyok river route towards the legendary Pangong Tso Lake (4,225m).',
      afternoon: 'Reach the shimmering saltwater lake, marveling at the shifting turquoise, cobalt, and emerald water hues.',
      evening: 'Stargaze under some of the clearest, unpolluted night skies in Asia. Warm dinner with hot Thukpa noodle soup.',
      tip: 'Temperatures drop below freezing at night even in summer; pack thermal layers.'
    }
  ],
  goa: [
    {
      title: 'South Goa Serenity & Crescent Bay',
      morning: 'Arrive and settle into your beachside cottage near Palolem or Agonda. Enjoy a relaxed breakfast with fresh tropical fruits.',
      afternoon: 'Swim in the calm crescent waters of Palolem Beach or take a short paddle boat around Green Island.',
      evening: 'Sunset drinks at a beach shack with Goan fish curry rice and live acoustic music by the sea.',
      tip: 'Palolem waters are sheltered and significantly calmer for swimming than open northern beaches.'
    },
    {
      title: 'Hidden Lagoons & Cliff Fort Explorations',
      morning: 'Rent a scooter to explore the scenic secluded Cola Beach, where a freshwater river meets the sea in a picturesque palm lagoon.',
      afternoon: 'Ride up to the historic clifftop ramparts of Cabo de Rama Fort with sweeping ocean vistas.',
      evening: 'Dinner at a heritage Goan-Portuguese restaurant trying dishes like Mushroom Xacuti and Bebinca.',
      tip: 'Wear a helmet and carry a physical driving license when riding rented two-wheelers.'
    },
    {
      title: 'Spice Plantations & Latin Quarter Charm',
      morning: 'Excursion to an organic spice plantation in Ponda: walk among cinnamon, cardamom, and vanilla plantations followed by a traditional buffet on banana leaves.',
      afternoon: 'Walk the vibrant heritage alleys of Fontainhas in Panaji, admiring colorful Portuguese colonial villas and azulejo tiles.',
      evening: 'Sunset stroll along Miramar Beach and shopping for Goan cashew nuts and feni.',
      tip: 'Respect residential privacy in the Fontainhas historic quarter.'
    }
  ],
  rishikesh: [
    {
      title: 'River Sanctuary Arrival & Sunset Aarti',
      morning: 'Arrive in Rishikesh and settle in Tapovan or Swarg Ashram. Walk across the iconic suspension bridges overlooking the emerald Ganga.',
      afternoon: 'Visit the peaceful Beatles Ashram (Chaurasi Kutia) to explore meditation caves covered in vibrant murals.',
      evening: 'Gather at Parmarth Niketan for the world-renowned sunset Ganga Aarti with devotional chants and floating oil lamps.',
      tip: 'Cross the river by pedestrian bridges or government ferry; avoid auto-rickshaw traffic jams during aarti hours.'
    },
    {
      title: 'Ganga White-Water Rafting & Cliff Adventure',
      morning: 'Gear up with certified instructors for a thrilling 16km white-water rafting expedition from Shivpuri down to Rishikesh through rapids like Roller Coaster and Golf Course.',
      afternoon: 'Post-rafting wholesome lunch at an organic cafe in Tapovan with cold-pressed juices and wood-fired flatbreads.',
      evening: 'Drop-in evening sound healing or restorative yoga meditation session.',
      tip: 'Wear water shoes and secure eyeglasses with a strap during white-water rafting.'
    },
    {
      title: 'Himalayan Sunrise & Secret Waterfalls',
      morning: 'Pre-dawn drive to Kunjapuri Temple (1,650m) for an awe-inspiring sunrise over snowcapped Himalayan peaks.',
      afternoon: 'Gentle hike down through pine forests visiting Neer Garh waterfall for a refreshing mountain stream dip.',
      evening: 'Relax by the tranquil ghats with Ginger Lemon Honey tea and Ayurvedic dinner.',
      tip: 'Bring light woolens for the early morning Kunjapuri mountain sunrise.'
    }
  ],
  udaipur: [
    {
      title: 'Lake Pichola Splendor & Royal Courtyards',
      morning: 'Morning walk around Jagdish Chowk before entering the City Palace complex to view mirrored courtyards and marble galleries.',
      afternoon: 'Embark on a scenic boat cruise on Lake Pichola gliding past Taj Lake Palace and Jag Mandir island.',
      evening: 'Attend the vibrant Dharohar Rajasthani folk dance and puppet spectacle at Bagore Ki Haveli courtyard.',
      tip: 'Book the 4:45 PM public boat from Rameshwar Ghat for golden hour lighting on the marble palaces.'
    },
    {
      title: 'Monsoon Palace & Artisan Heritage',
      morning: 'Ascend to Sajjangarh (Monsoon Palace) perched atop Bansdara mountain for panoramic views over the Aravalli hills.',
      afternoon: 'Stroll along the historic fountains of Saheliyon Ki Bari and explore miniature Rajasthani painting workshops.',
      evening: 'Lakeside dinner at Ambrai Ghat with illuminated views of City Palace across water.',
      tip: 'Pre-agree on return auto fares when visiting Sajjangarh, as empty autos are rare on the hill top.'
    }
  ],
  manali: [
    {
      title: 'Solang Valley Thrills & Old Manali Vibe',
      morning: 'Morning excursion to Solang Valley for paragliding, zorbing, or cable car ropeway rides with alpine snow peak backdrops.',
      afternoon: 'Walk among giant deodar cedar trees to Hadimba Devi wooden pagoda temple and Manu Temple.',
      evening: 'Explore riverside boho cafes in Old Manali featuring live acoustic indie music and local cider.',
      tip: 'Leave for Solang by 8:30 AM to beat peak holiday tourist traffic.'
    },
    {
      title: 'Atal Tunnel Drive & Sissu Waterfalls',
      morning: 'Drive through the marvel of engineering Atal Tunnel (9.02 km) emerging into the rugged Lahaul Valley.',
      afternoon: 'Walk up to Sissu waterfall and relax by the glacial Chandra River with hot bowls of Maggi and Himalayan tea.',
      evening: 'Dip in natural sulfur medicinal hot springs at Vashisht village before a dinner of traditional steamed Siddu.',
      tip: 'Check weather reports for snow chains requirements before high valley drives.'
    }
  ],
  hampi: [
    {
      title: 'Stone Chariot & Sacred Vijayanagara Centers',
      morning: 'Sunrise hike up Matanga Hill for a breath-taking 360-degree panorama over the surreal granite boulder landscape.',
      afternoon: 'Explore Vittala Temple complex, marveling at the iconic stone chariot and musical pillars.',
      evening: 'Cross the Tungabhadra River in a circular woven coracle boat; watch the sunset over Sanapur Lake.',
      tip: 'Wear shoes with good rubber traction for walking on sun-warmed granite rocks.'
    },
    {
      title: 'Royal Enclosure & Riverside Monoliths',
      morning: 'Cycle through the Royal Enclosure visiting the Queen’s Bath, Lotus Mahal, and the grand Elephant Stables.',
      afternoon: 'Receive a temple elephant blessing at Virupaksha Temple and explore the giant monolithic Lakshmi Narasimha statue.',
      evening: 'Relax at riverside cafes across the river with banana leaf South Indian thalis.',
      tip: 'Carry plenty of hydration as shade is scarce across the expansive ruins.'
    }
  ],
  munnar: [
    {
      title: 'Emerald Tea Carpets & Kolukkumalai Heights',
      morning: 'Early morning 4x4 jeep safari up to Kolukkumalai (world’s highest elevation tea plantation) for an unforgettable cloud-level sunrise.',
      afternoon: 'Tour the heritage KDHP Tea Museum and witness orthodox tea leaf rolling and oxidation processing.',
      evening: 'Walk around Mattupetty Dam and shout into the natural acoustic amphitheater at Echo Point.',
      tip: 'Pack light windbreakers; high plantation ridges are breezy and cool year-round.'
    },
    {
      title: 'Nilgiri Tahr Safari & Spice Gardens',
      morning: 'Safari through Eravikulam National Park to spot endangered Nilgiri Tahr mountain goats roaming wild grassy slopes.',
      afternoon: 'Walk through an organic cardamom, pepper, and vanilla spice plantation with knowledgeable local botanists.',
      evening: 'Sample Malabar parotta with vegetable stew and fresh handmade chocolates in Munnar town market.',
      tip: 'Eravikulam park requires advance time-slot booking during peak breeding season (Feb-March closures).'
    }
  ],
  amritsar: [
    {
      title: 'Golden Temple Luminous Grace & Community Kitchen',
      morning: 'Enter Sri Harmandir Sahib (Golden Temple) at dawn as morning hymns (Gurbani) resonate over the Amrit Sarovar sacred pool.',
      afternoon: 'Participate in voluntary community service (Seva) peeling garlic or washing plates in the Guru Ka Langar mega kitchen.',
      evening: 'Witness the electric patriotic lowering-of-the-flags ceremony at Attari-Wagah border (30km from city).',
      tip: 'Arrive at Wagah border by 3:30 PM with government photo ID to secure stadium seats.'
    },
    {
      title: 'Historic Valor & Punjabi Feast',
      morning: 'Walk through the solemn memorial gates of Jallianwala Bagh and explore the moving Partition Museum.',
      afternoon: 'Feast on crispy Amritsari Kulcha straight from the charcoal tandoor drenched in homemade butter at Kulcha Land.',
      evening: 'Return to the Golden Temple after dark to witness the gilded sanctum glow under night lights and the holy Palki Sahib procession.',
      tip: 'Keep your head covered with a scarf or bandana at all times inside the Gurdwara complex.'
    }
  ],
  pondicherry: [
    {
      title: 'French White Town & Rock Beach Promenade',
      morning: 'Rent a vintage bicycle to explore the tree-shaded boulevards, mustard villas, and bougainvillea of the French Quarter.',
      afternoon: 'Visit the peaceful Sri Aurobindo Ashram and browse local handmade paper and ceramic craft workshops.',
      evening: 'Walk the car-free Rock Beach promenade as sea waves crash against granite barriers; dinner at a French garden courtyard cafe.',
      tip: 'Vehicle traffic is banned on the beach road from 6:00 PM to 7:30 AM daily for pedestrians.'
    },
    {
      title: 'Auroville Matrimandir & Golden Sands',
      morning: 'Trip to universal township Auroville to view the golden spherical meditation dome Matrimandir.',
      afternoon: 'Take a surf lesson or enjoy chilled tender coconut water at Serenity Beach.',
      evening: 'Savor authentic wood-fired sourdough pizza and artisanal gelato in White Town.',
      tip: 'Inner meditation passes for Matrimandir must be booked in person or online 3–5 days ahead.'
    }
  ],
  meghalaya: [
    {
      title: 'Double Decker Living Root Bridge Expedition',
      morning: 'Hike down 3,500 stone steps through lush tropical rainforest to the ancient bio-engineered Double Decker Living Root Bridge in Nongriat.',
      afternoon: 'Swim in the natural turquoise freshwater pool below Rainbow Falls.',
      evening: 'Stay at a village homestay listening to jungle sounds and savoring traditional Khasi spiced Jadoh rice.',
      tip: 'Carry bamboo walking poles and grip hiking shoes for the stone steps trek.'
    },
    {
      title: 'Transparent River of Dawki & Cloud Waterfalls',
      morning: 'Boat ride on the glass-like transparent emerald waters of Umngot River in Dawki along the Bangladesh border.',
      afternoon: 'Stand before the roaring Nohkalikai Falls (India’s tallest plunge waterfall) and explore Mawsmai limestone cave formations.',
      evening: 'Stroll through Asia’s cleanest village Mawlynnong, admiring bamboo eco-treehouses.',
      tip: 'Visit Dawki between November and March for the crystal transparent water phenomenon.'
    }
  ],
  agra: [
    {
      title: 'Taj Mahal Sunrise & Colossal Mughal Fort',
      morning: 'Enter the Taj Mahal through the East Gate at 5:45 AM to watch the marble domes change color with the rising sun without tour crowds.',
      afternoon: 'Explore the red sandstone ramparts, Diwan-i-Khas, and Jahangir Palace inside UNESCO-listed Agra Fort.',
      evening: 'View the Taj Mahal reflection across the Yamuna River from the quiet gardens of Mehtab Bagh at sunset.',
      tip: 'Taj Mahal is closed on Fridays. No backpacks or battery chargers allowed inside.'
    }
  ],
  custom: [
    {
      title: 'Arrival & Cultural Orientation Walk',
      morning: 'Arrive at destination and check in to your accommodation. Take an unhurried morning orientation stroll through the historic town center and local market lanes.',
      afternoon: 'Savor regional culinary specialties at a popular local heritage eatery, followed by exploring prominent landmarks and architectural highlights.',
      evening: 'Catch a tranquil sunset from a popular local viewpoint or promenade. Enjoy an authentic regional dinner recommended by residents.',
      tip: 'Ask your accommodation host about verified auto tariffs or local shared transit to avoid inflated tourist fares.'
    },
    {
      title: 'Heritage Wonders & Local Artisan Trails',
      morning: 'Early morning visit to key historical monuments, temples, or nature viewpoints before the midday heat and tour crowds arrive.',
      afternoon: 'Explore local handicraft emporiums and artisan workshops. Discover regional handlooms, spices, or artwork directly from craftspeople.',
      evening: 'Relax at a quiet rooftop or courtyard cafe with regional tea/coffee while soaking in the local evening ambiance.',
      tip: 'Carry both cash and UPI, as small artisan cooperatives in regional pockets may experience intermittent mobile network coverage.'
    },
    {
      title: 'Scenic Escapes & Cultural Immersion',
      morning: 'Excursion to scenic outskirts, hidden waterfalls, or peaceful rural village trails away from main tourist corridors.',
      afternoon: 'Leisurely lunch sampling popular local street specialties and regional desserts recommended by longtime residents.',
      evening: 'Golden hour photography walk through colorful heritage alleys followed by a memorable farewell dinner.',
      tip: 'Check official visiting hours and permit guidelines with local tourism information counters in advance.'
    }
  ]
};

export function generateDemoItinerary({ destination, budget, days, interests }) {
  const cleanDestination = (destination || 'Jaipur, Rajasthan').trim();
  const normalizedDest = cleanDestination.toLowerCase();
  
  // Find key destination template or fallback to custom template
  let destKey = Object.keys(DESTINATION_DAY_TEMPLATES).find(k => k !== 'custom' && normalizedDest.includes(k));
  if (!destKey) destKey = 'custom';

  const baseDays = DESTINATION_DAY_TEMPLATES[destKey];
  const totalDays = Math.min(Math.max(parseInt(days, 10) || 3, 1), 14);
  const totalBudget = Math.max(parseInt(budget, 10) || 25000, 1000);

  // Generate day-by-day plan
  const generatedDays = [];
  for (let i = 0; i < totalDays; i++) {
    const templateIndex = i % baseDays.length;
    const baseDay = baseDays[templateIndex];
    const cycle = Math.floor(i / baseDays.length);
    
    const dayTitle = cycle === 0 
      ? baseDay.title 
      : `${baseDay.title} (Part ${cycle + 1} - Extended In-depth Exploration)`;
      
    generatedDays.push({
      day: i + 1,
      title: dayTitle,
      morning: baseDay.morning,
      afternoon: baseDay.afternoon,
      evening: baseDay.evening,
      practicalTip: baseDay.tip
    });
  }

  // Budget calculations
  const accommodationAmt = Math.round(totalBudget * 0.38);
  const foodAmt = Math.round(totalBudget * 0.25);
  const transitAmt = Math.round(totalBudget * 0.15);
  const activitiesAmt = Math.round(totalBudget * 0.12);
  const bufferAmt = Math.round(totalBudget * 0.10);

  const interestDisplay = Array.isArray(interests) && interests.length > 0 
    ? interests.join(', ') 
    : 'Curated Sightseeing, Culture & Food';

  return {
    isDemo: true,
    source: 'EXPLORE AI Smart Offline Planner (Demo Fallback)',
    destinationName: cleanDestination,
    daysCount: totalDays,
    budgetTotal: totalBudget,
    interests: interestDisplay,
    summary: `A balanced ${totalDays}-day itinerary for ${cleanDestination} optimizing your ₹${totalBudget.toLocaleString('en-IN')} budget across immersive cultural experiences, local cuisine, and mindful travel.`,
    budgetBreakdown: [
      {
        category: 'Accommodation',
        percentage: 38,
        amount: `₹${accommodationAmt.toLocaleString('en-IN')}`,
        detail: `~₹${Math.round(accommodationAmt / totalDays).toLocaleString('en-IN')} per night for well-rated boutique or heritage stays`
      },
      {
        category: 'Food & Dining',
        percentage: 25,
        amount: `₹${foodAmt.toLocaleString('en-IN')}`,
        detail: 'Daily street delicacies, heritage thalis, and local cafe meals'
      },
      {
        category: 'Local Transit',
        percentage: 15,
        amount: `₹${transitAmt.toLocaleString('en-IN')}`,
        detail: 'Pre-paid autos, e-rickshaws, shared taxis, and public transit passes'
      },
      {
        category: 'Activities & Entry Fees',
        percentage: 12,
        amount: `₹${activitiesAmt.toLocaleString('en-IN')}`,
        detail: 'Monument tickets, audio guides, boat rides, and experiences'
      },
      {
        category: 'Contingency / Buffer',
        percentage: 10,
        amount: `₹${bufferAmt.toLocaleString('en-IN')}`,
        detail: 'Reserved for unexpected travel contingencies, tips, and souvenirs'
      }
    ],
    days: generatedDays,
    disclaimer: 'Notice: This is a demo itinerary generated by the EXPLORE AI fallback engine. All costs, hours, and schedules are estimates. Always verify time-sensitive details with official monument and transportation authorities.'
  };
}
