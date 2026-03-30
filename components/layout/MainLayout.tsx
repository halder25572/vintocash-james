// import Sidebar from "./Sidebar";
// import Header from "./Header";

// type MainLayoutProps = {
//   children: React.ReactNode;
//   title?: string;
// };

// export default function MainLayout({ children, title }: MainLayoutProps) {
//   return (
//     <div className="flex min-h-screen bg-[#F9FAFB] w-full">
//       <Sidebar />
//       <div className="flex-1 flex flex-col">
//         <div className="px-4 sm:px-6 border-b border-gray-300">
//           <Header title={title} />
//         </div>
//         <main className="flex-1 px-4 sm:px-6 pb-6">{children}</main>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuthStore } from "@/store/useAuthStore";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);


  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="px-4 sm:px-6 border-b border-gray-300">
          <Header />
        </div>
        <main className="flex-1 px-4 sm:px-6 pb-6">{children}</main>
      </div>
    </div>
  );
}