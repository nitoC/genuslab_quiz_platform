"use client";
import clsx from "clsx";
import React, { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { inputShell, inputShellDisabled } from "./inputStyles";

type Option = { label: string; value?: string };

const CustomSelect = (props: any) => {
  const [drop, setDrop] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const options: Option[] = props.options ?? [];
  const { onChange: handler, disabled, placeholder } = props;
  const rootRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setDrop(false);
      }
    }
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const selectOption = (item: Option) => {
    handler(valueMode ? item.value ?? item.label : item.label);
    setDrop(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!drop) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
        e.preventDefault();
        setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
        setDrop(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (options[highlighted]) selectOption(options[highlighted]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setDrop(false);
    }
  };

  return (
    <div
      ref={rootRef}
      role="combobox"
      aria-expanded={drop}
      aria-haspopup="listbox"
      aria-controls={listId}
      aria-activedescendant={drop ? `${listId}-${highlighted}` : undefined}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      className={clsx(
        inputShell,
        disabled && inputShellDisabled,
        drop && "border-blue-500 ring-4 ring-blue-500/10",
        "relative cursor-pointer justify-between select-none focus:outline-none",
      )}
      onClick={(e) => {
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
          displayLabel ? "text-gray-800" : "text-gray-400",
        )}
      >
        {displayLabel || placeholder}
      </span>

      {drop && (
        <div
          role="listbox"
          id={listId}
          className="animate-fadeIn absolute inset-x-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl shadow-black/10"
        >
          <div className="menu-scrollbar max-h-[280px] overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-4 py-2.5 text-[15px] text-gray-400">
                No options
              </div>
            ) : (
              options.map((item, index) => {
                const isSelected = index === selectedIndex;
                const isHighlighted = index === highlighted;
                return (
                  <div
                    key={item.value ?? item.label ?? index}
                    id={`${listId}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    className={clsx(
                      "flex items-center justify-between gap-2 px-4 py-2.5 text-[15px] transition-colors duration-150",
                      isSelected
                        ? "bg-blue-50 text-blue-600"
                        : isHighlighted
                          ? "bg-gray-50 text-gray-700"
                          : "text-gray-700 hover:bg-gray-50",
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
