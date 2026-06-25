import { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import {
  LayoutGrid, Clock, CheckCircle2, AlertCircle, Users, Plus, Filter,
  ChevronDown, MoreHorizontal, Search, Calendar, Tag, X, Upload,
  Image as ImageIcon, ArrowRight, Bell, Settings, ChevronRight,
  Edit2, Trash2, RotateCcw, UserCheck, ZoomIn, ChevronLeft,
  AlertTriangle, Circle, Download, Grip, Info, LogOut, Lock, Eye, EyeOff,
  Languages, Palette, Monitor, Sparkles, Keyboard
} from "lucide-react";

// ─── Toast system ─────────────────────────────────────────────────────────────

type ToastType = "success" | "error" | "info";
interface Toast { id: number; msg: string; type: ToastType }

let _addToast: ((msg: string, type?: ToastType) => void) | null = null;
export function showToast(msg: string, type: ToastType = "success") { _addToast?.(msg, type); }

type Language = "zh" | "en";
const LocaleContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  text: (zh: string, en: string) => string;
}>({
  language: "zh",
  setLanguage: () => {},
  text: zh => zh,
});

function useLocale() {
  return useContext(LocaleContext);
}

const UI_TRANSLATIONS: Record<string, string> = {
  "设计师平台": "Designer Platform",
  "一体化内容设计平台": "Integrated Content Design Platform",
  "需求分配、设计排期、资源流转与交付状态统一管理，让全球素材协作更清晰。": "Manage request assignment, designer scheduling, asset workflow, and delivery status in one place.",
  "欢迎登录": "Welcome",
  "智能运营": "Smart Ops",
  "数据总览": "Data Overview",
  "排期管理": "Scheduling",
  "任务监控": "Task Monitor",
  "登录账号": "Login",
  "邮箱": "Email",
  "密码": "Password",
  "请输入密码": "Enter password",
  "登录": "Log In",
  "测试账号（密码均为 123456）": "Test accounts (password: 123456)",
  "邮箱或密码错误，请重试": "Email or password is incorrect. Please try again.",
  "运营": "Operator",
  "设计师": "Designer",
  "管理员": "Admin",
  "运营端": "OPS",
  "设计端": "DESIGN",
  "需求看板": "Board",
  "创建Topic": "Create Topic",
  "设计师排期": "Schedule",
  "用户管理": "Users",
  "修改密码": "Change Password",
  "退出登录": "Log Out",
  "系统语言": "System Language",
  "暂无预览图": "No preview",
  "需关注": "Attention",
  "已同步": "Synced",
  "未分配": "Unassigned",
  "待分配": "To Assign",
  "未开始": "Not Started",
  "进行中": "In Progress",
  "超时": "Overdue",
  "已完成": "Completed",
  "分配任务": "Assign Task",
  "重新分配": "Reassign",
  "撤回": "Recall",
  "资源已同步，不支持修改": "Synced resources cannot be edited",
  "编辑 Topic": "Edit Topic",
  "删除": "Delete",
  "确认删除此 Topic？": "Delete this Topic?",
  "资源类型": "Resource Type",
  "归属 App": "App",
  "跟进运营": "Operator",
  "指定设计师": "Designer",
  "任务时间": "Task Time",
  "制作进度": "Production Stage",
  "选择进度": "Select stage",
  "未设置": "Not Set",
  "关联标签": "Tags",
  "参考素材": "References",
  "全部类型": "All Types",
  "全部 App": "All Apps",
  "全部状态": "All Status",
  "全部运营": "All Operators",
  "全部设计师": "All Designers",
  "清除": "Clear",
  "暂无任务": "No Tasks",
  "保存草稿": "Save Draft",
  "保存修改": "Save Changes",
  "创建并分配": "Create and Assign",
  "填写检查": "Checklist",
  "创建前确认关键信息": "Check key fields before creating",
  "选择任务时间": "Select Task Time",
  "点击开始日，再点击结束日": "Click a start day, then an end day",
  "开始": "Start",
  "结束": "End",
  "工期": "Duration",
  "选择设计师": "Select Designer",
  "全部分组": "All Groups",
  "未分组": "Ungrouped",
  "空闲": "Available",
  "该时间已满": "Fully Booked",
  "请选择时间段和设计师": "Select a time range and designer",
  "取消": "Cancel",
  "确认分配": "Confirm",
  "今天": "Today",
  "任务": "Tasks",
  "平均占用": "Average Load",
  "高负载": "High Load",
  "今日": "Today",
  "状态": "Status",
  "新建用户": "New User",
  "新增用户": "Add User",
  "保存设置": "Save Settings",
  "已保存 ✓": "Saved ✓",
  "用户名": "Name",
  "职位": "Role",
  "设计师分组": "Designer Group",
  "确认新增": "Add User",
  "请输入当前密码": "Enter current password",
  "新密码至少 6 位": "New password must be at least 6 characters",
  "两次输入不一致": "Passwords do not match",
  "当前密码": "Current Password",
  "新密码": "New Password",
  "确认新密码": "Confirm New Password",
  "密码修改成功 ✓": "Password changed ✓",
  "保存": "Save",
  "速": "Urgent",
  "已超时": "Overdue",
  "累计需求": "Total Requests",
  "个高优先级": "High Priority",
  "按状态、负责人和素材类型追踪 Topic 从创建到交付的全过程": "Track Topics from creation to delivery by status, owner, and asset type",
  "完成率": "Completion",
  "搜索需求...": "Search requests...",
  "新增需求": "New Request",
  "筛选": "Filters",
  "全部资源类型": "All Resource Types",
  "全部归属App": "All Apps",
  "全部跟进运营": "All Operators",
  "显示": "Showing",
  "条": "items",
  "创建新需求": "Create Request",
  "近7天": "Last 7 Days",
  "创建 Topic": "Create Topic",
  "填写资源基础信息，完成后可直接分配给设计师": "Fill in basic asset information, then assign it to a designer",
  "完成度": "Completion",
  "单个创建": "Single",
  "批量创建": "Batch",
  "上传 Excel 文件": "Upload Excel File",
  "支持批量创建，仅需填写资源类型和跟进运营": "Batch creation is supported. Only resource type and operator are required.",
  "点击或拖拽文件到此处": "Click or drag a file here",
  "下载模板文件": "Download Template",
  "基础信息": "Basic Info",
  "必填": "Required",
  "请选择运营": "Select operator",
  "资源命名": "Resource Name",
  "输入资源名称（创建后设计师不可修改）": "Enter resource name (cannot be edited by designers after creation)",
  "详细描述": "Description",
  "描述设计需求、风格参考、注意事项等...": "Describe design needs, style references, notes, etc.",
  "相关图片": "Images",
  "支持拖拽/粘贴，格式不限": "Drag, paste, any format",
  "添加": "Add",
  "收起": "Collapse",
  "选择标签": "Select Tags",
  "暂未选择标签": "No tags selected",
  "* 请填写资源类型、跟进运营、资源名称": "* Please fill resource type, operator, and resource name",
  "草稿已保存": "Draft saved",
  "修改已保存": "Changes saved",
  "Topic 创建成功": "Topic created",
  "核心必填项已完成，可以保存或进入分配流程。": "Required core fields are complete. You can save or assign.",
  "至少需要资源类型、跟进运营和资源名称，才能保存 Topic。": "Resource type, operator, and resource name are required to save a Topic.",
  "今日起 · 可横向预览前后日期": "From today · scroll horizontally to preview dates",
  "查看和管理所有设计师的任务时间安排": "View and manage all designer schedules",
  "自定义占用": "Custom Hold",
  "该设计师在所选时间段已有2项工作，无法继续安排": "This designer already has 2 tasks in the selected range",
  "任务已撤回，重置为待分配": "Task recalled and reset to To Assign",
  "Topic 已删除": "Topic deleted",
  "Topic 已更新": "Topic updated",
  "制作进度已更新为": "Production stage updated to",
  "管理平台管理员、运营和设计师角色，设置设计师分组": "Manage admin, operator, and designer roles and designer groups",
  "当前为只读模式，仅管理员可修改人员身份": "Read-only mode. Only admins can edit identities.",
  "仅管理员账号可以修改人员身份": "Only admin accounts can edit identities",
  "管理员账号默认拥有运营和设计师权限": "Admin accounts have operator and designer permissions by default",
  "仅管理员账号可以保存人员身份设置": "Only admin accounts can save identity settings",
  "按制作流程查看被分配的任务": "View assigned tasks by production flow",
  "当前": "Current",
  "阶段暂无任务。": "stage has no tasks.",
  "Timeout": "Timeout",
  "进度控制": "Progress Control",
  "由运营更新": "Updated by operator",
  "已逾期": "Overdue",
  "剩余时间": "Time Left",
  "Topic 快照": "Topic Snapshot",
  "正在进入": "Opening",
  "制作流程": "production flow",
  "去制作": "Start Work",
  "Topic 快照（只读）": "Topic Snapshot (read only)",
  "资源名：": "Resource: ",
  "类型：": "Type: ",
  "运营：": "Operator: ",
  "选择任务时间和设计师": "Select task time and designer",
  "选择时间段和设计师": "Select time range and designer",
  "未选择": "Not Selected",
  "个任务": "tasks",
  "Draft": "Draft",
  "Preview image review": "Preview image review",
  "Preview failed": "Preview failed",
  "Resources to be replenished": "Resources to be replenished",
  "Resource package review": "Resource package review",
  "Resource package failed": "Resource package failed",
  "approved": "Approved",
  "单人排期": "Personal Schedule",
  "按日期查看该设计师当前排期": "View this designer's schedule by date",
  "搜索设计师": "Search designers",
  "点击设计师查看单人排期": "Click designer to view personal schedule",
};

const PRODUCTION_STAGE_TRANSLATIONS: Record<ProductionStage, string> = {
  "Draft": "草稿",
  "Preview image review": "预览图审核",
  "Preview failed": "预览图驳回",
  "Resources to be replenished": "资源待补充",
  "Resource package review": "资源包审核",
  "Resource package failed": "资源包驳回",
  "approved": "已通过",
};

function LocaleTextSync() {
  const { language } = useLocale();

  useEffect(() => {
    const zhToEn = UI_TRANSLATIONS;
    const enToZh = Object.fromEntries(Object.entries(UI_TRANSLATIONS).map(([zh, en]) => [en, zh]));
    const dict = language === "zh" ? enToZh : zhToEn;
    const stageEnToZh = PRODUCTION_STAGE_TRANSLATIONS;
    const stageZhToEn = Object.fromEntries(Object.entries(PRODUCTION_STAGE_TRANSLATIONS).map(([en, zh]) => [zh, en]));
    const stageDict = language === "zh" ? stageEnToZh : stageZhToEn;
    const exactDict = dict;
    const unsafeFragments = new Set(["Admin", "Operator", "Designer", "App", "Email", "Name", "Role", "Status", "Current"]);
    const fragmentEntries = Object.entries(dict)
      .filter(([from]) => from.length >= 3 && !unsafeFragments.has(from))
      .sort((a, b) => b[0].length - a[0].length);
    const translate = (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return value;
      if (stageDict[trimmed]) return value.replace(trimmed, stageDict[trimmed]);
      if (exactDict[trimmed]) return value.replace(trimmed, exactDict[trimmed]);
      let next = value;
      fragmentEntries.forEach(([from, to]) => {
        next = next.split(from).join(to);
      });
      if (language === "en") {
        next = next
          .replace(/显示\s+(\d+)\s+\/\s+(\d+)\s+条/g, "Showing $1 / $2 items")
          .replace(/未分配\s+(\d+)/g, "Unassigned $1")
          .replace(/完成率\s+(\d+)%/g, "Completion $1%")
          .replace(/(\d+)\s*个高优先级/g, "$1 High Priority")
          .replace(/(\d+)个任务/g, "$1 tasks")
          .replace(/(\d+)\s*天/g, "$1 days")
          .replace(/逾期(\d+)天/g, "$1 days overdue")
          .replace(/余(\d+)天/g, "$1 days left");
      } else {
        next = next
          .replace(/Showing\s+(\d+)\s+\/\s+(\d+)\s+items/g, "显示 $1 / $2 条")
          .replace(/Unassigned\s+(\d+)/g, "未分配 $1")
          .replace(/Completion\s+(\d+)%/g, "完成率 $1%")
          .replace(/(\d+)\s+High Priority/g, "$1 个高优先级")
          .replace(/(\d+)\s+tasks/g, "$1个任务")
          .replace(/(\d+)\s+days overdue/g, "逾期$1天")
          .replace(/(\d+)\s+days left/g, "余$1天")
          .replace(/(\d+)\s+days/g, "$1 天");
      }
      return next;
    };
    const sync = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);
      nodes.forEach(node => {
        if (node.parentElement?.closest("input,textarea")) return;
        const next = translate(node.nodeValue ?? "");
        if (next !== node.nodeValue) node.nodeValue = next;
      });
      document.querySelectorAll<HTMLElement>("[placeholder],[title]").forEach(el => {
        ["placeholder", "title"].forEach(attr => {
          const value = el.getAttribute(attr);
          if (!value) return;
          const next = translate(value);
          if (next !== value) el.setAttribute(attr, next);
        });
      });
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [language]);

  return null;
}

