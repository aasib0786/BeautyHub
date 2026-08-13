 "use client";
import Image from "next/image";
import Link from "next/link";
import "./login.css";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { loginUser } from "@/app/redux/slice/authSlice";
import { useRouter } from "next/navigation";
import { AddToCartToServer, safeJSONParse, setCartFromLocalStorage } from "@/app/redux/slice/cartSlice";
import { loadWishlistFromLocalStorage } from "@/app/redux/slice/wislistSlice";
const Page = () => {
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const {items}=useSelector((state)=>state.cart)
  const {wishlist}=useSelector((state)=>state.wishlist)
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        loginUser({
          email: loginInput,
          password: password,
        })
      )
      if (loginUser.fulfilled.match(result)) {
        toast.success("Login successful!");
        setLoginInput("");
        setPassword("");
        dispatch(AddToCartToServer(items))
        router.push("/");
      } else {
        toast.error(result.payload.message);
      }
    } catch (error) {
      console.log("login error", error);
      toast.error("Login failed. Please try again.");
    }
  };

useEffect(()=>{
 if (typeof window !== "undefined") {
      const cartData = localStorage.getItem("cart");
      const parsedCart = safeJSONParse(cartData);
      if (parsedCart && Array.isArray(parsedCart)) {
        dispatch(setCartFromLocalStorage(parsedCart));
      }
      dispatch(loadWishlistFromLocalStorage())
    }
},[dispatch])

  return (
    <>
      <section className="login-furniture-container">
        <div className="login-furniture-wrapper">
          {/* Left Section: Image and Headline */}
          <div className="login-furniture-left">
            <div className="text-center logintext">
              <h1 className="LogInTitle"> Log In</h1>
              <p className="LogInSubTitle">Welcome Back! Log In to Continue </p>
            </div>
            <div className="furniture-overlay-text ">
              <Image
                src="/couch.png"
                alt="banner img"
                height={500}
                width={700}
              />
            </div>
          </div>

          {/* Right Section: Login Form */}
          <div className="login-furniture-right">
            <div className="furniture-form-card">
              <h2 className="furniture-form-title text-center"> Log In</h2>
              <form onSubmit={handleLogin}>
                <div className="furniture-input-group email-with-button">
                  <input
                    type="text"
                    placeholder="Enter your Email"
                    className=" form-input mb-2"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    required
                  />
                  <div className="position-relative mb-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control pe-5"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div
                      className="position-absolute top-50 end-0 translate-middle-y me-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                  {loginError && <p className="text-danger">{loginError}</p>}
                  <button
                    type="submit"
                    className="furniture-submit-btn w-100 login-btn"
                  >
                    Continue
                  </button>
                   <div className="mt-3">
                  <Link href="/Pages/forgot-password" className="text-success ">forgot password</Link>
                  </div>
                </div>

                {/*            */}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;

// 'use client'
// import React, { useEffect, useState } from 'react'
// import './login.css'
// import Image from 'next/image'
// import google from '@/app/Components/assets/google.png'
// import facebook from '@/app/Components/assets/facebook.png'
// import { FaRegCheckCircle } from "react-icons/fa";
// import Link from 'next/link'
// const Page = () => {
//   const [loginInput, setLoginInput] = useState('')
//   const [loginError, setLoginError] = useState('')
//   const handleLogin = (e) => {
//     e.preventDefault()
//     if (!loginInput) {
//       setLoginError('Please enter mobile number or email.')
//     } else {
//       setLoginError('')
//       console.log('Login Input:', loginInput)
//     }
//   }

//   return (
//     <section className='login-section'>
//       <div className='container'>
//         <div className='row'>
//           {/* Login Form */}
//           <div className='col-md-6 offset-md-3 my-4'>
//             <div className='login-form'>
//               <h2 className='login-form-heading'>Sign Up Or Log In</h2>
//               <form onSubmit={handleLogin}>
//                 <input
//                   type='text'
//                   placeholder='Enter Mobile Number Or Email Id'
//                   className='form-input mb-2'
//                   value={loginInput}
//                   onChange={(e) => setLoginInput(e.target.value)}
//                 />
//                 {loginError && <p className='text-danger'>{loginError}</p>}
//                 <button type='submit' className='login-btn'>Continue</button>
//                 <Link href="/Pages/ForgotPassword">forgot password</Link>
//                 <div>
//                   <p className='login-form-text'>By continuing, you agree to our <a href='#'>Terms of Conditions</a></p>
//                   <p className='text-center'>
//                     Or
//                     <br />
//                     Continue With
//                   </p>
//                   <button type='button' className='google-btn'>
//                     <Image src={google} alt='Google' className='google-icon' /> Sign In With Google
//                   </button>
//                   <button type='button' className='google-btn m-0'>
//                     <Image src={facebook} alt='facebook' className='google-icon' /> Sign In With Facebook
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Page
