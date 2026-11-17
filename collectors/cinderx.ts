/**
 * Evidence extractor for facebookincubator/cinderx CI (ci.yml: run_tests, build_wheels, build_sdist).
 *
 * Units, all read from the replay's job logs:
 * - `Run Tests (<os>, <python>)` jobs: `tests:<os>:<python>` (pytest verdict) with `count:pytest:<os>:<python>:passed=N,
 *   skipped=M,failed=F`, `gtest:<os>:<python>` with the C++ totals (Linux), `wheel-build:<os>:<python>` (the job's own
 *   `uv build` produced a wheel).
 * - `build_wheels` jobs: cibuildwheel prints one `Building <tag> wheel` section per wheel. A section is the unit, so the
 *   result is the same whether one job builds all of an OS's wheels in turn (upstream) or one job builds one wheel (the
 *   split lever), and does not depend on job names, ordering or which job ran which wheel: `wheel:<tag>` (built and listed
 *   in cibuildwheel's `N wheels produced` summary), `wheel-test:<tag>` (the pytest run cibuildwheel does on the repaired
 *   wheel) with its counts as `count:wheel-pytest:<tag>:passed=N,...`. The PGO/LTO training runs also print
 *   `Result: FAILURE`; they are build-internal profile runs and are deliberately not read.
 * - `build_sdist`: `sdist` (`Successfully built *.tar.gz`).
 * Version strings in file names are not part of any unit id (they follow the commit date).
 */
import type { EvidenceExtractor, EvidenceJob } from '../src/evidence-collect.ts'
import type { TestCaseVerdictRecord } from '../src/parity.ts'

type Verdict = TestCaseVerdictRecord['verdict']

export interface PytestSummary {
  passed: number
  failed: number
  skipped: number
  errors: number
  deselected: number
}

/** The last pytest terminal summary line (`=== 3079 passed, 531 skipped, 8 warnings in 287.81s (0:04:47) ===`). */
export function pytestSummary(log: string): PytestSummary | undefined {
  let last: string | undefined
  for (const m of log.matchAll(/^=+ (.+?) in [\d.]+s(?: \([\d:]+\))? =+\s*$/gm)) last = m[1]
  if (last === undefined) return undefined
  const n = (word: string) => Number(new RegExp(`(\\d+) ${word}`).exec(last as string)?.[1] ?? 0)
  return { passed: n('passed'), failed: n('failed'), skipped: n('skipped'), errors: n('errors?'), deselected: n('deselected') }
}

const counts = (s: PytestSummary) => `passed=${s.passed},skipped=${s.skipped},failed=${s.failed + s.errors}`

export interface GtestSummary {
  total: number
  passed: number
  failed: number
}

export function gtestSummary(log: string): GtestSummary | undefined {
  const ran = /^\[=+\] (\d+) tests? from \d+ test suites? ran\./m.exec(log)
  if (!ran) return undefined
  const passed = Number(/^\[\s+PASSED\s+\] (\d+) tests?\./m.exec(log)?.[1] ?? 0)
  const failed = Number(/^\[\s+FAILED\s+\] (\d+) tests?, listed below/m.exec(log)?.[1] ?? 0)
  return { total: Number(ran[1]), passed, failed }
}

export interface WheelSection {
  tag: string
  test?: PytestSummary
}

/** One entry per `Building <tag> wheel` section; the pytest summary after `Testing wheel...` belongs to its section. */
export function wheelSections(log: string): WheelSection[] {
  const marks = [...log.matchAll(/^Building (cp\S+) wheel\s*$/gm)]
  return marks.map((m, i) => {
    const body = log.slice((m.index ?? 0) + m[0].length, marks[i + 1]?.index ?? log.length)
    const at = body.indexOf('Testing wheel')
    return { tag: m[1] as string, test: at >= 0 ? pytestSummary(body.slice(at)) : undefined }
  })
}

