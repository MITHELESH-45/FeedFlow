import { Award, Zap, Target, Trophy, Star, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  progress?: number;
  total?: number;
}

interface AchievementBadgesProps {
  completedCount: number;
}

export const AchievementBadges = ({ completedCount }: AchievementBadgesProps) => {
  const badges: Badge[] = [
    {
      id: "first",
      name: "First Delivery",
      description: "Complete your first delivery",
      icon: <Star className="h-5 w-5" />,
      earned: completedCount >= 1,
      progress: Math.min(completedCount, 1),
      total: 1,
    },
    {
      id: "helper",
      name: "Helping Hand",
      description: "Complete 5 deliveries",
      icon: <Award className="h-5 w-5" />,
      earned: completedCount >= 5,
      progress: Math.min(completedCount, 5),
      total: 5,
    },
    {
      id: "speedy",
      name: "Speed Demon",
      description: "Complete 10 deliveries",
      icon: <Zap className="h-5 w-5" />,
      earned: completedCount >= 10,
      progress: Math.min(completedCount, 10),
      total: 10,
    },
    {
      id: "dedicated",
      name: "Dedicated Hero",
      description: "Complete 25 deliveries",
      icon: <Target className="h-5 w-5" />,
      earned: completedCount >= 25,
      progress: Math.min(completedCount, 25),
      total: 25,
    },
    {
      id: "legend",
      name: "Food Legend",
      description: "Complete 50 deliveries",
      icon: <Trophy className="h-5 w-5" />,
      earned: completedCount >= 50,
      progress: Math.min(completedCount, 50),
      total: 50,
    },
    {
      id: "streak",
      name: "On Fire",
      description: "Complete 100 deliveries",
      icon: <Flame className="h-5 w-5" />,
      earned: completedCount >= 100,
      progress: Math.min(completedCount, 100),
      total: 100,
    },
  ];

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <Trophy className="h-4 w-4 text-yellow-500" />
        Achievements
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={cn(
              "relative flex flex-col items-center p-3 rounded-xl border transition-all group",
              badge.earned
                ? "bg-gradient-to-br from-teal-500/20 to-blue-500/20 border-teal-500/50"
                : "bg-gray-800/50 border-gray-700 opacity-50"
            )}
            title={`${badge.name}: ${badge.description}`}
          >
            <div
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center mb-2",
                badge.earned
                  ? "bg-teal-500 text-white"
                  : "bg-gray-700 text-gray-400"
              )}
            >
              {badge.icon}
            </div>
            <p className="text-xs font-medium text-center text-white">{badge.name}</p>
            {!badge.earned && badge.progress !== undefined && (
              <p className="text-[10px] text-gray-400 mt-1">
                {badge.progress}/{badge.total}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
