'use client';

interface Props {
  totalTask: number;
  finishTask: number;
}

const SircleProgressCard = ({ totalTask = 0, finishTask = 0 }: Props) => {
  const percentage = (finishTask / totalTask) * 100;

  return (
    <div className="rounded-sm bg-primary-foreground  ">
      <ProgressCircle
        size="medium"
        percentage={percentage}
        label={`${finishTask}/${totalTask}`}
      />
    </div>
  );
};

export default SircleProgressCard;

type Size = 'small' | 'medium' | 'base' | 'large' | 'extraLarge';

const sizeMap: Record<Size, number> = {
  small: 40,
  medium: 60,
  base: 80,
  large: 100,
  extraLarge: 120,
};

interface ProgressCircleProps {
  percentage: number;
  size?: Size;
  label?: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage = 0,
  size = 'base',
  label,
}) => {
  // Validate input first
  const validSizes: Size[] = ['small', 'medium', 'base', 'large', 'extraLarge'];
  const safeSize: Size = validSizes.includes(size) ? size : 'base';
  const pixelSize = sizeMap[safeSize];

  const safePercentage =
    typeof percentage === 'number' && !isNaN(percentage)
      ? Math.max(0, Math.min(percentage, 100))
      : 0;

  const strokeWidth = pixelSize / 8;
  const radius = pixelSize / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (safePercentage / 100) * circumference;

  //   if (isNaN(strokeDashoffset)) {
  //     console.error('❌ strokeDashoffset NaN:', {
  //       size,
  //       pixelSize,
  //       strokeWidth,
  //       radius,
  //       circumference,
  //       percentage,
  //       safePercentage,
  //       strokeDashoffset,
  //     });
  //   }

  return (
    <div className="relative" style={{ width: pixelSize, height: pixelSize }}>
      <svg className="rotate-[-90deg]" width={pixelSize} height={pixelSize}>
        <circle
          cx={pixelSize / 2}
          cy={pixelSize / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={pixelSize / 2}
          cy={pixelSize / 2}
          r={radius}
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference.toString()}
          strokeDashoffset={strokeDashoffset.toString()} // 👈 cast to string!
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>

      <div
        className={`absolute inset-0 flex items-center justify-center font-bold text-blue-500 ${
          size === 'small'
            ? 'text-xs'
            : size === 'medium'
            ? 'text-sm'
            : size === 'large'
            ? 'text-xl'
            : size === 'extraLarge'
            ? 'text-2xl'
            : 'text-base'
        }`}
      >
        {label ?? `${safePercentage}%`}
      </div>
    </div>
  );
};
