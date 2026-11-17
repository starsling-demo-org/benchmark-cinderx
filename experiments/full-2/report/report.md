# StarSling Whole-Pipeline Benchmark Report (`full-2`)

- **Upstream:** `facebookincubator/cinderx@876787b2c0d0073793c41dcb61c547418f7401f5`
- **Timestamp Resolution:** `1s` (GitHub Actions workflow/job/step timestamps)

## Event `main-push` · cold cache

**Total speedup 5.16×: hardware speedup 1.22×, self-improving CI speedup 4.24× on StarSling Runners and — on GitHub-hosted runners. Evidence: coverage-qualified.**

### Runner configurations

| Runner configuration | Complete / requested | CI duration p50 (IQR) | CI minutes p50 | Estimated cost p50 (USD) | Trigger latency p50 | Harness overhead p50 |
|---|---|---|---|---|---|---|
| `github-baseline` | 5/5 | 4910.0 s (IQR 487.0 s, n=5) | 262.37 min | $4.3200 | 5.0 s | 0.0 s |
| `starsling-baseline` | 5/5 | 4029.0 s (IQR 185.0 s, n=5) | 208.95 min | $2.9360 | 4.0 s | 0.0 s |
| `starsling-patched` | 5/5 | 951.0 s (IQR 77.0 s, n=5) | 208.93 min | $2.9520 | 5.0 s | 1.0 s |

### Speedups

| Speedup | Ratio | Compares | Cost neutral |
|---|---|---|---|
| `github-baseline` / `github-patched` | — | Self-improving CI speedup, GitHub-hosted runners | Not established (Self-improving CI changed which runners jobs use, so its speedup includes a hardware change.) |
| `starsling-baseline` / `starsling-patched` | 4.24× | Self-improving CI speedup, StarSling Runners | Not established (Self-improving CI changed which runners jobs use, so its speedup includes a hardware change.; The agent PRs add parallel jobs; cost neutrality needs an unsharded control.) |
| `github-baseline` / `starsling-baseline` | 1.22× | Hardware speedup | Not applicable: hardware speedups never establish it |
| `github-baseline` / `starsling-patched` | 5.16× | Total speedup | Not applicable |

### Step times

