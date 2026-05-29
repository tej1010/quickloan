const sessions = globalThis.__quickloanSessions ?? new Map();
globalThis.__quickloanSessions = sessions;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...corsHeaders },
    body: JSON.stringify(body),
  };
}

function upsertSession(input) {
  const existing = sessions.get(input.sessionId);
  const now = new Date().toISOString();

  const session = {
    sessionId: input.sessionId,
    applicationNo: input.applicationNo ?? existing?.applicationNo ?? `APP-${Date.now().toString().slice(-8)}`,
    productName: input.productName ?? existing?.productName ?? "",
    productModel: input.productModel ?? existing?.productModel ?? "",
    loanAmount: input.loanAmount ?? existing?.loanAmount ?? 0,
    tenure: input.tenure ?? existing?.tenure ?? 12,
    emiAmount: input.emiAmount ?? existing?.emiAmount ?? 0,
    interestRate: input.interestRate ?? existing?.interestRate ?? 18,
    vendorName: input.vendorName ?? existing?.vendorName ?? "Mobile World Electronics",
    customerProgressStep: input.customerProgressStep ?? existing?.customerProgressStep ?? 0,
    vendorStep: input.vendorStep ?? existing?.vendorStep ?? 0,
    customerMobile: String(input.customerMobile ?? existing?.customerMobile ?? "").replace(/\D/g, ""),
    customerName: input.customerName ?? existing?.customerName ?? "",
    customerDetails: input.customerDetails ?? existing?.customerDetails ?? {
      name: "",
      mobile: String(input.customerMobile ?? "").replace(/\D/g, ""),
      email: "",
      pan: "",
      aadhaar: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
    loanId: input.loanId ?? existing?.loanId,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  sessions.set(input.sessionId, session);
  return session;
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  const sessionId = event.queryStringParameters?.sessionId || event.path?.split("/").pop();

  if (event.httpMethod === "GET") {
    if (!sessionId) return json(400, { success: false, message: "sessionId is required" });
    const session = sessions.get(sessionId);
    if (!session) return json(404, { success: false, message: "Application session not found" });
    return json(200, { success: true, data: session });
  }

  let body = {};
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch {
    return json(400, { success: false, message: "Invalid JSON body" });
  }

  if (event.httpMethod === "POST") {
    if (!body.sessionId || !body.customerMobile) {
      return json(400, { success: false, message: "sessionId and customerMobile are required" });
    }
    const session = upsertSession(body);
    return json(201, { success: true, data: session });
  }

  if (event.httpMethod === "PUT") {
    const id = body.sessionId || sessionId;
    if (!id) return json(400, { success: false, message: "sessionId is required" });
    if (!sessions.has(id)) return json(404, { success: false, message: "Application session not found" });
    const session = upsertSession({ ...sessions.get(id), ...body, sessionId: id });
    return json(200, { success: true, data: session });
  }

  return json(405, { success: false, message: "Method not allowed" });
}
