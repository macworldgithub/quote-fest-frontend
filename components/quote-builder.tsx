// "use client";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ArrowLeft, Send, Plus, Minus, Loader2, Download } from "lucide-react";
// import BillAnalysis from "@/components/bill-analysis";
// import QuotePreview from "@/components/quote-preview";
// import CustomerForm from "@/components/customer-form";
// import {
//   getQuote,
//   updateLineItem,
//   removeLineItem,
//   addAdhocLineItem,
//   getPDF,
//   getCSV,
//   sendEmail,
//   updateQuoteStatus,
// } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";

// interface QuoteBuilderProps {
//   quoteId: string;
//   onBack: () => void;
// }

// export default function QuoteBuilder({ quoteId, onBack }: QuoteBuilderProps) {
//   const [stage, setStage] = useState<
//     "analysis" | "customer" | "lines" | "preview"
//   >("analysis");
//   const [quote, setQuote] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSending, setIsSending] = useState(false);
//   const { toast } = useToast();

//   const raw = quote?.raw_grok_output;
//   const currentSpendEx =
//     raw?.current_spend?.monthly_ex_gst || quote?.current_spend_ex || 0;
//   const recommendations = quote?.recommendations || [];
//   const recommendedPlan = recommendations[0] || {};
//   const newMonthlyEx =
//     recommendedPlan.new_monthly_spend_ex_gst || quote?.new_monthly_ex || 0;
//   const monthlySavingEx =
//     recommendedPlan.saving_ex_gst || quote?.monthly_saving_ex || 0;

//   const defaultLines =
//     recommendedPlan.line_items?.map((item: any) => ({
//       sku: item.sku,
//       desc: item.desc,
//       qty: item.qty,
//       unit_ex: item.unit_ex,
//       cadence: item.cadence || "monthly",
//       haas_term: null,
//     })) || [];

//   const selectedLines =
//     quote?.selected_lines?.length > 0 ? quote.selected_lines : defaultLines;
//   const currentServices =
//     raw?.current_spend?.breakdown?.map((b: any) => b.service) || [];

//   // Determine best customer data: use saved one if meaningfully filled, else fall back to extracted
//   const getCustomerData = () => {
//     const saved = quote?.customer || {};
//     const extracted = raw?.customer_info || {};
//     const savedHasData =
//       saved &&
//       Object.keys(saved).length > 1 &&
//       (saved.company || saved.main_contact_email);
//     return savedHasData ? saved : extracted;
//   };

//   useEffect(() => {
//     const loadQuote = async () => {
//       try {
//         const data = await getQuote(quoteId);
//         setQuote(data);
//       } catch (error) {
//         toast({
//           title: "Error loading quote",
//           description:
//             error instanceof Error ? error.message : "Failed to load quote",
//           variant: "destructive",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadQuote();
//   }, [quoteId, toast]);

//   const handleUpdateLine = async (
//     index: number,
//     updates: Record<string, any>
//   ) => {
//     try {
//       const updated = await updateLineItem(quoteId, index, updates);
//       setQuote(updated);
//     } catch (error) {
//       toast({ title: "Error updating line", variant: "destructive" });
//     }
//   };

//   const handleRemoveLine = async (index: number) => {
//     try {
//       const updated = await removeLineItem(quoteId, index);
//       setQuote(updated);
//     } catch (error) {
//       toast({ title: "Error removing line", variant: "destructive" });
//     }
//   };

//   const handleAddLine = async () => {
//     try {
//       const updated = await addAdhocLineItem(
//         quoteId,
//         "New Service",
//         1,
//         0,
//         "monthly"
//       );
//       setQuote(updated);
//     } catch (error) {
//       toast({ title: "Error adding line", variant: "destructive" });
//     }
//   };

