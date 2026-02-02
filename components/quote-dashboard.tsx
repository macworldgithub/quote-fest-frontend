"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Pencil,
  FileEdit,
  Edit2,
  Download,
  MoreVertical,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { listQuotes, getPDF, deleteQuote } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface QuoteDashboardProps {
  onNewQuote: () => void;
  onViewQuote?: (quoteId: string) => void;
}

export default function QuoteDashboard({
  onNewQuote,
  onViewQuote,
}: QuoteDashboardProps) {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const data = await listQuotes();
        setQuotes(data);
      } catch (error) {
        console.error("[v0] Failed to load quotes:", error);
        toast({
          title: "Error loading quotes",
          description:
            error instanceof Error ? error.message : "Failed to load quotes",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadQuotes();
  }, [toast]);

  const handleDownloadPDF = async (quoteId: string) => {
    try {
      const blob = await getPDF(quoteId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Quote_${quoteId.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Error downloading PDF",
        description:
          error instanceof Error ? error.message : "Failed to download PDF",
        variant: "destructive",
      });
    }
  };

  const statusColors: Record<string, string> = {
    Draft: "bg-muted text-muted-foreground",
    Sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    Viewed:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    Accepted: "bg-accent text-accent-foreground",
    Lost: "bg-destructive/10 text-destructive",
  };

  const filteredQuotes = quotes.filter((quote) => {
    const company =
      quote.customer?.company || quote.customer?.company_name || "";
    const matchesSearch =
      company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.id.includes(searchTerm);
    const matchesStatus = !statusFilter || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSavings = filteredQuotes.reduce(
    (sum, q) => sum + (q.monthly_saving_ex || 0),
    0,
  );
  const averageSaving =
    filteredQuotes.length > 0 ? totalSavings / filteredQuotes.length : 0;

  const stats = [
    { label: "Total Quotes", value: quotes.length.toString() },
    {
      label: "This Month",
      value: quotes.filter((q) => q.status !== "Draft").length.toString(),
    },
    { label: "Total Savings", value: `$${totalSavings.toFixed(0)}/mo` },
    { label: "Avg Saving", value: `$${averageSaving.toFixed(0)}/mo` },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/belar.jpg"
              alt="Belar Logo"
              className="w-14 h-14 object-contain rounded"
            />
            <h1 className="text-2xl font-bold text-foreground">
              QuoteFast Pro
            </h1>
          </div>
          <Button onClick={onNewQuote} className="gap-2">
            <Plus className="w-4 h-4" />
            New Quote
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {stat.value}
              </p>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by company or quote ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Filter className="w-4 h-4" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Statuses</DropdownMenuItem>
                {["Draft", "Sent", "Viewed", "Accepted", "Lost"].map((status) => (
                  <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>

          {filteredQuotes.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                No quotes found. Create your first quote to get started!
              </p>
              <Button onClick={onNewQuote} className="mt-4 gap-2">
                <Plus className="w-4 h-4" />
                New Quote
              </Button>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr className="text-muted-foreground text-xs font-semibold">
                    <th className="text-left py-3 px-4">Quote ID</th>
                    <th className="text-left py-3 px-4">Customer</th>
                    {/* <th className="text-left py-3 px-4">Status</th> */}
                    <th className="text-left py-3 px-4">Created</th>
                    <th className="text-right py-3 px-4">Monthly Saving</th>
                    <th className="text-right py-3 px-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredQuotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-foreground">
                        #{quote.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="py-3 px-4">
                        {quote.customer?.company ||
                          quote.customer?.company_name ||
                          "N/A"}
                      </td>
                      {/* <td className="py-3 px-4">
                        <Badge
                          className={
                            statusColors[quote.status] || statusColors.Draft
                          }
                        >
                          {quote.status || "Draft"}
                        </Badge>
                      </td> */}
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(quote.created).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-accent">
                        ${(quote.monthly_saving_ex || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          {/* <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() => onViewQuote?.(quote.id)}
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() => handleDownloadPDF(quote.id)}
                            >
                              <Download className="w-4 h-4" />
                              Download PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent> */}
                          <DropdownMenuContent align="end">
                            {/* <DropdownMenuItem
                              className="gap-2"
                              onClick={() => onViewQuote?.(quote.id)}
                            >
                              <Eye className="w-4 h-4" />
                              View/Edit
                            </DropdownMenuItem> */}
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() => onViewQuote?.(quote.id)}
                            >
                              <Pencil className="w-4 h-4" />
                              View / Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() => handleDownloadPDF(quote.id)}
                            >
                              <Download className="w-4 h-4" />
                              Download PDF
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="gap-2 text-destructive focus:text-destructive"
                              onClick={async () => {
                                if (
                                  !confirm(
                                    "Are you sure you want to delete this quote? This cannot be undone.",
                                  )
                                ) {
                                  return;
                                }
                                try {
                                  await deleteQuote(quote.id);
                                  toast({
                                    title: "Quote deleted",
                                    description:
                                      "The quote has been permanently removed.",
                                  });
                                  // Refresh the list
                                  const data = await listQuotes();
                                  setQuotes(data);
                                } catch (error) {
                                  toast({
                                    title: "Failed to delete",
                                    description:
                                      error instanceof Error
                                        ? error.message
                                        : "Could not delete quote",
                                    variant: "destructive",
                                  });
                                }
                              }}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete Quote
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
