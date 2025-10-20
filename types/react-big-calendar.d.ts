declare module 'react-big-calendar' {
  import { ComponentType } from 'react';

  export interface Event {
    title: string;
    start: Date;
    end: Date;
    resource?: any;
  }

  export interface CalendarProps {
    events: Event[];
    startAccessor?: string | ((event: Event) => Date);
    endAccessor?: string | ((event: Event) => Date);
    titleAccessor?: string | ((event: Event) => string);
    localizer: any;
    style?: React.CSSProperties;
    views?: string[] | { [key: string]: boolean | ComponentType };
    defaultView?: string;
    view?: string;
    onSelectEvent?: (event: Event) => void;
    onNavigate?: (date: Date) => void;
    onView?: (view: string) => void;
    onSelectSlot?: (slotInfo: any) => void;
    date?: Date;
    components?: any;
    formats?: any;
    messages?: any;
    popup?: boolean;
    popupOffset?: number | { x: number; y: number };
    selectable?: boolean;
    step?: number;
    timeslots?: number;
    min?: Date;
    max?: Date;
    scrollToTime?: Date;
    dayLayoutAlgorithm?: string;
    eventPropGetter?: (event: Event, start: Date, end: Date, isSelected: boolean) => any;
    slotPropGetter?: (date: Date) => any;
    dayPropGetter?: (date: Date) => any;
    showMultiDayTimes?: boolean;
    culture?: string;
    className?: string;
  }

  export const Calendar: ComponentType<CalendarProps>;
  export const Views: {
    MONTH: string;
    WEEK: string;
    WORK_WEEK: string;
    DAY: string;
    AGENDA: string;
  };
  export type View = string;
  export function momentLocalizer(moment: any): any;
}