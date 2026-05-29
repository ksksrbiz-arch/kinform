"""State machine enforcement for the Campaign lifecycle.

Wraps :func:`kinform_torqued_graph.can_transition_campaign` with a Python
exception so callers can rely on a single guarded function rather than
sprinkling status checks across the codebase.
"""

from __future__ import annotations

from kinform_torqued_graph import CampaignStatus, can_transition_campaign


class IllegalTransitionError(RuntimeError):
    """Raised when a Campaign transition is not permitted."""


def assert_transition(from_: str, to: str) -> None:
    if from_ == to:
        return
    if not can_transition_campaign(from_, to):
        raise IllegalTransitionError(
            f"Illegal Campaign transition {from_!r} → {to!r}. "
            f"Allowed successors of {from_!r} are checked in "
            "kinform_torqued_graph.CampaignTransitions."
        )


def assert_human_approval(target: str, approved_by: str | None) -> None:
    """Promotion to APPROVED requires a non-null approver identity."""
    if target == CampaignStatus.APPROVED and not approved_by:
        raise IllegalTransitionError(
            "Promotion to APPROVED requires a non-null approver identity. "
            "Pass `approved_by` to the approval endpoint."
        )
