export const APPROVED_RULE_SCHEMA_VERSION = "approved-rule/v1";

export function createApprovedRule(suggestion, context = {}) {
  return {
    schemaVersion: APPROVED_RULE_SCHEMA_VERSION,
    suggestionId: suggestion.id,
    type: suggestion.type,
    scope: suggestion.scope,
    target: suggestion.target,
    proposedRule: suggestion.proposedRule,
    confidenceAtApproval: suggestion.confidence,
    evidenceCount: suggestion.evidenceCount,
    evidence: suggestion.evidence ?? [],
    sourceSnapshotGeneratedAt: context.generatedAt ?? null,
    approvedAt: new Date().toISOString()
  };
}

export function buildApprovedRulesExport(rules, context = {}) {
  return {
    schemaVersion: APPROVED_RULE_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    sourceSnapshotGeneratedAt: context.generatedAt ?? null,
    count: rules.length,
    rules
  };
}
