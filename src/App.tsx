import React, { useState } from 'react';
import { JobTrackRecord, JobTrackStatus, NotificationMsg, SbuType, SM } from './types';
import { SM_DIRECTORY, getOptionName } from './data';
import PerspectiveSelector from './components/PerspectiveSelector';
import SlaTracker from './components/SlaTracker';
import NotificationCenter from './components/NotificationCenter';
import FormIc from './components/FormIc';
import ManagerAction from './components/ManagerAction';
import IgDialogue from './components/IgDialogue';

import { 
  Award, 
  BookOpen, 
  ChevronRight, 
  Clock, 
  Database, 
  HelpCircle, 
  Layers, 
  LayoutDashboard, 
  LogOut, 
  MessageSquare, 
  Play, 
  RefreshCw, 
  ShieldAlert, 
  TrendingUp, 
  Users,
  Menu,
  Sparkles,
  Bell,
  CheckCircle,
  AlertTriangle,
  Send,
  Lock,
  Cpu,
  User,
  ExternalLink,
  MessageCircle,
  Bookmark,
  LayoutGrid,
  FileText,
  Sliders,
  Compass,
  ArrowRight,
  BookMarked,
  Flame,
  CheckSquare,
  Briefcase
} from 'lucide-react';

export default function App() {
  // Navigation states
  const [activeMenuItem, setActiveMenuItem] = useState<'dashboard' | 'ilead' | 'dwork' | 'dlink' | 'daccount' | 'toolbox' | 'library'>('ilead');
  const [activeIleadTab, setActiveIleadTab] = useState<'onboarding' | 'jobtrack' | 'depthtrack' | 'idptrack'>('jobtrack');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Global simulation role perspective
  const [currentRole, setCurrentRole] = useState<'IC' | 'SM' | 'IG' | 'SYS'>('IC');

  // Seed initial notification objects
  const initialNotifications: NotificationMsg[] = [
    {
      id: 'noti-init-1',
      type: 'InApp',
      title: 'Khởi động lộ trình iLEAD 2026',
      content: 'Chào Nguyễn Văn Định, tài khoản của bạn đã đủ điều kiện kích hoạt iLEAD. Vui lòng chỉ định Trưởng bộ phận trực trách (SM) và hoàn tất khai báo Job Track định lượng lộ trình.',
      timestamp: '11:30',
      receiver: 'IC',
      isRead: false
    },
    {
      id: 'noti-init-2',
      type: 'dLink',
      title: 'iLEAD: Khai báo Job Track trực tiếp',
      content: 'iLEAD thông báo dLink Chat: Đối với lần khai báo đầu tiên, câu hỏi soi chiếu bản thân là tự chọn (Optional). Tuy nhiên kể từ lần cập nhật thứ 2, việc điền 3 câu soi chiếu là bắt buộc (Compulsory). Hoàn thành trước hạn.',
      timestamp: '11:30',
      receiver: 'IC',
      linkText: 'Giải thích Quy tắc',
      isRead: false
    }
  ];

  const [notifications, setNotifications] = useState<NotificationMsg[]>(initialNotifications);

  // Core single job track record state representing the active IC ('Nguyễn Văn Định')
  const initialRecord: JobTrackRecord = {
    id: 'jtr-101',
    icName: 'Nguyễn Văn Định',
    icEmail: 'dinh.nv@vndirect.com.vn',
    sbu: 'IT',
    assignedSm: null,
    careerTrack: '',
    functionalDomain: '',
    functionalSpecialty: '',
    reflection: { q1: '', q2: '', q3: '' },
    declaresCount: 1,
    status: 'Draft',
    submitTime: null,
    elapsedHours: 0,
    smNote: '',
    igNotes: '',
    igStatusType: '',
    historyLogs: [
      {
        timestamp: '11:30',
        actor: 'Hệ thống',
        action: 'Đồng bộ DMS nhân sự',
        details: 'Phát hiện tài khoản mới đăng nhập lần đầu. Phân vùng: IT SBU. Trạng thái SM: Chưa chỉ định.'
      }
    ]
  };

  const [record, setRecord] = useState<JobTrackRecord>(initialRecord);

  // Helper: Append logs to flow logger
  const appendLog = (actor: 'IC' | 'SM' | 'IG' | 'Hệ thống', action: string, details: string) => {
    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ` (${record.elapsedHours}h)`;
    setRecord(prev => ({
      ...prev,
      historyLogs: [
        ...prev.historyLogs,
        { timestamp: timeStr, actor, action, details }
      ]
    }));
  };

  // Switch SBU mapping constraint
  const handleChangeSbu = (newSbu: SbuType) => {
    setRecord(prev => ({
      ...prev,
      sbu: newSbu,
      assignedSm: null, // Reset SM selection since SM belongs to specific SBU
      careerTrack: '',
      functionalDomain: '',
      functionalSpecialty: '',
      historyLogs: [
        ...prev.historyLogs,
        {
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ` (${prev.elapsedHours}h)`,
          actor: 'Hệ thống',
          action: 'Chuyển phân tổ SBU',
          details: `Dung hợp cấu trúc sang phân vị SBU mới: ${newSbu}. Đã tự động giải phóng gán Quản lý trực trách cũ.`
        }
      ]
    }));
  };

  // IC actions: submitting the declaration
  const handleSubmitJobTrack = () => {
    if (!record.assignedSm) return;

    const ctName = getOptionName(record.careerTrack, 'CT');
    const fdName = getOptionName(record.functionalDomain, 'FD');
    const fsName = getOptionName(record.functionalSpecialty, 'FS');

    const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    // Status shifts to "Pending co-sign"
    setRecord(prev => ({
      ...prev,
      status: 'Pending co-sign',
      submitTime: Date.now(),
      elapsedHours: 0, // Reset timer whenever submitted
      historyLogs: [
        ...prev.historyLogs,
        {
          timestamp: `${timestamp} (0h)`,
          actor: 'IC',
          action: 'Submit khai báo Job Track',
          details: `Hồ sơ chuyển trạng thái "Chờ SM đồng ký" (Pending co-sign). Career: ${ctName} | Domain: ${fdName} | Specialty: ${fsName}.`
        }
      ]
    }));

    // Trigger SM alerts in-app & dLink Chat
    const smName = record.assignedSm.name;
    const cleanReflectionTxt = record.reflection.q1 
      ? `\nQ1: ${record.reflection.q1}\nQ2: ${record.reflection.q2}\nQ3: ${record.reflection.q3}` 
      : 'Chưa cung cấp câu hỏi soi chiếu';

    const newNotiInApp: NotificationMsg = {
      id: `noti-sm-inapp-${Date.now()}`,
      type: 'InApp',
      title: `${record.icName} đã khai báo định danh nghề nghiệp (Job Track) & cần anh/chị đồng hành`,
      content: `${record.icName} vừa kết thúc khai báo Job Track của họ trên hành trình iLEAD.\n📋 JobTrack đề xuất:\n- Career Track: ${ctName}\n- Domain: ${fdName}\n- Specialty: ${fsName}\n✍️ Soi chiếu bản thân: ${cleanReflectionTxt}\n\n* Lưu ý quan trọng: Việc này là xác nhận anh/chị đã biết lựa chọn định hướng — không phải là một phê duyệt (Approval). Vui lòng hoàn thành co-sign trong vòng 48h quy định.`,
      timestamp: `${timestamp} (0h)`,
      receiver: 'SM',
      isRead: false
    };

    const newNotiDlink: NotificationMsg = {
      id: `noti-sm-dlink-${Date.now()}`,
      type: 'dLink',
      title: `📬 iLEAD: Yêu cầu Đồng Ký từ ${record.icName}`,
      content: `${record.icName} đã hoàn thiện khai báo định danh nghề nghiệp Job Track trên hệ thống iLEAD. Cần anh/chị co-sign đồng hành và định mục tiêu huấn luyện. Vui lòng cân nhắc đọc tài liệu & xác nhận trong vòng 48h làm việc.`,
      timestamp: `${timestamp} (0h)`,
      receiver: 'SM',
      linkText: 'Đồng Ký/Xem Xét Chi Tiết',
      isRead: false
    };

    setNotifications(prev => [newNotiInApp, newNotiDlink, ...prev]);
  };

  // SM action A: Co-sign Approve
  const handleSmCoSign = () => {
    if (!record.assignedSm) return;

    const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const smName = record.assignedSm.name;

    setRecord(prev => ({
      ...prev,
      status: 'Co-signed',
      historyLogs: [
        ...prev.historyLogs,
        {
          timestamp: `${timestamp} (${prev.elapsedHours}h)`,
          actor: 'SM',
          action: 'Hoàn thành Co-signed',
          details: `Quản lý trực phụ trách ${smName} chính thức đặt bút ký xác nhận. Mở khoá lộ trình sâu Depth Track & IDP cho nhân sự.`
        }
      ]
    }));

    // Notify IC in-app & dLink Chat
    const notiIcInapp: NotificationMsg = {
      id: `noti-ic-cosign-inapp-${Date.now()}`,
      type: 'InApp',
      title: 'Job Track của bạn Đã Được Đồng Ký thành công! 🥳',
      content: `Tuyệt vời! Quản lý đồng hành ${smName} vừa bấm Co-sign ký xác nhận định hướng nghề nghiệp Job Track của bạn. Hệ thống giờ đây mở luồng phát triển sâu hơn: Depth Track & soạn thảo Dự thảo mục tiêu phát triển cá nhân (IDP Draft) trong vòng iLEAD. Giám sát lộ trình của mình ngay!`,
      timestamp: `${timestamp} (${record.elapsedHours}h)`,
      receiver: 'IC',
      isRead: false
    };

    const notiIcoDlink: NotificationMsg = {
      id: `noti-ic-cosign-dlink-${Date.now()}`,
      type: 'dLink',
      title: `🤝 iLEAD: Bạn và ${smName} đã ký kết thoả thuận nghề nghiệp mới`,
      content: `Chúc mừng bạn! Buổi thoả thuận định danh đã kết thúc, SM ${smName} đã gán Co-signed cho bạn. Bước chân đầu tiên vào iLEAD bồi dưỡng đã sẵn sàng.`,
      timestamp: `${timestamp} (${record.elapsedHours}h)`,
      receiver: 'IC',
      linkText: 'Thiết Lập IDP Dự Thảo',
      isRead: false
    };

    setNotifications(prev => [notiIcInapp, notiIcoDlink, ...prev]);
  };

  // SM action B: Reviewing / Xem xét thêm with feedback notes
  const handleSmReviewLater = (notes: string) => {
    if (!record.assignedSm) return;

    const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const smName = record.assignedSm.name;
    const icName = record.icName;

    setRecord(prev => ({
      ...prev,
      status: 'Reviewing',
      smNote: notes,
      historyLogs: [
        ...prev.historyLogs,
        {
          timestamp: `${timestamp} (${prev.elapsedHours}h)`,
          actor: 'SM',
          action: 'Đề xuất Xem Xét Thêm',
          details: `SM ${smName} gửi yêu cầu thương thảo lại. Ghi chú SM: "${notes}". Chuyển hồ sơ sang tổ IG để sắp đặt đối thoại.`
        }
      ]
    }));

    // Notify IG in-app & dLink Chat to organize dialogue
    const notiIgInapp: NotificationMsg = {
      id: `noti-ig-review-inapp-${Date.now()}`,
      type: 'InApp',
      title: `SM [${smName}] yêu cầu xem xét Job Track của [${icName}]`,
      content: `Cảnh báo phối thức nội bộ: Quản lý ${smName} đã nghiên cứu hồ sơ Job Track của nhân sự ${icName} và thấy cần thiết phải tổ chức buổi trao đổi thêm trước khi co-sign.\n- Ghi nhận ý kiến lo ngại của SM: "${notes}"\n- SBU: ${record.sbu}\n- Career Track gửi: ${getOptionName(record.careerTrack, 'CT')}\n\n👉 CTA: Ban IG vui lòng điều hành, phối hợp họp 3 bên (SM + IC + IG) trong vòng 2 ngày làm việc để thống nhất hướng xử lý.`,
      timestamp: `${timestamp} (${record.elapsedHours}h)`,
      receiver: 'IG',
      isRead: false
    };

    const notiIgDlink: NotificationMsg = {
      id: `noti-ig-review-dlink-${Date.now()}`,
      type: 'dLink',
      title: `🔄 iLEAD Review: SM yêu cầu IG điều biên đối thoại`,
      content: `SM ${smName} nhận thấy cần trao đổi phối hợp thêm với IC ${icName} trước khi Co-sign định danh. IG vui lòng sắp xếp cuộc hội đàm trong vòng 48h tới.`,
      timestamp: `${timestamp} (${record.elapsedHours}h)`,
      receiver: 'IG',
      linkText: 'Lên Lịch Cuộc Họp',
      isRead: false
    };

    setNotifications(prev => [notiIgInapp, notiIgDlink, ...prev]);
  };

  // IG Step 5 Outcomes: Resolution
  const handleIgPostResolution = (
    actionType: 'CO_SIGN_SUCCESS' | 'IC_EDIT_FLOW',
    meetingLog: string,
    scenario: string
  ) => {
    const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const smName = record.assignedSm?.name || 'SM';
    const icName = record.icName;

    if (actionType === 'CO_SIGN_SUCCESS') {
      // SM consensus co-signs after dialogue
      setRecord(prev => ({
        ...prev,
        status: 'Co-signed',
        igNotes: meetingLog,
        igStatusType: scenario as any,
        historyLogs: [
          ...prev.historyLogs,
          {
            timestamp: `${timestamp} (${prev.elapsedHours}h)`,
            actor: 'IG',
            action: 'Đối thoại thành công -> Thống nhất Co-sign',
            details: `SM và IC đã tham gia họp. Kết quả: Đồng thuận ký nhận Job Track. Ghi nhận Biên bản của IG: "${meetingLog}".`
          }
        ]
      }));

      // Notify IC & SM
      const notiConsensusInApp: NotificationMsg = {
        id: `noti- consensus-inapp-${Date.now()}`,
        type: 'InApp',
        title: 'Thoả thuận Job Track thành công sau đối thoại của IG! 🎉',
        content: `Sau cuộc họp liên kết tổ chức bởi IG, Quản lý ${smName} đã hoàn tất đồng ký (Co-sign) bản Career Track cho Nguyễn Văn Định.\nBiên bản bàn giao của IG: "${meetingLog}"\nTrọng trình IDP Draft hiện tại đã được kích hoạt thành công.`,
        timestamp: `${timestamp} (${record.elapsedHours}h)`,
        receiver: 'IC',
        isRead: false
      };

      setNotifications(prev => [notiConsensusInApp, ...prev]);
    } else {
      // IC edited Job Track - returns to Draft with incremented declares count making reflections mandatory
      const nextCount = record.declaresCount + 1;

      setRecord(prev => ({
        ...prev,
        status: 'Draft',
        igNotes: meetingLog,
        igStatusType: scenario as any,
        declaresCount: nextCount,
        elapsedHours: 0, // Reset SLA hours back to 0h for brand new SLA
        historyLogs: [
          ...prev.historyLogs,
          {
            timestamp: `${timestamp} (0h)`,
            actor: 'IG',
            action: 'Hoà giải -> Yêu cầu IC điều chỉnh lại',
            details: `Thống nhất đối thoại: Hồ sơ trả về nháp cho IC chỉnh sửa lại Career Track / Specialty. Lần nộp tới là lần thứ ${nextCount} (BẮT BUỘC trả lời 3 câu hỏi soi chiếu). Biên bản IG: "${meetingLog}".`
          }
        ]
      }));

      // Notify IC to rewrite
      const notiRequestEditInApp: NotificationMsg = {
        id: `noti-reedit-inapp-${Date.now()}`,
        type: 'InApp',
        title: '⚠️ Yêu cầu cập nhật định danh Job Track (SLA mới bắt đầu)',
        content: `Căn cứ theo cuộc họp hoà giải tổ chức bởi IG, bạn cần hiệu chỉnh lại cơ cấu Job Track đã nộp để khớp với kỳ vọng bộ phận.\nGiai đoạn chỉnh sửa: Trở về bản Nháp.\nYêu cầu ghi chú: "${meetingLog}"\n\n📌 Quy chế đặc thù: Đây là lần khai báo thứ ${nextCount} trở đi, do đó 3 CÂU HỎI SOI CHIẾU BẢN THÂN hiện đã đổi thành trường BẮT BUỘC. Vui lòng cung cấp câu trả lời rành mạch lúc nộp lại.`,
        timestamp: `${timestamp} (0h)`,
        receiver: 'IC',
        isRead: false
      };

      const notiRequestEditDlink: NotificationMsg = {
        id: `noti-reedit-dlink-${Date.now()}`,
        type: 'dLink',
        title: `🔄 iLEAD: Hồ sơ Job Track Trả Về Chỉnh Sửa`,
        content: `Căn hợp buổi làm việc ba bên, hồ sơ Job Track của bạn đã được trả về bản nháp. Vui lòng cập nhật các lựa chọn theo biên bản hoà giải và gửi duyệt lại sớm.`,
        timestamp: `${timestamp} (0h)`,
        receiver: 'IC',
        linkText: 'Hiệu Chỉnh Ngay',
        isRead: false
      };

      setNotifications(prev => [notiRequestEditInApp, notiRequestEditDlink, ...prev]);
    }
  };

  // Systems controls: simulated time accelerator
  const handleTimeTravelSim = (hoursToAdd: number) => {
    const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const targetHours = record.elapsedHours + hoursToAdd;

    // We only trigger SLA transition checks if status is active for SLA
    let nextStatus = record.status;
    let autoLogMessage = '';
    let autoLogDetails = '';
    let notificationsToAdd: NotificationMsg[] = [];

    const smName = record.assignedSm?.name || 'SM';
    const icName = record.icName;

    // Rule 1: Check 48h SLA Escalation threshold (Pending co-sign -> Escalation)
    if (record.status === 'Pending co-sign' && record.elapsedHours < 48 && targetHours >= 48) {
      nextStatus = 'Escalation';
      autoLogMessage = 'Tự động kích hoạt Escalation (Mốc 48h)';
      autoLogDetails = `Thời gian chờ bàn giao co-sign quá 48h mà Quản lý ${smName} không ghi nhận phản hồi. Trạng thái tự động kích hoạt chế độ Cảnh báo Đỏ gửi tới Phòng quản trị nội bộ (IG).`;

      // Trigger alerts to IG
      const notiIgEscalation: NotificationMsg = {
        id: `noti-escalation-ig-${Date.now()}`,
        type: 'InApp',
        title: `⚠️ HỆ THỐNG BÁO ĐỘNG ESCALATION: SM [${smName}] Quá Hạn Phản Hồi 48h!`,
        content: `Mã hồ sơ: ${record.id}\nHồ sơ khai báo định danh của nhân viên Nguyễn Văn Định đã chuyển trạng thái sang Escalation do vượt mức 48h cam kết của SM mà chưa đạt thoả thuận đồng ký.\n\n👉 Hành động yêu cầu: IG cần liên hệ khẩn cấp trực tiếp cho SM, ghi nhận lý do trì hoãn (Vận hành/Mâu thuẫn/SM từ chối phản hồi) trong vòng 2 ngày tới làm cơ sở kết luận.`,
        timestamp: `${timestamp} (${targetHours}h)`,
        receiver: 'IG',
        isRead: false
      };

      const notiIgEscalationDlink: NotificationMsg = {
        id: `noti-escalation-ig-dlink-${Date.now()}`,
        type: 'dLink',
        title: `🚨 Escalation iLEAD: Vi phạm SLA 48h từ SM ${smName}`,
        content: `Cảnh báo khẩn! Quá 48h SM ${smName} chưa đồng ký hồ sơ cho Nguyễn Văn Định. IG đề nghị vào cuộc hoà giải gấp trong vòng 48h tiếp theo.`,
        timestamp: `${timestamp} (${targetHours}h)`,
        receiver: 'IG',
        linkText: 'Vào Cuộc Hoà Giải',
        isRead: false
      };

      notificationsToAdd.push(notiIgEscalation, notiIgEscalationDlink);
    }

    // Rule 2: Check 96h SLA Auto Co-sign threshold (Active status -> Auto Co-signed)
    const isSlaActiveStatus = record.status === 'Pending co-sign' || record.status === 'Reviewing' || record.status === 'Escalation';
    if (isSlaActiveStatus && targetHours >= 96) {
      nextStatus = 'Auto Co-signed';
      autoLogMessage = '🤖 Auto Co-signed bởi Hệ thống (Mốc 96h)';
      autoLogDetails = `Tổng thời hạn tối đa 96 giờ đã trôi qua kể từ lúc nộp mà SM lẫn IG chưa gửi biên bản ký kết cuối cùng. Hệ thống iLEAD tự động kích hoạt trạng thái "Auto Co-signed by system" để đảm bảo quyền lợi huấn luyện IDP không bị trì trệ cho Nguyễn Văn Định.`;

      // Notify IC & SM
      const notiAutoIc: NotificationMsg = {
        id: `noti-auto-ic-${Date.now()}`,
        type: 'InApp',
        title: '🤖 Hồ sơ Job Track của bạn đã được Tự động Đồng Ký (Auto Co-signed)',
        content: `iLEAD thông báo: Do quá thời gian quy định 96h từ lúc nộp và không có biên bản hiệu chỉnh nào được đóng, hệ thống đã tự động kích hoạt tính năng Đồng Ký Tự Động để mở tiếp luồng dự thảo mục tiêu IDP cho bạn. Chúng tôi đồng thời đã ghi nhận log trễ hạn của các bộ phận liên đới.`,
        timestamp: `${timestamp} (${targetHours}h)`,
        receiver: 'IC',
        isRead: false
      };

      const notiAutoSm: NotificationMsg = {
        id: `noti-auto-sm-${Date.now()}`,
        type: 'InApp',
        title: `🤖 Hệ thống đã Tự Động Đồng Ký thế vị cho hồ sơ [${record.icName}]`,
        content: `Cảnh báo SLA trễ hạn: Đã quá mốc quy định 96h kể từ thời điểm gửi hồ sơ. Hệ thống đã thay thế bạn thực hiện Auto Co-sign mở tiến độ cho nhân sự. Lịch sử trì hoãn này sẽ được kết xuất gửi ban chấp hành EXCO rà soát văn hoá hỗ trợ.`,
        timestamp: `${timestamp} (${targetHours}h)`,
        receiver: 'SM',
        isRead: false
      };

      notificationsToAdd.push(notiAutoIc, notiAutoSm);
    }

    // Set updated record state
    setRecord(prev => {
      const logs = [
        ...prev.historyLogs,
        {
          timestamp: `${timestamp} (${targetHours}h)`,
          actor: 'Hệ thống' as const,
          action: `Gia tốc thời gian (+${hoursToAdd}h)`,
          details: `Người dùng tua gia tốc thêm ${hoursToAdd} giờ nữa. Khoảng thời gian kích hoạt tổng cộng là ${targetHours} giờ.`
        }
      ];

      if (autoLogMessage) {
        logs.push({
          timestamp: `${timestamp} (${targetHours}h)`,
          actor: 'Hệ thống' as const,
          action: autoLogMessage,
          details: autoLogDetails
        });
      }

      return {
        ...prev,
        elapsedHours: targetHours,
        status: nextStatus as JobTrackStatus,
        historyLogs: logs
      };
    });

    if (notificationsToAdd.length > 0) {
      setNotifications(prev => [...notificationsToAdd, ...prev]);
    }
  };

  // Reset Sandbox State completely
  const handleCompleteReset = () => {
    setRecord({
      ...initialRecord,
      historyLogs: [
        {
          timestamp: '11:30 (0h)',
          actor: 'Hệ thống',
          action: 'Đặt lại Giả Lập',
          details: 'Đã thiết lập lại trạng thái khởi thuỷ cho hồ sơ Job Track. Phân tổ SBU mặc định: IT SBU.'
        }
      ]
    });
    setNotifications(initialNotifications);
    setCurrentRole('IC');
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const getActorName = () => {
    if (currentRole === 'IC') return 'Nguyễn Văn Định';
    if (currentRole === 'SM') return record.assignedSm ? record.assignedSm.name : 'Quản lý SM iLEAD';
    if (currentRole === 'IG') return 'Ban Quản Trị Nội Bộ';
    return 'Hệ Thống Tự Động';
  };

  const getActorRole = () => {
    if (currentRole === 'IC') return 'IC · Squad 04';
    if (currentRole === 'SM') return record.assignedSm ? `SM · ${record.assignedSm.department}` : 'Trưởng Bộ Phận (SM)';
    if (currentRole === 'IG') return 'IG Coordinator';
    return 'SYS System Admin';
  };

  const getActorAvatar = () => {
    if (currentRole === 'IC') return 'NĐ';
    if (currentRole === 'SM') {
      if (record.assignedSm) {
        const parts = record.assignedSm.name.split(' ');
        return parts[parts.length - 1].substring(0, 2).toUpperCase();
      }
      return 'SM';
    }
    if (currentRole === 'IG') return 'IG';
    return 'SY';
  };

  // Mock task list state for dWork with check status
  const [dWorkTasks, setDWorkTasks] = useState([
    { id: 1, title: 'Đồng bộ thiết lập định danh cá nhân trên DMS', done: true, tag: 'DMS Sync' },
    { id: 2, title: 'Khai báo định vị lộ trình nghề nghiệp Job Track trên iLEAD', done: record.status !== 'Draft', tag: 'iLEAD Job' },
    { id: 3, title: 'Hoàn thành buổi phỏng vấn đồng hành 1-on-1 với SM', done: record.status === 'Co-signed' || record.status === 'Auto Co-signed', tag: 'Co-sign' },
    { id: 4, title: 'Phác thảo các dự thảo mục tiêu năm phát triển (IDP Draft)', done: record.status === 'Co-signed' || record.status === 'Auto Co-signed', tag: 'IDP Target' },
    { id: 5, title: 'Khảo sát độ gắn kết nội bộ ban đầu (Onboarding Day 45)', done: false, tag: 'Onboarding' }
  ]);

  // Sync tasks on status changes
  React.useEffect(() => {
    setDWorkTasks(prev => prev.map(t => {
      if (t.id === 2) return { ...t, done: record.status !== 'Draft' };
      if (t.id === 3 || t.id === 4) return { ...t, done: record.status === 'Co-signed' || record.status === 'Auto Co-signed' };
      return t;
    }));
  }, [record.status]);

  // Handle dLink chat simulator messages
  const [dLinkChats, setDLinkChats] = useState([
    { id: 1, sender: 'System Bot', msg: 'Chào Nguyễn Văn Định! Bạn có 1 thông báo mới: iLEAD yêu cầu bạn chọn một Trưởng bộ phận phụ trách (SM) để đồng ký.', time: '11:30', isMe: false },
    { id: 2, sender: 'Nguyễn Văn Định', msg: 'Xin chào, tôi chuẩn bị nộp tờ khai đây.', time: '11:32', isMe: true }
  ]);
  const [chatInput, setChatInput] = useState('');

  const sendMockChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const nowStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: Date.now(), sender: 'Nguyễn Văn Định', msg: chatInput, time: nowStr, isMe: true };
    setDLinkChats(prev => [...prev, userMsg]);
    setChatInput('');

    // Trigger auto bot response based on context
    setTimeout(() => {
      let reply = 'Hệ thống iLEAD dLink Auto-bot đã ghi nhận phát biểu của bạn. Để đảm bảo kết quả chính xác, vui lòng kiểm tra trực tiếp trạng thái trên tab iLEAD của mình!';
      if (record.status === 'Pending co-sign') {
        reply = `Chào Định, hồ sơ của bạn đang được chuyển đến dLink của Quản lý ${record.assignedSm?.name || 'SM'}. Họ có 48h để thực hiện phê duyệt đồng ký Co-sign.`;
      } else if (record.status === 'Co-signed') {
        reply = `Xin chúc mừng Nguyễn Văn Định! Hồ sơ của bạn đã hoàn thành ĐỒNG KÝ bởi quản lý ${record.assignedSm?.name || 'SM'}. Hãy tiến vào xây dựng lộ trình chuyên sâu Depth Track & IDP của bạn!`;
      } else if (record.status === 'Escalation') {
        reply = `CẢNH BÁO: Đã quá hạn 48h đồng hành nhưng SM vẫn chưa phản hồi. Hồ sơ của bạn đã được chuyển tới Ban Quản Trị Nội Bộ (IG) để tiến hành hoà giải 3 bên!`;
      }
      setDLinkChats(prev => [...prev, { id: Date.now() + 1, sender: 'iLEAD Coach Bot', msg: reply, time: nowStr, isMe: false }]);
    }, 850);
  };

  // State representation for customized selections inside Depth Track (it unlocks after co-signed)
  const [selectedDepthTracks, setSelectedDepthTracks] = useState<string[]>([]);
  const toggleDepthTrack = (trackId: string) => {
    setSelectedDepthTracks(prev => prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]);
  };

  // State representation for custom target editing inside IDP form
  const [idpTargets, setIdpTargets] = useState([
    { id: 'idp-1', target: 'Làm chủ cấu trúc nghiệp vụ tài chính & tư vấn đầu tư nâng cao', time: 'Quý 3/2026', checked: false },
    { id: 'idp-2', title: 'Phát triển chuyên môn sâu phục vụ khối SBU cốt lõi', time: 'Quý 4/2026', checked: false }
  ]);
  const [newIdpText, setNewIdpText] = useState('');
  const addIdpTarget = () => {
    if (!newIdpText.trim()) return;
    setIdpTargets(prev => [...prev, { id: `idp-${Date.now()}`, target: newIdpText, time: '12 tháng tới', checked: false }]);
    setNewIdpText('');
  };

  return (
    <div className="bg-stone-50 min-h-screen text-stone-850 font-sans antialiased flex" id="main-sim-root">
      
      {/* ── LEFT SIDEBAR ── */}
      <aside 
        className={`bg-white border-r border-stone-200 transition-all duration-300 md:flex flex-col shrink-0 ${
          sidebarCollapsed ? 'w-16' : 'w-60'
        } hidden md:visible`} 
        id="sidebar-navigation"
      >
        {/* Sidebar Logo */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center font-black text-white text-xs shrink-0 shadow-sm animate-pulse`}>
              DSB
            </div>
            {!sidebarCollapsed && (
              <div className="transition-opacity duration-200">
                <span className="font-extrabold text-xs block tracking-tight text-stone-900 leading-tight">VNDIRECT DSB</span>
                <span className="text-[10px] text-stone-400 block font-medium">Service Blueprint</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-5 flex-1 overflow-y-auto">
          {/* Section: La Ban */}
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <span className="px-3 text-[10px] uppercase tracking-wider text-stone-400 font-extrabold block">La Bàn Định Hướng</span>
            )}
            
            <button
              onClick={() => setActiveMenuItem('dashboard')}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeMenuItem === 'dashboard'
                  ? 'bg-amber-100/60 text-amber-600 font-bold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-stone-500" />
              {!sidebarCollapsed && <span>Dashboard Overview</span>}
            </button>

            <button
              onClick={() => setActiveMenuItem('ilead')}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all relative ${
                activeMenuItem === 'ilead'
                  ? 'bg-amber-550 text-white font-bold shadow-sm'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
              style={{ backgroundColor: activeMenuItem === 'ilead' ? '#1d9e75' : undefined }}
            >
              <Award className={`w-4 h-4 ${activeMenuItem === 'ilead' ? 'text-white' : 'text-stone-500'}`} />
              {!sidebarCollapsed && <span>iLEAD Path</span>}
              {!sidebarCollapsed && (
                <span className="ml-auto px-1.5 py-0.5 bg-amber-500 text-stone-950 rounded-full font-mono text-[9px] font-black">1</span>
              )}
            </button>

            <button
              onClick={() => setActiveMenuItem('dwork')}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all relative ${
                activeMenuItem === 'dwork'
                  ? 'bg-amber-100/60 text-amber-600 font-bold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <Briefcase className="w-4 h-4 text-stone-500" />
              {!sidebarCollapsed && <span>dWork Công Vụ</span>}
              {!sidebarCollapsed && (
                <span className="ml-auto text-[10px] text-stone-400 font-mono font-bold bg-stone-100 p-0.5 px-1 rounded">Mới</span>
              )}
            </button>

            <button
              onClick={() => setActiveMenuItem('dlink')}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all relative ${
                activeMenuItem === 'dlink'
                  ? 'bg-amber-100/60 text-amber-600 font-bold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-stone-500" />
              {!sidebarCollapsed && <span>dLink Chat Box</span>}
              {!sidebarCollapsed && (
                <span className="absolute top-2 right-3 w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              )}
            </button>

            <button
              onClick={() => setActiveMenuItem('daccount')}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeMenuItem === 'daccount'
                  ? 'bg-amber-100/60 text-amber-600 font-bold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <Compass className="w-4 h-4 text-stone-500" />
              {!sidebarCollapsed && <span>dAccount DMS</span>}
            </button>
          </div>

          {/* Section: Cong cu */}
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <span className="px-3 text-[10px] uppercase tracking-wider text-stone-400 font-extrabold block">Công Cụ Trợ Học</span>
            )}

            <button
              onClick={() => setActiveMenuItem('toolbox')}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeMenuItem === 'toolbox'
                  ? 'bg-amber-100/60 text-amber-600 font-bold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <Sliders className="w-4 h-4 text-stone-500" />
              {!sidebarCollapsed && <span>Operating Toolbox</span>}
            </button>

            <button
              onClick={() => setActiveMenuItem('library')}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeMenuItem === 'library'
                  ? 'bg-amber-100/60 text-amber-600 font-bold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <BookMarked className="w-4 h-4 text-stone-500" />
              {!sidebarCollapsed && <span>iLEAD Library</span>}
            </button>
          </div>
        </nav>

        {/* Sidebar Footer adaptive Actor details */}
        <div className="p-3 border-t border-stone-200 bg-stone-50/50">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full mb-2.5 py-1.5 px-3 hover:bg-stone-100 text-[10px] text-stone-500 hover:text-stone-800 rounded-md transition-all flex items-center justify-center gap-1 font-bold"
          >
            {sidebarCollapsed ? '→' : '← Thu gọn menu'}
          </button>

          <div className="flex items-center gap-2.5 p-1 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-700 flex items-center justify-center font-extrabold text-[11px] text-white shrink-0">
              {getActorAvatar()}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <h4 className="text-xs font-black text-stone-800 truncate leading-snug">{getActorName()}</h4>
                <p className="text-[9.5px] text-stone-400 font-mono leading-none truncate mt-0.5">{getActorRole()}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE ── */}
      <div className="flex-1 flex flex-col min-w-0" id="main-application-frame">
        
        {/* ── TOPBAR ── */}
        <header className="bg-white border-b border-stone-200 h-14 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40" id="topbar-navigation">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-stone-900 flex items-center justify-center text-white shrink-0">
              <Award className="w-4 h-4 text-amber-550" style={{ color: '#1d9e75' }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-extrabold text-stone-900 tracking-tight">
                  {activeMenuItem === 'dashboard' && 'Dashboard Overview'}
                  {activeMenuItem === 'ilead' && `iLEAD Workspace`}
                  {activeMenuItem === 'dwork' && 'dWork Công Vụ & SLA'}
                  {activeMenuItem === 'dlink' && 'dLink Chat Messenger'}
                  {activeMenuItem === 'daccount' && 'dAccount Profile (DMS)'}
                  {activeMenuItem === 'toolbox' && 'Operating Sandbox Toolbox'}
                  {activeMenuItem === 'library' && 'Tài Liệu Quy Chuẩn iLEAD'}
                </span>
                <span className="text-stone-300 text-[10px] hidden sm:inline">•</span>
                <span className="text-stone-400 text-[10.5px] font-medium hidden sm:inline">
                  {activeMenuItem === 'dashboard' && 'Bản đồ tổng kết lộ trình iCON'}
                  {activeMenuItem === 'ilead' && 'Học gì để giỏi hơn?'}
                  {activeMenuItem === 'dwork' && 'Hành động được chỉ thị theo tuần'}
                  {activeMenuItem === 'dlink' && 'Kênh truyền thông & báo động SLA'}
                  {activeMenuItem === 'daccount' && 'Quyết định gán vai trò & SBU trực thuộc'}
                  {activeMenuItem === 'toolbox' && 'Văn phòng kiểm thử các kịch bản hành vi'}
                  {activeMenuItem === 'library' && 'Thư viện quy định pháp lý'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-200 text-[10px] font-bold text-emerald-700 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              DMS Live Synchronized
            </span>

            <button
              onClick={handleCompleteReset}
              className="py-1 px-2.5 bg-stone-950 text-white hover:bg-stone-850 rounded-md text-[10.5px] font-bold transition-all flex items-center gap-1 border border-stone-800"
              title="Khôi phục trạng thái ban đầu của simulator"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Sim
            </button>
          </div>
        </header>

        {/* ── VIEW CONTENT PORTS ── */}
        <div className="flex-1 overflow-y-auto" id="main-content-scroll">
          
          {/* 1. VIEW PORT: DASHBOARD */}
          {activeMenuItem === 'dashboard' && (
            <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in" id="viewport-dashboard">
              <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-stone-900 tracking-tight">Khu Phố Tổng Quan Lộ Trình học - iLead Dashboard</h2>
                  <p className="text-xs text-stone-500 mt-1 max-w-xl">
                    Chào <b>Nguyễn Văn Định</b>. Hệ thống tập hợp tiến độ phát triển cá nhân của bạn, so chiếu cùng quy tổ SBU và ý chí đồng hành của SM trực quản.
                  </p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-semibold text-stone-800 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                  <span>SBU Đăng Ký: <b>{record.sbu} SBU</b></span>
                </div>
              </div>

              {/* Stats bento group */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
                  <span className="block text-[10px] text-stone-400 font-bold uppercase font-mono tracking-wider">Trạng thái iLEAD</span>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-black text-stone-800 tracking-tight">{record.status}</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
                  <span className="block text-[10px] text-stone-400 font-bold uppercase font-mono tracking-wider">Tiến độ Onboarding</span>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-black text-stone-800 tracking-tight">46%</span>
                    <span className="text-[10px] font-bold text-amber-500">Phase 2 / 90 Ngày</span>
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
                  <span className="block text-[10px] text-stone-400 font-bold uppercase font-mono tracking-wider">SM Đồng Hành</span>
                  <div className="mt-2">
                    <span className="text-xs font-bold text-stone-800 tracking-tight block truncate">
                      {record.assignedSm ? record.assignedSm.name : 'Chưa chỉ định'}
                    </span>
                    <span className="text-[9.5px] text-stone-400 block truncate mt-0.5">
                      {record.assignedSm ? record.assignedSm.department : 'Vui lòng gán tại Tab iLEAD'}
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
                  <span className="block text-[10px] text-stone-400 font-bold uppercase font-mono tracking-wider">Nhật ký tác vụ</span>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-black text-stone-800 tracking-tight font-mono">{record.historyLogs.length} LOGS</span>
                    <span className="text-[10px] text-stone-400">Recorded</span>
                  </div>
                </div>
              </div>

              {/* Pathway milestone flow chart */}
              <div className="bg-white border border-stone-200 rounded-xl p-5.5 shadow-xs">
                <h3 className="text-xs font-extrabold uppercase text-stone-800 tracking-widest mb-4">Lộ trình bồi dưỡng iLEAD 2026</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                  
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 space-y-1 relative">
                    <div className="absolute top-2 right-2 text-emerald-500"><CheckCircle className="w-4 h-4" /></div>
                    <span className="text-[10px] font-bold text-emerald-700 tracking-wider font-mono">STEP 01</span>
                    <h4 className="text-xs font-extrabold text-stone-800">Onboarding & Audit</h4>
                    <p className="text-[11px] text-stone-500">Bắt đầu ngày 1 đến ngày 30. (Hoàn Thành ✓)</p>
                  </div>

                  <div className={`p-4 rounded-lg border space-y-1 relative ${
                    record.status === 'Draft' ? 'bg-amber-50 border-amber-200 animate-pulse' : 'bg-emerald-50 border-emerald-200'
                  }`}>
                    {record.status !== 'Draft' && <div className="absolute top-2 right-2 text-emerald-500"><CheckCircle className="w-4 h-4" /></div>}
                    <span className="text-[10px] font-bold text-amber-700 tracking-wider font-mono">STEP 02</span>
                    <h4 className="text-xs font-extrabold text-stone-800">Khai báo Job Track</h4>
                    <p className="text-[11px] text-stone-500">Chỉ định SM trực thuộc & submit cơ cấu. Trạng thái: <b>{record.status}</b></p>
                  </div>

                  <div className={`p-4 rounded-lg border space-y-1 relative ${
                    (record.status === 'Co-signed' || record.status === 'Auto Co-signed') ? 'bg-emerald-50 border-emerald-200' : 'bg-stone-50 border-stone-200 hover:bg-stone-100/50'
                  }`}>
                    {(record.status === 'Co-signed' || record.status === 'Auto Co-signed') && <div className="absolute top-2 right-2 text-emerald-500"><CheckCircle className="w-4 h-4" /></div>}
                    <span className="text-[10px] font-bold text-stone-400 tracking-wider font-mono">STEP 03</span>
                    <h4 className="text-xs font-extrabold text-stone-800">Specialty Depth Track</h4>
                    <p className="text-[11px] text-stone-500">Mở rộng chuyên sâu học thuật kỹ lượng sau Co-sign.</p>
                  </div>

                  <div className={`p-4 rounded-lg border space-y-1 relative ${
                    (record.status === 'Co-signed' || record.status === 'Auto Co-signed') ? 'bg-emerald-50 border-emerald-200' : 'bg-stone-50 border-stone-200'
                  }`}>
                    {(record.status === 'Co-signed' || record.status === 'Auto Co-signed') && <div className="absolute top-2 right-2 text-emerald-500"><CheckCircle className="w-4 h-4" /></div>}
                    <span className="text-[10px] font-bold text-stone-400 tracking-wider font-mono">STEP 04</span>
                    <h4 className="text-xs font-extrabold text-stone-800">IDP Performance</h4>
                    <p className="text-[11px] text-stone-500">Ký cam kết mục tiêu phát triển 12 tháng với Quản lý.</p>
                  </div>

                </div>
              </div>

              {/* Quick Action Prompt to go directly */}
              <div className="bg-stone-900 border border-stone-850 rounded-xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-mono text-amber-400 uppercase tracking-widest">Action Prompt</h4>
                  <p className="text-xs text-stone-300 mt-1">
                    Cần hoàn thành Khai báo Job Track định lượng để giải phóng các quyền lợi học tập khác!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveMenuItem('ilead');
                    setActiveIleadTab('jobtrack');
                  }}
                  className="py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1 transition-all"
                >
                  Đến workspace iLEAD <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 2. VIEW PORT: iLEAD VIEW (MULTI TABS: Onboarding, Job Track, Depth Track, IDP Track) */}
          {activeMenuItem === 'ilead' && (
            <div className="animate-fade-in" id="viewport-ilead">
              
              {/* iLEAD HIERARCHY SUB-TABS */}
              <div className="bg-white border-b border-stone-200 px-6 flex items-stretch h-12 shrink-0 overflow-x-auto gap-4" id="ilead-subnav-tabs">
                <button
                  onClick={() => setActiveIleadTab('onboarding')}
                  className={`px-3 flex items-center h-full border-b-2 font-bold text-xs transition-all ${
                    activeIleadTab === 'onboarding'
                      ? 'border-emerald-600 text-emerald-700 font-extrabold'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                  style={{
                    borderBottomColor: activeIleadTab === 'onboarding' ? '#1d9e75' : undefined,
                    color: activeIleadTab === 'onboarding' ? '#14805e' : undefined
                  }}
                >
                  Onboarding (Day 1-90)
                </button>

                <div className="w-[1px] bg-stone-100 my-3"></div>

                <button
                  onClick={() => setActiveIleadTab('jobtrack')}
                  className={`px-3 flex items-center h-full border-b-2 font-bold text-xs transition-all relative ${
                    activeIleadTab === 'jobtrack'
                      ? 'border-emerald-600 text-emerald-700 font-extrabold'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                  style={{
                    borderBottomColor: activeIleadTab === 'jobtrack' ? '#1d9e75' : undefined,
                    color: activeIleadTab === 'jobtrack' ? '#14805e' : undefined
                  }}
                >
                  Job Track (Co-sign simulator)
                  <span className="absolute top-1.5 right-[-2px] w-2 h-2 rounded-full bg-amber-500"></span>
                </button>

                <div className="w-[1px] bg-stone-100 my-3"></div>

                <button
                  onClick={() => setActiveIleadTab('depthtrack')}
                  className={`px-3 flex items-center h-full border-b-2 font-bold text-xs transition-all ${
                    activeIleadTab === 'depthtrack'
                      ? 'border-emerald-600 text-emerald-700 font-extrabold'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                  style={{
                    borderBottomColor: activeIleadTab === 'depthtrack' ? '#1d9e75' : undefined,
                    color: activeIleadTab === 'depthtrack' ? '#14805e' : undefined
                  }}
                >
                  {(record.status === 'Co-signed' || record.status === 'Auto Co-signed') ? 'Depth Track (Unlocked ✓)' : 'Depth Track (Locked 🔒)'}
                </button>

                <div className="w-[1px] bg-stone-100 my-3"></div>

                <button
                  onClick={() => setActiveIleadTab('idptrack')}
                  className={`px-3 flex items-center h-full border-b-2 font-bold text-xs transition-all ${
                    activeIleadTab === 'idptrack'
                      ? 'border-emerald-600 text-emerald-700 font-extrabold'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                  style={{
                    borderBottomColor: activeIleadTab === 'idptrack' ? '#1d9e75' : undefined,
                    color: activeIleadTab === 'idptrack' ? '#14805e' : undefined
                  }}
                >
                  {(record.status === 'Co-signed' || record.status === 'Auto Co-signed') ? 'IDP Track (Unlocked ✓)' : 'IDP Track (Locked 🔒)'}
                </button>
              </div>

              {/* Dynamic rendering of iLead tab subpages */}
              {activeIleadTab === 'onboarding' && (
                <div className="p-6 max-w-4xl mx-auto space-y-6" id="subtab-onboarding">
                  <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs text-center space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                      <Flame className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-extrabold text-stone-900">iLead Onboarding Cohort #14</h3>
                      <p className="text-xs text-stone-500">
                        Chương trình đào tạo Onboarding định hướng 30-60-90 ngày dành cho tân binh VNDIRECT.
                      </p>
                    </div>

                    <div className="max-w-md mx-auto p-3.5 bg-stone-100 rounded-lg border border-stone-200/60 flex items-center justify-between text-xs font-semibold text-stone-800">
                      <span>Bạn đang ở: <b>Ngày 42 / 90</b> (Phase 2)</span>
                      <span className="font-mono text-[10.5px] bg-stone-800 text-white p-0.5 px-2 rounded animate-pulse">Running</span>
                    </div>

                    <div className="border border-stone-200 divide-y divide-stone-100 text-left rounded-lg overflow-hidden max-w-xl mx-auto text-xs">
                      <div className="p-3.5 flex items-center justify-between bg-emerald-50/50">
                        <span className="text-stone-800 font-bold">Phase 1: Hội Nhập (Day 1 - Day 30)</span>
                        <span className="text-emerald-600 font-black">✓ HOÀN THÀNH</span>
                      </div>
                      <div className="p-3.5 flex items-center justify-between bg-white relative">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-500"></div>
                        <span className="text-stone-800 font-bold">Phase 2: Định Hướng Chuyên Môn (Day 30 - Day 60)</span>
                        <span className="text-amber-600 font-bold animate-pulse">⚡ ĐANG CHẠY</span>
                      </div>
                      <div className="p-3.5 flex items-center justify-between bg-stone-50">
                        <span className="text-stone-400 font-medium">Phase 3: Bồi Dưỡng Chuyên Sâu (Day 60 - Day 90)</span>
                        <div className="flex items-center gap-1 text-stone-400"><Lock className="w-3.5 h-3.5" /> <span>Yêu cầu Co-sign Job Track</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeIleadTab === 'jobtrack' && (
                <div className="p-6 max-w-7xl mx-auto space-y-6" id="subtab-jobtrack">
                  
                  {/* Space for Actors Sandbox inside view page */}
                  <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs" id="perspective-selector-card">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-150 pb-4 mb-4">
                      <div>
                        <h3 className="text-sm font-extrabold text-stone-800 tracking-tight uppercase flex items-center gap-2">
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                          Actors Sandbox — Không Gian Thử Nghiệm Hành Trình iLEAD
                        </h3>
                        <p className="text-[11.5px] text-stone-500 mt-1 leading-relaxed">
                          Chọn vai trò xử lý giả định bên dưới để dịch chuyển góc tiếp cận, kiểm tra hoạt động tương tác gán duyệt Co-sign.
                        </p>
                      </div>

                      {/* SBU & declarations controller directly in tab content */}
                      <div className="flex flex-wrap items-center gap-2 bg-stone-50 p-2.5 rounded-lg border border-stone-200/80">
                        <span className="text-[10px] uppercase font-bold text-stone-400 font-mono">DMS SBU:</span>
                        <div className="inline-flex rounded-md p-0.5 bg-stone-250">
                          <button
                            onClick={() => handleChangeSbu('IT')}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                              record.sbu === 'IT' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                            }`}
                          >
                            IT SBU
                          </button>
                          <button
                            onClick={() => handleChangeSbu('non-IT')}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                              record.sbu === 'non-IT' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                            }`}
                          >
                            Non-IT SBU
                          </button>
                        </div>
                        <span className="text-stone-300">|</span>
                        <span className="text-[10.5px] text-stone-600 font-semibold font-mono">
                          Lần nộp: <strong className="text-emerald-700 font-extrabold">{record.declaresCount}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Role IC */}
                      <button
                        onClick={() => setCurrentRole('IC')}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          currentRole === 'IC'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-bold ring-1 ring-emerald-400'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
                        }`}
                      >
                        <div className={`p-1.5 rounded-md ${currentRole === 'IC' ? 'bg-emerald-650 text-white' : 'bg-emerald-100/50 text-emerald-750'}`} style={{ backgroundColor: currentRole === 'IC' ? '#1d9e75' : undefined }}>
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-tight">Nhân viên (IC)</div>
                          <div className="text-[10px] text-stone-400 mt-0.5 leading-none">Nộp định danh & soi chiếu</div>
                        </div>
                      </button>

                      {/* Role SM */}
                      <button
                        onClick={() => setCurrentRole('SM')}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          currentRole === 'SM'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-bold ring-1 ring-emerald-400'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
                        }`}
                      >
                        <div className={`p-1.5 rounded-md ${currentRole === 'SM' ? 'bg-emerald-650 text-white' : 'bg-emerald-100/50 text-emerald-750'}`} style={{ backgroundColor: currentRole === 'SM' ? '#1d9e75' : undefined }}>
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-tight">Quản lý (SM)</div>
                          <div className="text-[10px] text-stone-400 mt-0.5 leading-none">Nhận định & Co-sign ký duyệt</div>
                        </div>
                      </button>

                      {/* Role IG */}
                      <button
                        onClick={() => setCurrentRole('IG')}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          currentRole === 'IG'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-bold ring-1 ring-emerald-400'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
                        }`}
                      >
                        <div className={`p-1.5 rounded-md ${currentRole === 'IG' ? 'bg-emerald-650 text-white' : 'bg-emerald-100/50 text-emerald-750'}`} style={{ backgroundColor: currentRole === 'IG' ? '#1d9e75' : undefined }}>
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-tight">Quản trị nội bộ (IG)</div>
                          <div className="text-[10px] text-stone-400 mt-0.5 leading-none">Can thiệp hoà giải & biên bản</div>
                        </div>
                      </button>

                      {/* Role SYS */}
                      <button
                        onClick={() => setCurrentRole('SYS')}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          currentRole === 'SYS'
                            ? 'bg-stone-900 text-amber-300 border-stone-900 font-bold'
                            : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-250'
                        }`}
                      >
                        <div className={`p-1.5 rounded-md ${currentRole === 'SYS' ? 'bg-stone-950 text-white' : 'bg-stone-250 text-stone-700'}`}>
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-tight">SYS Time travel</div>
                          <div className="text-[10px] text-stone-400 mt-0.5 leading-none">Mô phỏng gia tốc thời gian SLA</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column Workspace */}
                    <div className="lg:col-span-8 space-y-6">
                      
                      {/* Display correct component workspace depending on current mock role */}
                      <div className="transition-all duration-300">
                        {currentRole === 'IC' && (
                          <FormIc
                            record={record}
                            onUpdateRecord={(fields) => setRecord(prev => ({ ...prev, ...fields }))}
                            onSubmit={handleSubmitJobTrack}
                          />
                        )}

                        {currentRole === 'SM' && (
                          <ManagerAction
                            record={record}
                            onCoSign={handleSmCoSign}
                            onReviewLater={handleSmReviewLater}
                          />
                        )}

                        {currentRole === 'IG' && (
                          <IgDialogue
                            record={record}
                            onPostResolution={handleIgPostResolution}
                            onOverrideSlaHours={(hrs) => handleTimeTravelSim(hrs)}
                          />
                        )}

                        {currentRole === 'SYS' && (
                          <div className="bg-stone-900 text-stone-100 border border-stone-800 rounded-xl overflow-hidden shadow-lg p-5.5 space-y-6 animate-fade-in" id="system-controller-card">
                            <div>
                              <h3 className="text-sm font-bold text-amber-400 font-display flex items-center gap-2">
                                <Play className="w-4 h-4" />
                                Hộp Gia Tốc SLA & Kiểm Trực Quy Tắc Tự Động (Time Engine Sandbox)
                              </h3>
                              <p className="text-xs text-stone-400 mt-1">
                                Khai báo Job Track áp dụng các quy chuẩn thời gian rất chặt chẽ. Click các nút tua thời gian bên dưới để theo dõi hệ thống giải quyết trễ hạn tự động!
                              </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <button
                                onClick={() => handleTimeTravelSim(1)}
                                className="py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-lg text-xs font-bold text-center transition-all border border-stone-700 cursor-pointer"
                                id="btn-time-travel-1h"
                              >
                                Tua nhanh +1h
                              </button>
                              <button
                                onClick={() => handleTimeTravelSim(12)}
                                className="py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-lg text-xs font-bold text-center transition-all border border-stone-700 cursor-pointer"
                                id="btn-time-travel-12h"
                              >
                                Tua nhanh +12h
                              </button>
                              <button
                                onClick={() => handleTimeTravelSim(24)}
                                className="py-2.5 px-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold text-center transition-all border border-amber-600 cursor-pointer"
                                id="btn-time-travel-24h"
                              >
                                Báo động nhắc nhở (+24h)
                              </button>
                              <button
                                onClick={() => handleTimeTravelSim(48)}
                                className="py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold text-center transition-all border border-amber-500 cursor-pointer"
                                id="btn-time-travel-48h"
                              >
                                Kích hoạt Escalation (+48h)
                              </button>
                            </div>

                            <div className="p-4 bg-stone-950 rounded-lg space-y-3.5 border border-stone-800/80">
                              <div className="text-xs font-bold text-amber-300 uppercase font-mono tracking-wide">
                                ⚙️ Các kiểm thử quan trọng bạn có thể thực hiện:
                              </div>
                              <ul className="text-[11px] text-stone-400 space-y-2 list-decimal list-inside pl-1">
                                <li>
                                  <strong>Quy trình Co-sign trực tiếp (Nhánh A)</strong>: Đăng nhập vai <span className="text-white font-semibold">IC</span> → Chọn SM → Điền Job Track và Submit → Gửi tin nhắn dLink thành công → Sang vai <span className="text-white font-semibold">SM</span> → Nhấp chọn "Co-sign Đồng ý" → Hồ sơ chuyển thành <span className="text-emerald-400 font-semibold">Co-signed</span>.
                                </li>
                                <li>
                                  <strong>SM phản hồi Xem xét thêm (Nhánh B)</strong>: Submit Job Track bằng vai <span className="text-white font-semibold">IC</span> → Sang vai <span className="text-white font-semibold">SM</span> → Nhập ý kiến phản hồi và bấm "Xem xét thêm" → Sang vai <span className="text-white font-semibold">IG</span> để giải quyết hoà giải, chọn nộp kết quả hoà nghị hoặc trả về làm lại nháp.
                                </li>
                                <li>
                                  <strong>SLA 48h Escalation (Nhánh C)</strong>: Đăng ký Job Track ở vai <span className="text-white font-semibold">IC</span> và Submit → Chuyển sang vai <span className="text-white font-semibold">SYS</span> hoặc sử dụng nút tua thời gian → Tua thêm <strong className="text-white">48 giờ</strong> → Hệ thống tự động đẩy trạng thái sang <span className="text-amber-400 font-semibold">Escalation</span> và dồn notification sang dLink của <span className="text-white font-semibold">IG</span>.
                                </li>
                                <li>
                                  <strong>Auto Co-signed tại 96h (Nhánh D)</strong>: Sau khi hồ sơ đã nằm ở nhánh Escalation / Pending / Reviewing, tiếp tục tua thời gian vượt quá tổng mức <strong className="text-white">96 giờ</strong> → Hệ thống sẽ tự kích hoạt <span className="text-teal-300 font-semibold">Auto Co-signed by system</span>, ghi lại dấu lịch sử tự động.
                                </li>
                              </ul>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-800">
                              <span>* Thiết lập để giúp VNDIRECT IC hiểu cặn kẽ lộ trình iLEAD.</span>
                              <button
                                onClick={handleCompleteReset}
                                className="text-amber-400 hover:underline font-bold"
                              >
                                Reset sạch sẽ về Draft ban đầu
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* SLA Countdown Timer */}
                      <SlaTracker
                        status={record.status}
                        elapsedHours={record.elapsedHours}
                        onTimeTravel={handleTimeTravelSim}
                      />

                      {/* Detailed Operational Audit Logs */}
                      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs" id="audit-trail-logs">
                        <div className="p-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                          <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-stone-500" />
                            Nhật Ký Thực Thi Vận Hành (Audit Trail Logs)
                          </h4>
                          <span className="text-[10px] bg-stone-200 text-stone-600 px-2 py-0.5 rounded-sm font-mono font-bold">
                            {record.historyLogs.length} LOGS RECORDED
                          </span>
                        </div>
                        
                        <div className="p-4 max-h-[250px] overflow-y-auto divide-y divide-stone-100" id="logs-container">
                          {record.historyLogs.slice().reverse().map((log, index) => {
                            let badgeColor = 'bg-stone-100 text-stone-800';
                            if (log.actor === 'IC') badgeColor = 'bg-sky-100 text-sky-800 font-bold';
                            if (log.actor === 'SM') badgeColor = 'bg-amber-100 text-amber-900 font-bold';
                            if (log.actor === 'IG') badgeColor = 'bg-purple-100 text-purple-900 font-bold';
                            if (log.actor === 'Hệ thống') badgeColor = 'bg-stone-900 text-stone-100 font-semibold';

                            return (
                              <div key={index} className="py-2.5 text-xs flex items-start gap-3 animate-fade-in" id={`log-item-${index}`}>
                                <span className="text-[10.5px] font-mono text-stone-400 shrink-0 mt-0.5 bg-stone-50 p-1 px-1.5 rounded">{log.timestamp}</span>
                                <div className="space-y-1 w-full">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-1.5 py-0.5 rounded text-[9.5px] tracking-wider uppercase font-mono ${badgeColor}`}>
                                      {log.actor}
                                    </span>
                                    <strong className="text-stone-800 font-bold">{log.action}</strong>
                                  </div>
                                  <p className="text-stone-500 leading-snug text-[11.5px] pl-1">
                                    {log.details}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    {/* Right column alert warning lists & quick guide info */}
                    <div className="lg:col-span-4 space-y-6">
                      
                      {/* Notifications component */}
                      <NotificationCenter
                        notifications={notifications}
                        currentActor={currentRole}
                        onMarkRead={handleMarkNotificationRead}
                        onClearAll={() => setNotifications([])}
                      />

                      {/* Rule handbook layout details */}
                      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs" id="quick-guide-info">
                        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-1">
                          <HelpCircle className="w-4 h-4 text-emerald-600" style={{ color: '#1d9e75' }} />
                          Hướng dẫn Quy chuẩn iLEAD
                        </h4>
                        <div className="space-y-3.5 text-xs text-stone-600 leading-relaxed">
                          <div className="border-l-2 pl-2.5 border-emerald-600" style={{ borderColor: '#1d9e75' }}>
                            <h5 className="font-bold text-stone-800 text-[11px]">SBU & Gán SM Lúc Đầu</h5>
                            <p className="text-[10.5px] text-stone-500 mt-0.5">
                              Hệ thống kiểm tra thông tin SBU của IC. IC chỉ được phép gán SM tương ứng trong phân khu SBU IT hoặc và Non-IT theo đồng bộ DMS.
                            </p>
                          </div>

                          <div className="border-l-2 border-stone-800 pl-2.5">
                            <h5 className="font-bold text-stone-800 text-[11px]">Lộ Trình Cascade Kế Tiếp</h5>
                            <p className="text-[10.5px] text-stone-500 mt-0.5">
                              Lựa chọn Job Track khoá chặt theo thứ tự: Career Track → Functional Domain → Function Specialty chi tiết.
                            </p>
                          </div>

                          <div className="border-l-2 border-emerald-600 pl-2.5" style={{ borderColor: '#1d9e75' }}>
                            <h5 className="font-bold text-stone-800 text-[11px]">Cơ chế Soi Chiếu Có Điều Kiện</h5>
                            <p className="text-[10.5px] text-stone-500 mt-0.5">
                              Mức khai báo ban đầu cho phép bỏ trống 3 câu hỏi soi chiếu bản thân. Kể từ lần chỉnh sửa hòa giải thứ 2, hệ thống tự động thắt chặt thành trường BẮT BUỘC.
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {activeIleadTab === 'depthtrack' && (
                <div className="p-6 max-w-4xl mx-auto space-y-6" id="subtab-depthtrack">
                  {(record.status !== 'Co-signed' && record.status !== 'Auto Co-signed') ? (
                    // Locked state view
                    <div className="bg-white border border-stone-200 rounded-xl p-8 text-center space-y-4 shadow-xs">
                      <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto border-2 border-dashed border-stone-300">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 max-w-md mx-auto">
                        <h3 className="text-base font-extrabold text-stone-900">Lộ trình Depth Track (Chuyên Sâu) Đang Khoá</h3>
                        <p className="text-xs text-stone-500 leading-relaxed">
                          Yêu cầu bắt buộc: Quản lý trực trách (SM) cần hoàn tất ĐỒNG KÝ Co-sign thoả thuận Job Track để mở khoá chương trình đào tạo học thuật mở rộng này.
                        </p>
                      </div>
                      <div className="inline-flex py-1.5 px-3 bg-amber-50 text-amber-800 rounded-lg text-xs font-semibold border border-amber-200">
                        Trạng thái hiện tại: {record.status} (Chưa đồng ký)
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => setActiveIleadTab('jobtrack')}
                          className="py-2 px-4 bg-emerald-605 text-white bg-emerald-600 rounded-lg text-xs font-bold cursor-pointer transition-all hover:bg-emerald-700"
                        >
                          Quay lại khai báo / co-sign
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Unlocked state view
                    <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6 shadow-xs animate-fade-in">
                      <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-stone-900">Bồi dưỡng Học thuật Chuyên Sâu (Depth Track)</h3>
                          <p className="text-xs text-stone-500 mt-0.5">Đã mở khoá thành công nhờ đồng ký từ quản lý của bạn!</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div 
                          onClick={() => toggleDepthTrack('dt-1')}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            selectedDepthTracks.includes('dt-1')
                              ? 'bg-emerald-50/50 border-emerald-505 border-emerald-600 shadow-sm'
                              : 'bg-white border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-[10px] bg-stone-100 text-stone-700 font-extrabold p-1 rounded uppercase font-mono">DMS Course 01</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedDepthTracks.includes('dt-1') ? 'bg-emerald-600 border-zinc-650' : 'border-stone-300'}`}>
                              {selectedDepthTracks.includes('dt-1') && <span className="w-2 h-2 rounded-full bg-white"></span>}
                            </div>
                          </div>
                          <h4 className="font-extrabold text-xs text-stone-900 mt-2">Dấu Ấn Kỹ Sư Công Nghệ Cốt Lõi (Advanced Architecture in FinTech)</h4>
                          <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                            Nội dung nghiên cứu thiết kế các hệ thống giao dịch khớp lệnh tốc độ cao bậc nhất, giải kết các thuật toán tối mật trong DMS.
                          </p>
                        </div>

                        <div 
                          onClick={() => toggleDepthTrack('dt-2')}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            selectedDepthTracks.includes('dt-2')
                              ? 'bg-emerald-50/50 border-emerald-505 border-emerald-600 shadow-sm'
                              : 'bg-white border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-[10px] bg-stone-100 text-stone-700 font-extrabold p-1 rounded uppercase font-mono">DMS Course 02</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedDepthTracks.includes('dt-2') ? 'bg-emerald-600 border-zinc-650' : 'border-stone-300'}`}>
                              {selectedDepthTracks.includes('dt-2') && <span className="w-2 h-2 rounded-full bg-white"></span>}
                            </div>
                          </div>
                          <h4 className="font-extrabold text-xs text-stone-900 mt-2">Bản đồ Thiết kế Khách hàng (User Experience at Financial Scale)</h4>
                          <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                            Phương pháp thiết kế hành trình trải nghiệm người dùng tối giản hoàn hảo trong dịch vụ đầu tư vốn và chứng khoán an toàn.
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200/60 text-xs text-stone-600 flex items-center justify-between">
                        <span>Đã chọn: <b>{selectedDepthTracks.length} / 2 khoá chuyên sâu</b></span>
                        <button className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 rounded text-white font-extrabold cursor-pointer">
                          Xác nhận Đăng Ký Học
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeIleadTab === 'idptrack' && (
                <div className="p-6 max-w-4xl mx-auto space-y-6" id="subtab-idp">
                  {(record.status !== 'Co-signed' && record.status !== 'Auto Co-signed') ? (
                    // Locked state view
                    <div className="bg-white border border-stone-200 rounded-xl p-8 text-center space-y-4 shadow-xs">
                      <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto border-2 border-dashed border-stone-300">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 max-w-md mx-auto">
                        <h3 className="text-base font-extrabold text-stone-900">Mục tiêu phát triển IDP đang khoá</h3>
                        <p className="text-xs text-stone-500 leading-relaxed">
                          Bản cam kết IDP 12 tháng kế hoạch sẽ tự động giải phóng hỗ trợ thiết kế dự soạn cùng SM ngay khi có Co-sign phê chuẩn tối ưu.
                        </p>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => setActiveIleadTab('jobtrack')}
                          className="py-2 px-4 bg-emerald-600 rounded-lg text-xs font-bold cursor-pointer transition-all text-white hover:bg-emerald-750"
                        >
                          Về lại trang Co-sign định danh
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Unlocked state view
                    <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6 shadow-xs animate-fade-in">
                      <div className="border-b border-stone-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-extrabold text-stone-900">Thiết kế mục tiêu IDP 12 tháng tương lai</h3>
                          <p className="text-xs text-stone-500 mt-0.5">Biên soạn mục tiêu đồng phối song hành cùng SM.</p>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10.5px] font-bold rounded">
                          Coach Link Active ✓
                        </span>
                      </div>

                      <div className="space-y-3.5">
                        <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest block">Cam kết IDP hiện hữu</span>
                        
                        <div className="space-y-2">
                          {idpTargets.map((target) => (
                            <div key={target.id} className="p-3.5 bg-stone-50 rounded-lg border border-stone-200/50 flex items-center justify-between gap-4 text-xs">
                              <div className="flex items-start gap-2.5">
                                <input 
                                  type="checkbox" 
                                  checked={target.checked}
                                  onChange={() => {
                                    setIdpTargets(prev => prev.map(t => t.id === target.id ? { ...t, checked: !t.checked } : t));
                                  }}
                                  className="mt-0.5" 
                                />
                                <div>
                                  <span className={`block font-semibold text-stone-800 ${target.checked ? 'line-through text-stone-400' : ''}`}>{target.target}</span>
                                  <span className="text-[10px] text-stone-400 block mt-0.5">Thời điểm hoàn thiện dự toán: <b>{target.time}</b></span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add target input form */}
                        <div className="pt-4 border-t border-stone-100 flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Nhập thêm mục tiêu tự hoàn thiện mới..." 
                            value={newIdpText}
                            onChange={(e) => setNewIdpText(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                            onKeyDown={(e) => e.key === 'Enter' && addIdpTarget()}
                          />
                          <button 
                            onClick={addIdpTarget}
                            className="py-2 px-4 bg-stone-900 hover:bg-stone-850 rounded-lg text-xs font-bold text-white whitespace-nowrap cursor-pointer"
                          >
                            Thêm mục tiêu
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* 3. VIEW PORT: dWORK (CÔNG VỤ) */}
          {activeMenuItem === 'dwork' && (
            <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in" id="viewport-dwork">
              <div className="bg-white border border-stone-200 rounded-xl p-6.5 shadow-xs space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-stone-900 tracking-tight">dWork Công Vụ — Nhật Ký Hành Động Hàng Tuần</h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Danh mục hoạt động được gán trực tiếp theo hệ chức nghiệp của bạn. SLA của tuần được khoá cứng cho đến khi cập nhật đầy đủ hành động.
                  </p>
                </div>

                <div className="space-y-2">
                  {dWorkTasks.map((task) => (
                    <div key={task.id} className="p-4 bg-stone-50 border border-stone-200/60 rounded-xl flex items-center justify-between gap-4 text-xs transition-colors hover:bg-stone-100/40">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setDWorkTasks(prev => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t));
                          }}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            task.done 
                              ? 'bg-emerald-600 text-white border-emerald-600' 
                              : 'bg-white text-stone-500 border-stone-300 hover:border-emerald-500'
                          }`}
                        >
                          {task.done && <CheckSquare className="w-3.5 h-3.5" />}
                        </button>
                        <div>
                          <span className={`block font-bold text-stone-850 ${task.done ? 'line-through text-stone-400' : ''}`}>{task.title}</span>
                          <span className="inline-block mt-1 px-1.5 py-0.5 bg-stone-200/50 text-stone-500 font-bold font-mono text-[9px] rounded uppercase">{task.tag}</span>
                        </div>
                      </div>
                      <span className={`font-mono text-[10.5px] font-bold ${task.done ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {task.done ? '✓ Xong' : '⏳ Đang chờ'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. VIEW PORT: dLINK CHAT SIMULATOR */}
          {activeMenuItem === 'dlink' && (
            <div className="p-6 max-w-4xl mx-auto animate-fade-in" id="viewport-dlink">
              <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs flex flex-col h-[520px]">
                
                {/* Chat title header */}
                <div className="bg-stone-50 border-b border-stone-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 rounded-full h-2.5 bg-emerald-500 animate-pulse"></div>
                    <div>
                      <h3 className="text-xs font-bold text-stone-900">dLink Messenger — Kênh SBU & dLink Notifications</h3>
                      <p className="text-[10px] text-stone-400 font-mono">Synced Core-Account: dinh.nv@vndirect.com.vn</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-mono font-bold">API Connected</span>
                </div>

                {/* Messages scroll content */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-100/30">
                  {dLinkChats.map((chat) => (
                    <div key={chat.id} className={`flex flex-col ${chat.isMe ? 'items-end' : 'items-start'}`}>
                      <div className="text-[9.5px] text-stone-400 font-bold font-mono mb-0.5 px-1">{chat.sender} <span className="font-normal font-sans ml-1">{chat.time}</span></div>
                      <div className={`p-3 max-w-md rounded-2xl text-xs leading-relaxed ${
                        chat.isMe 
                          ? 'bg-emerald-600 text-white rounded-tr-none' 
                          : 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-none shadow-xs'
                      }`}>
                        {chat.msg}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message input footer */}
                <form onSubmit={sendMockChat} className="p-3 bg-stone-50 border-t border-stone-200 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Gửi tin nhắn phản hồi, thảo luận hoặc thương lượng co-sign..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                  <button 
                    type="submit"
                    className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-bold text-white flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Gửi dLink
                  </button>
                </form>

              </div>
            </div>
          )}

          {/* 5. VIEW PORT: dACCOUNT DMS */}
          {activeMenuItem === 'daccount' && (
            <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in" id="viewport-daccount">
              <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-6">
                <div className="border-b border-stone-100 pb-4">
                  <h2 className="text-base font-extrabold text-stone-900 tracking-tight font-display">Hồ Sơ DMS Phân Tổ Nhân Sự (dAccount)</h2>
                  <p className="text-xs text-stone-500 mt-1">Thông tin đồng bộ nguyên gốc từ hệ thống DMS quản trị nội bộ VNDIRECT.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  
                  <div className="space-y-4">
                    <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest block">Thông tin cá nhân</span>
                    
                    <div className="grid grid-cols-3 gap-2 border-b border-stone-100 pb-2.5">
                      <span className="text-stone-400 font-bold">Họ và tên:</span>
                      <span className="col-span-2 text-stone-850 font-bold">Nguyễn Văn Định</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-b border-stone-100 pb-2.5">
                      <span className="text-stone-400 font-bold">Mã nhân sự:</span>
                      <span className="col-span-2 text-stone-850 font-mono font-bold">VND-014022</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-b border-stone-100 pb-2.5">
                      <span className="text-stone-400 font-bold">Thư điện tử:</span>
                      <span className="col-span-2 text-stone-850 font-mono font-bold">dinh.nv@vndirect.com.vn</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-b border-stone-100 pb-2.5 col-span-2">
                      <span className="text-stone-400 font-bold">Bộ phận:</span>
                      <span className="col-span-2 text-stone-850 font-semibold">Squad 04 - Core Banking Platform Services</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest block">Thiết lập phân vùng & gán ghép</span>

                    <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl space-y-3">
                      <div>
                        <span className="block text-[9.5px] uppercase font-bold text-stone-400 font-mono">Dữ liệu phân tổ SBU:</span>
                        <div className="flex gap-2.5 mt-1.5">
                          <button
                            onClick={() => handleChangeSbu('IT')}
                            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold text-center border cursor-pointer transition-all ${
                              record.sbu === 'IT'
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-black'
                                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            IT SBU
                          </button>
                          <button
                            onClick={() => handleChangeSbu('non-IT')}
                            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold text-center border cursor-pointer transition-all ${
                              record.sbu === 'non-IT'
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-black'
                                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            Non-IT SBU
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <span className="block text-[9.5px] uppercase font-bold text-stone-400 font-mono">Quản lý nhận phê duyệt (SM):</span>
                        <p className="text-stone-800 font-bold mt-1">
                          {record.assignedSm ? `${record.assignedSm.name} (${record.assignedSm.department})` : 'Chưa chỉ định'}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* 6. VIEW PORT: OPERATING TOOLBOX (ADMIN SANDBOX) */}
          {activeMenuItem === 'toolbox' && (
            <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in" id="viewport-toolbox">
              <div className="bg-stone-900 border border-stone-850 rounded-xl p-6 text-stone-100 space-y-5">
                <div>
                  <h2 className="text-base font-bold text-amber-400 font-display flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-amber-400" />
                    Sandbox Operating Toolbox — Ban Kỹ Thuật iLEAD
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Cung cấp các công cụ vận chuyển thử nghiệm, can thiệp tham số thời gian cực nhanh để khảo nghiệm chất lượng hệ thống iLEAD.
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <button 
                    onClick={() => handleTimeTravelSim(1)}
                    className="p-3 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs font-bold rounded-lg cursor-pointer transition-colors flex flex-col gap-1 text-left"
                  >
                    <span className="text-[10px] text-stone-400 font-mono">Gia tốc</span>
                    <span>Tua hành SLA +1h</span>
                  </button>

                  <button 
                    onClick={() => handleTimeTravelSim(12)}
                    className="p-3 bg-stone-850 hover:bg-stone-700 border border-stone-700 text-xs font-bold rounded-lg cursor-pointer transition-colors flex flex-col gap-1 text-left"
                  >
                    <span className="text-[10px] text-stone-400 font-mono">Gia tốc</span>
                    <span>Tua hành SLA +12h</span>
                  </button>

                  <button 
                    onClick={() => handleTimeTravelSim(24)}
                    className="p-3 bg-amber-800 hover:bg-amber-900 border border-amber-700 text-xs font-bold rounded-lg cursor-pointer transition-colors flex flex-col gap-1 text-left text-white"
                  >
                    <span className="text-[10px] text-amber-200 font-mono">Gia tốc báo động</span>
                    <span>Reminder +24h</span>
                  </button>

                  <button 
                    onClick={() => handleTimeTravelSim(48)}
                    className="p-3 bg-amber-600 hover:bg-amber-700 border border-amber-500 text-xs font-bold rounded-lg cursor-pointer transition-colors flex flex-col gap-1 text-left text-white"
                  >
                    <span className="text-[10px] text-amber-100 font-mono">Gia tốc khẩn</span>
                    <span>Escalate SLA +48h</span>
                  </button>
                </div>

                <div className="p-4 bg-stone-950 rounded-xl space-y-3 border border-stone-800 text-xs">
                  <span className="block text-[10px] tracking-wider text-amber-300 font-bold uppercase font-mono">Can thiệp khẩn cấp (Override statuses)</span>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => {
                        setRecord(prev => ({ ...prev, status: 'Co-signed' }));
                        appendLog('Hệ thống', 'Đặt trạng thái khẩn cấp', 'Can thiệp override trạng thái của hồ sơ thành "Co-signed" để mở khoá Depth & IDP.');
                      }}
                      className="py-1 px-2.5 bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 text-[10px] font-bold rounded cursor-pointer"
                    >
                      Bắt buộc "Co-signed"
                    </button>
                    <button 
                      onClick={() => {
                        setRecord(prev => ({ ...prev, status: 'Draft', declaresCount: 2 }));
                        appendLog('Hệ thống', 'Đặt trạng thái khẩn cấp', 'Can thiệp override trạng thái thành "Draft" (Lần nộp 2 trở đi - Bắt buộc soi chiếu).');
                      }}
                      className="py-1 px-2.5 bg-stone-850 text-stone-300 hover:bg-stone-800 border border-stone-700 text-[10px] font-bold rounded cursor-pointer"
                    >
                      Bắt buộc "Draft" (Lớp nộp 2)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. VIEW PORT: iLEAD RULES LIBRARY */}
          {activeMenuItem === 'library' && (
            <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in" id="viewport-library">
              <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-stone-900 tracking-tight">Thư Viện Quy Regulation iLEAD — VNDIRECT</h2>
                  <p className="text-xs text-stone-500 mt-1">Các văn bản pháp lý ban hành bởi EXCO và Ban Quản trị nội bộ (IG).</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                    <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      PDF
                    </div>
                    <h4 className="font-bold text-stone-900">1. Sổ Tay Lộ trình Công vụ Onboarding và iLEAD</h4>
                    <p className="text-[11px] text-stone-500 leading-relaxed">Chi tiết thông tư 14 về chính sách điều biên cấp bậc iCON.</p>
                    <span className="text-[10px] text-emerald-600 font-bold cursor-pointer block hover:underline">Tải về (.pdf - 4.2 MB)</span>
                  </div>

                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                    <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      PDF
                    </div>
                    <h4 className="font-bold text-stone-900">2. Quy Định SLA Đồng Hành Co-sign 48h - 96h</h4>
                    <p className="text-[11px] text-stone-500 leading-relaxed">Quy định gạt bỏ rào cản cho sự phát triển của nhân viên.</p>
                    <span className="text-[10px] text-emerald-600 font-bold cursor-pointer block hover:underline">Tải về (.pdf - 1.8 MB)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ── FOOTER ── */}
        <footer className="bg-white border-t border-stone-200 py-3.5 text-center text-[11px] text-stone-400 shrink-0" id="main-footer">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p>© 2026 iLEAD Workspace. Đã triển khai tối ưu theo quy chế quản trị nội bộ VNDIRECT.</p>
            <div className="flex gap-3 justify-center">
              <span className="hover:text-stone-650 font-mono tracking-tight">DMS Sync Active ✓</span>
              <span>•</span>
              <span className="hover:text-stone-650 font-mono tracking-tight">dLink Comm Engine</span>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}
