import { useState, useEffect } from "react";
// import { button } from "./ui/button";
import "./css/FarmerDashboard.css"

import FarmerHeader from "./FarmerHeader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,

} from "recharts";
import {
  Apple,
  Leaf,
  Carrot,
  Egg,
  Milk,
  Droplet,
  Package,
  Beef,
  Drumstick,
  Wheat,
  ShoppingCart,
  Activity,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { handleSuccess, handleError } from "../../util";
export default function FarmerDashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  const [email, setEmail] = useState("");
  const token = localStorage.getItem("token");
  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [barDataView, setBarDataView] = useState("weekly-sales");
  const [pieData, setPieData] = useState([]);
  const [activity, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null)
  useEffect(() => {
    setEmail(localStorage.getItem("email"));
  }, [])


  // Mock farmer data - In a real app, this would come from authentication



  // Mock customer requests data
  useEffect(() => {
    const fetchBarData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE_URL}/api/analytics/sales`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json(); // 🔥 REQUIRED

        setDaily(Array.isArray(data.daily) ? data.daily : []);
        setMonthly(Array.isArray(data.monthly) ? data.monthly : []);

      } catch (err) {
        // console.error(err);
        handleError("Server not responding. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBarData();
  }, [API_BASE_URL, token]);

  console.log(pieData)

  useEffect(() => {
    const fetchPieData = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          `${API_BASE_URL}/api/analytics/pie`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = await res.json();
        setPieData(data);

        setLoading(false)
      } catch (err) {
        console.error(err);
      }
    };

    fetchPieData();
  }, [API_BASE_URL, token]);

  const fetchActivities = async () => {
    const res = await fetch(`${API_BASE_URL}/api/activity`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log(data)
    if (data.success) {
      setActivities(data.data);
    }
  };
  useEffect(() => {
    fetchActivities();
  }, [API_BASE_URL, token])
  const ICON_MAP = {

    Fruits: <Apple />,
    Vegetables: <Leaf />,      // or <Carrot />
    Grains: <Wheat />,
    Meat: <Beef />,            // or <Drumstick />
    Eggs: <Egg />,
    Milks: <Milk />,
    Droplets: <Droplet />,
    Chicken: <Drumstick />
  };

  const pieChartData = pieData.map(item => ({
    ...item,
    icon: ICON_MAP[item.name] || <ShoppingCart />
  }));

  const COLORS = ["#2ecc71", "#3498db", "#f1c40f", "#e74c3c"];

  // Recent activity
  const activities = [
    "Added new product: Tomatoes",
    "Updated price: Apples",
    "Order #1024 completed",
    "Low stock alert: Onions",
  ];
  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="spinner2"></div>
      </div>
    );
  }
  return (
    <div className="">
      <div>
        <FarmerHeader />
      </div>
      <div className="dashboard">

        <h1 className="dashboard-title">Analytics Overview</h1>

        {/* Charts */}
        <div className="charts-grid">

          {/* Histogram */}
          <div className="glass-card">


            <div className="flex justify-end">

              <button className={`salesBtn  flex ${barDataView === "weekly-sales" ? "viewed" : ""}`} onClick={() => setBarDataView("weekly-sales")}>
                Weekly Sales
              </button>
              <button className={` salesBtn orderviewbtn   bg-white ${barDataView === "monthly-sales" ? "viewed" : ""}`} onClick={() => setBarDataView("monthly-sales")}> Monthly Sales</button>
            </div>
            {barDataView === "monthly-sales" && (
              <>
                <h3>Monthly Sales</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthly}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#2ecc71" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}

            {barDataView === "weekly-sales" && (
              <>
                <h3>Weekly Sales</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={daily}>
                    <XAxis dataKey="day" /> {/* 🔥 FIXED */}
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#27ae60" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}
          </div>

          {/* Pie Chart */}
          <div className="glass-card">
            <h3>Product Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={5}
                >
                  {pieChartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>


            {/* Custom Icon Legend */}
            <div className="pie-icons">
              {pieChartData.map((item, i) => (
                <div key={i} className="pie-icon">
                  <span style={{ color: COLORS[i % COLORS.length] }}>
                    {item.icon}
                  </span>
                  <small>{item.name}</small>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card">

          <div className="activity-list">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {activity.slice(0, 5).map(activity => (
                <div key={activity.userId} className="activity-item">
                  <Activity className="activity-icon" />
                  <div className="activity-content">
                    {activity.message}
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>



      </div>
      <ToastContainer />

    </div>
  );
}