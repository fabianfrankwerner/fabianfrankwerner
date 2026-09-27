# Scanning — Setup & Change Report

**Repo:** `fabianfrankwerner/fabianfrankwerner` (public)
**Workflow:** `.github/workflows/scan.yml` — named **Scanning**
**Schedule:** midnight UTC (`0 0 * * *`)

---

## 1. Naming

The workflow, its job, and the required status check are all named **`Scanning`**
and use the same string in every place GitHub surfaces it:

| Where | Value |
|---|---|
| Workflow name (Actions tab) | `Scanning` |
| Job name (status check) | `Scanning` |
| Branch protection required check | `Scanning` |
| Workflow file | `.github/workflows/scan.yml` |
| This report | `SCANNING-SETUP.md` |

The job name is what GitHub reports as a status check, so the job name and the
branch protection entry must be the **same string**. They are both `Scanning`.

---

## 2. Files

| File | Purpose |
|---|---|
| `.github/workflows/scan.yml` | The workflow |
| `.github/dependabot.yml` | Keeps the SHA pins current |
| `SCANNING-SETUP.md` | This report |

History: `secret-scan.yml` → `scan.yml`, `SECRET-SCANNING-SETUP.md` →
`SCANNING-SETUP.md`.

---

## 3. The workflow

```yaml
name: Scanning

on:
  push:
    branches: ['**']
  pull_request:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * *'

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read
  pull-requests: write

jobs:
  scanning:
    name: Scanning
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - name: Checkout repository
        uses: actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803 # v6.1.0
        with:
          fetch-depth: 0
          persist-credentials: false

      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@e0c47f4f8be36e29cdc102c57e68cb5cbf0e8d1e # v3.0.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITLEAKS_VERSION: latest
```

### How the scan scope is chosen

`gitleaks-action` decides what to scan based on the event, and it only omits
`--log-opts` for `schedule` and `workflow_dispatch`:

| Event | Commits scanned |
|---|---|
| `push` | `<first pushed commit>^..<last pushed commit>` |
| `pull_request` | the PR's commits |
| `schedule` / `workflow_dispatch` | **entire history** |

This is why the legacy findings in section 7 do not fail push or PR runs: those
events are range-scoped. The nightly `schedule` run is the only one that walks
all history, and it is the only one that will report them.

`fetch-depth: 0` is mandatory, not a preference. The action needs the parent of
the first commit in the range to exist locally, and a shallow clone does not
have it.

---

## 4. Hardening applied

| Change | Severity addressed | Why |
|---|---|---|
| SHA-pinned `gitleaks-action` | 🟠 HIGH | Third-party action on a mutable tag. Anyone who can move the `v3` tag changes code that runs with your token. |
| SHA-pinned `actions/checkout` | 🔵 LOW | First-party, but pins cost nothing and Dependabot now maintains them. |
| `persist-credentials: false` | 🔵 LOW | Stops `checkout` leaving the token in `.git/config`. Nothing in this job pushes. |
| `.github/dependabot.yml` | — | Pins are useless if nothing updates them. |
| Explicit `permissions:` | — | Repo default is `read`; without this block the action could not post PR comments. |

Both pins verified to resolve to the intended upstream commits:

- `d23441a4` → `actions/checkout` v6.1.0
- `e0c47f4f` → `gitleaks/gitleaks-action` v3.0.0

### Trigger safety

`pull_request` is used, never `pull_request_target` or `workflow_run`. Fork PRs
therefore get a read-only token and no secrets, so an outside contributor cannot
exfiltrate anything. They also cannot post the inline comment, since that needs
`pull-requests: write`; the action handles that failure without failing the job.

No `${{ }}` expression is interpolated into a `run:` block, so there is no
script-injection sink.

---

## 5. Verification

Enforcement was tested with a real token, not inferred from configuration.

**Pass path.** Dependabot's PR #7 (`Bump actions/checkout from 6.1.0 to 7.0.1`)
ran the renamed check: `Scanning pass`, `mergeStateStatus: CLEAN`.

**Block path.** PR #8 added `const TOKEN = "ghp_<36 random chars>";`:

```
Scanning    fail    17s
Scanning    fail    17s
mergeStateStatus: BLOCKED
```

- Inline comment posted by `github-actions[bot]` on `leak-test.txt:1`, rule
  `github-pat`.
- `gh pr merge 8 --squash` refused: *the base branch policy prohibits the merge.*

**Cleanup.** PRs #6, #7 left as-is, #8 closed; test branches deleted locally and
remotely; `leak-test.txt` absent. Tokens were randomly generated and never valid.

**A note on the first test.** An earlier attempt used AWS's documented
`AKIAIOSFODNN7EXAMPLE` / `EXAMPLEKEY` pair. Gitleaks allowlists those exact
values by default, so it reported nothing. That test proved nothing and was
discarded rather than counted as a pass — a green result from an allowlisted
fixture is not evidence the gate works.

---

