// "use client";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { useCallback, useEffect, useState } from "react";
// import { updateCustomer } from "@/lib/api"; // ← Import from your API file

// interface CustomerFormProps {
//   quoteId: string; // REQUIRED
//   initialData?: Record<string, any>;
//   onSaved?: () => void; // Optional: refresh quote after save
// }

// export default function CustomerForm({
//   quoteId,
//   initialData = {},
//   onSaved,
// }: CustomerFormProps) {
//   const [value, setValue] = useState<Record<string, any>>(initialData);
//   const [saving, setSaving] = useState(false);

//   // Sync with new initialData (e.g. when quote reloads)
//   useEffect(() => {
//     setValue(initialData || {});
//   }, [initialData]);

//   const handleChange = useCallback((field: string, val: string) => {
//     setValue((prev) => ({ ...prev, [field]: val }));
//   }, []);

//   const getValue = (keys: string[]): string => {
//     for (const key of keys) {
//       const rawVal = value[key];

//       if (rawVal === undefined || rawVal === null) continue;

//       // Handle structured address object
//       if (typeof rawVal === "object" && rawVal !== null) {
//         const parts: string[] = [];
//         if (rawVal.street || rawVal.line1)
//           parts.push(rawVal.street || rawVal.line1);
//         if (rawVal.suburb || rawVal.city)
//           parts.push(rawVal.suburb || rawVal.city);
//         if (rawVal.state) parts.push(rawVal.state);
//         if (rawVal.postcode || rawVal.zip)
//           parts.push(rawVal.postcode || rawVal.zip);
//         if (parts.length > 0) return parts.join(", ");
//       }

//       const strVal = String(rawVal).trim();
//       if (["Not Provided", "N/A", "null", "undefined", ""].includes(strVal)) {
//         continue;
//       }
//       return strVal;
//     }
//     return "";
//   };

//   const handleSave = async () => {
//     if (!quoteId) {
//       alert("Error: Quote ID is missing. Cannot save.");
//       return;
//     }

//     setSaving(true);
//     try {
//       // Use your centralized API function
//       await updateCustomer(quoteId, value);

//       alert("Customer details updated successfully!");
//       onSaved?.(); // Trigger parent refresh if needed
//     } catch (err: any) {
//       console.error("Save failed:", err);
//       alert(
//         "Failed to save customer details: " + (err.message || "Unknown error")
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="grid gap-4">
//         {/* Company Name */}
//         <div>
//           <Label htmlFor="company" className="text-sm">
//             Company Name
//           </Label>
//           <Input
//             id="company"
//             value={getValue(["company", "company_name"])}
//             onChange={(e) => handleChange("company", e.target.value)}
//             placeholder="e.g. Nursing Centred Care Australia"
//             className="mt-1"
//           />
//         </div>

//         {/* ABN & Contact Name */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="abn" className="text-sm">
//               ABN / ACN
//             </Label>
//             <Input
//               id="abn"
//               value={getValue(["abn", "acn"])}
//               onChange={(e) => handleChange("abn", e.target.value)}
//               placeholder="e.g. 96 094 300 311"
//               className="mt-1"
//             />
//           </div>
//           <div>
//             <Label htmlFor="contact" className="text-sm">
//               Main Contact Name
//             </Label>
//             <Input
//               id="contact"
//               value={getValue(["main_contact_name", "contact_name"])}
//               onChange={(e) =>
//                 handleChange("main_contact_name", e.target.value)
//               }
//               placeholder="Enter decision maker name"
//               className="mt-1"
//             />
//           </div>
//         </div>

//         {/* Site Address */}
//         <div>
//           <Label htmlFor="site" className="text-sm">
//             Site Address
//           </Label>
//           <Input
//             id="site"
//             value={getValue(["site_address", "address"])}
//             onChange={(e) => handleChange("site_address", e.target.value)}
//             placeholder="e.g. 307 Peachey Rd, Munno Para SA 5115"
//             className="mt-1"
//           />
//         </div>

//         {/* Billing Address */}
//         <div>
//           <Label htmlFor="billing" className="text-sm">
//             Billing Address
//           </Label>
//           <Input
//             id="billing"
//             value={getValue(["billing_address"])}
//             onChange={(e) => handleChange("billing_address", e.target.value)}
//             placeholder="Usually same as site address"
//             className="mt-1"
//           />
//         </div>

//         {/* Email & Phone */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="email" className="text-sm">
//               Main Contact Email
//             </Label>
//             <Input
//               id="email"
//               type="email"
//               value={getValue(["main_contact_email", "email"])}
//               onChange={(e) =>
//                 handleChange("main_contact_email", e.target.value)
//               }
//               placeholder="e.g. john@example.com (required for sending)"
//               className="mt-1"
//             />
//           </div>
//           <div>
//             <Label htmlFor="phone" className="text-sm">
//               Main Contact Phone
//             </Label>
//             <Input
//               id="phone"
//               type="tel"
//               value={getValue([
//                 "main_contact_phone",
//                 "main_contact_number",
//                 "phone",
//               ])}
//               onChange={(e) =>
//                 handleChange("main_contact_phone", e.target.value)
//               }
//               placeholder="e.g. 1800 946 835"
//               className="mt-1"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Save Button */}
//       <div className="pt-4 border-t">
//         <Button
//           onClick={handleSave}
//           disabled={saving}
//           className="w-full md:w-auto"
//         >
//           {saving ? "Saving..." : "Update Customer Details"}
//         </Button>
//       </div>
//     </div>
//   );
// }

"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { updateCustomer } from "@/lib/api"; // ← Import from your API file

interface CustomerFormProps {
  quoteId: string; // REQUIRED
  initialData?: Record<string, any>;
  onSaved?: () => void; // Optional: refresh quote after save
}

export default function CustomerForm({
  quoteId,
  initialData = {},
  onSaved,
}: CustomerFormProps) {
  const [value, setValue] = useState<Record<string, any>>(initialData);
  const [saving, setSaving] = useState(false);

  // Sync with new initialData (e.g. when quote reloads)
  useEffect(() => {
    setValue(initialData || {});
  }, [initialData]);

  const handleChange = useCallback((field: string, val: string) => {
    setValue((prev) => ({ ...prev, [field]: val }));
  }, []);

  const getValue = (keys: string[]): string => {
    for (const key of keys) {
      const rawVal = value[key];

      if (rawVal === undefined || rawVal === null) continue;

      // Handle structured address object
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

      const strVal = String(rawVal).trim();
      if (["Not Provided", "N/A", "null", "undefined", ""].includes(strVal)) {
        continue;
      }
      return strVal;
    }
    return "";
  };

  const handleSave = async () => {
    if (!quoteId) {
      alert("Error: Quote ID is missing. Cannot save.");
      return;
    }

    setSaving(true);
    try {
      // Use your centralized API function
      await updateCustomer(quoteId, value);

      alert("Customer details updated successfully!");
      onSaved?.(); // Trigger parent refresh if needed
    } catch (err: any) {
      console.error("Save failed:", err);
      alert(
        "Failed to save customer details: " + (err.message || "Unknown error"),
      );
    } finally {
      setSaving(false);
    }
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

      {/* Save Button */}
      <div className="pt-4 border-t">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full md:w-auto"
        >
          {saving ? "Saving..." : "Update Customer Details"}
        </Button>
      </div>
    </div>
  );
}
