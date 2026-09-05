export default function FeatureItem({ icon: Icon, title, desc, iconColor }) {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 group shrink-0">
      <div className="size-11 flex items-center justify-center transition-all group-hover:scale-110 shadow-inner transform-gpu">
        <Icon size={24} weight="bold" className={iconColor} />
      </div>
      <div>
        <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-100 mb-1">
          {title}
        </h3>
        <p className="text-[10px] md:text-[11px] text-slate-400 font-semibold uppercase leading-tight tracking-wide max-w-35 md:max-w-45">
          {desc}
        </p>
      </div>
    </div>
  );
}