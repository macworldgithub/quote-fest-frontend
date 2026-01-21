// const API_BASE = "http://localhost:7002";

// interface AnalyzeBillResponse {
//   id: string;
//   created: string;
//   raw_grok_output: Record<string, any>;
//   customer: Record<string, any>;
//   current_spend_ex: number;
//   recommendations: Array<{
//     name?: string;
//     description?: string;
//     new_monthly_ex?: number;
//     saving?: number;
//     items?: Array<any>;
//   }>;
//   selected_lines: Array<{
//     sku: string;
//     desc: string;
//     qty: number;
//     unit_ex: number;
//     cadence: string;
//     haas_term?: number;
//   }>;
//   new_monthly_ex: number;
//   monthly_saving_ex: number;
//   status: string;
// }

// async function fetchAPI(url: string, options?: RequestInit): Promise<Response> {
//   try {
//     console.log("[v0] Fetching:", url);
//     const res = await fetch(url, {
//       ...options,
//       headers: {
//         ...options?.headers,
//         Accept: "application/json",
//       },
//     });

//     if (!res.ok) {
//       const errorText = await res.text();
//       console.error("[v0] API Error:", res.status, errorText);
//       throw new Error(`API Error ${res.status}: ${res.statusText}`);
//     }

//     return res;
//   } catch (error) {
//     console.error("[v0] Fetch failed:", error);
//     if (error instanceof Error) {
//       if (error.message.includes("Failed to fetch")) {
//         throw new Error(
//           `Cannot reach backend at ${API_BASE}. Please ensure the backend server is running and set NEXT_PUBLIC_API_URL environment variable correctly.`,
//         );
//       }
//     }
//     throw error;
//   }
// }

// export async function analyzeBill(
//   file: File,
//   customerType: "Business" | "Residential",
// ): Promise<AnalyzeBillResponse> {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("customer_type", customerType);

//   const res = await fetchAPI(`${API_BASE}/analyze-bill`, {
//     method: "POST",
//     body: formData,
//   });

//   return res.json();
// }

// export async function getQuote(quoteId: string): Promise<AnalyzeBillResponse> {
//   const res = await fetchAPI(`${API_BASE}/quote/${quoteId}`);
//   return res.json();
// }

// export async function listQuotes(): Promise<AnalyzeBillResponse[]> {
//   const res = await fetchAPI(`${API_BASE}/quotes`);
//   return res.json();
// }

// export async function updateLineItem(
//   quoteId: string,
//   index: number,
//   updates: Record<string, any>,
// ): Promise<AnalyzeBillResponse> {
//   const res = await fetchAPI(
//     `${API_BASE}/update-line/${quoteId}?index=${index}`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(updates),
//     },
//   );

//   return res.json();
// }

// export async function removeLineItem(
//   quoteId: string,
//   index: number,
// ): Promise<AnalyzeBillResponse> {
//   const formData = new FormData();
//   formData.append("index", index.toString());

//   const res = await fetchAPI(`${API_BASE}/remove-line/${quoteId}`, {
//     method: "POST",
//     body: formData,
//   });

//   return res.json();
// }

// export async function addAdhocLineItem(
//   quoteId: string,
//   desc: string,
//   qty: number,
//   unit_ex: number,
//   cadence = "once-off",
// ): Promise<AnalyzeBillResponse> {
//   const formData = new FormData();
//   formData.append("desc", desc);
//   formData.append("qty", qty.toString());
//   formData.append("unit_ex", unit_ex.toString());
//   formData.append("cadence", cadence);

//   const res = await fetchAPI(`${API_BASE}/add-adhoc/${quoteId}`, {
//     method: "POST",
//     body: formData,
//   });

//   return res.json();
// }

// export async function updateQuoteStatus(
//   quoteId: string,
//   status: string,
// ): Promise<AnalyzeBillResponse> {
//   const formData = new FormData();
//   formData.append("status", status);

//   const res = await fetchAPI(`${API_BASE}/update-status/${quoteId}`, {
//     method: "POST",
//     body: formData,
//   });

//   return res.json();
// }

// export async function getPDF(quoteId: string): Promise<Blob> {
//   const res = await fetchAPI(`${API_BASE}/pdf/${quoteId}`);
//   return res.blob();
// }

// export async function getCSV(quoteId: string): Promise<Blob> {
//   const res = await fetchAPI(`${API_BASE}/csv/${quoteId}`);
//   return res.blob();
// }

// export async function sendEmail(
//   quoteId: string,
//   toEmail: string,
// ): Promise<{ message: string }> {
//   const formData = new FormData();
//   formData.append("to_email", toEmail);

//   const res = await fetchAPI(`${API_BASE}/send-email/${quoteId}`, {
//     method: "POST",
//     body: formData,
//   });

//   return res.json();
// }

// export async function updateCustomer(
//   quoteId: string,
//   customerData: Record<string, any>,
// ): Promise<AnalyzeBillResponse> {
//   const res = await fetchAPI(`${API_BASE}/update-customer/${quoteId}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(customerData),
//   });

//   return res.json();
// }

// export const deleteQuote = async (quoteId: string) => {
//   const response = await fetch(`${API_BASE}/quote/${quoteId}`, {
//     method: "DELETE",
//   });

//   if (!response.ok) {
//     const error = await response
//       .json()
//       .catch(() => ({ detail: "Failed to delete" }));
//     throw new Error(error.detail || "Failed to delete quote");
//   }

//   return await response.json();
// };

const API_BASE = "http://localhost:7002";

interface AnalyzeBillResponse {
  id: string;
  created: string;
  raw_grok_output: Record<string, any>;
  customer: Record<string, any>;
  current_spend_ex: number;
  recommendations: Array<{
    name?: string;
    description?: string;
    new_monthly_ex?: number;
    saving?: number;
    items?: Array<any>;
  }>;
  selected_lines: Array<{
    sku: string;
    desc: string;
    qty: number;
    unit_ex: number;
    cadence: string;
    haas_term?: number;
  }>;
  new_monthly_ex: number;
  monthly_saving_ex: number;
  status: string;
}

async function fetchAPI(url: string, options?: RequestInit): Promise<Response> {
  try {
    console.log("[v0] Fetching:", url);
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[v0] API Error:", res.status, errorText);
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }

    return res;
  } catch (error) {
    console.error("[v0] Fetch failed:", error);
    if (error instanceof Error) {
      if (error.message.includes("Failed to fetch")) {
        throw new Error(
          `Cannot reach backend at ${API_BASE}. Please ensure the backend server is running and set NEXT_PUBLIC_API_URL environment variable correctly.`,
        );
      }
    }
    throw error;
  }
}

export async function analyzeBill(
  file: File,
  customerType: "Business" | "Residential",
): Promise<AnalyzeBillResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("customer_type", customerType);

  const res = await fetchAPI(`${API_BASE}/analyze-bill`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export async function createManualQuote(
  customerType: "Business" | "Residential",
): Promise<AnalyzeBillResponse> {
  const formData = new FormData();
  formData.append("customer_type", customerType);

  const res = await fetchAPI(`${API_BASE}/create-manual-quote`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export async function getQuote(quoteId: string): Promise<AnalyzeBillResponse> {
  const res = await fetchAPI(`${API_BASE}/quote/${quoteId}`);
  return res.json();
}

export async function listQuotes(): Promise<AnalyzeBillResponse[]> {
  const res = await fetchAPI(`${API_BASE}/quotes`);
  return res.json();
}

export async function updateLineItem(
  quoteId: string,
  index: number,
  updates: Record<string, any>,
): Promise<AnalyzeBillResponse> {
  const res = await fetchAPI(
    `${API_BASE}/update-line/${quoteId}?index=${index}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    },
  );

  return res.json();
}

export async function removeLineItem(
  quoteId: string,
  index: number,
): Promise<AnalyzeBillResponse> {
  const formData = new FormData();
  formData.append("index", index.toString());

  const res = await fetchAPI(`${API_BASE}/remove-line/${quoteId}`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export async function addAdhocLineItem(
  quoteId: string,
  desc: string,
  qty: number,
  unit_ex: number,
  cadence = "once-off",
): Promise<AnalyzeBillResponse> {
  const formData = new FormData();
  formData.append("desc", desc);
  formData.append("qty", qty.toString());
  formData.append("unit_ex", unit_ex.toString());
  formData.append("cadence", cadence);

  const res = await fetchAPI(`${API_BASE}/add-adhoc/${quoteId}`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export async function updateQuoteStatus(
  quoteId: string,
  status: string,
): Promise<AnalyzeBillResponse> {
  const formData = new FormData();
  formData.append("status", status);

  const res = await fetchAPI(`${API_BASE}/update-status/${quoteId}`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export async function getPDF(quoteId: string): Promise<Blob> {
  const res = await fetchAPI(`${API_BASE}/pdf/${quoteId}`);
  return res.blob();
}

export async function getCSV(quoteId: string): Promise<Blob> {
  const res = await fetchAPI(`${API_BASE}/csv/${quoteId}`);
  return res.blob();
}

export async function sendEmail(
  quoteId: string,
  toEmail: string,
): Promise<{ message: string }> {
  const formData = new FormData();
  formData.append("to_email", toEmail);

  const res = await fetchAPI(`${API_BASE}/send-email/${quoteId}`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export async function updateCustomer(
  quoteId: string,
  customerData: Record<string, any>,
): Promise<AnalyzeBillResponse> {
  const res = await fetchAPI(`${API_BASE}/update-customer/${quoteId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customerData),
  });

  return res.json();
}

export const deleteQuote = async (quoteId: string) => {
  const response = await fetch(`${API_BASE}/quote/${quoteId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Failed to delete" }));
    throw new Error(error.detail || "Failed to delete quote");
  }

  return await response.json();
};

export async function selectRecommendation(
  quoteId: string,
  index: number,
): Promise<AnalyzeBillResponse> {
  const formData = new FormData();
  formData.append("index", index.toString());

  const res = await fetchAPI(`${API_BASE}/select-recommendation/${quoteId}`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}
