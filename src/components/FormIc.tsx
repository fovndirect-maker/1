import React, { useState, useEffect } from 'react';
import { SM, CareerTrackOption, FunctionalDomainOption, FunctionSpecialtyOption, SelfReflection, JobTrackRecord } from '../types';
import { SM_DIRECTORY, CAREER_TRACKS, FUNCTIONAL_DOMAINS, FUNCTION_SPECIALTIES } from '../data';
import { UserCheck, ShieldAlert, ArrowRight, Eye, Send, CheckCircle, ChevronDown, Sparkles } from 'lucide-react';

interface FormIcProps {
  record: JobTrackRecord;
  onUpdateRecord: (updated: Partial<JobTrackRecord>) => void;
  onSubmit: () => void;
}

export default function FormIc({ record, onUpdateRecord, onSubmit }: FormIcProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // Step 1: Assign SM, Step 2: Cascade Selection & Reflection, Step 3: Preview & Submit
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Local form state
  const [selectedSmId, setSelectedSmId] = useState<string>(record.assignedSm?.id || '');
  const [careerTrackId, setCareerTrackId] = useState<string>(record.careerTrack);
  const [domainId, setDomainId] = useState<string>(record.functionalDomain);
  const [specialtyId, setSpecialtyId] = useState<string>(record.functionalSpecialty);
  const [reflection, setReflection] = useState<SelfReflection>({ ...record.reflection });

  // Sync state with record updates (e.g. from reset / external controls)
  useEffect(() => {
    setSelectedSmId(record.assignedSm?.id || '');
    setCareerTrackId(record.careerTrack);
    setDomainId(record.functionalDomain);
    setSpecialtyId(record.functionalSpecialty);
    setReflection({ ...record.reflection });
    
    if (record.assignedSm === null) {
      setStep(1);
    } else if (record.status === 'Draft') {
      setStep(2);
    } else {
      setStep(3); // Already submitted
    }
  }, [record]);

  // Handle cascading state resets on change
  const handleCareerTrackChange = (val: string) => {
    setCareerTrackId(val);
    setDomainId('');
    setSpecialtyId('');
  };

  const handleDomainChange = (val: string) => {
    setDomainId(val);
    setSpecialtyId('');
  };

  const handleSpecialtyChange = (val: string) => {
    setSpecialtyId(val);
  };

  const currentSbuSMs = SM_DIRECTORY.filter(sm => sm.sbu === record.sbu);
  const filteredCareerTracks = CAREER_TRACKS.filter(ct => ct.sbu === record.sbu);
  const filteredDomains = FUNCTIONAL_DOMAINS.filter(fd => fd.sbu === record.sbu);
  const filteredSpecialties = FUNCTION_SPECIALTIES.filter(fs => fs.domainId === domainId);

  // Validate and assign SM
  const handleAssignSm = () => {
    const foundSm = SM_DIRECTORY.find(sm => sm.id === selectedSmId);
    if (!foundSm) {
      setErrorMsg('Vui lòng chọn một Trưởng bộ phận phụ trách (SM).');
      return;
    }
    setErrorMsg('');
    
    // Save to global state
    onUpdateRecord({
      assignedSm: foundSm,
      historyLogs: [
        ...record.historyLogs,
        {
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          actor: 'IC',
          action: 'Gán Trưởng bộ phận thành công',
          details: `Đã chọn người phụ trách trực tiếp: ${foundSm.name} (${foundSm.department})`
        }
      ]
    });
    
    setStep(2);
  };

  // Validate Cascade input & 3 Self-reflection questions
  const handleGoToPreview = () => {
    if (!careerTrackId) {
      setErrorMsg('Vui lòng chọn một Career Track.');
      return;
    }
    if (!domainId) {
      setErrorMsg('Vui lòng chọn một Functional Domain.');
      return;
    }
    if (!specialtyId) {
      setErrorMsg('Vui lòng chọn một Functional Specialty.');
      return;
    }

    // Checking validation rules for the 3 Self-reflection questions:
    // First declare (declaresCount === 1) -> optional
    // Edit declaration (declaresCount > 1) -> compulsory
    const isCompulsory = record.declaresCount > 1;
    if (isCompulsory) {
      if (!reflection.q1.trim() || !reflection.q2.trim() || !reflection.q3.trim()) {
        setErrorMsg('Vui lòng cung cấp câu trả lời bắt buộc cho cả 3 câu hỏi soi chiếu bản thân (Bắt buộc từ lần chỉnh sửa thứ 2 trở đi).');
        return;
      }
    }

    setErrorMsg('');
    
    // Save selections
    onUpdateRecord({
      careerTrack: careerTrackId,
      functionalDomain: domainId,
      functionalSpecialty: specialtyId,
      reflection: reflection
    });

    setStep(3);
  };

  const getSbuBadge = () => {
    return record.sbu === 'IT'
      ? <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-md">IT SBU</span>
      : <span className="px-2.5 py-1 bg-stone-100 text-stone-800 border border-stone-200 text-xs font-bold rounded-md">Non-IT SBU</span>;
  };

  const getSmName = (id: string) => SM_DIRECTORY.find(sm => sm.id === id)?.name || id;
  const getCtName = (id: string) => CAREER_TRACKS.find(ct => ct.id === id)?.name || '';
  const getFdName = (id: string) => FUNCTIONAL_DOMAINS.find(fd => fd.id === id)?.name || '';
  const getFsName = (id: string) => FUNCTION_SPECIALTIES.find(fs => fs.id === id)?.name || '';

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs" id="form-ic-panel">
      {/* Banner SBU Account Sync */}
      <div className="p-4.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-stone-400 font-mono tracking-wider">Tài khoản kết nối DMS</span>
          <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
            Đăng nhập: {record.icName}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium font-mono">Dữ liệu SBU:</span>
          {getSbuBadge()}
        </div>
      </div>

      {/* Steps indicators bar */}
      <div className="flex border-b border-stone-100 bg-stone-50/40 text-xs text-stone-400 font-medium">
        <div className={`flex-1 text-center py-3 border-r border-stone-100 ${step === 1 ? 'text-amber-700 font-bold bg-white border-b-2 border-b-amber-600' : 'text-stone-500 bg-stone-50/20'}`}>
          1. Gán Quản Lý (SM)
        </div>
        <div className={`flex-1 text-center py-3 border-r border-stone-100 ${step === 2 ? 'text-amber-700 font-bold bg-white border-b-2 border-b-amber-600' : 'text-stone-500 bg-stone-50/20'}`}>
          2. Chọn Job Track & Soi Chiếu
        </div>
        <div className={`flex-1 text-center py-3 ${step === 3 ? 'text-amber-700 font-bold bg-white border-b-2 border-b-amber-600' : 'text-stone-500 bg-stone-50/20'}`}>
          3. Preview & Submit
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 mx-4 mt-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium flex items-start gap-2 animate-bounce">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <div>{errorMsg}</div>
        </div>
      )}

      {/* Active Form workspace */}
      <div className="p-5.5">
        
        {/* ================= STEP 1: ASSIGN SM ================= */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in" id="ic-step-1">
            <div className="bg-amber-50/80 border border-amber-200/50 rounded-lg p-3.5 text-xs text-stone-700">
              <strong className="text-amber-900 block font-semibold">👉 Khởi tạo lần đầu: Hệ thống check chưa gán Quản lý</strong>
              <p className="mt-1 leading-relaxed">
                Tài khoản này được định dạng phân khu <span className="font-bold text-amber-800">{record.sbu} SBU</span>. Vui lòng lựa chọn 1 Trưởng bộ phận (Supervisor/Manager - SM) cùng phân hiệu để ký kết đồng hành iLEAD.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                Danh sách SM lọc theo SBU của bạn
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentSbuSMs.map((sm) => {
                  const isSelected = selectedSmId === sm.id;
                  return (
                    <button
                      key={sm.id}
                      type="button"
                      onClick={() => {
                        setSelectedSmId(sm.id);
                        setErrorMsg('');
                      }}
                      className={`p-3.5 rounded-lg border-2 text-left transition-all flex flex-col justify-between h-28 ${
                        isSelected 
                          ? 'border-amber-600 bg-amber-50/30' 
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                      id={`sm-choice-${sm.id}`}
                    >
                      <div>
                        <div className="text-xs font-extrabold text-stone-800 flex items-center justify-between">
                          <span>{sm.name}</span>
                          {isSelected && <span className="px-1.5 py-0.5 bg-amber-600 text-white text-[9px] rounded-sm font-bold uppercase">Đang gán</span>}
                        </div>
                        <p className="text-[10px] text-stone-400 mt-0.5 font-mono">{sm.email}</p>
                      </div>

                      <div className="border-t border-stone-100 pt-1.5 mt-2 flex items-center justify-between w-full">
                        <span className="text-[10.5px] font-medium text-stone-500 truncate">{sm.department}</span>
                        <span className="text-[9.5px] font-bold text-amber-700 uppercase bg-amber-100/50 px-1.5 py-0.5 rounded-xs">
                          {sm.sbu} SM
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={handleAssignSm}
                className="inline-flex items-center gap-2 py-2.5 px-5 bg-amber-700 text-white rounded-lg hover:bg-amber-800 text-xs font-bold cursor-pointer transition-all shadow-xs"
                id="btn-confirm-sm"
              >
                Gán Quản lý & Tiếp tục
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: CASCADE SELECTION ================= */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in" id="ic-step-2">
            
            {/* Cascade dropdown flow description */}
            <div className="p-3 bg-stone-50 border border-stone-200/60 rounded-lg flex items-center justify-between">
              <div className="text-xs">
                <span className="text-stone-400">Quản lý đồng hành:</span>{' '}
                <strong className="text-stone-800 font-bold">{record.assignedSm?.name}</strong>
                <span className="text-stone-400 font-mono text-[10px] ml-1.5">({record.assignedSm?.email})</span>
              </div>
              <button 
                type="button"
                onClick={() => setStep(1)} 
                className="text-[11px] font-bold text-amber-600 hover:underline"
              >
                Thay đổi SM
              </button>
            </div>

            {/* Cascade Select Dropdowns */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Cấu trúc chọn phân lớp nghề nghiệp (Cascade Selection)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Career Track */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-stone-700 uppercase">
                    1. Career Track (CT)
                  </label>
                  <div className="relative">
                    <select
                      value={careerTrackId}
                      onChange={(e) => handleCareerTrackChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-350 rounded-lg text-stone-850 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                      id="select-career-track"
                    >
                      <option value="">Chọn Career Track...</option>
                      {filteredCareerTracks.map(ct => (
                        <option key={ct.id} value={ct.id}>{ct.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Functional Domain */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-stone-700 uppercase">
                    2. Functional Domain (FD)
                  </label>
                  <select
                    value={domainId}
                    onChange={(e) => handleDomainChange(e.target.value)}
                    disabled={!careerTrackId}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-350 rounded-lg text-stone-850 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 disabled:bg-stone-50 disabled:text-stone-400 disabled:border-stone-200"
                    id="select-functional-domain"
                  >
                    <option value="">Chọn Functional Domain...</option>
                    {filteredDomains.map(fd => (
                      <option key={fd.id} value={fd.id}>{fd.name}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Function Specialty */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-stone-700 uppercase">
                    3. Function Specialty (FS)
                  </label>
                  <select
                    value={specialtyId}
                    onChange={(e) => handleSpecialtyChange(e.target.value)}
                    disabled={!domainId}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-350 rounded-lg text-stone-850 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 disabled:bg-stone-50 disabled:text-stone-400 disabled:border-stone-200"
                    id="select-function-specialty"
                  >
                    <option value="">{domainId ? "Chọn Function Specialty..." : "Chưa chọn Functional Domain"}</option>
                    {filteredSpecialties.map(fs => (
                      <option key={fs.id} value={fs.id}>{fs.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3 Self Reflection Questions */}
            <div className="border-t border-stone-200/80 pt-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="text-xs font-bold uppercase text-stone-700 tracking-wide">
                  3 Câu hỏi Soi Chiếu Bản Thân
                </h4>
                <div>
                  {record.declaresCount === 1 ? (
                    <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-bold border border-sky-200 rounded-sm uppercase">Khai báo đầu: Optional (Tự chọn)</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-200 rounded-sm uppercase">Khai báo edit {record.declaresCount}: Bắt buộc điền</span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {/* Question 1 */}
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-semibold text-stone-800 leading-snug">
                    ❓ 1. Điều gì khiến tôi chọn lĩnh vực này? {record.declaresCount > 1 && <span className="text-amber-600 font-bold">*</span>}
                  </label>
                  <textarea
                    rows={2}
                    value={reflection.q1}
                    onChange={(e) => setReflection({ ...reflection, q1: e.target.value })}
                    placeholder="Mô tả lý do, đam mê hoặc cơ hội giúp bạn định hướng..."
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                    id="textarea-q1"
                  />
                </div>

                {/* Question 2 */}
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-semibold text-stone-800 leading-snug">
                    ❓ 2. Tôi đang nhìn nhận vị trí hiện tại của mình thế nào? {record.declaresCount > 1 && <span className="text-amber-600 font-bold">*</span>}
                  </label>
                  <textarea
                    rows={2}
                    value={reflection.q2}
                    onChange={(e) => setReflection({ ...reflection, q2: e.target.value })}
                    placeholder="Đánh giá điểm mạnh, năng lực thích nghi và khó khăn hiện nay..."
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                    id="textarea-q2"
                  />
                </div>

                {/* Question 3 */}
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-semibold text-stone-800 leading-snug">
                    ❓ 3. Tôi muốn trở thành gì trong 12 tháng tới? {record.declaresCount > 1 && <span className="text-amber-600 font-bold">*</span>}
                  </label>
                  <textarea
                    rows={2}
                    value={reflection.q3}
                    onChange={(e) => setReflection({ ...reflection, q3: e.target.value })}
                    placeholder="Nêu ra vị trí, mục tiêu năng lực cụ thể mà bạn nhắm tới..."
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                    id="textarea-q3"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200/80 flex justify-end">
              <button
                type="button"
                onClick={handleGoToPreview}
                className="inline-flex items-center gap-2 py-2.5 px-5 bg-amber-700 text-white rounded-lg hover:bg-amber-800 text-xs font-bold pointer cursor-pointer transition-all shadow-xs"
                id="btn-go-to-preview"
              >
                Xem trước & Submit
                <Eye className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ================= STEP 3: PREVIEW & SUBMIT ================= */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in" id="ic-step-3">
            
            {record.status !== 'Draft' ? (
              <div className="bg-emerald-50 border border-emerald-200 text-xs rounded-lg p-5 text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Hồ sơ Job Track Đã Được Submit Thành Công!
                </div>
                <p className="leading-snug">
                  Định nhận nghề nghiệp hiện đã chuyển sang trạng thái <strong className="text-emerald-900 font-extrabold">"Pending co-sign"</strong>. Một tin nhắn dLink Chat Card và Thông báo nội bộ đã được chuyển tiếp trực tiếp đến Quản lý: <strong className="text-stone-800 font-extrabold">{record.assignedSm?.name}</strong>.
                </p>
                <div className="pt-2 text-[11px] text-stone-500 leading-tight">
                  📌 SM của bạn có tối đa 48h làm việc để tiến hành co-sign đồng ý hoặc gửi phản hồi xem xét thêm. Bạn có thể theo dõi SLA Tracker để biết quy trình.
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/50 border border-amber-200/50 rounded-lg p-3 text-xs text-stone-700">
                <strong className="text-amber-900 block font-semibold text-xs mb-1">🔍 Vui lòng kiểm tra lại thông tin trước khi nhấn Gửi duyệt</strong>
                Các lựa chọn cascade và câu trả lời soi chiếu sẽ được chuyển tiếp tức thì sang cổng thẩm định của SM.
              </div>
            )}

            {/* Read only summary view */}
            <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-stone-50 p-3 font-bold text-stone-800 border-b border-stone-200 uppercase tracking-wide">
                Hồ Sơ Job Track Bản Xem Trước (iLEAD Passport)
              </div>
              <div className="p-4 space-y-4">
                
                {/* Cascade Preview Grid */}
                <div className="grid grid-cols-2 gap-4 border-b border-stone-100 pb-4">
                  <div>
                    <span className="block text-[10px] text-stone-400 font-bold uppercase">SBU Phân Vùng</span>
                    <strong className="text-stone-800 text-xs font-semibold">{record.sbu} SBU</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400 font-bold uppercase">Quản Lý Nhận Hồ Sơ</span>
                    <strong className="text-amber-700 text-xs font-bold">{record.assignedSm?.name}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] text-stone-400 font-bold uppercase">Career Track (CT)</span>
                    <p className="text-stone-800 text-xs font-semibold">{getCtName(careerTrackId)}</p>
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400 font-bold uppercase">Functional Domain (FD)</span>
                    <p className="text-stone-800 text-xs font-semibold">{getFdName(domainId)}</p>
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400 font-bold uppercase">Function Specialty (FS)</span>
                    <p className="text-stone-800 text-xs font-semibold">{getFsName(specialtyId)}</p>
                  </div>
                </div>

                {/* Reflection Questions Preview */}
                <div className="space-y-3.5">
                  <span className="block text-[10px] text-stone-400 font-bold uppercase">Nội Dung Soi Chiếu Bản Thân</span>
                  
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <div className="font-semibold text-stone-700">❓ 1. Điều gì khiến tôi chọn lĩnh vực này?</div>
                    <p className="text-stone-600 mt-1 italic text-xs leading-relaxed">
                      {reflection.q1 || <span className="text-stone-400">Không cung cấp (chọn bổ sung sau)</span>}
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg">
                    <div className="font-semibold text-stone-700">❓ 2. Tôi đang nhìn nhận vị trí hiện tại của mình thế nào?</div>
                    <p className="text-stone-600 mt-1 italic text-xs leading-relaxed">
                      {reflection.q2 || <span className="text-stone-400">Không cung cấp (chọn bổ sung sau)</span>}
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg">
                    <div className="font-semibold text-stone-700">❓ 3. Tôi muốn trở thành gì trong 12 tháng tới?</div>
                    <p className="text-stone-600 mt-1 italic text-xs leading-relaxed">
                      {reflection.q3 || <span className="text-stone-400">Không cung cấp (chọn bổ sung sau)</span>}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back to Draft button & Submit Form buttons */}
            <div className="pt-4 border-t border-stone-200/80 flex items-center justify-between">
              {record.status === 'Draft' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-800"
                  >
                    Chỉnh sửa lại nội dung
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // Call main parent submit handler
                      onSubmit();
                    }}
                    className="inline-flex items-center gap-2 py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all shadow-xs"
                    id="btn-submit-job-track"
                  >
                    Submit & Send SM Alerts
                    <Send className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="text-stone-400 text-xs italic">
                  * Hồ sơ đang khoá để phục vụ thẩm định của SM. Nhấn vào giả lập SYS để reset hoặc thay đổi dữ liệu.
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
