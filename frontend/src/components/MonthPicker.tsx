import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const getMonthLabel = (monthKey: string) => {
  if (!monthKey) return 'Select month';
  const [year, monthNumber] = monthKey.split('-');
  const monthIndex = Number(monthNumber) - 1;
  if (Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return 'Select month';
  return `${monthNames[monthIndex]} ${year}`;
};

type MonthPickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function MonthPicker({ value, onChange, placeholder = 'Select month', disabled = false }: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    if (value) {
      const [year] = value.split('-');
      const parsedYear = Number(year);
      if (Number.isFinite(parsedYear)) return parsedYear;
    }

    return new Date().getFullYear();
  });
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const currentMonthKey = useMemo(() => getCurrentMonthKey(), []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (value) {
      const [year] = value.split('-');
      const parsedYear = Number(year);
      if (Number.isFinite(parsedYear)) {
        setViewYear(parsedYear);
      }
    }
  }, [value]);

  const handleMonthSelect = (monthIndex: number) => {
    const monthValue = String(monthIndex + 1).padStart(2, '0');
    const nextValue = `${viewYear}-${monthValue}`;
    onChange(nextValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
  };

  const handleThisMonth = () => {
    onChange(currentMonthKey);
    setViewYear(Number(currentMonthKey.split('-')[0]));
    setIsOpen(false);
  };

  const selectionText = value ? getMonthLabel(value) : placeholder;

  return (
    <div ref={wrapperRef} className="month-picker">
      <button
        ref={triggerRef}
        type="button"
        className={`month-picker-trigger ${isOpen ? 'open' : ''}`.trim()}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => !disabled && setIsOpen((current) => !current)}
      >
        <CalendarDays size={16} className="month-picker-icon" />
        <span className="month-picker-text">{selectionText}</span>
        <ChevronDown size={16} className={`month-picker-chevron ${isOpen ? 'rotated' : ''}`.trim()} />
      </button>

      {isOpen ? (
        <div className="month-picker-panel" role="dialog" aria-label="Month picker">
          <div className="month-picker-header">
            <button type="button" className="month-nav-button" onClick={() => setViewYear((year) => year - 1)} aria-label="Previous year">
              <ChevronLeft size={16} />
            </button>
            <span className="month-picker-year">{viewYear}</span>
            <button type="button" className="month-nav-button" onClick={() => setViewYear((year) => year + 1)} aria-label="Next year">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="month-grid">
            {monthNames.map((month, index) => {
              const monthValue = `${viewYear}-${String(index + 1).padStart(2, '0')}`;
              const isSelected = value === monthValue;
              const isCurrentMonth = monthValue === currentMonthKey;

              return (
                <button
                  key={month}
                  type="button"
                  className={`month-button ${isSelected ? 'selected' : ''} ${isCurrentMonth ? 'current' : ''}`.trim()}
                  onClick={() => handleMonthSelect(index)}
                >
                  {month}
                </button>
              );
            })}
          </div>

          <div className="month-picker-footer">
            <button type="button" className="month-action-button" onClick={handleClear}>
              Clear
            </button>
            <button type="button" className="month-action-button primary" onClick={handleThisMonth}>
              This Month
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
