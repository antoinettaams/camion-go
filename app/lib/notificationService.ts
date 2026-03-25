// app/lib/notificationService.ts

interface NotificationData {
  userId: string;
  userEmail: string;
  userName: string;
  type: string;
  title: string;
  message: string;
  link: string;
  preferences: {
    email: boolean;
    push: boolean;
  };
}

export class NotificationService {
  
  static async sendNotification(data: NotificationData) {
    const { preferences, userEmail, userName, title, message, link, type, userId } = data;
    
    const notifications = [];
    
    // 1. Notification dans l'app (toujours envoyée)
    notifications.push(this.sendInAppNotification(data));
    
    // 2. Email si l'utilisateur a activé les emails
    if (preferences.email && userEmail) {
      notifications.push(this.sendEmail({
        to: userEmail,
        toName: userName,
        subject: title,
        message: message,
        link: link,
        type: type
      }));
    }
    
    await Promise.allSettled(notifications);
  }
  
  private static async sendInAppNotification(data: NotificationData) {
    const { userId, type, title, message, link } = data;
    const { db } = await import('@/app/lib/firebase');
    const { collection, addDoc } = await import('firebase/firestore');
    
    if (!db) return;
    
    try {
      await addDoc(collection(db, 'notifications'), {
        userId,
        type,
        title,
        message,
        link,
        read: false,
        createdAt: new Date().toISOString()
      });
      console.log(`✅ Notification in-app envoyée à ${userId}`);
    } catch (error) {
      console.error("❌ Erreur notification in-app:", error);
    }
  }
  
  private static async sendEmail(data: {
    to: string;
    toName: string;
    subject: string;
    message: string;
    link: string;
    type: string;
  }) {
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
    
    if (!endpoint) {
      console.error("❌ Formspree endpoint non configuré");
      return;
    }
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: data.to,
          name: data.toName,
          subject: data.subject,
          message: `
${data.message}

---
Type: ${data.type}
Lien: ${data.link}
Date: ${new Date().toLocaleString('fr-FR')}
          `,
          _replyto: data.to
        })
      });
      
      if (response.ok) {
        console.log(`✅ Email envoyé à ${data.to}: ${data.subject}`);
      } else {
        const error = await response.json();
        console.error("❌ Erreur envoi email:", error);
      }
    } catch (error) {
      console.error("❌ Erreur envoi email:", error);
    }
  }
}