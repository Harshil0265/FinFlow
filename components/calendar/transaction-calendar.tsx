'use client';

import { useState, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar';
import moment from 'moment';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ClientOnly } from '@/components/providers/client-only';

const localizer = momentLocalizer(moment);

interface Transaction {
  _id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMethod: string;
  date: Date;
  description?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Transaction;
}

interface TransactionCalendarProps {
  transactions: Transaction[];
  onDateSelect?: (date: Date) => void;
  onEventSelect?: (transaction: Transaction) => void;
}

export function TransactionCalendar({ 
  transactions, 
  onDateSelect, 
  onEventSelect 
}: TransactionCalendarProps) {
  const { format: formatUserCurrency } = useCurrency();
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Convert transactions to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return transactions.map(transaction => ({
      id: transaction._id,
      title: `${transaction.type === 'income' ? '+' : '-'}${formatUserCurrency(transaction.amount)} - ${transaction.title}`,
      start: new Date(transaction.date),
      end: new Date(transaction.date),
      resource: transaction,
    }));
  }, [transactions]);

  // Custom event style getter
  const eventStyleGetter = useCallback((event: any) => {
    const isIncome = event.resource.type === 'income';
    return {
      style: {
        backgroundColor: isIncome ? '#10b981' : '#ef4444',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '2px 4px',
      },
    };
  }, []);

  // Handle event selection
  const handleSelectEvent = useCallback((event: any) => {
    setSelectedEvent(event.resource);
    setIsModalOpen(true);
    onEventSelect?.(event.resource);
  }, [onEventSelect]);

  // Handle date selection
  const handleSelectSlot = useCallback(({ start }: { start: Date }) => {
    onDateSelect?.(start);
  }, [onDateSelect]);

  // Custom toolbar
  const CustomToolbar = ({ label, onNavigate, onView }: any) => (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate('PREV')}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold min-w-[200px] text-center">{label}</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate('NEXT')}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant={currentView === Views.MONTH ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setCurrentView(Views.MONTH);
            onView(Views.MONTH);
          }}
        >
          Month
        </Button>
        <Button
          variant={currentView === Views.WEEK ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setCurrentView(Views.WEEK);
            onView(Views.WEEK);
          }}
        >
          Week
        </Button>
        <Button
          variant={currentView === Views.DAY ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setCurrentView(Views.DAY);
            onView(Views.DAY);
          }}
        >
          Day
        </Button>
      </div>
    </div>
  );

  // Custom day cell wrapper
  const CustomDayWrapper = ({ children, value }: any) => {
    const dayTransactions = transactions.filter(
      t => moment(t.date).isSame(moment(value), 'day')
    );
    
    const dayTotal = dayTransactions.reduce((sum, t) => {
      return sum + (t.type === 'income' ? t.amount : -t.amount);
    }, 0);

    return (
      <div className="relative h-full">
        {children}
        {dayTransactions.length > 0 && (
          <div className="absolute bottom-1 right-1 text-xs">
            <span className={`px-1 py-0.5 rounded text-white text-[10px] ${
              dayTotal >= 0 ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {formatUserCurrency(Math.abs(dayTotal))}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <ClientOnly>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-background border rounded-lg p-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          view={currentView}
          onView={setCurrentView}
          date={currentDate}
          onNavigate={setCurrentDate}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CustomToolbar,
            dateCellWrapper: CustomDayWrapper,
          }}
          formats={{
            eventTimeRangeFormat: () => '',
            agendaTimeRangeFormat: () => '',
          }}
          className="custom-calendar"
        />
      </div>

      {/* Transaction Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Transaction Details"
      >
        {selectedEvent && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedEvent.title}</span>
                <span className={`text-lg font-bold ${
                  selectedEvent.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedEvent.type === 'income' ? '+' : '-'}
                  {formatUserCurrency(selectedEvent.amount)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="capitalize">{selectedEvent.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p>{selectedEvent.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                  <p>{selectedEvent.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{formatDate(new Date(selectedEvent.date))}</p>
                </div>
              </div>
              
              {selectedEvent.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm">{selectedEvent.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </Modal>

      <style jsx global>{`
        .custom-calendar {
          font-family: inherit;
        }
        
        .rbc-calendar {
          background: transparent;
        }
        
        .rbc-header {
          background: hsl(var(--muted));
          color: hsl(var(--muted-foreground));
          border-bottom: 1px solid hsl(var(--border));
          padding: 8px;
          font-weight: 500;
        }
        
        .rbc-date-cell {
          padding: 4px;
        }
        
        .rbc-today {
          background-color: hsl(var(--accent));
        }
        
        .rbc-off-range-bg {
          background-color: hsl(var(--muted) / 0.3);
        }
        
        .rbc-event {
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 11px;
          line-height: 1.2;
        }
        
        .rbc-slot-selection {
          background-color: hsl(var(--primary) / 0.2);
        }
        
        .rbc-day-bg:hover {
          background-color: hsl(var(--accent) / 0.5);
        }
        
        .rbc-month-view {
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          overflow: hidden;
        }
        
        .rbc-day-slot .rbc-time-slot {
          border-top: 1px solid hsl(var(--border));
        }
        
        .rbc-timeslot-group {
          border-bottom: 1px solid hsl(var(--border));
        }
        
        .rbc-time-view {
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          overflow: hidden;
        }
        
        .rbc-time-header {
          border-bottom: 1px solid hsl(var(--border));
        }
        
        .rbc-time-content {
          border-top: none;
        }
        
        .rbc-allday-cell {
          background: hsl(var(--muted));
        }
        
        .rbc-row-bg .rbc-day-bg {
          border-left: 1px solid hsl(var(--border));
        }
        
        .rbc-month-row {
          border-bottom: 1px solid hsl(var(--border));
        }
      `}</style>
    </motion.div>
    </ClientOnly>
  );
}