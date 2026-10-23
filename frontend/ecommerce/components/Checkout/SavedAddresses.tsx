import { Check, MapPin, Plus } from "lucide-react";
import { UserAddress } from "@/types/api";

export type SelectedAddress = number | "new";

const cardClassName = (selected: boolean) =>
  `group relative flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all duration-200 ${
    selected
      ? "border-light-blue/70 bg-light-blue/7 shadow-glow-cyan"
      : "border-muted hover:border-light-blue/40 hover:bg-light-blue/3"
  }`;

const iconClassName = (selected: boolean) =>
  `flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
    selected
      ? "border-light-blue/50 bg-light-blue/15 text-light-blue"
      : "border-muted bg-background/60 text-muted-foreground group-hover:text-light-blue"
  }`;

const Checkmark = ({ selected }: { selected: boolean }) => (
  <span
    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
      selected
        ? "border-light-blue bg-light-blue text-primary-foreground"
        : "border-muted"
    }`}
  >
    {selected && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
  </span>
);

// The logged-in user's address book plus the option to type a different address.
const SavedAddresses = ({
  addresses,
  selected,
  onChange,
}: {
  addresses: UserAddress[];
  selected: SelectedAddress;
  onChange: (selected: SelectedAddress) => void;
}) => {
  return (
    <div className="space-y-3">
      {addresses.map((address) => {
        const isSelected = selected === address.id;

        return (
          <label key={address.id} className={cardClassName(isSelected)}>
            <input
              type="radio"
              name="saved-address"
              checked={isSelected}
              onChange={() => onChange(address.id)}
              className="sr-only"
            />
            <span className={iconClassName(isSelected)}>
              <MapPin className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
                {address.address_line1}
                {address.is_default && (
                  <span className="rounded-full border border-light-blue/40 bg-light-blue/10 px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider text-light-blue">
                    Default
                  </span>
                )}
              </p>
              <p className="font-body text-xs text-muted-foreground">
                {address.postal_code} {address.city}, {address.country.name}
              </p>
            </div>
            <Checkmark selected={isSelected} />
          </label>
        );
      })}

      <label className={cardClassName(selected === "new")}>
        <input
          type="radio"
          name="saved-address"
          checked={selected === "new"}
          onChange={() => onChange("new")}
          className="sr-only"
        />
        <span className={iconClassName(selected === "new")}>
          <Plus className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            Use a different address
          </p>
          <p className="font-body text-xs text-muted-foreground">
            Enter a new shipping address
          </p>
        </div>
        <Checkmark selected={selected === "new"} />
      </label>
    </div>
  );
};

export default SavedAddresses;
