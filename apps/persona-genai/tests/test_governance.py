"""Governance rule tests (pure unit tests — no DB)."""

from kinform_shared.governance import (
    GOVERNANCE_RULES_VERSION,
    MAX_CONTENT_CHARS,
    enforce_governance,
)


def test_happy_path():
    r = enforce_governance(
        "Wear the hoodie. Founding members, your drop is live. #KINFORM #TorquedAffiliation",
        hashtags=["#KINFORM", "#TorquedAffiliation"],
        approved_by_human=True,
    )
    assert r.ok, r.violations
    assert r.rules_version == GOVERNANCE_RULES_VERSION


def test_missing_cta_blocks():
    r = enforce_governance(
        "Quiet luxury. #KINFORM #TorquedAffiliation",
        hashtags=["#KINFORM", "#TorquedAffiliation"],
        approved_by_human=True,
    )
    assert not r.ok
    assert any(v.code == "MISSING_CTA" for v in r.violations)


def test_missing_required_hashtag_blocks():
    r = enforce_governance(
        "Wear it now.",
        hashtags=["#KINFORM"],
        approved_by_human=True,
    )
    assert not r.ok
    assert any(v.code == "MISSING_HASHTAG" for v in r.violations)


def test_length_limit():
    big = "Wear " + ("x" * MAX_CONTENT_CHARS)
    r = enforce_governance(
        big, hashtags=["#KINFORM", "#TorquedAffiliation"], approved_by_human=True
    )
    assert not r.ok
    assert any(v.code == "CONTENT_TOO_LONG" for v in r.violations)


def test_banned_phrase():
    r = enforce_governance(
        "Wear it — guaranteed returns inside.",
        hashtags=["#KINFORM", "#TorquedAffiliation"],
        approved_by_human=True,
    )
    assert not r.ok
    assert any(v.code == "BANNED_PHRASE" for v in r.violations)


def test_human_gate_in_simulation_mode_is_warning_only():
    r = enforce_governance(
        "Wear the hoodie. #KINFORM #TorquedAffiliation",
        hashtags=["#KINFORM", "#TorquedAffiliation"],
        approved_by_human=False,
        require_human_approval=False,
    )
    assert r.ok
    assert any("simulation" in w for w in r.warnings)
