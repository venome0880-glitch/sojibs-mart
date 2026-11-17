const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.customizer = {
  theme: {
    primaryColor: '#d6361a',
    primaryColorHover: '#b82b13',
    logoType: 'icon', // 'icon' or 'image'
    logoImageUrl: '',
    logoIcon: 'Flame'
  },
  hero: {
    badge: 'ইলেকট্রিক হিটার চুলা (Electric Heater Chula) • ফ্রি হোম ডেলিভারি',
    headline: 'A warmer room this winter.',
    headlineAccent: 'Delivered free.',
    subHeadline: 'খাঁটি সিরামিক ইলেকট্রিক হিটার চুলা — দ্রুত রান্না ও ঘর গরম দুটোই এক সাথে!',
    description: 'উচ্চ তাপমাত্রার পোড়া মাটির ফায়ারপ্রুফ সিরামিক বডি ও লাল টকটকে নাইক্রোম কয়েল। ৮ ইঞ্চি ও ১০ ইঞ্চি মডেলে ১০০০W থেকে ৩০০০W পর্যন্ত। গ্যাস ছাড়া দ্রুত রান্নাবান্না ও তীব্র শীতে রুমের উষ্ণতায় সেরা সমাধান।',
    footnote: 'ক্যাশ অন ডেলিভারি • পার্সেল দেখে নেওয়ার সুবিধা • ৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি',
    heroImageUrl: db.config.productPhotoUrl || '/images/chula-glowing-red.jpg'
  },
  sections: {
    perksTitle: "কেন সজিব'স মার্টের হিটার চুলা সেরা?",
    perksSubtitle: 'খাঁটি আগুনে পোড়া সিরামিক বডি, অরিজিনাল লাল নাইক্রোম কয়েল ও দ্রুততম হোম ডেলিভারি সেবা।',
    modelsTitle: 'আপনার প্রয়োজনীয় সাইজের হিটার চুলা বেছে নিন',
    modelsSubtitle: '৮ ইঞ্চি (১০০০W ও ১৫০০W) এবং ১০ ইঞ্চি (২৫০০W ও ৩০০০W) মডেল। প্রতিটি চুলায় রয়েছে লাল টকটকে নাইক্রোম কয়েল, মজবুত সিরামিক বডি, পাতিল স্ট্যান্ড ক্লিপ এবং সারাদেশে ফ্রি হোম ডেলিভারি।',
    stepsTitle: 'How Ordering Works',
    stepsSubtitle: 'অর্ডার প্রক্রিয়া অত্যন্ত সহজ ও দ্রুত — কোনো অগ্রিম পেমেন্ট নেই।'
  },
  perks: [
    {
      title: 'সারাদেশে ১০০% ফ্রি হোম ডেলিভারি',
      description: 'ঢাকা সহ বাংলাদেশের যেকোনো প্রান্তে সম্পূর্ণ ফ্রিতে হোম ডেলিভারি। কোনো অগ্রিম টাকা লাগবে না, ক্যাশ অন ডেলিভারিতে পার্সেল চেক করে নিন।',
      tag: '100% Free Shipping'
    },
    {
      title: '৪টি সাইজ ও ওয়াটের হিটার চুলা',
      description: '৮ ইঞ্চি (১০০০W ও ১৫০০W) চা ও দৈনন্দিন রান্না এবং ১০ ইঞ্চি (২৫০০W ও ৩০০০W) ভারী রান্নাবান্না ও তীব্র শীতের রুম দ্রুত গরম করার জন্য।',
      tag: '৮" ও ১০" সিরামিক বডি'
    },
    {
      title: 'মেসেজ পাঠিয়ে সরাসরি অর্ডার',
      description: 'কোনো একাউন্ট খুলতে হবে না। ১-ক্লিকে হোয়াটসঅ্যাপে বা ফেসবুক মেসেঞ্জারে আপনার ঠিকানা পাঠিয়ে সাথে সাথে অর্ডার কনফার্ম করুন।',
      tag: 'WhatsApp & Messenger'
    }
  ],
  steps: [
    {
      step: '01',
      title: 'মডেল বেছে নিন ও ঠিকানা দিন',
      description: 'আপনার পছন্দের হিটার চুলা সিলেক্ট করে নাম, মোবাইল নম্বর ও ডেলিভারি ঠিকানা পূরণ করুন।'
    },
    {
      step: '02',
      title: 'অর্ডার কনফার্ম করুন',
      description: 'Confirm Order বাটনে চাপ দিয়ে সরাসরি অর্ডার প্লেস করুন অথবা হোয়াটসঅ্যাপে পাঠান।'
    },
    {
      step: '03',
      title: 'ডেলিভারি পেয়ে টাকা দিন',
      description: 'রাইডার আপনার দরজায় পার্সেল নিয়ে পৌঁছাবে। পার্সেল দেখে ক্যাশ অন ডেলিভারিতে মূল্য দিন।'
    }
  ]
};

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully updated db.json with customizer configuration!');