| Workflow › job | Step | Change | GitHub-hosted p50 | GitHub-hosted, self-improving CI p50 | StarSling, hardware only p50 | StarSling, self-improving CI p50 |
|---|---|---|---|---|---|---|
| `.github/workflows/ci.yml#build_sdist` | Set up job | `matched` | 1.0 s | — | 1.0 s | 1.0 s |
| `.github/workflows/ci.yml#build_sdist` | Benchmark event context (harness) | `matched` | 0.0 s | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#build_sdist` | Checkout CinderX | `matched` | 1.0 s | — | 1.0 s | 1.0 s |
| `.github/workflows/ci.yml#build_sdist` | Set up Python | `matched` | 0.0 s | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#build_sdist` | Install build tools | `matched` | 2.0 s | — | 1.0 s | 1.0 s |
| `.github/workflows/ci.yml#build_sdist` | Build sdist | `matched` | 4.0 s | — | 2.0 s | 3.0 s |
| `.github/workflows/ci.yml#build_sdist` | Post Set up Python | `matched` | 0.0 s | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#build_sdist` | Post Checkout CinderX | `matched` | 0.0 s | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#build_sdist` | Complete job | `matched` | 0.0 s | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#build_wheels` | Set up job | `matched` | 1.0 s | — | 1.0 s | 1.0 s |
| `.github/workflows/ci.yml#build_wheels` | Benchmark event context (harness) | `matched` | 0.0 s | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#build_wheels` | Checkout CinderX | `matched` | 2.0 s | — | 1.0 s | 1.0 s |
| `.github/workflows/ci.yml#build_wheels` | Set up Python | `matched` | 0.0 s | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#build_wheels` | Install cibuildwheel | `matched` | 3.0 s | — | 3.0 s | 3.0 s |
| `.github/workflows/ci.yml#build_wheels` | Build wheels | `matched` | 2330.0 s | — | 1526.0 s | 663.0 s |
| `.github/workflows/ci.yml#build_wheels` | Post Set up Python | `matched` | 0.0 s | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#build_wheels` | Post Checkout CinderX | `matched` | 0.5 s | — | 1.0 s | 0.0 s |
| `.github/workflows/ci.yml#build_wheels` | Complete job | `matched` | 0.0 s | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#run_tests` | Set up job | `matched` | 1.0 s | — | 1.0 s | 1.0 s |
| `.github/workflows/ci.yml#run_tests` | Benchmark event context (harness) | `matched` | 0.0 s | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#run_tests` | Checkout CinderX | `matched` | 1.0 s | — | 1.0 s | 1.0 s |
| `.github/workflows/ci.yml#run_tests` | Set up Python | `matched` | 0.0 s | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#run_tests` | Set up uv | `matched` | 2.0 s | — | 1.0 s | 1.0 s |
| `.github/workflows/ci.yml#run_tests` | Install GCC 14 | `matched` | 4.0 s | — | 3.0 s | 3.5 s |
| `.github/workflows/ci.yml#run_tests` | Create venv | `matched` | 0.0 s | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#run_tests` | Build CinderX | `matched` | 339.0 s | — | 189.5 s | 192.0 s |
| `.github/workflows/ci.yml#run_tests` | Install CinderX | `matched` | 0.0 s | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#run_tests` | Check CinderX loads successfully | `matched` | 200.0 s | — | 102.0 s | 102.0 s |
| `.github/workflows/ci.yml#run_tests` | Install pytest | `matched` | 0.0 s | — | 0.0 s | 1.0 s |
| `.github/workflows/ci.yml#run_tests` | Run Tests | `matched` | 222.5 s | — | 196.0 s | 179.5 s |
| `.github/workflows/ci.yml#run_tests` | Run native tests | `matched` | 19.5 s | — | 15.5 s | 16.0 s |
| `.github/workflows/ci.yml#run_tests` | Post Set up uv | `matched` | 1.0 s | — | 1.0 s | 1.0 s |
| `.github/workflows/ci.yml#run_tests` | Post Set up Python | `matched` | 0.0 s | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#run_tests` | Post Checkout CinderX | `matched` | 0.0 s | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#run_tests` | Complete job | `matched` | 0.0 s | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#build_sdist` | Set up runner | `matched` | — | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#build_sdist` | Complete runner | `matched` | — | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#run_tests` | Set up runner | `matched` | — | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#run_tests` | Complete runner | `matched` | — | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#build_wheels` | Set up runner | `matched` | — | — | 0.0 s | 0.0 s |
| `.github/workflows/ci.yml#build_wheels` | Complete runner | `matched` | — | — | 0.0 s | 0.0 s |

### Samples

