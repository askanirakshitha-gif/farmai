import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Zap,
  HardDrive,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  Database,
  Activity,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import Badge from '../components/common/Badge';
import { useBackendStatus } from '../context/BackendStatusContext';
import { apiService } from '../services/api';
import { MODEL_METRICS_DATA } from '../data/cropKnowledgeBase';

export const ModelPerformance = () => {
  const { isOnline } = useBackendStatus();
  const [metrics, setMetrics] = useState(MODEL_METRICS_DATA);
  const [activeTab, setActiveTab] = useState('training'); // 'training' | 'loss'
  const [hoveredCell, setHoveredCell] = useState(null);

  // Fetch actual metrics from backend if available
  useEffect(() => {
    let isMounted = true;
    if (isOnline) {
      apiService.getModelMetrics()
        .then((data) => {
          if (isMounted && data) {
            setMetrics((prev) => ({
              ...prev,
              testAccuracy: data.test_accuracy ? +(data.test_accuracy * 100).toFixed(2) : prev.testAccuracy,
              macroF1: data.macro_f1 ? +(data.macro_f1 * 100).toFixed(2) : prev.macroF1,
              macroPrecision: data.macro_precision ? +(data.macro_precision * 100).toFixed(2) : prev.macroPrecision,
              macroRecall: data.macro_recall ? +(data.macro_recall * 100).toFixed(2) : prev.macroRecall,
            }));
          }
        })
        .catch(() => {});
    }
    return () => { isMounted = false; };
  }, [isOnline]);

  const confusion = metrics.confusionMatrix || MODEL_METRICS_DATA.confusionMatrix;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-forest-800" />
            <span>Deep Learning Model Evaluation & Benchmarks</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Empirical test set performance across 38 classes with MobileNetV3-Large vs Custom CNN baseline
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>MobileNetV3 Final Checkpoint</span>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Test Accuracy
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-black font-mono text-slate-900">
            {metrics.testAccuracy}%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Target threshold: &gt; 95%
          </span>
        </Card>

        <Card className="p-5 border-l-4 border-l-forest-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Macro F1-Score
            </span>
            <div className="w-8 h-8 rounded-lg bg-forest-50 text-forest-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-black font-mono text-slate-900">
            {metrics.macroF1}%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Harmonic mean of precision & recall
          </span>
        </Card>

        <Card className="p-5 border-l-4 border-l-sky-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Macro Precision
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-black font-mono text-slate-900">
            {metrics.macroPrecision}%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Low false-positive rate across pathogens
          </span>
        </Card>

        <Card className="p-5 border-l-4 border-l-teal-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Macro Recall
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-black font-mono text-slate-900">
            {metrics.macroRecall}%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            High disease detection sensitivity
          </span>
        </Card>
      </div>

      {/* Model Comparison Table */}
      <Card>
        <CardHeader
          title="Comparative Architecture Benchmarks"
          subtitle="MobileNetV3-Large vs Custom 5-Layer CNN Baseline vs ResNet-50"
          icon={Cpu}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-5">Model Architecture</th>
                <th className="py-3 px-4">Test Accuracy</th>
                <th className="py-3 px-4">Macro F1</th>
                <th className="py-3 px-4">Parameters</th>
                <th className="py-3 px-4">Model Size</th>
                <th className="py-3 px-4">Latency (CPU)</th>
                <th className="py-3 px-4">Edge Viability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.modelsComparison.map((m, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50/60 transition-colors ${
                    m.isProposed ? 'bg-emerald-50/40 font-semibold' : ''
                  }`}
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{m.name}</span>
                      {m.isProposed && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                          Proposed
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                      {m.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-900 font-bold">
                    {m.accuracy}%
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {m.f1Score}%
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {m.paramsM}M
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {m.sizeMb} MB
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {m.latencyMs} ms
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        m.edgeReady.startsWith('Yes')
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.edgeReady.startsWith('Partial')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {m.edgeReady}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Interactive Training & Validation Curves (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Curve */}
        <Card>
          <CardHeader
            title="Model Accuracy vs Epochs (1 - 30)"
            subtitle="Training vs Validation Accuracy convergence on 54,305 leaf dataset"
            icon={TrendingUp}
          />
          <CardBody>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={metrics.trainingHistory}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="epoch"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={(val) => `Ep ${val}`}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    domain={[65, 100]}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                    formatter={(val) => [`${val}%`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="trainAcc"
                    name="Training Accuracy"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="valAcc"
                    name="Validation Accuracy"
                    stroke="#166534"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Cross-Entropy Loss Curve */}
        <Card>
          <CardHeader
            title="Categorical Cross-Entropy Loss"
            subtitle="Loss reduction across 30 training epochs with AdamW (lr=1e-4)"
            icon={Activity}
          />
          <CardBody>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={metrics.trainingHistory}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="epoch"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={(val) => `Ep ${val}`}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    domain={[0, 1.2]}
                    tickFormatter={(val) => val.toFixed(2)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="trainLoss"
                    name="Training Loss"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="valLoss"
                    name="Validation Loss"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Confusion Matrix Interactive Inspection */}
      <Card>
        <CardHeader
          title="Empirical Confusion Matrix (Test Split Subset)"
          subtitle="True crop pathology vs neural network classification predictions"
          icon={Layers}
        />
        <CardBody>
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* Matrix Table */}
            <div className="overflow-x-auto w-full lg:w-2/3">
              <table className="text-center text-xs border-collapse mx-auto">
                <thead>
                  <tr>
                    <th className="p-2 text-[10px] text-slate-400 italic">Actual \ Predicted</th>
                    {confusion.labels.map((label, idx) => (
                      <th
                        key={idx}
                        className="p-2 text-[10px] font-bold text-slate-700 max-w-[80px] truncate"
                        title={label}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {confusion.values.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className="p-2 text-[11px] font-bold text-slate-700 text-right pr-3 whitespace-nowrap">
                        {confusion.labels[rIdx]}
                      </td>
                      {row.map((val, cIdx) => {
                        const isDiagonal = rIdx === cIdx;
                        const cellColor = isDiagonal
                          ? val > 280
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-emerald-500 text-white font-bold'
                          : val > 5
                          ? 'bg-rose-100 text-rose-900 font-semibold'
                          : val > 0
                          ? 'bg-amber-50 text-amber-900'
                          : 'bg-slate-50 text-slate-300';

                        return (
                          <td
                            key={cIdx}
                            onMouseEnter={() =>
                              setHoveredCell({
                                actual: confusion.labels[rIdx],
                                predicted: confusion.labels[cIdx],
                                count: val,
                                isDiagonal,
                              })
                            }
                            onMouseLeave={() => setHoveredCell(null)}
                            className={`p-3 text-xs font-mono border border-white cursor-pointer transition-transform hover:scale-110 shadow-sm ${cellColor}`}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cell Inspection Card */}
            <div className="w-full lg:w-1/3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Confusion Cell Inspector
              </h4>
              {hoveredCell ? (
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                      Ground Truth Class
                    </span>
                    <span className="font-bold text-slate-800">{hoveredCell.actual}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                      Model Predicted Class
                    </span>
                    <span className="font-bold text-slate-800">{hoveredCell.predicted}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                      Sample Count
                    </span>
                    <span className="font-bold font-mono text-base text-forest-800">
                      {hoveredCell.count} leaf images
                    </span>
                    <span
                      className={`text-[10px] block font-semibold mt-0.5 ${
                        hoveredCell.isDiagonal ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {hoveredCell.isDiagonal ? '✓ Correct Diagnosis (True Positive)' : '⚠ Misclassification'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 leading-relaxed">
                  Hover over any cell in the confusion matrix to inspect specific true positives and misclassification counts.
                </p>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ModelPerformance;
