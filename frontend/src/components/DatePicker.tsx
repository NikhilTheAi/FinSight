import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const getDayValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (value: string) => {
  if (!value) return 'Select date';

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return 'Select date';

  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function DatePicker({ value, onChange, placeholder = 'Select date', disabled = false }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const parsed = new Date(`${value}T00:00:00`);
      if (!Number.isNaN(parsed.getTime())) return new Date(parsed.getFullYear(), parsed.getMonth(), 1);
    }

    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const todayValue = useMemo(() => getDayValue(new Date()), []);

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
      const parsed = new Date(`${value}T00:00:00`);
      if (!Number.isNaN(parsed.getTime())) {
        setViewDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
      }
    }
  }, [value]);

  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const lastDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
  const startingDay = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  const calendarCells: Array<{ value: string; isCurrentMonth: boolean; isToday: boolean; isSelected: boolean; dayNumber: number }> = [];

  const previousMonthLastDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0).getDate();
  for (let i = startingDay - 1; i >= 0; i -= 1) {
    const dayNumber = previousMonthLastDate - i;
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() - 1;
    const date = new Date(year, month, dayNumber);
    const dateValue = getDayValue(date);
    calendarCells.push({
      value: dateValue,
      isCurrentMonth: false,
      isToday: dateValue === todayValue,
      isSelected: dateValue === value,
      dayNumber,
    });
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const dateValue = getDayValue(date);
    calendarCells.push({
      value: dateValue,
      isCurrentMonth: true,
      isToday: dateValue === todayValue,
      isSelected: dateValue === value,
      dayNumber: day,
    });
  }

  while (calendarCells.length % 7 !== 0) {
    const nextIndex = calendarCells.length - (startingDay + totalDays) + 1;
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, nextIndex);
    const dateValue = getDayValue(date);
    calendarCells.push({
      value: dateValue,
      isCurrentMonth: false,
      isToday: dateValue === todayValue,
      isSelected: dateValue === value,
      dayNumber: date.getDate(),
    });
  }

  const handleDaySelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handlePreviousMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    const selectedToday = getDayValue(today);
    onChange(selectedToday);
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setIsOpen(false);
  };

  const triggerText = value ? formatDisplayDate(value) : placeholder;

  return (
    <div ref={wrapperRef} className="date-picker">
      <button
        ref={triggerRef}
        type="button"
        className={`date-picker-trigger ${isOpen ? 'open' : ''}`.trim()}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => !disabled && setIsOpen((current) => !current)}
      >
        <CalendarDays size={16} className="date-picker-icon" />
        <span className="date-picker-text">{triggerText}</span>
        <ChevronDown size={16} className={`date-picker-chevron ${isOpen ? 'rotated' : ''}`.trim()} />
      </button>

      {isOpen ? (
        <div className="date-picker-panel" role="dialog" aria-label="Date picker">
          <div className="date-picker-header">
            <button type="button" className="date-nav-button" onClick={handlePreviousMonth} aria-label="Previous month">
              <ChevronLeft size={16} />
            </button>
            <span className="date-picker-month-year">{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
            <button type="button" className="date-nav-button" onClick={handleNextMonth} aria-label="Next month">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="date-picker-weekdays">
            {weekDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="date-picker-grid">
            {calendarCells.map((cell) => (
              <button
                key={cell.value}
                type="button"
                className={`date-cell ${cell.isCurrentMonth ? 'current-month' : 'muted-month'} ${cell.isSelected ? 'selected' : ''} ${cell.isToday ? 'today' : ''}`.trim()}
                onClick={() => handleDaySelect(cell.value)}
              >
                {cell.dayNumber}
              </button>
            ))}
          </div>

          <div className="date-picker-footer">
            <button type="button" className="date-action-button" onClick={handleClear}>
              Clear
            </button>
            <button type="button" className="date-action-button primary" onClick={handleToday}>
              Today
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
