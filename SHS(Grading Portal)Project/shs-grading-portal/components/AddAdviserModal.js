import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AddAdviserModal({ onClose, onAdviserAdded }) {
    const [adviser, setAdviser] = useState({
        fullname: "",
        email: "",
        password: "",
        strand: "ABM",
        section: "Rizal",
    });

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        setAdviser({ ...adviser, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!adviser.fullname.trim() || !adviser.email.trim() || !adviser.password.trim() || !adviser.strand.trim() || !adviser.section.trim()) {
            setError("All fields are required.");
            return;
        }
    
        try {
            const response = await fetch("/api/add_adviser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(adviser),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || "Failed to add adviser.");
            }
    
            onAdviserAdded();
            onClose();
        } catch (error) {
            setError(error.message);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg border shadow-lg max-w-md w-full">
                <h2 className="text-md font-semibold mb-3">Add New Adviser</h2>
                {error && <p className="text-red-500 text-xs">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-2">
                    {/* Full Name Input */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Full Name</label>
                        <input type="text" name="fullname" value={adviser.fullname} onChange={handleChange} placeholder="Full Name" className="w-full p-1.5 text-sm border rounded" required />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={adviser.email} onChange={handleChange} placeholder="Email" className="w-full p-1.5 text-sm border rounded" required />
                    </div>

                    {/* Password Input with Toggle Visibility */}
                    <div className="relative">
                        <label className="block text-xs font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={adviser.password}
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

                    {/* Strand Selection */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Strand</label>
                        <select name="strand" value={adviser.strand} onChange={handleChange} className="w-full p-1.5 text-sm border rounded">
                            <option value="ABM">ABM</option>
                            <option value="HUMMS">HUMMS</option>
                            <option value="STEM">STEM</option>
                        </select>
                    </div>

                    {/* Section Selection */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Section</label>
                        <select name="section" value={adviser.section} onChange={handleChange} className="w-full p-1.5 text-sm border rounded">
                            <option value="Rizal">Rizal</option>
                            <option value="Mabini">Mabini</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded">
                            Add Adviser
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddAdviserModal;
