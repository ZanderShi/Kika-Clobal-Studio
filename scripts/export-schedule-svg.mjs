import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const appPath = resolve(rootDir, "src/app/App.tsx");
const outPath = resolve(rootDir, "exports/designer-schedule.svg");
const source = readFileSync(appPath, "utf8");

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const today = new Date();
const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

function isoFromOffset(offset) {
  const date = new Date(todayStart);
  date.setDate(todayStart.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function diffDaysFromToday(iso) {
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  return Math.round((new Date(year, month - 1, day).getTime() - todayStart.getTime()) / MS_PER_DAY);
}

function daysLeftFromEndDate(endDate) {
  return diffDaysFromToday(endDate ?? undefined);
}

const productionStages = [
  "Draft",
  "Preview image review",
  "Preview failed",
  "Resources to be replenished",
  "Resource package review",
  "Resource package failed",
  "approved",
];

function extractConstArray(name, until) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`const ${escapedName}(?::[^=]+)? = ([\\s\\S]*?);\\n\\n${until}`);
  const match = source.match(pattern);
  if (!match) throw new Error(`Could not find ${name} in ${appPath}`);
  return Function(
    "isoFromOffset",
    "daysLeftFromEndDate",
    `return (${match[1]});`,
  )(isoFromOffset, daysLeftFromEndDate);
}

const topics = extractConstArray("MOCK_TOPICS", "const MOCK_DESIGNERS");
const users = extractConstArray("MOCK_USERS", "function UsersPage");

function taskRangeFromTopic(topic) {
  return {
    title: topic.name,
    start: diffDaysFromToday(topic.startDate ?? undefined) ?? 0,
    end: diffDaysFromToday(topic.endDate ?? undefined) ?? 0,
    status: topic.status,
    type: topic.resourceType,
    startDate: topic.startDate ?? undefined,
    endDate: topic.endDate ?? undefined,
  };
}

function defaultProductionStageForTopic(topic) {
  if (topic.isSynced || topic.status === "已完成") return "approved";
  if (topic.status === "待分配" || topic.status === "未开始") return "Draft";
  if (topic.status === "超时") return "Resource package failed";
  const index = Number((topic.id ?? "0").replace(/\D/g, "")) || 0;
  return productionStages[index % (productionStages.length - 1)];
}

const normalizedTopics = topics.map((topic) => ({
  ...topic,
  productionStage: topic.productionStage ?? defaultProductionStageForTopic(topic),
}));

const designerTasks = {};
for (const topic of normalizedTopics) {
  if (!topic.designer || !topic.startDate || !topic.endDate) continue;
  designerTasks[topic.designer] = [...(designerTasks[topic.designer] ?? []), taskRangeFromTopic(topic)];
}

const designers = users
  .filter((user) => user.isDesigner)
  .map((user) => ({
    id: user.id,
    name: user.name,
    avatar: user.name.split(" ").map((part) => part[0]).join(""),
    group: user.group,
    tasks: designerTasks[user.name] ?? [],
  }));

const scheduledTasks = designers.flatMap((designer) => designer.tasks);
const minTaskStart = Math.min(...scheduledTasks.map((task) => task.start));
const maxTaskEnd = Math.max(...scheduledTasks.map((task) => task.end));
const timelineStart = Math.min(-7, minTaskStart - 2);
const timelineEnd = Math.max(31, maxTaskEnd + 4);
const dayCount = timelineEnd - timelineStart + 1;

const sidebarWidth = 184;
const dayWidth = 52;
const headerHeight = 132;
const rowHeight = 78;
const width = sidebarWidth + dayCount * dayWidth;
const height = headerHeight + designers.length * rowHeight + 34;

const statusColor = {
  "进行中": "#3b82f6",
  "超时": "#ef4444",
  "已完成": "#94a3b8",
  "未开始": "#475569",
  "待分配": "#f59e0b",
};

const typeColor = {
  "Themepack": "#8b5cf6",
  "Control Center": "#06b6d4",
  "Supertheme": "#f97316",
  "Keyboard": "#d946ef",
};

const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function addDays(offset) {
  const date = new Date(todayStart);
  date.setDate(todayStart.getDate() + offset);
  return date;
}

