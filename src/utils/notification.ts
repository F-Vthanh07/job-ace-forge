/**
 * Notification Utility using Ant Design
 * Provides user-friendly notifications
 */

import { notification } from "antd";
import { getFriendlyErrorMessage } from "./errorHandler";

type NotificationType = "success" | "error" | "info" | "warning";

interface NotifyOptions {
  title?: string;
  description?: string;
  duration?: number;
}

/**
 * Show success notification
 */
export function notifySuccess(options: NotifyOptions | string) {
  const config = typeof options === "string"
    ? { title: "Thành công", description: options }
    : options;

  notification.success({
    message: config.title || "Thành công",
    description: config.description,
    duration: config.duration || 4,
    placement: "topRight",
  });
}

/**
 * Show error notification with user-friendly message
 */
export function notifyError(error: string | Error | unknown, customTitle?: string) {
  const friendlyMessage = getFriendlyErrorMessage(error);

  notification.error({
    message: customTitle || "Có lỗi xảy ra",
    description: friendlyMessage,
    duration: 5,
    placement: "topRight",
  });
}

/**
 * Show warning notification
 */
export function notifyWarning(options: NotifyOptions | string) {
  const config = typeof options === "string"
    ? { title: "Cảnh báo", description: options }
    : options;

  notification.warning({
    message: config.title || "Cảnh báo",
    description: config.description,
    duration: config.duration || 4,
    placement: "topRight",
  });
}

/**
 * Show info notification
 */
export function notifyInfo(options: NotifyOptions | string) {
  const config = typeof options === "string"
    ? { title: "Thông báo", description: options }
    : options;

  notification.info({
    message: config.title || "Thông báo",
    description: config.description,
    duration: config.duration || 4,
    placement: "topRight",
  });
}

/**
 * Generic notify function
 */
export function notify(type: NotificationType, options: NotifyOptions | string) {
  switch (type) {
    case "success":
      notifySuccess(options);
      break;
    case "error":
      notifyError(typeof options === "string" ? options : options.description || "");
      break;
    case "warning":
      notifyWarning(options);
      break;
    case "info":
      notifyInfo(options);
      break;
  }
}
