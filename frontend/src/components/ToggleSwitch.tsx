import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
}

export default function ToggleSwitch({ checked, onChange, id, disabled }: ToggleSwitchProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!disabled) onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-250 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4F7DFF]/50 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 select-none ${
        checked 
          ? 'bg-[#4F7DFF] hover:shadow-[0_0_10px_rgba(79,125,255,0.4)]' 
          : 'bg-slate-300 hover:shadow-[0_0_8px_rgba(150,150,150,0.25)]'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-250 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
