# Quick Reference Guide

## Start the Application

### Terminal 1 - Backend
```bash
cd backend
npm install
npm start
```
Backend runs on: `http://localhost:3000/api`

### Terminal 2 - Frontend
```bash
cd inventory
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

## Application URLs

| Page | URL |
|------|-----|
| Dashboard | http://localhost:5173 |
| Product Details | http://localhost:5173/products/:id |
| API | http://localhost:3000/api |

## API Endpoints Quick List

```
GET    /api/products                      Get all products
POST   /api/products                      Create product
GET    /api/products/:id                  Get product summary
POST   /api/products/:id/increase         Increase stock
POST   /api/products/:id/decrease         Decrease stock
GET    /api/products/:id/transactions     Get transactions
```

## Documentation Files

| File | Location | Purpose |
|------|----------|---------|
| API Docs | `backend/API_DOCUMENTATION.md` | Complete API reference |
| Frontend Guide | `inventory/FRONTEND_GUIDE.md` | UI/UX improvements |
| Project README | `README.md` | Project overview |
| Implementation Summary | `IMPLEMENTATION_SUMMARY.md` | What was done |
| This File | `QUICK_REFERENCE.md` | Quick lookup |

## Key Features Summary

### Button Behavior
- **Disabled**: When input field is empty
- **Increase Button**: Green hover (when enabled)
- **Decrease Button**: Red hover (when enabled)
- **States**: Normal, Hover, Disabled, Loading

### Stock Indicators
- 🔴 Red: 0 units (out of stock)
- 🟡 Yellow: < 10 units (low stock)
- 🟢 Green: ≥ 10 units (adequate stock)

### Responsive Breakpoints
- **Mobile**: < 640px (single column)
- **Tablet**: 640px - 1024px (adaptive)
- **Desktop**: > 1024px (multi-column)

## Environment Variables

### Backend `.env`
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/inventory
NODE_ENV=development
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Test API with cURL

### Create Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","sku":"TST-001","initialStock":100}'
```

### Get All Products
```bash
curl http://localhost:3000/api/products
```

### Increase Stock
```bash
curl -X POST http://localhost:3000/api/products/{id}/increase \
  -H "Content-Type: application/json" \
  -d '{"quantity":10}'
```

### Decrease Stock
```bash
curl -X POST http://localhost:3000/api/products/{id}/decrease \
  -H "Content-Type: application/json" \
  -d '{"quantity":5}'
```


## Common Tasks

### Create a Product
1. Click "Create Product" button on dashboard
2. Fill in Name, SKU, Initial Stock
3. Click "Create Product"
4. Product appears in the list

### Increase Stock
1. Click on product from dashboard
2. Enter quantity in "Increase Stock" section
3. Button turns green on hover
4. Click "Increase Stock"
5. Transaction is recorded

### Decrease Stock
1. Click on product from dashboard
2. Enter quantity in "Decrease Stock" section
3. Button turns red on hover
4. Click "Decrease Stock"
5. Transaction is recorded

### View Transactions
1. Go to product details page
2. Scroll to "Transaction History"
3. See all stock adjustments with timestamps


---
