import React from 'react';
import { Clock, AlertTriangle, CheckCircle, ShieldAlert, Award, Calendar } from 'lucide-react';
import { JobTrackStatus } from '../types';

interface SlaTrackerProps {
  status: JobTrackStatus;
  elapsedHours: number;
  onTimeTravel: (hours: number) => void;
}

export default function SlaTracker({ status, elapsedHours, onTimeTravel }: SlaTrackerProps) {
  // Compute percentage based on 96 hours deadline
  const percentage = Math.min(100, (elapsedHours / 96) * 100);

  const getStatusColor = (s: JobTrackStatus) => {
    switch (s) {
      case 'Draft': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Pending co-sign': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Reviewing': return 'bg-violet-100 text-violet-800 border-violet-200';
      case 'Escalation': return 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse';
      case 'Co-signed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Auto Co-signed': return 'bg-teal-100 text-teal-800 border-teal-200';
    }
  };

  const getStatusLabel = (s: JobTrackStatus) => {
    switch (s) {
      case 'Draft': return 'Nháp (Đang khai báo)';
      case 'Pending co-sign': return 'Chờ SM đồng ký (Pending Co-sign)';
      case 'Reviewing': return 'SM đề xuất Xem xét thêm (Reviewing)';
      case 'Escalation': return 'Quá hạn 48h - Khẩn cấp (Escalation)';
      case 'Co-signed': return 'Đã đồng ký (Co-signed) ✅';
      case 'Auto Co-signed': return 'Hệ thống Tự động Đồng ký (Auto Co-signed) 🤖';
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs" id="sla-tracker-main">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-stone-100 rounded-lg">
            <Clock className="w-5 h-5 text-stone-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-800 tracking-tight">SLA Tracker & Thời Gian Thực Tế</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-stone-500">Trạng thái Job Track hiện tại:</span>
              <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full border ${getStatusColor(status)}`}>
                {getStatusLabel(status)}
              </span>
            </div>
          </div>
        </div>

        {/* Current Time elapsed visualizer */}
        <div className="flex items-center gap-3 bg-stone-50 px-3.5 py-2 rounded-lg border border-stone-200/60">
          <div className="text-right">
            <span className="block text-[10px] text-stone-400 font-medium uppercase font-mono">Thời gian trôi qua</span>
            <span className="text-base font-extrabold text-stone-800 font-mono tracking-tight">{elapsedHours} giờ</span>
          </div>
          <div className="h-8 w-[1px] bg-stone-200"></div>
          <div>
            <span className="block text-[10px] text-stone-400 font-medium uppercase font-mono">SLA còn lại</span>
            <span className={`text-sm font-bold font-mono ${96 - elapsedHours <= 0 ? 'text-rose-600' : 'text-amber-700'}`}>
              {96 - elapsedHours > 0 ? `${96 - elapsedHours} giờ` : 'Đã hết hạn'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress slider bar */}
      <div className="relative my-8 px-2">
        <div className="h-2 w-full bg-stone-100 rounded-full border border-stone-200/50 relative overflow-hidden">
          {/* Progress fill */}
          <div 
            className={`h-full transition-all duration-500 rounded-full ${
              status === 'Co-signed' ? 'bg-emerald-500' :
              status === 'Auto Co-signed' ? 'bg-teal-500' :
              elapsedHours >= 96 ? 'bg-rose-500' :
              elapsedHours >= 48 ? 'bg-amber-500' : 'bg-sky-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* Hour pointer pin */}
        <div 
          className="absolute -top-3.5 transition-all duration-500 flex flex-col items-center"
          style={{ left: `calc(${percentage}% - 12px)` }}
        >
          <div className="w-6 h-6 rounded-full bg-stone-900 text-white font-mono text-[10px] flex items-center justify-center font-bold shadow-md border-2 border-white">
            {elapsedHours}h
          </div>
          <div className="w-0.5 h-3.5 bg-stone-900 mt-1"></div>
        </div>

        {/* Key SLA Milestones marker flags */}
        <div className="grid grid-cols-4 text-center mt-3 text-[11px] text-stone-500 font-medium">
          <div className="text-left relative">
            <div className="absolute top-[-26px] left-0 w-2 h-2 rounded-full bg-stone-400"></div>
            <strong className="block text-stone-800 font-semibold font-mono">0h (Submit)</strong>
            <span className="text-[10px] text-stone-400">Noti đến SM</span>
          </div>

          <div className="text-center relative">
            <div className="absolute top-[-26px] left-[50%] -translate-x-1/2 w-2 h-2 rounded-full bg-stone-400"></div>
            <strong className="block text-stone-800 font-semibold font-mono">24h (Reminder)</strong>
            <span className="text-[10px] text-stone-400">SMS tự động</span>
          </div>

          <div className="text-center relative">
            <div className="absolute top-[-26px] left-[50%] -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            <strong className="block text-amber-700 font-semibold font-mono">48h (Deadline)</strong>
            <span className="text-[10px] text-stone-400">Escalate dLink IG</span>
          </div>

          <div className="text-right relative">
            <div className="absolute top-[-26px] right-0 w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></div>
            <strong className="block text-rose-700 font-semibold font-mono">96h (Gới hạn)</strong>
            <span className="text-[10px] text-stone-400">Auto Co-sign</span>
          </div>
        </div>
      </div>

      {status === 'Draft' && (
        <div className="bg-amber-50/50 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-950 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Đang ở trạng thái chuẩn bị:</strong> Nhân viên cần chọn quản lý trực tiếp (SM) và hoàn thành khai báo Job Track (Career Track, Domain, Specialty) cùng 3 câu hỏi soi chiếu bản thân để gửi đi.
          </div>
        </div>
      )}

      {status === 'Pending co-sign' && elapsedHours < 48 && (
        <div className="bg-sky-50 border border-sky-100 rounded-lg p-3.5 text-xs text-sky-950 flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-sky-900">Tính năng SLA khởi động: Chờ xác nhận trong 48h</div>
            <p className="mt-1 text-stone-500 leading-relaxed">
              SM của bạn đã có 48h để thực hiện <strong>Co-sign</strong> hoặc đề nghị <strong>Xem xét thêm</strong>. Hệ thống sẽ tự động nhắc nhở sau 24 giờ. Nếu vượt quá mốc 48 giờ mà không có hành động nào, trạng thái sẽ nhảy sang <strong>Escalation</strong> chuyển dLink tới Phòng quản trị nội bộ (IG).
            </p>
          </div>
        </div>
      )}

      {status === 'Reviewing' && (
        <div className="bg-violet-50 border border-violet-100 rounded-lg p-3.5 text-xs text-violet-950 flex items-start gap-2.5 w-full">
          <ShieldAlert className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
          <div className="w-full">
            <div className="font-semibold text-violet-950">Nhánh B: Đã báo cáo cho Ban Quản Trị Nội Bộ (IG)</div>
            <p className="mt-1 text-stone-600">
              SM nhận thấy cần trao đổi thêm trước khi ký kết. Hệ thống đã tự động gửi báo động tới IG đề nghị tổ chức buổi đối thoại 3 bên (SM + IC + IG) trong vòng 2 ngày làm việc tiếp theo.
            </p>
          </div>
        </div>
      )}

      {status === 'Escalation' && (
        <div className="bg-rose-50 border border-rose-100 rounded-lg p-3.5 text-xs text-rose-950 flex items-start gap-2.5 animate-pulse">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-rose-900">⚠️ Nhánh C: Báo Động Quá Hạn 48h (Escalation Active)</div>
            <p className="mt-1 text-stone-600">
              SM đã quá hạn 48 giờ phản hồi. Hệ thống tự động kích hoạt cảnh báo gửi tới IG. IG cần liên lạc với SM để thu thập lý do trì hoãn (Delay - operational, Concern về nội dung, SM non-responsive) và hướng dẫn hoàn thành sớm trước thời hạn 96h.
            </p>
          </div>
        </div>
      )}

      {status === 'Co-signed' && (
        <div className="bg-emerald-50 border border-emerald-150 rounded-lg p-3.5 text-xs text-emerald-950 flex items-start gap-2.5">
          <Award className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-emerald-900">Hoành thành xuất sắc! Trạng thái: Co-signed (Đã đồng ký)</div>
            <p className="mt-1 text-stone-600 leading-relaxed">
              Nhân sự và Quản lý đồng hành đã đặt bút ký kết một Job Track mới trên hành trình <strong>iLEAD</strong>. Hệ thống mở khoá lộ trình sâu hơn (Depth Track) cùng việc soạn thảo Kế hoạch phát triển cá nhân (IDP Draft).
            </p>
          </div>
        </div>
      )}

      {status === 'Auto Co-signed' && (
        <div className="bg-teal-50 border border-teal-150 rounded-lg p-3.5 text-xs text-teal-950 flex items-start gap-2.5">
          <Calendar className="w-4.5 h-4.5 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-teal-900">Kết quả: Auto Co-signed (Hệ thống tự động đồng ký lúc 96h)</div>
            <p className="mt-1 text-stone-600 leading-relaxed">
              Do thời gian trôi qua vượt quá 96 giờ quy định và IG chưa ghi nhận biên bản đối thoại thay thế, hệ thống đã tự động thực thi <strong>Auto Co-signed by System</strong> để đảm bảo tiến trình iLEAD của nhân sự không bị tắc nghẽn, đồng thời lưu nhật ký đánh giá mức độ phản hồi của Quản lý.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
