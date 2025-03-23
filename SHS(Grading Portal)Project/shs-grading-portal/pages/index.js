import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

export default function Homepage() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="font-poppins">
            {/* Navbar Section */}
            <section className="bg-white shadow-md">
                <div className="container mx-auto px-14 py-4 flex justify-between items-center">
                    {/* Logo Image */}
                    <Link href="/">
                        <Image
                            src="/images/logo.png"
                            alt="Logo"
                            width={80}
                            height={50}
                            className="cursor-pointer"
                        />
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-6">
                        <a href="#home" className="font-medium text-black hover:text-blue-500 transition">Home</a>
                        <a href="#about" className="font-medium text-black hover:text-blue-500 transition">About Us</a>
                        <a href="#grades" className="font-medium text-black hover:text-blue-500 transition">Grading System</a>
                        <a href="#contact" className="font-medium text-black hover:text-blue-500 transition">Contacts</a>
                    </div>

                    {/* Sign Up and Login Buttons */}
                    <div className="hidden md:flex space-x-4">
                        <Link href="/login_form">
                            <button className="bg-transparent border border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition">
                                Login
                            </button>
                        </Link>

                       {/*   <Link href="/signup_form">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
                                Sign Up
                            </button>
                        </Link>
                    </div> */}
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-600 focus:outline-none">
                        ☰
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden bg-white shadow-md py-4 px-14">
                        <a href="#home" className="block py-2 text-black hover:text-blue-500 transition">Home</a>
                        <a href="#about" className="block py-2 text-black hover:text-blue-500 transition">About Us</a>
                        <a href="#grades" className="block py-2 text-black hover:text-blue-500 transition">Grading System</a>
                        <a href="#contact" className="block py-2 text-black hover:text-blue-500 transition">Contacts</a>
                        <Link href="/signup" className="block py-2 text-blue-600 font-bold">Sign Up</Link>
                    </div>
                )}
            </section>

            {/* Hero Section */}
            <section
                id="home"
                className="relative h-screen bg-cover bg-center flex items-center justify-start text-white px-8 md:px-16 text-left"
                style={{ backgroundImage: "url('/images/BGimage.jpg')" }}
            >
                <div className="absolute inset-0 bg-opacity-20"></div>

                <div className="relative z-10 max-w-5xl">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Welcome to SRCB Senior High School <br />
                        <span className="text-blue-400">Grading Portal</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg">
                        Easily track your grades, manage academic records, and ensure transparency in the grading process.
                        Our system simplifies grading for students, teachers, and administrators.
                    </p>
                    <Link href="/get-started">
                        <span className="mt-4 inline-block bg-green-500 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-transform transform hover:scale-105 hover:bg-green-600">
                            Get Started
                        </span>
                    </Link>
                </div>
            </section>

            {/* About Us Section */}
            <section
                id="about"
                className="relative w-full min-h-[80vh] flex items-center justify-center text-white px-6 text-center bg-cover bg-center"
                style={{ backgroundImage: "url('/images/Aboutimg.jpg')" }}
            >
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="relative z-10 max-w-6xl">
                    <h2 className="text-6xl md:text-4xl font-bold text-white mb-8">About Us</h2>
                    <p className="text-2xl leading-relaxed text-justify">
                        Welcome to the <strong>Senior High School Grading Portal</strong>, a modern and efficient online platform designed
                        to simplify the grading process for students, teachers, and school administrators. Our system is built to
                        ensure accuracy, transparency, and accessibility, making it easier for schools to manage academic records
                        in a secure and organized manner.
                    </p>
                </div>
            </section>

            {/* Grading System Section */}
            <section id="grades" className="py-32 bg-[#fdf8f3] text-center">
                <h2 className="text-3xl font-bold text-[#004aad]">Understanding Senior High School Grading</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
                    Senior High School grading usually follows a numerical or letter-based scale, where each grade corresponds
                    to a range of percentages. Students' performance is evaluated based on their academic work, quizzes,
                    projects, exams, and overall participation.
                </p>
                <div className="mt-8 overflow-x-auto">
                    <table className="w-full max-w-4xl mx-auto border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-[#004aad] text-white">
                                <th className="py-3 px-6 border border-gray-300">Grade</th>
                                <th className="py-3 px-6 border border-gray-300">Grade Percentage Equivalent</th>
                                <th className="py-3 px-6 border border-gray-300">Description</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-900">
                            {[
                                { grade: "1", range: "98-100", desc: "Outstanding" },
                                { grade: "1.25", range: "95-97", desc: "Very Good" },
                                { grade: "1.50", range: "92-94", desc: "Good" },
                                { grade: "1.75", range: "89-91", desc: "Above Average" },
                                { grade: "2.00", range: "86-88", desc: "Satisfactory" },
                                { grade: "2.25", range: "83-85", desc: "Fair" },
                                { grade: "2.50", range: "80-82", desc: "Passing" },
                                { grade: "2.75", range: "77-79", desc: "Below Average" },
                                { grade: "3.00", range: "75-76", desc: "Barely Passing" },
                                { grade: "5.00", range: "Below 75", desc: "Failing" },
                                { grade: "INC", range: "", desc: "Incomplete" },
                                { grade: "OD", range: "", desc: "Officially Dropped" },
                                { grade: "UD", range: "", desc: "Unofficially Dropped" },
                                { grade: "W", range: "", desc: "Withdrawn" }
                            ].map((row, index) => (
                                <tr
                                    key={index}
                                    className="border border-gray-300 transition duration-300 hover:bg-blue-100 hover:shadow-md"
                                >
                                    <td className="py-2 px-6 border border-gray-300">{row.grade}</td>
                                    <td className="py-2 px-6 border border-gray-300">{row.range}</td>
                                    <td className="py-2 px-6 border border-gray-300">{row.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <footer className="bg-gradient-to-r from-[#052559] to-[#03204A] text-white py-10">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                    {/* Left Section */}
                    <div className="md:w-1/3">
                        <img src="/images/logo.png" alt="Logo" className="h-16 mb-4" />
                        <p className="text-sm text-gray-300">
                            The Grading Portal provides secure access to student performance, academic records, and fostering excellence in Senior High School education.
                        </p>
                        <div className="flex space-x-4 mt-4">
                            <a href="#" className="text-gray-300 hover:text-white text-lg"><FaFacebookF /></a>
                            <a href="#" className="text-gray-300 hover:text-white text-lg"><FaInstagram /></a>
                            <a href="#" className="text-gray-300 hover:text-white text-lg"><FaXTwitter /></a>
                        </div>
                    </div>

                    {/* Right Section - Links */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 md:mt-0 text-sm">
                        <div>
                            <h3 className="font-semibold mb-3">Company</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li><a href="#" className="hover:text-white">Destination</a></li>
                                <li><a href="#" className="hover:text-white">Packages</a></li>
                                <li><a href="#" className="hover:text-white">About Us</a></li>
                                <li><a href="#" className="hover:text-white">Contacts</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-3">Help</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li><a href="#" className="hover:text-white">Help/FAQ</a></li>
                                <li><a href="#" className="hover:text-white">Cancel your Flight</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-3">More</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li><a href="#" className="hover:text-white">Domestic Flight</a></li>
                                <li><a href="#" className="hover:text-white">Investor Relation</a></li>
                                <li><a href="#" className="hover:text-white">Partnership</a></li>
                                <li><a href="#" className="hover:text-white">Job</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-3">Terms</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white">Term of Use</a></li>
                                <li><a href="#" className="hover:text-white">Accessibility</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center text-gray-400 text-sm mt-10 border-t border-gray-700 pt-4">
                    © 2025 SHS GP. All rights reserved.
                </div>
            </footer>

        </div>
    );
}
