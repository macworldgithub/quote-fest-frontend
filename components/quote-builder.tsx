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

  // Add line modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLine, setNewLine] = useState({
    desc: "",
    qty: 1,
    unit_ex: 0.0,
    cadence: "monthly" as "monthly" | "once-off",
  });

  // Editing state for lines: track which line is being edited and its local data
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedLines, setEditedLines] = useState<Record<number, any>>({});

  const toast = simpleToast;

  const raw = quote?.raw_grok_output;
  const currentSpendEx = quote?.current_spend_ex || 0;
  const selectedLines = quote?.selected_lines || [];

  const newMonthlyEx = selectedLines
    .filter((line: any) => line.cadence?.toLowerCase() === "monthly")
    .reduce(
      (sum: number, line: any) => sum + (line.qty || 1) * (line.unit_ex || 0),
      0
    );

  const monthlySavingEx = currentSpendEx - newMonthlyEx;

  const currentServices =
    raw?.current_spend?.breakdown?.map((b: any) => b.service) || [];

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
      // await updateQuoteStatus(quoteId, "Sent");
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
    // toast({ title: "Success", description: "Customer details saved!" });
  };

  // Start editing a line
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditedLines((prev) => ({
      ...prev,
      [index]: { ...selectedLines[index] },
    }));
  };

  // Update local edited line
  const updateEditedLine = (index: number, updates: Partial<any>) => {
    setEditedLines((prev) => ({
      ...prev,
      [index]: { ...prev[index], ...updates },
    }));
  };

  // Save edited line
  const saveEditedLine = async (index: number) => {
    const lineData = editedLines[index];
    if (!lineData) return;

    try {
      const updatedQuote = await updateLineItem(quoteId, index, lineData);
      setQuote(updatedQuote);
      setEditingIndex(null);
      setEditedLines((prev) => {
        const { [index]: _, ...rest } = prev;
        return rest;
      });
      toast({ title: "Line updated successfully" });
    } catch (error) {
      toast({ title: "Failed to update line", variant: "destructive" });
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingIndex(null);
    setEditedLines({});
  };

  // Delete line with confirmation
  const handleDeleteLine = async (index: number) => {
    if (window.confirm("Are you sure you want to delete this line item?")) {
      try {
        const updatedQuote = await removeLineItem(quoteId, index);
        setQuote(updatedQuote);
        toast({ title: "Line removed" });
      } catch (error) {
        toast({ title: "Failed to remove line", variant: "destructive" });
      }
    }
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
                  onClick={() => setShowAddModal(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Line
                </Button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedLines.map((item: any, idx: number) => {
                  const isEditing = editingIndex === idx;
                  const displayItem = isEditing
                    ? editedLines[idx] || item
                    : item;

                  return (
                    <Card key={idx} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-3">
                          <Input
                            placeholder="Description"
                            value={displayItem.desc || ""}
                            onChange={(e) =>
                              updateEditedLine(idx, { desc: e.target.value })
                            }
                            disabled={!isEditing}
                            className="text-sm"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <Input
                              type="number"
                              placeholder="Qty"
                              value={displayItem.qty || 1}
                              onChange={(e) =>
                                updateEditedLine(idx, {
                                  qty: Number(e.target.value) || 1,
                                })
                              }
                              disabled={!isEditing}
                              className="text-sm"
                            />
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Unit Price (ex GST)"
                              value={displayItem.unit_ex || 0}
                              onChange={(e) =>
                                updateEditedLine(idx, {
                                  unit_ex: Number(e.target.value) || 0,
                                })
                              }
                              disabled={!isEditing}
                              className="text-sm"
                            />
                            <select
                              value={displayItem.cadence || "monthly"}
                              onChange={(e) =>
                                updateEditedLine(idx, {
                                  cadence: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              className="text-sm px-3 py-2 rounded border border-input bg-background disabled:opacity-50"
                            >
                              <option value="monthly">Monthly</option>
                              <option value="once-off">Once-off</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => saveEditedLine(idx)}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEditing}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditing(idx)}
                            >
                              Edit
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteLine(idx)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Add Line Modal */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-md p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Add New Line Item</h3>
                  <Input
                    placeholder="Description (required)"
                    value={newLine.desc}
                    onChange={(e) =>
                      setNewLine({ ...newLine, desc: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={newLine.qty}
                      onChange={(e) =>
                        setNewLine({
                          ...newLine,
                          qty: Number(e.target.value) || 1,
                        })
                      }
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Unit Price (ex GST)"
                      value={newLine.unit_ex}
                      onChange={(e) =>
                        setNewLine({
                          ...newLine,
                          unit_ex: Number(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <select
                    value={newLine.cadence}
                    onChange={(e) =>
                      setNewLine({
                        ...newLine,
                        cadence: e.target.value as "monthly" | "once-off",
                      })
                    }
                    className="w-full px-3 py-2 rounded border border-input bg-background"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="once-off">Once-off</option>
                  </select>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={async () => {
                        if (!newLine.desc.trim()) {
                          toast({
                            title: "Description required",
                            variant: "destructive",
                          });
                          return;
                        }
                        try {
                          const updatedQuote = await addAdhocLineItem(
                            quoteId,
                            newLine.desc,
                            newLine.qty,
                            newLine.unit_ex,
                            newLine.cadence
                          );
                          setQuote(updatedQuote);
                          setShowAddModal(false);
                          setNewLine({
                            desc: "",
                            qty: 1,
                            unit_ex: 0,
                            cadence: "monthly",
                          });
                          toast({ title: "Line added successfully" });
                        } catch (error) {
                          toast({
                            title: "Failed to add line",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      Add Line
                    </Button>
                  </div>
                </Card>
              </div>
            )}

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
                <span>
                  Monthly {monthlySavingEx >= 0 ? "saving" : "extra cost"}:
                </span>
                <span
                  className={
                    monthlySavingEx >= 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  ${Math.abs(monthlySavingEx).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span>
                  24-month {monthlySavingEx >= 0 ? "saving" : "extra cost"}:
                </span>
                <span
                  className={
                    monthlySavingEx >= 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  ${(Math.abs(monthlySavingEx) * 24).toFixed(2)}
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
