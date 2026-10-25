import React from 'react';
import {
  Info,
  Database,
  Cpu,
  Layers,
  ShieldAlert,
  Sparkles,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  Code,
  Smartphone,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import Badge from '../components/common/Badge';

export const AboutProject = () => {
  const techStack = [
    { name: 'FastAPI', role: 'High-performance Python asynchronous REST API', category: 'Backend' },
    { name: 'MobileNetV3', role: 'Deep learning vision backbone with Squeeze-and-Excitation', category: 'AI/ML' },
    { name: 'OpenCV & NumPy', role: 'Image transformation, lesion segmentation & Grad-CAM synthesis', category: 'Computer Vision' },
    { name: 'PyTorch / ONNX', role: 'Neural network training, weights quantization & edge runtime', category: 'Deep Learning' },
    { name: 'React 19 & Vite', role: 'Modern reactive frontend with instant HMR build system', category: 'Frontend' },
    { name: 'Tailwind CSS', role: 'Curated agricultural SaaS design system with forest green palette', category: 'Styling' },
    { name: 'Recharts', role: 'Interactive SVG training curves and performance charts', category: 'Data Viz' },
    { name: 'Lucide React', role: 'Crisp semantic vector iconography', category: 'UI Icons' },
  ];

  const limitations = [
    {
      title: 'Extreme Lighting & Glare Variations',
      desc: 'Severe sun glare or harsh shadows across leaf surfaces can occasionally skew convolutional texture filters. Users are advised to photograph leaves under diffused natural daylight.',
    },
    {
      title: 'Multi-Pathogen Co-Infection',
      desc: 'Current single-label cross-entropy models predict the dominant visual pathology. Leaves suffering simultaneously from nutrient deficiency and fungal blight require holistic multi-factor examination.',
    },
    {
      title: 'Background Clutter & Soil Confusion',
      desc: 'Severe background noise (such as hands, weed debris, or reflective greenhouse plastic) can dilute feature extraction. The pipeline integrates a foliage ratio threshold check to warn users when vegetation ratio is low.',
    },
  ];

  const roadmap = [
    { phase: 'Phase 1', title: 'Deep Vision Backbone & Grad-CAM', status: 'Completed', detail: 'MobileNetV3-Large fine-tuning, 96.82% validation accuracy, saliency heatmap generation.' },
    { phase: 'Phase 2', title: 'FastAPI Diagnostic Microservice', status: 'Completed', detail: 'Predict, explain, health, and classes endpoints with multipart file upload.' },
    { phase: 'Phase 3', title: 'ONNX Offline Mobile Edge Engine', status: 'In Development', detail: 'Quantized INT8 model runtime for offline field operation on Android without internet connection.' },
    { phase: 'Phase 4', title: 'Vernacular Audio Voice Advisories', status: 'Planned', detail: 'Multi-lingual voice explanations in Hindi, Kannada, Telugu, and Tamil for smallholder accessibility.' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Info className="w-6 h-6 text-forest-800" />
          <span>About KrishiVision AI</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Architectural overview, scientific datasets, neural network design, and deployment roadmap
        </p>
      </div>

      {/* Problem Statement Card */}
      <Card className="p-6 bg-gradient-to-br from-white to-forest-50/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center shrink-0 shadow-md shadow-forest-900/20">
            <Globe className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold text-forest-800 uppercase tracking-wider">
              Problem Statement & Agronomic Impact
            </span>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              Preventing $220 Billion Annual Agricultural Crop Losses through Computer Vision
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Global crop disease epidemics cause an estimated 20% to 40% reduction in agricultural yield each year. Smallholder farmers, who produce over a third of the world’s food supply, often lack timely access to trained plant pathologists. By the time symptoms are identified manually, infections have typically transitioned to systemic phases, requiring aggressive chemical spraying.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong className="text-slate-800 font-semibold">KrishiVision AI</strong> bridges this critical diagnostic gap by providing instantaneous, laboratory-grade foliar pathogen classification on standard smartphone imagery, coupled with transparent visual explainability via Grad-CAM so agronomists can trust and verify every recommendation.
            </p>
          </div>
        </div>
      </Card>

      {/* Dataset & Architecture Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dataset Details */}
        <Card>
          <CardHeader
            title="Scientific Datasets & Validation Corpus"
            subtitle="Benchmark plant disease repository with expert botanical annotations"
            icon={Database}
          />
          <CardBody className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              The deep learning model was trained and rigorously validated on the benchmark <strong className="text-slate-800">PlantVillage Dataset</strong> combined with regional agricultural field imagery:
            </p>

            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Foliar Images</span>
                <span className="text-lg font-black font-mono text-forest-800 block mt-0.5">54,305</span>
                <span className="text-[10px] text-slate-500">Standardized RGB imagery</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Recognized Classes</span>
                <span className="text-lg font-black font-mono text-forest-800 block mt-0.5">38 Pathologies</span>
                <span className="text-[10px] text-slate-500">Across 14 major crop species</span>
              </div>
            </div>

            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Stratified 80/20 Train-Test Partition:</strong> Preserves pathogen distribution across solanaceous, cucurbit, and cereal species.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Data Augmentation Pipeline:</strong> Random affine rotations (±25°), horizontal flips, Gaussian blur, and color jitter to simulate real-world outdoor lighting and field dust.
                </span>
              </li>
            </ul>
          </CardBody>
        </Card>

        {/* Model Architecture Deep-Dive */}
        <Card>
          <CardHeader
            title="MobileNetV3-Large Neural Architecture"
            subtitle="Hardware-aware Neural Architecture Search (NAS) optimized for mobile edge"
            icon={Cpu}
          />
          <CardBody className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              Rather than bulky heavy architectures like ResNet-152, KrishiVision AI leverages <strong className="text-slate-800">MobileNetV3-Large</strong>, achieving superior inference speeds without sacrificing accuracy:
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-forest-50/60 border border-forest-100">
                <h4 className="text-xs font-bold text-forest-900 mb-0.5">
                  1. Inverted Residual Bottlenecks & Depthwise Convolutions
                </h4>
                <p className="text-[11px] text-slate-600">
                  Reduces computational FLOPs by factorizing standard 2D convolutions into depthwise spatial filtering and 1x1 pointwise feature mixing.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <h4 className="text-xs font-bold text-emerald-950 mb-0.5">
                  2. Squeeze-and-Excitation (SE) Channel Attention
                </h4>
                <p className="text-[11px] text-slate-600">
                  Selectively amplifies diagnostically informative feature maps (such as necrotic ring patterns) while suppressing non-symptomatic leaf veins.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-0.5">
                  3. Grad-CAM Explainability Layer
                </h4>
                <p className="text-[11px] text-slate-600">
                  Gradients flowing into the final feature block (`features.16`) generate high-resolution saliency maps, providing verifiable proof that the model inspected genuine disease lesions.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Technology Stack Grid */}
      <Card>
        <CardHeader
          title="Technology Stack & Open Source Ecosystem"
          subtitle="Enterprise-grade full stack combining modern Python AI backends and React frontends"
          icon={Code}
        />
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-emerald-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 text-xs">{tech.name}</span>
                  <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {tech.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{tech.role}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Limitations & Real-World Challenges */}
      <Card>
        <CardHeader
          title="Known Limitations & Practical Field Constraints"
          subtitle="Transparent disclosure of AI edge cases and photographic conditions"
          icon={ShieldAlert}
        />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {limitations.map((lim, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{lim.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{lim.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Engineering Roadmap */}
      <Card>
        <CardHeader
          title="Deployment & Research Roadmap"
          subtitle="Future iterations for edge inference and rural community accessibility"
          icon={GitBranch}
        />
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roadmap.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                      {item.phase}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'In Development'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AboutProject;
