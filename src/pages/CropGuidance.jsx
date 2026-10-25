import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Droplets,
  ExternalLink,
  ChevronRight,
  Sprout,
  X,
  Printer,
  Share2,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import Badge from '../components/common/Badge';
import { CROP_CLASSES } from '../data/cropKnowledgeBase';

export const CropGuidance = () => {
  const [searchParams] = useSearchParams();
  const initialCropFilter = searchParams.get('crop') || 'All';

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(initialCropFilter);
  const [selectedPathogen, setSelectedPathogen] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');

  // Selected disease for detailed modal
  const [activeDiseaseModal, setActiveDiseaseModal] = useState(null);

  // Unique lists for filter dropdowns
  const cropsList = useMemo(() => {
    const list = Array.from(new Set(CROP_CLASSES.map((c) => c.crop)));
    return ['All', ...list.sort()];
  }, []);

  const pathogensList = ['All', 'Fungal', 'Bacterial', 'Viral', 'Oomycete', 'Healthy'];
  const severitiesList = ['All', 'Critical', 'High', 'Moderate', 'None'];

  // Filtering logic
  const filteredDiseases = useMemo(() => {
    return CROP_CLASSES.filter((item) => {
      const matchSearch =
        item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.symptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCrop = selectedCrop === 'All' || item.crop === selectedCrop;
      const matchPathogen = selectedPathogen === 'All' || item.pathogenType.toLowerCase() === selectedPathogen.toLowerCase();
      const matchSeverity = selectedSeverity === 'All' || item.severity.toLowerCase() === selectedSeverity.toLowerCase();

      return matchSearch && matchCrop && matchPathogen && matchSeverity;
    });
  }, [searchQuery, selectedCrop, selectedPathogen, selectedSeverity]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-forest-800" />
            <span>Crop Health & Agronomic Guidance</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verified agricultural management protocols, symptoms, and organic/chemical remedies across 38 crop disease classes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Field Sheet</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardBody className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symptom, pathogen..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Crop Selector */}
            <div>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800"
              >
                {cropsList.map((crop) => (
                  <option key={crop} value={crop}>
                    Crop: {crop}
                  </option>
                ))}
              </select>
            </div>

            {/* Pathogen Selector */}
            <div>
              <select
                value={selectedPathogen}
                onChange={(e) => setSelectedPathogen(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800"
              >
                {pathogensList.map((path) => (
                  <option key={path} value={path}>
                    Pathogen: {path}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity Selector */}
            <div>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800"
              >
                {severitiesList.map((sev) => (
                  <option key={sev} value={sev}>
                    Severity: {sev}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Active Filters tags */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-800">{filteredDiseases.length}</strong> matching crop conditions
            </span>
            {(selectedCrop !== 'All' || selectedPathogen !== 'All' || selectedSeverity !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCrop('All');
                  setSelectedPathogen('All');
                  setSelectedSeverity('All');
                  setSearchQuery('');
                }}
                className="text-emerald-700 font-semibold hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Disease Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDiseases.map((item) => (
          <Card
            key={item.id}
            hoverEffect
            className="flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-2xl" role="img" aria-label={item.crop}>
                    {item.icon}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={item.pathogenType} size="sm">
                      {item.pathogenType}
                    </Badge>
                    <Badge
                      variant={
                        item.severity === 'Critical'
                          ? 'danger'
                          : item.severity === 'High'
                          ? 'warning'
                          : item.severity === 'Moderate'
                          ? 'default'
                          : 'healthy'
                      }
                      size="sm"
                    >
                      {item.severity}
                    </Badge>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {item.crop} — {item.condition}
                </h3>
                <p className="text-xs text-slate-500 italic mt-0.5 font-serif line-clamp-1">
                  {item.scientificName}
                </p>

                {/* Top Symptoms Snippet */}
                <div className="mt-3.5 space-y-1.5">
                  <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
                    Diagnostic Symptoms
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {item.symptoms.slice(0, 2).map((symptom, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 line-clamp-2">
                        <span className="text-emerald-600 font-bold shrink-0">•</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Card Footer with Details Modal Trigger */}
            <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                {item.prevention.length} verified protocols
              </span>
              <button
                onClick={() => setActiveDiseaseModal(item)}
                type="button"
                className="font-bold text-forest-800 hover:text-emerald-700 flex items-center gap-1 transition-colors"
              >
                <span>View Full Protocol</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty Filter State */}
      {filteredDiseases.length === 0 && (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-200">
          <Sprout className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No diseases found matching filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Try adjusting your search query, crop selection, or pathogen filters to find relevant agronomic guidance.
          </p>
        </div>
      )}

      {/* Detailed Agronomic Dossier Modal */}
      {activeDiseaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-forest-800 to-[#14532d] text-white flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{activeDiseaseModal.icon}</span>
                  <Badge variant={activeDiseaseModal.pathogenType} size="md">
                    {activeDiseaseModal.pathogenType}
                  </Badge>
                  <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-semibold">
                    {activeDiseaseModal.severity} Severity
                  </span>
                </div>
                <h3 className="text-xl font-black">
                  {activeDiseaseModal.crop} — {activeDiseaseModal.condition}
                </h3>
                <p className="text-xs text-emerald-200/90 italic font-serif mt-0.5">
                  {activeDiseaseModal.scientificName}
                </p>
              </div>

              <button
                onClick={() => setActiveDiseaseModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Field Symptoms */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Verified Field Symptoms</span>
                </h4>
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-2">
                  {activeDiseaseModal.symptoms.map((sym, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{sym}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organic Biocontrol & Cultural Methods */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5 text-forest-800">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Organic & Biological Controls</span>
                </h4>
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 space-y-2">
                  {activeDiseaseModal.organicControl.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chemical Fungicides / Bactericides */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5 text-slate-700">
                  <Droplets className="w-3.5 h-3.5 text-sky-600" />
                  <span>Targeted Chemical Treatments (Recommended Doses)</span>
                </h4>
                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/60 space-y-2">
                  {activeDiseaseModal.chemicalControl.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="text-sky-600 font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preventive Crop Hygiene Protocols */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5 text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Long-term Prevention & Cultural Protocols</span>
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  {activeDiseaseModal.prevention.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="text-teal-600 font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                ICAR & PlantVillage Agronomic Database
              </span>
              <button
                onClick={() => setActiveDiseaseModal(null)}
                className="px-4 py-2 rounded-xl bg-forest-800 text-white font-semibold text-xs hover:bg-forest-900 transition-colors"
              >
                Close Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropGuidance;
