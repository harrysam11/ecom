import { getSettings } from "@/lib/admin-actions"
import { SettingsForm } from "@/components/admin/settings-form"

export default async function SettingsPage() {
    const settings = await getSettings()

    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            </div>
            <div className="grid gap-4">
                <SettingsForm initialData={settings} />
            </div>
        </div>
    )
}
