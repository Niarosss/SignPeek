import { 
  XIcon, 
  UserIcon, 
  BuildingsIcon, 
  CalendarBlankIcon,
  FingerprintIcon,
  SealCheckIcon
} from '@phosphor-icons/react';

export default function CertificateModal({ isOpen, onClose, info }) {
  if (!isOpen || !info) return null;

  return (
    <div 
      className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-700 p-8 text-white relative">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <XIcon size={24} weight="bold" />
          </button>
          
          <div className="flex items-center gap-4 mb-2">
            <SealCheckIcon size={40} weight="fill" className="text-slate-200" />
            <h2 className="text-2xl font-black tracking-tight leading-none">Дані підпису</h2>
          </div>
          <p className="text-slate-300 text-sm opacity-80 font-medium">Перевірено в пам'яті браузера</p>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {info.map((signer, idx) => (
            <div key={idx} className="space-y-4 animate-in slide-in-from-bottom-2 duration-500">
              <InfoItem icon={<UserIcon size={20} />} label="Підписувач" value={signer.subject} />
              <InfoItem icon={<BuildingsIcon size={20} />} label="Організація" value={signer.organization} />
              <InfoItem icon={<FingerprintIcon size={20} />} label="Видавець сертифіката" value={signer.issuer} />
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 mt-4">
                <InfoItem icon={<CalendarBlankIcon size={18} />} label="Дійсний з" value={new Date(signer.validFrom).toLocaleDateString()} />
                <InfoItem icon={<CalendarBlankIcon size={18} />} label="Дійсний до" value={new Date(signer.validTo).toLocaleDateString()} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-500 font-semibold tracking-wider text-center">
            Дані отримано безпосередньо з криптографічного контейнера
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="mt-1 text-slate-500 bg-slate-100/50 p-2 rounded-xl shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
        <p className="text-[13px] font-bold text-slate-700 leading-tight wrap-break-word">{value}</p>
      </div>
    </div>
  );
}