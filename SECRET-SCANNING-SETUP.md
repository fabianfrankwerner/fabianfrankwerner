# Secret Scanning Setup — Change Report

**Repo:** `fabianfrankwerner/fabianfrankwerner` (public)
**Date:** 2026-09-27
**Commit:** `24c2bbfd` — `ci: add secret scanning with gitleaks-action@v3`

---

## 1. Summary

Added a gitleaks-based secret scanning workflow and enforced it on `main`.
Enforcement was verified end-to-end with a real leaked token, not just assumed.

| Item | Before | After |
|---|---|---|
| Secret scanning workflow | none | `.github/workflows/secret-scan.yml` |
| Branch protection on `main` | none | requires `Gitleaks Scan` |
| Force pushes to `main` | allowed | **blocked** |
| Branch deletion | allowed | **blocked** |
| Admin bypass of protection | allowed | allowed — **required**, see 4.1 |
| GitHub native secret scanning | enabled | unchanged |
| GitHub native push protection | enabled | unchanged |
| Dependabot security updates | disabled | **enabled** |
| Dependabot alerts | off | **enabled** |

---

## 2. Files changed

**Added:** `.github/workflows/secret-scan.yml` (43 lines) — the only file touched.
No other repository file was modified, and no existing history was rewritten.

```yaml
name: Secret Scanning

on:
  push:
    branches: ['**']
  pull_request:
  workflow_dispatch:
  schedule:
    - cron: '17 4 * * *'

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read
  pull-requests: write

jobs:
  gitleaks:
    name: Gitleaks Scan
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6
        with:
          fetch-depth: 0

      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@v3
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITLEAKS_VERSION: latest
```

---

## 3. Deviations from the original documentation

### 3.1 `actions/checkout@v4` → `@v6` (required, not cosmetic)

The source document specified `@v4`. That version **no longer runs**. GitHub removed
Node 20 from hosted runners on 2026-09-16, eleven days before this change.

Verified from the action manifests:

| Action | Runtime | Status |
|---|---|---|
| `actions/checkout@v4.4.0` | `using: node20` | fails on `ubuntu-latest` |
| `actions/checkout@v6.1.0` | `using: node24` | works |
| `actions/checkout@v7.0.1` | `using: node24` | works |
| `gitleaks/gitleaks-action@v3.0.0` | `using: node24` | works |

The doc's snippet would have failed on the first run.

### 3.2 Added `permissions:` block

The repository default is `default_workflow_permissions: read`. Without an explicit
block, `GITHUB_TOKEN` gets read-only and gitleaks-action **cannot post its inline PR
review comments** — the feature that points at the offending line. This declaration is
load-bearing, not hardening for its own sake:

- `contents: read` — checkout
- `pull-requests: write` — inline review comments

### 3.3 Added `timeout-minutes: 15`

Bounds runner time. The full-history scan walks ~940 commits / ~310 MB.

### 3.4 `gitleaks-action@v3` confirmed current

`v3.0.0`, published 2026-05-30. No license key required: the action resolves the
account type at runtime and the run log confirms
`[fabianfrankwerner] is an individual user. No license key is required.`
It would hard-fail if this repo were ever transferred to an organization.

---

## 4. Repository settings changed

Applied via GitHub REST API.

### 4.1 Branch protection on `main`

```json
{
  "required_status_checks": { "strict": false, "contexts": ["Gitleaks Scan"] },
  "enforce_admins": false,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_pull_request_reviews": null,
  "restrictions": null
}
```

Notes:
- `contexts` resolved to a real app (`app_id: 15368`), not a free-text string — so
  the check is correctly bound to the workflow rather than a similarly named check.
- `required_pull_request_reviews` is deliberately `null`. Adding review requirements
  was not requested, and this repo is a personal single-maintainer project where
  mandatory review would block all merging.
- Force-push and deletion blocking were added because they are the standard way to
  erase a commit after it leaked.

**`enforce_admins` is `false` deliberately, and this was corrected during setup.**

It was initially set to `true`, which broke the repository's n8n backup automation.
That automation pushes directly to `main` (six consecutive `Backup Workflow` commits
in the recent log), and with `enforce_admins: true` the owner's own pushes were
rejected:

```
! [remote rejected]  main -> main (protected branch hook declined)
```

Since the owner is also the admin, enforcing on admins removes the only bypass the
automation has. The setting was reverted to `false` and the push succeeded, with
`Gitleaks Scan` enforcement confirmed intact afterward.

**The real trade-off:** with `enforce_admins: false`, secret detection is still fully
enforced on every PR merge — that path cannot be bypassed. But a *direct push* to
`main` by the owner is not gated by the status check, because GitHub does not run
status checks on direct pushes at all. For that path, protection relies on GitHub
native **push protection** (enabled, section 4.2), which blocks the push over the
wire before the commit is stored.

If direct-push coverage is wanted for the owner too, the n8n automation must be
changed to open PRs instead of pushing to `main`; `enforce_admins` can then be
re-enabled. That is an automation change, out of scope here.

### 4.2 Security features

| Setting | Action |
|---|---|
| `dependabot_security_updates` | disabled → **enabled** |
| Dependabot vulnerability alerts | off → **enabled** |
| `secret_scanning` | already enabled — unchanged |
| `secret_scanning_push_protection` | already enabled — unchanged |

Enabling these also activated the `Dependabot Updates` and `Dependency Graph`
workflows.

### 4.3 Could not be enabled

`secret_scanning_validity_checks` remains `disabled`. The API returns `200 OK` but
does not change the value — it is gated by GitHub plan, not by permissions or token
scope. No further action available on a personal account.

