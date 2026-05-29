import React, { useState } from 'react';
import { JobTrackRecord } from '../types';
import { getOptionName } from '../data';
import { Shield, Sparkles, MessageSquare, Save, Users, RefreshCw, CheckCircle, Clock } from 'lucide-react';

interface IgDialogueProps {
  record: JobTrackRecord;
  onPostResolution: (actionType: 'CO_SIGN_SUCCESS' | 'IC_EDIT_FLOW', annotation: string, igStatus: string) => void;
  onOverrideSlaHours: (hours: number) => void;
}

export default function IgDialogue({ record, onPostResolution, onOverrideSlaHours }: IgDialogueProps) {
  const [meetingLog, setMeetingLog] = useState<string>('');
  const [escalationScenario, setEscalationScenario] = useState<'Delay - operational' | 'SM concern' | 'SM non-responsive' | ''>(
    record.status === 'Reviewing' ? 'SM concern' : 'Delay - operational'
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  const isActive = record.status === 'Reviewing' || record.status === 'Escalation';

  if (!isActive) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-6 text-center text-xs text-stone-500">
        Không có thông báo bế tắc hay yêu cầu khẩn cấp nào thuộc thẩm quyền xử lý của IG ở thời điểm hiện tại.
        <div className="mt-2 text-stone-400">
          * Trạng thái hồ sơ cần phải là: <strong className="text-stone-600">Reviewing</strong> hoặc <strong className="text-stone-600">Escalation</strong>
        </div>
      </div>
    );
  }

  const handleResolveCoSign = () => {
    if (!meetingLog.trim()) {
      setErrorMsg('Vui lòng nhập Biên bản/Kết quả họp liên lạc trước khi kết thúc.');
      return;
    }
    setErrorMsg('');
    onPostResolution('CO_SIGN_SUCCESS', meetingLog, escalationScenario);
  };

  const handleRequestEdit = () => {
    if (!meetingLog.trim()) {
      setErrorMsg('Vui lòng nhập lý do/yêu cầu thay đổi từ kết quả họp để quay lại luồng Edit.');
      return;
    }
    setErrorMsg('');
    onPostResolution('IC_EDIT_FLOW', meetingLog, escalationScenario);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs" id="form-ig-panel">
      {/* IG header bar */}
      <div className="p-4.5 bg-stone-900 text-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 px-2 bg-stone-850 border border-stone-700 text-amber-300 rounded font-bold text-xs uppercase font-mono">
            IG Dashboard
          </div>
          <h3 className="text-sm font-bold text-white">Kết Nối Hoà Giải & Xử Lý Escalation</h3>
        </div>
        <span className="text-xs font-semibold text-amber-400 bg-stone-800 px-2 py-0.5 rounded-md animate-pulse">
          SLA Action Needed
        </span>
      </div>

      <div className="p-5.5 space-y-6">
        
        {/* Detail Box */}
        <div className="p-4 bg-stone-50 rounded-lg text-xs space-y-2 border border-stone-200/50">
          <div className="font-bold text-stone-800 uppercase tracking-wide">
            Cơ Chế Can Thiệp của Phòng Quản Trị Nội Bộ (IG)
          </div>
          <p className="text-stone-600 leading-relaxed">
            {record.status === 'Reviewing' ? (
              <span>
                👉 SM <strong>{record.assignedSm?.name}</strong> đã đề xuất <strong>Reviewing (Xem xét thêm)</strong> với ghi chú: <em className="text-stone-900 font-medium font-mono">"{record.smNote}"</em>. Nhiệm vụ của IG là điều phối buổi đối thoại 3 bên (SM + IC + IG) trong vòng 2 ngày để hướng dẫn thống nhất.
              </span>
            ) : (
              <span>
                ⚠️ Hệ thống kích hoạt trạng thái <strong>Escalation (Khẩn cấp)</strong> do SM quá hạn 48h không ký nhận. IG cần thực hiện 2 bước trong vòng 2 ngày tiếp theo: (1) Liên hệ SM tìm hiểu lý do trì hoãn, (2) Ghi chú kết quả vào hệ thống và hướng dẫn SM ký gấp.
              </span>
            )}
          </p>
        </div>

        {/* Form setup for Logging dialogue consensus */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1">
            <Users className="w-4 h-4 text-amber-600" />
            Biên Bản Làm Việc 3 Bên & Phân Loại Của IG
          </h4>

          {errorMsg && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-xs text-amber-900 rounded font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Escalation scenario collector */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-stone-705 uppercase">
                Tình huống Ghi nhận từ Trưởng Bộ Phận (SM)
              </label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 p-2 px-3 bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-lg cursor-pointer text-xs">
                  <input
                    type="radio"
                    name="scen"
                    checked={escalationScenario === 'Delay - operational'}
                    onChange={() => setEscalationScenario('Delay - operational')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>SM xác nhận sẽ co-sign (Delay - operational)</span>
                </label>

                <label className="flex items-center gap-2 p-2 px-3 bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-lg cursor-pointer text-xs">
                  <input
                    type="radio"
                    name="scen"
                    checked={escalationScenario === 'SM concern'}
                    onChange={() => setEscalationScenario('SM concern')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>SM có quan ngại về nội dung (Ghi concern cụ thể)</span>
                </label>

                <label className="flex items-center gap-2 p-2 px-3 bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-lg cursor-pointer text-xs">
                  <input
                    type="radio"
                    name="scen"
                    checked={escalationScenario === 'SM non-responsive'}
                    onChange={() => setEscalationScenario('SM non-responsive')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>SM không liên lạc được / từ chối (SM non-responsive)</span>
                </label>
              </div>
            </div>

            {/* Dialogue text notes */}
            <div className="space-y-1.5 flex flex-col">
              <label className="block text-[11px] font-bold text-stone-705 uppercase">
                Ghi chú Biên bản / Log Đối thoại của IG *
              </label>
              <textarea
                rows={4}
                value={meetingLog}
                onChange={(e) => {
                  setMeetingLog(e.target.value);
                  setErrorMsg('');
                }}
                placeholder={
                  escalationScenario === 'SM concern' 
                    ? 'Nhập các thảo luận cụ thể, sự không đồng thuận về Career Track và hướng giải quyết...'
                    : escalationScenario === 'Delay - operational'
                      ? 'Nêu lý lịch công tác, bận dự án vận hành dẫn tới SM phản hồi muộn...'
                      : 'Hành vi hoặc rào cản khiến SM không phản hồi, phương án xử lý kỷ luật hoặc báo cáo lên EXCO...'
                }
                className="w-full flex-1 text-xs p-2.5 bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                id="textarea-ig-dialogue-log"
              />
            </div>
          </div>

          {/* SLA Warning */}
          <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg text-[10.5px] text-stone-600 flex items-start gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>🔔 Quy tắc SLA 96h khắt khe:</strong> IG có đúng 2 ngày để thúc giục & giải quyết từ lúc Escalation (tức tổng mốc 96h kể từ lúc IC nhấn submit). Nếu quá mốc 96h, hệ thống sẽ gán log <span className="font-semibold text-amber-800">"Auto Co-signed by system"</span> và tự động kết thúc vòng lặp để giải phóng hồ sơ.
            </div>
          </div>

          {/* Action outputs */}
          <div className="border-t border-stone-200 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 p-3 rounded-lg">
            <span className="text-[11px] text-stone-500 italic font-mono">
              * IG không có quyền trực tiếp co-sign thay SM, nhưng có quyền ký Biên bản liên tịch để ra quyết định hệ thống.
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              
              {/* Outcome Option B */}
              <button
                type="button"
                onClick={handleRequestEdit}
                className="flex-1 sm:flex-none py-2 px-3 border border-amber-600 hover:bg-amber-50 text-amber-700 text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1"
                id="btn-ig-request-edit"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                🔄 Yêu cầu IC Sửa đổi lại
              </button>

              {/* Outcome Option A */}
              <button
                type="button"
                onClick={handleResolveCoSign}
                className="flex-1 sm:flex-none py-2 px-4.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all shadow-xs flex items-center justify-center gap-1"
                id="btn-ig-complete"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                ✅ Đồng ý Co-sign sau đối thoại
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
