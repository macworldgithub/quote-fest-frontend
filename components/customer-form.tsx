"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCallback, useEffect, useState } from "react"

interface CustomerFormProps {
  initialData?: Record<string, any>
  quoteId?: string
  onChange?: (value: any) => void
}

export default function CustomerForm({ initialData = {}, quoteId, onChange }: CustomerFormProps) {
  const [value, setValue] = useState(initialData)

  useEffect(() => {
    setValue(initialData)
  }, [initialData])

  const handleChange = useCallback(
    (field: string, val: string) => {
      const updated = { ...value, [field]: val }
      setValue(updated)
      onChange?.(updated)
    },
    [value, onChange],
  )

  const mapField = (key: string) => {
    // Handle flexible Grok output field names
    const mappings: Record<string, string[]> = {
      company: ["company", "company_name"],
      abn: ["abn", "acn"],
      siteAddress: ["site_address", "address"],
      billingAddress: ["billing_address"],
      mainContact: ["main_contact_name", "contact_name"],
      mainContactEmail: ["main_contact_email", "email"],
      mainContactPhone: ["main_contact_phone", "phone"],
    }
    return mappings[key] || [key]
  }

  const getField = (key: string) => {
    const mappings = mapField(key)
    for (const m of mappings) {
      if (value[m]) return value[m]
    }
    return value[key] || ""
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <div>
          <Label htmlFor="company" className="text-sm">
            Company Name
          </Label>
          <Input
            id="company"
            value={getField("company")}
            onChange={(e) => handleChange("company", e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="abn" className="text-sm">
              ABN / ACN
            </Label>
            <Input
              id="abn"
              value={getField("abn")}
              onChange={(e) => handleChange("abn", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="contact" className="text-sm">
              Contact Name
            </Label>
            <Input
              id="contact"
              value={getField("mainContact")}
              onChange={(e) => handleChange("mainContact", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="site" className="text-sm">
            Site Address
          </Label>
          <Input
            id="site"
            value={getField("siteAddress")}
            onChange={(e) => handleChange("siteAddress", e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="billing" className="text-sm">
            Billing Address
          </Label>
          <Input
            id="billing"
            value={getField("billingAddress")}
            onChange={(e) => handleChange("billingAddress", e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={getField("mainContactEmail")}
              onChange={(e) => handleChange("mainContactEmail", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={getField("mainContactPhone")}
              onChange={(e) => handleChange("mainContactPhone", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
