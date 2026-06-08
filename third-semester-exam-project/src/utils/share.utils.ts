export class ShareUtils {

  static getEventUrl(eventId: string) {
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    return `${baseUrl}/events/${eventId}`;
  }

  static whatsapp(eventId: string, title: string) {
    const url = this.getEventUrl(eventId);
    return `https://wa.me/?text=${encodeURIComponent(
      `Check out this event: ${title} - ${url}`
    )}`;
  }

  static twitter(eventId: string, title: string) {
    const url = this.getEventUrl(eventId);
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `Don't miss this event: ${title}`
    )}&url=${encodeURIComponent(url)}`;
  }

  static facebook(eventId: string) {
    const url = this.getEventUrl(eventId);
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
  }

  static linkedin(eventId: string, title: string) {
    const url = this.getEventUrl(eventId);
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
  }
}