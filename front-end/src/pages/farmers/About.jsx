import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FarmerHeader from "./FarmerHeader"

import {


  Package,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Check,
  Save,
  Heart,
  X,
  Sprout,
  Sun,
  Award,
  Droplet,
  Tag,
  IndianRupee,
  Edit,
  Trash2,
  ImageIcon,
  User,
  Users,
  Home,
  BarChart3,
  ShoppingBag,
  Shield,
  Phone,
  Plus,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Leaf,
  LogOut,
  UserCircle,
  Settings
} from "lucide-react";


export default function FarmerAbout() {
 
  const navigate = useNavigate()
  
  const token = localStorage.getItem("token");

  
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState("");
  const [formData, setFormData] = useState({
    farmName: "",
    fullName: "",
    email: "",
    phone: "",
    location: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    farmSize: "",
    farmingType: "",
    yearsExperience: "",
    bio: "",
    profileImageUrl: ""
  });

  const [errors, setErrors] = useState({});

  //  fetch profile 
  const fetchProfile = async () => {
    try {
       setIsLoading(true)
      const url = "http://localhost:8080/api/farmer/profile";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const result = await response.json();

      if (result.success && result.profile) {
        setProfile(result.profile);
      }
       setIsLoading(false)
    } catch (err) {
      // console.log(err)
      toast.error("Error fetching profile");
    }
    finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchProfile();
  }, []);


  const mission = {
    title: "Our Mission",
    description: "At Green Valley Farm, we're committed to sustainable farming practices that nurture the land and provide our community with the freshest, healthiest organic produce. We believe in transparency, quality, and building lasting relationships with our customers."
  };

  const values = [
    {
      icon: Leaf,
      title: "100% Organic",
      description: "All our crops are certified organic, grown without synthetic pesticides or fertilizers."
    },
    {
      icon: Heart,
      title: "Community First",
      description: "We prioritize local communities and sustainable relationships with our customers."
    },
    {
      icon: Sprout,
      title: "Sustainable Practices",
      description: "We use regenerative agriculture techniques to improve soil health and biodiversity."
    },
    {
      icon: Sun,
      title: "Fresh & Seasonal",
      description: "We grow seasonal produce at peak freshness and flavor."
    }
  ];

  const team = [
    {
      name: "John Farmer",
      role: "Farm Owner & Manager",
      description: "Third-generation farmer with 30+ years of experience in organic agriculture."
    },
    {
      name: "Sarah Green",
      role: "Head of Operations",
      description: "Specializes in sustainable farming practices and crop rotation management."
    },
    {
      name: "Mike Rodriguez",
      role: "Harvest Coordinator",
      description: "Ensures timely harvesting and quality control for all produce."
    },
    {
      name: "Emily Chen",
      role: "Customer Relations",
      description: "Manages customer orders and maintains strong community relationships."
    }
  ];

  const certifications = [
    {
      icon: Award,
      title: "USDA Organic Certified",
      year: "Since 1995"
    },
    {
      icon: CheckCircle,
      title: "Non-GMO Verified",
      year: "Since 2005"
    },
    {
      icon: Leaf,
      title: "Certified Naturally Grown",
      year: "Since 2010"
    }
  ];

  const stats = [
    { label: "Years in Business", value: "38+" },
    { label: "Happy Customers", value: "2,500+" },
    { label: "Varieties Grown", value: "75+" },
    { label: "Acres Farmed", value: "50" }
  ];

if (isLoading) {
    return (
      <div className="loader-overlay">
        <div className="spinner2"></div>
      </div>
    );
  }
  return (
    <div className="about-container">

      {/* Header */}
      <FarmerHeader/>
      <div className="about-main">
        <section className="mission-section">
          <div className="section-header">
            <Heart className="section-icon" />
            <h2>{mission.title}</h2>
          </div>
          <p className="mission-text">{mission.description}</p>
        </section>

        <section className="values-section">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="value-card">
                  <div className="value-icon">
                    <IconComponent className="icon-lg" />
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* <section className="team-section">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">
                  <Users className="icon-avatar" />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-description">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section> */}

        <section className="certifications-section">
          <h2 className="section-title">Certifications & Awards</h2>
          <div className="certifications-grid">
            {certifications.map((cert, index) => {
              const IconComponent = cert.icon;
              return (
                <div key={index} className="cert-card">
                  <div className="cert-icon">
                    <IconComponent className="icon-lg" />
                  </div>
                  <h3>{cert.title}</h3>
                  <p className="cert-year">{cert.year}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="farm-info-section">
          <h2 className="section-title">Farm Information</h2>
          <div className="info-cards">
            <div className="info-card">
              <MapPin className="info-icon" />
              <div className="info-content">
                <h3>Location</h3>
                <p>{profile.location}</p>
              </div>
            </div>
            <div className="info-card">
              <Phone className="info-icon" />
              <div className="info-content">
                <h3>Phone</h3>
                <p>{profile.phone}</p>
              </div>
            </div>
            <div className="info-card">
              <Mail className="info-icon" />
              <div className="info-content">
                <h3>Email</h3>
                <p>{profile.email}</p>
              </div>
            </div>
            <div className="info-card">
              <Clock className="info-icon" />
              <div className="info-content">
                <h3>Hours</h3>
                <p>Mon-Sat: 7:00 AM - 6:00 PM</p>
                <p>Sunday: 8:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </section>

        <section className="story-section">
          <h2 className="section-title">Our Story</h2>
          <div className="story-content">
            <div className="story-text">
              <p>
                Green Valley Farm was founded in 1985 by the Farmer family with a simple vision:
                to provide the community with fresh, healthy, and sustainably grown produce.
                What started as a small 10-acre farm has grown into a thriving 50-acre operation
                that serves over 2,500 customers throughout the region.
              </p>
              <p>
                Our commitment to organic farming practices began in the early 1990s when we
                recognized the importance of sustainable agriculture. In 1995, we became USDA
                Organic Certified, and we have never looked back. Today, we grow over 75 varieties
                of vegetables, fruits, and herbs using regenerative farming techniques that
                improve soil health and support local ecosystems.
              </p>
              <p>
                We believe that farming is more than just growing food. It is about building
                community, protecting the environment, and creating a sustainable future for
                generations to come. Every seed we plant, every harvest we reap, and every
                customer we serve is a testament to that commitment.
              </p>
            </div>
            <div className="story-highlight">
              <Droplet className="highlight-icon" />
              <h3>Sustainable Water Management</h3>
              <p>
                We use drip irrigation and rainwater harvesting systems to conserve water
                and reduce our environmental footprint.
              </p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2>Visit Us Today!</h2>
            <p>Experience the difference of fresh, organic, locally-grown produce.</p>
            <button className="btn-cta">
              <MapPin className="icon-sm" />
              Get Directions
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
