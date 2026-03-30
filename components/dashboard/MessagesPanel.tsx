// import { messages } from "@/lib/data";
// import clsx from "clsx";
// import Image from "next/image";

// export default function MessagesPanel() {
//     return (
//         <section>
//             <div className="px-4 pb-3">
//                 <h3 className="text-sm font-semibold text-gray-800">
//                     Messages
//                 </h3>
//             </div>
//             <div className="rounded-xl border border-gray-200 overflow-hidden">
//                 {/* Message List */}
//                 <div className="">
//                     {messages.map((msg, index) => (
//                         <div
//                             key={msg.id}
//                             className={clsx(
//                                 "flex items-start gap-3 px-4 py-3 transition cursor-pointer",
//                                 index !== messages.length - 1 && "border-b border-gray-200"
//                             )}
//                         >
//                             {/* Avatar */}
//                             {msg.avatar?.match(/\.(png|jpg|jpeg|gif|svg)$/i) ? (
//                                 <Image
//                                     src={`${msg.avatar}`}
//                                     width={32}
//                                     height={32}
//                                     className="rounded-full"
//                                     alt={`${msg.sender} avatar`}
//                                 />
//                             ) : (
//                                 <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-700">
//                                     {msg.avatar}
//                                 </div>
//                             )}

//                             {/* Content */}
//                             <div className="min-w-0">
//                                 <div className="flex">
//                                     <p className="text-sm font-medium text-gray-800">
//                                     {msg.sender}
//                                 </p>
//                                 </div>
//                                 <p className="text-xs text-gray-500 mt-0.5 leading-snug">
//                                     {msg.preview}
//                                 </p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }