/**
 * Add to Calendar functionality
 * Generates calendar links for various calendar services
 * 
 * Usage in HTML:
 * <div class="topbar__calendar" 
 *      data-event-title="Event Title"
 *      data-event-description="Event Description"
 *      data-event-location="Event Location"
 *      data-event-start="2025-06-03T09:00:00"
 *      data-event-end="2025-06-05T18:00:00"
 *      data-event-timezone="Asia/Baku">
 *   <button>...</button>
 *   <ul>
 *     <li><a data-calendar="google">Google Calendar</a></li>
 *     ...
 *   </ul>
 * </div>
 */

export function initAddToCalendar() {
  // Get all calendar containers
  const calendarContainers = document.querySelectorAll('.topbar__calendar');

  calendarContainers.forEach(container => {
    // Get event details from data attributes
    const eventDetails = {
      title: container.dataset.eventTitle || 'Event',
      description: container.dataset.eventDescription || '',
      location: container.dataset.eventLocation || '',
      startDate: container.dataset.eventStart || '',
      endDate: container.dataset.eventEnd || '',
      timezone: container.dataset.eventTimezone || 'UTC'
    };

    // Get calendar buttons within this container
    const calendarButtons = container.querySelectorAll('[data-calendar]');

    calendarButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const calendarType = button.getAttribute('data-calendar');
        const calendarUrl = generateCalendarUrl(calendarType, eventDetails);
        
        if (calendarUrl) {
          window.open(calendarUrl, '_blank');
        }
      });
    });
  });
}

/**
 * Generate calendar URL based on calendar type
 */
function generateCalendarUrl(type, event) {
  const startDate = formatDate(event.startDate, type);
  const endDate = formatDate(event.endDate, type);
  
  switch (type) {
    case 'google':
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&ctz=${event.timezone}`;
    
    case 'outlook':
      return `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&startdt=${event.startDate}&enddt=${event.endDate}`;
    
    case 'outlookcom':
      return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&startdt=${event.startDate}&enddt=${event.endDate}&path=/calendar/action/compose`;
    
    case 'yahoo':
      return `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(event.title)}&st=${startDate}&et=${endDate}&desc=${encodeURIComponent(event.description)}&in_loc=${encodeURIComponent(event.location)}`;
    
    case 'ical':
      return generateICalFile(event);
    
    default:
      return null;
  }
}

/**
 * Format date for different calendar services
 */
function formatDate(dateString, calendarType) {
  const date = new Date(dateString);
  
  if (calendarType === 'google' || calendarType === 'yahoo') {
    // Format: YYYYMMDDTHHmmssZ
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }
  
  // Default ISO format
  return date.toISOString();
}

/**
 * Generate iCal file for Apple Calendar and other iCal-compatible apps
 */
function generateICalFile(event) {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  
  const formatICalDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ADEX//Event//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatICalDate(startDate)}`,
    `DTEND:${formatICalDate(endDate)}`,
    `DTSTAMP:${formatICalDate(new Date())}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    `UID:adex-2025-${Date.now()}@adex.az`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  // Create blob and download
  const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'adex-2025.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
  
  return null; // Return null as we're triggering download instead
}
