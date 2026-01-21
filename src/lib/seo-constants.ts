// src/lib/seo-constants.ts
// Centralized SEO and business data for Champions Sports Bar & Grill

export const BUSINESS_DATA = {
  // Core Identity
  name: "Champions Sports Bar & Grill",
  alternateName: "Champions Hillsboro",
  legalName: "Champions Sports Bar & Grill LLC",
  slogan: "Hillsboro's Flavor & Game Hub",

  // Location
  streetAddress: "2947 SE 73rd Ave",
  addressLocality: "Hillsboro",
  addressRegion: "OR",
  postalCode: "97123",
  addressCountry: "US",

  // Contact
  telephone: "+15037476063",
  telephoneDisplay: "(503) 747-6063",
  email: "champions.sportsbar.grill@gmail.com",

  // Geographic Coordinates
  latitude: "45.5089",
  longitude: "-122.7542",

  // Hours of Operation
  hours: {
    monday: { opens: "11:00", closes: "22:00", opensDisplay: "11 AM", closesDisplay: "10 PM" },
    tuesday: { opens: "11:00", closes: "22:00", opensDisplay: "11 AM", closesDisplay: "10 PM" },
    wednesday: { opens: "11:00", closes: "23:00", opensDisplay: "11 AM", closesDisplay: "11 PM" },
    thursday: { opens: "11:00", closes: "23:00", opensDisplay: "11 AM", closesDisplay: "11 PM" },
    friday: { opens: "11:00", closes: "00:00", opensDisplay: "11 AM", closesDisplay: "12 AM" },
    saturday: { opens: "11:00", closes: "23:00", opensDisplay: "11 AM", closesDisplay: "11 PM" },
    sunday: { opens: "09:00", closes: "22:00", opensDisplay: "9 AM", closesDisplay: "10 PM" }
  },

  // Happy Hour
  happyHour: {
    start: "14:30",
    end: "17:30",
    startDisplay: "2:30 PM",
    endDisplay: "5:30 PM",
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },

  // Digital Presence
  url: "https://champions-smartsite.lovable.app",
  social: {
    facebook: "https://www.facebook.com/people/Champions-Sports-Bar-Grill/100063835066138/",
    instagram: "https://www.instagram.com/champs_hillsboro/"
  },

  // Media Assets
  logo: "https://res.cloudinary.com/de3djsvlk/image/upload/v1752102164/Champions_logo_charcoal_b4caoh.png",
  heroImage: "https://res.cloudinary.com/de3djsvlk/image/upload/v1753119005/A7304962_psfeqt.jpg",
  images: [
    "https://res.cloudinary.com/de3djsvlk/image/upload/v1753119005/A7304962_psfeqt.jpg",
    "https://res.cloudinary.com/de3djsvlk/image/upload/v1753117392/taco_tuesday_card_gyrc53.jpg",
    "https://res.cloudinary.com/de3djsvlk/image/upload/v1753118533/trivia_night_image_r6s7vy.jpg",
    "https://res.cloudinary.com/de3djsvlk/image/upload/v1753118240/A7305176_vrkjug.jpg"
  ],

  // Business Attributes
  priceRange: "$$",
  cuisineTypes: ["American", "Pub Food", "Bar Food", "Breakfast"],
  acceptsReservations: true,
  paymentMethods: ["Cash", "Credit Card", "Debit Card", "Mobile Payment"],

  // Amenities
  amenities: [
    "14 Big Screen TVs",
    "NFL Sunday Ticket",
    "NBA League Pass",
    "MLB Extra Innings",
    "20 Draft Beer Taps",
    "Digital Pour System",
    "Happy Hour Daily 2:30-5:30 PM",
    "Private Event Space",
    "Family Friendly",
    "LGBTQ Friendly",
    "Wheelchair Accessible",
    "Free Wi-Fi",
    "Sunday Breakfast Service",
    "Weekly Trivia Night",
    "Bingo Events"
  ],

  // Knowledge Topics (for AI training)
  knowledgeTopics: [
    "NFL Sunday Ticket Viewing",
    "Portland Timbers Official Pub Partner",
    "Pacific Northwest Craft Beer",
    "Sports Viewing Parties",
    "Trivia Nights Tuesday",
    "Bingo Events Wednesday",
    "Corporate Event Hosting",
    "Private Party Venue",
    "Happy Hour Specials Daily",
    "Breakfast Sports Bar Sunday",
    "Family Dining Experience",
    "LGBTQ Friendly Establishment",
    "NBA League Pass",
    "MLB Extra Innings",
    "Portland Trail Blazers Games",
    "World Cup Viewing",
    "Winter Olympics Coverage",
    "American Pub Food",
    "Craft Cocktails",
    "Local Wine Selection",
    "Hillsboro Community Hub",
    "Sports Bar Near Intel",
    "Sports Bar Near Nike",
    "Tanasbourne Area Dining",
    "Washington County Sports Bars"
  ],

  // SEO Keywords
  seoKeywords: {
    primary: [
      "sports bar hillsboro",
      "hillsboro sports bar",
      "champions sports bar",
      "champions hillsboro",
      "sports bar near me 97123"
    ],
    secondary: [
      "nfl sunday ticket hillsboro",
      "craft beer hillsboro",
      "timbers pub hillsboro",
      "trivia night hillsboro",
      "happy hour hillsboro",
      "breakfast sports bar hillsboro"
    ],
    longtail: [
      "where to watch nfl games hillsboro",
      "sports bar with nfl sunday ticket near me",
      "best wings in hillsboro oregon",
      "lgbtq friendly bars hillsboro",
      "family friendly sports bar hillsboro",
      "sports bar near intel campus",
      "sports bar near nike beaverton",
      "portland timbers official pub",
      "where to watch trail blazers hillsboro"
    ],
    local: [
      "SE 73rd avenue sports bar",
      "tanasbourne sports bar",
      "rock creek area dining",
      "washington county sports bars",
      "hillsboro restaurant happy hour"
    ]
  },

  // Recurring Events
  recurringEvents: [
    {
      name: "Weekly Trivia Night",
      description: "Test your knowledge at Champions Sports Bar's weekly trivia night with prizes, drink specials, and a fun competitive atmosphere",
      dayOfWeek: "Tuesday",
      startTime: "18:00",
      endTime: "20:00",
      frequency: "P1W"
    },
    {
      name: "Bingo Night",
      description: "Join us for Bingo at Champions Sports Bar with cash prizes, special deals, and community fun. Held every other Wednesday - check our website for upcoming dates",
      dayOfWeek: "Wednesday",
      startTime: "18:00",
      endTime: "20:00",
      frequency: "P2W"
    }
  ]
} as const;

