import { useState } from "react";

function EditStudentModal({ student, onClose, fetchStudents }) {
  const [editedStudent, setEditedStudent] = useState({
    fullname: student.fullname,
    username: student.username,
    password: "",
    email: student.email,
    grade: student.grade,
    strand: student.strand,
    section: student.section,
    sex: student.sex,
    date_of_birth: student.date_of_birth, // Added date_of_birth
    address: student.address, // Added address
  });

  const handleChange = (e) => {
    setEditedStudent({ ...editedStudent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const response = await fetch("/api/update-student", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedStudent),
    });

    if (response.ok) {
      await fetchStudents();
      onClose();
    } else {
      console.error("Failed to update student");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Edit Student</h2>

        <input name="fullname" value={editedStudent.fullname} onChange={handleChange} placeholder="Full Name" className="border p-2 w-full mb-2" />
        <input name="username" value={editedStudent.username} onChange={handleChange} placeholder="Username" className="border p-2 w-full mb-2" />
        <input name="password" type="password" onChange={handleChange} placeholder="New Password (optional)" className="border p-2 w-full mb-2" />
        <input name="email" value={editedStudent.email} onChange={handleChange} placeholder="Email" className="border p-2 w-full mb-2" />

        {/* Grade Dropdown */}
        <select name="grade" value={editedStudent.grade} onChange={handleChange} className="border p-2 w-full mb-2">
          <option value={student.grade} hidden>{student.grade}</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>

        {/* Strand Dropdown */}
        <select name="strand" value={editedStudent.strand} onChange={handleChange} className="border p-2 w-full mb-2">
          <option value={student.strand} hidden>{student.strand}</option>
          <option value="STEM">STEM</option>
          <option value="HUMSS">HUMSS</option>
          <option value="ABM">ABM</option>
        </select>

        {/* Section Dropdown */}
        <select name="section" value={editedStudent.section} onChange={handleChange} className="border p-2 w-full mb-2">
          <option value={student.section} hidden>{student.section}</option>
          <option value="Rizal">Rizal</option>
          <option value="Mabini">Mabini</option>
        </select>

        {/* Sex Dropdown */}
        <select name="sex" value={editedStudent.sex} onChange={handleChange} className="border p-2 w-full mb-2">
          <option value={student.sex} hidden>{student.sex}</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {/* Date of Birth */}
        <input name="date_of_birth" type="date" value={editedStudent.date_of_birth} onChange={handleChange} className="border p-2 w-full mb-2" />

        {/* Address */}
        <input name="address" value={editedStudent.address} onChange={handleChange} placeholder="Address" className="border p-2 w-full mb-2" />

        {/* Buttons */}
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full mt-2">
          Save Changes
        </button>
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg w-full mt-2">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditStudentModal;
