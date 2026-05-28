import React from 'react';
import { Shield, User, Users, Cpu } from 'lucide-react';
import { SbuType } from '../types';

interface PerspectiveSelectorProps {
  currentRole: 'IC' | 'SM' | 'IG' | 'SYS';
  onChangeRole: (role: 'IC' | 'SM' | 'IG' | 'SYS') => void;
  sbu: SbuType;
  onChangeSbu: (sbu: SbuType) => void;
  declaresCount: number;
}

export default function PerspectiveSelector({
  currentRole,
  onChangeRole,
  sbu,
  onChangeSbu,
  declaresCount
}: PerspectiveSelectorProps) {
  return (
    <div className="bg-amber-50/40 border border-amber-200/60 rounded-xl p-4.5 mb-6" id="perspective-selector-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-stone-800 tracking-tight uppercase flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Không Gian Giả Lập Vai Trò (Actors Sandbox)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Chọn vai trò bên dưới để trải nghiệm luồng xử lý và màn hình tương tác của từng nhân vật trong iLEAD.
          </p>
        </div>
        
        {/* SBU & Declares controller (helps testing Step 1/2) */}
        {currentRole === 'IC' && (
          <div className="flex items-center gap-4 bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-stone-500">Phân loại SBU:</span>
              <div className="inline-flex rounded-md p-0.5 bg-stone-100">
                <button
                  onClick={() => onChangeSbu('IT')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-sm transition-all ${
                    sbu === 'IT' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                  id="btn-sbu-it"
                >
                  IT SBU
                </button>
                <button
                  onClick={() => onChangeSbu('non-IT')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-sm transition-all ${
                    sbu === 'non-IT' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                  id="btn-sbu-nit"
                >
                  Non-IT SBU
                </button>
              </div>
            </div>

            <div className="h-4 w-[1px] bg-stone-200"></div>

            <div className="text-[11px] text-stone-600">
              Số lần khai báo: <strong className="font-semibold text-amber-700">{declaresCount}</strong>
              <span className="block text-[9px] text-stone-400">
                ({declaresCount === 1 ? 'Mức 1: Câu hỏi soi chiếu Optional' : 'Mức 2+: Bắt buộc điền câu hỏi'})
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mt-4">
        {/* Role IC */}
        <button
          onClick={() => onChangeRole('IC')}
          className={`flex items-center gap-3 p-3 rounded-lg text-left border transition-all ${
            currentRole === 'IC'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
          }`}
          id="btn-role-ic"
        >
          <div className={`p-1.5 rounded-md ${currentRole === 'IC' ? 'bg-amber-700' : 'bg-amber-100/50'}`}>
            <User className={`w-4 h-4 ${currentRole === 'IC' ? 'text-amber-100' : 'text-amber-700'}`} />
          </div>
          <div>
            <div className="text-xs font-bold leading-tight">Nhân viên (IC)</div>
            <div className="text-[10px] opacity-80 mt-0.5">Khai báo Job Track</div>
          </div>
        </button>

        {/* Role SM */}
        <button
          onClick={() => onChangeRole('SM')}
          className={`flex items-center gap-3 p-3 rounded-lg text-left border transition-all ${
            currentRole === 'SM'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
          }`}
          id="btn-role-sm"
        >
          <div className={`p-1.5 rounded-md ${currentRole === 'SM' ? 'bg-amber-700' : 'bg-amber-100/55'}`}>
            <Users className={`w-4 h-4 ${currentRole === 'SM' ? 'text-amber-100' : 'text-amber-700'}`} />
          </div>
          <div>
            <div className="text-xs font-bold leading-tight">Quản lý (SM)</div>
            <div className="text-[10px] opacity-80 mt-0.5">Xác nhận / Co-sign</div>
          </div>
        </button>

        {/* Role IG */}
        <button
          onClick={() => onChangeRole('IG')}
          className={`flex items-center gap-3 p-3 rounded-lg text-left border transition-all ${
            currentRole === 'IG'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
          }`}
          id="btn-role-ig"
        >
          <div className={`p-1.5 rounded-md ${currentRole === 'IG' ? 'bg-amber-700' : 'bg-amber-100/55'}`}>
            <Shield className={`w-4 h-4 ${currentRole === 'IG' ? 'text-amber-100' : 'text-amber-700'}`} />
          </div>
          <div>
            <div className="text-xs font-bold leading-tight">Quản trị nội bộ (IG)</div>
            <div className="text-[10px] opacity-80 mt-0.5">Escalate & Hoà giải</div>
          </div>
        </button>

        {/* Role SYS */}
        <button
          onClick={() => onChangeRole('SYS')}
          className={`flex items-center gap-3 p-3 rounded-lg text-left border transition-all ${
            currentRole === 'SYS'
              ? 'bg-stone-800 text-amber-300 border-stone-800 shadow-sm'
              : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200 hover:border-stone-300'
          }`}
          id="btn-role-sys"
        >
          <div className={`p-1.5 rounded-md ${currentRole === 'SYS' ? 'bg-stone-900' : 'bg-stone-200'}`}>
            <Cpu className={`w-4 h-4 ${currentRole === 'SYS' ? 'text-amber-400' : 'text-stone-700'}`} />
          </div>
          <div>
            <div className="text-xs font-bold leading-tight">Time Travel & Setup</div>
            <div className="text-[10px] opacity-80 mt-0.5">Điều khiển SLA & Cron</div>
          </div>
        </button>
      </div>
    </div>
  );
}
