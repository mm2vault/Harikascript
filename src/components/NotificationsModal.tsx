import React from 'react';
import { X, Bell, ShoppingBag, Sparkles, Gift } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onClear
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      icon: <ShoppingBag className="w-4 h-4 text-emerald-400" />,
      title: 'Ürünler mağazaya eklendi!',
      time: 'Az önce',
      desc: 'Siyah Çerçeve, Işıltı Çerçevesi ve Halka Çerçeve vitrinde yerini aldı.'
    },
    {
      id: 'notif-2',
      icon: <Gift className="w-4 h-4 text-amber-400" />,
      title: 'Hoş geldin hediyesi yüklendi',
      time: '10 dk önce',
      desc: 'Hesabına 1.250 Başlangıç Coini tanımlandı. Dilediğin çerçeveyi hemen satın al!'
    },
    {
      id: 'notif-3',
      icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
      title: 'Neon Animasyon Desteği Aktif',
      time: 'Bugün',
      desc: 'Tüm çerçeveler yüksek kare hızlı CSS/SVG ışık efektleriyle donatıldı.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="notifications-panel-dialog"
        className="w-full max-w-md rounded-3xl bg-[#0c0f18] border border-white/10 p-6 shadow-2xl relative"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white font-heading">Bildirimler</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 flex items-start gap-3 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                {n.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{n.title}</h4>
                  <span className="text-[10px] text-slate-500">{n.time}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {n.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Tümünü okundu say
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
