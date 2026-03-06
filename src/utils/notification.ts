/**
 * Notification Utility using Ant Design
 * Provides user-friendly notifications
 */

import { notification, Button } from "antd";
import { getFriendlyErrorMessage } from "./errorHandler";
import React from "react";

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

/**
 * Show premium required notification with navigation button
 */
export function notifyPremiumRequired(onNavigate: () => void) {
  const key = `premium-required-${Date.now()}`;
  
  notification.warning({
    message: (
      React.createElement('div', { 
        style: { 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontWeight: 600,
          fontSize: '16px'
        } 
      }, 
        React.createElement('span', { style: { fontSize: '20px' } }, '⚠️'),
        'Tính năng Premium'
      )
    ),
    description: (
      React.createElement('div', { 
        style: { 
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#595959'
        } 
      }, 
        'Gói Premium của bạn đã hết hạn hoặc chưa được kích hoạt. ',
        React.createElement('br'),
        'Vui lòng nâng cấp để tiếp tục sử dụng tính năng AI Review CV và các tính năng cao cấp khác!'
      )
    ),
    duration: 0, // Don't auto close
    placement: "top",
    key,
    style: {
      width: 500,
      marginTop: 24,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      borderRadius: '8px',
      border: '2px solid #faad14'
    },
    btn: React.createElement(
      Button,
      {
        type: "primary",
        size: "middle",
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          fontWeight: 600,
          height: '36px',
          paddingLeft: '20px',
          paddingRight: '20px',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)'
        },
        onClick: () => {
          notification.close(key);
          onNavigate();
        },
      },
      "Nâng cấp ngay"
    ),
    closeIcon: React.createElement('span', { 
      style: { 
        fontSize: '18px',
        color: '#8c8c8c'
      } 
    }, '✕'),
  });
}
