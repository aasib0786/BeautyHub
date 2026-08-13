"use client";
import React, { useState } from 'react';
import './forgot.css';
// import logo from '@/app/Components/assets/logo.webp';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/app/Components/assets/logo.png'
import toast from 'react-hot-toast';
import { axiosInstance } from '@/app/utils/axiosInstance';

const Page = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleEmailSubmit = async(e) => {
        e.preventDefault();
       if(!email){
        toast.error('Please enter your email first');
        return;
       }
       try {
        await axiosInstance.post('/api/v1/auth/forgot-password', { email });
        toast.success('Reset link sent to your email');
        setEmail('');
       } catch (error) {
        console.log(error?.response?.data?.message || 'reset password failed');
        toast.error(error?.response?.data?.message || 'Login password failed');
       }
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        if (otp === '123456') {
            setMessage('OTP verified. Please reset your password.');
            setStep(3);
        } else {
            setMessage('Invalid OTP. Please try again.');
        }
    };

    const handlePasswordReset = (e) => {
        e.preventDefault();
        if (newPassword && newPassword === confirmPassword) {
            setMessage('Password has been successfully reset.');
            setStep(4);
        } else {
            setMessage('Passwords do not match.');
        }
    };

    return (
        <>   
        <div className='container-fluid'>

        <div className="forgot-wrapper">
            <div className="left-panel d-none d-md-flex flex-column justify-content-center text-white p-5">
                <div className="text-center">
                    <Image src={logo} alt="Logo" width={150} className="mb-4" />
                    <h1 className="display-5 fw-bold text-dark">MANMOHAN FURNITURES</h1>
                    <p className="lead mt-3 text-dark">Manage your business, export smartly.</p>
                    <p className="text-light opacity-75 text-dark">Secure, elegant password recovery experience.</p>
                </div>
            </div>
            <div className="right-panel d-flex align-items-center justify-content-center p-4">
                <div className="auth-box rounded-4 shadow-lg">
                    <h2 className="text-center TitleSec fw-bold mb-4">Reset Password</h2> 
                    <p className="text-center text-muted mb-4">
                        {step === 1 ? 'Enter your email to get a verification link.' :
                            step === 2 ? 'Enter the OTP sent to your email' :
                                'Set your new password'}
                    </p>

                    {step === 1 && (
                        <form onSubmit={handleEmailSubmit}>
                            <input
                                type="email"
                                className="form-control mb-3"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button className="btn btn-dark w-100">Send Link</button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleOtpSubmit}>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <button className="btn btn-dark w-100">Verify OTP</button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handlePasswordReset}>
                            <div className="position-relative mb-3">
                                <input
                                    type={showPassword.password ? 'text' : 'password'}
                                    className="form-control"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <span className="toggle-icon" onClick={() => togglePasswordVisibility('password')}>
                                    <i className={`bi ${showPassword.password ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`}></i>
                                </span>
                            </div>
                            <div className="position-relative mb-3">
                                <input
                                    type={showPassword.confirmPassword ? 'text' : 'password'}
                                    className="form-control"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <span className="toggle-icon" onClick={() => togglePasswordVisibility('confirmPassword')}>
                                    <i className={`bi ${showPassword.confirmPassword ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`}></i>
                                </span>
                            </div>
                            <button className="btn btn-dark  w-100">Reset Password</button>
                        </form>
                    )}

                    {message && <div className="alert alert-info mt-3 text-center">{message}</div>}

                    {step === 4 && (
                        <div className="text-center mt-3">
                            Password reset successful! <Link href="/Pages/Login" className="text-white fw-semibold text-decoration-none">Login Now</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>

        </div>
        
        
        </>
    );
};

export default Page;














// /* ForgetPassword.js */
// "use client";
// import React, { useState } from 'react';
// import './forgot.css';
// import logo from '../../assets/log.png';
// import Image from 'next/image';
// import Link from 'next/link';

// const Page = () => {
//     const [email, setEmail] = useState('');
//     const [otp, setOtp] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [step, setStep] = useState(1);
//     const [message, setMessage] = useState('');
//     const [showPassword, setShowPassword] = useState({
//         password: false,
//         confirmPassword: false,
//     }); 

//     const togglePasswordVisibility = (field) => {
//         setShowPassword(prevState => ({
//             ...prevState,
//             [field]: !prevState[field],
//         }));
//     };


