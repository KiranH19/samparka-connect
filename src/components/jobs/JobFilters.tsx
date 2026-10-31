import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { JobFilterParams } from '../../lib/api';
import { Search, MapPin, Briefcase, Filter, X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

interface JobFiltersProps {
  filters: JobFilterParams;
  onChange: (newFilters: JobFilterParams) => void;
  onClear: () => void;
  totalCount: number;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onChange,
  onClear,
  totalCount,
}) => {
  const { t } = useLanguage();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const handleFieldChange = (key: keyof JobFilterParams, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    (filters.city && filters.city !== 'all') ||
    (filters.locality && filters.locality !== 'all') ||
    (filters.category && filters.category !== 'all') ||
    (filters.employmentType && filters.employmentType !== 'all') ||
    filters.minSalary ||
    filters.isRemote
  );

  const activeFilterCount = [
    Boolean(filters.search),
    Boolean(filters.city && filters.city !== 'all'),
    Boolean(filters.locality && filters.locality !== 'all'),
    Boolean(filters.category && filters.category !== 'all'),
    Boolean(filters.employmentType && filters.employmentType !== 'all'),
    Boolean(filters.isRemote),
  ].filter(Boolean).length;

  // Quick Mobile Quick-Toggles
  const quickPills = [
    { label: 'Part-Time (ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ)', type: 'employmentType', value: 'part_time' },
    { label: 'Vidyanagar', type: 'locality', value: 'Vidyanagar' },
    { label: 'Chennamma Circle', type: 'locality', value: 'Chennamma Circle' },
    { label: 'Dharwad', type: 'city', value: 'Dharwad' },
    { label: 'Retail & Shops', type: 'category', value: 'Retail & Shops' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-5 shadow-xs space-y-3">
      {/* Primary Mobile Search Bar + Filter Trigger */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleFieldChange('search', e.target.value)}
            placeholder={t.filters.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BAA70] min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Quick City Dropdown */}
          <div className="relative flex-1 sm:w-44">
            <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={filters.city || 'all'}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              className="w-full pl-9 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BAA70] cursor-pointer min-h-[44px]"
            >
              <option value="all">{t.filters.allCities}</option>
              <option value="Hubli">Hubli (ಹುಬ್ಬಳ್ಳಿ)</option>
              <option value="Dharwad">Dharwad (ಧಾರವಾಡ)</option>
              <option value="Belagavi">Belagavi</option>
            </select>
          </div>

          {/* Toggle More Filters on Mobile */}
          <button
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className={`sm:hidden px-3 py-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold min-h-[44px] transition-colors ${
              mobileExpanded || activeFilterCount > 0
                ? 'bg-emerald-50 border-emerald-300 text-[#0BAA70]'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
            aria-label="Toggle filter options"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#0BAA70] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Filter Horizontal Scroll Bar for Mobile */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar text-xs">
        {quickPills.map((pill) => {
          const isActive = (filters as any)[pill.type] === pill.value;
          return (
            <button
              key={pill.label}
              onClick={() => {
                handleFieldChange(
                  pill.type as keyof JobFilterParams,
                  isActive ? 'all' : pill.value
                );
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 border transition-all text-xs font-medium min-h-[34px] flex items-center gap-1 ${
                isActive
                  ? 'bg-[#102B4E] text-white border-[#102B4E] font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{pill.label}</span>
              {isActive && <X className="w-3 h-3 ml-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Expanded Filters Section (Always visible on Desktop, collapsible on Mobile) */}
      <div className={`${mobileExpanded ? 'block' : 'hidden sm:block'} pt-3 border-t border-slate-100 space-y-3`}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Locality
            </label>
            <select
              value={filters.locality || 'all'}
              onChange={(e) => handleFieldChange('locality', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70] min-h-[40px]"
            >
              <option value="all">{t.filters.allLocalities}</option>
              <optgroup label="Hubli Localities">
                {t.hubliLocalities.map((loc) => {
                  const cleanLoc = loc.split(' (')[0];
                  return <option key={loc} value={cleanLoc}>{loc}</option>;
                })}
              </optgroup>
              <optgroup label="Dharwad Localities">
                {t.dharwadLocalities.map((loc) => {
                  const cleanLoc = loc.split(' (')[0];
                  return <option key={loc} value={cleanLoc}>{loc}</option>;
                })}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={filters.category || 'all'}
              onChange={(e) => handleFieldChange('category', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70] min-h-[40px]"
            >
              <option value="all">{t.filters.allCategories}</option>
              <option value="Retail & Shops">{t.categories.retail}</option>
              <option value="Restaurants & Cafes">{t.categories.restaurant}</option>
              <option value="Manufacturing & Industrial">{t.categories.manufacturing}</option>
              <option value="IT & Office">{t.categories.office}</option>
              <option value="Logistics & Delivery">{t.categories.logistics}</option>
              <option value="Healthcare & Clinic">{t.categories.healthcare}</option>
              <option value="Teaching & Tutoring">{t.categories.education}</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Job Type
            </label>
            <select
              value={filters.employmentType || 'all'}
              onChange={(e) => handleFieldChange('employmentType', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70] min-h-[40px]"
            >
              <option value="all">{t.filters.allTypes}</option>
              <option value="part_time">{t.jobTypes.part_time}</option>
              <option value="full_time">{t.jobTypes.full_time}</option>
              <option value="internship">{t.jobTypes.internship}</option>
              <option value="contract">{t.jobTypes.contract}</option>
              <option value="daily_wage">{t.jobTypes.daily_wage}</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={filters.sortBy || 'newest'}
              onChange={(e) => handleFieldChange('sortBy', e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70] min-h-[40px]"
            >
              <option value="newest">{t.filters.newest}</option>
              <option value="salary_high">{t.filters.highestSalary}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results tally and clear filter action */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <div>
          <span className="font-bold text-[#102B4E]">{totalCount}</span> {t.filters.resultsCount}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-[#0BAA70] hover:text-[#098557] font-semibold transition-colors min-h-[36px]"
          >
            <X className="w-3.5 h-3.5" />
            <span>{t.filters.clearFilters}</span>
          </button>
        )}
      </div>
    </div>
  );
};
