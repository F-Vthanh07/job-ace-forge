/**
 * Enhanced Notification System
 * Professional, user-friendly notifications with icons and actions
 */

import { notification } from "antd";
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  RocketOutlined,
  SafetyOutlined,
  ThunderboltOutlined
} from "@ant-design/icons";
import React from "react";
import { getFriendlyErrorMessage } from "./errorHandler";

type NotificationType = "success" | "error" | "info" | "warning";

interface NotifyOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Configure notification globally
notification.config({
  placement: "topRight",
  top: 24,
  duration: 4.5,
  maxCount: 3,
});

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
    duration: config.duration || 4.5,
    icon: React.createElement(CheckCircleOutlined, { 
      style: { color: '#52c41a' }
    }),
    style: {
      borderLeft: '4px solid #52c41a',
      backgroundColor: '#f6ffed',
      borderRadius: '8px',
    },
    btn: config.action ? React.createElement('button', {
      onClick: config.action.onClick,
      style: {
        background: '#52c41a',
        color: 'white',
        border: 'none',
        padding: '6px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
      }
    }, config.action.label) : undefined,
  });
}

/**
 * Show error notification with user-friendly message
 */
export function notifyError(error: unknown, customTitle?: string, action?: NotifyOptions['action']) {
  const friendlyMessage = typeof error === 'string' ? error : getFriendlyErrorMessage(error);

  notification.error({
    message: customTitle !== undefined ? customTitle : "Có lỗi xảy ra",
    description: friendlyMessage,
    duration: 6,
    icon: React.createElement(CloseCircleOutlined, { 
      style: { color: '#ff4d4f' }
    }),
    style: {
      borderLeft: '4px solid #ff4d4f',
      backgroundColor: '#fff2f0',
      borderRadius: '8px',
    },
    btn: action ? React.createElement('button', {
      onClick: action.onClick,
      style: {
        background: '#ff4d4f',
        color: 'white',
        border: 'none',
        padding: '6px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
      }
    }, action.label) : undefined,
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
    duration: config.duration || 5,
    icon: React.createElement(ExclamationCircleOutlined, { 
      style: { color: '#faad14' }
    }),
    style: {
      borderLeft: '4px solid #faad14',
      backgroundColor: '#fffbe6',
      borderRadius: '8px',
    },
    btn: config.action ? React.createElement('button', {
      onClick: config.action.onClick,
      style: {
        background: '#faad14',
        color: 'white',
        border: 'none',
        padding: '6px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
      }
    }, config.action.label) : undefined,
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
    duration: config.duration || 4.5,
    icon: React.createElement(InfoCircleOutlined, { 
      style: { color: '#1890ff' }
    }),
    style: {
      borderLeft: '4px solid #1890ff',
      backgroundColor: '#e6f7ff',
      borderRadius: '8px',
    },
    btn: config.action ? React.createElement('button', {
      onClick: config.action.onClick,
      style: {
        background: '#1890ff',
        color: 'white',
        border: 'none',
        padding: '6px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
      }
    }, config.action.label) : undefined,
  });
}

/**
 * Special notification types
 */

// Authentication success
export function notifyAuthSuccess(userName?: string) {
  notification.success({
    message: "Chào mừng!",
    description: userName ? `Xin chào ${userName}, bạn đã đăng nhập thành công` : "Bạn đã đăng nhập thành công",
    duration: 3.5,
    icon: React.createElement(RocketOutlined, { 
      style: { color: '#52c41a' }
    }),
    style: {
      borderLeft: '4px solid #52c41a',
      backgroundColor: '#f6ffed',
      borderRadius: '8px',
    },
  });
}

// Login required notification
export function notifyLoginRequired() {
  notification.warning({
    message: "Cần đăng nhập",
    description: "Vui lòng đăng nhập để tiếp tục",
    duration: 4,
    icon: React.createElement(SafetyOutlined, { 
      style: { color: '#faad14' }
    }),
    style: {
      borderLeft: '4px solid #faad14',
      backgroundColor: '#fffbe6',
      borderRadius: '8px',
    },
  });
}

// Permission denied
export function notifyPermissionDenied(message?: string) {
  notification.error({
    message: "Không có quyền truy cập",
    description: message || "Bạn không có quyền thực hiện thao tác này",
    duration: 4.5,
    icon: React.createElement(CloseCircleOutlined, { 
      style: { color: '#ff4d4f' }
    }),
    style: {
      borderLeft: '4px solid #ff4d4f',
      backgroundColor: '#fff2f0',
      borderRadius: '8px',
    },
  });
}

// Action completed
export function notifyActionComplete(action: string) {
  notification.success({
    message: "Hoàn thành!",
    description: `${action} đã thực hiện thành công`,
    duration: 3,
    icon: React.createElement(ThunderboltOutlined, { 
      style: { color: '#52c41a' }
    }),
    style: {
      borderLeft: '4px solid #52c41a',
      backgroundColor: '#f6ffed',
      borderRadius: '8px',
    },
  });
}

// Network error
export function notifyNetworkError() {
  notification.error({
    message: "Lỗi kết nối",
    description: "Vui lòng kiểm tra kết nối mạng và thử lại",
    duration: 5,
    icon: React.createElement(CloseCircleOutlined, { 
      style: { color: '#ff4d4f' }
    }),
    style: {
      borderLeft: '4px solid #ff4d4f',
      backgroundColor: '#fff2f0',
      borderRadius: '8px',
    },
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
    message: 'Yêu cầu nâng cấp Premium',
    description: 'Premium đã hết hạn hoặc không tồn tại. Vui lòng nâng cấp gói Premium để tiếp tục sử dụng tính năng AI Review CV và các tính năng cao cấp khác!',
    duration: 5, // Auto close after 5 seconds
    placement: "top",
    key,
    style: {
      width: 500,
      marginTop: 24,
    },
  });
}
