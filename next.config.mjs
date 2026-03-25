/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['76.13.2.52', 'localhost', 'localhost:3000'],
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
