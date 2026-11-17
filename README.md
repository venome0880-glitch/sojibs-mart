# Sojib's Mart - Electric Room Heater & Chula E-Commerce Store

A modern, fast, full-stack single-page web app and owner admin portal for an online electric heater shop in Bangladesh.

## Features

### Storefront
- **White Theme with Ember Red Accent**: Clean aesthetic, accessible contrast ratios, and Rubik + Nunito Sans typography.
- **Hero Banner**: Radiant pulsing glow animation around the electric heater chula product photo with photo carousel.
- **Store Perks**: Highlights free nationwide delivery, 4 heater models, and order-by-message convenience.
- **Model Cards**: Interactive cards with count-up wattage meters (1000W, 1500W, 2500W, 3000W), stock tracking, and real-time sold-out badges.
- **Ordering Process**: Simple 3-step guide for Cash on Delivery.
- **Order Confirmation & Checkout**:
  - Direct form submission with database persistence.
  - One-tap WhatsApp order dispatch with auto-formatted message.
  - "Confirm Order" button.
- **Winter Offer Banner**: Configurable announcement banner.

### Owner Admin Panel (`/admin`)
- **Password Protected**: Owner login gate (`sojib123`).
- **100% English UI**: Clean, dense desktop table and responsive mobile view.
- **Orders Inbox**: Live orders stream, status pipeline (New, Confirmed, Out for delivery, Delivered, Cancelled), one-tap customer call and WhatsApp buttons.
- **Stock & Inventory**: Live stock counters and sold-out switches.
- **Prices & Offers**: Dynamic pricing and winter banner editor.
- **Today's Deliveries**: Delivery dispatch grouped by area with a printable manifest.
- **Sales Summary**: KPI metrics, daily and weekly volume/revenue stats, and model distribution.
- **Customer Directory**: Phone-aggregated customer history, order counts, lifetime spend, and one-click UTF-8 CSV export.
- **Message Templates**: Saved replies with one-click copy.
- **Full Website Customizer**:
  - Theme colors and custom color picker.
  - Store Header Logo upload and style switcher.
  - Browser Tab Favicon upload with live browser tab preview.
  - Editable hero copy, perks, and steps.

## Tech Stack
- **Frontend**: React 18, Vite, Lucide Icons
- **Backend**: Node.js, Express, Multer
- **Database**: Atomic JSON Database
