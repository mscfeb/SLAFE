import { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Button,
  TextField,
  CircularProgress,
  Typography,
} from '@mui/material';
import { AiResponseRenderer } from '@/components/ai/AiResponseRenderer';
import { PageShell } from '@/components/layout/PageShell';
import { useAiChatMutation } from '@/services/aiApi';
import { hideScrollbarSx } from '@/utils/scroll';
import type { AiChatResponse } from '@/types/ai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content?: string;
  response?: AiChatResponse;
}

const PRESETS = [
  'What can you do?',
  'How many orders are delayed?',
  'Which orders are likely to breach SLA?',
  'Which inventory is running low?',
  'Show active alerts',
  'Order status analytics',
];

export function AiInsightsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [aiChat, { isLoading }] = useAiChatMutation();

  const history = messages.filter((m) => m.role === 'user').map((m) => m.content ?? '');

  async function sendMessage(text: string) {
    const question = text.trim();
    if (!question) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const result = await aiChat({ message: question }).unwrap();
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', response: result },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Unable to reach the AI assistant. Please try again.',
        },
      ]);
    }
  }

  return (
    <PageShell
      title="AI Assistant"
      subtitle="Operations assistant for orders, inventory, SLA, alerts, and analytics."
      fixedBody
    >
      <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        <Grid item xs={12} md={3} sx={{ display: 'flex', minHeight: 0 }}>
          <Paper
            sx={{
              p: 2,
              flex: 1,
              minHeight: 0,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              ...hideScrollbarSx,
            }}
          >
            <Typography variant="subtitle2" gutterBottom>Conversation History</Typography>
            <Stack spacing={1}>
              {history.length === 0 && (
                <Typography variant="caption" color="text.secondary">No questions yet</Typography>
              )}
              {history.map((h, i) => (
                <Typography key={i} variant="body2" sx={{ py: 0.5, borderBottom: 1, borderColor: 'divider' }}>
                  {h}
                </Typography>
              ))}
            </Stack>
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>Suggested</Typography>
            <Stack spacing={1}>
              {PRESETS.map((p) => (
                <Button
                  key={p}
                  size="small"
                  variant="outlined"
                  sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                  onClick={() => sendMessage(p)}
                  disabled={isLoading}
                >
                  {p}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9} sx={{ display: 'flex', minHeight: 0 }}>
          <Paper sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', p: 2, ...hideScrollbarSx }}>
              {messages.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
                  Ask a question about orders, SLA risk, inventory, or production workflow.
                </Typography>
              ) : (
                messages.map((m) => (
                  <Box
                    key={m.id}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: m.role === 'user' ? 'action.hover' : 'background.default',
                      border: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {m.role === 'user' ? 'You' : 'Assistant'}
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      {m.response ? (
                        <AiResponseRenderer response={m.response} />
                      ) : (
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                          {m.content}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))
              )}
              {isLoading && (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 2 }}>
                  <CircularProgress size={18} />
                  <Typography variant="body2" color="text.secondary">Analyzing operations data...</Typography>
                </Stack>
              )}
            </Box>
            <Stack direction="row" spacing={1} sx={{ p: 2, borderTop: 1, borderColor: 'divider', flexShrink: 0 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask about orders, SLA, or inventory..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && sendMessage(input)}
              />
              <Button variant="contained" disabled={isLoading} onClick={() => sendMessage(input)}>
                Send
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </PageShell>
  );
}
