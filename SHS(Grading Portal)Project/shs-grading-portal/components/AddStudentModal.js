import { useState } from "react";
import bcrypt from "bcryptjs";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons from react-icons

function AddStudentModal({ onClose, onStudentAdded }) {
    const [student, setStudent] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        username: "",
        password: "",
        email: "",
        grade: "11",
        strand: "ABM",
        section: "Rizal",
        sex: "Male",
    });

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields (ensure they are not empty)
        if (
            !student.firstName.trim() ||
            !student.lastName.trim() ||
            !student.username.trim() ||
            !student.password.trim() ||
            !student.email.trim() ||
            !student.strand.trim() ||
            !student.grade.trim() ||
            !student.section.trim() ||
            !student.sex.trim()
        ) {
            setError("All fields are required.");
            return;
        }

        const fullName = `${student.firstName} ${student.middleName} ${student.lastName}`.trim();

        try {
            // Hash the password before sending to the backend
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(student.password, salt);

            const response = await fetch("/api/add_student", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    ...student, 
                    fullname: fullName,
                    password: hashedPassword, // Send hashed password
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add student.");
            }

            const newStudent = await response.json();
            onStudentAdded(newStudent);
            onClose();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg border shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto relative">
                <h2 className="text-md font-semibold mb-3">Add New Student Account</h2>
                {error && <p className="text-red-500 text-xs">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-2">
                    {/* Full Name Inputs */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Full Name</label>
                        <div className="flex space-x-2">
                            <input type="text" name="firstName" value={student.firstName} onChange={handleChange} placeholder="First Name" className="w-1/3 p-1.5 text-sm border rounded" required />
                            <input type="text" name="middleName" value={student.middleName} onChange={handleChange} placeholder="Middle Name" className="w-1/3 p-1.5 text-sm border rounded" />
                            <input type="text" name="lastName" value={student.lastName} onChange={handleChange} placeholder="Last Name" className="w-1/3 p-1.5 text-sm border rounded" required />
                        </div>
                    </div>

                    {/* Username Input */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Username</label>
                        <input type="text" name="username" value={student.username} onChange={handleChange} placeholder="Username" className="w-full p-1.5 text-sm border rounded" required />
                    </div>

                    {/* Password Input with Toggle Visibility */}
                    <div className="relative">
                        <label className="block text-xs font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={student.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full p-1.5 text-sm border rounded pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={student.email} onChange={handleChange} placeholder="Email" className="w-full p-1.5 text-sm border rounded" required />
                    </div>

                    {/* Grade Selection */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Grade</label>
                        <select name="grade" value={student.grade} onChange={handleChange} className="w-full p-1.5 text-sm border rounded">
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                    </div>

                    {/* Strand Selection */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Strand</label>
                        <select name="strand" value={student.strand} onChange={handleChange} className="w-full p-1.5 text-sm border rounded">
                            <option value="ABM">ABM</option>
                            <option value="HUMMS">HUMMS</option>
                            <option value="STEM">STEM</option>
                        </select>
                    </div>

                    {/* Section Selection */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Section</label>
                        <select name="section" value={student.section} onChange={handleChange} className="w-full p-1.5 text-sm border rounded">
                            <option value="Rizal">Rizal</option>
                            <option value="Mabini">Mabini</option>
                        </select>
                    </div>

                    {/* Sex Selection */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Sex</label>
                        <select name="sex" value={student.sex} onChange={handleChange} className="w-full p-1.5 text-sm border rounded">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded">
                            Add Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddStudentModal;
