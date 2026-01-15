# AI Coding Guidelines for Farmer Marketplace Project

## Architecture Overview
This is a full-stack marketplace application with React frontend and Node.js/Express/MongoDB backend. Key components:
- **Frontend**: React app in `src/`, using Vite, Tailwind CSS, React Router, Lucide icons, and React Toastify for notifications.
- **Backend**: MVC structure in `back-end/` with Controllers, Models, Routes, and Middlewares.
- **Database**: MongoDB with Mongoose ODM.
- **Roles**: Farmer (sells products), Customer (buys), Admin (manages).
- **Authentication**: JWT-based, tokens stored in localStorage, verified via `authMiddleware.js`.

## Key Data Flows
- Users register/login via `/auth` routes, farmers must create profiles post-signup.
- Farmers add products via `ProductController.js`, images uploaded to `uploads/` using `multerConfig.js`.
- Customers browse marketplace, place orders tracked in `Order.js` with status history.
- Notifications sent via `NotificationController.js`.
- Reviews and ratings handled in `Review.js` and `ReviewRating.js`.

## Developer Workflows
- **Run Frontend**: `npm run dev` (Vite dev server on port 3000).
- **Run Backend**: `cd back-end && npm start` (Nodemon on port 8080).
- **API Base URL**: `http://localhost:8080` for all frontend API calls.
- **Environment**: Requires `.env` with `MONGO_CONN` (MongoDB URI) and `JWT_SECRET`.
- **File Uploads**: Use `multer` configs (`multerConfig.js` for products, `multerConfigProfile.js` for profiles), images stored in `back-end/uploads/` and `back-end/profiles/`.
- **Order Numbers**: Auto-generated using `Counter.js` model and `utils/generateOrderNumber.js`.

## Code Conventions
- **Components**: PascalCase naming (e.g., `CustomerOrder.jsx`), with separate CSS files.
- **Backend**: CamelCase for files, CommonJS modules (`require/module.exports`).
- **Models**: Mongoose schemas in `Models/`, e.g., `User.js` with enum roles.
- **Routes**: RESTful endpoints in `Routes/`, protected by `authMiddleware.js`.
- **Validation**: Use Joi in controllers for input validation.
- **Error Handling**: Return JSON with `success` boolean and `message`.
- **Icons**: Import from `lucide-react` (e.g., `import { User } from "lucide-react"`).
- **API Calls**: Use `fetch` with Authorization headers, handle responses in components.

## Integration Points
- **Frontend-Backend**: Axios or fetch calls to backend APIs, auth tokens in headers.
- **Database**: Direct Mongoose queries in controllers, no ORMs beyond Mongoose.
- **File Handling**: Multer for multipart uploads, serve static files from `back-end/uploads/`.
- **Cross-Component**: Use React Router for navigation, state managed via hooks (no global state library).

## Common Patterns
- **Auth Check**: In components, check `localStorage.getItem("token")` for login status.
- **Role-Based UI**: Conditionally render based on `user.role` from API responses.
- **Image Display**: Use `ImageWithFallback` component for product images.
- **Toasts**: Use `toast.success/error` from `react-toastify` for user feedback.
- **Protected Routes**: Implement via `ProtectedRoute.jsx` component.

Reference: `back-end/Controllers/AuthController.js` for signup/login, `src/component/FarmerMarketplace.jsx` for product listing.</content>
<parameter name="filePath">f:\BCA project\React\farmer-project\.github\copilot-instructions.md