export type BackendErrorCode =
  | "invalid_credentials"
  | "plan_limit"
  | "invalid_file"
  | "unsupported_file_type"
  | "file_too_large"
  | "validation_error"
  | "rate_limited"
  | "auth_required"
  | "server_error"
  | string;

export function mapErrorCodeToMessage(code?: BackendErrorCode, fallback?: string): string {
  switch (code) {
    case "invalid_credentials":
      return "E-posta veya şifre hatalı.";
    case "plan_limit":
      return "Aylık doküman limitine ulaştın. Planını yükseltip devam edebilirsin.";
    case "invalid_file":
      return "Dosya hatalı veya eksik. Lütfen yeniden yükle.";
    case "unsupported_file_type":
      return "Bu dosya türü desteklenmiyor.";
    case "file_too_large":
      return "Dosya boyutu çok büyük. Daha küçük bir dosya yükleyin.";
    case "validation_error":
      return "Yüklenen belge işlenemedi. İçeriği kontrol edip tekrar deneyin.";
    case "rate_limited":
      return "Çok fazla istek gönderildi. Lütfen biraz bekleyip tekrar deneyin.";
    case "auth_required":
      return "Devam etmek için giriş yapmalısın.";
    case "server_error":
      return "Sunucu hatası. Lütfen tekrar deneyin.";
    default:
      return fallback || "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.";
  }
}
