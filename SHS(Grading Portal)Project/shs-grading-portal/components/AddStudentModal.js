import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AddStudentModal({ onClose, onStudentAdded }) {
    const [student, setStudent] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        username: "",
        password: "",
        email: "",
        phone_number: "",
        grade: "11",
        strand: "ABM",
        section_id: "",
        sex: "Male",
        date_of_birth: "",
        address: ""
    });

    const [sections, setSections] = useState([]);

    useEffect(() => {
        fetch("/api/sections")
            .then((res) => res.json())
            .then((data) => setSections(data))
            .catch((err) => console.error("Error fetching sections:", err));
    }, []);

    const [error, setError] = useState(""); // Add this state
    const [errors, setErrors] = useState({ email: "", username: "" });
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ email: "", username: "" });
        setError(""); // Clear previous error messages

        // Trim all string values
        const trimmedStudent = Object.fromEntries(
            Object.entries(student).map(([key, value]) => [
                key,
                typeof value === "string" ? value.trim() : value
            ])
        );

        // Ensure all fields are filled
        if (Object.values(trimmedStudent).some((field) => field === "")) {
            setError("All fields are required.");
            return;
        }

        const fullName = `${trimmedStudent.firstName} ${trimmedStudent.middleName} ${trimmedStudent.lastName}`.trim();

        try {
            const response = await fetch("/api/add_student", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...trimmedStudent, fullname: fullName, section: trimmedStudent.section_id }),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.field === "email") {
                    setErrors((prev) => ({ ...prev, email: result.message }));
                } else if (result.field === "username") {
                    setErrors((prev) => ({ ...prev, username: result.message }));
                } else {
                    setError(result.message);
                }
                return;
            }

            onStudentAdded(result);
            onClose();
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Student</h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name Inputs */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <div className="grid grid-cols-3 gap-3">
                            <input type="text" name="firstName" value={student.firstName} onChange={handleChange} placeholder="First Name" className="w-full p-2 text-sm border rounded" required />
                            <input type="text" name="middleName" value={student.middleName} onChange={handleChange} placeholder="Middle Name" className="w-full p-2 text-sm border rounded" />
                            <input type="text" name="lastName" value={student.lastName} onChange={handleChange} placeholder="Last Name" className="w-full p-2 text-sm border rounded" required />
                        </div>
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={student.username}
                            onChange={handleChange}
                            placeholder="Username"
                            className={`w-full p-2 text-sm border rounded ${errors.username ? "border-red-500" : ""}`}
                            required
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={student.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full p-2 text-sm border rounded pr-10"
                                required
                            />
                            <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {/* Email & Phone Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Details</label>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="email"
                                name="email"
                                value={student.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className={`w-full p-2 text-sm border rounded ${errors.email ? "border-red-500" : ""}`}
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            <input type="tel" name="phone_number" value={student.phone_number} onChange={handleChange} placeholder="Phone Number" className="w-full p-2 text-sm border rounded" required />
                        </div>
                    </div>

                    {/* Grade, Strand, Section */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Grade</label>
                            <select name="grade" value={student.grade} onChange={handleChange} className="w-full p-2 text-sm border rounded">
                                <option value="11">Grade 11</option>
                                <option value="12">Grade 12</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Strand</label>
                            <select name="strand" value={student.strand} onChange={handleChange} className="w-full p-2 text-sm border rounded">
                                <option value="ABM">ABM</option>
                                <option value="HUMMS">HUMMS</option>
                                <option value="STEM">STEM</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Section</label>
                            <select name="section_id" value={student.section_id} onChange={handleChange} className="w-full p-2 text-sm border rounded">
                                <option value="">Select Section</option>
                                {sections.map((section) => (
                                    <option key={section.id} value={section.id}>
                                        {section.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Sex & Date of Birth */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Sex</label>
                            <select name="sex" value={student.sex} onChange={handleChange} className="w-full p-2 text-sm border rounded">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            <input type="date" name="date_of_birth" value={student.date_of_birth} onChange={handleChange} className="w-full p-2 text-sm border rounded" required />
                        </div>
                    </div>
                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input type="text" name="address" value={student.address} onChange={handleChange} placeholder="Address" className="w-full p-2 text-sm border rounded" required />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white text-sm rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded">Add Student</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddStudentModal;
