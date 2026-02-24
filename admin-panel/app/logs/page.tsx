import { prisma } from "@/lib/prisma"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { format } from "date-fns"

export default async function LogsPage() {
    const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
        take: 50
    })

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-lg font-semibold md:text-2xl text-primary font-bold tracking-tight">System Logs</h1>
                <p className="text-sm text-muted-foreground">Track all administrative actions and security events.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl border-b pb-2">Audit History</CardTitle>
                    <CardDescription>Comprehensive record of system changes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Admin</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Entity</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="text-xs font-mono">{format(log.createdAt, "yyyy-MM-dd HH:mm:ss")}</TableCell>
                                    <TableCell>
                                        <div className="text-sm font-medium">{log.user.name || "System"}</div>
                                        <div className="text-[10px] text-muted-foreground">{log.user.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded">
                                            {log.action}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm">{log.entity} <span className="text-xs text-muted-foreground opacity-50">#{log.entityId.slice(-6)}</span></TableCell>
                                    <TableCell className="max-w-[300px] truncate text-xs text-muted-foreground font-mono italic">
                                        {JSON.stringify(log.details)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {logs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No audit logs recorded yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
