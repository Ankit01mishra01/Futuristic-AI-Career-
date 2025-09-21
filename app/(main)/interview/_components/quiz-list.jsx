"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Calendar, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function QuizList({ assessments = [] }) {
  const recentAssessments = assessments
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5); // Show 5 most recent

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      {/* Start New Quiz Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Ready for Your Next Challenge?
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Test your knowledge with industry-specific interview questions tailored to your profile.
          </p>
        </CardHeader>
        <CardContent>
          <Link href="/interview/mock">
            <Button size="lg" className="w-full md:w-auto">
              <Play className="h-4 w-4 mr-2" />
              Start New Mock Interview
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Assessments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Performance
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Your latest interview assessment results
          </p>
        </CardHeader>
        <CardContent>
          {recentAssessments.length === 0 ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No assessments yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your first mock interview to track your progress
              </p>
              <Link href="/interview/mock">
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  Take First Quiz
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={getScoreBadgeVariant(assessment.quizScore)}>
                        {assessment.quizScore}%
                      </Badge>
                      <span className="font-medium">
                        {assessment.category} Interview
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(assessment.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                    {assessment.improvementTip && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        💡 {assessment.improvementTip}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getScoreColor(assessment.quizScore)}`}>
                      {assessment.quizScore}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Array.isArray(assessment.questions) 
                        ? `${assessment.questions.length} questions`
                        : "Multiple questions"
                      }
                    </p>
                  </div>
                </div>
              ))}

              {assessments.length > 5 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {recentAssessments.length} of {assessments.length} total assessments
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
