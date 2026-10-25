import React, { useState, useRef } from 'react';
import {
  Upload,
  ScanSearch,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon,
  ShieldAlert,
  HelpCircle,
  Eye,
  Sliders,
  Layers,
  ArrowRight,
  ExternalLink,
  Info,
  Maximize2,
  FileText,
  AlertCircle,
  Leaf,
  WifiOff,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import Badge from '../components/common/Badge';
import ConfidenceBar from '../components/common/ConfidenceBar';
import StatusAlert from '../components/common/StatusAlert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useBackendStatus } from '../context/BackendStatusContext';
import { apiService } from '../services/api';

export const DiseaseDetection = () => {
  const { isOnline, apiUrl } = useBackendStatus();

  // State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  // Grad-CAM Explainability state
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationResult, setExplanationResult] = useState(null);
  const [explanationError, setExplanationError] = useState(null);
  const [explanationMode, setExplanationMode] = useState('overlay'); // 'overlay' | 'side-by-side' | 'heatmap'

  const fileInputRef = useRef(null);

  // Handle file selection & validation
  const processFile = (file) => {
    if (!file) return;

    // Reset previous states
    setAnalysisError(null);
    setPredictionResult(null);
    setExplanationResult(null);
    setExplanationError(null);

    // Validation: Image type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setAnalysisError('Please upload a valid image file (JPEG, PNG, or WEBP).');
      return;
    }

    // Validation: File size (15MB max)
    if (file.size > 15 * 1024 * 1024) {
      setAnalysisError('File size exceeds 15MB limit. Please compress the image.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Get image dimensions
    const img = new Image();
    img.onload = () => {
      setFileDetails({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        dimensions: `${img.width} × ${img.height} px`,
        type: file.type,
      });
    };
    img.src = objectUrl;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Trigger POST /predict
  const runDiagnosis = async (fileToUse = selectedFile) => {
    if (!fileToUse) {
      setAnalysisError('Please select or upload a leaf photo first.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setPredictionResult(null);
    setExplanationResult(null);

    try {
      const data = await apiService.predictDisease(fileToUse);
      setPredictionResult(data);
    } catch (err) {
      let msg = err.response?.data?.detail || err.message || 'Diagnosis failed';
      if (!isOnline && err.code === 'ERR_NETWORK') {
        msg = `Cannot connect to FastAPI backend at ${apiUrl}. Please make sure the backend is running with "python -m uvicorn backend.main:app --port 8000".`;
      }
      setAnalysisError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger POST /explain for Grad-CAM
  const runGradCamExplain = async () => {
    if (!selectedFile) return;

    setIsExplaining(true);
    setExplanationError(null);

    try {
      const data = await apiService.explainPrediction(selectedFile);
      setExplanationResult(data);
    } catch (err) {
      let msg = err.response?.data?.detail || err.message || 'Grad-CAM calculation failed';
      if (!isOnline && err.code === 'ERR_NETWORK') {
        msg = `FastAPI backend at ${apiUrl} is not reachable. Start the backend to generate live heatmaps.`;
      }
      setExplanationError(msg);
    } finally {
      setIsExplaining(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileDetails(null);
    setPredictionResult(null);
    setAnalysisError(null);
    setExplanationResult(null);
    setExplanationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Mission */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ScanSearch className="w-6 h-6 text-forest-800" />
            <span>Crop Disease Diagnosis Engine</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload high-resolution foliar imagery to detect 38 plant pathogens with MobileNetV3 neural attention
          </p>
        </div>

        {selectedFile && (
          <button
            onClick={handleReset}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors self-start"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Upload Another Leaf</span>
          </button>
        )}
      </div>

      {/* Main Diagnostic Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload Zone & Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="overflow-hidden">
            <CardHeader
              title={previewUrl ? "Selected Leaf Image" : "Upload Leaf Image"}
              subtitle={previewUrl ? fileDetails?.dimensions : "JPEG, PNG, or WEBP up to 15MB"}
              icon={ImageIcon}
            />
            <CardBody>
              {/* Drop Zone or Preview */}
              {!previewUrl ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[300px] ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50/70 scale-[0.99]'
                      : 'border-slate-200 hover:border-emerald-500/70 hover:bg-emerald-50/20 bg-slate-50/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        processFile(e.target.files[0]);
                      }
                    }}
                  />

                  <div className="w-16 h-16 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 mb-4 shadow-sm">
                    <Upload className="w-8 h-8" />
                  </div>

                  <h4 className="text-sm font-bold text-slate-800">
                    Drag and drop leaf photo here
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    or <span className="text-emerald-700 font-semibold underline underline-offset-2">browse files</span> from your computer or phone camera
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span>JPEG</span> • <span>PNG</span> • <span>WEBP</span> • <span>Max 15MB</span>
                  </div>
                </div>
              ) : (
                /* Leaf Preview with Animated Scanner Line when analyzing */
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group">
                  <img
                    src={previewUrl}
                    alt="Uploaded leaf for disease diagnosis"
                    className="w-full h-72 sm:h-80 object-contain mx-auto"
                  />

                  {/* Laser Scanning Animation Overlay during analysis */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent laser-scanner shadow-glow-emerald" />
                      <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px]" />
                    </div>
                  )}

                  {/* Image specs badge */}
                  {fileDetails && (
                    <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] flex items-center justify-between font-mono">
                      <span className="truncate max-w-[180px]">{fileDetails.name}</span>
                      <span>{fileDetails.dimensions}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Analysis Action Buttons */}
              {previewUrl && (
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => runDiagnosis()}
                    disabled={isAnalyzing}
                    type="button"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#166534] hover:bg-[#14532d] disabled:opacity-60 text-white font-bold text-xs shadow-md shadow-forest-950/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                        <span>Analyzing Leaf Features...</span>
                      </>
                    ) : (
                      <>
                        <ScanSearch className="w-4 h-4 text-emerald-300" />
                        <span>Run Disease Diagnosis</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleReset}
                    type="button"
                    className="p-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Clear current image"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Error Alert */}
              {analysisError && (
                <div className="mt-4">
                  <StatusAlert
                    type="danger"
                    title="Diagnostic Engine Error"
                    message={analysisError}
                    onRetry={() => runDiagnosis()}
                  />
                </div>
              )}
            </CardBody>
          </Card>

          {/* Image Guidelines & Search Reference */}
          <Card>
            <CardHeader
              title="Image Guidelines for Accurate Detection"
              subtitle="Tips for web searching and uploading leaves for best results"
              icon={Info}
            />
            <CardBody className="pt-2 space-y-3.5 text-xs text-slate-600">
              <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-xl p-3 text-forest-900 leading-relaxed">
                <span className="font-semibold text-forest-800">For 95%+ Accuracy:</span> The neural model was trained on clear, close-up foliar shots. When searching images online, pick photos where a <strong>single leaf fills 70%+ of the frame</strong> with clearly visible lesions.
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Recommended Web Search Queries:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { label: "Tomato Late Blight", query: "tomato late blight leaf" },
                    { label: "Corn Common Rust", query: "corn common rust leaf" },
                    { label: "Potato Early Blight", query: "potato early blight leaf" },
                    { label: "Apple Scab", query: "apple scab leaf close up" },
                    { label: "Apple Cedar Rust", query: "cedar apple rust leaf" },
                    { label: "Pepper Bacterial Spot", query: "bell pepper bacterial spot leaf" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 hover:border-emerald-300 transition-colors"
                    >
                      <div className="font-semibold text-slate-800 text-[11px]">{item.label}</div>
                      <div className="text-[10px] text-emerald-700 font-mono mt-0.5 truncate">
                        "{item.query}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Avoid: blurry photos, whole tree canopies, or fruits</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Prediction Results & Grad-CAM (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Empty State before prediction */}
          {!predictionResult && !isAnalyzing && (
            <Card className="h-full min-h-[460px] flex flex-col justify-center items-center text-center p-8 border-dashed">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-forest-700 mb-4">
                <ScanSearch className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Leaf Scanned Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
                Upload a plant leaf photo on the left or select one of the built-in leaf samples to run deep learning classification and generate Grad-CAM explainability heatmaps.
              </p>
              <div className="mt-6 flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 38 Disease Classes
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Saliency Heatmaps
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" /> Verified Treatments
                </span>
              </div>
            </Card>
          )}

          {/* Loading State during analysis */}
          {isAnalyzing && (
            <Card className="min-h-[460px] flex flex-col justify-center items-center p-8">
              <LoadingSpinner
                size="lg"
                text="Extracting leaf convolutional features & running inference..."
              />
              <p className="text-[11px] text-slate-400 max-w-xs text-center mt-2">
                Evaluating against MobileNetV3 inverted residual blocks with hard-swish activation.
              </p>
            </Card>
          )}

          {/* Diagnosis Result View */}
          {predictionResult && !isAnalyzing && (
            <div className="space-y-5">
              {/* STATE 1: REJECT NON-LEAF PHOTOS */}
              {(!predictionResult.is_leaf || predictionResult.status === 'not_a_leaf') ? (
                <Card className="overflow-hidden border-2 border-rose-300 bg-white shadow-card">
                  <div className="p-6 bg-gradient-to-br from-rose-50/80 via-white to-amber-50/30">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0 shadow-xs">
                        <AlertTriangle className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200 uppercase tracking-wide">
                            Incorrect Image
                          </span>
                          {predictionResult.inference_time_ms && (
                            <span className="text-[11px] font-mono text-slate-400">
                              {predictionResult.inference_time_ms} ms
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Plant Leaf Not Detected
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                          {predictionResult.message || "The uploaded image does not appear to contain a plant leaf. KrishiVision AI requires a clear photograph of a crop leaf (such as Tomato, Potato, Corn, Apple, or Pepper)."}
                        </p>

                        <div className="mt-4 p-3.5 rounded-xl bg-white border border-rose-200/80 shadow-xs space-y-2">
                          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-rose-600" />
                            <span>Requirements for accurate disease diagnosis:</span>
                          </h4>
                          <ul className="text-xs text-slate-600 space-y-1.5 pl-4 list-disc">
                            <li>Upload a clear photo of a <strong>single plant leaf</strong> (Tomato, Potato, Corn, Apple, or Pepper).</li>
                            <li>Ensure the leaf occupies at least <strong>70% of the frame</strong> in focus.</li>
                            <li>Avoid photos of classrooms, people, indoor rooms, cars, documents, or fruit.</li>
                          </ul>
                        </div>

                        <div className="mt-5 flex items-center gap-3">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            type="button"
                            className="px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Upload className="w-4 h-4 text-emerald-300" />
                            <span>Upload a Plant Leaf Photo</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : predictionResult.status === 'not_sure' ? (
                /* STATE 2: LEAF DETECTED BUT UNCERTAIN / NOT IN DATASET */
                <Card className="overflow-hidden border-2 border-amber-300 bg-white shadow-card">
                  <div className="p-6 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/30">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 uppercase tracking-wide">
                            Not Sure / Out of Dataset
                          </span>
                          {predictionResult.inference_time_ms && (
                            <span className="text-[11px] font-mono text-slate-400">
                              {predictionResult.inference_time_ms} ms
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Not Sure — Unverified Leaf or Disease
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                          {predictionResult.message || "A plant leaf was detected, but its symptoms or species do not match any of the 23 verified disease classes in our dataset with high certainty."}
                        </p>
                      </div>

                      {/* Low Confidence Meter */}
                      <div className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-card text-center min-w-[120px] shrink-0">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Confidence
                        </span>
                        <span className="text-2xl font-black font-mono text-amber-700 block mt-0.5">
                          {predictionResult.confidence_percentage}%
                        </span>
                        <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">
                          Below Threshold
                        </span>
                      </div>
                    </div>

                    {/* Advisory Banner */}
                    <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Agronomic Advisory:</span> Chemical treatment is <strong>not recommended</strong> without verified diagnosis. The leaf may belong to an unverified crop species (e.g. Mango, Rice, Cotton) or display abiotic physiological damage (sunscald/drought).
                      </div>
                    </div>

                    {/* Nearest Mathematical Candidates */}
                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                        Tentative Nearest Matches (Unverified Softmax Distribution)
                      </h4>
                      <div className="space-y-2.5">
                        {predictionResult.top_predictions?.map((pred, idx) => (
                          <div key={idx}>
                            <ConfidenceBar
                              score={pred.confidence}
                              label={`${idx + 1}. ${pred.crop} - ${pred.condition}`}
                              size="md"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                /* STATE 3: FULL VERIFIED DISEASE DIAGNOSIS */
                <Card className="overflow-hidden border-2 border-emerald-500/40">
                  <div className="p-6 bg-gradient-to-br from-emerald-50/50 via-white to-forest-50/30">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={predictionResult.severity === 'None' ? 'healthy' : 'danger'}
                            size="lg"
                          >
                            {predictionResult.severity === 'None' ? 'Healthy Crop' : `${predictionResult.severity} Severity`}
                          </Badge>
                          <Badge variant={predictionResult.pathogen_type || 'default'} size="lg">
                            {predictionResult.pathogen_type}
                          </Badge>
                          {predictionResult.inference_time_ms && (
                            <span className="text-[11px] font-mono text-slate-400 ml-1">
                              {predictionResult.inference_time_ms} ms
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          {predictionResult.crop} — {predictionResult.condition}
                        </h3>

                        {predictionResult.scientific_name && (
                          <p className="text-xs sm:text-sm text-slate-600 italic font-serif mt-0.5">
                            {predictionResult.scientific_name}
                          </p>
                        )}
                      </div>

                      {/* Confidence Meter Badge */}
                      <div className="p-3.5 rounded-2xl bg-white border border-emerald-200/80 shadow-card text-center min-w-[120px] shrink-0">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Confidence
                        </span>
                        <span className="text-2xl font-black font-mono text-forest-800 block mt-0.5">
                          {predictionResult.confidence_percentage}%
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                          {predictionResult.confidence > 0.85 ? 'High Certainty' : 'Verified'}
                        </span>
                      </div>
                    </div>

                    {/* Top-3 Candidates Bar */}
                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                        Top-3 Predictions (Softmax Probabilities)
                      </h4>
                      <div className="space-y-2.5">
                        {predictionResult.top_predictions?.map((pred, idx) => (
                          <div key={idx}>
                            <ConfidenceBar
                              score={pred.confidence}
                              label={`${idx + 1}. ${pred.crop} - ${pred.condition}`}
                              size="md"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Only display Grad-CAM and treatment recommendations if image is a genuine leaf */}
              {predictionResult.is_leaf && predictionResult.status !== 'not_a_leaf' && (
                <>
                  {/* Grad-CAM Explainability Section */}
                  <Card>
                <CardHeader
                  title="Grad-CAM Visual Attention Explainability"
                  subtitle="Gradient-weighted Class Activation Mapping confirms model attended to true pathology"
                  icon={Sparkles}
                  action={
                    !explanationResult && (
                      <button
                        onClick={runGradCamExplain}
                        disabled={isExplaining}
                        type="button"
                        className="px-3.5 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-60"
                      >
                        {isExplaining ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-300" />
                            <span>Computing Heatmap...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Generate Grad-CAM</span>
                          </>
                        )}
                      </button>
                    )
                  }
                />
                <CardBody>
                  {/* Grad-CAM hasn't been requested yet */}
                  {!explanationResult && !isExplaining && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                      <div className="flex items-center gap-2.5">
                        <Info className="w-4 h-4 text-forest-700 shrink-0" />
                        <span>
                          Inspect why the AI made this diagnosis. Grad-CAM visualizes the feature activation maps on the final convolution layer.
                        </span>
                      </div>
                      <button
                        onClick={runGradCamExplain}
                        type="button"
                        className="shrink-0 font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                      >
                        Run Visual Saliency
                      </button>
                    </div>
                  )}

                  {/* Loading Grad-CAM */}
                  {isExplaining && (
                    <div className="py-8">
                      <LoadingSpinner
                        size="md"
                        text="Calculating gradients on feature layer 16..."
                      />
                    </div>
                  )}

                  {/* Explanation Error */}
                  {explanationError && (
                    <StatusAlert
                      type="danger"
                      title="Explainability Error"
                      message={explanationError}
                      onRetry={runGradCamExplain}
                    />
                  )}

                  {/* Grad-CAM Visualization Result */}
                  {explanationResult && (
                    <div className="space-y-4">
                      {/* Mode Switcher */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                          <button
                            onClick={() => setExplanationMode('overlay')}
                            type="button"
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              explanationMode === 'overlay'
                                ? 'bg-white text-forest-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Thermal Overlay
                          </button>
                          <button
                            onClick={() => setExplanationMode('side-by-side')}
                            type="button"
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              explanationMode === 'side-by-side'
                                ? 'bg-white text-forest-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Side-by-Side
                          </button>
                          <button
                            onClick={() => setExplanationMode('heatmap')}
                            type="button"
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              explanationMode === 'heatmap'
                                ? 'bg-white text-forest-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            JET Heatmap
                          </button>
                        </div>

                        <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {explanationResult.attention_coverage_percentage}% Lesion Coverage
                        </span>
                      </div>

                      {/* Visual Display */}
                      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black flex items-center justify-center">
                        {explanationMode === 'overlay' && (
                          <div className="relative w-full">
                            <img
                              src={explanationResult.overlay_data_url}
                              alt="Grad-CAM thermal overlay on crop leaf"
                              className="w-full max-h-96 object-contain mx-auto"
                            />
                            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-1 rounded-lg">
                              55% Leaf + 45% JET Heatmap
                            </div>
                          </div>
                        )}

                        {explanationMode === 'heatmap' && (
                          <div className="relative w-full">
                            <img
                              src={explanationResult.heatmap_data_url}
                              alt="Grad-CAM activation heatmap"
                              className="w-full max-h-96 object-contain mx-auto"
                            />
                            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-1 rounded-lg">
                              JET Color Scale (Red = High Attention)
                            </div>
                          </div>
                        )}

                        {explanationMode === 'side-by-side' && (
                          <div className="grid grid-cols-2 gap-2 p-2 w-full">
                            <div className="text-center">
                              <span className="text-[10px] font-semibold text-slate-300 block mb-1">
                                Original Foliage
                              </span>
                              <img
                                src={previewUrl}
                                alt="Original Leaf"
                                className="w-full h-48 object-contain rounded-xl bg-slate-900"
                              />
                            </div>
                            <div className="text-center">
                              <span className="text-[10px] font-semibold text-slate-300 block mb-1">
                                Grad-CAM Saliency
                              </span>
                              <img
                                src={explanationResult.overlay_data_url}
                                alt="Grad-CAM Saliency"
                                className="w-full h-48 object-contain rounded-xl bg-slate-900"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Interpretability Note */}
                      <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-slate-700 leading-relaxed">
                        <div className="flex items-center gap-2 font-bold text-forest-900 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Pathological Interpretation</span>
                        </div>
                        <p>{explanationResult.interpretability_note}</p>
                        {explanationResult.focused_regions && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {explanationResult.focused_regions.map((reg, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-white text-forest-800 text-[10px] font-medium border border-emerald-200"
                              >
                                • {reg}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Comprehensive Treatment & Prevention Protocols Dossier */}
              {predictionResult.disease_info && (
                <Card>
                  <CardHeader
                    title="Verified Agronomic Recommendations"
                    subtitle="Scientifically backed cultural, organic, and chemical control protocols"
                    icon={FileText}
                  />
                  <CardBody className="space-y-4">
                    {/* Symptoms */}
                    {predictionResult.disease_info.symptoms && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-forest-700" />
                          <span>Key Field Symptoms</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {predictionResult.disease_info.symptoms.map((sym, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>{sym}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Immediate Treatment */}
                    {predictionResult.disease_info.treatment && (
                      <div className="pt-3 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-amber-900">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          <span>Immediate Treatment & Control</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {predictionResult.disease_info.treatment.map((trt, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-amber-500 font-bold">✓</span>
                              <span>{trt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Prevention & Cultural Management */}
                    {predictionResult.disease_info.prevention && (
                      <div className="pt-3 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-forest-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Prevention & Cultural Practices</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {predictionResult.disease_info.prevention.map((prv, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-500 font-bold">✓</span>
                              <span>{prv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardBody>
                </Card>
              )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
