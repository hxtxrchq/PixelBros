/**
 * Standardized SvgIcon component for consistent icon rendering across the site
 * All icons use Heroicons style (stroke-based, 24x24 viewBox)
 */

const SvgIcon = ({ 
  path, 
  className = 'w-6 h-6',
  color = 'currentColor',
  strokeWidth = 2,
  viewBox = '0 0 24 24',
  variant = 'stroke',
}) => {
  const isFill = variant === 'fill';

  return (
    <svg 
      className={className}
      viewBox={viewBox}
      fill={isFill ? color : 'none'}
      stroke={isFill ? 'none' : color}
      strokeWidth={isFill ? undefined : strokeWidth}
      strokeLinecap={isFill ? undefined : 'round'}
      strokeLinejoin={isFill ? undefined : 'round'}
    >
      <path d={path} />
    </svg>
  );
};

export default SvgIcon;
