export interface ChatMessage {
  id: string;
  sender: 'you' | 'opponent';
  messageId: string;
  text: string;
  timestamp: number;
}

export const QUICK_MESSAGES = [
  { id: 'good-luck', text: 'Viel Glück! 🍀', emoji: '🍀' },
  { id: 'well-played', text: 'Gut gespielt! 👏', emoji: '👏' },
  { id: 'thanks', text: 'Danke! 😊', emoji: '😊' },
  { id: 'nice-move', text: 'Guter Zug! ⭐', emoji: '⭐' },
  { id: 'oops', text: 'Ups! 😅', emoji: '😅' },
  { id: 'thinking', text: 'Hmm... 🤔', emoji: '🤔' },
  { id: 'rematch', text: 'Revanche? 🔄', emoji: '🔄' },
  { id: 'gg', text: 'GG! 🎮', emoji: '🎮' },
] as const;
