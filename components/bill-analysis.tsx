// "use client";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Zap,
//   CheckCircle2,
//   AlertCircle,
//   TrendingUp,
//   TrendingDown,
// } from "lucide-react";

// interface BillAnalysisProps {
//   rawGrokOutput?: any;
//   recommendations?: Array<{
//     name?: string;
//     description?: string;
//     new_monthly_spend_ex_gst?: number;
//     saving_ex_gst?: number; // can be positive (saving) or negative (extra cost)
//   }>;
//   currentServices?: string[];
//   isLoading?: boolean;
// }

// export default function BillAnalysis({
//   rawGrokOutput,
//   recommendations = [],
//   currentServices = [],
//   isLoading = false,
// }: BillAnalysisProps) {
//   const currentSpend = rawGrokOutput?.current_spend?.monthly_ex_gst || 0;

//   const displayRecommendations = recommendations
//     .slice(0, 3)
//     .map((rec, idx) => {
//       const rawSaving = rec.saving_ex_gst || 0;
//       const isSaving = rawSaving > 0;
//       const isLoss = rawSaving < 0;
//       const isNeutral = rawSaving === 0;

//       const displayAmount = Math.abs(Math.round(rawSaving));
//       const label = isSaving ? "saving" : isLoss ? "extra cost" : "no change";

//       return {
//         id: idx,
//         name: rec.name || `Option ${idx + 1}`,
//         description: rec.description || "Custom plan",
//         amount: displayAmount,
//         label,
//         isSaving,
//         isLoss,
//         isNeutral,
//         highlighted: isSaving && idx === 0, // Only highlight if it's actually a saving
//       };
//     })
//     .filter((rec) => rec.isSaving || rec.isNeutral); // Hide plans that cost more

//   if (isLoading) {
//     return (
//       <div className="space-y-4">
//         <div className="animate-pulse space-y-3">
//           {[1, 2, 3].map((i) => (
//             <Card key={i} className="p-4 h-24 bg-muted" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (displayRecommendations.length === 0) {
//     return (
//       <Card className="p-6 text-center space-y-3">
//         <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground" />
//         <p className="text-muted-foreground">
//           No better plans found. Your current plan may already be competitive.
//         </p>
//       </Card>
//     );
//   }

//   const hasAnyRealSaving = displayRecommendations.some((r) => r.isSaving);

//   return (
//     <div className="space-y-4">
//       <div className="grid gap-3">
//         {displayRecommendations.map((rec) => (
//           <Card
//             key={rec.id}
//             className={`p-4 transition-all ${
//               rec.highlighted
//                 ? "border-green-500 border-2 bg-green-50 dark:bg-green-950/30"
//                 : "hover:border-accent/50"
//             }`}
//           >
//             <div className="flex items-start justify-between gap-3">
//               <div className="flex-1 space-y-1">
//                 <div className="flex items-center gap-2">
//                   <h3 className="font-semibold text-foreground">{rec.name}</h3>
//                   {rec.highlighted && (
//                     <Badge className="bg-green-600 text-white">
//                       Best Saving
//                     </Badge>
//                   )}
//                   {rec.isNeutral && (
//                     <Badge variant="secondary">Same Cost</Badge>
//                   )}
//                 </div>
//                 <p className="text-sm text-muted-foreground">
//                   {rec.description}
//                 </p>
//               </div>

//               <div className="text-right">
//                 <div className="flex items-center justify-end gap-1">
//                   {rec.isSaving && (
//                     <TrendingUp className="w-5 h-5 text-green-600" />
//                   )}
//                   {rec.isLoss && (
//                     <TrendingDown className="w-5 h-5 text-red-600" />
//                   )}
//                   <div
//                     className={`text-2xl font-bold ${
//                       rec.isSaving
//                         ? "text-green-600"
//                         : rec.isLoss
//                         ? "text-red-600"
//                         : "text-muted-foreground"
//                     }`}
//                   >
//                     ${rec.amount}
//                     <span className="text-xs font-normal text-muted-foreground block">
//                       {rec.label} / month
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Only show current bill summary if we have data */}
//       {currentSpend > 0 && (
//         <Card className="p-4 bg-muted/30 space-y-3">
//           <h4 className="font-semibold text-foreground flex items-center gap-2">
//             <Zap className="w-4 h-4 text-accent" />
//             Current Bill Summary
//           </h4>
//           <div className="grid grid-cols-2 gap-3 text-sm">
//             <div>
//               <p className="text-muted-foreground text-xs">
//                 Current Monthly Spend (ex GST)
//               </p>
//               <p className="font-semibold">${currentSpend.toFixed(2)}</p>
//             </div>
//             {currentServices.length > 0 && (
//               <div className="col-span-2">
//                 <p className="text-muted-foreground text-xs mb-2">
//                   Detected Services
//                 </p>
//                 <ul className="space-y-1">
//                   {currentServices.slice(0, 5).map((service, idx) => (
//                     <li key={idx} className="flex items-start gap-2">
//                       <CheckCircle2 className="w-3 h-3 mt-1 flex-shrink-0 text-muted-foreground" />
//                       <span className="text-xs">{service}</span>
//                     </li>
//                   ))}
//                   {currentServices.length > 5 && (
//                     <li className="text-xs text-muted-foreground">
//                       + {currentServices.length - 5} more
//                     </li>
//                   )}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </Card>
//       )}

