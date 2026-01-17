import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Task from "@/lib/models/Task";
import { requireAuth } from "@/lib/auth";

// GET /api/volunteer/statistics - Get volunteer statistics
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(["volunteer"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }
    const { user } = authResult;

    await dbConnect();

    // Get all tasks for this volunteer
    const allTasks = await Task.find({ volunteerId: user._id }).lean();
    
    // Basic stats
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status === "completed");
    const activeTasks = allTasks.filter(t => 
      t.status !== "completed" && t.status !== "cancelled"
    );
    const cancelledTasks = allTasks.filter(t => t.status === "cancelled");

    // Calculate weekly performance (last 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayCompleted = completedTasks.filter(t => {
        if (!t.completedAt) return false;
        const completed = new Date(t.completedAt);
        return completed >= date && completed < nextDate;
      }).length;

      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      weeklyData.push({
        day: dayNames[date.getDay()],
        deliveries: dayCompleted,
        date: date.toISOString().split('T')[0]
      });
    }

    // Calculate monthly trend (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      const nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const monthCompleted = completedTasks.filter(t => {
        if (!t.completedAt) return false;
        const completed = new Date(t.completedAt);
        return completed >= date && completed < nextMonth;
      }).length;

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      monthlyData.push({
        month: monthNames[date.getMonth()],
        completed: monthCompleted,
        year: date.getFullYear()
      });
    }

    // Calculate today's stats
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const todayDeliveries = completedTasks.filter(t => {
      if (!t.completedAt) return false;
      const completed = new Date(t.completedAt);
      return completed >= todayStart && completed <= todayEnd;
    }).length;

    // This month's stats
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthDeliveries = completedTasks.filter(t => {
      if (!t.completedAt) return false;
      const completed = new Date(t.completedAt);
      return completed >= monthStart;
    }).length;

    // Calculate average delivery time
    let avgDeliveryTime = 0;
    if (completedTasks.length > 0) {
      const totalTime = completedTasks.reduce((sum, task) => {
        if (!task.assignedAt || !task.completedAt) return sum;
        const assigned = new Date(task.assignedAt);
        const completed = new Date(task.completedAt);
        return sum + (completed.getTime() - assigned.getTime());
      }, 0);
      avgDeliveryTime = totalTime / completedTasks.length; // in milliseconds
    }

    // Calculate success rate (completed vs total assigned)
    const successRate = totalTasks > 0 
      ? Math.round((completedTasks.length / totalTasks) * 100) 
      : 0;

    // Get unique NGOs served
    const uniqueNGOs = new Set(
      completedTasks
        .map(t => (t as any).requestId?.toString())
        .filter(Boolean)
    ).size;

    // Get last delivery date
    const lastDelivery = completedTasks.length > 0
      ? completedTasks
          .map(t => t.completedAt)
          .filter(Boolean)
          .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())[0]
      : null;

    // Calculate on-time percentage (assuming deliveries completed within 4 hours are on-time)
    const onTimeDeliveries = completedTasks.filter(t => {
      if (!t.assignedAt || !t.completedAt) return false;
      const assigned = new Date(t.assignedAt);
      const completed = new Date(t.completedAt);
      const hours = (completed.getTime() - assigned.getTime()) / (1000 * 60 * 60);
      return hours <= 4;
    }).length;

    const onTimePercentage = completedTasks.length > 0
      ? Math.round((onTimeDeliveries / completedTasks.length) * 100)
      : 0;

    return NextResponse.json({
      totalTasks,
      completedTasks: completedTasks.length,
      activeTasks: activeTasks.length,
      cancelledTasks: cancelledTasks.length,
      todayDeliveries,
      thisMonthDeliveries,
      weeklyPerformance: weeklyData,
      monthlyTrend: monthlyData,
      avgDeliveryTime: Math.round(avgDeliveryTime / (1000 * 60)), // in minutes
      successRate,
      uniqueNGOs,
      lastDelivery,
      onTimePercentage,
      stats: {
        totalCompleted: completedTasks.length,
        totalActive: activeTasks.length,
        totalCancelled: cancelledTasks.length,
      }
    });
  } catch (error: any) {
    console.error("Get statistics error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

