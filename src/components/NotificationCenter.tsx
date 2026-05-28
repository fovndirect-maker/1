import React, { useState } from 'react';
import { Bell, MessageSquare, Check, Trash2, Mail, ExternalLink } from 'lucide-react';
import { NotificationMsg } from '../types';

interface NotificationCenterProps {
  notifications: NotificationMsg[];
  currentActor: 'IC' | 'SM' | 'IG' | 'SYS';
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

export default function NotificationCenter({
  notifications,
  currentActor,
  onMarkRead,
  onClearAll
}: NotificationCenterProps) {
  const [activeTab, setActiveTab] = useState<'InApp' | 'dLink'>('InApp');
  
  // Filter notifications by receiver role
  const filteredNotifications = notifications.filter(n => {
    // Admin/Sys can see all, otherwise filter based on designated actor
    if (currentActor === 'SYS') return true;
    return n.receiver === currentActor;
  });

  const getActorBadge = (receiver: 'IC' | 'SM' | 'IG') => {
    switch (receiver) {
      case 'IC': return <span className="px-1.5 py-0.5 bg-sky-100 text-sky-800 text-[9px] font-bold rounded-sm uppercase">Cá nhân IC</span>;
      case 'SM': return <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded-sm uppercase">Quản lý SM</span>;
      case 'IG': return <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-[9px] font-bold rounded-sm uppercase">Quản trị IG</span>;
    }
  };

  return (
    <div className="bg-stone-900 text-stone-100 border border-stone-800 rounded-xl overflow-hidden shadow-lg h-full flex flex-col" id="notification-hub-panel">
      {/* Header */}
      <div className="p-4 bg-stone-950 border-b border-stone-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-stone-800 text-amber-400 rounded-md">
            <Bell className="w-4.5 h-4.5 animate-bounce" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-100">Cổng Nhận Tin Điện Tử (Notification Hub)</h4>
            <span className="text-[10px] text-stone-400 block mt-0.5">
              Vai trò đang xem: <strong className="text-amber-400">
                {currentActor === 'IC' ? 'Nhân viên (IC)' : 
                 currentActor === 'SM' ? 'Quản lý (SM)' : 
                 currentActor === 'IG' ? 'Quản trị (IG)' : 'Hệ Thống / Toàn Cảnh'}
              </strong>
            </span>
          </div>
        </div>

        {filteredNotifications.length > 0 && (
          <button 
            onClick={onClearAll}
            className="p-1 px-2 text-[10px] bg-stone-800 hover:bg-stone-700 hover:text-stone-100 rounded-md border border-stone-700/60 font-medium text-stone-400 transition-all flex items-center gap-1"
            title="Xoá tất cả"
          >
            <Trash2 className="w-3 h-3" />
            Xoá hết
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-800 bg-stone-950/40 p-1 gap-1">
        <button
          onClick={() => setActiveTab('InApp')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'InApp'
              ? 'bg-stone-800 text-amber-300 shadow-sm font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
          id="tab-in-app-noti"
        >
          <Mail className="w-3.5 h-3.5" />
          Trong Hệ Thống ({filteredNotifications.filter(n => n.type === 'InApp').length})
        </button>
        <button
          onClick={() => setActiveTab('dLink')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'dLink'
              ? 'bg-amber-600 text-white shadow-sm font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
          id="tab-dlink-noti"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          dLink Chat Card ({filteredNotifications.filter(n => n.type === 'dLink').length})
        </button>
      </div>

      {/* List content */}
      <div className="flex-1 p-3 overflow-y-auto max-h-[350px] min-h-[220px]" id="notification-scroll-body">
        {filteredNotifications.filter(n => n.type === activeTab).length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-full py-8 text-stone-500">
            {activeTab === 'InApp' ? (
              <>
                <Mail className="w-8 h-8 opacity-25 mb-2.5 text-stone-400" />
                <p className="text-xs">Không có thông báo hệ thống nào</p>
                <p className="text-[10px] text-stone-600 mt-1">Hoàn thành khai báo để kích hoạt notifications!</p>
              </>
            ) : (
              <>
                <MessageSquare className="w-8 h-8 opacity-25 mb-2.5 text-amber-400" />
                <p className="text-xs text-stone-400">Hộp hội thoại dLink rỗng</p>
                <p className="text-[10px] text-stone-600 mt-1">Chat dLink mô phỏng tin nhắn dLink applet.</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredNotifications
              .filter(n => n.type === activeTab)
              .map((noti) => {
                const isDlink = noti.type === 'dLink';

                return (
                  <div
                    key={noti.id}
                    className={`p-3 rounded-lg border transition-all text-left relative group ${
                      !noti.isRead 
                        ? isDlink 
                          ? 'bg-stone-900 border-amber-600/40 text-stone-100 shadow-xs' 
                          : 'bg-stone-900 border-stone-700 text-stone-100 shadow-xs'
                        : 'bg-stone-950/60 border-stone-900 text-stone-400'
                    }`}
                    id={`noti-item-${noti.id}`}
                  >
                    {/* Receiver target indicator */}
                    {currentActor === 'SYS' && (
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        {getActorBadge(noti.receiver)}
                      </div>
                    )}

                    <div className="flex items-start gap-2.5 max-w-[90%]">
                      {isDlink ? (
                        <div className="p-1 px-1.5 bg-amber-700/50 text-amber-300 rounded-md text-[10px] font-bold shrink-0 mt-0.5">
                          dLink
                        </div>
                      ) : (
                        <div className={`p-1 rounded-sm shrink-0 mt-0.5 ${!noti.isRead ? 'bg-amber-600 text-stone-900' : 'bg-stone-800 text-stone-400'}`}>
                          <Mail className="w-3 h-3" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <h5 className={`text-xs font-bold leading-tight ${!noti.isRead ? 'text-white' : 'text-stone-300'}`}>
                          {noti.title}
                        </h5>
                        <p className="text-[11px] text-stone-400 leading-normal whitespace-pre-wrap">
                          {noti.content}
                        </p>
                        {isDlink && (
                          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-stone-800 border border-stone-700 rounded-sm text-[9px] text-amber-300 font-medium">
                            <ExternalLink className="w-2.5 h-2.5" /> {noti.linkText || 'Nhấn để xem'}
                          </div>
                        )}
                        <span className="block text-[9px] text-stone-500 font-mono mt-1 pt-1 border-t border-stone-800/60">
                          ⏱️ Thể sinh lúc: {noti.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Mark read button */}
                    {!noti.isRead && (
                      <button
                        onClick={() => onMarkRead(noti.id)}
                        className="absolute right-2 bottom-2 p-1 hover:bg-stone-800 text-stone-400 hover:text-stone-100 rounded-md transition-all opacity-0 group-hover:opacity-100"
                        title="Đánh dấu đã đọc"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
