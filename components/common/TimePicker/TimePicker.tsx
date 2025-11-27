import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
import {
  TimePickerContainer,
  TimePickerInput,
  TimePickerIcon,
  TimePickerDropdown,
  TimePickerOption,
  TimePickerSeparator,
  TimePickerLabel
} from './timePickerStyle';

export interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value = '',
  onChange,
  placeholder = 'Chọn giờ',
  disabled = false,
  label,
  required = false,
  error,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState('08');
  const [minutes, setMinutes] = useState('00');
  const [amPm, setAmPm] = useState('AM');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const [time] = value.split(' ');
      if (time) {
        const [h, m] = time.split(':');
        if (h && m) {
          const hour = parseInt(h);
          if (hour >= 12) {
            setAmPm('PM');
            setHours(hour === 12 ? '12' : (hour - 12).toString().padStart(2, '0'));
          } else {
            setAmPm('AM');
            setHours(hour === 0 ? '12' : hour.toString().padStart(2, '0'));
          }
          setMinutes(m);
        }
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTimeChange = (newHours: string, newMinutes: string, newAmPm: string) => {
    setHours(newHours);
    setMinutes(newMinutes);
    setAmPm(newAmPm);
    
    const hour24 = newAmPm === 'AM' 
      ? (newHours === '12' ? 0 : parseInt(newHours))
      : (newHours === '12' ? 12 : parseInt(newHours) + 12);
    
    const timeString = `${hour24.toString().padStart(2, '0')}:${newMinutes}`;
    onChange?.(timeString);
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const formatDisplayValue = () => {
    if (!value) return '';
    const [h, m] = value.split(':');
    const hour = parseInt(h);
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour >= 12 ? 'PM' : 'AM';
    return `${displayHour.toString().padStart(2, '0')}:${m} ${period}`;
  };

  const generateHours = () => {
    return Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  };

  const generateMinutes = () => {
    return Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  };

  return (
    <TimePickerContainer className={className}>
      {label && (
        <TimePickerLabel>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
        </TimePickerLabel>
      )}
      <TimePickerInput
        onClick={handleInputClick}
        disabled={disabled}
        $hasError={!!error}
        $isOpen={isOpen}
      >
        <span>{formatDisplayValue() || placeholder}</span>
        <TimePickerIcon>
          <Clock size={16} />
        </TimePickerIcon>
      </TimePickerInput>
      
      {error && (
        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
          {error}
        </div>
      )}

      {isOpen && (
        <TimePickerDropdown ref={dropdownRef}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', textAlign: 'center' }}>
                Giờ
              </div>
              <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                {generateHours().map((hour) => (
                  <TimePickerOption
                    key={hour}
                    $isSelected={hours === hour}
                    onClick={() => handleTimeChange(hour, minutes, amPm)}
                  >
                    {hour}
                  </TimePickerOption>
                ))}
              </div>
            </div>
            
            <TimePickerSeparator>:</TimePickerSeparator>
            
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', textAlign: 'center' }}>
                Phút
              </div>
              <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                {generateMinutes().map((minute) => (
                  <TimePickerOption
                    key={minute}
                    $isSelected={minutes === minute}
                    onClick={() => handleTimeChange(hours, minute, amPm)}
                  >
                    {minute}
                  </TimePickerOption>
                ))}
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', textAlign: 'center' }}>
                AM/PM
              </div>
              <div>
                <TimePickerOption
                  $isSelected={amPm === 'AM'}
                  onClick={() => handleTimeChange(hours, minutes, 'AM')}
                >
                  AM
                </TimePickerOption>
                <TimePickerOption
                  $isSelected={amPm === 'PM'}
                  onClick={() => handleTimeChange(hours, minutes, 'PM')}
                >
                  PM
                </TimePickerOption>
              </div>
            </div>
          </div>
        </TimePickerDropdown>
      )}
    </TimePickerContainer>
  );
};

export default TimePicker;
