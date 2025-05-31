import axios from 'axios';
import { BASE_URL } from '../constants';
import type { FeedbackRequest, FeedbackResponse } from "../types/feedback";

export const sendFeedback = async (data: FeedbackRequest): Promise<FeedbackResponse> => {
  try {
    const response = await axios.post<FeedbackResponse>(BASE_URL + '/api/feedback', {
      phone_number: data.phoneNumber,
      text: data.text
    }, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error('Error sending feedback:', error);
    
    if (axios.isAxiosError(error)) {
      return {
        message: 'Failed to send feedback',
        error: error.response?.data?.error || error.message,
      };
    }
    
    return {
      message: 'Failed to send feedback',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};