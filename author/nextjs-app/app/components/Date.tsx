import { format, isValid, parseISO } from 'date-fns';

export default function DateComponent({
  dateString,
}: {
  dateString?: string | null;
}) {
  if (!dateString) {
    return null;
  }

  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return null;
    }
    return (
      <time dateTime={dateString}>
        {format(date, 'LLLL d, yyyy')}
      </time>
    );
  } catch {
    return null;
  }
}