// FAQ Data for structured data
export const FAQ_DATA = [
  {
    question: "Does Champions Sports Bar have NFL Sunday Ticket?",
    answer: "Yes, Champions Sports Bar & Grill in Hillsboro has NFL Sunday Ticket on 14 big screen TVs. We show every NFL game every Sunday throughout the season."
  },
  {
    question: "What time does Champions Sports Bar open on Sunday?",
    answer: "Champions opens at 9:00 AM on Sundays, making it perfect for early NFL games and Sunday breakfast. We serve breakfast until 2 PM on Sundays."
  },
  {
    question: "Is Champions Sports Bar family-friendly?",
    answer: "Yes, Champions is family-owned and family-friendly. We welcome guests of all ages and have a kid-friendly menu with options for younger diners."
  },
  {
    question: "Does Champions have happy hour?",
    answer: "Yes, Champions has happy hour daily from 2:30 PM to 5:30 PM with drink and food specials every single day of the week."
  },
  {
    question: "Can I watch Portland Timbers games at Champions?",
    answer: "Yes! Champions Sports Bar is an official Portland Timbers Pub Partner. We show all Timbers matches with sound on and have a dedicated fan section."
  },
  {
    question: "Does Champions do private events?",
    answer: "Yes, Champions Sports Bar offers private event space for corporate events, birthday parties, and group gatherings. Contact us at (503) 747-6063 to book your event."
  },
  {
    question: "Where is Champions Sports Bar located in Hillsboro?",
    answer: "Champions Sports Bar & Grill is located at 2947 SE 73rd Ave, Hillsboro, OR 97123. We're easily accessible from Intel, Nike campus, and Tanasbourne area."
  },
  {
    question: "Does Champions have craft beer?",
    answer: "Yes, Champions features 20 draft beer taps with a focus on Pacific Northwest craft breweries, plus a full bar with craft cocktails and a curated wine selection."
  },
  {
    question: "Is Champions LGBTQ+ friendly?",
    answer: "Absolutely. Champions Sports Bar & Grill is a proud LGBTQ+ friendly establishment. Everyone is welcome here, and we celebrate diversity in our community."
  },
  {
    question: "Can I make a reservation at Champions Sports Bar?",
    answer: "Yes, we accept reservations for tables and private events. Call us at (503) 747-6063 or book online through our website reservations page."
  },
  {
    question: "What sports packages does Champions have?",
    answer: "Champions has NFL Sunday Ticket, NBA League Pass, and MLB Extra Innings. We show all Portland Trail Blazers games, Portland Timbers matches, and major sporting events including World Cup and Olympics."
  },
  {
    question: "Does Champions have trivia or bingo nights?",
    answer: "Yes! Champions hosts weekly trivia on Tuesdays at 6 PM and bingo every other Wednesday at 6 PM. Both events feature prizes, drink specials, and a fun community atmosphere. Check our website for upcoming bingo dates."
  }
] as const;

// Homepage-specific FAQs
export const HOMEPAGE_FAQS = FAQ_DATA.slice(0, 6);
