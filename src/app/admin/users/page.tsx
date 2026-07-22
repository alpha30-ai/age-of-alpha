'use client';

import { useState, useEffect } from 'react';
import { UserCircle, Shield, ShieldAlert, Trash2, Ban, CheckCircle, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const RANKS = ['مواطن', 'فارس الظلام', 'قائد الفيلق', 'ملك الألفية', 'الإمبراطور الأعظم'];

export default function UsersAdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error('فشل في جلب بيانات المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'role', value: newRole })
      });
      if (res.ok) {
        toast.success(`تم تغيير الصلاحية إلى ${newRole === 'ADMIN' ? 'مسؤول' : 'مستخدم'}`);
        fetchUsers();
      } else {
        toast.error('فشل في تغيير الصلاحية');
      }
    } catch (error) {
      console.error(error);
      toast.error('تعذر الاتصال بالخادم');
    }
  };

  const handleRankChange = async (userId: string, newRank: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'rank', value: newRank })
      });
      if (res.ok) {
        toast.success(`تم ترقية المستخدم إلى ${newRank}`);
        fetchUsers();
      } else {
        toast.error('فشل في تغيير اللقب');
      }
    } catch (error) {
      console.error(error);
      toast.error('تعذر الاتصال بالخادم');
    }
  };

  const handleBanToggle = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'ban', value: !currentStatus })
      });
      if (res.ok) {
        toast.success(currentStatus ? 'تم فك الحظر عن المستخدم' : 'تم حظر المستخدم بنجاح');
        fetchUsers();
      } else {
        toast.error('فشل في تغيير حالة الحظر');
      }
    } catch (error) {
      console.error(error);
      toast.error('تعذر الاتصال بالخادم');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم نهائياً؟')) return;
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('تم حذف المستخدم نهائياً');
        fetchUsers();
      } else {
        toast.error('فشل في حذف المستخدم');
      }
    } catch (error) {
      console.error(error);
      toast.error('تعذر الاتصال بالخادم');
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto font-tajawal">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <UserCircle className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white font-amiri tracking-wide">إدارة المستخدمين</h1>
          <p className="text-gray-400 mt-1">تحكم بصلاحيات وألقاب الأعضاء في الملحمة</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-black/50 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-gray-400 font-bold">المستخدم</th>
                  <th className="px-6 py-4 text-gray-400 font-bold">البريد الإلكتروني</th>
                  <th className="px-6 py-4 text-gray-400 font-bold">الصلاحية</th>
                  <th className="px-6 py-4 text-gray-400 font-bold">اللقب (الرتبة)</th>
                  <th className="px-6 py-4 text-gray-400 font-bold">الحالة</th>
                  <th className="px-6 py-4 text-gray-400 font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={user.id} 
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full border border-white/10" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                        )}
                        <span className="font-bold text-white">{user.name || 'مستخدم مجهول'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {user.role === 'ADMIN' ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.rank || 'مواطن'}
                        onChange={(e) => handleRankChange(user.id, e.target.value)}
                        className="bg-black/50 border border-white/10 text-gray-300 text-sm rounded-lg focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)] block w-full p-2"
                      >
                        {RANKS.map((rank) => (
                          <option key={rank} value={rank}>{rank}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        user.isBanned ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {user.isBanned ? 'محظور' : 'نشط'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRoleChange(user.id, user.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                          className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-colors"
                          title={user.role === 'ADMIN' ? 'تخفيض إلى مستخدم' : 'ترقية إلى مسؤول'}
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleBanToggle(user.id, user.isBanned)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.isBanned 
                              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                              : 'bg-white/5 text-gray-400 hover:bg-orange-500/20 hover:text-orange-400'
                          }`}
                          title={user.isBanned ? 'فك الحظر' : 'حظر المستخدم'}
                        >
                          {user.isBanned ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          title="حذف نهائي"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      لا يوجد مستخدمين مسجلين بعد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
