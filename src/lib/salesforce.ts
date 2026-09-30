import type { OpportunitySummary } from "./opportunities";
import { salesforceSectionMap } from "./salesforce-section-map";
import { isSalesforceId, soqlLikeContains, soqlString } from "./soql";

type SalesforceAuth = {
  instanceUrl: string;
  accessToken: string;
};

type SalesforceQueryResponse = {
  records?: Array<Record<string, unknown>>;
};

let cachedPasswordAuth: SalesforceAuth | null = null;

export function isSalesforceConfigured(): boolean {
  if (process.env.SALESFORCE_INSTANCE_URL && process.env.SALESFORCE_ACCESS_TOKEN) {
    return true;
  }
  return Boolean(
    process.env.SALESFORCE_CLIENT_ID &&
      process.env.SALESFORCE_CLIENT_SECRET &&
      process.env.SALESFORCE_USERNAME &&
      process.env.SALESFORCE_PASSWORD,
  );
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}.`);
  }
  return value;
}

async function authorize(): Promise<SalesforceAuth> {
  const staticToken = process.env.SALESFORCE_ACCESS_TOKEN;
  const staticInstance = process.env.SALESFORCE_INSTANCE_URL;
  if (staticToken && staticInstance) {
    return {
      accessToken: staticToken,
      instanceUrl: staticInstance.replace(/\/$/, ""),
    };
  }

  if (cachedPasswordAuth) {
    return cachedPasswordAuth;
  }

  const loginUrl = (process.env.SALESFORCE_LOGIN_URL ?? "https://login.salesforce.com").replace(
    /\/$/,
    "",
  );
  const body = new URLSearchParams({
    grant_type: "password",
    client_id: requiredEnv("SALESFORCE_CLIENT_ID"),
    client_secret: requiredEnv("SALESFORCE_CLIENT_SECRET"),
    username: requiredEnv("SALESFORCE_USERNAME"),
    password: requiredEnv("SALESFORCE_PASSWORD"),
  });
  const response = await fetch(`${loginUrl}/services/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) {
    throw new Error(`Salesforce login failed (${response.status}).`);
  }
  const payload = (await response.json()) as { access_token?: string; instance_url?: string };
  if (!payload.access_token || !payload.instance_url) {
    throw new Error("Salesforce login did not return an access token.");
  }
  cachedPasswordAuth = {
    accessToken: payload.access_token,
    instanceUrl: payload.instance_url.replace(/\/$/, ""),
  };
  return cachedPasswordAuth;
}

async function soqlQuery(soql: string): Promise<Array<Record<string, unknown>>> {
  const auth = await authorize();
  const url = `${auth.instanceUrl}/services/data/v62.0/query?q=${encodeURIComponent(soql)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${auth.accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`Salesforce query failed (${response.status}).`);
  }
  const payload = (await response.json()) as SalesforceQueryResponse;
  return payload.records ?? [];
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === "string" ? value : "";
}

function toOpportunity(record: Record<string, unknown>): OpportunitySummary | null {
  const id = readString(record, "Id");
  const name = readString(record, "Name");
  if (!id || !name) {
    return null;
  }
  const account = record.Account;
  const accountName =
    account && typeof account === "object" && "Name" in account && typeof account.Name === "string"
      ? account.Name
      : "";
  const closeDate = readString(record, "CloseDate");
  return {
    id,
    name,
    accountName,
    stageName: readString(record, "StageName"),
    closeDate: closeDate || null,
    description: readString(record, "Description"),
  };
}

const OPPORTUNITY_FIELDS = "Id, Name, StageName, CloseDate, Description, Account.Name";

export async function searchSalesforceOpportunities(
  customerName: string,
): Promise<OpportunitySummary[]> {
  const query = customerName.trim();
  if (!query) {
    return [];
  }
  const pattern = soqlLikeContains(query);
  const soql = `SELECT ${OPPORTUNITY_FIELDS} FROM Opportunity WHERE Account.Name LIKE ${pattern} OR Name LIKE ${pattern} ORDER BY LastModifiedDate DESC LIMIT 25`;
  const records = await soqlQuery(soql);
  return records.flatMap((record) => {
    const opportunity = toOpportunity(record);
    return opportunity ? [opportunity] : [];
  });
}

export async function getSalesforceOpportunity(id: string): Promise<OpportunitySummary | null> {
  if (!isSalesforceId(id)) {
    return null;
  }
  const soql = `SELECT ${OPPORTUNITY_FIELDS} FROM Opportunity WHERE Id = ${soqlString(id)} LIMIT 1`;
  const records = await soqlQuery(soql);
  const first = records[0];
  return first ? toOpportunity(first) : null;
}

function assertApiName(value: string): string {
  if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(value)) {
    throw new Error("Salesforce field map contains an invalid API name.");
  }
  return value;
}

export async function readSalesforceSolutionFields(
  opportunityId: string,
): Promise<Record<string, unknown> | null> {
  const map = salesforceSectionMap;
  if (!map.objectApiName || !map.opportunityLookupField || !isSalesforceId(opportunityId)) {
    return null;
  }
  const fields = Object.values(map.fields).filter((field): field is string => Boolean(field));
  if (fields.length === 0) {
    return null;
  }
  const selectList = ["Id", ...fields.map((field) => assertApiName(field))].join(", ");
  const soql = `SELECT ${selectList} FROM ${assertApiName(map.objectApiName)} WHERE ${assertApiName(map.opportunityLookupField)} = ${soqlString(opportunityId)} LIMIT 1`;
  const records = await soqlQuery(soql);
  return records[0] ?? null;
}
