import { Check, type LucideIcon } from "lucide-react";

const CheckoutSection = ({
  step,
  icon: Icon,
  title,
  hint,
  complete,
  children,
}: {
  step: number;
  icon: LucideIcon;
  title: string;
  hint: string;
  complete: boolean;
  children: React.ReactNode;
}) => {
  return (
    <section className="relative overflow-hidden rounded-xl border border-muted bg-card/40 p-5 transition-colors duration-300 hover:border-light-blue/30 lg:p-6">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-light-blue/0 via-light-blue/60 to-light-blue/0" />
      <header className="mb-5 flex items-center gap-3">
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-light-blue/30 bg-light-blue/10 text-light-blue">
          <Icon className="h-4.5 w-4.5" />
          <span className="absolute -top-1.5 -left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-light-blue font-body text-[9px] font-bold text-primary-foreground">
            {step}
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold leading-tight text-foreground">
            {title}
          </h2>
          <p className="font-body text-xs text-muted-foreground">{hint}</p>
        </div>
        {complete && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-light-blue/40 bg-light-blue/10 px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-wider text-light-blue">
            <Check className="h-3 w-3" /> Complete
          </span>
        )}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
};

export default CheckoutSection;