| Sample ID | Round | Runner configuration | Complete | CI duration | CI minutes | Runs and diagnostics |
|---|---|---|---|---|---|---|
| `full-2-main-push-cold-rep1-starsling-baseline` | 1 | `starsling-baseline` | ✓ | 4212.0 s | 212.02m | [run #43905740975](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43905740975) |
| `full-2-main-push-cold-rep1-github-baseline` | 1 | `github-baseline` | ✓ | 4511.0 s | 258.02m | [run #43919695436](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43919695436) |
| `full-2-main-push-cold-rep2-github-baseline` | 2 | `github-baseline` | ✓ | 4393.0 s | 259.00m | [run #43953400838](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43953400838) |
| `full-2-main-push-cold-rep3-starsling-patched` | 3 | `starsling-patched` | ✓ | 951.0 s | 223.90m | [run #43966677368](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43966677368) |
| `full-2-main-push-cold-rep3-github-baseline` | 3 | `github-baseline` | ✓ | 5039.0 s | 278.07m | [run #43970034419](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43970034419) |
| `full-2-main-push-cold-rep3-starsling-baseline` | 3 | `starsling-baseline` | ✓ | 4014.0 s | 208.95m | [run #43983392307](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43983392307) |
| `full-2-main-push-cold-rep5-github-baseline` | 5 | `github-baseline` | ✓ | 4910.0 s | 262.37m | [run #43942534090](https://github.com/starsling-demo-org/benchmark-cinderx-lane1/actions/runs/43942534090) |
| `full-2-main-push-cold-rep4-github-baseline` | 4 | `github-baseline` | ✓ | 4998.0 s | 264.65m | [run #43958842173](https://github.com/starsling-demo-org/benchmark-cinderx-lane1/actions/runs/43958842173) |
| `full-2-main-push-cold-rep5-starsling-baseline` | 5 | `starsling-baseline` | ✓ | 4029.0 s | 205.18m | [run #43974448926](https://github.com/starsling-demo-org/benchmark-cinderx-lane1/actions/runs/43974448926) |
| `full-2-main-push-cold-rep4-starsling-baseline` | 4 | `starsling-baseline` | ✓ | 4027.0 s | 201.00m | [run #43985854369](https://github.com/starsling-demo-org/benchmark-cinderx-lane1/actions/runs/43985854369) |
| `full-2-main-push-cold-rep5-starsling-patched` | 5 | `starsling-patched` | ✓ | 1003.0 s | 208.93m | [run #43993756110](https://github.com/starsling-demo-org/benchmark-cinderx-lane2/actions/runs/43993756110) |
| `full-2-main-push-cold-rep2-starsling-baseline-retry1` | 2 | `starsling-baseline` | ✓ | 4605.0 s | 215.93m | [run #43996291205](https://github.com/starsling-demo-org/benchmark-cinderx-lane1/actions/runs/43996291205) |
| `full-2-main-push-cold-rep4-starsling-patched` | 4 | `starsling-patched` | ✓ | 887.0 s | 204.03m | [run #43997197025](https://github.com/starsling-demo-org/benchmark-cinderx-lane2/actions/runs/43997197025) |
| `full-2-main-push-cold-rep2-starsling-patched-retry1` | 2 | `starsling-patched` | ✓ | 925.0 s | 200.85m | [run #44000404771](https://github.com/starsling-demo-org/benchmark-cinderx-lane2/actions/runs/44000404771) |
| `full-2-main-push-cold-rep1-starsling-patched-retry1` | 1 | `starsling-patched` | ✓ | 1002.0 s | 213.40m | [run #44003608372](https://github.com/starsling-demo-org/benchmark-cinderx-lane2/actions/runs/44003608372) |
| `full-2-main-push-cold-rep1-starsling-patched` | 1 | `starsling-patched` | ✗ | 903.0 s | 204.93m | [run #43933905850](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43933905850) (StarSling runner without RAM disk (starsling-z-7c690e5415044d6c93ce6a8fa81c2f5b: storage unknown after the switch; starsling-z-e9b0d783db974a458a7bf206407e08c2: storage unknown after the switch; starsling-z-ff1cc1dd09954ba7a07097f5d3d826b2: storage unknown after the switch; starsling-z-68a171a14afb4ebe8bff1c34f8c1a2a2: storage unknown after the switch; starsling-z-f3f960366d30492f9759447df9e2618e: storage unknown after the switch; starsling-z-289e99bcf1014980adcbff8a00419e59: storage unknown after the switch; starsling-z-988b8424961f4912b55a2de8b0f19f9a: storage unknown after the switch; starsling-z-3753fa8b4b4c43a085e5320c4403313e: storage unknown after the switch; starsling-z-75976725053142ae83cfff99ae7432cf: storage unknown after the switch)) |
| `full-2-main-push-cold-rep2-starsling-patched` | 2 | `starsling-patched` | ✗ | 972.0 s | 208.75m | [run #43937300413](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43937300413) (StarSling runner without RAM disk (starsling-z-fbe1eb47b6814e2896d063d6e4ff80e7: storage unknown after the switch; starsling-z-d8dbd3f66d4949759e6fb532e5d24373: storage unknown after the switch; starsling-z-fdce3d0255da4753a982dc5176725f09: storage unknown after the switch; starsling-z-c9fea3a3fa444f63ae572a7ef9491d3e: storage unknown after the switch; starsling-z-650e0f7de86b40bb9a28dc72bfa1fba6: storage unknown after the switch; starsling-z-e852c53c1fac460aadf1c96b4a196a15: storage unknown after the switch; starsling-z-dc2fda6e24e248018dc672356ddc10c6: storage unknown after the switch; starsling-z-71b91667a721457c849094430a0483f6: storage unknown after the switch; starsling-z-6e3a779720744fc9b93402451433296d: storage unknown after the switch)) |
| `full-2-main-push-cold-rep2-starsling-baseline` | 2 | `starsling-baseline` | ✗ | 3973.0 s | 205.53m | [run #43940911257](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43940911257) (StarSling runner without RAM disk (starsling-z-6922277a994643ffa823a9aa6a0ab4c1: storage unknown after the switch; starsling-z-9a23ab205c40499ea00a3743fa226e23: storage unknown after the switch; starsling-z-a1a0a98c8c9841bf823557b27a66cd86: storage unknown after the switch; starsling-z-fb5943094562450d8816d7b6f53d2d6d: storage unknown after the switch; starsling-z-1ff6619b7c6943f28645482f5a777abe: storage unknown after the switch)) |



## GitHub API calls

Budget: 252 calls per hour for this controller. Free `304 Not Modified` answers are listed separately and do not count against the account.

- **Experiment:** 489 calls (1016 free 304s); jobs 158, job-logs 149, cache-delete 56, run-list 49, workflows 25, caches 20, workflow-write 20, artifacts 10, other-read 2
- **Waiting:** 4173 s stretched to fit the budget, 0 s waiting for an account reset

| Sample | Calls | Free 304s | Biggest callers |
| --- | ---: | ---: | --- |
| `full-1-main-push-cold-rep1-starsling-baseline` | 62 | 103 | job-logs 21, jobs 16, run-list 12, workflows 7, workflow-write 4, artifacts 2 |
| `full-1-main-push-cold-rep1-github-baseline` | 47 | 153 | jobs 21, job-logs 13, run-list 8, workflows 2, workflow-write 2, artifacts 1 |
| `full-1-main-push-cold-rep1-starsling-patched` | 47 | 53 | job-logs 21, jobs 18, run-list 3, workflows 2, workflow-write 2, artifacts 1 |
| `full-1-main-push-cold-rep2-starsling-patched` | 49 | 57 | job-logs 21, jobs 20, run-list 3, workflows 2, workflow-write 2, artifacts 1 |
| `full-1-main-push-cold-rep2-starsling-baseline` | 37 | 139 | jobs 15, job-logs 13, run-list 4, workflows 2, workflow-write 2, artifacts 1 |
| `full-1-main-push-cold-rep2-github-baseline` | 39 | 155 | jobs 18, job-logs 13, run-list 3, workflows 2, workflow-write 2, artifacts 1 |
| `full-1-main-push-cold-rep3-starsling-patched` | 45 | 49 | job-logs 21, jobs 15, run-list 4, workflows 2, workflow-write 2, artifacts 1 |
| `full-1-main-push-cold-rep3-github-baseline` | 36 | 164 | jobs 15, job-logs 13, run-list 3, workflows 2, workflow-write 2, artifacts 1 |
| `full-1-main-push-cold-rep3-starsling-baseline` | 42 | 143 | jobs 20, job-logs 13, run-list 4, workflows 2, workflow-write 2, artifacts 1 |
