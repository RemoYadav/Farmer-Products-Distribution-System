const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRoutes');
const AdminRoutes = require("./Routes/AdminRoutes");
const AuthForgotRouter = require("./Routes/ForgotRouter")
const NotificationRouter = require("./Routes/NotificationRoutes")
const DashboardRoutes = require("./Routes/DashboardRoutes")
require('dotenv').config();
require('./Models/db');
const path = require("path");

const PORT = process.env.PORT || 8080;

// app.get('/ping', (req, res) => {
//   res.send('pong');
// });

app.use(bodyParser.json());
app.use(cors())
app.use('/auth', AuthRouter);
app.use('/forgot',AuthForgotRouter)
app.use('/products', ProductRouter);
app.use("/admin", AdminRoutes);
app.use("/api/notifications",NotificationRouter);
app.use("/api/customer", require("./Routes/CustomerRoutes"));
app.use("/api/farmer", require("./Routes/FarmerRoutes"));
app.use(express.json({ limit: "10mb" }));
app.use("/api/products", require("./Routes/ProductRoutes"));
app.use("/api/place-order", require("./Routes/ProductRoutes"));
app.use("/api/orders", require("./Routes/OrderRoutes"));
app.use("/api/marcket", require("./Routes/MarketRoutes"));
app.use("/api/analytics", DashboardRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/profiles", express.static(path.join(__dirname, "profiles")));
app.use('/api/cart', require('./Controllers/cart'));
// app.use("/api/farmer", require("./Routes/FarmerRoutes"));
app.use("/api/admin", AdminRoutes);
app.use("/api/activity",require("./Routes/ActivityRoutes"))
app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    })