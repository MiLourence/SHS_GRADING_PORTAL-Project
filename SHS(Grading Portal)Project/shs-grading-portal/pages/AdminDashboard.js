import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import AddStudentModal from "@/components/AddStudentModal";
import AddAdviserModal from "@/components/AddAdviserModal";
import EditStudentModal from "@/components/EditStudentModal";
import { FiUser, FiBook, FiBell, FiSearch, FiPlus, FiLogOut, FiMenu, FiGrid, FiUserPlus, FiHelpCircle, FiUserCheck, FiTrash, FiEye, FiEdit } from "react-icons/fi";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Student Management");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [students, setStudents] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [fullname, setFullname] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [advisers, setAdvisers] = useState([]);
  const [advisersLoading, setAdvisersLoading] = useState(true);
  const [advisersError, setAdvisersError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const usertype = localStorage.getItem("usertype");
    const storedFullname = localStorage.getItem("fullname");

    if (!usertype || usertype !== "admin") {
      router.replace("/404"); // Redirect if not admin
    } else {
      setIsAuthorized(true);
      setFullname(storedFullname || "Admin");
      fetchStudents();
      fetchAdvisers();
    }
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students");
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvisers = async () => {
    try {
      const res = await fetch('/api/advisers'); // Change '/api/adviser' to '/api/advisers'
      if (!res.ok) throw new Error('Failed to fetch advisers');
      const data = await res.json();
      setAdvisers(data || []); // Ensure it's always an array
    } catch (error) {
      console.error(error);
      setAdvisersError(error.message);
    } finally {
      setAdvisersLoading(false);
    }
  };


  if (isAuthorized === null) return null;

  const handleLogout = () => {
    Swal.fire({
      title: "Log Out?",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      width: "350px", // Smaller width
      padding: "10px", // Less padding
      customClass: {
        title: "text-lg", // Slightly smaller title
        content: "text-sm", // Smaller text
        confirmButton: "px-4 py-1 text-sm", // Smaller button
        cancelButton: "px-4 py-1 text-sm", // Smaller button
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("fullname");
        localStorage.removeItem("usertype");
        router.push("/login_form");
      }
    });
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
          <SidebarItem icon={FiUserPlus} label="Student Management" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiUserCheck} label="Adviser Management" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
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
          {activeTab === "Student Management" && (
            <Students students={students} loading={loading} error={error} fetchStudents={fetchStudents} />
          )}
          {activeTab === "Adviser Management" && (
            <AdviserManagement
              advisers={advisers}
              loading={advisersLoading}
              error={advisersError}
              fetchAdvisers={fetchAdvisers}
            />
          )}
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

/* Students Component */
function Students({ students, loading, error, fetchStudents }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const handleStudentAdded = async () => {
    setIsModalOpen(false);
    await fetchStudents();
  };

  const openViewModal = (student) => {
    setSelectedStudent(student);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedStudent(null);
    setViewModalOpen(false);
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedStudent(null);
    setEditModalOpen(false);
  };

  const handleDeleteStudent = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`/api/students?id=${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete student");
        }

        await fetchStudents(); // Refresh the list
        alert("Student deleted successfully!");
    } catch (error) {
        console.error(error);
        alert("Error deleting student.");
    }
};

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md text-black">
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <FiPlus /> Add Student Account
        </button>

        <div className="flex items-center gap-3">
          <select className="border px-3 py-2 rounded-lg">
            <option>Grade 11</option>
            <option>Grade 12</option>
          </select>
          <select className="border px-3 py-2 rounded-lg">
            <option>STEM</option>
            <option>HUMSS</option>
            <option>ABM</option>
          </select>
          <div className="relative">
            <input type="text" placeholder="Search" className="border px-3 py-2 rounded-lg pl-10" />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Show Add Student Modal */}
      {isModalOpen && (
        <AddStudentModal onClose={() => setIsModalOpen(false)} onStudentAdded={handleStudentAdded} />
      )}

      {/* Show View Student Modal */}
      {viewModalOpen && selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Student Details</h2>
            <div className="text-sm space-y-2">
              <p><strong>Full Name:</strong> {selectedStudent.fullname}</p>
              <p><strong>Username:</strong> {selectedStudent.username}</p>
              <p><strong>Email:</strong> {selectedStudent.email}</p>
              <p><strong>Phone Number:</strong> {selectedStudent.phone_number}</p>
              <p><strong>Grade:</strong> {selectedStudent.grade}</p>
              <p><strong>Sex:</strong> {selectedStudent.sex}</p>
              <p><strong>Strand:</strong> {selectedStudent.strand}</p>
              <p><strong>Section:</strong> {selectedStudent.section}</p>
              <p><strong>Date of Birth:</strong> {new Date(selectedStudent.date_of_birth).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}</p> {/* FORMATTED DATE */}
              <p><strong>Address:</strong> {selectedStudent.address}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={closeViewModal} className="px-4 py-2 bg-gray-500 text-white rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show Edit Student Modal */}
      {editModalOpen && selectedStudent && (
        <EditStudentModal
          student={{ ...selectedStudent }} // Ensures a fresh object
          onClose={closeEditModal}
          fetchStudents={fetchStudents}
        />
      )}

      {/* Show loading or error message */}
      {loading ? (
        <p className="text-center text-gray-600">Loading students...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3">#</th>
              <th className="p-3">Full Name</th>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Grade</th>
              <th className="p-3">Strand</th>
              <th className="p-3">Sex</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student, index) => (
                <tr key={student.id} className="border text-center">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{student.fullname}</td>
                  <td className="p-3">{student.username}</td>
                  <td className="p-3">{student.email}</td>
                  <td className="p-3">{student.grade}</td>
                  <td className="p-3">{student.strand}</td>
                  <td className="p-3">{student.sex}</td>
                  <td className="p-3 flex justify-center space-x-3">
                    <button className="text-blue-600 hover:text-blue-800" onClick={() => openViewModal(student)}>
                      <FiEye size={18} />
                    </button>
                    <button className="text-green-600 hover:text-green-800" onClick={() => openEditModal(student)}>
                      <FiEdit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteStudent(student.id)}>
                      <FiTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-3 text-center text-gray-500">No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}


/* Adviser Component */
function AdviserManagement({ advisers, loading, error, fetchAdvisers }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdviserAdded = async () => {
    setIsModalOpen(false);
    await fetchAdvisers();
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md text-black">
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <FiPlus /> Add Adviser
        </button>

        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="border px-3 py-2 rounded-lg pl-10"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Add Adviser Modal */}
      {isModalOpen && (
        <AddAdviserModal onClose={() => setIsModalOpen(false)} onAdviserAdded={handleAdviserAdded} />
      )}

      {/* Loading or Error Handling */}
      {loading ? (
        <p className="text-center text-gray-600">Loading advisers...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3">#</th>
              <th className="p-3">Full Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Strand</th>
              <th className="p-3">Section</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {advisers.length > 0 ? (
              advisers.map((adviser, index) => (
                <tr key={adviser.id} className="border text-center">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{adviser.fullname || "N/A"}</td>
                  <td className="p-3">{adviser.email || "N/A"}</td>
                  <td className="p-3">{adviser.strand || "N/A"}</td>
                  <td className="p-3">{adviser.section || "N/A"}</td>
                  <td className="p-3 flex justify-center space-x-3">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FiEye size={18} />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <FiEdit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FiTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500">
                  No advisers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
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
