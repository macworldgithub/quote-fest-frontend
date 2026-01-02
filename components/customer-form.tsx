// "use client";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useCallback, useEffect, useState } from "react";

// interface CustomerFormProps {
//   initialData?: Record<string, any>;
//   quoteId?: string;
//   onChange?: (value: any) => void;
// }

// export default function CustomerForm({
//   initialData = {},
//   quoteId,
//   onChange,
// }: CustomerFormProps) {
//   const [value, setValue] = useState(initialData);

//   useEffect(() => {
//     setValue(initialData);
//   }, [initialData]);

//   const handleChange = useCallback(
//     (field: string, val: string) => {
//       const updated = { ...value, [field]: val };
//       setValue(updated);
//       onChange?.(updated);
//     },
//     [value, onChange]
//   );

//   const mapField = (key: string) => {
//     // Handle flexible Grok output field names
//     const mappings: Record<string, string[]> = {
//       company: ["company", "company_name"],
//       abn: ["abn", "acn"],
//       siteAddress: ["site_address", "address"],
//       billingAddress: ["billing_address"],
//       mainContact: ["main_contact_name", "contact_name"],
//       mainContactEmail: ["main_contact_email", "email"],
//       mainContactPhone: ["main_contact_phone", "phone"],
//     };
//     return mappings[key] || [key];
//   };

//   const getField = (key: string) => {
//     const mappings = mapField(key);
//     for (const m of mappings) {
//       if (value[m]) return value[m];
//     }
//     return value[key] || "";
//   };

//   return (
//     <div className="space-y-4">
//       <div className="grid gap-3">
//         <div>
//           <Label htmlFor="company" className="text-sm">
//             Company Name
//           </Label>
//           <Input
//             id="company"
//             value={getField("company")}
//             onChange={(e) => handleChange("company", e.target.value)}
//             className="mt-1"
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-3">
//           <div>
//             <Label htmlFor="abn" className="text-sm">
//               ABN / ACN
//             </Label>
//             <Input
//               id="abn"
//               value={getField("abn")}
//               onChange={(e) => handleChange("abn", e.target.value)}
//               className="mt-1"
//             />
//           </div>
//           <div>
//             <Label htmlFor="contact" className="text-sm">
//               Contact Name
//             </Label>
//             <Input
//               id="contact"
//               value={getField("mainContact")}
//               onChange={(e) => handleChange("mainContact", e.target.value)}
//               className="mt-1"
//             />
//           </div>
//         </div>

//         <div>
//           <Label htmlFor="site" className="text-sm">
//             Site Address
//           </Label>
//           <Input
//             id="site"
//             value={getField("siteAddress")}
//             onChange={(e) => handleChange("siteAddress", e.target.value)}
//             className="mt-1"
//           />
//         </div>

//         <div>
//           <Label htmlFor="billing" className="text-sm">
//             Billing Address
//           </Label>
//           <Input
//             id="billing"
//             value={getField("billingAddress")}
//             onChange={(e) => handleChange("billingAddress", e.target.value)}
//             className="mt-1"
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-3">
//           <div>
//             <Label htmlFor="email" className="text-sm">
//               Email
//             </Label>
//             <Input
//               id="email"
//               type="email"
//               value={getField("mainContactEmail")}
//               onChange={(e) => handleChange("mainContactEmail", e.target.value)}
//               className="mt-1"
//             />
//           </div>
//           <div>
//             <Label htmlFor="phone" className="text-sm">
//               Phone
//             </Label>
//             <Input
//               id="phone"
//               type="tel"
//               value={getField("mainContactPhone")}
//               onChange={(e) => handleChange("mainContactPhone", e.target.value)}
//               className="mt-1"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useState } from "react";

interface CustomerFormProps {
  initialData?: Record<string, any>;
}

