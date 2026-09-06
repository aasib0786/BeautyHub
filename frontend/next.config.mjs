/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['fakestoreapi.com',"res.cloudinary.com","picsum.photos"],
    },
};

export default nextConfig;
