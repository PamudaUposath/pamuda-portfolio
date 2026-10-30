import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertTriangle,
  CheckCircle2,
  Activity,
  Terminal,
  Cpu,
  RefreshCw,
  Server,
  X,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface CloudOpsGameProps {
  isOpen: boolean;
  onClose: () => void;
  onIncidentResolved: () => void;
  onIncidentStarted: () => void;
  isResolved: boolean;
}

type TabType = 'metrics' | 'logs' | 'architecture' | 'remediate';

export const CloudOpsGame: React.FC<CloudOpsGameProps> = ({
  isOpen,
  onClose,
  onIncidentResolved,
  onIncidentStarted,
  isResolved,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('metrics');
  const [remediationStep, setRemediationStep] = useState<'idle' | 'mitigating' | 'fixing' | 'complete'>('idle');
  const [mitigationApplied, setMitigationApplied] = useState(false);
  const [permanentFixApplied, setPermanentFixApplied] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Live fluctuating simulated metrics
  const [p99Latency, setP99Latency] = useState(4820);
  const [errorRate, setErrorRate] = useState(34.8);
  const [cpuUsage, setCpuUsage] = useState(94);
  const [memoryUsage, setMemoryUsage] = useState(98);

  useEffect(() => {
    if (!isOpen) return;

    if (!permanentFixApplied) {
      onIncidentStarted();
      const interval = setInterval(() => {
        setP99Latency((prev) => {
          if (mitigationApplied) {
            return Math.floor(410 + Math.random() * 40);
          }
          return Math.floor(4700 + Math.random() * 300);
        });
        setErrorRate((prev) => {
          if (mitigationApplied) {
            return Number((2.1 + Math.random() * 0.8).toFixed(1));
          }
          return Number((33.0 + Math.random() * 4).toFixed(1));
        });
      }, 1200);
      return () => clearInterval(interval);
    } else {
      setP99Latency(52);
      setErrorRate(0.0);
      setCpuUsage(24);
      setMemoryUsage(42);
    }
  }, [isOpen, mitigationApplied, permanentFixApplied]);

  if (!isOpen) return null;

  const handleAction = (type: 'reboot' | 'circuit_breaker' | 'pool_expansion') => {
    if (type === 'reboot') {
      setFeedbackMessage(
        '❌ FAILED: Full cluster reboot caused catastrophic 100% downtime for active users! The connection pool bottleneck immediately returned upon reboot. Try a structured SRE mitigation.'
      );
    } else if (type === 'circuit_breaker') {
      setMitigationApplied(true);
      setFeedbackMessage(
        '⚠️ TEMPORARY MITIGATION APPLIED: Circuit breaker enabled and rate-limiting shed non-essential traffic. p99 latency dropped to ~420ms, but the root cause (DB connection leak) is still unpatched!'
      );
      setActiveTab('remediate');
    } else if (type === 'pool_expansion') {
      if (!mitigationApplied) {
        setFeedbackMessage(
          '💡 TIP: In enterprise production, it is safest to first enable circuit breakers to stabilize live traffic before deploying code patches. Proceeding with permanent patch...'
        );
      }
      setPermanentFixApplied(true);
      setRemediationStep('complete');
      onIncidentResolved();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      setFeedbackMessage(
        '✅ PERMANENT RESOLUTION DEPLOYED: HikariCP connection pool expanded from 20 to 100 connections, and unclosed connection leak in order-service hot-patched. All health checks 100% green!'
      );
    }
  };

  const handleReset = () => {
    setMitigationApplied(false);
    setPermanentFixApplied(false);
    setRemediationStep('idle');
    setFeedbackMessage(null);
    setP99Latency(4820);
    setErrorRate(34.8);
    setCpuUsage(94);
    onIncidentStarted();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl glass-panel border border-slate-700/80 shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/60 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                permanentFixApplied
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/20 text-red-400 alert-pulse'
              }`}
            >
              {permanentFixApplied ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                CloudOps: Restore the System
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  SRE Simulator
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Simulated Microservice Outage • Interactive Cloud Engineering & Incident Response Simulation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Restart Simulation"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-700/60 bg-slate-950/60 px-6 gap-2">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2.5 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'metrics'
                ? 'border-sky-400 text-sky-400 bg-sky-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Telemetry Metrics
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2.5 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'logs'
                ? 'border-sky-400 text-sky-400 bg-sky-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Application Logs
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2.5 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'architecture'
                ? 'border-sky-400 text-sky-400 bg-sky-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            Service Map
          </button>
          <button
            onClick={() => setActiveTab('remediate')}
            className={`px-4 py-2.5 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'remediate'
                ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            SRE Remediation
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Status Alert Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              permanentFixApplied
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/40 border-red-500/40 text-red-200'
            }`}
          >
            {permanentFixApplied ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="text-sm">
              <span className="font-bold">
                {permanentFixApplied
                  ? 'PRODUCTION HEALTH RESTORED (99.99% Availability)'
                  : 'ACTIVE SRE INCIDENT: CRITICAL PERFORMANCE DEGRADATION'}
              </span>
              <p className="mt-1 text-xs opacity-90">
                {permanentFixApplied
                  ? 'All microservice response signals normalized. The sky has cleared back to golden daylight!'
                  : 'Automated alarm triggered: User checkout transactions are encountering cascading 504 timeouts.'}
              </p>
            </div>
          </div>

          {/* Feedback message from action */}
          {feedbackMessage && (
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-200">
              {feedbackMessage}
            </div>
          )}

          {/* Tab 1: Telemetry Metrics */}
          {activeTab === 'metrics' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="text-xs text-slate-400 font-mono">p99 Latency</div>
                <div
                  className={`text-2xl font-bold font-mono mt-1 ${
                    permanentFixApplied
                      ? 'text-emerald-400'
                      : mitigationApplied
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                >
                  {p99Latency} ms
                </div>
                <div className="text-xs text-slate-500 mt-1">SLA target: &lt;100ms</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="text-xs text-slate-400 font-mono">5xx Error Rate</div>
                <div
                  className={`text-2xl font-bold font-mono mt-1 ${
                    errorRate === 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {errorRate}%
                </div>
                <div className="text-xs text-slate-500 mt-1">SLA target: &lt;0.05%</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="text-xs text-slate-400 font-mono">CPU Saturation</div>
                <div className="text-2xl font-bold font-mono mt-1 text-slate-200">
                  {cpuUsage}%
                </div>
                <div className="text-xs text-slate-500 mt-1">3 Pod Replicas</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="text-xs text-slate-400 font-mono">Memory Allocation</div>
                <div className="text-2xl font-bold font-mono mt-1 text-slate-200">
                  {memoryUsage}%
                </div>
                <div className="text-xs text-slate-500 mt-1">Connection buffer leak</div>
              </div>
            </div>
          )}

          {/* Tab 2: Application Logs */}
          {activeTab === 'logs' && (
            <div className="p-4 rounded-xl bg-black/90 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 max-h-64 overflow-y-auto">
              <div className="text-slate-500">// Streaming structured JSON logs from order-service & API gateway</div>
              <div className="text-red-400">
                [14:02:11.842] WARN [order-service] HikariPool-1 - Connection is not available, request timed out after 30005ms (active=20, idle=0, waiting=142)
              </div>
              <div className="text-red-400">
                [14:02:12.104] ERROR [api-gateway] Upstream HTTP 504 Gateway Timeout on POST /api/v1/checkout/process (trace_id: 8f9b2a7c4e)
              </div>
              <div className="text-amber-400">
                [14:02:12.450] WARN [order-service] Thread starvation detected in worker pool: 80/80 threads in WAITING state on DB connection lock
              </div>
              <div className="text-slate-400">
                [14:02:13.001] INFO [auth-service] Token validation OK (latency: 18ms)
              </div>
              <div className="text-red-400">
                [14:02:13.782] ERROR [order-service] java.sql.SQLTransientConnectionException: HikariPool-1 - Connection pool exhausted
              </div>
            </div>
          )}

          {/* Tab 3: Service Architecture */}
          {activeTab === 'architecture' && (
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
              <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 w-full md:w-48">
                <div className="text-xs text-slate-400">Client Traffic</div>
                <div className="font-bold text-sm text-white mt-1">CloudFront CDN</div>
                <div className="text-xs text-emerald-400 mt-1">● Healthy</div>
              </div>
              <div className="text-slate-500 font-mono">──&gt;</div>
              <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 w-full md:w-48">
                <div className="text-xs text-slate-400">Gateway Layer</div>
                <div className="font-bold text-sm text-white mt-1">API Gateway</div>
                <div className="text-xs text-amber-400 mt-1">▲ 504 Timeouts</div>
              </div>
              <div className="text-slate-500 font-mono">──&gt;</div>
              <div
                className={`p-3 rounded-lg border w-full md:w-48 ${
                  permanentFixApplied
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-red-950/40 border-red-500'
                }`}
              >
                <div className="text-xs text-slate-400">Bottleneck Service</div>
                <div className="font-bold text-sm text-white mt-1">order-service</div>
                <div
                  className={`text-xs mt-1 ${
                    permanentFixApplied ? 'text-emerald-400' : 'text-red-400 font-bold'
                  }`}
                >
                  {permanentFixApplied ? '● Healthy' : '■ Thread Pool Exhausted'}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Remediation */}
          {activeTab === 'remediate' && (
            <div className="space-y-4">
              <div className="text-sm text-slate-300">
                Choose an appropriate Site Reliability Engineering strategy to diagnose and restore the system:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Option 1 */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">Action A: Cluster Reboot</h3>
                    <p className="text-xs text-slate-400 mt-2">
                      Force restart all Kubernetes worker nodes and pods to clear in-memory state.
                    </p>
                  </div>
                  <button
                    onClick={() => handleAction('reboot')}
                    disabled={permanentFixApplied}
                    className="mt-4 px-3 py-2 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition disabled:opacity-50"
                  >
                    Execute Reboot
                  </button>
                </div>

                {/* Option 2 */}
                <div
                  className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                    mitigationApplied
                      ? 'bg-amber-950/20 border-amber-500/50'
                      : 'bg-slate-900/70 border-slate-800 hover:border-amber-500/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm">Action B: Circuit Breaker</h3>
                      {mitigationApplied && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Trip Istio / Envoy circuit breaker to shed non-critical requests and prevent cascading downstream failure.
                    </p>
                  </div>
                  <button
                    onClick={() => handleAction('circuit_breaker')}
                    disabled={mitigationApplied || permanentFixApplied}
                    className="mt-4 px-3 py-2 text-xs font-bold rounded-lg bg-amber-600/80 hover:bg-amber-600 text-white transition disabled:opacity-50"
                  >
                    {mitigationApplied ? 'Mitigation Active' : 'Enable Circuit Breaker'}
                  </button>
                </div>

                {/* Option 3 */}
                <div
                  className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                    permanentFixApplied
                      ? 'bg-emerald-950/20 border-emerald-500/50'
                      : 'bg-slate-900/70 border-slate-800 hover:border-emerald-500/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm">Action C: Pool Hot-Patch</h3>
                      {permanentFixApplied && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Expand HikariCP pool limit from 20 to 100 connections and deploy bugfix closing unreturned connections.
                    </p>
                  </div>
                  <button
                    onClick={() => handleAction('pool_expansion')}
                    disabled={permanentFixApplied}
                    className="mt-4 px-3 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-50"
                  >
                    {permanentFixApplied ? 'Patch Verified' : 'Deploy Root Cause Fix'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SRE Engineering Takeaways (Unlocked upon permanent resolution) */}
          {permanentFixApplied && (
            <div className="p-5 rounded-xl bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/30 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                Technical Takeaways: Cloud Reliability & Incident Mitigation
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                In complex cloud environments, subtle telemetry shifts (such as thread waits and connection pool queueing) serve as early warning signals before users experience hard 5xx failures. Implementing automated circuit breakers, rate-limiting, and adaptive connection pooling prevents localized bottlenecks from escalating into cascading outages.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-700/60 bg-slate-900/80 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {permanentFixApplied
              ? 'Status: System operational. The 3D sky is clear.'
              : 'Status: Investigation in progress. Inspect metrics or logs.'}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
          >
            Return to Pamuda's World
          </button>
        </div>
      </div>
    </div>
  );
};
