import { Package, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyTaskHistoryProps {
  onViewActiveTasks: () => void;
}

export const EmptyTaskHistory = ({ onViewActiveTasks }: EmptyTaskHistoryProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No Completed Tasks Yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Complete your first delivery to see performance insights and history here.
      </p>
      
      {/* Chart Placeholder */}
      <div className="bg-secondary/50 border border-border rounded-xl p-6 mb-6 max-w-lg mx-auto">
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <BarChart3 className="h-10 w-10 mb-2 opacity-50" />
          <p className="text-sm">No chart data available</p>
        </div>
      </div>

      <Button onClick={onViewActiveTasks} className="bg-primary text-primary-foreground hover:bg-primary/90">
        View Active Tasks
      </Button>
    </div>
  );
};
