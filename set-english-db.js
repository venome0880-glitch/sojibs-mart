const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.customizer = {
  theme: {
    primaryColor: db.customizer?.theme?.primaryColor || '#d6361a',
    primaryColorHover: db.customizer?.theme?.primaryColorHover || '#b82b13',
    logoType: 'icon',
    logoImageUrl: '',
    shopName: "Sojib's Mart",
    tagline: 'Electric Heater Chula & Room Heating'
  },
  hero: {
    badge: 'Electric Heater Chula • 100% Free Nationwide Delivery',
    headline: 'A warmer room this winter.',
    headlineAccent: 'Delivered free.',
    subHeadline: 'Heavy-Duty Ceramic Electric Heater Stoves — Fast Cooking & Room Warmth',
    description: 'High-temperature fireproof ceramic body with glowing red nichrome heating coils. Available in 8-inch and 10-inch models from 1000W to 3000W. Free doorstep delivery with Cash on Delivery across Bangladesh.',
    footnote: 'Cash on Delivery • Package Inspection on Arrival • 7-Day Replacement Warranty',
    heroImageUrl: db.config.productPhotoUrl || '/images/chula-glowing-red.jpg'
  },
  sections: {
    perksTitle: "Why Buy From Sojib's Mart?",
    perksSubtitle: 'Fireproof ceramic bodies, genuine glowing red nichrome heating coils, and fast delivery.',
    modelsTitle: 'Select Your Electric Heater Chula Model',
    modelsSubtitle: 'Available in 8" (1000W & 1500W) and 10" (2500W & 3000W). Genuine nichrome coils, safety pot stands, and free shipping.',
    stepsTitle: 'How Ordering Works',
    stepsSubtitle: 'Simple 3-step checkout with zero advance payment required.'
  },
  perks: [
    {
      title: '100% Free Nationwide Delivery',
      description: 'Zero shipping fee across Bangladesh. No advance payment required; inspect your parcel upon arrival with Cash on Delivery.',
      tag: 'Free Shipping'
    },
    {
      title: '4 Tailored Heater Chula Models',
      description: '8" (1000W & 1500W) for tea and daily cooking, and 10" (2500W & 3000W) for heavy cooking pots and large room heating.',
      tag: '8" & 10" Ceramic'
    },
    {
      title: 'Order Direct by Message',
      description: 'No account needed. Place your order with 1 click on WhatsApp or Messenger for instant confirmation.',
      tag: 'Instant Confirmation'
    }
  ],
  steps: [
    {
      step: '01',
      title: 'Choose Model & Enter Address',
      description: 'Select your preferred wattage and fill in your name, phone number, and delivery address.'
    },
    {
      step: '02',
      title: 'Confirm Your Order',
      description: 'Click "Confirm Order" to save your order directly or dispatch via WhatsApp.'
    },
    {
      step: '03',
      title: 'Receive & Pay Cash on Delivery',
      description: 'Our rider brings your heater chula right to your doorstep. Inspect the parcel and pay cash on delivery.'
    }
  ]
};

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Customizer data updated to 100% English!');
