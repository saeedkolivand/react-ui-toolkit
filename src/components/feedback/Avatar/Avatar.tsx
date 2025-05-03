import React from 'react';
import { twMerge } from 'tailwind-merge';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

export interface AvatarProps {
  /**
   * The source URL of the avatar image
   */
  src?: string;
  /**
   * Alt text for the avatar image
   */
  alt?: string;
  /**
   * The size of the avatar
   */
  size?: AvatarSize;
  /**
   * The status indicator of the avatar
   */
  status?: AvatarStatus;
  /**
   * The initials to display when no image is available
   */
  initials?: string;
  /**
   * Whether the avatar is squared
   */
  squared?: boolean;
  /**
   * Whether to show a border
   */
  bordered?: boolean;
  /**
   * Additional classes to be applied to the avatar
   */
  className?: string;
}

const sizeStyles: Record<AvatarSize, { container: string; status: string; font: string }> = {
  xs: {
    container: 'w-6 h-6',
    status: 'w-1.5 h-1.5',
    font: 'text-xs',
  },
  sm: {
    container: 'w-8 h-8',
    status: 'w-2 h-2',
    font: 'text-sm',
  },
  md: {
    container: 'w-10 h-10',
    status: 'w-2.5 h-2.5',
    font: 'text-base',
  },
  lg: {
    container: 'w-12 h-12',
    status: 'w-3 h-3',
    font: 'text-lg',
  },
  xl: {
    container: 'w-14 h-14',
    status: 'w-3.5 h-3.5',
    font: 'text-xl',
  },
};

const statusStyles: Record<AvatarStatus, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
};

const getInitialsFromName = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'md',
  status,
  initials,
  squared = false,
  bordered = false,
  className,
}) => {
  const { container, status: statusSize, font } = sizeStyles[size];

  const containerClasses = twMerge(
    'relative inline-flex items-center justify-center bg-gray-200',
    container,
    squared ? 'rounded-lg' : 'rounded-full',
    bordered && 'border-2 border-white ring-2 ring-gray-200',
    className
  );

  const statusClasses = twMerge(
    'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
    statusSize,
    status && statusStyles[status]
  );

  const renderContent = () => {
    if (src) {
      return (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${squared ? 'rounded-lg' : 'rounded-full'}`}
        />
      );
    }

    if (initials) {
      return (
        <span className={`${font} font-medium text-gray-600`}>{getInitialsFromName(initials)}</span>
      );
    }

    return (
      <svg className="w-1/2 h-1/2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  return (
    <div className={containerClasses}>
      {renderContent()}
      {status && <span className={statusClasses} />}
    </div>
  );
};
