export function formatLastSeenTimestamp(timestamp) {
    const date = new Date(timestamp);
    const currentDate = new Date();
    const difference = currentDate - date;

    if (difference > 31536000000) {
        return `Last seen ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } else if (difference > 86400000) {
        return `Last seen ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
    } else if (difference > 3600000) {
        return `Last seen at ${date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' })}`;
    } else if (difference > 300000) {
        return `Last seen ${Math.floor(difference / 60000)} minutes ago`;
    } else {
        return 'Online';
    }
};

export function formatTimestampForChatContainer(timestamp) {
    const date = new Date(timestamp);
    const currentDate = new Date();
    const difference = currentDate - date;

    if (difference > 31536000000) {
        // dd/mmm/yyyy if the message was sent more than a year ago
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } else if (difference > 86400000) {
        // dd/mmm if the message was sent less than a year ago but more than a day ago
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    } else {
        // hh:mm if the message was sent less than a day ago
        return date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });
    }
};

export function formatCreationTimestamp(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.getDate() === today.getDate()
        && date.getMonth() === today.getMonth()
        && date.getFullYear() === today.getFullYear();

    const isYesterday = date.getDate() === yesterday.getDate()
        && date.getMonth() === yesterday.getMonth()
        && date.getFullYear() === yesterday.getFullYear();

    if (isToday) {
        return `Today at ${date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' })}`;
    } else if (isYesterday) {
        return `Yesterday at ${date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' })}`;
    } else if (date.getFullYear() === today.getFullYear()) {
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
    }

    return date.toLocaleDateString('en-GB', { year: 'numeric', day: 'numeric', month: 'long' });
};