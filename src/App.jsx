import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { Route, Routes, useNavigate } from "react-router-dom";

// import PartnerDashboard from "./components/dashboard/PartnerDashboard";
// import Conversions from "./components/conversions/Conversions";
import Sidebar from "./components/common/Sidebar";
import Partners from "./components/partners/Partners";
import Conversions from "./components/conversions/Conversions";
import Commissions from "./components/commissions/Commissions";
import PartnerApprovals from "./components/partner-approvals/PartnerApprovals";
import Payouts from "./components/payouts/Payouts";
import Dashboard from "./components/dashboard/Dashboard";
import Announcements from "./components/announcements/Announcements";
import Login from "./components/login/Login";
// import RequestPayouts from "./components/request-payout/RequestPayout";
// import PaymentMethod from "./components/paymont-method/PaymentMethod";
// import PayoutHistory from "./components/payout-history/PayoutHistory";
// import Announcements from "./components/announcements/Announcements";
// import EditProfile from "./components/edit-profile/EditProfile";
// import ChangePassword from "./components/change-password/ChangePassword";
// import Login from "./components/login/Login";
// import Signup from "./components/signup/Signup";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  // console.log(users);
  useEffect(() => {
    handleAuth();
  }, []);

  const handleAuth = () => {
    const storedUser = localStorage.getItem("user");
    // const storedUsers = localStorage.getItem("users");

    // setUsers(storedUsers ? JSON.parse(storedUsers) : []);

    if (storedUser) {
      const currentUser = JSON.parse(storedUser);
      if (
        currentUser.email == "admin@cronberry.com" &&
        currentUser.password == "admin@123"
      ) {
        setUser(currentUser);
        setIsLoggedIn(true);
        navigate("/");
      } else {
        localStorage.removeItem("user");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
        <div className="flex h-screen w-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/" element={<></>} /> */}
            <Route path="/partners" element={<Partners />} />

            <Route path="/conversions" element={<Conversions />} />
            <Route path="/commissions" element={<Commissions />} />
            <Route path="/partner-approvals" element={<PartnerApprovals />} />
            <Route path="/payouts" element={<Payouts />} />
            <Route path="/announcements" element={<Announcements />} />
            {/* <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/change-password" element={<ChangePassword />} /> */}
          </Routes>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex h-screen w-screen">
        <Routes>
          <Route
            path="/login"
            element={<Login setUser={setUser} setIsLoggedIn={setIsLoggedIn} />}
          />
        </Routes>
      </div>
    );
  }
}

export default App;
