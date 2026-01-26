/**
 * Error Handler Utility
 * Converts raw API errors to user-friendly messages
 */

// Map of common error patterns to friendly messages
const ERROR_MESSAGES: Record<string, string> = {
  // Authentication errors
  "invalid credentials": "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.",
  "user not found": "Tài khoản không tồn tại. Vui lòng kiểm tra lại email.",
  "email already exists": "Email này đã được đăng ký. Vui lòng sử dụng email khác.",
  "email already registered": "Email này đã được đăng ký. Vui lòng sử dụng email khác.",
  "invalid email": "Email không hợp lệ. Vui lòng kiểm tra lại.",
  "password too weak": "Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.",
  "invalid password": "Mật khẩu không đúng. Vui lòng thử lại.",
  "token expired": "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  "invalid token": "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.",
  "unauthorized": "Bạn cần đăng nhập để thực hiện thao tác này.",
  "access denied": "Bạn không có quyền thực hiện thao tác này.",
  "không tìm thấy id người dùng": "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.",

  // Company registration errors
  "company already exists": "Công ty đã được đăng ký. Vui lòng kiểm tra lại.",
  "invalid tax code": "Mã số thuế không hợp lệ. Vui lòng kiểm tra lại.",
  "tax code already exists": "Mã số thuế đã được sử dụng bởi công ty khác.",
  "invalid invite code": "Mã mời không hợp lệ hoặc đã hết hạn.",

  // Validation errors
  "required field": "Vui lòng điền đầy đủ thông tin bắt buộc.",
  "invalid format": "Định dạng dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
  "field too long": "Dữ liệu nhập vào quá dài. Vui lòng rút ngắn lại.",
  "field too short": "Dữ liệu nhập vào quá ngắn. Vui lòng nhập thêm.",

  // Network errors
  "network error": "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.",
  "timeout": "Kết nối quá chậm. Vui lòng thử lại sau.",
  "server error": "Hệ thống đang bận. Vui lòng thử lại sau ít phút.",
  "internal server error": "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.",

  // Generic errors
  "something went wrong": "Đã có lỗi xảy ra. Vui lòng thử lại.",
  "try again": "Đã có lỗi xảy ra. Vui lòng thử lại.",
};

// Default friendly message
const DEFAULT_ERROR_MESSAGE = "Đã có lỗi xảy ra. Vui lòng thử lại sau.";

/**
 * Check if error message looks like a raw/technical error
 */
function isRawError(message: string): boolean {
  const rawErrorPatterns = [
    /^System\./i,
    /Exception:/i,
    /at\s+\w+\.\w+/,
    /\.cs:line\s+\d+/,
    /stack\s*trace/i,
    /null\s*reference/i,
    /Microsoft\./i,
    /\.dll/i,
    /\w+Controller\./i,
    /\w+Service\./i,
    /AspNetCore/i,
    /EntityFramework/i,
  ];

  return rawErrorPatterns.some(pattern => pattern.test(message));
}

/**
 * Extract meaningful error from raw error message
 */
function extractErrorMessage(rawMessage: string): string | null {
  // Try to extract Vietnamese message from raw error
  const vietnameseMatch = rawMessage.match(/[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+[.!?]/);
  if (vietnameseMatch) {
    return vietnameseMatch[0];
  }

  // Try to extract message after common prefixes
  const prefixMatch = rawMessage.match(/(?:Exception:|Error:|Message:)\s*(.+?)(?:\s+at\s+|$)/i);
  if (prefixMatch) {
    return prefixMatch[1].trim();
  }

  return null;
}

/**
 * Convert raw API error to user-friendly message
 */
export function getFriendlyErrorMessage(error: string | Error | unknown): string {
  let message = "";

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String((error as { message: unknown }).message);
  } else {
    return DEFAULT_ERROR_MESSAGE;
  }

  // If empty message
  if (!message || message.trim() === "") {
    return DEFAULT_ERROR_MESSAGE;
  }

  const lowerMessage = message.toLowerCase();

  // Check if it's a raw technical error
  if (isRawError(message)) {
    // Try to extract meaningful part
    const extracted = extractErrorMessage(message);
    if (extracted) {
      // Check if extracted message matches known errors
      const extractedLower = extracted.toLowerCase();
      for (const [pattern, friendlyMessage] of Object.entries(ERROR_MESSAGES)) {
        if (extractedLower.includes(pattern)) {
          return friendlyMessage;
        }
      }
      return extracted;
    }
    return DEFAULT_ERROR_MESSAGE;
  }

  // Check against known error patterns
  for (const [pattern, friendlyMessage] of Object.entries(ERROR_MESSAGES)) {
    if (lowerMessage.includes(pattern)) {
      return friendlyMessage;
    }
  }

  // If message is already user-friendly (short and readable), return it
  if (message.length < 200 && !isRawError(message)) {
    return message;
  }

  return DEFAULT_ERROR_MESSAGE;
}

/**
 * Error types for different scenarios
 */
export type ErrorType = "error" | "warning" | "info";

/**
 * Get error type based on error message
 */
export function getErrorType(message: string): ErrorType {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("đã tồn tại") ||
    lowerMessage.includes("already exists") ||
    lowerMessage.includes("hết hạn") ||
    lowerMessage.includes("expired")
  ) {
    return "warning";
  }

  return "error";
}
