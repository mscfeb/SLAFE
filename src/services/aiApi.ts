import { api } from './baseApi';
import { unwrapApi } from './api';
import type { ApiResponse, TatPrediction } from '@/types/api';
import type { AiChatRequest, AiChatResponse } from '@/types/ai';

interface AtRiskData {
  items: TatPrediction[];
  total: number;
}

export const aiApi = api.injectEndpoints({
  endpoints: (builder) => ({
    aiChat: builder.mutation<AiChatResponse, AiChatRequest>({
      query: (body) => ({
        url: '/api/v1/ai/chat',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<AiChatResponse>) => unwrapApi(response),
    }),
    getAtRiskPredictions: builder.query<AtRiskData, void>({
      query: () => '/api/v1/ai/predictions/at-risk',
      transformResponse: (response: ApiResponse<AtRiskData>) => unwrapApi(response),
      providesTags: [{ type: 'AI', id: 'AT_RISK' }],
    }),
    getOrderPrediction: builder.query<TatPrediction, string>({
      query: (orderId) => `/api/v1/ai/orders/${orderId}/prediction`,
      transformResponse: (response: ApiResponse<TatPrediction>) => unwrapApi(response),
      providesTags: (_r, _e, id) => [{ type: 'AI', id }],
    }),
  }),
});

export const { useAiChatMutation, useGetAtRiskPredictionsQuery, useGetOrderPredictionQuery, useLazyGetOrderPredictionQuery } = aiApi;
