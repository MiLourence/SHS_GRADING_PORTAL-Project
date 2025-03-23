import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiUser, FiBook, FiBell, FiSearch ,FiPlus , FiLogOut, FiMenu, FiGrid, FiUserPlus, FiHelpCircle } from "react-icons/fi";

export default function AdviserDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [students, setStudents] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [fullname, setFullname] = useState("");
  const router = useRouter();

  useEffect(() => {
    const usertype = localStorage.getItem("usertype");
    const storedFullname = localStorage.getItem("fullname");

    if (usertype !== "adviser") {
        router.replace("/404"); // Redirect if the user is not an adviser
    } else {
        setIsAuthorized(true);
        setFullname(storedFullname || "Adviser");
        setStudents([
            { id: 1, name: "John Doe", section: "john@example.com", strand: "STEM" },
            { id: 2, name: "Jane Smith", section: "jane@example.com", strand: "HUMSS" }
        ]);
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
          <SidebarItem icon={FiGrid} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiUserPlus} label="Students" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiBook} label="Subjects" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
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
          {activeTab === "Dashboard" && <Dashboard />}
          {activeTab === "Students" && <Students students={students} />}
          {activeTab === "Subjects" && <Subjects />}
          {activeTab === "Help" && <Help />} 
        </div>
      </main>
    </div>
  );
}

function Dashboard() {
    return (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">

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

function Students({ students }) {
    return (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md text-black">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <FiPlus /> Add Student
              </button>

              <div className="flex items-center gap-3">
                <select className="border px-3 py-2 rounded-lg">
                  <option>Grade 11</option>

                </select>
                <select className="border px-3 py-2 rounded-lg">
                  <option>STEM</option>

                </select>
                <div className="relative">
                  <input type="text" placeholder="Search" className="border px-3 py-2 rounded-lg pl-10" />
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Student Table */}
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3">#</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Section</th>
                  <th className="p-3">Strand</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student, index) => (
                    <tr key={student.id} className="border text-center">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{student.name}</td>
                      <td className="p-3">{student.section}</td>
                      <td className="p-3">{student.strand}</td>
                      <td className="p-3 space-x-2">
                        <button className="text-green-600">Edit</button>
                        <button className="text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-3 text-center text-gray-500">No students found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
    );
  }

  function Subjects() { 
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
  