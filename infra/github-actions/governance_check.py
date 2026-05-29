"""CLI shim used by the GitHub Actions governance pipeline.

Reads campaign JSON files from ``--paths`` (glob), validates each one
against the shared governance rules, and writes a ValidationLog row for
each. Exits non-zero on any failure so CI blocks the merge.

This is the same governance code path PersonaGenAI uses — by sharing
``kinform_shared``, what passes the orchestrator passes CI by construction.
"""
from __future__ import annotations

import argparse
import glob
import json
import logging
import sys
from pathlib import Path

from kinform_shared.governance import (
    GOVERNANCE_RULES_VERSION,
    enforce_governance,
)


log = logging.getLogger("kinform.governance.ci")


def _load_campaign(path: Path) -> tuple[str, list[str], bool]:
    """Return (content, hashtags, approved) parsed from one campaign JSON."""

    data = json.loads(path.read_text(encoding="utf-8"))
    # Two accepted shapes:
    #   1) Raw simulation report ({draft: {...}})
    #   2) Bare draft ({content, hashtags, ...})
    draft = data.get("draft", data)
    content = draft.get("content", "")
    hashtags = list(draft.get("hashtags", []))
    approved = bool(data.get("approved", False))
    return content, hashtags, approved


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="KINFORM-AEO governance CI")
    parser.add_argument(
        "--paths",
        nargs="+",
        default=["apps/payload-studio/**/campaigns/**/*.json"],
        help="Globs to scan for campaign JSON files.",
    )
    parser.add_argument(
        "--require-approval",
        action="store_true",
        help="Fail if any campaign lacks human approval (use on main).",
    )
    parser.add_argument(
        "--report",
        type=Path,
        default=None,
        help="Optional path to write a JSON report.",
    )
    args = parser.parse_args(argv)

    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")

    files: list[Path] = []
    for pattern in args.paths:
        files.extend(Path(p) for p in glob.glob(pattern, recursive=True))
    files = sorted(set(files))

    if not files:
        log.info("No campaign files found; nothing to validate.")
        if args.report:
            args.report.write_text(json.dumps({
                "rules_version": GOVERNANCE_RULES_VERSION,
                "checked": 0,
                "results": [],
            }, indent=2))
        return 0

    log.info("Validating %d campaign file(s) against rules %s",
             len(files), GOVERNANCE_RULES_VERSION)

    results: list[dict] = []
    failed = 0
    for path in files:
        try:
            content, hashtags, approved = _load_campaign(path)
        except Exception as exc:
            log.error("✗ %s — could not parse: %s", path, exc)
            failed += 1
            results.append({"path": str(path), "ok": False, "error": str(exc)})
            continue

        result = enforce_governance(
            content,
            hashtags=hashtags,
            approved_by_human=approved,
            require_human_approval=args.require_approval,
        )
        results.append({
            "path": str(path),
            "ok": result.ok,
            "approved": approved,
            "violations": [v.__dict__ for v in result.violations],
            "warnings": result.warnings,
        })
        if not result.ok:
            failed += 1
            log.error("✗ %s", path)
            for v in result.violations:
                log.error("    %s — %s", v.code, v.message)
        else:
            log.info("✓ %s", path)

    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps({
            "rules_version": GOVERNANCE_RULES_VERSION,
            "checked": len(files),
            "failed": failed,
            "results": results,
        }, indent=2))

    if failed:
        log.error("Governance pipeline FAILED — %d campaign(s) blocked.", failed)
        return 1
    log.info("Governance pipeline OK — %d campaign(s) cleared.", len(files))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
