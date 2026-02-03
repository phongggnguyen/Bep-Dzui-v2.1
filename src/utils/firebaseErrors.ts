// utils/firebaseErrors.ts
export const getVietnameseErrorMessage = (error: any): string => {
  if (!error || !error.code) {
    return 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.';
  }

  const errorMessages: Record<string, string> = {
    // Auth errors - Login
    'auth/user-not-found': 'Tài khoản không tồn tại.',
    'auth/wrong-password': 'Mật khẩu không đúng.',
    'auth/invalid-email': 'Email không hợp lệ.',
    'auth/user-disabled': 'Tài khoản đã bị vô hiệu hóa.',
    'auth/invalid-credential': 'Thông tin đăng nhập không chính xác.',

    // Auth errors - Signup
    'auth/email-already-in-use': 'Email này đã được đăng ký.',
    'auth/weak-password': 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn (tối thiểu 6 ký tự).',
    'auth/operation-not-allowed': 'Chức năng này chưa được kích hoạt.',

    // Auth errors - Password reset
    'auth/expired-action-code': 'Liên kết đã hết hạn. Vui lòng yêu cầu gửi lại.',
    'auth/invalid-action-code': 'Liên kết không hợp lệ hoặc đã được sử dụng.',

    // Network errors
    'auth/network-request-failed': 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.',
    'auth/too-many-requests': 'Bạn đã thử quá nhiều lần. Vui lòng đợi một lúc rồi thử lại.',

    // Other common errors
    'auth/popup-closed-by-user': 'Bạn đã đóng cửa sổ đăng nhập.',
    'auth/cancelled-popup-request': 'Yêu cầu đã bị hủy.',
    'auth/requires-recent-login': 'Vui lòng đăng nhập lại để thực hiện thao tác này.',
  };

  return errorMessages[error.code] || `Lỗi: ${error.message}`;
};
