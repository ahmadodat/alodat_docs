"use client";

import { useState } from "react";
import type { Person } from "@/app/page";

const avatarOptions = ["👤", "👨", "👩", "👦", "👧", "👴", "👵", "🧑", "👨‍💼", "👩‍💼"];
const relationshipOptions = [
  "الأب",
  "الأم",
  "الزوج",
  "الزوجة",
  "الابن",
  "الابنة",
  "الأخ",
  "الأخت",
  "الجد",
  "الجدة",
  "العم",
  "العمة",
  "الخال",
  "الخالة",
  "أخرى",
];

export default function PersonModal({
  person,
  onSave,
  onClose,
}: {
  person: Person | null;
  onSave: (data: Partial<Person> & { id?: string }) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(person?.name || "");
  const [relationship, setRelationship] = useState(person?.relationship || "");
  const [avatar, setAvatar] = useState(person?.avatar || "👤");
  const [birthDate, setBirthDate] = useState(person?.birthDate || "");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !relationship) return;

    setLoading(true);
    onSave({
      id: person?.id,
      name,
      relationship,
      avatar,
      birthDate: birthDate || undefined,
    });
  }

  return (
    <div className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {person ? "تعديل فرد" : "إضافة فرد جديد"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الأيقونة
            </label>
            <div className="flex flex-wrap gap-2">
              {avatarOptions.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`text-3xl p-2 rounded-lg border-2 transition-colors ${
                    avatar === av
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الاسم *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="أدخل الاسم"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              صلة القرابة *
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">اختر صلة القرابة</option>
              {relationshipOptions.map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              تاريخ الميلاد
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="spinner"></div>
              ) : person ? (
                "تحديث"
              ) : (
                "إضافة"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
