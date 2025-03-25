import { useState, useEffect } from "react";

function EditStudentModal({ student, onClose, fetchStudents }) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toInputDateFormat = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    
    // Adjust for local timezone to prevent day shift
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  
    return localDate.toISOString().split("T")[0];
  };
  

  const splitFullname = (fullname) => {
    const parts = fullname.split(" ");
    return {
      first_name: parts[0] || "",
      middle_name: parts.length > 2 ? parts[1] : "",
      last_name: parts.length > 2 ? parts.slice(2).join(" ") : parts[1] || "",
    };
  };

  const { first_name, middle_name, last_name } = splitFullname(student.fullname);

  const [editedStudent, setEditedStudent] = useState({
    first_name,
    middle_name,
    last_name,
    username: student.username,
    password: "",
    email: student.email,
    phone_number: student.phone_number || "",
    grade: student.grade,
    strand: student.strand,
    section: student.section,
    sex: student.sex,
    date_of_birth: toInputDateFormat(student.date_of_birth),
    address: student.address || "",
  });

  const handleChange = (e) => {
    setEditedStudent({ ...editedStudent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const fullname = `${editedStudent.first_name} ${editedStudent.middle_name} ${editedStudent.last_name}`.trim();

    const response = await fetch("/api/update-student", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editedStudent, fullname }),
    });

    if (response.ok) {
      await fetchStudents();
      onClose();
    } else {
      console.error("Failed to update student");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[700px]">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Edit Student</h2>

        {/* Full Name Row */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-gray-700 font-semibold">First Name</label>
            <input name="first_name" value={editedStudent.first_name} onChange={handleChange} className="border p-2 w-full rounded-md" placeholder="First name" />
          </div>
          <div>
            <label className="text-gray-700 font-semibold">Middle Name</label>
            <input name="middle_name" value={editedStudent.middle_name} onChange={handleChange} className="border p-2 w-full rounded-md" placeholder="Middle name" />
          </div>
          <div>
            <label className="text-gray-700 font-semibold">Last Name</label>
            <input name="last_name" value={editedStudent.last_name} onChange={handleChange} className="border p-2 w-full rounded-md" placeholder="Last name" />
          </div>
        </div>

        {/* Two Fields per Row */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-gray-700 font-semibold">Username</label>
            <input name="username" value={editedStudent.username} onChange={handleChange} className="border p-2 w-full rounded-md" placeholder="Enter username" />
          </div>
          <div>
            <label className="text-gray-700 font-semibold">Email</label>
            <input name="email" value={editedStudent.email} onChange={handleChange} className="border p-2 w-full rounded-md" placeholder="Enter email" />
          </div>
          <div>
            <label className="text-gray-700 font-semibold">Phone Number</label>
            <input name="phone_number" value={editedStudent.phone_number} onChange={handleChange} className="border p-2 w-full rounded-md" placeholder="Enter phone number" />
          </div>
          <div>
            <label className="text-gray-700 font-semibold">Sex</label>
            <select name="sex" value={editedStudent.sex} onChange={handleChange} className="border p-2 w-full rounded-md">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="text-gray-700 font-semibold">Grade</label>
            <select name="grade" value={editedStudent.grade} onChange={handleChange} className="border p-2 w-full rounded-md">
              <option value="11">11</option>
              <option value="12">12</option>
            </select>
          </div>
          <div>
            <label className="text-gray-700 font-semibold">Strand</label>
            <select name="strand" value={editedStudent.strand} onChange={handleChange} className="border p-2 w-full rounded-md">
              <option value="STEM">STEM</option>
              <option value="HUMSS">HUMSS</option>
              <option value="ABM">ABM</option>
            </select>
          </div>
          <div>
            <label className="text-gray-700 font-semibold">Section</label>
            <select name="section" value={editedStudent.section} onChange={handleChange} className="border p-2 w-full rounded-md">
              <option value="Rizal">Rizal</option>
              <option value="Mabini">Mabini</option>
            </select>
          </div>
        </div>

{/* Date of Birth (Two Rows) */}
<div className="mt-4 grid grid-cols-2 gap-4">
  {/* Date Picker Input */}
  <div>
    <label className="text-gray-700 font-semibold">Date of Birth</label>
    <input 
      name="date_of_birth" 
      type="date" 
      value={editedStudent.date_of_birth} 
      onChange={handleChange} 
      className="border p-2 w-full rounded-md" 
    />
  </div>
  
  {/* Formatted Date Display */}
  <div className="flex items-end">
    {editedStudent.date_of_birth && (
      <span className="text-black text-lg">
        {formatDate(editedStudent.date_of_birth)}
      </span>
    )}
  </div>
</div>

        {/* Address (Single Row) */}
        <div className="mt-4">
          <label className="text-gray-700 font-semibold">Address</label>
          <input name="address" value={editedStudent.address} onChange={handleChange} className="border p-2 w-full rounded-md" placeholder="Enter address" />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-md w-1/2 mr-2 hover:bg-blue-700">
            Save Changes
          </button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md w-1/2 hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditStudentModal;
