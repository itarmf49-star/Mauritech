import { prisma } from "@/lib/prisma";
import { sendMail, isMailConfigured } from "@/lib/mail";
import { siteConfig } from "@/lib/content";
import type { NotificationType } from "@prisma/client";

export interface CreateNotificationInput {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, unknown>;
}

export async function createNotification(input: CreateNotificationInput): Promise<string> {
  // Get user's notification preferences
  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    include: { notificationPreference: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Create default notification preferences if they don't exist
  let preferences = user.notificationPreference;
  if (!preferences) {
    preferences = await prisma.notificationPreference.create({
      data: { userId: input.userId },
    });
  }

  // Check if user wants this type of notification
  const shouldNotify = checkNotificationEnabled(input.type, preferences);
  if (!shouldNotify) {
    return "skipped";
  }

  // Create the notification in database
  const notification = await prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      link: input.link,
      metadata: input.metadata as any,
    },
  });

  // Send email if enabled
  if (preferences.emailEnabled && isMailConfigured()) {
    await sendNotificationEmail(user.email, input.type, input.title, input.message, input.link);
    
    // Update notification to reflect email was sent
    await prisma.notification.update({
      where: { id: notification.id },
      data: { emailSent: true, emailSentAt: new Date() },
    });
  }

  return notification.id;
}

function checkNotificationEnabled(type: NotificationType, preferences: any): boolean {
  if (!preferences.inAppEnabled) return false;

  switch (type) {
    case "INVOICE_CREATED":
    case "INVOICE_DUE":
    case "INVOICE_PAID":
    case "INVOICE_OVERDUE":
      return preferences.invoiceNotifications;
    case "TICKET_CREATED":
    case "TICKET_UPDATED":
    case "TICKET_CLOSED":
      return preferences.ticketNotifications;
    case "PROJECT_CREATED":
    case "PROJECT_UPDATED":
    case "PROJECT_COMPLETED":
      return preferences.projectNotifications;
    case "SYSTEM_ANNOUNCEMENT":
      return preferences.systemNotifications;
    default:
      return true;
  }
}

async function sendNotificationEmail(
  to: string,
  type: NotificationType,
  title: string,
  message: string,
  link?: string
): Promise<void> {
  const subject = `[${siteConfig.name}] ${title}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${siteConfig.name}</h1>
      </div>
      <div class="content">
        <h2>${title}</h2>
        <p>${message}</p>
        ${link ? `<a href="${link}" class="button">View Details</a>` : ''}
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.</p>
        <p>You received this email because you have an account with ${siteConfig.name}.</p>
      </div>
    </body>
    </html>
  `;

  const text = `${title}\n\n${message}\n\n${link ? `View details: ${link}` : ''}\n\n— ${siteConfig.name}`;

  await sendMail({ to, subject, text, html });
}

export async function getUserNotifications(userId: number, limit = 20) {
  try {
    if (!userId || isNaN(userId)) return [];
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function getUnreadNotificationCount(userId: number): Promise<number> {
  try {
    if (!userId || isNaN(userId)) return 0;
    return prisma.notification.count({
      where: { userId, status: "UNREAD" },
    });
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    return 0;
  }
}

export async function markNotificationAsRead(notificationId: string, userId: number): Promise<void> {
  try {
    if (!userId || isNaN(userId)) return;
    await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { status: "READ", readAt: new Date() },
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}

export async function markAllNotificationsAsRead(userId: number): Promise<void> {
  try {
    if (!userId || isNaN(userId)) return;
    await prisma.notification.updateMany({
      where: { userId, status: "UNREAD" },
      data: { status: "READ", readAt: new Date() },
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
  }
}

export async function archiveNotification(notificationId: string, userId: number): Promise<void> {
  try {
    if (!userId || isNaN(userId)) return;
    await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { status: "ARCHIVED" },
    });
  } catch (error) {
    console.error("Error archiving notification:", error);
  }
}

// Specific notification creators for common events
export async function notifyInvoiceCreated(userId: number, invoiceId: string, amount: number): Promise<void> {
  await createNotification({
    userId,
    type: "INVOICE_CREATED",
    title: "New Invoice Created",
    message: `A new invoice for ${amount} MRU has been created for your account.`,
    link: `/portal/invoices/${invoiceId}`,
    metadata: { invoiceId, amount },
  });
}

export async function notifyInvoiceDue(userId: number, invoiceId: string, amount: number, dueDate: Date): Promise<void> {
  await createNotification({
    userId,
    type: "INVOICE_DUE",
    title: "Invoice Payment Due",
    message: `Your invoice for ${amount} MRU is due on ${dueDate.toLocaleDateString()}.`,
    link: `/portal/invoices/${invoiceId}`,
    metadata: { invoiceId, amount, dueDate: dueDate.toISOString() },
  });
}

export async function notifyInvoicePaid(userId: number, invoiceId: string, amount: number): Promise<void> {
  await createNotification({
    userId,
    type: "INVOICE_PAID",
    title: "Invoice Payment Received",
    message: `Your payment of ${amount} MRU has been received. Thank you!`,
    link: `/portal/invoices/${invoiceId}`,
    metadata: { invoiceId, amount },
  });
}

export async function notifyTicketCreated(userId: number, ticketId: string, title: string): Promise<void> {
  await createNotification({
    userId,
    type: "TICKET_CREATED",
    title: "Support Ticket Created",
    message: `Your support ticket "${title}" has been created and will be reviewed shortly.`,
    link: `/portal/tickets/${ticketId}`,
    metadata: { ticketId, title },
  });
}

export async function notifyTicketUpdated(userId: number, ticketId: string, update: string): Promise<void> {
  await createNotification({
    userId,
    type: "TICKET_UPDATED",
    title: "Support Ticket Updated",
    message: `Your support ticket has been updated: ${update}`,
    link: `/portal/tickets/${ticketId}`,
    metadata: { ticketId, update },
  });
}

export async function notifyTicketClosed(userId: number, ticketId: string): Promise<void> {
  await createNotification({
    userId,
    type: "TICKET_CLOSED",
    title: "Support Ticket Closed",
    message: "Your support ticket has been marked as resolved.",
    link: `/portal/tickets/${ticketId}`,
    metadata: { ticketId },
  });
}

export async function notifyProjectCreated(userId: number, projectId: string, title: string): Promise<void> {
  await createNotification({
    userId,
    type: "PROJECT_CREATED",
    title: "Project Started",
    message: `Your project "${title}" has been started.`,
    link: `/portal/projects/${projectId}`,
    metadata: { projectId, title },
  });
}

export async function notifyProjectUpdated(userId: number, projectId: string, update: string): Promise<void> {
  await createNotification({
    userId,
    type: "PROJECT_UPDATED",
    title: "Project Updated",
    message: `Your project has been updated: ${update}`,
    link: `/portal/projects/${projectId}`,
    metadata: { projectId, update },
  });
}

export async function notifyProjectCompleted(userId: number, projectId: string, title: string): Promise<void> {
  await createNotification({
    userId,
    type: "PROJECT_COMPLETED",
    title: "Project Completed",
    message: `Congratulations! Your project "${title}" has been completed.`,
    link: `/portal/projects/${projectId}`,
    metadata: { projectId, title },
  });
}