function taskLane(tasks, task) {
  const sorted = [...tasks].sort((a, b) => a.start - b.start || a.end - b.end || a.title.localeCompare(b.title));
  const laneEnd = [-Infinity, -Infinity];
  const lanes = new Map();
  for (const item of sorted) {
    const lane = item.start > laneEnd[0] ? 0 : item.start > laneEnd[1] ? 1 : 1;
    lanes.set(item, lane);
    laneEnd[lane] = Math.max(laneEnd[lane], item.end);
  }
  return lanes.get(task) ?? 0;
}

function truncateText(value, maxChars) {
  return value.length > maxChars ? `${value.slice(0, maxChars - 1)}...` : value;
}

const taskCount = scheduledTasks.length;
const timeoutTasks = scheduledTasks.filter((task) => task.status === "超时").length;
const occupiedDays = scheduledTasks.reduce((sum, task) => sum + (task.end - task.start + 1), 0);
const avgLoad = designers.length ? Math.round(occupiedDays / designers.length) : 0;
const overloadedDesigners = designers.filter((designer) => (
  designer.tasks.reduce((sum, task) => sum + (task.end - task.start + 1), 0) > 14
)).length;

const parts = [];
parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`);
parts.push(`<rect width="${width}" height="${height}" fill="#f8fafc"/>`);
parts.push(`<text x="24" y="36" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="#0f172a">设计师排期</text>`);
parts.push(`<text x="24" y="60" font-family="Inter, Arial, sans-serif" font-size="12" fill="#64748b">当前任务时间范围 · ${isoFromOffset(timelineStart)} 到 ${isoFromOffset(timelineEnd)}</text>`);

const stats = [
  ["任务", taskCount, "#f1f5f9", "#475569"],
  ["设计师", designers.length, "#eff6ff", "#1d4ed8"],
  ["平均占用", `${avgLoad}天`, "#f5f3ff", "#6d28d9"],
  ["超时", timeoutTasks, timeoutTasks ? "#fef2f2" : "#ecfdf5", timeoutTasks ? "#dc2626" : "#047857"],
  ["高负载", overloadedDesigners, overloadedDesigners ? "#fffbeb" : "#eff6ff", overloadedDesigners ? "#b45309" : "#1d4ed8"],
];

stats.forEach(([label, value, fill, text], index) => {
  const x = 24 + index * 142;
  parts.push(`<rect x="${x}" y="78" width="126" height="38" rx="8" fill="${fill}" stroke="#e2e8f0"/>`);
  parts.push(`<text x="${x + 12}" y="102" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="600" fill="${text}" opacity="0.82">${label}</text>`);
  parts.push(`<text x="${x + 112}" y="103" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="700" text-anchor="end" fill="${text}">${value}</text>`);
});

parts.push(`<rect x="0" y="${headerHeight - 1}" width="${width}" height="1" fill="#e2e8f0"/>`);
parts.push(`<rect x="0" y="${headerHeight}" width="${sidebarWidth}" height="${height - headerHeight}" fill="#ffffff"/>`);
parts.push(`<text x="24" y="${headerHeight + 29}" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="700" fill="#64748b">设计师</text>`);

for (let i = 0; i < dayCount; i += 1) {
  const offset = timelineStart + i;
  const date = addDays(offset);
  const x = sidebarWidth + i * dayWidth;
  const isWeekend = [0, 6].includes(date.getDay());
  const isToday = offset === 0;
  if (isWeekend) parts.push(`<rect x="${x}" y="${headerHeight}" width="${dayWidth}" height="${height - headerHeight}" fill="#f1f5f9" opacity="0.7"/>`);
  if (isToday) parts.push(`<rect x="${x}" y="${headerHeight}" width="${dayWidth}" height="${height - headerHeight}" fill="#dbeafe" opacity="0.8"/>`);
  parts.push(`<line x1="${x}" y1="${headerHeight}" x2="${x}" y2="${height - 34}" stroke="${isToday ? "#3b82f6" : "#e2e8f0"}" stroke-width="${isToday ? 2 : 1}"/>`);
  parts.push(`<line x1="${x + dayWidth / 2}" y1="${headerHeight}" x2="${x + dayWidth / 2}" y2="${height - 34}" stroke="#e2e8f0" opacity="0.5"/>`);
  parts.push(`<text x="${x + dayWidth / 2}" y="${headerHeight + 20}" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="${isToday ? 700 : 500}" text-anchor="middle" fill="${isToday ? "#1d4ed8" : "#64748b"}">${isToday ? "今日" : date.getDate()}</text>`);
  parts.push(`<text x="${x + dayWidth / 2}" y="${headerHeight + 38}" font-family="Inter, Arial, sans-serif" font-size="9" text-anchor="middle" fill="#94a3b8">${date.getMonth() + 1}/${date.getDate()} · ${weekdays[date.getDay()]}</text>`);
}