//   const handleSendQuote = async () => {
//     const customerData = getCustomerData();
//     const email = customerData.main_contact_email || customerData.email;
//     if (!email) {
//       toast({
//         title: "Missing email",
//         description: "Please enter a valid contact email before sending",
//         variant: "destructive",
//       });
//       return;
//     }
//     setIsSending(true);
//     try {
//       await sendEmail(quoteId, email);
//       await updateQuoteStatus(quoteId, "Sent");
//       setQuote((prev: any) => ({ ...prev, status: "Sent" }));
//       toast({ title: "Quote sent!", description: `Email sent to ${email}` });
//     } catch (error) {
//       toast({ title: "Failed to send", variant: "destructive" });
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const handleDownloadPDF = async () => {
//     try {
//       const blob = await getPDF(quoteId);
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `Quote_${quoteId.slice(0, 8)}.pdf`;
//       a.click();
//       URL.revokeObjectURL(url);
//     } catch {
//       toast({ title: "PDF download failed", variant: "destructive" });
//     }
//   };

//   const handleDownloadCSV = async () => {
//     try {
//       const blob = await getCSV(quoteId);
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `Quote_${quoteId.slice(0, 8)}.csv`;
//       a.click();
//       URL.revokeObjectURL(url);
//     } catch {
//       toast({ title: "CSV download failed", variant: "destructive" });
//     }
//   };

//   if (isLoading)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin" />
//       </div>
//     );
//   if (!quote)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Quote not found</p>
//         <Button onClick={onBack}>Back</Button>
//       </div>
//     );

//   const stageButtons = (
//     <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
//       {stage !== "analysis" && (
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() =>
//             setStage(
//               stage === "customer"
//                 ? "analysis"
//                 : stage === "lines"
//                 ? "customer"
//                 : "lines"
//             )
//           }
//         >
//           ← Previous
//         </Button>
//       )}
//       {stage !== "preview" && (
//         <Button
//           size="sm"
//           onClick={() =>
//             setStage(
//               stage === "analysis"
//                 ? "customer"
//                 : stage === "customer"
//                 ? "lines"
//                 : "preview"
//             )
//           }
//           className="ml-auto"
//         >
//           Next →
//         </Button>
//       )}
//       {stage === "preview" && (
//         <Button size="sm" variant="outline" onClick={() => setStage("lines")}>
//           ← Edit
//         </Button>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="sticky top-0 z-40 border-b bg-card/50 backdrop-blur">
//         <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
//           <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
//             <ArrowLeft className="w-4 h-4" /> Dashboard
//           </Button>
//           <div className="text-sm font-medium text-muted-foreground">
//             Quote #{quoteId.slice(0, 8).toUpperCase()}
//           </div>
//           <div className="w-20" />
//         </div>
//       </div>

//       <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
//         <Tabs value={stage} onValueChange={(v) => setStage(v as any)}>
//           <TabsList className="grid w-full grid-cols-4 mb-6">
//             <TabsTrigger value="analysis">Analysis</TabsTrigger>
//             <TabsTrigger value="customer">Customer</TabsTrigger>
//             <TabsTrigger value="lines">Lines</TabsTrigger>
//             <TabsTrigger value="preview">Preview</TabsTrigger>
//           </TabsList>

//           <TabsContent value="analysis" className="space-y-4">
//             <BillAnalysis
//               rawGrokOutput={raw}
//               recommendations={recommendations}
//               currentServices={currentServices}
//             />
//             {stageButtons}
//           </TabsContent>

//           <TabsContent value="customer" className="space-y-4">
//             <CustomerForm initialData={getCustomerData()} />
//             {stageButtons}
//           </TabsContent>

//           <TabsContent value="lines" className="space-y-4">
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <h3 className="font-semibold">Quote Lines</h3>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={handleAddLine}
//                   className="gap-2"
//                 >
//                   <Plus className="w-4 h-4" /> Add Line
//                 </Button>
//               </div>
//               <div className="space-y-2 max-h-96 overflow-y-auto">
//                 {selectedLines.map((item: any, idx: number) => (
//                   <Card key={idx} className="p-4 space-y-3">
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="flex-1 space-y-2">
//                         <Input
//                           value={item.desc || ""}
//                           onChange={(e) =>
//                             handleUpdateLine(idx, { desc: e.target.value })
//                           }
//                           className="text-sm"
//                         />
//                         <div className="grid grid-cols-3 gap-2">
//                           <Input
//                             type="number"
//                             value={item.qty || 1}
//                             onChange={(e) =>
//                               handleUpdateLine(idx, {
//                                 qty: Number(e.target.value) || 0,
//                               })
//                             }
//                             className="text-sm"
//                           />
//                           <Input
//                             type="number"
//                             step="0.01"
//                             value={item.unit_ex || 0}
//                             onChange={(e) =>
//                               handleUpdateLine(idx, {
//                                 unit_ex: Number(e.target.value) || 0,
//                               })
//                             }
//                             className="text-sm"
//                           />
//                           <select
//                             value={item.cadence || "monthly"}
//                             onChange={(e) =>
//                               handleUpdateLine(idx, { cadence: e.target.value })
//                             }
//                             className="text-sm px-2 py-2 rounded border border-input bg-background"
//                           >
//                             <option value="monthly">Monthly</option>
//                             <option value="once-off">Once-off</option>
//                           </select>
//                         </div>
//                       </div>
//                       <Button
//                         size="sm"
//                         variant="ghost"
//                         onClick={() => handleRemoveLine(idx)}
//                         className="text-destructive"
//                       >
//                         <Minus className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             </div>

//             <Card className="p-4 bg-accent/5 border-accent/20 space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-muted-foreground">Current spend:</span>
//                 <span className="font-semibold">
//                   ${currentSpendEx.toFixed(2)}
//                 </span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-muted-foreground">New MRC:</span>
//                 <span className="font-semibold text-accent">
//                   ${newMonthlyEx.toFixed(2)}
//                 </span>
//               </div>
//               <div className="flex justify-between text-sm font-semibold pt-2 border-t border-accent/20">
//                 <span>Monthly saving:</span>
//                 <span className="text-accent">
//                   ${monthlySavingEx.toFixed(2)}
//                 </span>
//               </div>
//               <div className="flex justify-between text-sm font-semibold">
//                 <span>24-month saving:</span>
//                 <span className="text-accent">
//                   ${(monthlySavingEx * 24).toFixed(2)}
//                 </span>
//               </div>
//             </Card>
//             {stageButtons}
//           </TabsContent>

//           <TabsContent value="preview" className="space-y-4">
//             <QuotePreview
//               quote={{
//                 ...quote,
//                 customer: getCustomerData(),
//                 selected_lines: selectedLines,
//                 current_spend_ex: currentSpendEx,
//                 new_monthly_ex: newMonthlyEx,
//                 monthly_saving_ex: monthlySavingEx,
//               }}
//             />
//             <div className="flex flex-col gap-3 pt-4 border-t border-border">
//               <div className="flex gap-2 flex-wrap">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={handleDownloadPDF}
//                   className="gap-2"
//                 >
//                   <Download className="w-4 h-4" /> PDF
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={handleDownloadCSV}
//                   className="gap-2"
//                 >
//                   <Download className="w-4 h-4" /> CSV (Halo)
//                 </Button>
//               </div>
//               <div className="flex gap-3">
//                 <Button
//                   variant="outline"
//                   onClick={() => setStage("lines")}
//                   className="flex-1"
//                 >
//                   ← Edit
//                 </Button>
//                 <Button
//                   onClick={handleSendQuote}
//                   disabled={isSending}
//                   className="flex-1 gap-2"
//                 >
//                   {isSending ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" /> Sending...
//                     </>
//                   ) : (
//                     <>
//                       <Send className="w-4 h-4" /> Send Quote
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Send, Plus, Minus, Loader2, Download } from "lucide-react";
import BillAnalysis from "@/components/bill-analysis";
import QuotePreview from "@/components/quote-preview";
import CustomerForm from "@/components/customer-form";
import {
  getQuote,
  updateLineItem,
  removeLineItem,
  addAdhocLineItem,
  getPDF,
  getCSV,
  sendEmail,
  updateQuoteStatus,
} from "@/lib/api";