/** cibuildwheel's `  cp314-win_amd64: cinderx-...whl 2.1 MB in 9 minutes, SHA256=...` summary lines. */
export function producedWheels(log: string): string[] {
  return [...log.matchAll(/^ {2}(cp[\w.-]+): \S+\.whl /gm)].map((m) => m[1] as string)
}

const extract: EvidenceExtractor = ({ jobs }) => {
  const verdicts = new Map<string, Verdict>()
  const modes = new Map<string, TestCaseVerdictRecord['mode']>()
  const commands = new Set<string>()
  const set = (id: string, verdict: Verdict, mode: TestCaseVerdictRecord['mode'] = 'executed') => {
    verdicts.set(id, verdicts.get(id) === 'failed' ? 'failed' : verdict)
    modes.set(id, mode)
  }
  const ok = (job: EvidenceJob) => job.conclusion === 'success'

  for (const job of jobs) {
    const name = job.jobName
    const tests = /^Run Tests \(([^,]+), ([^)]+)\)/.exec(name)
    const wheels = /^Build wheels on /.test(name)
    if (tests) {
      const key = `${tests[1]}:${tests[2]}`
      const py = pytestSummary(job.log)
      if (!py && /t$/.test(tests[2] ?? '') && ok(job)) {
        // Upstream gates `Run Tests` and `Run native tests` on python-version != '3.14t' (free-threaded build): the
        // job only builds and import-checks. Excluded by upstream's own condition, not failed.
        set(`tests:${key}`, 'skipped', 'skipped')
        commands.add(`${key}: excluded by upstream condition python-version != '3.14t' (no test run)`)
        set(`wheel-build:${key}`, /^Successfully built .*\.whl\s*$/m.test(job.log) ? 'passed' : 'failed')
        continue
      }
      set(`tests:${key}`, ok(job) && !!py && py.failed + py.errors === 0 ? 'passed' : 'failed')
      if (py) set(`count:pytest:${key}:${counts(py)}`, 'passed')
      const gt = gtestSummary(job.log)
      if (gt) {
        set(`gtest:${key}`, ok(job) && gt.failed === 0 ? 'passed' : 'failed')
        set(`count:gtest:${key}:total=${gt.total},passed=${gt.passed}`, 'passed')
      }
      set(`wheel-build:${key}`, ok(job) && /^Successfully built .*\.whl\s*$/m.test(job.log) ? 'passed' : 'failed')
    } else if (wheels) {
      const produced = new Set(producedWheels(job.log))
      for (const section of wheelSections(job.log)) {
        set(`wheel:${section.tag}`, ok(job) && produced.has(section.tag) ? 'passed' : 'failed')
        if (section.test) {
          set(`wheel-test:${section.tag}`, section.test.failed + section.test.errors === 0 && ok(job) ? 'passed' : 'failed')
          set(`count:wheel-pytest:${section.tag}:${counts(section.test)}`, 'passed')
        }
      }
    } else if (name === 'Build source distribution') {
      set('sdist', ok(job) && /^Successfully built \S+\.tar\.gz\s*$/m.test(job.log) ? 'passed' : 'failed')
    }
  }

  const tests: TestCaseVerdictRecord[] = [...verdicts]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([testId, verdict]) => ({ testId, verdict, mode: modes.get(testId) ?? 'executed' }))
  // Excluded (skipped) units are reported but are not part of the coverage scope.
  const units = tests.filter((t) => !t.testId.startsWith('count:') && t.verdict !== 'skipped')
  const passed = new Set(units.filter((t) => t.verdict === 'passed').map((t) => t.testId))
  const obligations: string[] = []
  if ([...passed].some((id) => id.startsWith('tests:'))) obligations.push('run-tests')
  if ([...passed].some((id) => id.startsWith('wheel:'))) obligations.push('build-wheels')
  if (passed.has('sdist')) obligations.push('build-sdist')
  commands.add(`wheels: ${[...passed].filter((id) => id.startsWith('wheel:')).length}`)
  return {
    tests,
    coverage: { scope: units.map((t) => t.testId), covered: [...passed].sort() },
    obligations: obligations.sort(),
    commands: [...commands].sort(),
  }
}

export default extract
