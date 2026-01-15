import React, { useState } from 'react';
import Login from './component/Login.jsx';
import { AdminDashboard } from './component/AdminDashboard.jsx';
import { CustomerDashboard } from './component/CustomerDashboard.jsx';
import { FarmerDashboard } from './component/FarmerDashboard.jsx';
import { Routes, Route, Navigate, Form } from 'react-router-dom';
import FarmerProfile from './component/FarmerProfile.jsx';
import Referesh from './Referesh.jsx';
import FarmerDash from './component/demo';
import { CustomerOrder } from './component/CustomerOrder.jsx';
import { CustomerShowOrder } from './component/CustomerShowOrder.jsx';
import  CustomerProfile  from './component/CustomerProfile.jsx';
import { ProductManagement } from './component/ProductManagement.jsx';
import FarmerAbout from './component/FarmerAbout.jsx';
import CustomerList from './component/CustomerList.jsx';
import { FarmerMarketplace } from './component/FarmerMarketplace.jsx';
import { AuthProvider } from "./context/AuthContext";
import { FarmerHome } from "./component/FarmerHome.jsx"
import { SignupForm } from "./component/SignupForm.jsx"
import { FarmerProfileProvider } from './context/FarmerProfileContext.jsx';
import {HomePage} from "./component/HomePage.jsx"
const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  }

  return (
    <div className="grid w-[100%]  min-h-screen bg-green-800">
      <Referesh setIsAuthenticated={setIsAuthenticated} />
    
        <Routes>
          {/* <Route path='/' element={<Navigate to="/login" />} /> */}
          <Route path='/login' element={<Login />} />
          <Route path='/farmer/dashboard' element={<PrivateRoute element={<FarmerDashboard />} />} />
          <Route path='/customer/dashboard' element={<PrivateRoute element={<CustomerDashboard />} />} />
          <Route path='/admin/dashboard' element={<PrivateRoute element={<AdminDashboard />} />} />
          <Route path='/marcket' element={<PrivateRoute element={<FarmerMarketplace />} />} />
          <Route path='/place-order' element={<PrivateRoute element={<CustomerOrder />} />} />
          <Route path="/place-order/:productId" element={<PrivateRoute element={<CustomerOrder />} />} />
          <Route path='/show-orders' element={<PrivateRoute element={<CustomerShowOrder />} />} />
          <Route path='/customer/profile' element={<PrivateRoute element={<CustomerProfile />} />} />

          <Route path='/farmer/products' element={<PrivateRoute element={<ProductManagement />} />} />
          <Route path='/farmer/my-detail' element={<PrivateRoute element={<SignupForm />} />} />
          <Route path='/farmer/about' element={<PrivateRoute element={<FarmerAbout />} />} />
          <Route path='/farmer/orders' element={<PrivateRoute element={<CustomerList />} />} />
          <Route path='/farmer/home' element={<HomePage />}  />
          <Route path='/farmer/profile' element={<PrivateRoute element={<FarmerProfile />} />} />
          {/* 🌾 FARMER ROUTES (wrapped with context) */}
          
        </Routes>
  
    </div>
  );
}

export default App;
// import React, { useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// import Login from "./component/Login";
// import { AdminDashboard } from "./component/AdminDashboard";
// import { CustomerDashboard } from "./component/CustomerDashboard";
// import { FarmerDashboard } from "./component/FarmerDashboard";
// import FarmerProfile from "./component/FarmerProfile";
// import FarmerAbout from "./component/FarmerAbout";
// import ProductManagement from "./component/ProductManagement";
// import CustomerList from "./component/CustomerList";
// import FarmerHome from "./component/FarmerHome";
// import FarmerMarketplace from "./component/FarmerMarketplace";

// import Referesh from "./Referesh";
// import { FarmerProfileProvider } from "./context/FarmerProfileContext";

// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const PrivateRoute = ({ element }) =>
//     isAuthenticated ? element : <Navigate to="/login" />;

//   return (
//     <div className="grid w-full min-h-screen bg-green-800">
//       <Referesh setIsAuthenticated={setIsAuthenticated} />

//       <Routes>
//         {/* PUBLIC */}
//         <Route path="/login" element={<Login />} />

//         {/* CUSTOMER */}
//         <Route
//           path="/customer/dashboard"
//           element={<PrivateRoute element={<CustomerDashboard />} />}
//         />

//         {/* ADMIN */}
//         <Route
//           path="/admin/dashboard"
//           element={<PrivateRoute element={<AdminDashboard />} />}
//         />

//         {/* 🌾 FARMER ROUTES (CONTEXT APPLIED HERE ONLY) */}
//         <Route
//           path="/farmer/*"
//           element={
//             <FarmerProfileProvider>
//               <Routes>
//                 <Route
//                   path="dashboard"
//                   element={<PrivateRoute element={<FarmerDashboard />} />}
//                 />
//                 <Route
//                   path="profile"
//                   element={<PrivateRoute element={<FarmerProfile />} />}
//                 />
//                 <Route
//                   path="products"
//                   element={<PrivateRoute element={<ProductManagement />} />}
//                 />
//                 <Route
//                   path="orders"
//                   element={<PrivateRoute element={<CustomerList />} />}
//                 />
//                 <Route
//                   path="about"
//                   element={<PrivateRoute element={<FarmerAbout />} />}
//                 />
//                 <Route
//                   path="home"
//                   element={<PrivateRoute element={<FarmerHome />} />}
//                 />
//                 <Route
//                   path="market"
//                   element={<PrivateRoute element={<FarmerMarketplace />} />}
//                 />
//               </Routes>
//             </FarmerProfileProvider>
//           }
//         />
//       </Routes>
//     </div>
//   );
// };

// export default App;
