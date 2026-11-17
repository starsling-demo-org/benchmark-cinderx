# cinderx CI: GitHub vs StarSling

> Not affiliated with [facebookincubator/cinderx](https://github.com/facebookincubator/cinderx) (308 stars). This repository replays cinderx's own CI on real upstream commits to measure **how much machine time a push uses** (runner time) and **how long it waits for every check**, from the first workflow starting to the last job finishing.

## Results

**Pushes** (typical per push):

**StarSling: 1.3x less runner time** than GitHub per push (262.37 min → 208.93 min of machine time; GitHub 4 vCPU vs StarSling 4 vCPU).

StarSling = StarSling runners + StarSling agent PRs.

Wait: **StarSling is 5.2x faster** than GitHub for a push to finish every check (81.83 min → 15.85 min).

| | Runner time per push | vs GitHub | Wait per push | vs GitHub |
|---|---:|---:|---:|---:|
| GitHub (the project's CI as is, on GitHub-hosted runners) | **262.37 min** | 1x | **81.83 min** | 1x |
| StarSling (StarSling runners + agent PRs) | **208.93 min** | **1.3x** less runner time | **15.85 min** | **5.2x** faster |

Runner time compared at these machine sizes: GitHub 4 vCPU vs StarSling 4 vCPU.

**Where the savings come from**

Runner time:

- StarSling runners alone (CI unchanged): 208.95 min, **1.3x** less runner time than GitHub
- StarSling agent PRs, on the same runners: **1.0x** less runner time (208.95 min → 208.93 min)
- Together: 1.3x × 1.0x = 1.3x

Wait:

- StarSling runners alone (CI unchanged): 67.15 min, **1.2x** faster than GitHub
- StarSling agent PRs, on the same runners: **4.2x** faster (67.15 min → 15.85 min)
- Together: 1.2x × 4.2x = 5.2x

> **3 sample(s) failed or were re-run and replaced** (StarSling unchanged (hardware alone): 1; StarSling + agent PRs: 2). Only complete samples are in the medians.

<sub>Typical = the median over complete rounds. Total = StarSling runners alone × agent PRs on top. Details are in the Appendix.</sub>

## Terms

| Term | Meaning |
|---|---|
| **Runner time** | Total machine time all jobs used for one push, summed across jobs; billed per second. |
| **Wait** | How long one push (or PR update) takes until every check has finished: from the first workflow starting to the last job finishing. |
| **GitHub** | The project's own CI, unchanged, on GitHub-hosted runners (the machines GitHub rents out). |
| **StarSling** | StarSling runners (faster machines) plus StarSling agent PRs (changes to the CI itself). |
| **Agent PRs** | Small pull requests StarSling's agent wrote against the project's CI to make it faster. Each is measured on its own in the Appendix. |
| **Median** | The middle result. Half the runs were faster, half were slower, so one odd run does not move it. |
| **Round** | One replay of the same change on every setup. Only rounds where every setup finished cleanly count. |
| **Cold** | Every run starts with no GitHub Actions caches (saved downloads and build output). |

## Appendix

<details>
<summary>Agent PRs: what each one changed and its own effect</summary>

Merged in this order. Each row's effect comes from its own before/after experiment; the last row's cumulative wait is the headline.

| # | Agent PR | What it changed | Its own effect (typical wait, before → after) | Wait after it (cumulative) |
|---:|---|---|---|---:|
| 1 | [pull/1](https://github.com/starsling-demo-org/benchmark-cinderx/pull/1) | split build wheels per wheel | 67.15 min → 15.85 min (−76%), 5 runs per side | 15.85 min |

</details>

<details>
<summary>What we changed</summary>

- [split build wheels per wheel](https://github.com/starsling-demo-org/benchmark-cinderx/pull/1)

</details>

<details>
<summary>Same checks, same results</summary>



</details>

<details>
<summary>Every push, round by round</summary>

Each cell is the whole wait for that push and links to its run.

| Upstream commit | Round | GitHub unchanged | StarSling unchanged (hardware alone) | StarSling + agent PRs |
|---|---:|---:|---:|---:|
| [`876787b2`](https://github.com/facebookincubator/cinderx/commit/876787b2c0d0073793c41dcb61c547418f7401f5) | 1 | [75.18 min](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43919695436) | [70.20 min](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43905740975) | [16.70 min](https://github.com/starsling-demo-org/benchmark-cinderx-lane2/actions/runs/44003608372) |
| [`876787b2`](https://github.com/facebookincubator/cinderx/commit/876787b2c0d0073793c41dcb61c547418f7401f5) | 2 | [73.22 min](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43953400838) | [76.75 min](https://github.com/starsling-demo-org/benchmark-cinderx-lane1/actions/runs/43996291205) | [15.42 min](https://github.com/starsling-demo-org/benchmark-cinderx-lane2/actions/runs/44000404771) |
| [`876787b2`](https://github.com/facebookincubator/cinderx/commit/876787b2c0d0073793c41dcb61c547418f7401f5) | 3 | [83.98 min](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43970034419) | [66.90 min](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43983392307) | [15.85 min](https://github.com/starsling-demo-org/benchmark-cinderx/actions/runs/43966677368) |
| [`876787b2`](https://github.com/facebookincubator/cinderx/commit/876787b2c0d0073793c41dcb61c547418f7401f5) | 4 | [83.30 min](https://github.com/starsling-demo-org/benchmark-cinderx-lane1/actions/runs/43958842173) | [67.12 min](https://github.com/starsling-demo-org/benchmark-cinderx-lane1/actions/runs/43985854369) | [14.78 min](https://github.com/starsling-demo-org/benchmark-cinderx-lane2/actions/runs/43997197025) |
| [`876787b2`](https://github.com/facebookincubator/cinderx/commit/876787b2c0d0073793c41dcb61c547418f7401f5) | 5 | [81.83 min](https://github.com/starsling-demo-org/benchmark-cinderx-lane1/actions/runs/43942534090) | [67.15 min](https://github.com/starsling-demo-org/benchmark-cinderx-lane1/actions/runs/43974448926) | [16.72 min](https://github.com/starsling-demo-org/benchmark-cinderx-lane2/actions/runs/43993756110) |

</details>

<details>
<summary>How it's measured</summary>

1. **Pin.** facebookincubator/cinderx is pinned at [`876787b2`](https://github.com/facebookincubator/cinderx/commit/876787b2c0d0073793c41dcb61c547418f7401f5), the [`upstream/`](upstream) submodule in this repository. Each scenario replays one real upstream event: the merge of [`876787b2`](https://github.com/facebookincubator/cinderx/commit/876787b2c0d0073793c41dcb61c547418f7401f5) to `main`.
2. **Replay natively.** Each sample pushes that exact tree to this repository's `main` branch and fires the real GitHub event (a push, or a PR synchronize). Every workflow, job and step runs with its own triggers, filters, `needs`, conditions, matrices and `workflow_run` follow-ups, in the order GitHub schedules them.
3. **Runner configurations.** GitHub-hosted runners and StarSling Runners run the CI unchanged; StarSling Runners also run it with the agent PR applied (self-improving CI). Jobs on runners StarSling does not offer stay on GitHub-hosted runners in every configuration and still count.
4. **Rounds.** 5 rounds; in each, every runner configuration replays the event once, in a deterministic shuffled order, one sample at a time. Medians use only complete rounds, and a sample counts only if every expected job succeeded on the first attempt.
5. **Control caches.** Cold cache: Every sample starts with no GitHub Actions caches.
6. **Check.** Replays are compared job by job with upstream's own runs for the same commit, and every sample's test verdicts, coverage and cache restores are read from its own job logs.

- Samples ran concurrently, each in its own cache scope (one repository per lane: benchmark-cinderx-lane1, benchmark-cinderx-lane2, with the same branches, events and payloads as benchmark-cinderx); a cold sample ran with no caches in its repository. 6 samples came from an earlier sequential run of the same configuration.

- **Cold:** Every sample starts with no GitHub Actions caches.
- **Failed or re-run samples** (replaced, not in the medians): GitHub unchanged: 0; StarSling unchanged (hardware alone): 1; StarSling + agent PRs: 2.

</details>

<details>
<summary>Runners</summary>

| Runners | Label | vCPU | Memory |
|---|---|---:|---:|
| GitHub-hosted | `macos-26` | 4 | 16 GiB |
| GitHub-hosted | `ubuntu-24.04-4core` | 4 | 16 GiB |
| GitHub-hosted | `ubuntu-26.04-arm-4core` | 4 | 16 GiB |
| GitHub-hosted | `windows-2025-4core` | 4 | 16 GiB |
| StarSling | `macos-26` | 4 | 16 GiB |
| StarSling | `starsling-ubuntu-24.04` | 4 | 16 GiB |
| StarSling | `ubuntu-26.04-arm-4core` | 4 | 16 GiB |
| StarSling | `windows-2025-4core` | 4 | 16 GiB |

GitHub-hosted jobs run on the explicit GitHub larger-runner label shown, pinned to the size of upstream's public-repository runner, so the comparison does not change with this repository's visibility.

</details>

<sub>Generated by `bench showcase` from experiment `full-2`. Machine-readable results: [`benchmark/results.json`](benchmark/results.json). Configurations: GitHub-hosted runners; StarSling Runners (hardware only); StarSling Runners (self-improving CI).</sub>
