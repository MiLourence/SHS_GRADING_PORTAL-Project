import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiUser, FiBook, FiBell, FiSearch ,FiPlus , FiLogOut, FiMenu, FiGrid, FiUserPlus, FiHelpCircle } from "react-icons/fi";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [fullname, setFullname] = useState("");
  const router = useRouter();

  useEffect(() => {
    const usertype = localStorage.getItem("usertype");
    const storedFullname = localStorage.getItem("fullname");

    if (usertype !== "user") {  // Allow users, not just advisers
        router.replace("/404"); // Redirect if not a student
    } else {
        setIsAuthorized(true);
        setFullname(storedFullname || "Student");
    }
}, []);

  if (isAuthorized === null) return null;

  const handleLogout = () => {
    localStorage.removeItem("fullname");
    localStorage.removeItem("usertype"); // Clear user type
    router.push("/login_form");
  };

  return (
    <div className="flex min-h-screen font-poppins bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white text-black transition-all ${isSidebarOpen ? "w-64 p-5" : "w-20 p-3"} min-h-screen fixed md:relative`}>
        <div className="flex items-center justify-between">
          {isSidebarOpen && <img src="/images/logo.png" alt="Logo" className="h-18 w-auto" />}
          <button className="text-black p-1 pl-3.5 pb-0" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FiMenu size={28} />
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          <SidebarItem icon={FiUser} label="Profile" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiBook} label="Grades" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiHelpCircle} label="Help" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <li className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-gray-300 transition cursor-pointer mt-6" onClick={handleLogout}>
            <FiLogOut size={28} />
            {isSidebarOpen && <span>Log Out</span>}
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-auto ml-[5rem] md:ml-0 text-black">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">{activeTab}</h2>
          <div className="flex items-center gap-5">
            <button className="relative p-2 rounded-full hover:bg-gray-200 transition">
              <FiBell size={24} />
            </button>

            {/* Profile Dropdown */}
            <div className="relative group" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
              <button className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">A</div>
                <span className="font-semibold text-black">{fullname}</span> {/* Display full name */}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-0 w-30 bg-white border rounded-lg shadow-lg z-50">
                  <ul className="py-2">
                    <li className="px-4 py-2 hover:bg-gray-200 flex items-center gap-2 cursor-pointer">
                      <FiUser size={18} /> Profile
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-200 flex items-center gap-2 cursor-pointer" onClick={handleLogout}>
                      <FiLogOut size={18} /> Log Out
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="font-poppins">
          {activeTab === "Profile" && <Profile />}
          {activeTab === "Grades" && <Grades />}
          {activeTab === "Help" && <Help />} 
        </div>
      </main>
    </div>
  );
}

/* Sidebar Item Component */
function SidebarItem({ icon: Icon, label, activeTab, setActiveTab, isSidebarOpen }) {
  return (
    <li
      className={`flex items-center gap-4 p-3 rounded-lg transition 
        ${activeTab === label ? "bg-gray-300" : "hover:bg-gray-300"} 
        ${isSidebarOpen ? "" : "justify-center"}`}
      onClick={() => setActiveTab(label)}
    >
      <Icon size={28} />
      {isSidebarOpen && <span>{label}</span>}
    </li>
  );
}



function Profile() { 
    return (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">

      </div>
    );
}

function Grades() { 
    return (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">

      </div>
    );
}

function Help() { 
    return (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Help & Support</h2>
        <p className="text-gray-600">
          If you need assistance, please refer to the user guide or contact support.
        </p>
        <ul className="list-disc list-inside mt-4 text-gray-700">
          <li>To add a student, click "Add Student Account."</li>
          <li>Use the filters to find students by grade or strand.</li>
          <li>Click "Edit" to modify student details.</li>
          <li>Click "Delete" to remove a student account.</li>
        </ul>
      </div>
    );
  }
  