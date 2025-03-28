import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AddAdviserModal({ onClose, onAdviserAdded }) {
    const [adviser, setAdviser] = useState({
        fullname: "",
        email: "",
        password: "",
        strand: "ABM",
        section_id: "", // Change section to section_id
    });

    const [sections, setSections] = useState([]); // Store available sections
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Fetch available sections when the modal opens
    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await fetch("/api/sections");
                if (!response.ok) {
                    throw new Error("Failed to fetch sections.");
                }
                const data = await response.json();
                setSections(data);
            } catch (err) {
                console.error(err);
                setError("Error fetching sections.");
            }
        };
        fetchSections();
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        setAdviser({ ...adviser, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!adviser.fullname.trim() || !adviser.email.trim() || !adviser.password.trim() || !adviser.section_id) {
            setError("All fields are required.");
            return;
        }
    
        try {
            const response = await fetch("/api/add_adviser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullname: adviser.fullname,
                    email: adviser.email,
                    password: adviser.password,
                    strand: adviser.strand,
                    section: adviser.section_id, // ✅ Send section_id as section
                }),
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
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Adviser</h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="fullname"
                            value={adviser.fullname}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full p-2 text-sm border rounded"
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={adviser.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full p-2 text-sm border rounded"
                            required
                        />
                    </div>

                    {/* Password Input with Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={adviser.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full p-2 text-sm border rounded pr-10"
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

                    {/* Strand & Section Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Strand</label>
                            <select
                                name="strand"
                                value={adviser.strand}
                                onChange={handleChange}
                                className="w-full p-2 text-sm border rounded"
                            >
                                <option value="ABM">ABM</option>
                                <option value="HUMMS">HUMMS</option>
                                <option value="STEM">STEM</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Section</label>
                            <select
                                name="section_id"
                                value={adviser.section_id}
                                onChange={handleChange}
                                className="w-full p-2 text-sm border rounded"
                                required
                            >
                                <option value="">Select a Section</option>
                                {sections.length > 0 ? (
                                    sections.map((section) => (
                                        <option key={section.id} value={section.id}>
                                            {section.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No sections available</option>
                                )}
                            </select>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                            Add Adviser
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddAdviserModal;
