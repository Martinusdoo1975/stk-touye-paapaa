import React from 'react';

interface InputGroupProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'textarea';
  suggestions?: string[];
  helperText?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  suggestions = [],
  helperText
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none placeholder-slate-500"
        />
      ) : (
        <input
          type="text"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-500"
        />
      )}
      
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onChange(suggestion)}
              className="px-2 py-1 text-xs bg-slate-800 hover:bg-indigo-900/50 hover:text-indigo-200 text-slate-400 rounded-md border border-slate-700 hover:border-indigo-800 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {helperText && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
};
