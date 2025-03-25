
export function CourtLegend() {
  return (
    <div className="mt-6 p-3 bg-white rounded-lg shadow-sm">
      <h3 className="text-sm font-medium mb-2">Court Types</h3>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-ath-clay mr-1.5"></span>
          <span className="text-xs text-gray-600">Tennis (Clay)</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-ath-hard mr-1.5"></span>
          <span className="text-xs text-gray-600">Tennis (Hard)</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-ath-grass mr-1.5"></span>
          <span className="text-xs text-gray-600">Padel</span>
        </div>
      </div>
    </div>
  );
}
