import { PrismaClient } from "@prisma/client";
import SettingsForm from "./SettingsForm";

const prisma = new PrismaClient();

export default async function AdminSettingsPage() {
  const settings = await prisma.systemSettings.findUnique({
    where: { id: "default" },
  });

  const defaultSettings = {
    isMaintenanceMode: settings?.isMaintenanceMode ?? false,
    maintenanceMessage: settings?.maintenanceMessage || "الموقع يخضع لعمليات صيانة وتحديث للأنظمة. سنعود قريباً جداً، نشكركم على صبركم.",
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">إعدادات النظام</h1>
        <p className="text-gray-400">تحكم في حالة الموقع، وضع الصيانة، وإعدادات النظام المتقدمة.</p>
      </div>
      
      <SettingsForm defaultSettings={defaultSettings} />
    </div>
  );
}
