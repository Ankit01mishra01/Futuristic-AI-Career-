"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Clock, Award } from "lucide-react";

export default function StatsCards({ assessments = [] }) {
  const totalAssessments = assessments.length;
  const averageScore = assessments.length > 0 
    ? (assessments.reduce((sum, assessment) => sum + assessment.quizScore, 0) / assessments.length).toFixed(1)
    : 0;
  
  const bestScore = assessments.length > 0 
    ? Math.max(...assessments.map(a => a.quizScore))
    : 0;
    
  const recentAssessments = assessments.filter(
    assessment => new Date() - new Date(assessment.createdAt) <= 7 * 24 * 60 * 60 * 1000
  ).length;

  const stats = [
    {
      title: "Total Assessments",
      value: totalAssessments,
      icon: Target,
      description: "Completed interviews"
    },
    {
      title: "Average Score",
      value: `${averageScore}%`,
      icon: TrendingUp,
      description: "Overall performance"
    },
    {
      title: "Best Score",
      value: `${bestScore}%`,
      icon: Award,
      description: "Highest achievement"
    },
    {
      title: "This Week",
      value: recentAssessments,
      icon: Clock,
      description: "Recent activity"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
