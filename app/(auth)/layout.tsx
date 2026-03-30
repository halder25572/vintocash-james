export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* LEFT — Background Image */}
      <div
        className="hidden lg:block lg:w-202.75 bg-cover"
        style={{
          backgroundImage: "url('/images/loginimage.png')",
        }}
      />

      {/* RIGHT — Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 bg-white">
        {children}
      </div>
    </div>
  );
}