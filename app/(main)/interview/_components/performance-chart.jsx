"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

export default function PerformanceChart({ assessments = [] }) {
  // Prepare data for the chart
  const chartData = assessments
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((assessment, index) => ({
      assessment: `Quiz ${index + 1}`,
      score: assessment.quizScore,
      date: format(new Date(assessment.createdAt), "MMM dd"),
      fullDate: assessment.createdAt,
    }))
    .slice(-10); // Show last 10 assessments

  if (chartData.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <p>No assessment data available</p>
              <p className="text-sm">Take your first quiz to see your progress!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Your quiz scores over time (last 10 assessments)
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={[0, 100]}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-3">
                        <p className="font-medium">{data.assessment}</p>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="text-lg font-semibold text-primary">
                          Score: {payload[0].value}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ 
                  fill: "hsl(var(--primary))", 
                  strokeWidth: 2,
                  r: 4
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 2,
                  fill: "hsl(var(--background))"
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary stats below chart */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {chartData.length > 0 ? Math.max(...chartData.map(d => d.score)) : 0}%
            </p>
            <p className="text-sm text-muted-foreground">Best Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {chartData.length > 0 
                ? Math.round(chartData.reduce((sum, d) => sum + d.score, 0) / chartData.length)
                : 0}%
            </p>
            <p className="text-sm text-muted-foreground">Average Score</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
