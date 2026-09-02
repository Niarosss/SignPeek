export default function FormatHint({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5 transition-transform hover:scale-110 select-none group/hint shrink-0">
      <div className="text-slate-500 group-hover/hint:text-green-700 transition-colors duration-300">
        <Icon size={28} weight="duotone" />
      </div>
      <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase text-slate-500 group-hover/hint:text-slate-700 transition-colors duration-300">
        {label}
      </span>
    </div>
  );
}