parts.push(`<line x1="${sidebarWidth}" y1="${headerHeight}" x2="${sidebarWidth}" y2="${height - 34}" stroke="#cbd5e1"/>`);

designers.forEach((designer, index) => {
  const y = headerHeight + 48 + index * rowHeight;
  const rowY = headerHeight + 48 + index * rowHeight;
  const bg = index % 2 === 0 ? "#ffffff" : "#f8fafc";
  parts.push(`<rect x="0" y="${rowY}" width="${width}" height="${rowHeight}" fill="${bg}"/>`);
  parts.push(`<line x1="0" y1="${rowY + rowHeight}" x2="${width}" y2="${rowY + rowHeight}" stroke="#e2e8f0"/>`);
  parts.push(`<circle cx="38" cy="${y + 38}" r="15" fill="#6366f1"/>`);
  parts.push(`<text x="38" y="${y + 42}" font-family="Inter, Arial, sans-serif" font-size="10" font-weight="700" text-anchor="middle" fill="#ffffff">${escapeXml(designer.avatar)}</text>`);
  parts.push(`<text x="66" y="${y + 35}" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="700" fill="#0f172a">${escapeXml(designer.name)}</text>`);
  parts.push(`<text x="66" y="${y + 53}" font-family="Inter, Arial, sans-serif" font-size="10" fill="#64748b">${escapeXml(designer.group || "未分组")}</text>`);

  designer.tasks.forEach((task) => {
    if (task.end < timelineStart || task.start > timelineEnd) return;
    const visibleStart = Math.max(task.start, timelineStart);
    const visibleEnd = Math.min(task.end, timelineEnd);
    const x = sidebarWidth + (visibleStart - timelineStart) * dayWidth + 3;
    const barWidth = (visibleEnd - visibleStart + 1) * dayWidth - 6;
    const lane = taskLane(designer.tasks, task);
    const barY = y + 12 + lane * 30;
    const color = statusColor[task.status] ?? "#64748b";
    const maxChars = Math.max(6, Math.floor(barWidth / 7));
    parts.push(`<rect x="${x}" y="${barY}" width="${barWidth}" height="24" rx="6" fill="${color}"/>`);
    parts.push(`<rect x="${x}" y="${barY}" width="4" height="24" rx="2" fill="${typeColor[task.type] ?? "#ffffff"}" opacity="0.95"/>`);
    parts.push(`<text x="${x + 10}" y="${barY + 16}" font-family="Inter, Arial, sans-serif" font-size="10" font-weight="600" fill="#ffffff">${escapeXml(truncateText(task.title, maxChars))}</text>`);
  });
});

const legendY = height - 20;
[
  ["进行中", statusColor["进行中"]],
  ["未开始", statusColor["未开始"]],
  ["超时", statusColor["超时"]],
  ["已完成", statusColor["已完成"]],
].forEach(([label, color], index) => {
  const x = 24 + index * 92;
  parts.push(`<rect x="${x}" y="${legendY - 9}" width="11" height="11" rx="2" fill="${color}"/>`);
  parts.push(`<text x="${x + 17}" y="${legendY}" font-family="Inter, Arial, sans-serif" font-size="11" fill="#64748b">${label}</text>`);
});

parts.push(`</svg>`);

writeFileSync(outPath, `${parts.join("\n")}\n`, "utf8");
console.log(outPath);