//     const handleEmailSubmit = (e) => {
//         e.preventDefault();
//         if (email) {
//             // Simulate sending OTP to email
//             setMessage('OTP has been sent to your email.');
//             setStep(2);
//         } else {
//             setMessage('Please enter your email.');
//         }
//     };

//     const handleOtpSubmit = (e) => {
//         e.preventDefault();
//         if (otp === '123456') { // Simulated OTP check
//             setMessage('OTP verified. Please reset your password.');
//             setStep(3);
//         } else {
//             setMessage('Invalid OTP. Please try again.');
//         }
//     };

//     const handlePasswordReset = (e) => {
//         e.preventDefault();
//         if (newPassword && newPassword === confirmPassword) {
//             setMessage('Password has been successfully reset.');
//             setStep(4);
//         } else {
//             setMessage('Passwords do not match. Please try again.');
//         }
//     };

//     return (
//         <section className=' forgotSec '>
//              <div className="container py-3">
//             <div className="row align-items-center">
//                 <div className="col-md-6 p-0">
//                     <div className='login-welcome-content'>
//                         <div className='login-welcome-image'>
//                             <Image src={logo} alt="King Logo" />
//                         </div>
//                         <div className='login-welcome-text'>
//                             <h1 className=''>Welcome to <span style={{ color: 'var(--blue)' }}>Smart Part Export</span></h1>
//                             <p>Biziffy is a platform that allows you to manage your tasks and projects in a simple way.</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="col-md-6">
//                     <div className="auth-section">
//                         <div className="auth-card">
//                             <div className="text-center mb-3">
//                                 <h4 className='text-light'>Reset Password</h4>
//                                 <p className='text-light'>{step === 1 ? 'Enter your email to get OTP' : step === 2 ? 'Enter the OTP sent to your email' : 'Reset your password'}</p>
//                             </div>

//                             {step === 1 && (
//                                 <form onSubmit={handleEmailSubmit}>
//                                     <input
//                                         type="email"
//                                         placeholder="Email"
//                                         className="login-input mb-3"
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                     />
//                                     <button className="login-btn w-100" type="submit">Send OTP</button>
//                                 </form>
//                             )}

//                             {step === 2 && (
//                                 <form onSubmit={handleOtpSubmit}>
//                                     <input
//                                         type="text"
//                                         placeholder="Enter OTP"
//                                         className="login-input mb-3"
//                                         value={otp}
//                                         onChange={(e) => setOtp(e.target.value)}
//                                     />
//                                     <button className="login-btn w-100" type="submit">Verify OTP</button>
//                                 </form>
//                             )}

//                             {step === 3 && (
//                                 <form onSubmit={handlePasswordReset}>
//                                     <div className="password-input mb-3 position-relative">
//                                         <input
//                                             type={showPassword.password ? 'text' : 'password'}
//                                             placeholder="New Password"
//                                             value={newPassword}
//                                             className="login-input w-100"
//                                             onChange={(e) => setNewPassword(e.target.value)}
//                                         />
//                                         <p
//                                             className="show-password-btn position-absolute"
//                                             style={{ top: '50%', right: '15px', transform: 'translateY(-50%)', cursor: 'pointer' }}
//                                             onClick={() => togglePasswordVisibility('password')}
//                                         >
//                                             {showPassword.password ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
//                                         </p>
//                                     </div>

//                                     <div className="password-input mb-3 position-relative">
//                                         <input
//                                             type={showPassword.confirmPassword ? 'text' : 'password'}
//                                             placeholder="Confirm New Password"
//                                             className="login-input w-100"
//                                             value={confirmPassword}
//                                             onChange={(e) => setConfirmPassword(e.target.value)}
//                                         />
//                                         <p
//                                             className="show-password-btn position-absolute"
//                                             style={{ top: '50%', right: '15px', transform: 'translateY(-50%)', cursor: 'pointer' }}
//                                             onClick={() => togglePasswordVisibility('confirmPassword')}
//                                         >
//                                             {showPassword.confirmPassword ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
//                                         </p>
//                                     </div>

//                                     <button className="login-btn w-100" type="submit">Reset Password</button>
//                                 </form>
//                             )}

//                             {message && <p className="text-center text-success">{message}</p>}

//                             {step === 4 && <p className="text-center">Password has been reset. <Link href="/pages/login" className="text-primary">Login</Link></p>}

//                             {/* <p className="text-center">
//                 Remembered your password? Link href="/login" className="text-primary">Login</a>
//               </p> */}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         </section>
//     );
// };

// export default Page;
