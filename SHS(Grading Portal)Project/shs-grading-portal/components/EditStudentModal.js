import { useState, useEffect } from "react";

function EditStudentModal({ student, onClose, fetchStudents }) {
  const [sections, setSections] = useState([]);
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
;


useEffect(() => {
  const fetchSections = async () => {
    try {
      const res = await fetch("/api/sections");
      const data = await res.json();
      console.log("Fetched sections:", data);
      setSections(Array.isArray(data) ? data : []);

      // Ensure section is set only if it exists in the fetched data
      if (student.section_id) {
        const validSection = data.some(sec => String(sec.id) === String(student.section_id));
        setEditedStudent(prev => ({
          ...prev,
          section_id: validSection ? String(student.section_id) : "", // Set if valid, otherwise empty
        }));
      }
    } catch (error) {
      console.error("Failed to fetch sections:", error);
      setSections([]);
    }
  };

  fetchSections();
}, [student.section_id]);

  const toInputDateFormat = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    // Adjust for local timezone to prevent day shift
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    return localDate.toISOString().split("T")[0];
  };

  const splitFullname = (fullname) => {
    const parts = fullname.trim().split(/\s+/); // Split by spaces while removing extra spaces
    if (parts.length === 2) {
      return {
        first_name: parts[0], // First word
        middle_name: "", // No middle name
        last_name: parts[1], // Second word is last name
      };
    } else if (parts.length >= 3) {
      return {
        first_name: parts[0] + (parts.length > 3 ? " " + parts[1] : ""), // First two words if more than 3 parts
        middle_name: parts.length > 3 ? parts[2] : parts[1], // Third word (or second word if only 3 parts)
        last_name: parts.slice(parts.length > 3 ? 3 : 2).join(" "), // Everything else is last name
      };
    } else {
      return { first_name: parts[0] || "", middle_name: "", last_name: "" };
    }
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
    section_id: student.section_id ? String(student.section_id) : "", // Ensure it's a string
    sex: student.sex,
    date_of_birth: toInputDateFormat(student.date_of_birth),
    address: student.address || "",
  });

  const [errors, setErrors] = useState({}); // Add this state

  const handleChange = (e) => {
    setEditedStudent({ ...editedStudent, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error when user edits
  };

  const handleSubmit = async () => {
    const fullname = `${editedStudent.first_name} ${editedStudent.middle_name} ${editedStudent.last_name}`.trim();

    // 🔹 Check if username or email is already taken before sending the update request
    const checkResponse = await fetch("/api/check-username-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: editedStudent.username, email: editedStudent.email, studentId: student.id }),
    });

    const checkData = await checkResponse.json();
    if (!checkResponse.ok) {
      setErrors({ username: checkData.username || "", email: checkData.email || "" });
      return; // Stop submission if errors exist
    }

    // Ensure the section is only updated if the user changed it
    const formattedData = {
      ...editedStudent,
      section_id: editedStudent.section_id !== "" ? editedStudent.section_id : student.section_id,
      fullname,
      id: student.id,
    };

    const response = await fetch("/api/update-student", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData),
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

        {/* Username & Password */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-gray-700 font-semibold">Username</label>
            <input
              name="username"
              value={editedStudent.username}
              onChange={handleChange}
              className={`border p-2 w-full rounded-md ${errors.username ? "border-red-500" : ""}`}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>
          <div>
            <label className="text-gray-700 font-semibold">Password (Optional)</label>
            <input name="password" type="password" onChange={handleChange} className="border p-2 w-full rounded-md" />
          </div>
        </div>

        {/* Email, Phone Number, and Sex Row */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="text-gray-700 font-semibold">Email</label>
            <input
              name="email"
              value={editedStudent.email}
              onChange={handleChange}
              className={`border p-2 w-full rounded-md ${errors.email ? "border-red-500" : ""}`}
              placeholder={errors.email || "Enter email"}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
        </div>

        {/* Grade, Strand, and Section Row */}
        <div className="grid grid-cols-3 gap-4 mt-4">
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
            <select name="section_id" value={editedStudent.section_id} onChange={handleChange} className="border p-2 w-full rounded-md">
              <option value="">No Section</option>
              {sections.map((section) => (
                <option key={section.id} value={String(section.id)}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date of Birth Row */}
        <div className="mt-4 grid grid-cols-2 gap-4">
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
          <div className="flex items-end">
            {editedStudent.date_of_birth && (
              <span className="text-black text-lg">
                {formatDate(editedStudent.date_of_birth)}
              </span>
            )}
          </div>
        </div>

        {/* Address Row */}
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
