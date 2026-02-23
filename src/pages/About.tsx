import React from 'react';
import { Github, Mail, Facebook, Heart, Code, ChefHat, Sparkles } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">

            {/* Hero Header */}
            <section className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-[2.5rem] p-8 sm:p-12 text-center border border-orange-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200 rounded-full blur-[80px] opacity-40 -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-200 rounded-full blur-[80px] opacity-40 translate-y-1/2 -translate-x-1/3"></div>

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md border border-orange-100 rotate-3">
                        <ChefHat size={40} className="text-orange-500" />
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-800 tracking-tight mb-4">
                        Về <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">Bếp Dzui</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Hành trình xây dựng một trợ lý nấu ăn thông minh, giúp bữa ăn gia đình trở nên dễ dàng, sáng tạo và ngập tràn niềm vui.
                    </p>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Câu chuyện */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                            <Heart size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Câu chuyện</h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed space-y-4">
                        <span className="block">
                            Ý tưởng về Bếp Dzui xuất phát từ một câu hỏi quen thuộc mỗi ngày: <strong>"Hôm nay ăn gì?"</strong>. Việc suy nghĩ thực đơn đôi khi còn mệt mỏi hơn cả việc nấu nướng.
                        </span>
                        <span className="block mt-4">
                            Với niềm đam mê ẩm thực và công nghệ, Bếp Dzui ra đời nhằm ứng dụng sức mạnh của AI để giải quyết bài toán đó. Từ nhận diện nguyên liệu trong tủ lạnh đến tự động lên thực đơn cá nhân hóa, Bếp Dzui mong muốn mang lại nguồn cảm hứng nấu nướng cho mọi người.
                        </span>
                    </p>
                </div>

                {/* Công nghệ */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                            <Code size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Công nghệ</h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        Dự án được xây dựng dựa trên các công nghệ web hiện đại, tập trung vào hiệu năng và trải nghiệm người dùng tối ưu:
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                            <Sparkles size={18} className="text-yellow-500 shrink-0" />
                            <span className="text-gray-700"><strong>AI Engine:</strong> Google Gemini 3.0 Flash Preview</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Sparkles size={18} className="text-blue-500 shrink-0" />
                            <span className="text-gray-700"><strong>Frontend:</strong> React 18, TypeScript, Vite</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Sparkles size={18} className="text-cyan-500 shrink-0" />
                            <span className="text-gray-700"><strong>Styling:</strong> Tailwind CSS v3</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Sparkles size={18} className="text-green-500 shrink-0" />
                            <span className="text-gray-700"><strong>Backend/Auth:</strong> Supabase (PostgreSQL)</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Thông tin liên hệ */}
            <section className="bg-gray-900 rounded-[2rem] p-8 sm:p-12 text-white shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20 transition-all"></div>
                <div className="relative z-10 text-center">
                    <h2 className="text-2xl font-bold mb-2">Kết nối với tác giả</h2>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                        Bạn có góp ý, báo lỗi hay đơn giản là muốn trò chuyện về dự án? Đừng ngần ngại liên hệ nhé!
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            // href="mailto:nchd3012@gmail.com"
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl backdrop-blur-md transition-colors border border-white/10 font-medium"
                        >
                            <Mail size={20} />
                            <span>nchd3012@gmail.com</span>
                        </a>

                        <a
                            href="https://github.com/phongggnguyen"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl backdrop-blur-md transition-colors border border-white/10 font-medium"
                        >
                            <Github size={20} />
                            <span>GitHub</span>
                        </a>

                        <a
                            href="https://www.facebook.com/thuky.noocon"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl backdrop-blur-md transition-colors border border-white/10 font-medium"
                        >
                            <Facebook size={20} />
                            <span>Facebook</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer text */}
            <div className="text-center text-gray-400 text-sm mt-8">
                <p>© 2026 Bếp Dzui. Crafted with ❤️.</p>
            </div>

        </div>
    );
}