// Simple toast fallback
const simpleToast = ({
  title,
  description,
  variant = "default",
}: {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}) => {
  alert(`${title}${description ? `\n${description}` : ""}`);
};

interface QuoteBuilderProps {
  quoteId: string;
  onBack: () => void;
}

export default function QuoteBuilder({ quoteId, onBack }: QuoteBuilderProps) {
  const [stage, setStage] = useState<
    "analysis" | "customer" | "lines" | "preview"
  >("analysis");
  const [quote, setQuote] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const toast = simpleToast;

  const raw = quote?.raw_grok_output;

  // Current spend from bill
  const currentSpendEx = quote?.current_spend_ex || 0;

  // Selected lines (either user-edited or default from first recommendation)
  const selectedLines = quote?.selected_lines || [];

  // Calculate actual new monthly spend from selected lines
  const newMonthlyEx = selectedLines
    .filter((line: any) => line.cadence?.toLowerCase() === "monthly")
    .reduce(
      (sum: number, line: any) => sum + (line.qty || 1) * (line.unit_ex || 0),
      0
    );

  // Actual monthly saving based on selected lines
  const monthlySavingEx = currentSpendEx - newMonthlyEx;

  // Current services extracted from bill
  const currentServices =
    raw?.current_spend?.breakdown?.map((b: any) => b.service) || [];

  // Customer data logic
  const getCustomerData = () => {
    const saved = quote?.customer || {};
    const extracted = raw?.customer_info || {};
    const savedHasData =
      saved &&
      Object.keys(saved).length > 1 &&
      (saved.company || saved.main_contact_email || saved.site_address);
    return savedHasData ? saved : extracted;
  };

  useEffect(() => {
    const loadQuote = async () => {
      try {
        const data = await getQuote(quoteId);
        setQuote(data);
      } catch (error) {
        toast({
          title: "Error loading quote",
          description:
            error instanceof Error ? error.message : "Failed to load quote",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadQuote();
  }, [quoteId]);

  const handleUpdateLine = async (
    index: number,
    updates: Record<string, any>
  ) => {
    try {
      const updated = await updateLineItem(quoteId, index, updates);
      setQuote(updated);
    } catch (error) {
      toast({ title: "Error updating line", variant: "destructive" });
    }
  };

  const handleRemoveLine = async (index: number) => {
    try {
      const updated = await removeLineItem(quoteId, index);
      setQuote(updated);
    } catch (error) {
      toast({ title: "Error removing line", variant: "destructive" });
    }
  };

  const handleAddLine = async () => {
    try {
      const updated = await addAdhocLineItem(
        quoteId,
        "New Service",
        1,
        0,
        "monthly"
      );
      setQuote(updated);
    } catch (error) {
      toast({ title: "Error adding line", variant: "destructive" });
    }
  };

  const handleSendQuote = async () => {
    const customerData = getCustomerData();
    const email = customerData.main_contact_email || customerData.email;
    if (!email || !email.includes("@")) {
      toast({
        title: "Missing valid email",
        description: "Please enter a contact email before sending",
        variant: "destructive",
      });
      return;
    }
    setIsSending(true);
    try {
      await sendEmail(quoteId, email);
      await updateQuoteStatus(quoteId, "Sent");
      setQuote((prev: any) => ({ ...prev, status: "Sent" }));
      toast({ title: "Quote sent!", description: `Email sent to ${email}` });
    } catch (error) {
      toast({ title: "Failed to send quote", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const blob = await getPDF(quoteId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Quote_${quoteId.slice(0, 8).toUpperCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: "PDF download failed", variant: "destructive" });
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const blob = await getCSV(quoteId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Halo_${quoteId.slice(0, 8).toUpperCase()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: "CSV download failed", variant: "destructive" });
    }
  };

  const handleCustomerSaved = () => {
    getQuote(quoteId).then(setQuote);
    toast({ title: "Success", description: "Customer details saved!" });
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );

  if (!quote)
    return (
      <div className="min-h-screen flex items-center justify-center space-y-4">
        <p>Quote not found</p>
        <Button onClick={onBack}>Back to Dashboard</Button>
      </div>
    );

  const stageButtons = (
    <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
      {stage !== "analysis" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setStage(
              stage === "customer"
                ? "analysis"
                : stage === "lines"
                ? "customer"
                : "lines"
            )
          }
        >
          ← Previous
        </Button>
      )}
      {stage !== "preview" && (
        <Button
          size="sm"
          onClick={() =>
            setStage(
              stage === "analysis"
                ? "customer"
                : stage === "customer"
                ? "lines"
                : "preview"
            )
          }
          className="ml-auto"
        >
          Next →
        </Button>
      )}
      {stage === "preview" && (
        <Button size="sm" variant="outline" onClick={() => setStage("lines")}>
          ← Edit Lines
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 border-b bg-card/50 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Button>
          <div className="text-sm font-medium text-muted-foreground">
            Quote #{quoteId.slice(0, 8).toUpperCase()}
          </div>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <Tabs value={stage} onValueChange={(v) => setStage(v as any)}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="lines">Lines</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-4">
            <BillAnalysis
              rawGrokOutput={raw}
              recommendations={quote?.recommendations || []}
              currentServices={currentServices}
            />
            {stageButtons}
          </TabsContent>

          <TabsContent value="customer" className="space-y-4">
            <CustomerForm
              quoteId={quoteId}
              initialData={getCustomerData()}
              onSaved={handleCustomerSaved}
            />
            {stageButtons}
          </TabsContent>

          <TabsContent value="lines" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Quote Lines</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddLine}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Line
                </Button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedLines.map((item: any, idx: number) => (
                  <Card key={idx} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <Input
                          value={item.desc || ""}
                          onChange={(e) =>
                            handleUpdateLine(idx, { desc: e.target.value })
                          }
                          className="text-sm"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            type="number"
                            value={item.qty || 1}
                            onChange={(e) =>
                              handleUpdateLine(idx, {
                                qty: Number(e.target.value) || 0,
                              })
                            }
                            className="text-sm"
                          />
                          <Input
                            type="number"
                            step="0.01"
                            value={item.unit_ex || 0}
                            onChange={(e) =>
                              handleUpdateLine(idx, {
                                unit_ex: Number(e.target.value) || 0,
                              })
                            }
                            className="text-sm"
                          />
                          <select
                            value={item.cadence || "monthly"}
                            onChange={(e) =>
                              handleUpdateLine(idx, { cadence: e.target.value })
                            }
                            className="text-sm px-2 py-2 rounded border border-input bg-background"
                          >
                            <option value="monthly">Monthly</option>
                            <option value="once-off">Once-off</option>
                          </select>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveLine(idx)}
                        className="text-destructive"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="p-4 bg-accent/5 border-accent/20 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current spend:</span>
                <span className="font-semibold">
                  ${currentSpendEx.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">New MRC:</span>
                <span className="font-semibold text-accent">
                  ${newMonthlyEx.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-2 border-t border-accent/20">
                <span>Monthly saving:</span>
                <span
                  className={
                    monthlySavingEx >= 0 ? "text-accent" : "text-destructive"
                  }
                >
                  ${Math.abs(monthlySavingEx).toFixed(2)}
                  {monthlySavingEx < 0 && " (extra cost)"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span>24-month saving:</span>
                <span
                  className={
                    monthlySavingEx >= 0 ? "text-accent" : "text-destructive"
                  }
                >
                  ${(Math.abs(monthlySavingEx) * 24).toFixed(2)}
                  {monthlySavingEx < 0 && " (extra cost)"}
                </span>
              </div>
            </Card>
            {stageButtons}
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <QuotePreview
              quote={{
                ...quote,
                customer: getCustomerData(),
                selected_lines: selectedLines,
                current_spend_ex: currentSpendEx,
                new_monthly_ex: newMonthlyEx,
                monthly_saving_ex: monthlySavingEx,
              }}
            />
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPDF}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" /> PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadCSV}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" /> CSV (Halo)
                </Button>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStage("lines")}
                  className="flex-1"
                >
                  ← Edit Lines
                </Button>
                <Button
                  onClick={handleSendQuote}
                  disabled={isSending}
                  className="flex-1 gap-2"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Quote
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
