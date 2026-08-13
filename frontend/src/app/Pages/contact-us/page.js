"use client"
import React, { useState } from 'react'
import './contactus.css'
import Image from 'next/image'
import Link from 'next/link'
import { IoIosMailOpen } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { FaInstagramSquare, FaFacebookSquare, FaTwitterSquare, FaPinterest } from 'react-icons/fa';
import { axiosInstance } from '@/app/utils/axiosInstance'
import toast from 'react-hot-toast'

const Page = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [validated, setValidated] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            fullName: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
        };

        try {
            const response = await axiosInstance.post(
                "/api/v1/contact/create-contact",
                payload
            );
            if (response.status === 201) {
                toast.success("Thank you! We’ll get back to you shortly.");
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                });
            }
        } catch (err) {
            console.error("Submission error:", err);
            alert("Something went wrong. Please try again later.");
        }
    };

    return (
        <>
            <nav aria-label="breadcrumb" className="pretty-breadcrumb">
                <div className="container">
                    <ol className="breadcrumb align-items-center">
                        <li className="breadcrumb-item">
                            <Link href="/">
                                <span className="breadcrumb-link"> Home</span>
                            </Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Contact Us
                        </li>
                    </ol>
                </div>
            </nav>

            <div className='contactUs'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-7'>
                            <div className='contact-details'>

                                <Image 
                                    src="/logo.png"
                                    width={120}
                                    height={60}
                                    alt="Morph Industries Logo"
                                    className='logo'
                                />
                                     <Image 
                                    src="/logo2.png"
                                    width={120}
                                    height={60}
                                    alt="Morph Industries Logo"
                                    className='logo'
                                />
                                <p className='contact-mail'>
                                    <Link href="mailto:morphindustries2012@gmail.com">
                                        <IoIosMailOpen /> morphindustries2012@gmail.com
                                    </Link>
                                </p>

                                <p className='contact-phone'>
                                    <IoCall />
                                    <Link href="tel:+919142424260"> (+91) 91424 24260</Link>
                                </p>

                                <address>
                                    <FaLocationDot />  
                                    KHASRA NO. 180/2/1, VILL-ISMAILA, 11-B, SAMPLA BERI ROAD,
                                    DISTT-ROHTAK, SAMPLA, HARYANA – 124501
                                </address>

                                <div className="SocialLinks d-grid">
                                    <div>
                                        <h4 className='fs-5'>Follow us for updates</h4>
                                    </div>
                                    <div>
                                        <a href="#" className='instagramicon' target="_blank"><FaInstagramSquare className="fs-1" /></a>
                                        <a href="#" className='facebookicon' target="_blank"><FaFacebookSquare className="fs-1" /></a>
                                        <a href="#" className='twittericon' target="_blank"><FaTwitterSquare className="fs-1" /></a>
                                        <a href="#" className='pinteresticon' target="_blank"><FaPinterest className="fs-1" /></a>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="col-md-5">
                            <div className="contactCard">
                                <h2 className="text-center ContactTitle mb-4">Get in Touch</h2>
                                <form noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
                                    
                                    <div className="mb-3">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="invalid-feedback">Please enter your name.</div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="invalid-feedback">Please enter a valid email.</div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Subject</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="invalid-feedback">Please enter a subject.</div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Message</label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                        <div className="invalid-feedback">Please enter your message.</div>
                                    </div>

                                    <button type="submit" className="Contactbutton w-100">
                                        Send Message
                                    </button>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update with Morph's map if needed */}
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28038.73994178866!2d76.774!3d28.897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390da6b1e1bc0b03%3A0x000000000000000!2sSampla%2C%20Haryana!5e0!3m2!1sen!2sin!4v0000000000000"
                width="100%"
                height="450"
                style={{ border: 'none' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

        </>
    )
}

export default Page