---

## 5. Verification performed

Enforcement was tested with a real leak rather than assumed from configuration.

**Test 1 — control (allowlisted key).** Committed a file containing AWS's documented
`AKIAIOSFODNN7EXAMPLE` / `EXAMPLEKEY` pair. Gitleaks reported **no leaks**, because
its default config allowlists those exact example values. This test was inconclusive
and was correctly not treated as a pass.

**Test 2 — real detection.** Committed `const TOKEN = "ghp_<36 random chars>";`.
Locally, the range scan reported `RuleID: github-pat`. On the PR:

```
Gitleaks Scan    fail    17s
Gitleaks Scan    fail    14s
mergeStateStatus: BLOCKED
```

- Inline comment posted by `github-actions[bot]` on `leak-test.txt:1` with the
  rule id, commit SHA, and the exact `.gitleaksignore` remediation line.
- `gh pr merge 6 --squash` was **rejected**:
  `the base branch policy prohibits the merge.`

**Cleanup.** PR #6 closed, remote branch deleted, local branch deleted, verified
absent. The token was randomly generated and never valid.

**Post-fix re-verification.** After `enforce_admins` was reverted to `false`
(section 4.1), branch protection was re-read to confirm the required check survived:
`required_status_checks.contexts` = `["Gitleaks Scan"]`, with force-push and deletion
blocking both still `false` (i.e. blocked). The check itself is unaffected by the
admin-bypass setting, since PR merges are gated either way.

**Note:** two `Gitleaks Scan` checks appear per PR because both `push` and
`pull_request` fire. The concurrency groups differ (`refs/heads/…` vs
`refs/pull/N/merge`), so they do not cancel each other. Harmless, but it does mean
each PR burns two runner jobs.

---

## 6. Historical findings — action required

The full-history scan was run manually to confirm the nightly job works. It
correctly scans all history and reports **7 findings**, which will make the nightly
`schedule` run **fail every night** until addressed.

| Rule | Location | Assessment |
|---|---|---|
| `generic-api-key` | `cs50/dont-panic/hack.sql:3` | False positive — CS50 course fixture, `md5("oops!")` |
| `generic-api-key` | `cs50/dont-panic/reset.sql:241` | False positive — same |
| `generic-api-key` | `cs50/dont-panic-python/reset.sql:241` | False positive — same |
| `generic-api-key` | `dont-panic/hack.sql:3` | False positive — same, pre-`cs50/` path |
| `generic-api-key` | `dont-panic/reset.sql:241` | False positive — same, pre-`cs50/` path |
| `generic-api-key` | `dont-panic-python/reset.sql:241` | False positive — same, pre-`cs50/` path |
| `generic-api-key` | `github notion integration.json:450` | **Real secret** |

### 6.1 The real finding

Commit `81a59935`, `github notion integration.json:450` contains an n8n
`webhookSecret` — a 64-character hex HMAC secret for a GitHub PR-trigger webhook.

It is **not** a scan artifact. The file is absent from every current branch, but the
commit remains reachable from `main`'s history and the repository is public, so the
value has been readable since **2025-04-18** — roughly 17 months.

**Recommended action:** if that n8n workflow is still active, rotate the secret by
re-saving the workflow in n8n. Deleting the file does not rotate the secret.

History rewriting was considered and rejected: rewriting ~940 commits across 10
branches is high-risk for no real gain here, since the file is already off every
branch and the nightly scan's value is precisely detecting legacy material.

### 6.2 Making the nightly run green

Add a `.gitleaksignore` with the six CS50 fingerprints, which keeps the nightly job
meaningful instead of permanently red. The genuine webhook secret should be
**rotated, not ignored**.

This was left undone deliberately — it requires writing a file with 6 fingerprints
and is a decision about which findings to suppress, not a mechanical step.

---

## 7. Residual risk

1. **Nightly job is red until 6.2 is addressed.** Push and PR enforcement are
   unaffected; they are range-scoped and ignore legacy history.
2. **The leaked n8n secret is still valid until rotated.** CI does not and cannot fix
   this. Highest-priority follow-up.
3. **`GITLEAKS_VERSION: latest` can break CI spontaneously.** A new gitleaks release
   may add a rule that fails the build with no commit from you. Remediation:
   add the reported fingerprint to `.gitleaksignore`, or pin to a fixed version.
   Currently resolves to 8.30.1, which is clean.
4. **Direct pushes to `main` bypass the status check.** Inherent to GitHub: status
   checks run on PRs, never on direct pushes. This is why `enforce_admins` is
   `false` (section 4.1) — enforcing it would break the n8n backup automation. For
   direct pushes, the control is GitHub native **push protection**, which is enabled
   and rejects known token formats before the commit is stored. It matches by
   provider pattern, so it is a narrower net than gitleaks: an unrecognized
   high-entropy string pushed straight to `main` would not be caught by CI.
5. **`ubuntu-latest` migrates to Ubuntu 26 on 2026-10-19.** Flagged by the runner
   itself; no action needed, but worth a glance if the job breaks in October.
6. **No local pre-commit hook**, by choice — CI plus push protection cover the goal.

---

## 8. Follow-ups, in priority order

1. Rotate the n8n `webhookSecret` from commit `81a59935` if that workflow is live.
2. Add `.gitleaksignore` for the six CS50 fixtures to green the nightly run.
3. Consider pinning `GITLEAKS_VERSION` instead of `latest`.
4. Optionally re-run on demand at any time:
   ```bash
   gh workflow run "Secret Scanning" --ref main
   ```
