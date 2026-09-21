"use client";
import clsx from "clsx";
import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { inputShell, inputShellDisabled } from "./inputStyles";

type Option = { label: string; value?: string; colorClass?: string };

interface CustomSelectProps {
  options?: Option[];
  value?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  searchable?: boolean;
  ariaLabel?: string;
  onChange: (value: any) => void;
  // Allows callers to pass through DOM-ish props (id, etc.) some existing
  // call sites already relied on before this component had a typed props
  // interface at all.
  [key: string]: any;
}

// Reusable custom dropdown for every single-select control in the app — no
// native <select> anywhere, so styling/keyboard behavior/accessibility stay
// identical across every filter, form, and settings page that needs one.
const CustomSelect = (props: CustomSelectProps) => {
  const [drop, setDrop] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [query, setQuery] = useState("");
  const [openUpward, setOpenUpward] = useState(false);
  const options: Option[] = props.options ?? [];
  const { onChange: handler, disabled, placeholder, loading, searchable } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  // "value mode": the caller controls selection via option.value (needed
  // whenever the display label differs from the underlying value, e.g.
  // "All Statuses" -> ""). Falls back to the legacy label-matching mode
  // used by the existing callers (quiz/question create, signup) when no
  // `value` prop is passed.
  const valueMode = props.value !== undefined;

  const selectedIndex = options.findIndex((item) =>
    valueMode
      ? (item.value ?? item.label) === props.value
      : item.label === props.label,
  );
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const displayLabel = valueMode
    ? selectedOption?.label ?? placeholder
    : props.label
      ? props.label
      : placeholder;

  const filteredOptions =
    searchable && query.trim()
      ? options.filter((item) =>
          item.label.toLowerCase().includes(query.trim().toLowerCase()),
        )
      : options;

  const filteredSelectedIndex = filteredOptions.findIndex((item) =>
    valueMode
      ? (item.value ?? item.label) === props.value
      : item.label === props.label,
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setDrop(false);
        setQuery("");
      }
    }
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Decide whether the menu has room to open downward, so it never spills
  // past the bottom of the viewport (flips upward when it doesn't).
  useLayoutEffect(() => {
    if (!drop || !rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const estimatedMenuHeight = (searchable ? 48 : 0) + 288;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setOpenUpward(spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow);
  }, [drop, searchable]);

  useEffect(() => {
    if (drop && searchable) {
      const id = window.setTimeout(() => searchRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [drop, searchable]);

  const selectOption = (item: Option) => {
    handler(valueMode ? item.value ?? item.label : item.label);
    setDrop(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!drop) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
        e.preventDefault();
        setHighlighted(filteredSelectedIndex >= 0 ? filteredSelectedIndex : 0);
        setDrop(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => Math.min(i + 1, filteredOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[highlighted]) selectOption(filteredOptions[highlighted]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setDrop(false);
      setQuery("");
    }
  };

  return (
    <div
      ref={rootRef}
      role="combobox"
      aria-expanded={drop}
      aria-haspopup="listbox"
      aria-controls={listId}
      aria-label={props.ariaLabel ?? placeholder}
      aria-activedescendant={drop ? `${listId}-${highlighted}` : undefined}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      className={clsx(
        inputShell,
        disabled && inputShellDisabled,
        drop && "border-blue-500 ring-4 ring-blue-500/10",
        "relative cursor-pointer justify-between select-none focus:outline-none",
      )}
      onClick={(e) => {
        if (disabled) return;
        setDrop((d) => {
          if (!d) setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
          return !d;
        });
        e.stopPropagation();
      }}
    >
      <span
        className={clsx(
          "truncate text-[15px]",
          displayLabel
            ? (selectedOption?.colorClass ?? "text-gray-800")
            : "text-gray-400",
        )}
        title={typeof displayLabel === "string" ? displayLabel : undefined}
      >
        {displayLabel || placeholder}
      </span>

      {drop && (
        <div
          role="listbox"
          id={listId}
          className={clsx(
            "animate-fadeIn absolute inset-x-0 z-20 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl shadow-black/10",
            openUpward ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {searchable && (
            <div className="relative border-b border-gray-100 p-2">
              <Search
                size={15}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHighlighted(0);
                }}
                placeholder="Search..."
                aria-label="Search options"
                className="w-full rounded-lg bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
          )}

          <div className="menu-scrollbar max-h-[280px] overflow-y-auto py-1.5">
            {loading ? (
              <div className="flex items-center gap-2 px-4 py-3 text-[15px] text-gray-400">
                <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                Loading...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="px-4 py-2.5 text-[15px] text-gray-400">
                {query ? "No matching options" : "No options"}
              </div>
            ) : (
              filteredOptions.map((item, index) => {
                const isSelected = index === filteredSelectedIndex;
                const isHighlighted = index === highlighted;
                return (
                  <div
                    key={item.value ?? item.label ?? index}
                    id={`${listId}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    title={item.label}
                    className={clsx(
                      "flex min-h-[40px] items-center justify-between gap-2 px-4 py-2.5 text-[15px] transition-colors duration-150",
                      isSelected
                        ? clsx("bg-blue-50", item.colorClass ?? "text-blue-600")
                        : isHighlighted
                          ? clsx("bg-gray-50", item.colorClass ?? "text-gray-700")
                          : clsx(item.colorClass ?? "text-gray-700", "hover:bg-gray-50"),
                    )}
                    onMouseEnter={() => setHighlighted(index)}
                    onClick={(e) => {
                      selectOption(item);
                      e.stopPropagation();
                    }}
                  >
                    <span className="truncate">{item.label}</span>
                    {isSelected && (
                      <Check size={16} strokeWidth={2.5} className="shrink-0" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <ChevronDown
        size={18}
        className={clsx(
          "shrink-0 text-gray-400 transition-transform duration-200",
          drop && "rotate-180",
        )}
      />
    </div>
  );
};

export default CustomSelect;
