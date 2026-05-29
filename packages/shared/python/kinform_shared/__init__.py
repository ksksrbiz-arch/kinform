"""kinform-shared — Python mirror of @kinform/shared."""

from kinform_shared.branding import (
    APPROVED_CTAS,
    BANNED_PHRASES,
    BRAND,
    CONTENT_MAX_LENGTH,
    REQUIRED_HASHTAGS,
)
from kinform_shared.governance import (
    CampaignCandidate,
    Finding,
    GovernanceReport,
    GovernanceVerdict,
    evaluate_governance,
    suggest_fixes,
)
from kinform_shared.schemas import (
    AffiliateCreate,
    ApprovalRequest,
    CampaignCandidateModel,
    CampaignModel,
    ProductCreate,
    RevenueEventInput,
)

__all__ = [
    "APPROVED_CTAS",
    "BANNED_PHRASES",
    "BRAND",
    "CONTENT_MAX_LENGTH",
    "REQUIRED_HASHTAGS",
    "CampaignCandidate",
    "Finding",
    "GovernanceReport",
    "GovernanceVerdict",
    "evaluate_governance",
    "suggest_fixes",
    "AffiliateCreate",
    "ApprovalRequest",
    "CampaignCandidateModel",
    "CampaignModel",
    "ProductCreate",
    "RevenueEventInput",
]