export default function CustomerForm({ initialData = {} }: CustomerFormProps) {
  const [value, setValue] = useState<Record<string, any>>(initialData);

  // Sync when initialData changes (e.g. from parent)
  useEffect(() => {
    setValue(initialData || {});
  }, [initialData]);

  const handleChange = useCallback((field: string, val: string) => {
    setValue((prev) => ({ ...prev, [field]: val }));
  }, []);

  /**
   * Safely extracts a clean string value from multiple possible keys.
   * Handles: strings, numbers, null, undefined, "Not Provided", "N/A", empty strings.
   */
  const getValue = (keys: string[]): string => {
    for (const key of keys) {
      const rawVal = value[key];

      // Skip missing or explicitly empty values
      if (rawVal === undefined || rawVal === null) {
        continue;
      }
      // Inside getValue function in CustomerForm.tsx — add this block:
      if (typeof rawVal === "object" && rawVal !== null) {
        const parts: string[] = [];
        if (rawVal.street || rawVal.line1)
          parts.push(rawVal.street || rawVal.line1);
        if (rawVal.suburb || rawVal.city)
          parts.push(rawVal.suburb || rawVal.city);
        if (rawVal.state) parts.push(rawVal.state);
        if (rawVal.postcode || rawVal.zip)
          parts.push(rawVal.postcode || rawVal.zip);
        if (parts.length > 0) return parts.join(", ");
      }
      // Convert to string safely
      const strVal = String(rawVal);

      // Skip known placeholder values
      if (
        strVal === "Not Provided" ||
        strVal === "N/A" ||
        strVal === "null" ||
        strVal === "undefined"
      ) {
        continue;
      }

      // Trim and check if non-empty
      const trimmed = strVal.trim();
      if (trimmed !== "") {
        return trimmed;
      }
    }

    return "";
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {/* Company Name */}
        <div>
          <Label htmlFor="company" className="text-sm">
            Company Name
          </Label>
          <Input
            id="company"
            value={getValue(["company", "company_name"])}
            onChange={(e) => handleChange("company", e.target.value)}
            placeholder="e.g. Nursing Centred Care Australia"
            className="mt-1"
          />
        </div>

        {/* ABN & Contact Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="abn" className="text-sm">
              ABN / ACN
            </Label>
            <Input
              id="abn"
              value={getValue(["abn", "acn"])}
              onChange={(e) => handleChange("abn", e.target.value)}
              placeholder="e.g. 96 094 300 311"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="contact" className="text-sm">
              Main Contact Name
            </Label>
            <Input
              id="contact"
              value={getValue(["main_contact_name", "contact_name"])}
              onChange={(e) =>
                handleChange("main_contact_name", e.target.value)
              }
              placeholder="Enter decision maker name"
              className="mt-1"
            />
          </div>
        </div>

        {/* Site Address */}
        <div>
          <Label htmlFor="site" className="text-sm">
            Site Address
          </Label>
          <Input
            id="site"
            value={getValue(["site_address", "address"])}
            onChange={(e) => handleChange("site_address", e.target.value)}
            placeholder="e.g. 307 Peachey Rd, Munno Para SA 5115"
            className="mt-1"
          />
        </div>

        {/* Billing Address */}
        <div>
          <Label htmlFor="billing" className="text-sm">
            Billing Address
          </Label>
          <Input
            id="billing"
            value={getValue(["billing_address"])}
            onChange={(e) => handleChange("billing_address", e.target.value)}
            placeholder="Usually same as site address"
            className="mt-1"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email" className="text-sm">
              Main Contact Email
            </Label>
            <Input
              id="email"
              type="email"
              value={getValue(["main_contact_email", "email"])}
              onChange={(e) =>
                handleChange("main_contact_email", e.target.value)
              }
              placeholder="e.g. john@example.com (required for sending)"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm">
              Main Contact Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={getValue([
                "main_contact_phone",
                "main_contact_number",
                "phone",
              ])}
              onChange={(e) =>
                handleChange("main_contact_phone", e.target.value)
              }
              placeholder="e.g. 1800 946 835"
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
