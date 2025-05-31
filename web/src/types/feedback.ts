export interface FeedbackRequest {
  phoneNumber: string;
  text: string;
}

export interface FeedbackResponse {
  message: string;
  error?: string;
}