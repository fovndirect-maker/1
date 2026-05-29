import React, { useState } from 'react';
import { JobTrackRecord, SM } from '../types';
import { getOptionName } from '../data';
import { CheckCircle, AlertTriangle, MessageSquare, ArrowRight, ShieldAlert, FileText, Info } from 'lucide-react';

interface ManagerActionProps {
  record: JobTrackRecord;
  onCoSign: () => void;
  onReviewLater: (notes: string) => void;
}

export default function ManagerAction({ record, onCoSign, onReviewLater }: ManagerActionProps) {
  const [note, setNote] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!record.assignedSm) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-6 text-center text-xs text-stone-500">
        Hiện tại chưa có nhân sự khai báo nào gán cho bạn phụ trách. Vui lòng chuyển sang vai IC để khai báo trước.
      </div>
    );
  }

  const handleReview = () => {
    if (!note.trim()) {
      setErrorMsg('Vui lòng cung cấp ghi chú vì sao cần xem xét thêm để IG có thông tin điều phối buổi họp.');
      return;
    }
    setErrorMsg('');
    onReviewLater(note);
  };

  const isPending = record.status === 'Pending co-sign';
  const isOverdue = record.elapsedHours >= 48;

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs" id="form-sm-panel">
      {/* Target manager bio banner */}
      <div className="p-4.5 bg-stone-900 text-stone-100 flex items-center justify-between">
        <div>
          <span className="text-[9px] uppercase font-bold text-amber-400 font-mono tracking-wider">Trưởng bộ phận phụ trách (SM)</span>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            Đang đánh giá với vai trò: {record.assignedSm.name}
          </h3>
        </div>
        <span className="text-xs font-bold text-stone-400 bg-stone-800 border border-stone-700 px-2 py-0.5 rounded-md">
          {record.assignedSm.department}
        </span>
      </div>

      <div className="p-5.5 space-y-6">
        
        {/* If record status is not pending SM actions, display static screen */}
        {!isPending && (
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 text-center text-xs text-stone-600 space-y-3">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
            <div className="font-semibold text-stone-800">Không có hồ sơ nào đang chờ hành động từ SM</div>
            <p className="max-w-md mx-auto text-[11px] leading-relaxed text-stone-500">
              Hồ sơ Job Track của <strong className="text-stone-800 font-bold">{record.icName}</strong> hiện đang nằm ở trạng thái:{' '}
              <span className="px-2 py-0.5 bg-stone-200 text-stone-800 font-bold rounded-full text-[10px]">
                {record.status}
              </span>
            </p>
            {record.status === 'Co-signed' && (
              <p className="text-[11px] text-emerald-700 font-medium">
                👉 Bạn đã hoàn thành Co-sign ký nhận cho nhân sự này rồi!
              </p>
            )}
            {record.status === 'Reviewing' && (
              <div className="bg-purple-50 text-purple-950 p-3 rounded-lg border border-purple-200 text-left space-y-1">
                <strong className="block text-[11.5px] text-purple-900">Chi tiết ý kiến xem xét thêm của bạn gửi IG:</strong>
                <p className="italic text-stone-600">"{record.smNote}"</p>
              </div>
            )}
          </div>
        )}

        {isPending && (
          <div className="space-y-6 animate-fade-in">
            {/* SLA Alert banner */}
            <div className={`p-4 rounded-lg text-xs flex items-start gap-2.5 border ${
              isOverdue 
                ? 'bg-amber-50 border-amber-300 text-stone-900' 
                : 'bg-amber-50/50 border-amber-200/50 text-stone-700'
            }`}>
              <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${isOverdue ? 'text-amber-600' : 'text-amber-600'}`} />
              <div>
                {isOverdue ? (
                  <>
                    <strong className="text-amber-900 font-extrabold block">🚨 CẢNH BÁO: ĐÃ QUÁ HẠN SLA 48H CHO SM</strong>
                    <p className="mt-1 leading-relaxed text-stone-600">
                      Thời gian hiện tại đã trôi qua <strong className="text-amber-700">{record.elapsedHours} giờ</strong> kể từ lúc IC gửi hồ sơ. Trạng thái đã chuyển thành <strong className="font-semibold text-amber-800">Escalation</strong> gửi thông báo khẩn cấp cho ban IG can thiệp. Hãy nhanh chóng co-sign hoặc đưa ra ghi chú để giải quyết bế tắc.
                    </p>
                  </>
                ) : (
                  <>
                    <strong className="text-stone-800 block">⏱️ Thời hạn phản hồi còn lại: {48 - record.elapsedHours} giờ</strong>
                    <p className="mt-1 leading-relaxed text-stone-500">
                      Bạn có tối đa 48 giờ kể từ lúc nhân viên gửi khai báp để đánh giá hồ sơ. Hiện tại đã trôi qua {record.elapsedHours} giờ.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Crucial Note check */}
            <div className="bg-blue-50 border border-blue-200/60 rounded-lg p-3.5 text-[11.5px] text-blue-950 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>📌 LƯU Ý QUAN TRỌNG:</strong>
                <p className="mt-0.5 text-blue-900/90 leading-relaxed font-semibold">
                  "Việc đồng ký này là xác nhận anh/chị ĐÃ BIẾT lựa chọn định hướng nghề nghiệp của nhân viên mình — KHÔNG PHẢI PHÊ DUYỆT (APPROVAL)". 
                </p>
                <span className="block text-[10px] text-blue-700 mt-1">Con-sign là cơ sở để SM đồng hành, huấn luyện và cam kết bồi dưỡng lộ trình iLEAD tiếp sau.</span>
              </div>
            </div>

            {/* IC's declared record summary */}
            <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-stone-50 px-4 py-2.5 font-bold text-stone-800 border-b border-stone-200 flex items-center justify-between">
                <span>Hồ Sơ Của Nhân Viên: {record.icName}</span>
                <span className="px-2 py-0.5 bg-stone-200 text-stone-700 rounded text-[10px] font-mono">
                  Lần khai báo #{record.declaresCount}
                </span>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-stone-50 p-3 rounded-lg border border-stone-250/50">
                  <div>
                    <span className="block text-[10px] text-stone-400 font-bold uppercase">SBU</span>
                    <strong>{record.sbu} SBU</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400 font-bold uppercase">Career Track</span>
                    <strong className="text-stone-800 leading-tight block">{getOptionName(record.careerTrack, 'CT')}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400 font-bold uppercase">Functional Domain</span>
                    <strong className="text-stone-800 leading-tight block">{getOptionName(record.functionalDomain, 'FD')}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400 font-bold uppercase">Functional Specialty</span>
                    <strong className="text-stone-800 leading-tight block">{getOptionName(record.functionalSpecialty, 'FS')}</strong>
                  </div>
                </div>

                {/* Self Reflection Display */}
                <div className="space-y-3">
                  <span className="block text-[10px] text-stone-400 font-bold uppercase">3 Câu hỏi Soi Chiếu Bản Thân từ IC</span>
                  
                  <div className="p-3 bg-stone-50/50 border border-stone-100 rounded-lg">
                    <div className="font-semibold text-stone-700">❓ 1. Điều gì khiến tôi chọn lĩnh vực này?</div>
                    <p className="text-stone-600 mt-1 italic leading-relaxed">
                      "{record.reflection.q1 || 'Không điền (Lần đầu optional)'}"
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50/50 border border-stone-100 rounded-lg">
                    <div className="font-semibold text-stone-700">❓ 2. Tôi đang nhìn nhận vị trí hiện tại của mình thế nào?</div>
                    <p className="text-stone-600 mt-1 italic leading-relaxed">
                      "{record.reflection.q2 || 'Không điền (Lần đầu optional)'}"
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50/50 border border-stone-100 rounded-lg">
                    <div className="font-semibold text-stone-700">❓ 3. Tôi muốn trở thành gì trong 12 tháng tới?</div>
                    <p className="text-stone-600 mt-1 italic leading-relaxed">
                      "{record.reflection.q3 || 'Không điền (Lần đầu optional)'}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium">
                {errorMsg}
              </div>
            )}

            {/* Action buttons (Option A vs Option B) */}
            <div className="border-t border-stone-200/80 pt-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-between">
                
                {/* Option B input panel */}
                <div className="w-full sm:max-w-md space-y-1.5 text-left">
                  <label className="block text-[11px] font-bold text-stone-700 uppercase">
                    🖊️ Nhập phản hồi nếu chọn "Xem xét thêm"
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => {
                      setNote(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Ghi cụ thể lăn tăn, điểm cần làm sáng tỏ cùng IC trước khi ký..."
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                    id="textarea-sm-note"
                  />
                </div>

                {/* Actions group */}
                <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 self-end w-full sm:w-auto">
                  
                  {/* Nhánh B */}
                  <button
                    type="button"
                    onClick={handleReview}
                    className="py-2.5 px-4 bg-stone-150 hover:bg-stone-250 text-stone-700 font-bold border border-stone-300 rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    id="btn-sm-review"
                  >
                    <MessageSquare className="w-4 h-4 text-stone-500" />
                    🔄 Đề nghị xem xét thêm
                  </button>

                  {/* Nhánh A */}
                  <button
                    type="button"
                    onClick={onCoSign}
                    className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-xs cursor-pointer transition-all shadow-xs flex items-center justify-center gap-1.5"
                    id="btn-sm-cosign"
                  >
                    <CheckCircle className="w-4 h-4" />
                    ✅ Co-sign Đồng Ý
                  </button>

                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