//       {/* Optional: Show warning if no savings found but had recommendations with loss */}
//       {!hasAnyRealSaving && recommendations.length > 0 && (
//         <Card className="p-4 border-orange-300 bg-orange-50 dark:bg-orange-950/30">
//           <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
//             <AlertCircle className="w-5 h-5" />
//             <p className="text-sm">
//               No cheaper plans found. Your current provider may have the best
//               rate.
//             </p>
//           </div>
//         </Card>
//       )}
//     </div>
//   );
// }
"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";

interface BillAnalysisProps {
  rawGrokOutput?: any;
  recommendations?: Array<{
    name?: string;
    description?: string;
    new_monthly_spend_ex_gst?: number;
    saving_ex_gst?: number; // can be positive (saving) or negative (extra cost)
  }>;
  currentServices?: string[];
  isLoading?: boolean;
  onSelect?: (index: number) => void;
}

const GST_RATE = 1.1;

export default function BillAnalysis({
  rawGrokOutput,
  recommendations = [],
  currentServices = [],
  isLoading = false,
  onSelect,
}: BillAnalysisProps) {
  const currentSpend = rawGrokOutput?.current_spend?.monthly_ex_gst || 0;

  const displayRecommendations = recommendations
    .map((rec, idx) => {
      const rawSaving = rec.saving_ex_gst || 0;
      const isSaving = rawSaving > 0;
      const isLoss = rawSaving < 0;
      const isNeutral = rawSaving === 0;

      const displayAmount = Math.abs(Math.round(rawSaving));
      const label = isSaving ? "saving" : isLoss ? "extra cost" : "no change";

      return {
        id: idx,
        name: rec.name || `Option ${idx + 1}`,
        description: rec.description || "Custom plan",
        amount: displayAmount,
        label,
        isSaving,
        isLoss,
        isNeutral,
        highlighted: isSaving && idx === 0, // Only highlight if it's actually a saving
      };
    })
    .filter((rec) => rec.isSaving || rec.isNeutral); // Hide plans that cost more

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 h-24 bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (displayRecommendations.length === 0) {
    return (
      <Card className="p-6 text-center space-y-3">
        <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground" />
        <p className="text-muted-foreground">
          No better plans found. Your current plan may already be competitive.
        </p>
      </Card>
    );
  }

  const hasAnyRealSaving = displayRecommendations.some((r) => r.isSaving);

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {displayRecommendations.map((rec) => (
          <Card
            key={rec.id}
            className={`p-4 transition-all ${
              rec.highlighted
                ? "border-green-500 border-2 bg-green-50 dark:bg-green-950/30"
                : "hover:border-accent/50"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{rec.name}</h3>
                  {rec.highlighted && (
                    <Badge className="bg-green-600 text-white">
                      Best Saving
                    </Badge>
                  )}
                  {rec.isNeutral && (
                    <Badge variant="secondary">Same Cost</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {rec.description}
                </p>
              </div>

              <div className="text-right space-y-1">
                <div className="flex items-center justify-end gap-1">
                  {rec.isSaving && (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  )}
                  {rec.isLoss && (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                  <div
                    className={`text-2xl font-bold ${
                      rec.isSaving
                        ? "text-green-600"
                        : rec.isLoss
                          ? "text-red-600"
                          : "text-muted-foreground"
                    }`}
                  >
                    ${rec.amount}
                    <span className="text-xs font-normal text-muted-foreground block">
                      {rec.label} / month ex GST
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelect?.(rec.id)}
                >
                  Select
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Only show current bill summary if we have data */}
      {currentSpend > 0 && (
        <Card className="p-4 bg-muted/30 space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            Current Bill Summary
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">
                Current Monthly Spend ex GST
              </p>
              <p className="font-semibold">${currentSpend.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">
                inc ${(currentSpend * GST_RATE).toFixed(2)}
              </p>
            </div>
            {currentServices.length > 0 && (
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs mb-2">
                  Detected Services
                </p>
                <ul className="space-y-1">
                  {currentServices.slice(0, 5).map((service, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 mt-1 flex-shrink-0 text-muted-foreground" />
                      <span className="text-xs">{service}</span>
                    </li>
                  ))}
                  {currentServices.length > 5 && (
                    <li className="text-xs text-muted-foreground">
                      + {currentServices.length - 5} more
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Optional: Show warning if no savings found but had recommendations with loss */}
      {!hasAnyRealSaving && recommendations.length > 0 && (
        <Card className="p-4 border-orange-300 bg-orange-50 dark:bg-orange-950/30">
          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">
              No cheaper plans found. Your current provider may have the best
              rate.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
