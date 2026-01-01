"use client"
import { Separator } from "@/components/ui/separator"

interface QuotePreviewProps {
  quote: any
}

export default function QuotePreview({ quote }: QuotePreviewProps) {
  const customer = quote.customer || {}
  const lineItems = quote.selected_lines || []
  const currentSpend = quote.current_spend_ex || 0
  const newMrc = quote.new_monthly_ex || 0
  const monthlySaving = quote.monthly_saving_ex || 0

  return (
    <div className="space-y-4 bg-white dark:bg-card p-6 rounded-lg border border-border">
      <div className="space-y-1 pb-4 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground">Telco Quote</h2>
        <p className="text-sm text-muted-foreground">
          {customer.type === "Business" ? "Business Solution" : "Residential Solution"}
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Customer Details</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Company</p>
            <p className="font-medium">{customer.company || customer.company_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">ABN</p>
            <p className="font-medium">{customer.abn || customer.acn || "N/A"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground text-xs">Site Address</p>
            <p className="font-medium">{customer.site_address || customer.siteAddress || "N/A"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground text-xs">Contact</p>
            <p className="font-medium">{customer.main_contact_name || customer.mainContact || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Email</p>
            <p className="font-medium text-sm">{customer.main_contact_email || customer.mainContactEmail || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Phone</p>
            <p className="font-medium">{customer.main_contact_phone || customer.mainContactPhone || "N/A"}</p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Quote Lines</h3>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-5 gap-2 font-semibold text-xs text-muted-foreground pb-2 border-b border-border">
            <div className="col-span-2">Description</div>
            <div className="text-right">Qty</div>
            <div className="text-right">Unit (ex-GST)</div>
            <div className="text-right">Total</div>
          </div>
          {lineItems.map((item: any, idx: number) => (
            <div key={idx} className="grid grid-cols-5 gap-2 text-sm">
              <div className="col-span-2">{item.desc || item.description || "Service"}</div>
              <div className="text-right">{item.qty || 1}</div>
              <div className="text-right">${(item.unit_ex || 0).toFixed(2)}</div>
              <div className="text-right font-semibold">${((item.qty || 1) * (item.unit_ex || 0)).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2 p-3 bg-accent/5 rounded border border-accent/20">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Current monthly spend:</span>
          <span className="font-semibold">${currentSpend.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">New monthly recurring:</span>
          <span className="font-semibold text-accent">${newMrc.toFixed(2)}</span>
        </div>
        <Separator className="bg-accent/20" />
        <div className="flex justify-between items-center pt-1">
          <span className="text-foreground font-semibold">Monthly saving:</span>
          <span className="text-lg font-bold text-accent">${monthlySaving.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-foreground font-semibold">24-month saving:</span>
          <span className="text-lg font-bold text-accent">${(monthlySaving * 24).toFixed(2)}</span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
        <p>Valid for 30 days from issue date</p>
        <p>Terms & Conditions apply • NBN availability subject to NBNCO assessment</p>
      </div>
    </div>
  )
}
