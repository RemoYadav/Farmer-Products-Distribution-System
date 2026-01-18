# AI Coding Guidelines for Farmer Marketplace Project

## Architecture Overview
This is a full-stack marketplace application with React frontend and Node.js/Express/MongoDB backend. Key components:
- **Frontend**: React app in `front-end/src/`, using Vite, Tailwind CSS, React Router, Lucide icons, and React Toastify for notifications.
- **Backend**: MVC structure in `back-end/` with Controllers, Models, Routes, and Middlewares.
- **Database**: MongoDB with Mongoose ODM.
- **Roles**: Farmer (sells products), Customer (buys), Admin (manages).
- **Authentication**: JWT-based, tokens stored in localStorage, verified via `authMiddleware.js`.
- **Real-Time Features**: Socket.io for notifications, integrated in `server.js` and `RealTimeNotificationController.js`.

## Key Data Flows
- Users register/login via `/auth` routes, farmers must create profiles post-signup (redirect to `/farmer/create-profile` if no profile).
- Farmers add products via `ProductController.js`, images uploaded to `back-end/uploads/` using `multerConfig.js`.
- Customers browse marketplace via `/api/marcket/products`, place orders tracked in `Order.js` with status history in `OrderStatusHistory.js`.
- Notifications sent via `NotificationController.js` and real-time via Socket.io.
- Reviews and ratings handled in `Review.js` and `ReviewRating.js`.
- Admin manages users/customers/farmers status (active/suspended), product access (allowed/denied), views login activity from `LoginActivity.js`.
- Email notifications via Nodemailer using `EMAIL` and `EMAIL_PASS` from `.env`.

## Developer Workflows
- **Run Frontend**: `cd front-end && npm run dev` (Vite dev server on port 3000).
- **Run Backend**: `cd back-end && npm run dev` (Nodemon on port 8080 from `.env` PORT).
- **API Base URL**: `http://localhost:8080` for all frontend API calls (set in `front-end/.env` as `VITE_API_BASE_URL`).
- **Environment**: Requires `back-end/.env` with `MONGO_CONN` (MongoDB URI), `JWT_SECRET`, `EMAIL`, `EMAIL_PASS`, `PORT`.
- **File Uploads**: Use `multer` configs (`multerConfig.js` for products, `multerConfigProfile.js` for profiles), images stored in `back-end/uploads/` and `back-end/profiles/`, served statically.
- **Order Numbers**: Auto-generated using `Counter.js` model and `utils/generateOrderNumber.js`.
- **Login Activity**: Logged on signup/login in `LoginActivity.js` with auto-generated logId via `generateLogNumber.js`.

## Code Conventions
- **Components**: PascalCase naming (e.g., `Market.jsx`), with separate CSS files.
- **Backend**: CamelCase for files, CommonJS modules (`require/module.exports`).
- **Models**: Mongoose schemas in `Models/`, e.g., `User.js` with enum roles (`farmer`, `customer`, `admin`) and status (`active`, `suspended`).
- **Routes**: RESTful endpoints in `Routes/`, protected by `authMiddleware.js` or `AdminAuth.js`.
- **Validation**: Use Joi in controllers for input validation.
- **Error Handling**: Return JSON with `success` boolean and `message`.
- **Icons**: Import from `lucide-react` (e.g., `import { User } from "lucide-react"`).
- **API Calls**: Use `fetch` with Authorization headers (`Bearer ${token}`), handle responses in components.
- **Real-Time**: Use Socket.io for notifications, emit to user rooms by `userId`.

## Integration Points
- **Frontend-Backend**: Fetch calls to backend APIs, auth tokens in headers.
- **Database**: Direct Mongoose queries in controllers, populate refs (e.g., `farmerId` in products).
- **File Handling**: Multer for multipart uploads, serve static files from `back-end/uploads/` and `back-end/profiles/`.
- **Cross-Component**: Use React Router for navigation, state managed via hooks (no global state library beyond AuthContext).
- **Notifications**: Email via Nodemailer, real-time via Socket.io (join room on userId).

## Common Patterns
- **Auth Check**: In components, check `localStorage.getItem("token")` for login status.
- **Role-Based UI**: Conditionally render based on `user.role` from API responses or AuthContext.
- **Image Display**: Use `ImageWithFallback` component for product images.
- **Toasts**: Use `toast.success/error` from `react-toastify` for user feedback.
- **Protected Routes**: Implement via `ProtectedRoute.jsx` component.
- **Product Access**: Admin can deny/allow products via `/api/admin/products/:id/access`.
- **Activity Logging**: Log user actions in `Activity.js`, login in `LoginActivity.js`.

Reference: `back-end/Controllers/AuthController.js` for signup/login, `front-end/src/pages/Market.jsx` for product listing, `back-end/Routes/AdminRoutes.js` for admin endpoints.</content>
<parameter name="filePath">f:\BCA project\React\farmer-project\.github\copilot-instructions.md