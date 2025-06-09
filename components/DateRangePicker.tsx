'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

type DateRangeFilterProps = {
  value: DateRange;
  onChange: (range: DateRange) => void;
};

export default function DateRangeFilter({
  value,
  onChange,
}: DateRangeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [date] = useState<DateRange>({
    from: searchParams.get('createdFrom')
      ? parseISO(searchParams.get('createdFrom')!)
      : undefined,
    to: searchParams.get('createdTo')
      ? parseISO(searchParams.get('createdTo')!)
      : undefined,
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (date.from) {
      params.set('createdFrom', format(date.from, 'yyyy-MM-dd'));
    } else {
      params.delete('createdFrom');
    }

    if (date.to) {
      params.set('createdTo', format(date.to, 'yyyy-MM-dd'));
    } else {
      params.delete('createdTo');
    }

    router.push(`/posts?${params.toString()}`);
  }, [date, router, searchParams]);

  // const handleReset = () => {
  //   setDate({ from: undefined, to: undefined });
  //   const params = new URLSearchParams(searchParams.toString());
  //   params.delete('createdFrom');
  //   params.delete('createdTo');
  //   router.push(`/posts?${params.toString()}`);
  // };

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[250px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value.from ? (
              value.to ? (
                <>
                  {format(value.from, 'LLL dd, y')} -{' '}
                  {format(value.to, 'LLL dd, y')}
                </>
              ) : (
                format(value.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value.from}
            selected={value}
            onSelect={(range) => onChange(range as DateRange)}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {(value.from || value.to) && (
        <XCircle
          size={18}
          className="text-red-400 -ml-1 cursor-pointer"
          onClick={() => onChange({ from: undefined, to: undefined })}
        />
      )}
    </div>
  );
}
