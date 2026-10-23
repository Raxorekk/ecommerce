"use client";
import ProductImage from "./ProductImage";
import { ChevronDown, Trash2 } from "lucide-react";
import { Cart } from "@/types/api";
import { useContext, useState } from "react";
import Link from "next/link";
import { deleteCartItem, updateCartItemQuantity } from "@/app/actions/cart";
import { CartContext } from "@/app/context/CartContext";

// The dropdown offers 1..LIST_MAX_QUANTITY, bigger quantities are typed in after choosing "10+"
const LIST_MAX_QUANTITY = 9;
const MAX_QUANTITY = 99;
const CUSTOM_OPTION = "custom";

const listOptions = Array.from(
  { length: LIST_MAX_QUANTITY },
  (_, index) => index + 1,
);

const quantityControlClassName =
  "h-8.5 rounded-md border border-muted bg-card text-sm font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-light-blue";

const CartItem = ({
  item,
  onUpdate,
}: {
  item: Cart["items"][number];
  onUpdate: () => void | Promise<void>;
}) => {
  // Set right after the user picks a quantity so the UI reacts before the server answers
  const [pendingQuantity, setPendingQuantity] = useState<number | null>(null);
  // "10+" was chosen, so the text field takes the place of the dropdown
  const [isCustomMode, setIsCustomMode] = useState(false);
  // what the user is typing; null means "show the current quantity"
  const [customValue, setCustomValue] = useState<string | null>(null);
  const { cartItemsCount, setCartItemsCount } = useContext(CartContext);

  const quantity = pendingQuantity ?? item.quantity;
  const totalProductPrice = quantity * Number(item.product.price);
  // quantities the dropdown cannot show are edited in the text field instead
  const showCustomInput = isCustomMode || quantity > LIST_MAX_QUANTITY;

  const changeQuantity = async (newQuantity: number) => {
    if (newQuantity === quantity) return;

    setCartItemsCount(cartItemsCount + newQuantity - quantity);
    setPendingQuantity(newQuantity);

    try {
      await updateCartItemQuantity(item.id, newQuantity);
    } finally {
      // refetching also restores the real quantity and navbar count if the update failed
      await onUpdate();
      setPendingQuantity(null);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === CUSTOM_OPTION) {
      setIsCustomMode(true);
      setCustomValue("");
      return;
    }

    changeQuantity(Number(e.target.value));
  };

  const closeCustomInput = () => {
    setIsCustomMode(false);
    setCustomValue(null);
  };

  const applyCustomQuantity = () => {
    const typed = Number(customValue ?? quantity);
    const isValid =
      customValue !== "" &&
      Number.isInteger(typed) &&
      typed >= 1 &&
      typed <= MAX_QUANTITY;

    closeCustomInput();

    // an invalid or empty value just brings back the current quantity
    if (isValid) {
      changeQuantity(typed);
    }
  };

  const handleDeleteCartItem = async (itemId: Cart["items"][number]["id"]) => {
    await deleteCartItem(itemId);
    onUpdate();
  };

  return (
    <div key={item.id} className="flex flex-row p-4 card bg-card/40 gap-4">
      <div>
        <Link
          href={`/products/categories/${item.product.category.slug}/${item.product.slug}`}
          className="flex h-28 w-28"
        >
          <ProductImage
            productImg={item.product.product_img}
            productName={item.product.slug}
          />
        </Link>
      </div>
      <div className="flex flex-col flex-1">
        <Link
          href={`/products/categories/${item.product.category.slug}`}
          className="self-start uppercase text-light-blue text-[10px] font-semibold tracking-wider"
        >
          {item.product.category.name.toUpperCase()}
        </Link>

        <Link
          href={`/products/categories/${item.product.category.slug}/${item.product.slug}`}
          className="group self-start"
        >
          <h4 className="font-semibold group-hover:text-light-blue transition-colors">
            {item.product.name}
          </h4>
        </Link>
        <p className="mt-1 text-muted-foreground text-xs">
          ${item.product.price} each
        </p>
        <div className="flex flex-row mt-auto justify-between items-baseline">
          {showCustomInput ? (
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_QUANTITY}
              placeholder={`${LIST_MAX_QUANTITY + 1}+`}
              aria-label={`Type quantity of ${item.product.name}`}
              value={customValue ?? String(quantity)}
              onChange={(e) => setCustomValue(e.target.value)}
              onBlur={applyCustomQuantity}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyCustomQuantity();
                if (e.key === "Escape") closeCustomInput();
              }}
              autoFocus={isCustomMode}
              className={`${quantityControlClassName} w-20 self-start px-3`}
            />
          ) : (
            <div className="relative self-start">
              <select
                aria-label={`Quantity of ${item.product.name}`}
                value={quantity}
                onChange={handleSelectChange}
                className={`${quantityControlClassName} appearance-none cursor-pointer pl-3 pr-8 transition-colors hover:bg-muted`}
              >
                {listOptions.map((option) => (
                  <option key={option} value={option} className="bg-card">
                    {option}
                  </option>
                ))}
                <option value={CUSTOM_OPTION} className="bg-card">
                  {LIST_MAX_QUANTITY + 1}+
                </option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          )}
          <div className="flex flex-row self-baseline my-auto items-center gap-3">
            <h4 className="font-semibold mt-0.5">
              ${totalProductPrice.toFixed(2)}
            </h4>
            <button
              onClick={() => {
                handleDeleteCartItem(item.id);
                setCartItemsCount(cartItemsCount - quantity);
              }}
              aria-label={`Remove ${item.product.name} from cart`}
              className="group cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-red-700 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
