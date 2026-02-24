import React, { useState, useRef } from 'react';
import { Upload, Camera, Loader2, Check, RefreshCcw } from 'lucide-react';
import { analyzeImage } from '@/services/geminiService';
import { AnalyzedDish } from '@/types';
import { Link } from 'react-router-dom';

export default function AnalyzePage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzedDish | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64Data = image.split(',')[1];
      const data = await analyzeImage(base64Data);
      setResult(data);
    } catch (error) {
      alert("Có lỗi xảy ra khi phân tích ảnh.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">AI Phân tích món ăn</h1>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-orange-300 dark:border-orange-700 rounded-3xl p-8 text-center bg-white dark:bg-gray-900 cursor-pointer hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {image ? (
          <div className="relative">
            <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-xl object-cover shadow-md" />
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
              Chạm để đổi ảnh
            </div>
          </div>
        ) : (
          <div className="py-8 text-gray-500 dark:text-gray-400 flex flex-col items-center">
            <div className="bg-orange-100 dark:bg-orange-900/40 p-4 rounded-full mb-4">
              <Camera size={40} className="text-orange-500 dark:text-orange-400" />
            </div>
            <p className="font-medium">Chạm để tải ảnh lên</p>
            <p className="text-sm mt-1">Hoặc chụp trực tiếp món ăn</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {image && !result && (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full mt-6 bg-orange-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-orange-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 flex justify-center items-center gap-2 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
          {loading ? "Đang phân tích..." : "Phân tích ngay"}
        </button>
      )}

      {/* Results */}
      {result && (
        <div className="mt-8 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-orange-100 dark:border-gray-800 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">{result.dishName}</h2>
            <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
              {Math.round(result.confidence * 100)}% tin cậy
            </span>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <span className="w-2 h-6 bg-orange-400 rounded-full"></span>
              Nguyên liệu dự đoán
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.ingredients.map((ing, idx) => (
                <span key={idx} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg text-sm border border-gray-200 dark:border-gray-700">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {result.alternatives.length > 0 && (
            <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              <p>Hoặc có thể là: {result.alternatives.join(", ")}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Link
              to={`/recipe?query=${encodeURIComponent(result.dishName)}`}
              className="flex-1 bg-orange-500 text-white text-center py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
            >
              Xem công thức nấu
            </Link>
            <button
              onClick={() => { setImage(null); setResult(null); }}
              className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            >
              <RefreshCcw size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
