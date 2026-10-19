import React from 'react';

export default function GlassTable({
  headers = [],
  children,
  className = '',
}) {
  return (
    <div className={`glass-surface rounded-2xl overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/10 bg-white/20 dark:bg-white/5">
              {headers.map((head, index) => (
                <th
                  key={index}
                  className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-espresso-900/70 dark:text-cream-200/70"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}
