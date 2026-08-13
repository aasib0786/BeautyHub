import Head from 'next/head'
import React from 'react'
import './termconditions.css'
import Link from 'next/link'

const TermsPage = () => {
    return (
        <>

            <Head>
                <title>Terms and Conditions | BeautyHub</title>
            </Head>
            <nav aria-label="breadcrumb" className="pretty-breadcrumb">
                <div className="container">
                    <ol className="breadcrumb align-items-center">
                        <li className="breadcrumb-item">
                            <Link href="/">
                                <span className="breadcrumb-link"> Home</span>
                            </Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Terms & Conditions
                        </li>
                    </ol>
                </div>
            </nav>
            <div className="termsWrapper">
                <h1 className="title">Terms and Conditions</h1>
                <hr />
                <p className="intro">
                BeautyHub governs your use of our website, products, and services. By accessing or using our website, you agree to comply with these terms. If you do not agree with these Terms and Conditions, please do not use our website.
                </p>

                {[
                    {
                        heading: "Introduction",
                        content:
                            "When you purchase products from BeautyHub, you are agreeing to the terms and conditions that outline the rules and regulations of the transaction. These terms and conditions include information about payment methods, delivery options, return policies, and product guarantees."
                    },
                    {
                        heading: "Intellectual Property Rights",
                        content:
                            "The content, trademarks, logos, images, and other intellectual property on this website are owned by BeautyHub or its licensors. You may not use, reproduce, distribute, modify, or create derivative works of any content from this website without our prior written consent."
                    },
                    {
                        heading: "Return or Exchange Policies",
                        content:
                            "We offer easy returns within 7 days of delivery for unused, unopened items in original packaging. Please check our return policy page before making your purchase to understand specific terms for cosmetics and personalized gift items."
                    },
                    {
                        heading: "Payment Methods",
                        content:
                            "BeautyHub offers a variety of payment methods to make your shopping experience convenient and secure. You can pay using credit cards, debit cards, UPI, net banking, Cash on Delivery, or online payment gateways."
                    },
                    {
                        heading: "Authenticity & Quality Guarantee",
                        content:
                            "We guarantee 100% genuine, authentic products directly sourced from verified brands and official distributors. All items undergo rigorous quality checks prior to dispatch."
                    },
                    {
                        heading: "Delivery Options",
                        content:
                            "Delivery charges and times vary based on location and selected products. We strive to deliver within the estimated timeframe (3 to 7 business days), but external delays may occur. Accurate shipping details are required; re-delivery fees may apply for incorrect addresses."
                    },
                    {
                        heading: "Orders and Payments",
                        content:
                            "By placing an order, you agree to provide complete and accurate information. We reserve the right to cancel orders due to stock unavailability, pricing errors, or suspicion of fraud. Payments are due upon order placement or upon delivery for COD orders."
                    },
                    {
                        heading: "Changes to Terms and Conditions",
                        content:
                            "We may update these terms at any time. Changes are effective immediately upon posting on our platform. It is your responsibility to review them periodically."
                    },
                    {
                        heading: "Privacy & Data Security",
                        content:
                            "Your privacy is important to us. Please review our Privacy Policy to understand how we collect, protect, and handle your personal data."
                    },
                    {
                        heading: "Contact Us",
                        content:
                            `If you have any questions or require assistance, please contact us at 
                            <a href="mailto:support@beautyhub.com">support@beautyhub.com</a> 
                            or call <a href="tel:+919876543210">+91-9876543210</a>.`
                    },
                    {
                        heading: "Conclusion",
                        content:
                            "Thank you for choosing BeautyHub. It is important to read and understand our Terms and Conditions before placing an order to ensure a smooth, delightful shopping experience. Happy shopping!"
                    },
                ].map((section, index) => (
                    <div key={index} className="section">
                        <h2>{section.heading}</h2>
                        <p dangerouslySetInnerHTML={{ __html: section.content }} />
                    </div>
                ))}
            </div>
        </>
    )
}

export default TermsPage

