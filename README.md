# cinderx CI: GitHub-hosted runners vs StarSling Runners (with agents)

_Not affiliated with [facebookincubator/cinderx](https://github.com/facebookincubator/cinderx) (308 stars)._

cinderx's own CI workflows, replayed for a real upstream merge to its default branch on GitHub-hosted runners and on StarSling Runners (with agents). Every number comes from this repository's replays; upstream's own runs are linked for comparison.

StarSling Runners (with agents) = StarSling runners + StarSling agent PRs.

## Results

Every sample starts with no GitHub Actions caches.

| Runner configuration | Merge CI duration<br><sub>Merge to the default branch</sub> | Runner time<br><sub>Merge to the default branch</sub> |
|---|---:|---:|
| **GitHub-hosted runners** | 81.83 min | 262.37 min |
| **StarSling Runners (with agents)** | 15.85 min<br>**5.2× faster** | 208.93 min<br>**1.3× less** |

- On StarSling Runners (with agents), every check for a merge to the default branch finished in **15.85 min** instead of 81.83 min (**5.2× faster**), using 208.93 min instead of 262.37 min of runner time (**1.3× less**).
- **PR updates:** not measured. At the replayed commit, upstream's `ci.yml` runs on every push and every pull request, so a PR update would run the same jobs as a merge; this benchmark pinned only the merge to the default branch, and no upstream pull request was pinned for replay.
- **Context, not the headline** (upstream's own runs; not like-for-like with the numbers above): What upstream sees today: a median 78.7 min per merge to the default branch on upstream's own GitHub runners (n=12, most recent comparable merges to the default branch within the last 60 days; standard, arm, macOS and Windows runners, warm caches, many commits; not a like-for-like replay).

<sub>Medians over complete rounds.</sub>

## Runners

| Runners | Label | vCPU | Memory |
|---|---|---:|---:|
| GitHub-hosted | `ubuntu-24.04-4core` | 4 | 16 GiB |
| StarSling | `starsling-ubuntu-24.04` | 4 | 16 GiB |

Runner time compared at these machine sizes: GitHub 4 vCPU vs StarSling 4 vCPU. StarSling's 4 vCPU runners can burst to 5 vCPU and 32 GB RAM (Afterburner); GitHub's 4-core runners have 16 GB.

These labels run the Ubuntu x86 jobs. StarSling has no ARM, macOS or Windows runners, so those jobs run on the same GitHub-hosted labels in both configurations: `ubuntu-26.04-arm-4core` (4 vCPU, 16 GiB), `macos-26` (GitHub's standard Apple-silicon macOS runner) and `windows-2025-4core` (4 vCPU, 16 GiB).

GitHub-hosted jobs run on the explicit GitHub larger-runner label shown, pinned to the size of upstream's public-repository runner, so the comparison does not change with this repository's visibility.

## Claim checklist

- [x] **Same CI as upstream:** replays run the same workflows and jobs as upstream's own runs, with the same conclusions
- [x] **Same checks, same results:** every sample's checks were read from its own job logs, and all passed in every configuration
- [x] **Cache state verified** for every sample
- [x] **Both runner configurations measured** (2 of 2)
- [x] **All requested samples finished** (10 of 10)
- [x] **At least 5 rounds** (5 requested)
- [x] **No interference:** no other workflow run overlapped a sample
- [ ] **Cost neutral:** not established. The agent PR adds parallel jobs (21 jobs per merge instead of 13), so it does not meet this benchmark's cost-neutral rule; it shortens the wait, not the runner time.

### Same CI as upstream

- **Merge to the default branch:** same workflow (`ci.yml`) and jobs (8 `Run Tests` jobs, 4 `Build wheels` jobs and `Build source distribution`) as upstream's own run for the same commit ([#42680035718](https://github.com/facebookincubator/cinderx/actions/runs/42680035718)), same conclusions. Upstream's other workflows do not run on this merge: `docs.yml` runs only when the docs or website change, and `publish.yml` only on a schedule or a manual run.

### Same checks, same results

Every counted sample's results were read from its own job logs. In all 10 counted samples (5 per configuration) the same checks ran and passed, with the same counts in every sample: the test jobs on 8 platform and Python combinations (Ubuntu x86 with Python 3.14, 3.15 and 3.14t, Ubuntu ARM with 3.14 and 3.15, macOS with 3.14 and 3.15, Windows with 3.14), with their pytest totals and, on Linux and macOS, their C++ test totals; the same 13 wheels (5 Linux x86, 5 Linux ARM, 2 macOS, 1 Windows), 11 of them with the test run cibuildwheel makes inside the wheel build; and the source distribution. The free-threaded 3.14t test job has no test step upstream, in any configuration. **Job (check) names change with the agent PR:** each wheel gets its own job, so `Build wheels on ubuntu-latest` becomes one job per wheel (for example `Build wheels on ubuntu-latest (cp314-manylinux_x86_64)`), 12 wheel jobs instead of 4. The wheels built are the same set. A branch-protection rule or required-check list that names the old job names needs updating before the change is merged.

## Terms

| Term | Meaning |
|---|---|
| **PR CI duration** | Elapsed time from the first workflow starting to the last job finishing, across every workflow one PR update starts (including `workflow_run` follow-ups). |
| **Merge CI duration** | The same, for every workflow one merge to the default branch starts. |
| **Runner time** | Total machine time all jobs used for one event, summed across jobs; billed per second. Jobs kept on GitHub-hosted runners still count. |
| **StarSling Runners (with agents)** | StarSling runners plus StarSling agent PRs: the project's CI with StarSling's agent PRs applied, running on StarSling runners. "StarSling" on this page always means this one configuration. |
| **Round** | One replay of the event on every runner configuration. Medians use only complete rounds. |
| **Cost neutral** | The agent PRs save runner time without adding parallel jobs that spend it again. |

## Appendix

<details>
<summary>Agent PRs</summary>

Merged in this order. Each fix's own measurement, on the CI step it changes, is under What we changed.

| # | Agent PR | What it changed |
|---:|---|---|
| 1 | [pull/1](https://github.com/starsling-demo-org/benchmark-cinderx/pull/1) | Builds each wheel in its own job instead of building all of an operating system's wheels one after another in one job. One file, `ci.yml`: the `build_wheels` matrix becomes a list of 12 entries (5 Linux x86 wheels, 5 Linux ARM wheels, 1 macOS entry that builds both macOS wheels, 1 Windows entry), each job builds only its own wheel through `CIBW_BUILD`, and the job name gains the wheel. The 13 wheel selectors equal the 13 in `pyproject.toml`, so no wheel is dropped or added. The wheel build settings, the tests cibuildwheel runs per wheel, and `pyproject.toml` are unchanged. Job (check) names change, so a required-check list that names the old jobs needs updating. |

</details>

<details>
<summary>What was slow</summary>

Every merge to cinderx's default branch runs one workflow, `ci.yml`, whose 13 jobs all start at once. The tests take at most a median 1,050 s on GitHub-hosted runners (Ubuntu x86, Python 3.14). The wheel builds are what the merge waits for: each operating system builds all of its wheels one after another in a single job, and every Linux wheel is a separate profile-guided, link-time-optimized build. On GitHub-hosted runners, cold, the Linux x86 wheel job (five wheels) took a median 4,907 s of the 4,910 s merge; the Linux ARM wheel job (five wheels) took 3,984 s, the macOS wheel job 736 s and the Windows wheel job 577 s.

</details>

<details>
<summary>What we changed</summary>

The original showcase for this project proposed one fix: build every wheel in its own job, so the wait is the slowest wheel rather than the sum of an operating system's wheels. We measured it on StarSling runners, with 5 runs on each side (the CI as it was, and the CI with the fix), on the jobs it changes. Every sample was cold.

| Fix | Result | Decision |
|---|---|---|
| Build each wheel in its own job instead of in one job per operating system | Longest wheel-build path: 4,029 s to 950 s (median), 76.4% shorter; every run with the fix beat every run without it (slowest with it 1,002 s, fastest without it 4,013 s). | Kept (agent PR 1) |

The fix changes how many jobs run, not how much work is done: the same 13 wheels are built, in 12 jobs instead of 4, and setup repeats in each job. On StarSling runners, runner time with and without the fix came out about the same, so the fix shortens the wait but does not cut runner time. After the fix, the longest jobs are single Linux ARM wheel builds on GitHub-hosted ARM runners (881 to 996 s per sample); they set the wait in both configurations. A compiler cache was considered and not included.

**Why the wait drops more than runner time:** the agent PR builds each wheel in its own job instead of building all of an operating system's wheels one after another in one job. The wheels now build side by side, so the wait drops a lot. The same wheels are still built, and each new job repeats its setup, so runner time compared with GitHub drops much less. The Linux ARM, macOS and Windows jobs run on GitHub-hosted runners in both configurations (StarSling has no runners for them), and their runner time counts in both columns.

- [Build each wheel in its own job](https://github.com/starsling-demo-org/benchmark-cinderx/pull/1)

</details>

<details>
<summary>Every sample, with links to its runs</summary>

Each cell is the whole wait for that merge and links to its run.

| Upstream commit | Round | GitHub-hosted runners | StarSling Runners (with agents) |
|---|---:|---:|---:|
| [`876787b2`](https://github.com/facebookincubator/cinderx/commit/876787b2c0d0073793c41dcb61c547418f7401f5) | 1 | [75.18 min](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43919695436) | 16.70 min |
| [`876787b2`](https://github.com/facebookincubator/cinderx/commit/876787b2c0d0073793c41dcb61c547418f7401f5) | 2 | [73.22 min](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43953400838) | 15.42 min |
| [`876787b2`](https://github.com/facebookincubator/cinderx/commit/876787b2c0d0073793c41dcb61c547418f7401f5) | 3 | [83.98 min](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43970034419) | [15.85 min](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43966677368) |
| [`876787b2`](https://github.com/facebookincubator/cinderx/commit/876787b2c0d0073793c41dcb61c547418f7401f5) | 4 | 83.30 min | 14.78 min |
| [`876787b2`](https://github.com/facebookincubator/cinderx/commit/876787b2c0d0073793c41dcb61c547418f7401f5) | 5 | 81.83 min | 16.72 min |

</details>

<details>
<summary>Method</summary>

1. **Pin.** facebookincubator/cinderx is pinned at [`876787b2`](https://github.com/facebookincubator/cinderx/commit/876787b2c0d0073793c41dcb61c547418f7401f5), the [`upstream/`](upstream) submodule in this repository. Each scenario replays one real upstream event: the merge of [`876787b2`](https://github.com/facebookincubator/cinderx/commit/876787b2c0d0073793c41dcb61c547418f7401f5) to the default branch.
2. **Replay natively.** Each sample puts that exact tree on a branch of this repository named like upstream's default branch, which fires the same GitHub event a merge to the default branch fires. Every workflow, job and step runs with its own triggers, filters, `needs`, conditions, matrices and `workflow_run` follow-ups, in the order GitHub schedules them.
3. **Runner configurations.** GitHub-hosted runners run the CI unchanged; StarSling Runners (with agents) run it with the agent PR applied. Jobs on runners StarSling does not offer stay on GitHub-hosted runners in every configuration and still count; here those are the Linux ARM, macOS and Windows jobs.
4. **Rounds.** 5 rounds; in each, every runner configuration replays the event once. Medians use only complete rounds, and a sample counts only if every expected job succeeded on the first attempt.
5. **Control caches.** Cold cache: every sample starts with no GitHub Actions caches. The fix uses no cache, so no warm samples were run.
6. **Check.** Replays are compared job by job with upstream's own runs for the same commit, and every sample's test verdicts, coverage and cache restores are read from its own job logs.

- **Control configuration.** Each round also replayed the event on StarSling runners with the CI unchanged, as an internal control. It is not part of this comparison, and its samples are not shown in the tables on this page; they are in the data files under `benchmark/`.
- **Default branch.** The default branch is `main`.
- **Lane: merges to the default branch.** This page measures merges to cinderx's default branch. Each sample replays the merge of `876787b2`. PR updates were not measured: at this commit `ci.yml` also runs on pull requests, but no upstream pull request was pinned for replay.
- **Workflows in this merge.** The replayed merge runs upstream's `ci.yml`: 13 jobs (8 test jobs, 4 wheel-build jobs and the source distribution), 21 jobs with the agent PR (8 test jobs, 12 wheel-build jobs and the source distribution). `docs.yml` (docs and website changes only) and `publish.yml` (schedule and manual runs only) do not run on this merge.
- **One repository per lane.** Most samples ran concurrently, each in its own cache scope (one separate copy of this repository per lane, two in all, with the same branches, events and payloads as this repository), so their caches never mix; a cold sample ran with no caches in its repository. 4 of the 10 samples on this page (GitHub-hosted runners rounds 1 to 3, and StarSling Runners (with agents) round 3) came from an earlier sequential run of the same configuration in this repository, one sample at a time; the other 6 came from the lanes. Those copies are not public, so samples that ran in them appear in the sample table without a run link.
- **Root and non-root StarSling samples, pooled.** During the benchmark, StarSling switched this organization's jobs from root to an ordinary (non-root) user. Samples are classed by their first workflow start. Of the 10 StarSling-runner samples in this benchmark (the 5 shown here and the 5 of the control), 1 ran as root (a control sample) and 9 as non-root; all 5 StarSling Runners (with agents) samples on this page ran as non-root. Before pooling, the step the agent PR changes (the `Build wheels` steps, summed across the wheel-build jobs) was compared across the two: the root sample's 7,955 s fell inside the non-root range for the same CI (7,614 to 8,353 s), so no shift was found.
- **RAM-disk storage voids, re-run.** This benchmark counts StarSling samples only when every StarSling runner had its usual RAM disk. After a storage change in this organization, 3 samples from the earlier sequential run were excluded because their StarSling runners' RAM disk could not be confirmed: 2 StarSling Runners (with agents) samples (rounds 1 and 2) and 1 control sample (round 2). Each was re-run once in a lane, and the re-run fills its slot. None of the excluded runs is on this page or in any number on it. Every counted StarSling sample's runners were checked. No GitHub-hosted sample was excluded.
- **Bench-only changes, identical in every configuration and never part of the agent PR:**
  - Runner labels only: upstream's `ubuntu-latest` (Ubuntu 24.04 on upstream's own run of this commit, not today's 26.04) is replaced by the runner label of each configuration, and `ubuntu-26.04-arm`, `macos-latest` and `windows-latest` by the explicit GitHub labels in Runners, the same in both configurations. `ci.yml` has no secrets, registry pushes or publish steps, so nothing else is changed or switched off.
  - Time limit: the benchmark waits up to 120 minutes for a sample (the default is 60; upstream's own run of this merge took 77 minutes). This is a wait limit only; nothing measured changes.
  - One harness step, `Benchmark event context (harness)`, is added at the start of every job. It prints two IDs so each job can be matched to its sample; its median time is 0 s.
  - On the agent PR's own branch (`starsling/develop`) only, never in a replay: a setup commit points the workflow's trigger at that branch (it changes the trigger only), so the PR's checks run there.
- **Container images.** The wheel builds pull upstream's `manylinux_2_28` and `musllinux_1_2` build images by their moving `latest` tag on quay.io, as upstream does, so the build image can change between runs in either configuration.
- **Concurrency.** With the agent PR a merge starts 21 jobs at once (9 on Ubuntu x86, 7 on Ubuntu ARM, 3 on macOS, 2 on Windows). In every counted sample no job waited more than 20 s for a runner (7 s at most on the GitHub-hosted ARM runners).
- **Runner sizes.** Upstream's `ubuntu-latest` jobs (the Ubuntu x86 tests, wheels and source distribution) run on GitHub `ubuntu-24.04-4core` (4 vCPU, 16 GiB) and StarSling `starsling-ubuntu-24.04` (4 vCPU, 16 GiB). StarSling's 4 vCPU runners can burst to 5 vCPU and 32 GB RAM (Afterburner); GitHub's 4-core runners have 16 GB. The Linux ARM jobs run on GitHub `ubuntu-26.04-arm-4core` (4 vCPU, 16 GiB), the macOS jobs on GitHub `macos-26` and the Windows jobs on GitHub `windows-2025-4core` (4 vCPU, 16 GiB), in both configurations.
- **Upstream reference (context only; not like-for-like; not the headline).** What upstream sees today: a median 78.7 min per merge to the default branch on upstream's own GitHub runners (n=12, most recent comparable merges to the default branch within the last 60 days; standard, arm, macOS and Windows runners, warm caches, many commits; not a like-for-like replay).
- **Failed or re-run samples** (replaced, not in the medians): GitHub-hosted runners: 0; StarSling Runners (with agents): 2 (the RAM-disk exclusions above).

</details>

<sub>Generated by `bench showcase` from experiment `full-2`. Machine-readable results: [`benchmark/results.json`](benchmark/results.json).</sub>
