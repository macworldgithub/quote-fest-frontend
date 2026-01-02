// "use client";

// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Zap, CheckCircle2, AlertCircle } from "lucide-react";

// interface Recommendation {
//   name?: string;
//   description?: string;
//   new_monthly_ex?: number;
//   saving?: number;
//   items?: Array<any>;
//   [key: string]: any;
// }

// interface BillAnalysisProps {
//   recommendations?: Recommendation[];
//   currentSpend?: number;
//   currentServices?: string[];
//   isLoading?: boolean;
// }

// export default function BillAnalysis({
//   recommendations = [],
//   currentSpend = 0,
//   currentServices = [],
//   isLoading = false,
// }: BillAnalysisProps) {
//   const displayRecommendations = recommendations
//     .slice(0, 3)
//     .map((rec, idx) => ({
//       id: idx,
//       name: rec.name || `Option ${idx + 1}`,
//       description: rec.description || "Custom plan",
//       savings: Math.max(
//         0,
//         Math.round(currentSpend - (rec.new_monthly_ex || 0))
//       ),
//       period: "/month",
//       highlighted: idx === 0,
//     }));

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
//           No recommendations yet. Upload a bill to get started.
//         </p>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <div className="grid gap-3">
//         {displayRecommendations.map((rec) => (
//           <Card
//             key={rec.id}
//             className={`p-4 cursor-pointer transition-all ${
//               rec.highlighted
//                 ? "border-accent border-2 bg-accent/5"
//                 : "hover:border-accent/50"
//             }`}
//           >
//             <div className="flex items-start justify-between gap-3">
//               <div className="flex-1 space-y-1">
//                 <div className="flex items-center gap-2">
//                   <h3 className="font-semibold text-foreground">{rec.name}</h3>
//                   {rec.highlighted && (
//                     <Badge className="bg-accent text-accent-foreground">
//                       Recommended
//                     </Badge>
//                   )}
//                 </div>
//                 <p className="text-sm text-muted-foreground">
//                   {rec.description}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <div className="text-2xl font-bold text-accent">
//                   ${rec.savings}
//                   <span className="text-xs text-muted-foreground font-normal">
//                     {rec.period}
//                   </span>
//                 </div>
//                 <p className="text-xs text-muted-foreground">in savings</p>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {currentSpend > 0 && (
//         <Card className="p-4 bg-muted/30 space-y-3">
//           <h4 className="font-semibold text-foreground flex items-center gap-2">
//             <Zap className="w-4 h-4 text-accent" />
//             Extracted from Bill
//           </h4>
//           <div className="grid grid-cols-2 gap-3 text-sm">
//             <div>
//               <p className="text-muted-foreground text-xs">Current MRC</p>
//               <p className="font-semibold">${currentSpend.toFixed(2)}</p>
//             </div>
//             {currentServices.length > 0 && (
//               <div className="col-span-2">
//                 <p className="text-muted-foreground text-xs mb-2">
//                   Detected Services
//                 </p>
//                 <ul className="space-y-1">
//                   {currentServices.slice(0, 3).map((service, idx) => (
//                     <li key={idx} className="flex items-start gap-2">
//                       <CheckCircle2 className="w-3 h-3 mt-1 flex-shrink-0 text-muted-foreground" />
//                       <span className="text-xs">{service}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </Card>
//       )}
//     </div>
//   );
// }
"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, CheckCircle2, AlertCircle } from "lucide-react";

interface BillAnalysisProps {
  rawGrokOutput?: any;
  recommendations?: Array<{
    name?: string;
    description?: string;
    new_monthly_spend_ex_gst?: number;
    saving_ex_gst?: number;
  }>;
  currentServices?: string[];
  isLoading?: boolean;
}

export default function BillAnalysis({
  rawGrokOutput,
  recommendations = [],
  currentServices = [],
  isLoading = false,
}: BillAnalysisProps) {
  const currentSpend = rawGrokOutput?.current_spend?.monthly_ex_gst || 0;

  const displayRecommendations = recommendations
    .slice(0, 3)
    .map((rec, idx) => ({
      id: idx,
      name: rec.name || `Option ${idx + 1}`,
      description: rec.description || "Custom plan",
      savings: Math.round(rec.saving_ex_gst || 0),
      period: "/month",
      highlighted: idx === 0,
    }));

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
          No recommendations yet. Upload a bill to get started.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {displayRecommendations.map((rec) => (
          <Card
            key={rec.id}
            className={`p-4 cursor-pointer transition-all ${
              rec.highlighted
                ? "border-accent border-2 bg-accent/5"
                : "hover:border-accent/50"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{rec.name}</h3>
                  {rec.highlighted && (
                    <Badge className="bg-accent text-accent-foreground">
                      Recommended
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {rec.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-accent">
                  ${rec.savings}
                  <span className="text-xs text-muted-foreground font-normal">
                    {rec.period}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">in savings</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {currentSpend > 0 && (
        <Card className="p-4 bg-muted/30 space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            Extracted from Bill
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">
                Current MRC (ex GST)
              </p>
              <p className="font-semibold">${currentSpend.toFixed(2)}</p>
            </div>
            {currentServices.length > 0 && (
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs mb-2">
                  Detected Services
                </p>
                <ul className="space-y-1">
                  {currentServices.slice(0, 3).map((service, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 mt-1 flex-shrink-0 text-muted-foreground" />
                      <span className="text-xs">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