## 6. Repository settings

### Branch protection on `main`

```json
{
  "required_status_checks": {
    "strict": false,
    "checks": [{ "context": "Scanning", "app_id": 15368 }]
  },
  "enforce_admins": false,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_pull_request_reviews": null,
  "restrictions": null
}
```

- The check is bound to `app_id: 15368`, so it matches this workflow rather than
  any check that happens to share the name.
- `enforce_admins` is `false` **by necessity**. Set to `true` during initial
  setup, it caused
  `! [remote rejected] main -> main (protected branch hook declined)` — the n8n
  backup automation pushes directly to `main` as the owner/admin, and enforcing
  on admins removed its only bypass. Reverted, and the push then succeeded.
- `required_pull_request_reviews` is `null`: not requested, and mandatory review
  would block all merging on a single-maintainer repo.
- Force-push and branch deletion are blocked — the standard way to erase a commit
  after it leaks.

### Ordering matters when renaming

Branch protection and the workflow name had to change together. Pushing
`scan.yml` while protection still required `Gitleaks Scan` would have left every
PR waiting on a check that no longer exists. The order used:

1. Pushed the renamed workflow; confirmed `Scanning` reported green on `main`.
2. Only then updated the required check to `Scanning`.
3. Confirmed with a real PR that both the pass and block paths work.

No PRs were open during the swap.

### Security features

| Setting | State |
|---|---|
| `secret_scanning` | enabled (pre-existing) |
| `secret_scanning_push_protection` | enabled (pre-existing) |
| `dependabot_security_updates` | enabled |
| Dependabot vulnerability alerts | enabled |
| `secret_scanning_validity_checks` | **could not be enabled** |

`secret_scanning_validity_checks` returns `200 OK` but does not change the value.
It is gated by GitHub plan, not by token scope, so there is nothing further to
try on a personal account.

---

## 7. Historical findings — action required

The full-history scan reports **7 findings**, so the nightly run **fails every
night** until they are resolved.

| Location | Assessment |
|---|---|
| `cs50/dont-panic/hack.sql:3` | False positive — CS50 fixture, `md5("oops!")` |
| `cs50/dont-panic/reset.sql:241` | False positive — same |
| `cs50/dont-panic-python/reset.sql:241` | False positive — same |
| `dont-panic/hack.sql:3` | False positive — same, pre-`cs50/` path |
| `dont-panic/reset.sql:241` | False positive — same, pre-`cs50/` path |
| `dont-panic-python/reset.sql:241` | False positive — same, pre-`cs50/` path |
| `github notion integration.json:450` | **Real secret** |

### The real one

Commit `81a59935` contains an n8n `webhookSecret` — a 64-character hex HMAC
secret for a GitHub PR-trigger webhook. The file is absent from every current
branch, but the commit is reachable from `main`'s history and the repo is public,
so the value has been readable since **2025-04-18**.

Rotating it requires re-saving the workflow in n8n. Deleting the file does not
rotate the secret. History rewriting was rejected: rewriting ~940 commits across
10 branches is high-risk, and the file is already off every branch.

### Making the nightly run green

Add a `.gitleaksignore` with the six CS50 fingerprints. Deliberately not done
here — suppressing findings is a judgement call, and the genuine secret should be
rotated rather than ignored.

---

## 8. Residual risk

1. **Nightly run is red** until section 7 is addressed. Push and PR enforcement
   are unaffected.
2. **The n8n secret is still valid until rotated.** CI cannot fix this; it is the
   highest-priority follow-up.
3. **Direct pushes to `main` bypass the status check.** GitHub does not run
   status checks on direct pushes at all. That path relies on native push
   protection, which matches known provider token formats — a narrower net than
   gitleaks. Closing this requires moving the n8n automation to PRs, after which
   `enforce_admins` can be re-enabled.
4. **`GITLEAKS_VERSION: latest` can break CI spontaneously.** A new gitleaks
   release may add a rule that fails the build with no commit from you. Fix by
   adding the reported fingerprint to `.gitleaksignore` or pinning a version.
   Currently resolves to 8.30.1, which is clean.
5. **`0 0 * * *` is the most contended schedule slot.** GitHub's own docs advise
   against the top of the hour, and runs can be delayed or dropped under load.
   A run at 00:00 may start minutes late.
6. **`ubuntu-latest` moves to Ubuntu 26 on 2026-10-19.** Flagged by the runner;
   no action needed unless the job breaks in October.
7. **No local pre-commit hook**, by choice.

---

## 9. Follow-ups

1. Rotate the n8n `webhookSecret` from commit `81a59935` if that workflow is live.
2. Add `.gitleaksignore` for the six CS50 fixtures to green the nightly run.
3. Review Dependabot PR #7 (checkout v6.1.0 → v7.0.1).
4. Consider pinning `GITLEAKS_VERSION` instead of `latest`.

Re-run the audit on demand at any time:

```bash
gh workflow run "Scanning" --ref main
```