function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    _addToast = (msg, type = "success") => {
      const id = nextId.current++;
      setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };
    return () => { _addToast = null; };
  }, []);

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg border flex items-center gap-2 pointer-events-auto transition-all ${
          t.type === "success" ? "bg-card text-emerald-700 border-emerald-200" :
          t.type === "error"   ? "bg-card text-red-600 border-red-200" :
                                 "bg-card text-foreground border-border"
        }`}>
          {t.type === "success" && <CheckCircle2 size={14} />}
          {t.type === "error"   && <AlertCircle size={14} />}
          {t.type === "info"    && <Info size={14} />}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── Auth types & accounts ────────────────────────────────────────────────────

interface LoggedInUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

type UserRole = "运营" | "设计师" | "管理员";

const ACCOUNTS: (LoggedInUser & { password: string })[] = [
  { id: "u0", name: "Admin Li",   email: "admin@company.com", role: "管理员", avatar: "AD", password: "123456" },
  { id: "u1", name: "Alice Chen", email: "alice@company.com", role: "运营",  avatar: "AC", password: "123456" },
  { id: "u2", name: "Ben Wang",   email: "ben@company.com",   role: "运营",  avatar: "BW", password: "123456" },
  { id: "u11", name: "Doris Xu",  email: "doris@company.com", role: "运营",  avatar: "DX", password: "123456" },
  { id: "u12", name: "Fiona Gao", email: "fiona@company.com", role: "运营",  avatar: "FG", password: "123456" },
  { id: "u4", name: "Ryan Liu",   email: "ryan@company.com",  role: "设计师", avatar: "RL", password: "123456" },
  { id: "u5", name: "Mia Zhang",  email: "mia@company.com",   role: "设计师", avatar: "MZ", password: "123456" },
  { id: "u9", name: "Lily Wu",    email: "lily@company.com",  role: "设计师", avatar: "LW", password: "123456" },
  { id: "u15", name: "Ava Patel", email: "ava@company.com",   role: "设计师", avatar: "AP", password: "123456" },
];

function roleTextClass(role: UserRole) {
  if (role === "管理员") return "text-emerald-600";
  if (role === "运营") return "text-primary";
  return "text-violet-500";
}

// ─── Login Page ───────────────────────────────────────────────────────────────

function LoginPage({ onLogin }: { onLogin: (u: LoggedInUser) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { language, setLanguage, text } = useLocale();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const account = ACCOUNTS.find(a => a.email === email && a.password === password);
    if (account) {
      const { password: _, ...user } = account;
      onLogin(user);
    } else {
      setError("邮箱或密码错误，请重试");
    }
  }

  return (
    <div className="min-h-screen min-w-[1080px] overflow-hidden bg-[radial-gradient(circle_at_18%_22%,#dbeafe_0,#eff6ff_30%,transparent_58%),linear-gradient(135deg,#edf6ff_0%,#dff1ff_45%,#c9e6ff_100%)] flex items-center justify-center px-16 py-10 relative">
      <div className="absolute -left-24 top-20 w-96 h-96 rounded-full bg-blue-300/25 blur-3xl" />
      <div className="absolute right-4 bottom-0 w-[520px] h-[520px] rounded-full bg-sky-300/20 blur-3xl" />
      <div className="absolute inset-0 opacity-50 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.45)_50%,transparent_100%)]" />
      <div className="absolute right-6 top-5 z-20 flex items-center gap-1 rounded-xl border border-white/70 bg-white/50 p-1 shadow-sm backdrop-blur-xl">
        {[
          { value: "zh" as Language, label: "中文" },
          { value: "en" as Language, label: "English" },
        ].map(option => (
          <button
            key={option.value}
            onClick={() => setLanguage(option.value)}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              language === option.value ? "bg-primary text-primary-foreground shadow-sm" : "text-slate-500 hover:bg-white/70 hover:text-slate-800"
            }`}>
            {option.label}
          </button>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-[1.25fr_380px] gap-14 items-center">
        <section className="relative min-h-[520px] flex flex-col justify-center">
          <div className="mb-10">
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 px-3 py-1 text-[11px] font-semibold text-white shadow-lg shadow-blue-500/20">
              {text("一体化内容设计平台", "Integrated Content Design Platform")}
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900">Kika Global Studio</h1>
            <p className="mt-3 text-sm text-slate-600 max-w-xl leading-relaxed">
              {text("需求分配、设计排期、资源流转与交付状态统一管理，让全球素材协作更清晰。", "Manage request assignment, designer scheduling, asset workflow, and delivery status in one place.")}
            </p>
          </div>

          <div className="relative w-[560px] h-[390px]">
            <div className="absolute left-20 top-28 w-[390px] h-[230px] rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute left-32 bottom-8 w-[300px] h-14 rounded-full bg-blue-800/10 blur-xl" />
            <img
              src="/assets/login-hero-cutout.png"
              alt="Kika Global Studio visual"
              className="absolute left-32 top-0 w-[340px] h-auto drop-shadow-[0_34px_58px_rgba(59,130,246,0.25)]" />

            {[
              { label: text("智能运营", "Smart Ops"), icon: <Users size={15} />, className: "left-2 top-[96px] text-indigo-600" },
              { label: text("数据总览", "Data Overview"), icon: <LayoutGrid size={15} />, className: "left-[398px] top-[74px] text-emerald-600" },
              { label: text("排期管理", "Scheduling"), icon: <Calendar size={15} />, className: "left-10 top-[238px] text-blue-600" },
              { label: text("任务监控", "Task Monitor"), icon: <Clock size={15} />, className: "left-[386px] top-[236px] text-amber-600" },
            ].map(item => (
              <div key={item.label} className={`absolute ${item.className} flex items-center gap-2 rounded-2xl bg-white/45 px-4 py-2 text-xs font-semibold shadow-[0_14px_36px_rgba(30,64,175,0.12)] backdrop-blur-xl border border-white/70 ring-1 ring-white/40`}>
                <span className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center shadow-inner">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/70 bg-white/72 backdrop-blur-xl shadow-[0_24px_80px_rgba(30,64,175,0.18)] p-7">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">{text("欢迎登录", "Welcome")}</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">{text("邮箱", "Email")}</label>
              <input value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                type="email" placeholder="your@company.com" autoComplete="email"
                className="w-full px-3 py-3 bg-white/85 border border-blue-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 shadow-inner shadow-blue-50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">{text("密码", "Password")}</label>
              <div className="relative">
                <input value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
                  type={showPw ? "text" : "password"} placeholder={text("请输入密码", "Enter password")} autoComplete="current-password"
                  className="w-full px-3 py-3 bg-white/85 border border-blue-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 pr-10 shadow-inner shadow-blue-50" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 mt-2">
              {text("登录", "Log In")}
            </button>
          </form>
          <div className="mt-5 pt-4 border-t border-blue-100">
            <div className="text-[11px] text-slate-500 mb-2">{text("测试账号（密码均为 123456）", "Test accounts (password: 123456)")}</div>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden">
              {ACCOUNTS.map(a => (
                <button key={a.id} onClick={() => { setEmail(a.email); setPassword(a.password); setError(""); }}
                  className="text-left px-2.5 py-2 rounded-xl bg-blue-50/70 hover:bg-blue-100/80 transition-colors border border-blue-100/60">
                  <div className="text-[11px] font-semibold text-slate-700">{a.name}</div>
                  <div className={`text-[10px] ${roleTextClass(a.role)}`}>{a.role}</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
      <div className="absolute right-6 bottom-5 text-[11px] font-medium text-slate-500/80">{text("设计师平台", "Designer Platform")} V0.2</div>
    </div>
  );
}

// ─── Change Password Modal ────────────────────────────────────────────────────

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSave() {
    if (!current) { setError("请输入当前密码"); return; }
    if (next.length < 6) { setError("新密码至少 6 位"); return; }
    if (next !== confirm) { setError("两次输入不一致"); return; }
    setSuccess(true);
    setTimeout(onClose, 1200);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2"><Lock size={14} /> 修改密码</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: "当前密码", value: current, set: setCurrent, show: showCur, toggle: () => setShowCur(v => !v) },
            { label: "新密码",   value: next,    set: setNext,    show: showNew, toggle: () => setShowNew(v => !v) },
            { label: "确认新密码", value: confirm, set: setConfirm, show: showNew, toggle: () => setShowNew(v => !v) },
          ].map(({ label, value, set, show, toggle }) => (
            <div key={label}>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">{label}</label>
              <div className="relative">
                <input value={value} onChange={e => { set(e.target.value); setError(""); }}
                  type={show ? "text" : "password"} placeholder="••••••"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 pr-9" />
                <button type="button" onClick={toggle}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
          ))}
          {error && <p className="text-xs text-red-500">{error}</p>}
          {success && <p className="text-xs text-emerald-600 font-medium">密码修改成功 ✓</p>}
        </div>
        <div className="px-5 py-4 border-t border-border flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors">取消</button>
          <button onClick={handleSave} className="flex-1 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-blue-700 transition-colors">保存</button>
        </div>
      </div>
    </div>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

type Page = "topics" | "create" | "schedule" | "users" | "mywork";
type TopicStatus = "待分配" | "未开始" | "进行中" | "已完成" | "超时";
type ResourceType = "Themepack" | "Control Center" | "Supertheme" | "Keyboard";
type ProductionStage = "Draft" | "Preview image review" | "Preview failed" | "Resources to be replenished" | "Resource package review" | "Resource package failed" | "approved";
type AppType = "Themepack iOS" | "Themepack Android" | "iThemes" | "Cooltheme" | "Themely";
const RESOURCE_TYPES: ResourceType[] = ["Themepack", "Control Center", "Supertheme", "Keyboard"];
const APP_TYPES: AppType[] = ["Themepack iOS", "Themepack Android", "iThemes", "Cooltheme", "Themely"];
const PRODUCTION_STAGES: ProductionStage[] = [
  "Draft",
  "Preview image review",
  "Preview failed",
  "Resources to be replenished",
  "Resource package review",
  "Resource package failed",
  "approved",
];

interface Topic {
  id: string;
  name: string;
  description: string;
  resourceType: ResourceType;
  apps: AppType[];
  operator: string;
  designer: string | null;
  status: TopicStatus;
  startDate: string | null;
  endDate: string | null;
  images: string[];
  tags: string[];
  isDelayed: boolean;
  isSynced: boolean;
  daysLeft: number | null;
  productionStage: ProductionStage;
}

interface Designer {
  id: string;
  name: string;
  avatar: string;
  group: string;
  tasks: { title: string; start: number; end: number; status: TopicStatus; type: ResourceType; startDate?: string; endDate?: string }[];
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const today = new Date();
const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const isoFromOffset = (offset: number) => {
  const d = new Date(todayStart);
  d.setDate(todayStart.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const diffDaysFromToday = (iso?: string) => {
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  return Math.round((new Date(year, month - 1, day).getTime() - todayStart.getTime()) / MS_PER_DAY);
};
const daysLeftFromEndDate = (endDate: string | null) => diffDaysFromToday(endDate ?? undefined);
const taskRangeFromTopic = (topic: Topic) => {
  const startOffset = diffDaysFromToday(topic.startDate ?? undefined);
  const endOffset = diffDaysFromToday(topic.endDate ?? undefined);
  return {
    title: topic.name,
    start: startOffset ?? 0,
    end: endOffset ?? 0,
    status: topic.status,
    type: topic.resourceType,
    startDate: topic.startDate ?? undefined,
    endDate: topic.endDate ?? undefined,
  };
};
const defaultProductionStageForTopic = (topic: Partial<Topic> & { id?: string; status?: TopicStatus; isSynced?: boolean }): ProductionStage => {
  if (topic.isSynced || topic.status === "已完成") return "approved";
  if (topic.status === "待分配" || topic.status === "未开始") return "Draft";
  if (topic.status === "超时") return "Resource package failed";
  const index = Number((topic.id ?? "0").replace(/\D/g, "")) || 0;
  return PRODUCTION_STAGES[index % (PRODUCTION_STAGES.length - 1)];
};
const normalizeTopic = (topic: Topic): Topic => ({
  ...topic,
  productionStage: topic.productionStage ?? defaultProductionStageForTopic(topic),
});

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_TOPICS: Topic[] = [
  {
    id: "t001", name: "Summer Bloom Collection", description: "A vibrant themepack inspired by summer florals and warm gradients for iOS",
    resourceType: "Themepack", apps: ["Themepack iOS", "iThemes"], operator: "Alice Chen",
    designer: "Ryan Liu", status: "进行中", startDate: isoFromOffset(0), endDate: isoFromOffset(8),
    images: ["1506905925346-21bda4d32df4", "1490750967868-88df5691cc12"],
    tags: ["Summer", "Floral", "Warm"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(8)),
  },
  {
    id: "t002", name: "Dark Control Master v2", description: "Next-gen control center with deep dark mode and neon accent system",
    resourceType: "Control Center", apps: ["Themepack iOS"], operator: "Ben Wang",
    designer: "Mia Zhang", status: "超时", startDate: isoFromOffset(-18), endDate: isoFromOffset(-3),
    images: ["1518770660439-4636190af475"],
    tags: ["Dark", "Neon", "Control"], isDelayed: true, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(-3)),
  },
  {
    id: "t003", name: "Pastel Dreams Supertheme", description: "Soft pastel palette supertheme with layered gradients",
    resourceType: "Supertheme", apps: ["Cooltheme", "Themely"], operator: "Alice Chen",
    designer: null, status: "待分配", startDate: null, endDate: null,
    images: ["1506905925346-21bda4d32df4"],
    tags: ["Pastel", "Gradient"], isDelayed: false, isSynced: false, daysLeft: null,
  },
  {
    id: "t004", name: "Monochrome Studio Pack", description: "Minimal black-and-white themepack for creative professionals",
    resourceType: "Themepack", apps: ["Themepack Android", "Cooltheme"], operator: "Carol Li",
    designer: "James Park", status: "未开始", startDate: isoFromOffset(3), endDate: isoFromOffset(13),
    images: ["1541701494587-cb58502866ab", "1550751827-4bd374c3f58b"],
    tags: ["Minimal", "Monochrome"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(13)),
  },
  {
    id: "t005", name: "Vintage Film Grain Theme", description: "Nostalgic film-grain textures and faded color palettes",
    resourceType: "Themepack", apps: ["iThemes", "Themely"], operator: "Ben Wang",
    designer: "Sara Kim", status: "已完成", startDate: isoFromOffset(-9), endDate: isoFromOffset(-4),
    images: ["1526374965328-7f61d4dc18c5"],
    tags: ["Vintage", "Film", "Retro"], isDelayed: false, isSynced: true, daysLeft: null,
  },
  {
    id: "t006", name: "Aurora Borealis Pack", description: "Northern lights inspired dynamic gradients and color shifts",
    resourceType: "Supertheme", apps: ["Cooltheme", "Themepack iOS"], operator: "Carol Li",
    designer: "Ryan Liu", status: "进行中", startDate: isoFromOffset(2), endDate: isoFromOffset(15),
    images: ["1531366936337-7c912a4589a7", "1518173946687-a4c8892bbd9f"],
    tags: ["Aurora", "Dynamic", "Nature"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(15)),
  },
  {
    id: "t007", name: "Cyberpunk Grid Control", description: "Retro-futuristic grid and scan-line aesthetic for control center",
    resourceType: "Control Center", apps: ["Themepack Android"], operator: "Alice Chen",
    designer: null, status: "待分配", startDate: null, endDate: null,
    images: [],
    tags: ["Cyberpunk", "Grid", "Futuristic"], isDelayed: false, isSynced: false, daysLeft: null,
  },
  {
    id: "t008", name: "Neon Keyboard Sprint", description: "High-contrast keyboard skin set with bright edge lighting and gesture states",
    resourceType: "Keyboard", apps: ["iThemes", "Themepack Android"], operator: "Doris Xu",
    designer: "Ryan Liu", status: "未开始", startDate: isoFromOffset(0), endDate: isoFromOffset(6),
    images: ["1519608487953-e999c86e7455"],
    tags: ["Keyboard", "Neon", "Gesture"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(6)),
  },
  {
    id: "t009", name: "Ocean Depth Theme", description: "Deep sea icons and lockscreen artwork with layered blue lighting",
    resourceType: "Themepack", apps: ["Themepack iOS", "Cooltheme"], operator: "Evan Zhou",
    designer: "Lily Wu", status: "进行中", startDate: isoFromOffset(1), endDate: isoFromOffset(9),
    images: ["1507525428034-b723cf961d3e", "1500530855697-b586d89ba3ee"],
    tags: ["Ocean", "Blue", "Depth"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(9)),
  },
  {
    id: "t010", name: "Festival Sticker Control", description: "Festival themed control center shortcuts and notification surfaces",
    resourceType: "Control Center", apps: ["Themepack iOS", "iThemes"], operator: "Fiona Gao",
    designer: "Noah Smith", status: "未开始", startDate: isoFromOffset(5), endDate: isoFromOffset(12),
    images: [],
    tags: ["Festival", "Sticker", "Control"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(12)),
  },
  {
    id: "t011", name: "Cute Cat Keyboard", description: "Soft illustrated keyboard variants with keycap states and emoji panel",
    resourceType: "Keyboard", apps: ["Themepack Android", "iThemes"], operator: "Alice Chen",
    designer: "Mia Zhang", status: "进行中", startDate: isoFromOffset(0), endDate: isoFromOffset(5),
    images: ["1514888286974-6c03e2ca1dba", "1518791841217-8f162f1e1131"],
    tags: ["Cute", "Keyboard", "Emoji"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(5)),
  },
  {
    id: "t012", name: "Business Minimal Keyboard", description: "Low contrast professional keyboard skin for productivity users",
    resourceType: "Keyboard", apps: ["Themepack iOS"], operator: "Ben Wang",
    designer: null, status: "待分配", startDate: null, endDate: null,
    images: [],
    tags: ["Business", "Minimal", "Keyboard"], isDelayed: false, isSynced: false, daysLeft: null,
  },
  {
    id: "t013", name: "Golden Hour Supertheme", description: "Warm sunset supertheme system with widget and wallpaper variants",
    resourceType: "Supertheme", apps: ["Themely", "Cooltheme"], operator: "Doris Xu",
    designer: "Ava Patel", status: "已完成", startDate: isoFromOffset(-20), endDate: isoFromOffset(-12),
    images: ["1500534314209-a25ddb2bd429"],
    tags: ["Golden", "Sunset", "Warm"], isDelayed: false, isSynced: true, daysLeft: null,
  },
  {
    id: "t014", name: "Retro Pixel Pack", description: "Pixel art icons and wallpapers with low-resolution nostalgic styling",
    resourceType: "Themepack", apps: ["iThemes", "Themepack Android"], operator: "Fiona Gao",
    designer: "Leo Martin", status: "未开始", startDate: isoFromOffset(14), endDate: isoFromOffset(24),
    images: ["1550745165-9bc0b252726f"],
    tags: ["Pixel", "Retro", "Game"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(24)),
  },
  {
    id: "t015", name: "Admin Review Floral Pack", description: "Admin owned themepack review flow with icon, wallpaper, and store preview deliverables",
    resourceType: "Themepack", apps: ["Themepack iOS", "iThemes"], operator: "Admin Li",
    designer: "Admin Li", status: "进行中", startDate: isoFromOffset(0), endDate: isoFromOffset(4),
    images: ["1520763185298-1b434c919102", "1500530855697-b586d89ba3ee"],
    tags: ["Floral", "Review", "iOS"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(4)), productionStage: "Preview image review",
  },
  {
    id: "t016", name: "Admin Console Quick Tiles", description: "Control center quick access tile set for admin QA and resource package handoff",
    resourceType: "Control Center", apps: ["Themepack Android", "iThemes"], operator: "Admin Li",
    designer: "Admin Li", status: "未开始", startDate: isoFromOffset(7), endDate: isoFromOffset(13),
    images: ["1498050108023-c5249f4df085"],
    tags: ["Control", "Tiles", "QA"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(13)), productionStage: "Draft",
  },
  {
    id: "t017", name: "Admin Supertheme Launch Audit", description: "Cross-app supertheme audit covering widgets, lockscreen, and merchandising images",
    resourceType: "Supertheme", apps: ["Cooltheme", "Themely"], operator: "Doris Xu",
    designer: "Admin Li", status: "超时", startDate: isoFromOffset(-10), endDate: isoFromOffset(-2),
    images: ["1519681393784-d120267933ba"],
    tags: ["Audit", "Launch", "Widget"], isDelayed: true, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(-2)), productionStage: "Resource package failed",
  },
  {
    id: "t018", name: "Admin Keyboard Emoji States", description: "Keyboard emoji panel state pack for preview image review and package assembly",
    resourceType: "Keyboard", apps: ["Themepack iOS", "Themepack Android"], operator: "Fiona Gao",
    designer: "Admin Li", status: "进行中", startDate: isoFromOffset(5), endDate: isoFromOffset(9),
    images: ["1518791841217-8f162f1e1131"],
    tags: ["Keyboard", "Emoji", "States"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(9)), productionStage: "Resources to be replenished",
  },
  {
    id: "t019", name: "Admin Approved Cyber Icons", description: "Approved cyber icon batch retained for design-end approved state verification",
    resourceType: "Themepack", apps: ["iThemes"], operator: "Admin Li",
    designer: "Admin Li", status: "已完成", startDate: isoFromOffset(-18), endDate: isoFromOffset(-14),
    images: ["1519608487953-e999c86e7455"],
    tags: ["Cyber", "Approved", "Icon"], isDelayed: false, isSynced: true, daysLeft: null, productionStage: "approved",
  },
  {
    id: "t020", name: "Lavender Lock Keyboard", description: "Soft lavender keyboard concept with alternate keycap shadows and dark preview",
    resourceType: "Keyboard", apps: ["Themepack Android"], operator: "Alice Chen",
    designer: "Tom Chen", status: "未开始", startDate: isoFromOffset(2), endDate: isoFromOffset(8),
    images: ["1500534314209-a25ddb2bd429"],
    tags: ["Lavender", "Keyboard", "Dark"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(8)), productionStage: "Draft",
  },
  {
    id: "t021", name: "Anime Energy Supertheme", description: "High-energy anime inspired supertheme with motion preview requirements",
    resourceType: "Supertheme", apps: ["Cooltheme"], operator: "Ben Wang",
    designer: "Yuki Tan", status: "进行中", startDate: isoFromOffset(1), endDate: isoFromOffset(7),
    images: ["1518173946687-a4c8892bbd9f"],
    tags: ["Anime", "Motion", "Energy"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(7)), productionStage: "Preview image review",
  },
  {
    id: "t022", name: "K-Pop Glitter Pack", description: "Glitter-heavy themepack for K-pop audience with reusable wallpaper variants",
    resourceType: "Themepack", apps: ["Themepack iOS", "Themely"], operator: "Doris Xu",
    designer: "Sara Kim", status: "进行中", startDate: isoFromOffset(6), endDate: isoFromOffset(12),
    images: ["1526374965328-7f61d4dc18c5"],
    tags: ["Kpop", "Glitter", "Wallpaper"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(12)), productionStage: "Resource package review",
  },
  {
    id: "t023", name: "Sports Match Control", description: "Sports event control center skins with scoreboard and notification states",
    resourceType: "Control Center", apps: ["Themepack iOS"], operator: "Evan Zhou",
    designer: "Noah Smith", status: "进行中", startDate: isoFromOffset(13), endDate: isoFromOffset(18),
    images: ["1541701494587-cb58502866ab"],
    tags: ["Sports", "Scoreboard", "Control"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(18)), productionStage: "Preview failed",
  },
  {
    id: "t024", name: "Cute Spring Control Refresh", description: "Pastel spring control center refresh with notification and widget states",
    resourceType: "Control Center", apps: ["iThemes", "Themepack Android"], operator: "Fiona Gao",
    designer: null, status: "待分配", startDate: null, endDate: null,
    images: ["1506905925346-21bda4d32df4"],
    tags: ["Spring", "Cute", "Control"], isDelayed: false, isSynced: false, daysLeft: null, productionStage: "Draft",
  },
  {
    id: "t025", name: "Gothic Glass Keyboard", description: "Dark gothic keyboard package with glass texture and failed preview revision state",
    resourceType: "Keyboard", apps: ["iThemes"], operator: "Carol Li",
    designer: "Lily Wu", status: "超时", startDate: isoFromOffset(-12), endDate: isoFromOffset(-6),
    images: ["1518770660439-4636190af475"],
    tags: ["Gothic", "Glass", "Keyboard"], isDelayed: true, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(-6)), productionStage: "Preview failed",
  },
  {
    id: "t026", name: "Holiday Resource Replenish", description: "Holiday asset set waiting on missing preview images and resource replenishment",
    resourceType: "Themepack", apps: ["Themepack Android", "Cooltheme"], operator: "Alice Chen",
    designer: "James Park", status: "进行中", startDate: isoFromOffset(15), endDate: isoFromOffset(20),
    images: [],
    tags: ["Holiday", "Replenish", "Android"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(20)), productionStage: "Resources to be replenished",
  },
  {
    id: "t027", name: "Minimal Business Control", description: "Minimal business control center with package review pending from operator",
    resourceType: "Control Center", apps: ["Themepack iOS", "iThemes"], operator: "Ben Wang",
    designer: "Leo Martin", status: "进行中", startDate: isoFromOffset(25), endDate: isoFromOffset(31),
    images: [],
    tags: ["Business", "Minimal", "Review"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(31)), productionStage: "Resource package review",
  },
  {
    id: "t028", name: "Galaxy Drift Supertheme", description: "Galaxy drift supertheme ready for assignment to a senior designer",
    resourceType: "Supertheme", apps: ["Themely", "Cooltheme"], operator: "Admin Li",
    designer: null, status: "待分配", startDate: null, endDate: null,
    images: ["1531366936337-7c912a4589a7"],
    tags: ["Galaxy", "Drift", "Space"], isDelayed: false, isSynced: false, daysLeft: null, productionStage: "Draft",
  },
  {
    id: "t029", name: "Nordic Calm Themepack", description: "Nordic calm visual system for low-saturation wallpapers and icon backgrounds",
    resourceType: "Themepack", apps: ["Themepack iOS", "Cooltheme"], operator: "Olivia Brown",
    designer: "Nina Rossi", status: "进行中", startDate: isoFromOffset(3), endDate: isoFromOffset(10),
    images: ["1507525428034-b723cf961d3e"],
    tags: ["Minimalist", "Nordic", "Calm"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(10)), productionStage: "Preview image review",
  },
  {
    id: "t030", name: "Chrome Glass Control", description: "Chrome and glass material control center experiment for premium Android users",
    resourceType: "Control Center", apps: ["Themepack Android"], operator: "Ethan Brooks",
    designer: "Kai Mueller", status: "未开始", startDate: isoFromOffset(9), endDate: isoFromOffset(16),
    images: ["1550751827-4bd374c3f58b"],
    tags: ["Glass", "Chrome", "Premium"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(16)), productionStage: "Draft",
  },
  {
    id: "t031", name: "Soft Pet Keyboard", description: "Pet-themed keyboard skin with soft paw keycaps and emoji drawer variants",
    resourceType: "Keyboard", apps: ["iThemes", "Themepack Android"], operator: "Mark Stone",
    designer: "Grace Hall", status: "进行中", startDate: isoFromOffset(-1), endDate: isoFromOffset(5),
    images: ["1514888286974-6c03e2ca1dba"],
    tags: ["Cute", "Animal", "Keyboard"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(5)), productionStage: "Resource package review",
  },
  {
    id: "t032", name: "Ocean Widgets Supertheme", description: "Ocean widgets and matching wallpapers for a blue-toned supertheme package",
    resourceType: "Supertheme", apps: ["Themely"], operator: "Olivia Brown",
    designer: "Hana Ito", status: "已完成", startDate: isoFromOffset(-16), endDate: isoFromOffset(-9),
    images: ["1500530855697-b586d89ba3ee"],
    tags: ["Ocean", "Widget", "Blue"], isDelayed: false, isSynced: true, daysLeft: null, productionStage: "approved",
  },
  {
    id: "t033", name: "Luxury Black Keyboard", description: "Luxury black keyboard package blocked by missing resource exports",
    resourceType: "Keyboard", apps: ["Themepack iOS"], operator: "Ethan Brooks",
    designer: "Mark Stone", status: "超时", startDate: isoFromOffset(-8), endDate: isoFromOffset(-1),
    images: [],
    tags: ["Luxury", "Black", "Keyboard"], isDelayed: true, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(-1)), productionStage: "Resources to be replenished",
  },
  {
    id: "t034", name: "Valentine Heart Pack", description: "Valentine wallpaper and icon pack awaiting assignment after tag review",
    resourceType: "Themepack", apps: ["Themepack iOS", "iThemes"], operator: "Olivia Brown",
    designer: null, status: "待分配", startDate: null, endDate: null,
    images: ["1506905925346-21bda4d32df4"],
    tags: ["Valentine's Day", "love", "心形"], isDelayed: false, isSynced: false, daysLeft: null, productionStage: "Draft",
  },
  {
    id: "t035", name: "Admin Dense Keyboard QA", description: "Second concurrent admin keyboard QA task used to show fully booked days",
    resourceType: "Keyboard", apps: ["iThemes"], operator: "Admin Li",
    designer: "Admin Li", status: "进行中", startDate: isoFromOffset(-1), endDate: isoFromOffset(3),
    images: ["1518791841217-8f162f1e1131"],
    tags: ["Keyboard", "QA", "Dense"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(3)), productionStage: "Resource package review",
  },
  {
    id: "t036", name: "Admin Widget Supertheme Polish", description: "Admin supertheme polish round overlapping package review workload",
    resourceType: "Supertheme", apps: ["Themely", "Cooltheme"], operator: "Admin Li",
    designer: "Admin Li", status: "未开始", startDate: isoFromOffset(10), endDate: isoFromOffset(16),
    images: ["1531366936337-7c912a4589a7"],
    tags: ["Widget", "Polish", "Supertheme"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(16)), productionStage: "Draft",
  },
  {
    id: "t037", name: "Admin Icon Export Sprint", description: "Large icon export sprint for themepack package review saturation",
    resourceType: "Themepack", apps: ["Themepack Android", "iThemes"], operator: "Doris Xu",
    designer: "Admin Li", status: "进行中", startDate: isoFromOffset(14), endDate: isoFromOffset(20),
    images: ["1550745165-9bc0b252726f"],
    tags: ["Icon", "Export", "Sprint"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(20)), productionStage: "Preview image review",
  },
  {
    id: "t038", name: "Admin Control Package Fix", description: "Control center package fix after failed resource package review",
    resourceType: "Control Center", apps: ["Themepack iOS"], operator: "Fiona Gao",
    designer: "Admin Li", status: "进行中", startDate: isoFromOffset(17), endDate: isoFromOffset(23),
    images: ["1498050108023-c5249f4df085"],
    tags: ["Control", "Package", "Fix"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(23)), productionStage: "Resource package failed",
  },
  {
    id: "t039", name: "Admin Keyboard Resource Fill", description: "Keyboard resource replenishment task that keeps admin capacity near full",
    resourceType: "Keyboard", apps: ["Themepack Android"], operator: "Ethan Brooks",
    designer: "Admin Li", status: "未开始", startDate: isoFromOffset(21), endDate: isoFromOffset(27),
    images: [],
    tags: ["Keyboard", "Replenish", "Android"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(27)), productionStage: "Resources to be replenished",
  },
  {
    id: "t040", name: "Admin Final Supertheme Review", description: "Final review task closing out the admin fully booked schedule view",
    resourceType: "Supertheme", apps: ["Cooltheme"], operator: "Olivia Brown",
    designer: "Admin Li", status: "未开始", startDate: isoFromOffset(24), endDate: isoFromOffset(30),
    images: ["1519681393784-d120267933ba"],
    tags: ["Final", "Review", "Supertheme"], isDelayed: false, isSynced: false, daysLeft: daysLeftFromEndDate(isoFromOffset(30)), productionStage: "Resource package review",
  },
];

const MOCK_DESIGNERS: Designer[] = [
  {
    id: "d1", name: "Ryan Liu", avatar: "RL", group: "Group A",
    tasks: [
      { title: "Summer Bloom Collection", start: 10, end: 17, status: "进行中", type: "Themepack" },
      { title: "Aurora Borealis Pack", start: 20, end: 28, status: "进行中", type: "Supertheme" },
    ]
  },
  {
    id: "d2", name: "Mia Zhang", avatar: "MZ", group: "Group B",
    tasks: [
      { title: "Dark Control Master v2", start: 1, end: 8, status: "超时", type: "Control Center" },
    ]
  },
  {
    id: "d3", name: "James Park", avatar: "JP", group: "Group A",
    tasks: [
      { title: "Monochrome Studio Pack", start: 20, end: 30, status: "未开始", type: "Themepack" },
    ]
  },
  {
    id: "d4", name: "Sara Kim", avatar: "SK", group: "Group C",
    tasks: [
      { title: "Vintage Film Grain Theme", start: 1, end: 5, status: "已完成", type: "Themepack" },
    ]
  },
  {
    id: "d5", name: "Tom Chen", avatar: "TC", group: "Group B", tasks: []
  },
  {
    id: "d6", name: "Lily Wu", avatar: "LW", group: "Group C",
    tasks: [
      { title: "Ocean Depth Theme", start: 15, end: 22, status: "进行中", type: "Themepack" },
    ]
  },
];

const OPERATORS = ["Admin Li", "Alice Chen", "Ben Wang", "Carol Li", "Doris Xu", "Evan Zhou", "Fiona Gao", "Olivia Brown", "Ethan Brooks", "Mark Stone"];
const DESIGNER_GROUPS = ["Group A", "Group B", "Group C", "Group D", "Group E", "Group F", "Group G", "Group H", "Group I", "Group J"];

// ─── Status helpers ───────────────────────────────────────────────────────────

const statusConfig: Record<TopicStatus, { color: string; bg: string; dot: string }> = {
  "待分配": { color: "text-amber-700", bg: "bg-amber-50 border border-amber-200", dot: "bg-amber-400" },
  "未开始": { color: "text-gray-600", bg: "bg-gray-100 border border-gray-200", dot: "bg-gray-400" },
  "进行中": { color: "text-blue-700", bg: "bg-blue-50 border border-blue-200", dot: "bg-blue-500" },
  "已完成": { color: "text-emerald-700", bg: "bg-emerald-50 border border-emerald-200", dot: "bg-emerald-500" },
  "超时":   { color: "text-red-700", bg: "bg-red-50 border border-red-200", dot: "bg-red-500" },
};

const taskBgColor: Record<string, string> = {
  "进行中": "bg-blue-500",
  "超时":   "bg-red-500",
  "已完成": "bg-gray-400",
  "未开始": "bg-gray-600",
  "自定义": "bg-amber-400",
};

function StatusBadge({ status }: { status: TopicStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${cfg.bg} ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

function ResourceTypeBadge({ type }: { type: ResourceType }) {
  const colors: Record<ResourceType, string> = {
    "Themepack": "bg-violet-50 text-violet-700 border border-violet-200",
    "Control Center": "bg-cyan-50 text-cyan-700 border border-cyan-200",
    "Supertheme": "bg-orange-50 text-orange-700 border border-orange-200",
    "Keyboard": "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[type]}`}>
      {type}
    </span>
  );
}

function SelectField<T extends string>({
  value,
  placeholder,
  options,
  onChange,
  className = "",
}: {
  value: T | "";
  placeholder: string;
  options: readonly T[];
  onChange: (value: T | "") => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedLabel = value || placeholder;

  return (
    <div className={`relative z-20 ${className}`} onBlur={(e) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
    }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`w-full min-w-[128px] border rounded-lg pl-3 pr-8 py-1.5 text-xs text-left shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 ${
          value
            ? "bg-accent text-accent-foreground border-primary font-medium"
            : "bg-card text-muted-foreground border-border hover:border-primary/30"
        }`}>
        <span className="block truncate">{selectedLabel}</span>
        <ChevronDown size={12} className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 min-w-full rounded-xl border border-border bg-card shadow-[0_12px_32px_rgba(15,23,42,0.14)] p-1.5">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { onChange(""); setOpen(false); }}
            className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors ${
              value === "" ? "bg-accent text-primary font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}>
            {placeholder}
          </button>
          {options.map(option => (
            <button
              key={option}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onChange(option); setOpen(false); }}
              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors whitespace-nowrap ${
                value === option ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-muted"
              }`}>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: Page; labelZh: string; labelEn: string; icon: React.ReactNode }[] = [
  { id: "topics",   labelZh: "需求看板", labelEn: "Board", icon: <LayoutGrid size={18} /> },
  { id: "create",   labelZh: "创建Topic", labelEn: "Create", icon: <Plus size={18} /> },
  { id: "schedule", labelZh: "设计师排期", labelEn: "Schedule", icon: <Calendar size={18} /> },
  { id: "users",    labelZh: "用户管理", labelEn: "Users", icon: <Users size={18} /> },
  { id: "mywork",   labelZh: "My Work", labelEn: "My Work", icon: <UserCheck size={18} /> },
];

const RESOURCE_NAV_META: Record<ResourceType, { icon: React.ReactNode; className: string }> = {
  "Themepack": { icon: <Palette size={17} />, className: "from-violet-500 to-fuchsia-500" },
  "Control Center": { icon: <Monitor size={17} />, className: "from-cyan-500 to-blue-500" },
  "Supertheme": { icon: <Sparkles size={17} />, className: "from-orange-500 to-amber-500" },
  "Keyboard": { icon: <Keyboard size={17} />, className: "from-pink-500 to-rose-500" },
};

function Sidebar({
  page,
  setPage,
  currentUser,
  activeWorkType,
  workCounts,
  onSelectWorkType,
  onLogout,
}: {
  page: Page;
  setPage: (p: Page) => void;
  currentUser: LoggedInUser;
  activeWorkType: ResourceType;
  workCounts: Record<ResourceType, number>;
  onSelectWorkType: (type: ResourceType) => void;
  onLogout: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const { language, setLanguage, text } = useLocale();
  const canOperate = currentUser.role === "运营" || currentUser.role === "管理员";
  const canDesign = currentUser.role === "设计师" || currentUser.role === "管理员";

  return (
    <aside className="w-[88px] flex-none bg-card border-r border-border flex flex-col h-screen sticky top-0 z-[1000]">
      {/* Logo */}
      <div className="flex flex-col items-center py-5 border-b border-border gap-1">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
          <LayoutGrid size={18} className="text-white" />
        </div>
        <span className="text-[10px] font-semibold text-foreground leading-tight text-center">Kika Global Studio</span>
        <span className="w-16 text-center text-[9px] text-muted-foreground leading-tight">{text("设计师平台", "Designer Platform")} V0.2</span>
      </div>

      {/* Nav — role-based */}
      <nav className="flex-1 flex flex-col items-center py-3 gap-1 w-full overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {canOperate && (
          <>
            <span className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-1">{text("运营端", "OPS")}</span>
            {NAV_ITEMS.slice(0, 4).map(item => (
              <button key={item.id} onClick={() => setPage(item.id)}
                className={`w-16 flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-center transition-all ${
                  page === item.id ? "bg-accent text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}>
                {item.icon}
                <span className="text-[10px] font-medium leading-tight">{text(item.labelZh, item.labelEn)}</span>
              </button>
            ))}
          </>
        )}
        {canDesign && (
          <>
            <span className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-1 mt-2">{text("设计端", "DESIGN")}</span>
            {RESOURCE_TYPES.map(type => (
              <button key={type} onClick={() => { onSelectWorkType(type); setPage("mywork"); }}
                className={`w-16 min-h-[68px] flex flex-col items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-center transition-all ${
                  page === "mywork" && activeWorkType === type ? "bg-accent text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}>
                <span className={`relative w-7 h-7 rounded-lg bg-gradient-to-br ${RESOURCE_NAV_META[type].className} text-white flex items-center justify-center shadow-sm`}>
                  {RESOURCE_NAV_META[type].icon}
                  {workCounts[type] > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] leading-4 font-bold shadow ring-2 ring-card">
                      {workCounts[type] > 99 ? "99+" : workCounts[type]}
                    </span>
                  )}
                </span>
                <span className="text-[9px] font-medium leading-tight min-h-[22px] flex items-center justify-center">{type}</span>
              </button>
            ))}
          </>
        )}
      </nav>

      {/* User */}
      <div className="flex flex-col items-center pb-4 pt-3 border-t border-border gap-2 relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-[11px] font-bold">
          {currentUser.avatar}
        </div>
        <div className="text-center px-1">
          <div className="text-[10px] font-semibold text-foreground truncate max-w-[72px]">{currentUser.name.split(" ")[0]}</div>
          <div className={`text-[9px] font-medium ${roleTextClass(currentUser.role)}`}>
            {currentUser.role}
          </div>
        </div>
        <button
          onClick={() => setShowMenu(v => !v)}
          className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded hover:bg-muted transition-colors ${showMenu ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
          <Settings size={11} />
        </button>

        {/* Settings menu — opens to the right of sidebar */}
        {showMenu && (
          <>
            <div className="fixed inset-0 z-[1100]" onClick={() => setShowMenu(false)} />
            <div className="fixed left-[96px] bottom-4 w-48 bg-card border border-border rounded-xl shadow-xl z-[1200] overflow-hidden">
              {/* User info */}
              <div className="px-3 py-3 border-b border-border">
                <div className="text-xs font-semibold text-foreground">{currentUser.name}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{currentUser.email}</div>
                <div className={`text-[10px] font-medium mt-1 ${roleTextClass(currentUser.role)}`}>
                  {currentUser.role}
                </div>
              </div>
              {/* Actions */}
              <div className="py-1">
                <div className="px-3 py-2 border-b border-border/70">
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground mb-2">
                    <Languages size={12} className="text-muted-foreground" />
                    {text("系统语言", "System Language")}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { value: "zh" as Language, label: "中文" },
                      { value: "en" as Language, label: "English" },
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setLanguage(option.value);
                          showToast(option.value === "zh" ? "系统语言已切换为中文" : "System language switched to English", "info");
                        }}
                        className={`rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-colors ${
                          language === option.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => { setShowMenu(false); setShowChangePw(true); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors">
                  <Lock size={12} className="text-muted-foreground" /> {text("修改密码", "Change Password")}
                </button>
                <button
                  onClick={() => { setShowMenu(false); onLogout(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut size={12} /> {text("退出登录", "Log Out")}
                </button>
              </div>
            </div>
          </>
        )}

        {showChangePw && <ChangePasswordModal onClose={() => setShowChangePw(false)} />}
      </div>
    </aside>
  );
}

// ─── Kanban column config ─────────────────────────────────────────────────────

const KANBAN_COLUMNS: {
  status: TopicStatus;
  chipBg: string; chipText: string;
  accentBar: string;
}[] = [
  { status: "待分配", chipBg: "bg-amber-100",   chipText: "text-amber-700",   accentBar: "bg-amber-400" },
  { status: "未开始", chipBg: "bg-gray-100",    chipText: "text-gray-600",    accentBar: "bg-gray-400" },
  { status: "进行中", chipBg: "bg-blue-100",    chipText: "text-blue-700",    accentBar: "bg-blue-500" },
  { status: "超时",   chipBg: "bg-red-100",     chipText: "text-red-600",     accentBar: "bg-red-500" },
  { status: "已完成", chipBg: "bg-emerald-100", chipText: "text-emerald-700", accentBar: "bg-emerald-500" },
];

// ─── Kanban Card ──────────────────────────────────────────────────────────────

function KanbanCard({ topic, onSelect }: { topic: Topic; onSelect: (t: Topic) => void }) {
  const isTimeout = topic.status === "超时";
  const isUrgent = isTimeout || topic.isDelayed || (topic.daysLeft !== null && topic.daysLeft <= 3);

  const appChips = topic.apps.slice(0, 2).map(a => a.replace("Themepack ", ""));

  return (
    <div
      onClick={() => onSelect(topic)}
      className={`relative bg-card rounded-xl cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 overflow-hidden ${
        isTimeout
          ? "shadow-[0_2px_8px_rgba(240,64,64,0.12)] ring-1 ring-red-200"
          : "shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      }`}>
      {/* Preview images */}
      {topic.images.length > 0 ? (
        <div className="flex gap-0.5 h-20 bg-muted overflow-hidden">
          {topic.images.slice(0, 3).map((imgId, i) => (
            <div
              key={i}
              className={`flex-1 overflow-hidden bg-gray-100 ${
                topic.images.length === 1 ? "rounded-none" : ""
              }`}>
              <img
                src={`https://picsum.photos/seed/${imgId}/200/160`}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {topic.images.length > 3 && (
            <div className="w-8 flex-none bg-black/40 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">+{topic.images.length - 3}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-10 bg-muted flex items-center justify-center gap-1.5">
          <ImageIcon size={12} className="text-muted-foreground/30" />
          <span className="text-[10px] text-muted-foreground/30">暂无预览图</span>
        </div>
      )}

      <div className="p-3.5 pl-4">
        {/* Status chip + urgency */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusConfig[topic.status].bg} ${statusConfig[topic.status].color}`}>
            {topic.status}
          </span>
          <div className="flex items-center gap-1.5">
            {isUrgent && (
              <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">需关注</span>
            )}
            {topic.isSynced && (
              <span className="text-[10px] font-medium text-emerald-600">已同步</span>
            )}
          </div>
        </div>

        {/* Title */}
        <p className="text-[13px] font-semibold text-foreground leading-snug mb-1.5 line-clamp-2">
          {topic.name}
        </p>

        {/* Description */}
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-2.5">
          {topic.description}
        </p>

        {/* Chips row */}
        <div className="flex flex-wrap gap-1 mb-3">
          <ResourceTypeBadge type={topic.resourceType} />
          {appChips.map((chip, i) => (
            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
              {chip}
            </span>
          ))}
          {isTimeout && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-500 font-semibold flex items-center gap-0.5">
              <AlertTriangle size={9} /> 超时
            </span>
          )}
        </div>

        {/* Operator row */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center flex-none">
            <Users size={9} className="text-orange-500" />
          </div>
          <span className="text-[11px] text-muted-foreground">{topic.operator}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-2.5" />

        {/* Bottom row: designer | date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {topic.designer ? (
              <>
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center text-white text-[9px] font-bold flex-none">
                  {topic.designer.split(" ").map(n => n[0]).join("")}
                </div>
                <span className="text-[11px] text-muted-foreground">{topic.designer}</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-dashed border-muted-foreground/30 flex-none" />
                <span className="text-[11px] text-muted-foreground/50">未分配</span>
              </>
            )}
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground font-mono">
              {topic.startDate ? `${topic.startDate.slice(5)} – ${topic.endDate?.slice(5)}` : "—"}
            </div>
            {topic.daysLeft !== null && (
              <div className={`text-[10px] font-semibold font-mono ${
                topic.daysLeft < 0 ? "text-red-500" : topic.daysLeft <= 3 ? "text-amber-500" : "text-emerald-500"
              }`}>
                {topic.daysLeft < 0 ? `逾期${Math.abs(topic.daysLeft)}天` : `余${topic.daysLeft}天`}
              </div>
            )}
          </div>
        </div>
        {topic.status !== "待分配" && topic.daysLeft !== null && (
          <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full ${topic.daysLeft < 0 ? "bg-red-500" : topic.daysLeft <= 3 ? "bg-amber-500" : "bg-emerald-500"}`}
              style={{ width: `${Math.max(12, Math.min(100, topic.daysLeft < 0 ? 100 : 100 - topic.daysLeft * 8))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({
  topic,
  onClose,
  onAssign,
  onEdit,
  onRecall,
  onDelete,
  onStageChange,
}: {
  topic: Topic;
  onClose: () => void;
  onAssign: (t: Topic) => void;
  onEdit: (t: Topic) => void;
  onRecall: (t: Topic) => void;
  onDelete: (t: Topic) => void;
  onStageChange: (topic: Topic, stage: ProductionStage) => void;
}) {
  const col = KANBAN_COLUMNS.find(c => c.status === topic.status)!;
  return (
    <div className="w-72 flex-none bg-card border-l border-border flex flex-col h-full overflow-hidden">
      {/* Panel header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between flex-none">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${col.accentBar}`} />
          <span className="text-xs font-semibold text-muted-foreground">{topic.status}</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {/* Cover image */}
        {topic.images.length > 0 && (
          <div className="h-36 bg-gray-100 overflow-hidden">
            <img
              src={`https://picsum.photos/seed/${topic.images[0]}/400/288`}
              alt={topic.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-4">
          {/* ID + status */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">#{topic.id}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusConfig[topic.status].bg} ${statusConfig[topic.status].color}`}>
              {topic.status}
            </span>
            {topic.isDelayed && (
              <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">速</span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-sm font-semibold text-foreground leading-snug mb-2">{topic.name}</h2>
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">{topic.description}</p>

          {/* Fields */}
          <div className="space-y-3 mb-5">
            {[
              { label: "资源类型", value: <ResourceTypeBadge type={topic.resourceType} /> },
              { label: "归属 App", value: <div className="flex flex-wrap gap-1">{topic.apps.map(a => <span key={a} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{a}</span>)}</div> },
              { label: "跟进运营", value: <span className="text-xs text-foreground font-medium">{topic.operator}</span> },
              { label: "指定设计师", value: topic.designer
                ? <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center text-white text-[8px] font-bold">{topic.designer.split(" ").map(n=>n[0]).join("")}</div><span className="text-xs text-foreground">{topic.designer}</span></div>
                : <span className="text-xs text-muted-foreground">未分配</span>
              },
              { label: "任务时间", value: topic.startDate
                ? <span className={`text-[11px] font-mono ${topic.daysLeft !== null && topic.daysLeft < 0 ? "text-red-600" : "text-foreground"}`}>{topic.startDate} – {topic.endDate}</span>
                : <span className="text-xs text-muted-foreground">未设置</span>
              },
              { label: "制作进度", value: (
                <SelectField
                  value={topic.productionStage ?? defaultProductionStageForTopic(topic)}
                  placeholder="选择进度"
                  options={PRODUCTION_STAGES}
                  onChange={stage => stage && onStageChange(topic, stage)}
                  className="w-40 [&>button]:min-w-0 [&>button]:py-1 [&>button]:rounded-md" />
              ) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between gap-3">
                <span className="text-[11px] text-muted-foreground flex-none">{label}</span>
                <div className="text-right">{value}</div>
              </div>
            ))}
          </div>

          {/* Tags */}
          {topic.tags.length > 0 && (
            <div className="mb-5">
              <div className="text-[11px] text-muted-foreground mb-1.5">关联标签</div>
              <div className="flex flex-wrap gap-1">
                {topic.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Reference images */}
          {topic.images.length > 1 && (
            <div className="mb-5">
              <div className="text-[11px] text-muted-foreground mb-1.5">参考素材</div>
              <div className="flex gap-1.5 flex-wrap">
                {topic.images.slice(1).map((imgId, i) => (
                  <div key={i} className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border border-border">
                    <img src={`https://picsum.photos/seed/${imgId}/112/112`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Panel actions */}
      <div className="px-4 py-3 border-t border-border flex gap-2 flex-none">
        {topic.status === "待分配" ? (
          <button onClick={() => onAssign(topic)}
            className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
            分配任务
          </button>
        ) : (topic.status === "未开始" || topic.status === "进行中" || topic.status === "超时") ? (
          <>
            <button onClick={() => onAssign(topic)}
              className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
              重新分配
            </button>
            <button onClick={() => { onRecall(topic); onClose(); }}
              className="flex-1 py-2 bg-muted text-foreground rounded-lg text-xs font-semibold hover:bg-border transition-colors">
              撤回
            </button>
          </>
        ) : (
          <button className="flex-1 py-2 bg-muted text-muted-foreground rounded-lg text-xs font-semibold cursor-default" disabled>
            已完成
          </button>
        )}
        <button
          onClick={() => !topic.isSynced && onEdit(topic)}
          className={`px-3 py-2 rounded-lg text-xs transition-colors ${topic.isSynced ? "bg-muted text-muted-foreground/40 cursor-not-allowed" : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent"}`}
          title={topic.isSynced ? "资源已同步，不支持修改" : "编辑 Topic"}>
          <Edit2 size={13} />
        </button>
        <button
          onClick={() => { if (window.confirm("确认删除此 Topic？")) { onDelete(topic); onClose(); } }}
          className="px-3 py-2 rounded-lg text-xs bg-muted text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
          title="删除">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Topic List Page (Kanban) ─────────────────────────────────────────────────

function TopicListPage({ topics, onAssign, onNavigate, onEdit, onRecall, onDelete, onStageChange, currentUserRole }: { topics: Topic[]; onAssign: (t: Topic) => void; onNavigate: (p: Page) => void; onEdit: (t: Topic) => void; onRecall: (t: Topic) => void; onDelete: (t: Topic) => void; onStageChange: (topic: Topic, stage: ProductionStage) => void; currentUserRole: UserRole }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<ResourceType | "">("");
  const [filterApp, setFilterApp] = useState<AppType | "">("");
  const [filterDesigner, setFilterDesigner] = useState("");
  const [filterOperator, setFilterOperator] = useState("");
  const [filterStatus, setFilterStatus] = useState<TopicStatus | "">("");
  const [selected, setSelected] = useState<Topic | null>(null);
  const [completedRecentOnly, setCompletedRecentOnly] = useState(true);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const filtered = topics.filter(t => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType && t.resourceType !== filterType) return false;
    if (filterApp && !t.apps.includes(filterApp)) return false;
    if (filterDesigner && t.designer !== filterDesigner) return false;
    if (filterOperator && t.operator !== filterOperator) return false;
    if (filterStatus && t.status !== filterStatus) return false;
    if (t.status === "已完成" && completedRecentOnly && !filterStatus) {
      if (!t.endDate) return false;
      return new Date(t.endDate) >= sevenDaysAgo;
    }
    return true;
  });

  const total = topics.length;
  const inProgress = topics.filter(t => ["未开始","进行中"].includes(t.status)).length;
  const timeout = topics.filter(t => t.status === "超时").length;
  const completed = topics.filter(t => t.status === "已完成").length;
  const unassigned = topics.filter(t => !t.designer).length;
  const urgent = topics.filter(t => t.isDelayed || t.status === "超时" || (t.daysLeft !== null && t.daysLeft <= 3)).length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  const STATS: { label: string; value: number; iconBg: string; iconColor: string; icon: React.ReactNode; filterStatus: TopicStatus | "" }[] = [
    { label: "进行中", value: inProgress, iconBg: "bg-blue-100", iconColor: "text-blue-600", icon: <Clock size={16} />, filterStatus: "进行中" },
    { label: "待分配", value: topics.filter(t => t.status === "待分配").length, iconBg: "bg-amber-100", iconColor: "text-amber-600", icon: <Users size={16} />, filterStatus: "待分配" },
    { label: "已超时", value: timeout, iconBg: "bg-red-100", iconColor: "text-red-600", icon: <AlertTriangle size={16} />, filterStatus: "超时" },
    { label: "累计需求", value: total, iconBg: "bg-violet-100", iconColor: "text-violet-600", icon: <LayoutGrid size={16} />, filterStatus: "" },
  ];

  const designers = Array.from(new Set(topics.map(t => t.designer).filter(Boolean))) as string[];
  const activeFilterCount = [filterType, filterApp, filterDesigner, filterOperator, filterStatus].filter(Boolean).length + (search ? 1 : 0);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Top bar */}
      <div className="bg-card border-b border-border px-6 py-3.5 flex items-center justify-between flex-none">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-semibold text-foreground">需求看板</h1>
            {urgent > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 border border-red-100">
                <AlertTriangle size={10} /> {urgent} 个高优先级
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">按状态、负责人和素材类型追踪 Topic 从创建到交付的全过程</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="hidden xl:flex items-center gap-2 text-[11px]">
            <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">未分配 {unassigned}</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 border border-emerald-100">完成率 {completionRate}%</span>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="搜索需求..."
              className="pl-8 pr-3 py-1.5 bg-muted border-0 rounded-lg text-xs w-44 focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <button
            onClick={() => onNavigate("create")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={13} /> 新增需求
          </button>
        </div>
      </div>

      {/* Stats cards — clickable to filter */}
      <div className="px-6 pt-4 pb-3 grid grid-cols-4 gap-3 flex-none">
        {STATS.map(s => {
          const isActive = s.filterStatus !== "" && filterStatus === s.filterStatus;
          return (
            <button
              key={s.label}
              onClick={() => s.filterStatus !== "" && setFilterStatus(isActive ? "" : s.filterStatus)}
              className={`text-left rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-4 py-3.5 flex items-center justify-between gap-3 transition-all ${
                isActive
                  ? "bg-accent ring-2 ring-primary shadow-[0_2px_12px_rgba(79,110,247,0.2)]"
                  : s.filterStatus !== ""
                    ? "bg-card hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                    : "bg-card cursor-default"
              }`}>
              <div>
                <div className="text-[11px] text-muted-foreground mb-1">{s.label}</div>
                <div className={`text-2xl font-bold leading-none ${isActive ? "text-primary" : "text-foreground"}`}>{s.value}</div>
                <div className={`text-[10px] font-medium mt-0.5 h-3 ${isActive ? "text-primary" : "text-transparent"}`}>
                  已筛选
                </div>
              </div>
              <div className={`w-10 h-10 rounded-2xl ${s.iconBg} ${s.iconColor} flex items-center justify-center flex-none`}>
                {s.icon}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="px-6 pb-3 flex items-center gap-2 flex-none flex-wrap">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground mr-1">
          <Filter size={12} />
          筛选
          {activeFilterCount > 0 && <span className="text-primary">({activeFilterCount})</span>}
        </div>
        {[
          {
            label: "全部状态", value: filterStatus,
            onChange: (v: string) => setFilterStatus(v as TopicStatus | ""),
            options: ["待分配","未开始","进行中","超时","已完成"],
          },
          {
            label: "全部资源类型", value: filterType,
            onChange: (v: string) => setFilterType(v as ResourceType | ""),
            options: RESOURCE_TYPES,
          },
          {
            label: "全部归属App", value: filterApp,
            onChange: (v: string) => setFilterApp(v as AppType | ""),
            options: APP_TYPES,
          },
          {
            label: "全部跟进运营", value: filterOperator,
            onChange: (v: string) => setFilterOperator(v),
            options: OPERATORS,
          },
          {
            label: "全部设计师", value: filterDesigner,
            onChange: (v: string) => setFilterDesigner(v),
            options: designers,
          },
        ].map(({ label, value, onChange, options }) => (
          <SelectField
            key={label}
            value={value}
            placeholder={label}
            options={options}
            onChange={onChange} />
        ))}
        {(filterType || filterApp || filterDesigner || filterOperator || filterStatus) && (
          <button
            onClick={() => { setFilterType(""); setFilterApp(""); setFilterDesigner(""); setFilterOperator(""); setFilterStatus(""); }}
            className="text-[11px] text-red-500 hover:text-red-700 flex items-center gap-0.5 ml-1">
            <X size={10} /> 清除
          </button>
        )}
        <span className="ml-auto text-[11px] text-muted-foreground">显示 {filtered.length} / {total} 条</span>
      </div>

      {/* Board + detail panel */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Kanban scroll area */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-3 h-full px-6 pb-4 w-full min-w-[1120px]">
            {KANBAN_COLUMNS.map(col => {
              const cards = filtered.filter(t => t.status === col.status);
              return (
                <div key={col.status} className="flex flex-col flex-1 min-w-[220px] max-w-[320px] h-full">
                  {/* Column header */}
                  <div className="flex items-center justify-between mb-2.5 px-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${col.chipBg} ${col.chipText}`}>
                        {col.status}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground font-mono">{cards.length}</span>
                    </div>
                    {col.status === "待分配" && (
                      <button onClick={() => onNavigate("create")} className="text-muted-foreground hover:text-primary transition-colors" title="创建新需求">
                        <Plus size={14} />
                      </button>
                    )}
                    {col.status === "已完成" && (
                      <button
                        onClick={() => setCompletedRecentOnly(v => !v)}
                        className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                          completedRecentOnly
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-card text-muted-foreground border-border hover:border-emerald-400 hover:text-emerald-600"
                        }`}>
                        <Clock size={9} />
                        近7天
                      </button>
                    )}
                  </div>

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto overflow-x-visible space-y-2.5 [&::-webkit-scrollbar]:hidden px-1 -mx-1">
                    {cards.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 gap-2">
                        <div className="w-7 h-7 rounded-full bg-border/50 flex items-center justify-center">
                          <Circle size={12} className="text-muted-foreground/30" />
                        </div>
                        <span className="text-[10px] text-muted-foreground/50">暂无任务</span>
                      </div>
                    ) : cards.map(topic => (
                      <KanbanCard key={topic.id} topic={topic} onSelect={t => setSelected(selected?.id === t.id ? null : t)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <DetailPanel
            topic={selected}
            onClose={() => setSelected(null)}
            onAssign={t => { onAssign(t); setSelected(null); }}
            onEdit={t => { onEdit(t); setSelected(null); }}
            onRecall={t => { onRecall(t); setSelected(null); }}
            onDelete={t => { onDelete(t); setSelected(null); }}
            onStageChange={onStageChange} />
        )}
      </div>
    </div>
  );
}

// ─── Create Topic Page ────────────────────────────────────────────────────────

function CreateTopicPage({ initialTopic, currentUser, onSave }: { initialTopic?: Topic; currentUser: LoggedInUser; onSave?: (t: Topic) => void }) {
  const [tab, setTab] = useState<"single" | "batch">("single");
  const [resourceType, setResourceType] = useState<ResourceType | "">(initialTopic?.resourceType ?? "");
  const [apps, setApps] = useState<AppType[]>(initialTopic?.apps ?? []);
  const [operator, setOperator] = useState(initialTopic?.operator ?? (currentUser.role === "运营" || currentUser.role === "管理员" ? currentUser.name : ""));
  const [name, setName] = useState(initialTopic?.name ?? "");
  const [description, setDescription] = useState(initialTopic?.description ?? "");
  const [images, setImages] = useState<string[]>(initialTopic?.images ?? []);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTopic?.tags ?? []);
  const [showTagPanel, setShowTagPanel] = useState(false);
  const [activeL1, setActiveL1] = useState("内容标签");
  const [openTagBranches, setOpenTagBranches] = useState<Record<string, boolean>>({});
  const showTagsSection = true;

  const allApps = APP_TYPES;
  const TAG_GROUPS: Record<string, { label: string; path: string[] }[]> = {
    "内容标签": [
      ...["Minimalist","Vintage","Glitter","Cool","Cute","Neon","Aesthetic","Glow","Glitch","love","emotional","Cyberpunk","Gothic","horror"].map(label => ({ label, path: ["内容标签", "Style", label] })),
      ...["Animal Print","leopard print/豹纹","zebra/斑马纹","Cow print","Fluffy and Felt","Metal","Glass","Leather","liquid/液体","3D","expansion"].map(label => ({ label, path: ["内容标签", "Texture", label] })),
      ...["山川","山脉","山峰","丘陵","峡谷","悬崖","水域","湖泊","河流","溪流","瀑布","温泉","海滩","海岸","海岛","冰川","地貌奇观","沙漠","戈壁","草原","森林","湿地","沼泽","梯田","喀斯特地貌","丹霞地貌","火山","天际景观","星空","极光","云海","日出","日落","彩虹"].map(label => ({ label, path: ["内容标签", "Landscape/风景", label] })),
      ...["猫","狗","老鼠","鱼"].map(label => ({ label, path: ["内容标签", "Animal", label] })),
      ...["跑车","日常车","复古车","SUV/越野","摩托车","特殊车辆"].map(label => ({ label, path: ["内容标签", "Car", label] })),
      ...["花","草"].map(label => ({ label, path: ["内容标签", "Plant/植物", label] })),
      ...["男孩","女孩"].map(label => ({ label, path: ["内容标签", "people", label] })),
      { label: "religon/宗教", path: ["内容标签", "religon/宗教"] },
      ...["cake","披萨","水果fruit","草莓"].map(label => ({ label, path: ["内容标签", "food", label] })),
      ...["Spring","Summer","Autumn","Winter"].map(label => ({ label, path: ["内容标签", "Seasons", label] })),
      ...["心形","蝴蝶结"].map(label => ({ label, path: ["内容标签", "thing", label] })),
    ],
    "属性标签": [
      ...["Pink","Purple","Red","Black"].map(label => ({ label, path: ["属性标签", "主色调", label] })),
      { label: "主色调 Top 3 HEX", path: ["属性标签", "主色调", "Top 3 HEX"] },
      ...["16:9","19:9","4:3"].map(label => ({ label, path: ["属性标签", "分辨率/长宽比", label] })),
      ...["JPG","mp4","lottie"].map(label => ({ label, path: ["属性标签", "格式", label] })),
      ...["亮色","暗色"].map(label => ({ label, path: ["属性标签", "明暗度", label] })),
    ],
    "IP/节日/特殊": [
      ...["Christmas","Valentine's Day","Halloween","Easter","Thanksgiving","Labor Day"].map(label => ({ label, path: ["IP/节日/特殊", "Festivals", label] })),
      ...["Dragon Ball","One Piece","Naruto","Sailor Moon","Attack on Titan","Demon Slayer","Jujutsu Kaisen","Spy x Family","Dandadan","咒术回战","火影忍者","鬼灭之刃"].map(label => ({ label, path: ["IP/节日/特殊", "IP", "Anime", label] })),
      ...["Spider Man","Rick&Morty","Stitch","Hello Kitty"].map(label => ({ label, path: ["IP/节日/特殊", "IP", label] })),
      ...["FIFA World Cup","Olympic","nba","Nfl","wwe"].map(label => ({ label, path: ["IP/节日/特殊", "Sports Event", label] })),
      ...["Nike","Adidas","Luxury"].map(label => ({ label, path: ["IP/节日/特殊", "Brands/品牌", label] })),
      ...["Kpop","Singer","Rapper","Player","actor"].map(label => ({ label, path: ["IP/节日/特殊", "Celebrity", label] })),
      { label: "Pokémon", path: ["IP/节日/特殊", "game", "Pokémon"] },
      { label: "二创", path: ["IP/节日/特殊", "二创"] },
      { label: "版权（数据人工维护）", path: ["IP/节日/特殊", "版权（数据人工维护）"] },
    ],
  };
  const L1Tags = Object.keys(TAG_GROUPS);
  const formSteps = [
    { label: "资源类型", done: !!resourceType },
    { label: "归属 App", done: apps.length > 0 },
    { label: "跟进运营", done: !!operator },
    { label: "资源命名", done: !!name },
    ...(showTagsSection ? [{ label: "关联标签", done: selectedTags.length > 0 }] : []),
  ];
  const completedSteps = formSteps.filter(s => s.done).length;
  const isValid = !!resourceType && !!operator && !!name;

  function toggleApp(app: AppType) {
    setApps(apps.includes(app) ? apps.filter(a => a !== app) : [...apps, app]);
  }
  function toggleTag(tag: string) {
    setSelectedTags(selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag]);
  }
  function toggleTagPath(path: string[]) {
    const isSelected = path.every(tag => selectedTags.includes(tag));
    setSelectedTags(prev => isSelected
      ? prev.filter(tag => !path.includes(tag))
      : Array.from(new Set([...prev, ...path]))
    );
  }
  function toggleTagBranch(branch: string) {
    const key = `${activeL1}/${branch}`;
    setOpenTagBranches(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[1040px]">
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-foreground">创建 Topic</h1>
          <p className="text-xs text-muted-foreground mt-0.5">填写资源基础信息，完成后可直接分配给设计师</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:block text-right">
            <div className="text-[11px] text-muted-foreground mb-1">完成度 {completedSteps}/{formSteps.length}</div>
            <div className="w-28 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(completedSteps / formSteps.length) * 100}%` }} />
            </div>
          </div>
          <div className="flex gap-1 bg-background rounded-lg p-1 border border-border">
            {(["single","batch"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}>
                {t === "single" ? "单个创建" : "批量创建"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {tab === "batch" ? (
          <div className="bg-card rounded-xl border border-border p-8 flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Upload size={22} className="text-blue-600" />
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground text-sm">上传 Excel 文件</div>
              <div className="text-xs text-muted-foreground mt-1">支持批量创建，仅需填写资源类型和跟进运营</div>
            </div>
            <div className="border-2 border-dashed border-border rounded-xl w-full p-8 flex flex-col items-center gap-3 hover:border-blue-400 transition-colors cursor-pointer bg-background">
              <Download size={28} className="text-muted-foreground" />
              <div className="text-sm text-muted-foreground">点击或拖拽文件到此处</div>
              <div className="text-xs text-muted-foreground/60">.xlsx · .xls</div>
            </div>
            <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              <Download size={12} /> 下载模板文件
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[minmax(760px,1fr)_240px] gap-5 items-start">
            <div className="space-y-5 min-w-0">
            {/* Resource type */}
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 rounded bg-blue-600" />
                <span className="text-sm font-semibold text-foreground">基础信息</span>
                <span className="text-xs text-red-500 ml-1">* 必填</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">资源类型 *</label>
                  <div className="flex flex-wrap gap-2">
                    {RESOURCE_TYPES.map(t => (
                      <button key={t} onClick={() => setResourceType(t)}
                        className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${
                          resourceType === t
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-background text-muted-foreground border-border hover:border-blue-400"
                        }`}>{t}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">归属 App</label>
                  <div className="flex flex-wrap gap-2">
                    {allApps.map(app => (
                      <button key={app} onClick={() => toggleApp(app)}
                        className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${
                          apps.includes(app)
                            ? "bg-violet-600 text-white border-violet-600"
                            : "bg-background text-muted-foreground border-border hover:border-violet-400"
                        }`}>{app}</button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-[minmax(260px,1fr)_minmax(300px,1fr)] gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">跟进运营 *</label>
                    <SelectField
                      value={operator}
                      placeholder="请选择运营"
                      options={OPERATORS}
                      onChange={setOperator}
                      className="[&>button]:py-2 [&>button]:text-sm [&>button]:rounded-md" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">资源命名 *</label>
                    <input value={name} onChange={e => setName(e.target.value)}
                      placeholder="输入资源名称（创建后设计师不可修改）"
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">详细描述</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)}
                    placeholder="描述设计需求、风格参考、注意事项等..."
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 rounded bg-violet-600" />
                <span className="text-sm font-semibold text-foreground">相关图片</span>
                <span className="text-xs text-muted-foreground ml-1">支持拖拽/粘贴，格式不限</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {images.map((imgId, idx) => (
                  <div key={idx} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-border">
                    <img src={`https://picsum.photos/seed/${imgId}/160/160`}
                      alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full items-center justify-center text-white hidden group-hover:flex">
                      <X size={10} />
                    </button>
                  </div>
                ))}
                <label className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-blue-400 transition-colors flex flex-col items-center justify-center cursor-pointer bg-background gap-1">
                  <Plus size={16} className="text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">添加</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) { const seed = Math.random().toString(36).slice(2); setImages(prev => [...prev, seed]); }
                    e.target.value = "";
                  }} />
                </label>
              </div>
            </div>

            {/* Tags */}
            {showTagsSection && (
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 rounded bg-emerald-600" />
                <span className="text-sm font-semibold text-foreground">关联标签</span>
                <button onClick={() => setShowTagPanel(!showTagPanel)}
                  className="ml-auto text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  <Tag size={12} /> {showTagPanel ? "收起" : "选择标签"}
                </button>
              </div>

              {/* Selected tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {selectedTags.map(tag => (
                  <span key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs">
                    {tag}
                    <button onClick={() => toggleTag(tag)} className="hover:text-blue-900"><X size={10} /></button>
                  </span>
                ))}
                {selectedTags.length === 0 && (
                  <span className="text-xs text-muted-foreground">暂未选择标签</span>
                )}
              </div>

              {showTagPanel && (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="flex border-b border-border">
                    {L1Tags.map(l1 => (
                      <button key={l1} onClick={() => setActiveL1(l1)}
                        className={`flex-1 py-2 text-xs font-medium transition-colors ${
                          activeL1 === l1 ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600" : "text-muted-foreground hover:bg-muted/50"
                        }`}>{l1}</button>
                    ))}
                  </div>
                  <div className="p-3 bg-background max-h-72 overflow-y-auto [&::-webkit-scrollbar]:hidden space-y-3">
                    {Object.entries((TAG_GROUPS[activeL1] || []).reduce((groups, item) => {
                      const branch = item.path[1] || activeL1;
                      groups[branch] = [...(groups[branch] ?? []), item];
                      return groups;
                    }, {} as Record<string, { label: string; path: string[] }[]>)).map(([branch, items]) => (
                      <div key={branch} className="rounded-xl border border-border bg-card overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleTagBranch(branch)}
                          className="w-full flex items-center justify-between bg-muted/60 px-3 py-2 border-b border-border hover:bg-muted transition-colors">
                          <div className="flex items-center gap-2">
                            <ChevronRight size={12} className={`text-muted-foreground transition-transform ${openTagBranches[`${activeL1}/${branch}`] ? "rotate-90" : ""}`} />
                            <span className="text-xs font-semibold text-foreground">{branch}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{items.length}</span>
                        </button>
                        {openTagBranches[`${activeL1}/${branch}`] && (
                        <div className="p-2 grid grid-cols-4 gap-1.5">
                          {items.map(item => {
                            const isSelected = item.path.every(tag => selectedTags.includes(tag));
                            const childPath = item.path.slice(2, -1).join(" / ");
                            return (
                              <button key={item.path.join("/")} onClick={() => toggleTagPath(item.path)}
                                className={`px-2 py-1 rounded-md text-left border transition-all ${
                                  isSelected
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-background text-muted-foreground border-border hover:border-blue-400 hover:text-foreground"
                                }`}>
                                <div className="text-[11px] font-medium leading-tight truncate">{item.label}</div>
                                {childPath && (
                                  <div className={`text-[9px] mt-0.5 truncate ${isSelected ? "text-blue-100" : "text-muted-foreground/60"}`}>
                                    {childPath}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Actions */}
            {(() => {
              const buildTopic = (status: TopicStatus): Topic => ({
                ...(initialTopic ?? {
                  id: `t${Date.now()}`, designer: null,
                  startDate: null, endDate: null, isDelayed: false, isSynced: false, daysLeft: null, productionStage: "Draft" as ProductionStage,
                }),
                name, description, resourceType: resourceType as ResourceType,
                apps, operator, images, tags: selectedTags, status,
                productionStage: initialTopic?.productionStage ?? "Draft",
              });
              return (
            <div className="flex items-center justify-end gap-3 pb-6">
              {!isValid && (
                <span className="text-[11px] text-amber-600 mr-auto">* 请填写资源类型、跟进运营、资源名称</span>
              )}
              <button
                onClick={() => { onSave?.(buildTopic("待分配")); showToast("草稿已保存"); }}
                disabled={!isValid}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                保存草稿
              </button>
              <button
                onClick={() => { onSave?.(buildTopic(initialTopic?.status ?? "待分配")); showToast(initialTopic ? "修改已保存" : "Topic 创建成功"); }}
                disabled={!isValid}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                {initialTopic ? "保存修改" : "创建并分配"} <ArrowRight size={14} />
              </button>
            </div>
              );
            })()}
            </div>

            <aside className="sticky top-6 bg-card rounded-xl border border-border p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] min-w-0">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs font-semibold text-foreground">填写检查</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">创建前确认关键信息</div>
                </div>
                <span className="text-[11px] font-semibold text-primary">{completedSteps}/{formSteps.length}</span>
              </div>
              <div className="space-y-2.5">
                {formSteps.map(step => (
                  <div key={step.label} className="flex items-center gap-2 text-xs">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      step.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-border text-muted-foreground"
                    }`}>
                      {step.done ? <CheckCircle2 size={10} /> : <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />}
                    </span>
                    <span className={step.done ? "text-foreground" : "text-muted-foreground"}>{step.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-muted/60 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
                {isValid ? "核心必填项已完成，可以保存或进入分配流程。" : "至少需要资源类型、跟进运营和资源名称，才能保存 Topic。"}
              </div>
            </aside>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

// ─── Designer Schedule Page ───────────────────────────────────────────────────

function SchedulePage({
  designers,
  topics,
  onAssign,
  onEdit,
  onRecall,
  onDelete,
  onStageChange,
}: {
  designers: Designer[];
  topics: Topic[];
  onAssign: (t: Topic) => void;
  onEdit: (t: Topic) => void;
  onRecall: (t: Topic) => void;
  onDelete: (t: Topic) => void;
  onStageChange: (topic: Topic, stage: ProductionStage) => void;
}) {
  const [hoveredTask, setHoveredTask] = useState<{ designer: Designer; task: Designer["tasks"][0]; x: number; y: number } | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedDesignerSchedule, setSelectedDesignerSchedule] = useState<Designer | null>(null);
  const [isTodayInView, setIsTodayInView] = useState(true);
  const [designerSearch, setDesignerSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const scheduleScrollRef = useRef<HTMLDivElement>(null);
  const now = new Date();
  const timelineStartOffset = -180;
  const totalDayCount = 720;
  const dayWidth = 56;
  const halfWidth = dayWidth / 2;
  const todayLeft = Math.abs(timelineStartOffset) * dayWidth;
  const days = Array.from({ length: totalDayCount }, (_, i) => {
    const date = new Date(todayStart);
    const offset = timelineStartOffset + i;
    date.setDate(todayStart.getDate() + offset);
    return {
      date,
      offset,
      day: date.getDate(),
      month: date.getMonth() + 1,
      weekday: ["日","一","二","三","四","五","六"][date.getDay()],
      isToday: offset === 0,
    };
  });
  const monthLabel = `今日起 · 可横向预览前后日期`;
  const taskCount = designers.reduce((sum, d) => sum + d.tasks.length, 0);
  const overloadedDesigners = designers.filter(d => d.tasks.reduce((sum, t) => sum + (t.end - t.start + 1), 0) > 14).length;
  const timeoutTasks = designers.reduce((sum, d) => sum + d.tasks.filter(t => t.status === "超时").length, 0);
  const totalOccupiedDays = designers.reduce((sum, d) => sum + d.tasks.reduce((inner, t) => inner + (t.end - t.start + 1), 0), 0);
  const avgLoad = designers.length ? Math.round(totalOccupiedDays / designers.length) : 0;
  const groups = Array.from(new Set(designers.map(d => d.group).filter(Boolean)));
  const visibleDesigners = designers.filter(d => {
    if (designerSearch && !d.name.toLowerCase().includes(designerSearch.toLowerCase())) return false;
    if (filterGroup && d.group !== filterGroup) return false;
    return true;
  });
  const legendItems = [
    { color: "bg-blue-500", label: "进行中" },
    { color: "bg-gray-600", label: "未开始" },
    { color: "bg-red-500", label: "超时" },
    { color: "bg-gray-400", label: "已完成" },
    { color: "bg-amber-400", label: "自定义占用" },
  ];
  const getTaskLane = (tasks: Designer["tasks"], task: Designer["tasks"][0]) => {
    const sorted = [...tasks].sort((a, b) => a.start - b.start || a.end - b.end || a.title.localeCompare(b.title));
    const laneEnd = [-Infinity, -Infinity];
    const lanes = new Map<Designer["tasks"][0], number>();
    sorted.forEach(item => {
      const lane = item.start > laneEnd[0] ? 0 : item.start > laneEnd[1] ? 1 : 1;
      lanes.set(item, lane);
      laneEnd[lane] = Math.max(laneEnd[lane], item.end);
    });
    return lanes.get(task) ?? 0;
  };
  const findTopicForTask = (designer: Designer, task: Designer["tasks"][0]) => (
    topics.find(t => t.name === task.title && t.designer === designer.name) ??
    topics.find(t => t.name === task.title)
  );
  const formatTaskRange = (task: Designer["tasks"][0]) => (
    task.startDate && task.endDate
      ? `${task.startDate.slice(5)} – ${task.endDate.slice(5)}`
      : `${task.start} – ${task.end}`
  );
  const updateTodayVisibility = useCallback(() => {
    const el = scheduleScrollRef.current;
    if (!el) return;
    const frozenDesignerWidth = 176;
    const visibleStart = el.scrollLeft;
    const visibleEnd = el.scrollLeft + Math.max(0, el.clientWidth - frozenDesignerWidth);
    setIsTodayInView(todayLeft >= visibleStart && todayLeft + dayWidth <= visibleEnd);
  }, [dayWidth, todayLeft]);
  useEffect(() => {
    if (scheduleScrollRef.current) {
      scheduleScrollRef.current.scrollLeft = todayLeft;
      updateTodayVisibility();
    }
  }, [todayLeft, updateTodayVisibility]);

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden">
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-foreground">设计师排期</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{monthLabel} · 查看和管理所有设计师的任务时间安排</p>
        </div>
        <div className="grid grid-cols-[144px_152px_72px_72px] items-center gap-3 text-xs flex-none">
          <div className="relative min-w-0">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={designerSearch}
              onChange={e => setDesignerSearch(e.target.value)}
              placeholder="搜索设计师"
              className="h-8 w-full pl-8 pr-3 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <SelectField
            value={filterGroup}
            placeholder="全部分组"
            options={groups}
            onChange={setFilterGroup}
            className="w-full min-w-0 [&>button]:h-8 [&>button]:min-w-0 [&>button]:bg-background [&>button]:py-0" />
          <button onClick={() => {
            if (scheduleScrollRef.current) {
              scheduleScrollRef.current.scrollLeft = todayLeft;
              updateTodayVisibility();
            }
          }}
            className={`h-8 w-[72px] flex items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors ${
              isTodayInView
                ? "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                : "bg-primary text-primary-foreground shadow-sm"
            }`}>
            <Calendar size={12} />
            今天
          </button>
          <div className="relative group">
            <button
              className="h-8 w-[72px] flex items-center justify-center gap-1.5 rounded-lg bg-background px-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Info size={12} />
              图例
            </button>
              <div className="pointer-events-none absolute right-0 top-full mt-2 w-44 rounded-xl border border-border bg-card p-3 shadow-xl z-50 opacity-0 translate-y-1 transition-all group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {legendItems.map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                      <span className="text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
          </div>
        </div>
      </div>

      <div className="bg-background border-b border-border px-6 py-3 grid grid-cols-5 gap-3 flex-none">
        {[
          { label: "任务", value: taskCount, tone: "bg-muted text-muted-foreground" },
          { label: "设计师", value: designers.length, tone: "bg-blue-50 text-blue-700 border-blue-100" },
          { label: "平均占用", value: `${avgLoad}天`, tone: "bg-violet-50 text-violet-700 border-violet-100" },
          { label: "超时", value: timeoutTasks, tone: timeoutTasks ? "bg-red-50 text-red-600 border-red-100" : "bg-emerald-50 text-emerald-700 border-emerald-100" },
          { label: "高负载", value: overloadedDesigners, tone: overloadedDesigners ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-blue-50 text-blue-700 border-blue-100" },
        ].map(item => (
          <div key={item.label} className={`rounded-xl border px-3 py-2 flex items-center justify-between shadow-sm ${item.tone}`}>
            <span className="text-[11px] font-medium opacity-80">{item.label}</span>
            <span className="text-base font-bold leading-none">{item.value}</span>
          </div>
        ))}
      </div>

      <div ref={scheduleScrollRef} onScroll={updateTodayVisibility} className="flex-1 overflow-auto">
        <div className="min-w-max">
          {/* Day header */}
          <div className="flex sticky top-0 z-30 bg-background border-b border-border shadow-sm">
            <div className="sticky left-0 z-40 w-44 flex-none px-4 py-2 text-xs font-semibold text-muted-foreground border-r border-border bg-background">设计师</div>
            <div className="flex">
              {days.map(d => (
                <div key={d.offset} style={{ width: dayWidth }}
                  className={`flex-none text-center py-2 text-[11px] border-r border-border ${
                    d.isToday ? "bg-blue-50 text-blue-700 font-bold border-l-2 border-l-blue-500" :
                    [0,6].includes(d.date.getDay()) ? "bg-muted/40 text-muted-foreground" : "text-muted-foreground"
                  }`}>
                  <div>{d.isToday ? "今日" : d.day}</div>
                  <div className="text-[9px] text-muted-foreground/60">{d.month}/{d.day} · {d.weekday}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Designer rows */}
          {visibleDesigners.map((designer, di) => (
            <div key={designer.id} className={`flex border-b border-border ${di % 2 === 0 ? "bg-card" : "bg-background"}`}>
              <button
                onClick={() => setSelectedDesignerSchedule(designer)}
                title="点击设计师查看单人排期"
                className={`sticky left-0 z-10 w-44 flex-none px-4 py-3 border-r border-border flex items-center justify-center text-left transition-colors hover:bg-accent ${di % 2 === 0 ? "bg-card" : "bg-background"}`}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold flex-none">
                    {designer.avatar}
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-foreground">{designer.name}</div>
                    <div className="text-[10px] text-muted-foreground">{designer.group}</div>
                  </div>
                </div>
              </button>

              {/* Timeline */}
              <div className="relative flex" style={{ height: 76 }}>
                {days.map(d => (
                  <div key={d.offset} style={{ width: dayWidth }}
                    className={`flex flex-none h-full border-r border-border/40 ${
                      d.isToday ? "bg-blue-50/50 border-l-2 border-l-blue-500" :
                      [0,6].includes(d.date.getDay()) ? "bg-muted/30" : ""
                    }`} />
                ))}
                {days.map(d => (
                  <div key={`half-${d.offset}`} className="absolute top-0 bottom-0 border-l border-border/20 pointer-events-none"
                    style={{ left: (d.offset - timelineStartOffset) * dayWidth + halfWidth }} />
                ))}
                {/* Task bars */}
                {designer.tasks.map((task, ti) => {
                  if (task.end < timelineStartOffset || task.start > timelineStartOffset + totalDayCount - 1) return null;
                  const visibleStart = Math.max(task.start, timelineStartOffset);
                  const visibleEnd = Math.min(task.end, timelineStartOffset + totalDayCount - 1);
                  const left = (visibleStart - timelineStartOffset) * dayWidth;
                  const width = (visibleEnd - visibleStart + 1) * dayWidth - 4;
                  const lane = getTaskLane(designer.tasks, task);
                  const color = taskBgColor[task.status] || "bg-gray-500";
                  const topic = findTopicForTask(designer, task);
                  return (
                    <div key={ti}
                      className={`absolute h-6 rounded-md ${color} text-white text-[10px] font-medium flex items-center px-2 cursor-pointer shadow-sm hover:brightness-110 transition-all overflow-hidden`}
                      style={{ left: left + 2, width, top: 10 + lane * 30 }}
                      onClick={() => topic && setSelectedTopic(topic)}
                      onMouseEnter={(e) => setHoveredTask({ designer, task, x: e.clientX, y: e.clientY })}
                      onMouseLeave={() => setHoveredTask(null)}>
                      <span className="truncate">{task.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredTask && (
        <div
          className="fixed z-50 bg-card border border-border rounded-lg shadow-xl p-3 w-56 pointer-events-none"
          style={{ left: hoveredTask.x + 12, top: hoveredTask.y - 60 }}>
          <div className="text-xs font-semibold text-foreground mb-2">{hoveredTask.task.title}</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">资源类型</span>
              <ResourceTypeBadge type={hoveredTask.task.type} />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">设计师</span>
              <span className="text-foreground font-medium">{hoveredTask.designer.name}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">任务时间</span>
              <span className="font-mono text-foreground">{formatTaskRange(hoveredTask.task)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">状态</span>
              <StatusBadge status={hoveredTask.task.status} />
            </div>
          </div>
        </div>
      )}
    </div>
      {selectedTopic && (
        <DetailPanel
          topic={selectedTopic}
          onClose={() => setSelectedTopic(null)}
          onAssign={t => { onAssign(t); setSelectedTopic(null); }}
          onEdit={t => { onEdit(t); setSelectedTopic(null); }}
          onRecall={t => { onRecall(t); setSelectedTopic(null); }}
          onDelete={t => { onDelete(t); setSelectedTopic(null); }}
          onStageChange={onStageChange} />
      )}
      {selectedDesignerSchedule && (
        <DesignerScheduleModal
          designer={selectedDesignerSchedule}
          onClose={() => setSelectedDesignerSchedule(null)} />
      )}
    </div>
  );
}

function DesignerScheduleModal({ designer, onClose }: { designer: Designer; onClose: () => void }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth() + monthOffset, 1);
  const monthEnd = new Date(todayStart.getFullYear(), todayStart.getMonth() + monthOffset + 1, 0);
  const monthStartOffset = diffDaysFromToday(`${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, "0")}-${String(monthStart.getDate()).padStart(2, "0")}`) ?? 0;
  const dayCount = monthEnd.getDate();
  const dayWidth = 34;
  const rowHeight = 36;
  const days = Array.from({ length: dayCount }, (_, i) => {
    const date = new Date(monthStart);
    date.setDate(i + 1);
    const offset = monthStartOffset + i;
    return {
      offset,
      date,
      day: i + 1,
      weekday: ["日","一","二","三","四","五","六"][date.getDay()],
      isToday: offset === 0,
      isWeekend: [0, 6].includes(date.getDay()),
    };
  });
  const visibleTasks = designer.tasks
    .filter(task => task.end >= monthStartOffset && task.start <= monthStartOffset + dayCount - 1)
    .sort((a, b) => a.start - b.start || a.end - b.end || a.title.localeCompare(b.title));
  const monthLabel = `${monthStart.getFullYear()} / ${String(monthStart.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-[1300] bg-black/45 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-5xl max-h-[86vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-blue-500 text-white flex items-center justify-center text-sm font-bold">
              {designer.avatar}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">{designer.name} · 单人排期</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{designer.group || "未分组"} · 按日期查看该设计师当前排期</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMonthOffset(v => v - 1)}
              className="w-8 h-8 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors">
              <ChevronLeft size={15} />
            </button>
            <div className="min-w-[94px] text-center text-sm font-semibold text-foreground">{monthLabel}</div>
            <button
              onClick={() => setMonthOffset(v => v + 1)}
              className="w-8 h-8 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors">
              <ChevronRight size={15} />
            </button>
            <button
              onClick={() => setMonthOffset(0)}
              className="px-3 h-8 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors">
              今天
            </button>
            <button onClick={onClose} className="ml-1 text-muted-foreground hover:text-foreground transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-5 bg-background">
          <div className="min-w-max rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex sticky top-0 z-10 border-b border-border bg-card">
              <div className="w-44 flex-none px-3 py-2 text-xs font-semibold text-muted-foreground border-r border-border">任务</div>
              <div className="flex">
                {days.map(day => (
                  <div key={day.offset} style={{ width: dayWidth }}
                    className={`flex-none border-r border-border/60 px-1 py-2 text-center ${
                      day.isToday ? "bg-blue-50 text-primary font-bold" : day.isWeekend ? "bg-muted/50 text-muted-foreground" : "text-muted-foreground"
                    }`}>
                    <div className="text-[11px] leading-none">{day.isToday ? "今" : day.day}</div>
                    <div className="mt-1 text-[9px] opacity-70">{day.weekday}</div>
                  </div>
                ))}
              </div>
            </div>

            {visibleTasks.length === 0 ? (
              <div className="flex items-center justify-center h-28 text-xs text-muted-foreground">本月暂无任务</div>
            ) : visibleTasks.map(task => {
              const visibleStart = Math.max(task.start, monthStartOffset);
              const visibleEnd = Math.min(task.end, monthStartOffset + dayCount - 1);
              const left = (visibleStart - monthStartOffset) * dayWidth;
              const width = Math.max(dayWidth - 6, (visibleEnd - visibleStart + 1) * dayWidth - 6);
              return (
                <div key={task.title} className="flex border-b border-border last:border-b-0">
                  <div className="w-44 flex-none px-3 py-2 border-r border-border bg-card">
                    <div className="text-xs font-semibold text-foreground truncate">{task.title}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <ResourceTypeBadge type={task.type} />
                      <StatusBadge status={task.status} />
                    </div>
                  </div>
                  <div className="relative flex" style={{ height: rowHeight, width: dayCount * dayWidth }}>
                    {days.map(day => (
                      <div key={day.offset} style={{ width: dayWidth }}
                        className={`h-full flex-none border-r border-border/40 ${
                          day.isToday ? "bg-blue-50/60" : day.isWeekend ? "bg-muted/30" : ""
                        }`} />
                    ))}
                    <div
                      className={`absolute top-2 h-5 rounded-md ${taskBgColor[task.status] || "bg-gray-500"} text-white text-[10px] font-semibold flex items-center px-2 shadow-sm overflow-hidden`}
                      style={{ left: left + 3, width }}>
                      <span className="truncate">{task.title}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Add User Modal ───────────────────────────────────────────────────────────

function AddUserModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (u: { id: string; name: string; email: string; isOperator: boolean; isDesigner: boolean; isAdmin: boolean; group: string }) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"operator" | "designer" | "admin" | "">("");
  const [group, setGroup] = useState("");

  function handleSubmit() {
    if (!name || !email || !role) return;
    onAdd({
      id: `u${Date.now()}`,
      name, email,
      isOperator: role === "operator" || role === "admin",
      isDesigner: role === "designer" || role === "admin",
      isAdmin: role === "admin",
      group: role === "designer" || role === "admin" ? group : "",
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">新增用户</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={15} /></button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">用户名 *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="输入用户名"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">邮箱 *</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="user@company.com" type="email"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">职位 *</label>
            <div className="grid grid-cols-3 gap-2">
              {[{ value: "operator", label: "运营" }, { value: "designer", label: "设计师" }, { value: "admin", label: "管理员" }].map(opt => (
                <button key={opt.value} onClick={() => setRole(opt.value as "operator" | "designer" | "admin")}
                  className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                    role === opt.value
                      ? "bg-primary text-white border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary/40"
                  }`}>{opt.label}</button>
              ))}
            </div>
          </div>
          {(role === "designer" || role === "admin") && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">设计师分组</label>
              <SelectField
                value={group}
                placeholder="未分组"
                options={DESIGNER_GROUPS}
                onChange={setGroup}
                className="[&>button]:py-2 [&>button]:text-sm" />
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-border flex gap-2">
          <button onClick={onClose}
            className="flex-1 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors">
            取消
          </button>
          <button onClick={handleSubmit}
            disabled={!name || !email || !role}
            className="flex-1 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            确认新增
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── User Management Page ─────────────────────────────────────────────────────

const MOCK_USERS = [
  { id: "u0", name: "Admin Li", email: "admin@company.com", isOperator: true, isDesigner: true, isAdmin: true, group: "Admin" },
  { id: "u1", name: "Alice Chen", email: "alice@company.com", isOperator: true, isDesigner: false, isAdmin: false, group: "" },
  { id: "u2", name: "Ben Wang", email: "ben@company.com", isOperator: true, isDesigner: false, isAdmin: false, group: "" },
  { id: "u3", name: "Carol Li", email: "carol@company.com", isOperator: true, isDesigner: false, isAdmin: false, group: "" },
  { id: "u11", name: "Doris Xu", email: "doris@company.com", isOperator: true, isDesigner: false, isAdmin: false, group: "" },
  { id: "u12", name: "Evan Zhou", email: "evan@company.com", isOperator: true, isDesigner: false, isAdmin: false, group: "" },
  { id: "u13", name: "Fiona Gao", email: "fiona@company.com", isOperator: true, isDesigner: false, isAdmin: false, group: "" },
  { id: "u4", name: "Ryan Liu", email: "ryan@company.com", isOperator: false, isDesigner: true, isAdmin: false, group: "Group A" },
  { id: "u5", name: "Mia Zhang", email: "mia@company.com", isOperator: false, isDesigner: true, isAdmin: false, group: "Group B" },
  { id: "u6", name: "James Park", email: "james@company.com", isOperator: false, isDesigner: true, isAdmin: false, group: "Group A" },
  { id: "u7", name: "Sara Kim", email: "sara@company.com", isOperator: false, isDesigner: true, isAdmin: false, group: "Group C" },
  { id: "u8", name: "Tom Chen", email: "tom@company.com", isOperator: false, isDesigner: true, isAdmin: false, group: "Group B" },
  { id: "u9", name: "Lily Wu", email: "lily@company.com", isOperator: false, isDesigner: true, isAdmin: false, group: "Group C" },
  { id: "u14", name: "Noah Smith", email: "noah@company.com", isOperator: false, isDesigner: true, isAdmin: false, group: "Group D" },
  { id: "u15", name: "Ava Patel", email: "ava@company.com", isOperator: false, isDesigner: true, isAdmin: false, group: "Group E" },
  { id: "u16", name: "Leo Martin", email: "leo@company.com", isOperator: false, isDesigner: true, isAdmin: false, group: "Group A" },
  { id: "u17", name: "Yuki Tan", email: "yuki@company.com", isOperator: false, isDesigner: true, isAdmin: false, group: "Group F" },
  { id: "u18", name: "Olivia Brown", email: "olivia@company.com", isOperator: true, isDesigner: false, isAdmin: false, group: "" },
  { id: "u19", name: "Ethan Brooks", email: "ethan@company.com", isOperator: true, isDesigner: false, isAdmin: false, group: "" },
  { id: "u20", name: "Nina Rossi", email: "nina@company.com", isOperator: false, isDesigner: true, isAdmin: false, group: "Group G" },
  { id: "u21", name: "Kai Mueller", email: "kai@company.com", isOperator: false, isDesigner: true, isAdmin: false, group: "Group H" },
  { id: "u22", name: "Grace Hall", email: "grace@company.com", isOperator: false, isDesigner: true, isAdmin: false, group: "Group I" },
  { id: "u23", name: "Hana Ito", email: "hana@company.com", isOperator: false, isDesigner: true, isAdmin: false, group: "Group J" },
  { id: "u24", name: "Mark Stone", email: "mark@company.com", isOperator: true, isDesigner: true, isAdmin: false, group: "Group G" },
  { id: "u25", name: "Ivy Chen", email: "ivy@company.com", isOperator: false, isDesigner: false, isAdmin: false, group: "" },
  { id: "u10", name: "David Lee", email: "david@company.com", isOperator: false, isDesigner: false, isAdmin: false, group: "" },
];

function UsersPage({ users, setUsers, currentUser }: { users: typeof MOCK_USERS; setUsers: React.Dispatch<React.SetStateAction<typeof MOCK_USERS>>; currentUser: LoggedInUser }) {
  const [saved, setSaved] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const canManageIdentity = currentUser.role === "管理员";

  function toggle(id: string, field: "isOperator" | "isDesigner" | "isAdmin") {
    if (!canManageIdentity) {
      showToast("仅管理员账号可以修改人员身份", "error");
      return;
    }
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      if (field === "isAdmin") {
        const nextAdmin = !u.isAdmin;
        return { ...u, isAdmin: nextAdmin, isOperator: nextAdmin ? true : u.isOperator, isDesigner: nextAdmin ? true : u.isDesigner };
      }
      if (u.isAdmin) {
        showToast("管理员账号默认拥有运营和设计师权限", "info");
        return u;
      }
      return { ...u, [field]: !u[field] };
    }));
    setSaved(false);
  }

  function setGroup(id: string, group: string) {
    if (!canManageIdentity) {
      showToast("仅管理员账号可以修改人员身份", "error");
      return;
    }
    setUsers(prev => prev.map(u => u.id === id ? { ...u, group } : u));
    setSaved(false);
  }

  function handleSave() {
    if (!canManageIdentity) {
      showToast("仅管理员账号可以保存人员身份设置", "error");
      return;
    }
    setSaved(true);
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-foreground">用户管理</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {canManageIdentity ? "管理平台管理员、运营和设计师角色，设置设计师分组" : "当前为只读模式，仅管理员可修改人员身份"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canManageIdentity && (
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              <Plus size={14} /> 新增用户
            </button>
          )}
          <button onClick={handleSave}
            disabled={!canManageIdentity}
            className="px-4 py-2 bg-card text-foreground border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {saved ? "已保存 ✓" : "保存设置"}
          </button>
        </div>
      </div>
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onAdd={u => { setUsers(prev => [...prev, u]); setSaved(false); }} />
      )}

      <div className="flex-1 overflow-auto relative">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-background sticky top-0 z-40 shadow-sm">
            <tr className="border-b border-border">
              {["用户", "邮箱", "管理员", "运营", "设计师", "设计师分组"].map(h => (
                <th key={h} className="bg-background text-left text-xs font-semibold text-muted-foreground px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="relative z-0">
            {users.map((user, i) => (
              <tr key={user.id} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-background"} hover:bg-muted/30 transition-colors`}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-300 to-blue-400 flex items-center justify-center text-white text-xs font-semibold flex-none">
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="text-xs font-medium text-foreground">{user.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground font-mono">{user.email}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggle(user.id, "isAdmin")}
                    disabled={!canManageIdentity}
                    className={`w-9 h-5 rounded-full transition-colors relative disabled:opacity-45 disabled:cursor-not-allowed ${user.isAdmin ? "bg-emerald-600" : "bg-gray-200"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${user.isAdmin ? "left-[18px]" : "left-0.5"}`} />
                  </button>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => toggle(user.id, "isOperator")}
                    disabled={!canManageIdentity}
                    className={`w-9 h-5 rounded-full transition-colors relative disabled:opacity-45 disabled:cursor-not-allowed ${user.isOperator ? "bg-blue-600" : "bg-gray-200"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${user.isOperator ? "left-[18px]" : "left-0.5"}`} />
                  </button>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => toggle(user.id, "isDesigner")}
                    disabled={!canManageIdentity}
                    className={`w-9 h-5 rounded-full transition-colors relative disabled:opacity-45 disabled:cursor-not-allowed ${user.isDesigner ? "bg-blue-600" : "bg-gray-200"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${user.isDesigner ? "left-[18px]" : "left-0.5"}`} />
                  </button>
                </td>
                <td className="px-5 py-3">
                  {user.isDesigner ? (
                    <SelectField
                      value={user.group}
                      placeholder="未分组"
                      options={DESIGNER_GROUPS}
                      onChange={group => setGroup(user.id, group)}
                      className={`w-28 [&>button]:min-w-0 [&>button]:py-1 [&>button]:rounded-md ${canManageIdentity ? "" : "pointer-events-none opacity-60"}`} />
                  ) : (
                    <span className="text-xs text-muted-foreground/50">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── My Work Page (Designer View) ────────────────────────────────────────────

function MyWorkPage({ topics, currentUser, activeType }: { topics: Topic[]; currentUser: LoggedInUser; activeType: ResourceType; onTypeChange: (type: ResourceType) => void }) {
  const [activeStage, setActiveStage] = useState<ProductionStage>("Draft");
  const { text } = useLocale();
  useEffect(() => {
    setActiveStage("Draft");
  }, [activeType]);

  const myTasks = topics.filter(t => t.designer === currentUser.name);
  const typeTasks = myTasks.filter(t => t.resourceType === activeType);
  const stageTasks = typeTasks.filter(t => (t.productionStage ?? defaultProductionStageForTopic(t)) === activeStage);
  const timeoutTasks = typeTasks.filter(t => t.status === "超时");
  const normalTasks = stageTasks.filter(t => t.status !== "超时");
  const timeoutStageTasks = stageTasks.filter(t => t.status === "超时");
  const sorted = [...timeoutStageTasks, ...normalTasks];
  const activeTypeTotal = typeTasks.length;
  const stageCounts = Object.fromEntries(PRODUCTION_STAGES.map(stage => [
    stage,
    typeTasks.filter(t => (t.productionStage ?? defaultProductionStageForTopic(t)) === stage).length,
  ])) as Record<ProductionStage, number>;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-foreground">{activeType}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{currentUser.name} · {text("按制作流程查看被分配的任务", "View assigned tasks by production flow")}</p>
          </div>
          <div className="flex items-center gap-2">
            {timeoutTasks.length > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 border border-red-200 rounded-md">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-red-700 font-medium">{timeoutTasks.length} {text("超时", "Overdue")}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 border border-blue-200 rounded-md">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs text-blue-700 font-medium">{activeTypeTotal} {text("任务", "Tasks")}</span>
            </div>
          </div>
        </div>

        {/* Production flow tabs */}
        <div className="flex gap-0 mt-4 border-b border-border -mb-px overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {PRODUCTION_STAGES.map(stage => {
            const count = stageCounts[stage] ?? 0;
            return (
              <button key={stage} onClick={() => setActiveStage(stage)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
                  activeStage === stage
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}>
                {stage}
                <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${activeStage === stage ? "bg-blue-50 text-blue-700" : "bg-muted text-muted-foreground"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task cards */}
      <div className="flex-1 overflow-auto p-6">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
              <UserCheck size={28} className="text-muted-foreground" />
            </div>
            <div className="text-sm font-medium text-foreground">暂无任务</div>
            <div className="text-xs text-muted-foreground max-w-[280px]">
              当前 {activeType} / {activeStage} 阶段暂无任务。
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {sorted.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Topic }) {
  const isTimeout = task.status === "超时";
  const [showSnapshot, setShowSnapshot] = useState(false);

  return (
    <div className={`relative bg-card rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow min-w-0 max-w-[420px] ${
      isTimeout ? "border-red-300 ring-1 ring-red-200" : "border-border"
    }`}>
      {isTimeout && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-[10px] font-bold text-center py-0.5 tracking-wider uppercase">
          ⚠ Timeout
        </div>
      )}

      {/* Image */}
      {task.images.length > 0 && (
        <div className={`relative h-28 bg-gray-100 ${isTimeout ? "mt-5" : ""}`}>
          <img
            src={`https://picsum.photos/seed/${task.images[0]}/400/224`}
            alt={task.name}
            className="w-full h-full object-cover" />
          <div className={`absolute inset-0 ${isTimeout ? "bg-red-900/20" : "bg-black/5"}`} />
        </div>
      )}

      <div className={`p-4 ${!task.images.length && isTimeout ? "mt-5" : ""}`}>
        {/* Type + Status */}
        <div className="flex items-center justify-between mb-2">
          <ResourceTypeBadge type={task.resourceType} />
          <StatusBadge status={task.status} />
        </div>
        <div className="mb-2 inline-flex max-w-full items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
          <Clock size={10} /> {task.productionStage ?? defaultProductionStageForTopic(task)}
        </div>

        {/* Name */}
        <div className="font-semibold text-sm text-foreground mb-1 leading-snug">{task.name}</div>
        <div className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</div>

        {/* Meta */}
        <div className={`space-y-1.5 text-[11px] p-2.5 rounded-lg ${isTimeout ? "bg-red-50" : "bg-background"}`}>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">任务时间</span>
            <span className={`font-mono font-medium ${isTimeout ? "text-red-600" : "text-foreground"}`}>
              {task.startDate} – {task.endDate}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">跟进运营</span>
            <span className="text-foreground font-medium">{task.operator}</span>
          </div>
          {task.daysLeft !== null && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{task.daysLeft < 0 ? "已逾期" : "剩余时间"}</span>
              <span className={`font-mono font-semibold ${task.daysLeft < 0 ? "text-red-600" : task.daysLeft <= 3 ? "text-amber-600" : "text-emerald-600"}`}>
                {task.daysLeft < 0 ? `-${Math.abs(task.daysLeft)}d` : `+${task.daysLeft}d`}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          <button onClick={() => setShowSnapshot(!showSnapshot)}
            className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            <Info size={11} /> Topic 快照
          </button>
          <button
            onClick={() => showToast(`正在进入 ${task.resourceType} 制作流程`, "info")}
            className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center gap-1.5">
            去制作 <ArrowRight size={12} />
          </button>
        </div>

        {/* Snapshot panel */}
        {showSnapshot && (
          <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border text-[11px] space-y-1">
            <div className="font-semibold text-muted-foreground mb-2 flex items-center gap-1">
              <Circle size={8} className="text-amber-500" /> Topic 快照（只读）
            </div>
            <div className="text-foreground"><span className="text-muted-foreground">资源名：</span>{task.name}</div>
            <div className="text-foreground"><span className="text-muted-foreground">类型：</span>{task.resourceType}</div>
            <div className="text-foreground"><span className="text-muted-foreground">App：</span>{task.apps.join("、")}</div>
            <div className="text-foreground"><span className="text-muted-foreground">运营：</span>{task.operator}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {task.tags.map(t => (
                <span key={t} className="px-1.5 py-0.5 bg-card border border-border rounded text-[10px]">{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Assign Modal ─────────────────────────────────────────────────────────────

function AssignModal({ topic, designers, onClose, onConfirm }: { topic: Topic; designers: Designer[]; onClose: () => void; onConfirm: (designerId: string, task: Designer["tasks"][0]) => void }) {
  const now = new Date();
  const todayNum = now.getDate();
  const monthNum = now.getMonth(); // 0-indexed
  const yearNum = now.getFullYear();

  // Build calendar from 7 days before today through 21 days after today.
  const calDays = Array.from({ length: 29 }, (_, i) => {
    const d = new Date(yearNum, monthNum, todayNum - 7 + i);
    return {
      date: d,
      offset: -7 + i,
      day: d.getDate(),
      month: d.getMonth(),
      label: d.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" }),
      weekday: ["日","一","二","三","四","五","六"][d.getDay()],
      iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
    };
  });

  const [startIdx, setStartIdx] = useState<number | null>(null);
  const [endIdx, setEndIdx] = useState<number | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [filterGroup, setFilterGroup] = useState("");
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null);

  function handleDayClick(i: number) {
    if (startIdx === null || !selecting) {
      setStartIdx(i);
      setEndIdx(null);
      setHoverIdx(null);
      setSelecting(true);
      return;
    }

    if (i < startIdx) {
      setStartIdx(i);
      setEndIdx(null);
      setHoverIdx(null);
      return;
    }

    setEndIdx(i);
    setHoverIdx(null);
    setSelecting(false);
  }
  function handleDayHover(i: number) {
    if (selecting && startIdx !== null) setHoverIdx(i);
  }

  const previewEndIdx = selecting && hoverIdx !== null && startIdx !== null && hoverIdx >= startIdx ? hoverIdx : endIdx;
  const startDay = startIdx !== null ? calDays[startIdx] : null;
  const endDay = previewEndIdx !== null ? calDays[previewEndIdx] : startDay;
  const confirmedEndDay = endIdx !== null ? calDays[endIdx] : null;
  const duration = startIdx !== null && previewEndIdx !== null ? previewEndIdx - startIdx + 1 : startIdx !== null ? 1 : 0;

  const hasConflict = (designer: Designer) => {
    if (!startDay || !endDay) return false;
    for (let offset = startDay.offset; offset <= endDay.offset; offset += 1) {
      const concurrent = designer.tasks.filter(t =>
        t.title !== topic.name && offset >= t.start && offset <= t.end
      ).length;
      if (concurrent >= 2) return true;
    }
    return false;
  };
  const selectedHasConflict = selectedDesigner ? hasConflict(selectedDesigner) : false;

  const groups = Array.from(new Set(designers.map(d => d.group).filter(Boolean)));
  const filtered = designers.filter(d => !filterGroup || d.group === filterGroup);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-start justify-between gap-4 flex-none">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-primary mb-1">分配任务</div>
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-sm font-semibold text-foreground truncate">{topic.name}</h2>
              <ResourceTypeBadge type={topic.resourceType} />
              <StatusBadge status={topic.status} />
            </div>
            <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{topic.description || "选择任务时间和设计师"}</div>
          </div>
          <div className="flex items-center gap-3 flex-none">
            <div>
              <div className="text-[10px] text-muted-foreground mb-0.5">跟进运营</div>
              <div className="text-xs font-medium text-foreground">{topic.operator}</div>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left: calendar */}
          <div className="w-72 flex-none border-r border-border p-5 flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <div>
              <div className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <Calendar size={13} className="text-primary" /> 选择任务时间
              </div>
              <div className="text-[10px] text-muted-foreground mb-2">点击开始日，再点击结束日</div>
              <div className="grid grid-cols-7 gap-px">
                {["日","一","二","三","四","五","六"].map(w => (
                  <div key={w} className="text-center text-[10px] text-muted-foreground py-1 font-medium">{w}</div>
                ))}
                {/* Offset for first day */}
                {Array.from({ length: calDays[0].date.getDay() }).map((_, i) => <div key={`e${i}`} />)}
                {calDays.map((d, i) => {
                  const isStart = i === startIdx;
                  const isEnd = i === previewEndIdx;
                  const inRange = startIdx !== null && previewEndIdx !== null && i > startIdx && i < previewEndIdx;
                  const isToday = d.date.toDateString() === now.toDateString();
                  return (
                    <button key={i}
                      onClick={() => handleDayClick(i)}
                      onMouseEnter={() => handleDayHover(i)}
                      className={`relative h-8 w-full rounded-lg text-[11px] font-medium transition-all flex flex-col items-center justify-center gap-0 ${
                        isStart || isEnd
                          ? "bg-primary text-white"
                          : inRange
                            ? "bg-accent text-accent-foreground"
                            : isToday
                              ? "ring-1 ring-primary text-primary"
                              : "hover:bg-muted text-foreground"
                      }`}>
                      <span>{d.day}</span>
                      {d.day === 1 && <span className="absolute -top-1 right-0 text-[8px] text-muted-foreground">{d.month + 1}/1</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selection summary */}
            <div className={`rounded-xl p-3 text-xs space-y-1.5 ${startDay ? "bg-accent/60" : "bg-muted"}`}>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">开始</span>
                <span className="font-semibold text-foreground">{startDay ? startDay.label : "未选择"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">结束</span>
                <span className="font-semibold text-foreground">{endDay ? endDay.label : "未选择"}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-1.5 mt-1">
                <span className="text-muted-foreground">工期</span>
                <span className={`font-bold font-mono ${duration > 0 ? "text-primary" : "text-muted-foreground"}`}>
                  {duration > 0 ? `${duration} 天` : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: designers */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="px-5 pt-4 pb-3 border-b border-border flex-none">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Users size={13} className="text-primary" /> 选择设计师</span>
                <SelectField
                  value={filterGroup}
                  placeholder="全部分组"
                  options={groups}
                  onChange={setFilterGroup}
                  className="w-28 [&>button]:min-w-0 [&>button]:py-1" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-3 [&::-webkit-scrollbar]:hidden">
              <div className="grid grid-cols-3 gap-2">
                {filtered.map(designer => {
                  const conflict = hasConflict(designer);
                  const isSelected = selectedDesigner?.id === designer.id;
                  const busy = designer.tasks.length > 0;
                  return (
                    <button key={designer.id}
                      disabled={conflict}
                      onClick={() => setSelectedDesigner(isSelected ? null : designer)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? "border-primary bg-accent ring-1 ring-primary"
                          : conflict
                            ? "border-border bg-background opacity-40 cursor-not-allowed"
                            : "border-border bg-background hover:border-primary/40 hover:bg-muted/50"
                      }`}>
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                          conflict ? "bg-gray-400" : isSelected ? "bg-primary" : "bg-gradient-to-br from-violet-400 to-blue-500"
                        }`}>
                          {designer.avatar}
                        </div>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <CheckCircle2 size={10} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-foreground leading-tight">{designer.name}</div>
                        <div className="text-[10px] text-muted-foreground">{designer.group || "未分组"}</div>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                        conflict ? "bg-red-50 text-red-500" : !busy ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        {conflict ? "该时间已满" : !busy ? "空闲" : `${designer.tasks.length}个任务`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border flex items-center justify-between bg-background flex-none">
          <div className="text-xs text-muted-foreground">
            {selectedDesigner && startDay && confirmedEndDay
              ? <span className="text-foreground font-medium">{selectedDesigner.name} · {startDay.label} – {confirmedEndDay.label} · {duration}天</span>
              : "请选择时间段和设计师"}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors">
              取消
            </button>
            <button
              disabled={!selectedDesigner || !startDay || !confirmedEndDay || selectedHasConflict}
              onClick={() => selectedDesigner && startDay && confirmedEndDay && onConfirm(selectedDesigner.id, {
                title: topic.name,
                start: startDay.offset,
                end: confirmedEndDay.offset,
                startDate: startDay.iso,
                endDate: confirmedEndDay.iso,
                status: "未开始",
                type: topic.resourceType,
              })}
              className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
              {selectedHasConflict ? "该时间已满" : "确认分配"} <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);
  const [page, setPage] = useState<Page>("topics");
  const [assignTopic, setAssignTopic] = useState<Topic | null>(null);
  const [editTopic, setEditTopic] = useState<Topic | undefined>(undefined);
  const [activeWorkType, setActiveWorkType] = useState<ResourceType>("Themepack");
  const [language, setLanguage] = useState<Language>("zh");
  const [topics, setTopics] = useState<Topic[]>(() => MOCK_TOPICS.map(normalizeTopic));
  const [users, setUsers] = useState(MOCK_USERS);
  const localeValue = {
    language,
    setLanguage,
    text: (zh: string, en: string) => language === "zh" ? zh : en,
  };

  // Assigned tasks keyed by designer id
  const [designerTasks, setDesignerTasks] = useState<Record<string, Designer["tasks"]>>(() => {
    const init: Record<string, Designer["tasks"]> = {};
    MOCK_TOPICS.map(normalizeTopic).forEach(topic => {
      if (!topic.designer || !topic.startDate || !topic.endDate) return;
      init[topic.designer] = [...(init[topic.designer] ?? []), taskRangeFromTopic(topic)];
    });
    return init;
  });

  // Derive Designer list — merges user management + latest task assignments
  const designers: Designer[] = users
    .filter(u => u.isDesigner)
    .map(u => ({
      id: u.id,
      name: u.name,
      avatar: u.name.split(" ").map(n => n[0]).join(""),
      group: u.group,
      tasks: designerTasks[u.name] ?? [],
    }));

  // Early return AFTER all hooks
  if (!currentUser) {
    return (
      <LocaleContext.Provider value={localeValue}>
        <LocaleTextSync />
        <LoginPage onLogin={u => setCurrentUser(u)} />
      </LocaleContext.Provider>
    );
  }

  function handleConfirmAssign(designerId: string, task: Designer["tasks"][0]) {
    const designer = designers.find(d => d.id === designerId);
    if (!designer) return;
    for (let offset = task.start; offset <= task.end; offset += 1) {
      const concurrent = (designer.tasks ?? []).filter(t =>
        t.title !== task.title && offset >= t.start && offset <= t.end
      ).length;
      if (concurrent >= 2) {
        showToast("该设计师在所选时间段已有2项工作，无法继续安排", "error");
        return;
      }
    }
    // Update designer schedule
    setDesignerTasks(prev => {
      const next = Object.fromEntries(
        Object.entries(prev).map(([name, tasks]) => [
          name,
          tasks.filter(t => t.title !== task.title),
        ])
      ) as Record<string, Designer["tasks"]>;
      next[designer.name] = [...(next[designer.name] ?? []), task];
      return next;
    });
    // Update topic card: set designer, dates, status
    setTopics(prev => prev.map(t => t.id === assignTopic!.id ? {
      ...t,
      designer: designer.name,
      startDate: task.startDate ?? t.startDate,
      endDate: task.endDate ?? t.endDate,
      status: "未开始" as TopicStatus,
      productionStage: t.productionStage ?? "Draft",
      daysLeft: task.end - new Date().getDate(),
    } : t));
    setAssignTopic(null);
    showToast(`已分配给 ${designer.name}`);
  }

  function handleRecallTopic(t: Topic) {
    setTopics(prev => prev.map(p => p.id === t.id
      ? { ...p, designer: null, status: "待分配" as TopicStatus, startDate: null, endDate: null, daysLeft: null }
      : p
    ));
    // Remove from designer schedule
    if (t.designer) {
      setDesignerTasks(prev => ({
        ...prev,
        [t.designer!]: (prev[t.designer!] ?? []).filter(task => task.title !== t.name),
      }));
    }
    showToast("任务已撤回，重置为待分配", "info");
  }

  function handleDeleteTopic(t: Topic) {
    setTopics(prev => prev.filter(p => p.id !== t.id));
    if (t.designer) {
      setDesignerTasks(prev => ({
        ...prev,
        [t.designer!]: (prev[t.designer!] ?? []).filter(task => task.title !== t.name),
      }));
    }
    showToast("Topic 已删除", "error");
  }

  function handleEditTopic(t: Topic) {
    setEditTopic(t);
    setPage("create");
  }

  function handleSaveTopic(updated: Topic) {
    const normalized = normalizeTopic(updated);
    setTopics(prev => prev.some(t => t.id === normalized.id)
      ? prev.map(t => t.id === normalized.id ? normalized : t)
      : [...prev, normalized]
    );
    setEditTopic(undefined);
    setPage("topics");
    showToast(normalized.status === "待分配" ? "草稿已保存" : "Topic 已更新");
  }

  function handleStageChange(topic: Topic, stage: ProductionStage) {
    setTopics(prev => prev.map(t => t.id === topic.id ? { ...t, productionStage: stage } : t));
    showToast(`制作进度已更新为 ${stage}`, "info");
  }

  function handleLogout() {
    setCurrentUser(null);
    setPage("topics");
  }

  // Designer can only see mywork
  const isDesigner = currentUser.role === "设计师";
  const effectivePage: Page = isDesigner && page !== "mywork" ? "mywork" : page;
  const workCounts = Object.fromEntries(RESOURCE_TYPES.map(type => [
    type,
    topics.filter(t => t.designer === currentUser.name && t.resourceType === type && t.status !== "已完成").length,
  ])) as Record<ResourceType, number>;

  return (
    <LocaleContext.Provider value={localeValue}>
    <LocaleTextSync />
    <div className="flex h-screen min-w-[1180px] bg-background overflow-hidden font-[Figtree,system-ui,sans-serif]">
      <Sidebar
        page={effectivePage}
        setPage={p => { if (p === "create") setEditTopic(undefined); setPage(p); }}
        currentUser={currentUser}
        activeWorkType={activeWorkType}
        workCounts={workCounts}
        onSelectWorkType={setActiveWorkType}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {effectivePage === "topics"   && <TopicListPage topics={topics} onAssign={t => setAssignTopic(t)} onNavigate={setPage} onEdit={handleEditTopic} onRecall={handleRecallTopic} onDelete={handleDeleteTopic} onStageChange={handleStageChange} currentUserRole={currentUser.role} />}
        {effectivePage === "create"   && <CreateTopicPage initialTopic={editTopic} currentUser={currentUser} onSave={handleSaveTopic} />}
        {effectivePage === "schedule" && (
          <SchedulePage
            designers={designers}
            topics={topics}
            onAssign={t => setAssignTopic(t)}
            onEdit={handleEditTopic}
            onRecall={handleRecallTopic}
            onDelete={handleDeleteTopic}
            onStageChange={handleStageChange} />
        )}
        {effectivePage === "users"    && <UsersPage users={users} setUsers={setUsers} currentUser={currentUser} />}
        {effectivePage === "mywork"   && <MyWorkPage topics={topics} currentUser={currentUser} activeType={activeWorkType} onTypeChange={setActiveWorkType} />}
      </main>

      {assignTopic && (
        <AssignModal topic={assignTopic} designers={designers} onClose={() => setAssignTopic(null)} onConfirm={handleConfirmAssign} />
      )}
      <ToastContainer />
    </div>
    </LocaleContext.Provider>
  );
}
