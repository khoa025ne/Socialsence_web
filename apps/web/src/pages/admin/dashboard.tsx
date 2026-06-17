import { useState, useEffect, useCallback } from "react"
import { PageHeader } from "@workspace/ui/components/page-header"
import { DoubleBezelCard } from "@workspace/ui/components/double-bezel-card"
import { NumberCounter } from "@workspace/ui/components/number-counter"
import { adminApi, type AdminDashboard } from "@/api/admin"
import { toast } from "sonner"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts"
import { Sparkles, Users, FileText, Key, Calendar } from "lucide-react"

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<AdminDashboard | null>(null)
  const [loadingDashboard, setLoadingDashboard] = useState(true)

  // Fetch Dashboard Stats
  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoadingDashboard(true)
      const data = await adminApi.getDashboard()
      setDashboardData(data)
    } catch (err: any) {
      console.error("Failed to fetch admin stats", err)
      toast.error(err.message || "Không thể tải số liệu thống kê Admin!")
    } finally {
      setLoadingDashboard(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardStats()
  }, [fetchDashboardStats])

  // Chuẩn hóa dữ liệu biểu đồ
  const chartData = dashboardData?.last7DaysContent?.map(item => ({
    ...item,
    dateFormatted: item.date ? new Date(item.date).toLocaleDateString("vi-VN", { day: 'numeric', month: 'short' }) : ""
  })) || []

  return (
    <div className="p-6 flex flex-col gap-8 max-w-6xl mx-auto">
      <PageHeader 
        title="Admin Dashboard" 
        description="Tổng quan hệ thống, kiểm soát hạn ngạch, API keys và hiệu suất tạo nội dung SocialSence." 
      />

      {/* Admin metrics overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DoubleBezelCard className="bg-background">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-muted-foreground text-xs font-mono uppercase tracking-wider block">Tổng người dùng</span>
              <div className="mt-4 flex items-baseline gap-2">
                <NumberCounter value={dashboardData?.totalUsers ?? 0} separator="." className="text-4xl font-serif font-bold tracking-tight" />
                <span className="text-muted-foreground text-xs">người</span>
              </div>
            </div>
            <div className="p-2 bg-muted/20 border border-border rounded">
              <Users className="size-5 text-foreground" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-dashed border-border/60">
            {loadingDashboard ? "Đang tải..." : `Đang hoạt động: ${dashboardData?.activeUsers ?? 0}`}
          </p>
        </DoubleBezelCard>

        <DoubleBezelCard className="bg-background">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-muted-foreground text-xs font-mono uppercase tracking-wider block">Bài viết đã tạo (AI)</span>
              <div className="mt-4 flex items-baseline gap-2">
                <NumberCounter value={dashboardData?.totalContentGenerated ?? 0} separator="." className="text-4xl font-serif font-bold tracking-tight" />
                <span className="text-muted-foreground text-xs">bài viết</span>
              </div>
            </div>
            <div className="p-2 bg-muted/20 border border-border rounded">
              <FileText className="size-5 text-foreground" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-dashed border-border/60">
            {loadingDashboard ? "Đang tải..." : `Tổng tri thức đã nạp: ${dashboardData?.totalKnowledgeItems ?? 0}`}
          </p>
        </DoubleBezelCard>

        <DoubleBezelCard className="bg-background">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-muted-foreground text-xs font-mono uppercase tracking-wider block">API Keys hoạt động</span>
              <div className="mt-4 flex items-baseline gap-2">
                <NumberCounter value={dashboardData?.activeApiKeys ?? 0} className="text-4xl font-serif font-bold tracking-tight" />
                <span className="text-muted-foreground text-xs">active keys</span>
              </div>
            </div>
            <div className="p-2 bg-muted/20 border border-border rounded">
              <Key className="size-5 text-foreground" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-dashed border-border/60">
            {loadingDashboard ? "Đang tải..." : `Đang cooldown: ${dashboardData?.coolingDownApiKeys ?? 0} keys`}
          </p>
        </DoubleBezelCard>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 gap-6">
        <DoubleBezelCard className="bg-background">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-lg flex items-center gap-2">
                <Calendar className="size-4" /> Hiệu suất hệ thống (7 ngày qua)
              </h3>
              <p className="text-xs text-muted-foreground">Thống kê số lượng bài viết tạo bằng AI và người dùng mới đăng ký.</p>
            </div>
          </div>

          <div className="h-[350px] w-full">
            {loadingDashboard ? (
              <div className="h-full w-full flex items-center justify-center font-mono text-xs text-muted-foreground">
                Đang tải dữ liệu biểu đồ...
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center font-mono text-xs text-muted-foreground">
                Không có dữ liệu 7 ngày qua
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorContent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#71717a" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#71717a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                  <XAxis 
                    dataKey="dateFormatted" 
                    tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
                    stroke="#e4e4e7"
                  />
                  <YAxis 
                    tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
                    stroke="#e4e4e7"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e4e4e7',
                      borderRadius: '0px',
                      fontFamily: 'monospace',
                      fontSize: '11px'
                    }} 
                  />
                  <Legend 
                    wrapperStyle={{ 
                      fontFamily: 'monospace', 
                      fontSize: '11px',
                      paddingTop: '15px'
                    }} 
                  />
                  <Area 
                    name="Bài viết tạo AI"
                    type="monotone" 
                    dataKey="contentGenerated" 
                    stroke="#000000" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorContent)" 
                  />
                  <Area 
                    name="Người dùng mới"
                    type="monotone" 
                    dataKey="newUsers" 
                    stroke="#71717a" 
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </DoubleBezelCard>
      </div>
    </div>
  )
}
